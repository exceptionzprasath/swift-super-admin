import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";
import { SuperAdminShell } from "@/components/super-admin-shell";
import { useComplianceRegistry, REGISTRY_KIND_LABEL, type RegistryEntry } from "@/lib/compliance-registry-store";
import { useCompliance } from "@/lib/compliance-store";
import { askComplianceKnowledge } from "@/lib/compliance-knowledge.functions";
import { useServerFn } from "@tanstack/react-start";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Brain, Search, Send, Sparkles, BookOpen } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/super-admin/compliance-knowledge")({
  head: () => ({ meta: [{ title: "Compliance Knowledge Brain · SWIFT AI" }] }),
  component: KnowledgePage,
});

const SUGGESTIONS = [
  "Which Tamil Nadu Factories Act returns are due this half-year?",
  "What forms should I generate when a woman employee joins?",
  "List all registers required under Contract Labour Act.",
  "What is the due date for EPF monthly remittance and its penalty?",
  "Which POSH obligations apply to us and when?",
  "What triggers Form 25B (Accident Register)?",
];

type Msg = { role: "user" | "assistant"; content: string };

function KnowledgePage() {
  const { entries } = useComplianceRegistry();
  const { profile } = useCompliance();
  const ask = useServerFn(askComplianceKnowledge);
  const [q, setQ] = useState("");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return entries.slice(0, 20);
    return entries.filter((e) => {
      const hay = `${e.act} ${e.title} ${e.code ?? ""} ${e.section ?? ""} ${e.rule ?? ""} ${e.state ?? ""} ${e.industry ?? ""} ${e.purpose ?? ""} ${e.aiInstructions ?? ""} ${e.eventKey ?? ""} ${e.authority ?? ""}`.toLowerCase();
      return hay.includes(s);
    }).slice(0, 50);
  }, [entries, q]);

  async function send(text?: string) {
    const content = (text ?? input).trim();
    if (!content || busy) return;
    setInput("");
    const next: Msg[] = [...messages, { role: "user", content }];
    setMessages(next);
    setBusy(true);
    try {
      // Send a lean registry projection to stay under token limits
      const lean = entries.filter((e) => e.enabled).map((e) => ({
        kind: e.kind, act: e.act, code: e.code, title: e.title,
        section: e.section, rule: e.rule, purpose: e.purpose,
        authority: e.authority, frequency: e.frequency,
        dueDay: e.dueDay, dueMonth: e.dueMonth,
        triggerKind: e.triggerKind, eventKey: e.eventKey,
        reminderDays: e.reminderDays, state: e.state, industry: e.industry,
        applicability: e.applicability, version: e.version,
        effectiveDate: e.effectiveDate, expiryDate: e.expiryDate,
        penalty: e.penalty, circular: e.circular,
        amendments: e.amendments.slice(0, 3),
        aiInstructions: e.aiInstructions,
      }));
      const res = await ask({ data: { messages: next, registry: lean, profile } });
      if (res.ok) setMessages([...next, { role: "assistant", content: res.content }]);
      else { toast.error(res.error); setMessages([...next, { role: "assistant", content: `⚠️ ${res.error}` }]); }
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setBusy(false);
      setTimeout(() => scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" }), 50);
    }
  }

  return (
    <SuperAdminShell>
      <div className="mb-4">
        <h1 className="font-display text-2xl font-semibold flex items-center gap-2">
          <Brain className="h-6 w-6 text-primary" /> Compliance Knowledge Brain
        </h1>
        <p className="text-sm text-muted-foreground">
          Single source of truth for every Act, Rule, Section, Form, Register, Return, Notice, Licence, Circular and Amendment.
          SWIFT AI answers using this configurable knowledge base — nothing hardcoded.
          Manage entries in <a className="text-primary underline" href="/super-admin/compliance-registry">Compliance Registry</a>.
        </p>
      </div>

      <div className="grid lg:grid-cols-5 gap-4">
        {/* Knowledge search */}
        <section className="lg:col-span-2 rounded-2xl border bg-card p-3 flex flex-col min-h-[70vh]">
          <div className="flex items-center gap-2 mb-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search acts, forms, sections, states…" className="h-9" />
          </div>
          <div className="text-xs text-muted-foreground mb-2">{results.length} of {entries.length} entries</div>
          <div className="flex-1 overflow-auto divide-y">
            {results.map((e) => (
              <button key={e.id} className="w-full text-left p-2 hover:bg-muted/40 rounded"
                onClick={() => send(`Tell me everything about "${e.title}" (${e.act}${e.code ? ` · ${e.code}` : ""}). Include applicability, timing, forms, penalty and next steps for our company.`)}>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="outline" className="text-xs capitalize">{REGISTRY_KIND_LABEL[e.kind]}</Badge>
                  <span className="text-sm font-medium">{e.title}</span>
                  {e.code && <span className="text-xs text-muted-foreground">{e.code}</span>}
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  {e.act}{e.section ? ` · § ${e.section}` : ""}{e.state ? ` · ${e.state}` : ""} · {e.frequency.replace(/_/g, " ")}
                </div>
              </button>
            ))}
            {results.length === 0 && <div className="p-6 text-center text-sm text-muted-foreground">No match. Ask the AI or add an entry.</div>}
          </div>
        </section>

        {/* AI chat */}
        <section className="lg:col-span-3 rounded-2xl border bg-card p-3 flex flex-col min-h-[70vh]">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="font-medium text-sm">Ask the Compliance Brain</span>
            <Badge variant="outline" className="ml-auto text-xs"><BookOpen className="h-3 w-3 mr-1" />{entries.filter((e) => e.enabled).length} entries loaded</Badge>
          </div>

          {messages.length === 0 && (
            <div className="flex-1 flex flex-col items-center justify-center text-center gap-3 p-6">
              <Brain className="h-10 w-10 text-muted-foreground" />
              <div className="text-sm text-muted-foreground max-w-md">
                Ask any compliance question. The AI reasons over the entire configured registry using your company profile
                (state, headcount, women employees, factory/shop, contract labour).
              </div>
              <div className="grid sm:grid-cols-2 gap-2 w-full max-w-2xl mt-2">
                {SUGGESTIONS.map((s) => (
                  <button key={s} onClick={() => send(s)}
                    className="text-left text-xs rounded-lg border bg-background hover:bg-muted p-2 transition">
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.length > 0 && (
            <div ref={scrollRef} className="flex-1 overflow-auto space-y-3 pr-1">
              {messages.map((m, i) => (
                <div key={i} className={`rounded-lg p-3 text-sm whitespace-pre-wrap ${
                  m.role === "user" ? "bg-primary/10 ml-8" : "bg-muted/40 mr-8"
                }`}>
                  <div className="text-[10px] uppercase tracking-wide text-muted-foreground mb-1">
                    {m.role === "user" ? "You" : "SWIFT AI"}
                  </div>
                  {m.content}
                </div>
              ))}
              {busy && <div className="text-xs text-muted-foreground animate-pulse">Thinking…</div>}
            </div>
          )}

          <div className="mt-3 flex items-end gap-2">
            <Textarea rows={2} value={input}
              placeholder="e.g. Which returns are pending for a 45-employee factory in Tamil Nadu?"
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); void send(); } }}
              className="resize-none" />
            <Button size="icon" disabled={busy || !input.trim()} onClick={() => void send()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </section>
      </div>
    </SuperAdminShell>
  );
}
