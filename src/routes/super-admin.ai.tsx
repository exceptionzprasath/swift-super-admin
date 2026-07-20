import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/lib/auth";
import { useBilling } from "@/lib/billing-store";
import { useStore } from "@/lib/store";
import { useSuperAdmin, computeCompletion } from "@/lib/super-admin-store";
import { SuperAdminShell } from "@/components/super-admin-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { askSwiftAi } from "@/lib/ai.functions";
import { toast } from "sonner";
import { Sparkles, Send, Loader2, Lightbulb } from "lucide-react";
import ReactMarkdown from "react-markdown";

export const Route = createFileRoute("/super-admin/ai")({
  head: () => ({ meta: [{ title: "Super AI · SWIFT" }] }),
  component: SuperAiPage,
});

const SUGGESTIONS = [
  "Which companies have not renewed?",
  "Which companies are not using Payroll?",
  "Which companies have compliance due this month?",
  "Which customers require urgent follow-up?",
  "Which modules generate the highest revenue?",
  "Which companies are growing rapidly?",
];

function SuperAiPage() {
  const nav = useNavigate();
  const { user, isSuperAdmin, loading } = useAuth();
  const demoMode = useStore((st) => st.demoMode);
  const { plans, subscriptions, invoices, coupons, reminderLog } = useBilling();
  const { demoTenants } = useStore();
  const { tickets, touchpoints, checklists } = useSuperAdmin();
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!user && !demoMode) { nav({ to: "/login" }); return; }
    if (!isSuperAdmin && !demoMode) { nav({ to: "/admin" }); return; }
  }, [user, isSuperAdmin, loading, nav]);

  const snapshot = useMemo(() => ({
    role: "super_admin",
    generatedAt: new Date().toISOString(),
    companies: demoTenants.map((t) => ({ id: t.id, name: t.name, plan: t.plan, status: t.status, employees: t.employees, demo: true })),
    plans: plans.map((p) => ({ id: p.id, name: p.name, price: p.basePrice, cycle: p.cycle })),
    subscriptions: subscriptions.map((s) => ({
      tenantId: s.tenantId, planId: s.planId, status: s.status, paymentStatus: s.paymentStatus,
      expiresAt: s.expiresAt, usage: s.usage,
    })),
    invoices: invoices.slice(0, 60).map((i) => ({ tenantId: i.tenantId, total: i.total, status: i.status, issueDate: i.issueDate, kind: i.kind })),
    tickets: tickets.map((t) => ({ tenantId: t.tenantId, subject: t.subject, priority: t.priority, status: t.status })),
    touchpoints: touchpoints.slice(0, 40),
    completion: Object.fromEntries(Object.entries(checklists).map(([k, v]) => [k, computeCompletion(v as any)])),
    activeCoupons: coupons.filter((c) => c.active).map((c) => ({ code: c.code, kind: c.kind, value: c.value })),
    remindersSent: reminderLog.length,
  }), [demoTenants, plans, subscriptions, invoices, tickets, touchpoints, checklists, coupons, reminderLog]);

  const insights = useMemo(() => {
    const list: { icon: any; label: string; tone: "warn" | "info" | "success" }[] = [];
    const upcoming = subscriptions.filter((s) => Date.parse(s.expiresAt) - Date.now() < 15 * 86400_000 && Date.parse(s.expiresAt) > Date.now());
    if (upcoming.length) list.push({ icon: Lightbulb, tone: "warn", label: `${upcoming.length} subscriptions renew within 15 days — trigger reminders.` });
    const failed = invoices.filter((i) => i.status === "overdue");
    if (failed.length) list.push({ icon: Lightbulb, tone: "warn", label: `${failed.length} invoices overdue — assign to collections.` });
    const highTx = tickets.filter((t) => t.priority === "urgent" || t.priority === "high");
    if (highTx.length) list.push({ icon: Lightbulb, tone: "warn", label: `${highTx.length} high/urgent tickets open — escalate to CSM.` });
    const noPayroll = subscriptions.filter((s) => (s.usage.pdfDownloads ?? 0) === 0);
    if (noPayroll.length) list.push({ icon: Lightbulb, tone: "info", label: `${noPayroll.length} companies haven't processed payroll yet — send an activation nudge.` });
    if (list.length === 0) list.push({ icon: Sparkles, tone: "success", label: "Platform looks healthy. No urgent super-admin actions." });
    return list;
  }, [subscriptions, invoices, tickets]);

  async function send(text: string) {
    if (!text.trim() || busy) return;
    const next = [...messages, { role: "user" as const, content: text }];
    setMessages(next); setInput(""); setBusy(true);
    try {
      const res = await askSwiftAi({ data: { messages: next, snapshot } });
      if (res.ok) setMessages([...next, { role: "assistant", content: res.content }]);
      else toast.error(res.error);
    } catch (e: any) {
      toast.error(e.message ?? "AI request failed");
    } finally { setBusy(false); }
  }

  return (
    <SuperAdminShell>
      <div className="flex items-end justify-between gap-3 mb-4">
        <div>
          <h1 className="font-display text-2xl font-semibold flex items-center gap-2"><Sparkles className="h-5 w-5 text-primary" /> Super AI</h1>
          <p className="text-sm text-muted-foreground">Asks answered from live platform data. Recommendations updated continuously.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-2xl border bg-card shadow-card flex flex-col min-h-[60vh]">
          <div className="flex-1 p-4 overflow-auto space-y-3">
            {messages.length === 0 && (
              <div className="text-sm text-muted-foreground">
                Try one of these:
                <div className="flex gap-2 flex-wrap mt-2">
                  {SUGGESTIONS.map((s) => (
                    <Button key={s} size="sm" variant="outline" onClick={() => send(s)}>{s}</Button>
                  ))}
                </div>
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} className={`rounded-lg p-3 text-sm ${m.role === "user" ? "bg-primary/10" : "bg-muted"}`}>
                <div className="text-[10px] uppercase text-muted-foreground mb-1">{m.role}</div>
                <div className="prose prose-sm max-w-none"><ReactMarkdown>{m.content}</ReactMarkdown></div>
              </div>
            ))}
            {busy && <div className="text-xs text-muted-foreground flex items-center gap-2"><Loader2 className="h-3 w-3 animate-spin" /> Thinking…</div>}
          </div>
          <div className="border-t p-3 flex gap-2">
            <Input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send(input)} placeholder="Ask about renewals, usage, revenue, churn…" />
            <Button onClick={() => send(input)} disabled={busy} className="bg-gradient-brand text-white"><Send className="h-4 w-4" /></Button>
          </div>
        </div>

        <div className="rounded-2xl border bg-card shadow-card p-4">
          <div className="text-sm font-medium mb-2 flex items-center gap-2"><Lightbulb className="h-4 w-4 text-primary" /> AI recommendations</div>
          <ul className="space-y-2">
            {insights.map((i, k) => (
              <li key={k} className={`text-sm rounded-md border p-2 ${i.tone === "warn" ? "border-amber-500/40 bg-amber-500/10" : i.tone === "success" ? "border-success/40 bg-success/10" : ""}`}>
                {i.label}
              </li>
            ))}
          </ul>
          <div className="mt-4 text-xs text-muted-foreground">
            <Badge variant="outline" className="mr-1">Live</Badge>
            Snapshot regenerated on every message. AI answers only from the data above.
          </div>
        </div>
      </div>
    </SuperAdminShell>
  );
}
