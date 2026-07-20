import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SuperAdminShell } from "@/components/super-admin-shell";
import {
  useComplianceRegistry, REGISTRY_KIND_LABEL,
  type RegistryEntry, type RegistryKind, type RegistryFrequency,
  type RegistryTriggerKind,
} from "@/lib/compliance-registry-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus, Trash2, Copy, RefreshCcw, Download, Upload, ShieldCheck,
  Edit3, Power, History,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/super-admin/compliance-registry")({
  head: () => ({ meta: [{ title: "Compliance Registry · Super Admin" }] }),
  component: RegistryPage,
});

const KINDS: RegistryKind[] = ["act", "rule", "section", "form", "register", "notice", "return", "licence", "circular", "amendment"];
const FREQS: RegistryFrequency[] = ["daily", "weekly", "monthly", "quarterly", "half_yearly", "annual", "financial_year", "calendar_year", "biennial", "one_time", "on_event", "ongoing", "custom"];
const TRIGGERS: RegistryTriggerKind[] = ["event", "time", "conditional", "manual"];

function RegistryPage() {
  const { entries, addEntry, updateEntry, deleteEntry, toggleEntry, duplicateEntry, resetSeed, addAmendment } = useComplianceRegistry();
  const [q, setQ] = useState("");
  const [kind, setKind] = useState<RegistryKind | "all">("all");
  const [editing, setEditing] = useState<RegistryEntry | null>(null);
  const [showNew, setShowNew] = useState(false);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    return entries.filter((e) =>
      (kind === "all" || e.kind === kind) &&
      (!s || `${e.act} ${e.title} ${e.code ?? ""} ${e.state ?? ""}`.toLowerCase().includes(s)),
    );
  }, [entries, q, kind]);

  const stats = useMemo(() => {
    const by: Record<string, number> = {};
    for (const e of entries) by[e.kind] = (by[e.kind] ?? 0) + 1;
    return by;
  }, [entries]);

  function exportJSON() {
    const blob = new Blob([JSON.stringify(entries, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `swift-compliance-registry-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  async function importJSON(file: File) {
    try {
      const txt = await file.text();
      const arr = JSON.parse(txt) as RegistryEntry[];
      if (!Array.isArray(arr)) throw new Error("Invalid file");
      let imported = 0;
      for (const e of arr) { addEntry(e); imported++; }
      toast.success(`Imported ${imported} entries`);
    } catch (err) {
      toast.error(`Import failed: ${(err as Error).message}`);
    }
  }

  return (
    <SuperAdminShell>
      <div className="flex flex-wrap items-end justify-between gap-3 mb-4">
        <div>
          <h1 className="font-display text-2xl font-semibold flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-primary" /> Master Compliance Registry
          </h1>
          <p className="text-sm text-muted-foreground">
            Central catalogue of every Act, Rule, Section, Form, Register, Notice, Return, Licence, Circular and Amendment.
            Fully configuration-driven — add unlimited entries without any code change.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={exportJSON}><Download className="h-4 w-4 mr-2" />Export</Button>
          <label className="cursor-pointer">
            <input type="file" accept="application/json" className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) void importJSON(f); e.currentTarget.value = ""; }} />
            <span className="inline-flex items-center h-9 px-3 rounded-md border text-sm bg-background hover:bg-muted">
              <Upload className="h-4 w-4 mr-2" />Import
            </span>
          </label>
          <Button variant="outline" size="sm" onClick={() => { resetSeed(); toast.success("Registry reset to seed"); }}>
            <RefreshCcw className="h-4 w-4 mr-2" />Reset seed
          </Button>
          <Button size="sm" onClick={() => setShowNew(true)}><Plus className="h-4 w-4 mr-2" />New entry</Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-6 gap-2 mb-4">
        {(["act", "form", "register", "notice", "return", "licence"] as RegistryKind[]).map((k) => (
          <div key={k} className="rounded-xl border bg-card p-3">
            <div className="text-xs text-muted-foreground uppercase">{REGISTRY_KIND_LABEL[k]}s</div>
            <div className="text-2xl font-semibold">{stats[k] ?? 0}</div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 mb-3">
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search act, title, code, state…" className="w-72" />
        <select value={kind} onChange={(e) => setKind(e.target.value as never)}
          className="h-9 rounded-md border bg-background px-3 text-sm">
          <option value="all">All kinds</option>
          {KINDS.map((k) => <option key={k} value={k}>{REGISTRY_KIND_LABEL[k]}</option>)}
        </select>
        <div className="text-xs text-muted-foreground self-center ml-auto">{filtered.length} of {entries.length}</div>
      </div>

      <div className="rounded-2xl border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-xs text-muted-foreground">
            <tr>
              <th className="text-left px-3 py-2">Kind</th>
              <th className="text-left px-3 py-2">Act / Code</th>
              <th className="text-left px-3 py-2">Title</th>
              <th className="text-left px-3 py-2">Frequency</th>
              <th className="text-left px-3 py-2">Trigger</th>
              <th className="text-left px-3 py-2">Version</th>
              <th className="text-left px-3 py-2">State</th>
              <th className="text-right px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((e) => (
              <tr key={e.id} className="border-t hover:bg-muted/30">
                <td className="px-3 py-2"><Badge variant="outline" className="text-xs capitalize">{e.kind}</Badge></td>
                <td className="px-3 py-2">
                  <div className="font-medium">{e.act}</div>
                  {e.code && <div className="text-xs text-muted-foreground">{e.code}</div>}
                </td>
                <td className="px-3 py-2">
                  <div>{e.title}{!e.enabled && <Badge variant="outline" className="ml-2 text-xs">disabled</Badge>}</div>
                  {e.section && <div className="text-xs text-muted-foreground">§ {e.section}</div>}
                </td>
                <td className="px-3 py-2 text-xs uppercase text-muted-foreground">{e.frequency.replace(/_/g, " ")}</td>
                <td className="px-3 py-2 text-xs">
                  {e.triggerKind}{e.eventKey ? ` · ${e.eventKey}` : ""}
                </td>
                <td className="px-3 py-2 text-xs">{e.version}</td>
                <td className="px-3 py-2 text-xs">{e.state ?? "—"}</td>
                <td className="px-3 py-2 text-right">
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon" title="Edit" onClick={() => setEditing(e)}><Edit3 className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" title="Toggle" onClick={() => toggleEntry(e.id)}><Power className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" title="Duplicate" onClick={() => { duplicateEntry(e.id); toast.success("Duplicated"); }}>
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" title="Delete"
                      onClick={() => { if (confirm(`Delete "${e.title}"?`)) { deleteEntry(e.id); toast.info("Deleted"); } }}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={8} className="text-center text-sm text-muted-foreground p-10">No entries match.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {showNew && <EntryEditor onClose={() => setShowNew(false)} onSave={(data) => { addEntry(data); toast.success("Added"); setShowNew(false); }} />}
      {editing && (
        <EntryEditor
          initial={editing}
          onClose={() => setEditing(null)}
          onSave={(data) => { updateEntry(editing.id, data); toast.success("Saved"); setEditing(null); }}
          onAmend={(a) => { addAmendment(editing.id, a); toast.success("Amendment logged"); }}
        />
      )}
    </SuperAdminShell>
  );
}

// ── Editor ──────────────────────────────────────────────────────────────────
function EntryEditor({
  initial, onClose, onSave, onAmend,
}: {
  initial?: RegistryEntry;
  onClose: () => void;
  onSave: (data: Partial<RegistryEntry> & Pick<RegistryEntry, "kind" | "act" | "title" | "frequency" | "triggerKind">) => void;
  onAmend?: (a: { date: string; summary: string; circularRef?: string; by?: string }) => void;
}) {
  const [form, setForm] = useState<RegistryEntry>(initial ?? {
    id: "", kind: "form", act: "", title: "", frequency: "ongoing", triggerKind: "manual",
    version: "1.0", applicability: {}, autoFill: [], approval: {
      stages: ["draft", "hr_review", "digital_signature", "final_pdf", "archive"],
      requireDigitalSignature: true, requireSeal: true, requireWatermark: false, requireQR: true, autoArchive: true,
    }, amendments: [], createdAt: "", updatedAt: "", enabled: true,
  });
  const [newAmend, setNewAmend] = useState({ date: new Date().toISOString().slice(0, 10), summary: "", circularRef: "" });

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-auto">
        <DialogHeader><DialogTitle>{initial ? "Edit entry" : "New compliance entry"}</DialogTitle></DialogHeader>

        <Tabs defaultValue="core">
          <TabsList>
            <TabsTrigger value="core">Core</TabsTrigger>
            <TabsTrigger value="timing">Timing</TabsTrigger>
            <TabsTrigger value="scope">Scope</TabsTrigger>
            <TabsTrigger value="automation">Automation</TabsTrigger>
            <TabsTrigger value="approval">Approval</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="core" className="space-y-3 pt-3">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Kind">
                <select className="h-10 w-full rounded-md border bg-background px-3 text-sm" value={form.kind}
                  onChange={(e) => setForm({ ...form, kind: e.target.value as RegistryKind })}>
                  {KINDS.map((k) => <option key={k} value={k}>{REGISTRY_KIND_LABEL[k]}</option>)}
                </select>
              </Field>
              <Field label="Enabled">
                <div className="h-10 flex items-center"><Switch checked={form.enabled} onCheckedChange={(v) => setForm({ ...form, enabled: v })} /></div>
              </Field>
              <Field label="Act *"><Input value={form.act} onChange={(e) => setForm({ ...form, act: e.target.value })} /></Field>
              <Field label="Authority"><Input value={form.authority ?? ""} onChange={(e) => setForm({ ...form, authority: e.target.value })} /></Field>
              <Field label="Rule"><Input value={form.rule ?? ""} onChange={(e) => setForm({ ...form, rule: e.target.value })} /></Field>
              <Field label="Section"><Input value={form.section ?? ""} onChange={(e) => setForm({ ...form, section: e.target.value })} /></Field>
              <Field label="Code (Form/Register No.)"><Input value={form.code ?? ""} onChange={(e) => setForm({ ...form, code: e.target.value })} /></Field>
              <Field label="Version"><Input value={form.version} onChange={(e) => setForm({ ...form, version: e.target.value })} /></Field>
              <div className="col-span-2"><Field label="Title *"><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></Field></div>
              <div className="col-span-2"><Field label="Purpose"><Textarea rows={2} value={form.purpose ?? ""} onChange={(e) => setForm({ ...form, purpose: e.target.value })} /></Field></div>
            </div>
          </TabsContent>

          <TabsContent value="timing" className="space-y-3 pt-3">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Frequency">
                <select className="h-10 w-full rounded-md border bg-background px-3 text-sm" value={form.frequency}
                  onChange={(e) => setForm({ ...form, frequency: e.target.value as RegistryFrequency })}>
                  {FREQS.map((f) => <option key={f} value={f}>{f}</option>)}
                </select>
              </Field>
              <Field label="Trigger kind">
                <select className="h-10 w-full rounded-md border bg-background px-3 text-sm" value={form.triggerKind}
                  onChange={(e) => setForm({ ...form, triggerKind: e.target.value as RegistryTriggerKind })}>
                  {TRIGGERS.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </Field>
              <Field label="Due day"><Input type="number" value={form.dueDay ?? ""} onChange={(e) => setForm({ ...form, dueDay: +e.target.value || undefined })} /></Field>
              <Field label="Due month"><Input type="number" value={form.dueMonth ?? ""} onChange={(e) => setForm({ ...form, dueMonth: +e.target.value || undefined })} /></Field>
              <Field label="Custom cron / expr"><Input value={form.customCron ?? ""} onChange={(e) => setForm({ ...form, customCron: e.target.value })} /></Field>
              <Field label="Event key"><Input value={form.eventKey ?? ""} placeholder="employee_joined" onChange={(e) => setForm({ ...form, eventKey: e.target.value })} /></Field>
              <Field label="Effective date"><Input type="date" value={form.effectiveDate?.slice(0, 10) ?? ""} onChange={(e) => setForm({ ...form, effectiveDate: e.target.value })} /></Field>
              <Field label="Expiry date"><Input type="date" value={form.expiryDate?.slice(0, 10) ?? ""} onChange={(e) => setForm({ ...form, expiryDate: e.target.value })} /></Field>
              <div className="col-span-2">
                <Field label="Reminder days (comma-separated)">
                  <Input value={(form.reminderDays ?? []).join(",")} placeholder="30,15,7,3,1"
                    onChange={(e) => setForm({ ...form, reminderDays: e.target.value.split(",").map((x) => +x.trim()).filter((n) => n > 0) })} />
                </Field>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="scope" className="space-y-3 pt-3">
            <div className="grid grid-cols-2 gap-3">
              <Field label="State"><Input value={form.state ?? ""} onChange={(e) => setForm({ ...form, state: e.target.value })} /></Field>
              <Field label="Industry"><Input value={form.industry ?? ""} onChange={(e) => setForm({ ...form, industry: e.target.value })} /></Field>
              <Field label="Department"><Input value={form.department ?? ""} onChange={(e) => setForm({ ...form, department: e.target.value })} /></Field>
              <Field label="Min employees"><Input type="number" value={form.applicability.minEmployees ?? ""} onChange={(e) => setForm({ ...form, applicability: { ...form.applicability, minEmployees: +e.target.value || undefined } })} /></Field>
              <Field label="Min women"><Input type="number" value={form.applicability.minWomen ?? ""} onChange={(e) => setForm({ ...form, applicability: { ...form.applicability, minWomen: +e.target.value || undefined } })} /></Field>
              <Field label="Min branches"><Input type="number" value={form.applicability.minBranches ?? ""} onChange={(e) => setForm({ ...form, applicability: { ...form.applicability, minBranches: +e.target.value || undefined } })} /></Field>
              <Field label="Establishment types (csv)"><Input value={(form.applicability.establishmentTypes ?? []).join(",")}
                onChange={(e) => setForm({ ...form, applicability: { ...form.applicability, establishmentTypes: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) as never } })} /></Field>
              <Field label="States (csv)"><Input value={(form.applicability.states ?? []).join(",")}
                onChange={(e) => setForm({ ...form, applicability: { ...form.applicability, states: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) } })} /></Field>
              <div className="col-span-2 flex flex-wrap gap-3">
                {(["requiresContractLabour", "requiresHazardous", "requiresNightShift", "requiresPower"] as const).map((k) => (
                  <label key={k} className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={!!form.applicability[k]}
                      onChange={(e) => setForm({ ...form, applicability: { ...form.applicability, [k]: e.target.checked } })} />
                    {k.replace(/^requires/, "").replace(/([A-Z])/g, " $1").trim()}
                  </label>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="automation" className="space-y-3 pt-3">
            <div>
              <Label className="text-xs">Auto-fill mappings</Label>
              <div className="text-xs text-muted-foreground mb-2">Map form fields to data sources (employee.name, branch.address, payroll.month …).</div>
              {form.autoFill.map((m, i) => (
                <div key={i} className="grid grid-cols-4 gap-2 mb-2">
                  <Input placeholder="field" value={m.field} onChange={(e) => { const c = [...form.autoFill]; c[i] = { ...c[i], field: e.target.value }; setForm({ ...form, autoFill: c }); }} />
                  <Input placeholder="source" value={m.source} onChange={(e) => { const c = [...form.autoFill]; c[i] = { ...c[i], source: e.target.value }; setForm({ ...form, autoFill: c }); }} />
                  <Input placeholder="transform" value={m.transform ?? ""} onChange={(e) => { const c = [...form.autoFill]; c[i] = { ...c[i], transform: e.target.value }; setForm({ ...form, autoFill: c }); }} />
                  <div className="flex gap-1">
                    <Input placeholder="fallback" value={m.fallback ?? ""} onChange={(e) => { const c = [...form.autoFill]; c[i] = { ...c[i], fallback: e.target.value }; setForm({ ...form, autoFill: c }); }} />
                    <Button variant="ghost" size="icon" onClick={() => setForm({ ...form, autoFill: form.autoFill.filter((_, j) => j !== i) })}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div>
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={() => setForm({ ...form, autoFill: [...form.autoFill, { field: "", source: "" }] })}>
                <Plus className="h-4 w-4 mr-1" />Add mapping
              </Button>
            </div>
            <Field label="AI instructions"><Textarea rows={3} value={form.aiInstructions ?? ""}
              onChange={(e) => setForm({ ...form, aiInstructions: e.target.value })}
              placeholder="Tell SWIFT AI how to fill/validate this document…" /></Field>
            <Field label="Government circular / reference"><Input value={form.circular ?? ""} onChange={(e) => setForm({ ...form, circular: e.target.value })} /></Field>
            <Field label="Penalty on non-compliance"><Input value={form.penalty ?? ""} onChange={(e) => setForm({ ...form, penalty: e.target.value })} /></Field>
          </TabsContent>

          <TabsContent value="approval" className="space-y-3 pt-3">
            <Field label="Approval stages (ordered, csv)">
              <Input value={form.approval.stages.join(",")}
                onChange={(e) => setForm({ ...form, approval: { ...form.approval, stages: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) as never } })} />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              {(["requireDigitalSignature", "requireSeal", "requireWatermark", "requireQR", "autoArchive"] as const).map((k) => (
                <label key={k} className="flex items-center gap-2 text-sm">
                  <Switch checked={form.approval[k]} onCheckedChange={(v) => setForm({ ...form, approval: { ...form.approval, [k]: v } })} />
                  {k.replace(/^require/, "Require ").replace(/^auto/, "Auto ")}
                </label>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-3 pt-3">
            {onAmend && (
              <div className="rounded-lg border p-3 space-y-2">
                <div className="text-sm font-medium flex items-center gap-2"><History className="h-4 w-4" />Log amendment</div>
                <div className="grid grid-cols-3 gap-2">
                  <Input type="date" value={newAmend.date} onChange={(e) => setNewAmend({ ...newAmend, date: e.target.value })} />
                  <Input placeholder="Circular ref" value={newAmend.circularRef} onChange={(e) => setNewAmend({ ...newAmend, circularRef: e.target.value })} />
                  <Button size="sm" onClick={() => { if (!newAmend.summary.trim()) { toast.error("Summary required"); return; } onAmend({ ...newAmend, by: "super_admin" }); setNewAmend({ date: new Date().toISOString().slice(0, 10), summary: "", circularRef: "" }); }}>Log</Button>
                </div>
                <Textarea rows={2} placeholder="What changed?" value={newAmend.summary} onChange={(e) => setNewAmend({ ...newAmend, summary: e.target.value })} />
              </div>
            )}
            <div className="text-sm font-medium">Amendment history ({form.amendments.length})</div>
            <ul className="space-y-1 text-sm max-h-56 overflow-auto">
              {form.amendments.map((a) => (
                <li key={a.id} className="rounded border p-2">
                  <div className="text-xs text-muted-foreground">{a.date} · {a.circularRef || "—"}</div>
                  <div>{a.summary}</div>
                </li>
              ))}
              {form.amendments.length === 0 && <li className="text-xs text-muted-foreground">No amendments logged.</li>}
            </ul>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={() => { if (!form.act || !form.title) { toast.error("Act and Title are required"); return; } onSave(form); }}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><Label className="text-xs">{label}</Label>{children}</div>;
}
