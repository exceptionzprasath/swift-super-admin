import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/lib/auth";
import { useStore } from "@/lib/store";
import { useBilling } from "@/lib/billing-store";
import { useSuperAdmin } from "@/lib/super-admin-store";
import { SuperAdminShell } from "@/components/super-admin-shell";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export const Route = createFileRoute("/super-admin/audit")({
  head: () => ({ meta: [{ title: "Audit Log · Super Admin" }] }),
  component: AuditPage,
});

function AuditPage() {
  const nav = useNavigate();
  const { user, isSuperAdmin, loading } = useAuth();
  const demoMode = useStore((st) => st.demoMode);
  const { audit, reminderLog } = useBilling();
  const { impersonation } = useSuperAdmin();
  const [q, setQ] = useState("");

  useEffect(() => {
    if (loading) return;
    if (!user && !demoMode) nav({ to: "/login" });
    else if (!isSuperAdmin && !demoMode) nav({ to: "/admin" });
  }, [user, isSuperAdmin, loading, nav]);

  const combined = useMemo(() => {
    const rows = [
      ...audit.map((a) => ({ ts: a.ts, kind: a.kind, actor: a.actor, note: a.note ?? "", amount: a.amount ?? 0, source: "billing" })),
      ...reminderLog.map((l) => ({ ts: l.sentAt, kind: `reminder_${l.stage}`, actor: "scheduler", note: `${l.channels.join(", ")} — ${l.message}`, amount: 0, source: "scheduler" })),
      ...impersonation.map((i) => ({ ts: i.ts, kind: "impersonation", actor: i.actor, note: i.note ?? `Tenant ${i.tenantId}`, amount: 0, source: "super_admin" })),
    ].sort((a, b) => Date.parse(b.ts) - Date.parse(a.ts));
    return rows.filter((r) => !q || JSON.stringify(r).toLowerCase().includes(q.toLowerCase()));
  }, [audit, reminderLog, impersonation, q]);

  function exportCsv() {
    const header = "timestamp,kind,actor,source,amount,note\n";
    const body = combined.map((r) => `${r.ts},${r.kind},${r.actor},${r.source},${r.amount},"${(r.note || "").replace(/"/g, '""')}"`).join("\n");
    const blob = new Blob([header + body], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `swift-audit-${Date.now()}.csv`; a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <SuperAdminShell>
      <div className="flex items-end justify-between gap-3 mb-4">
        <div>
          <h1 className="font-display text-2xl font-semibold">Audit Log</h1>
          <p className="text-sm text-muted-foreground">Every action across billing, scheduler and super-admin impersonation. Nothing is permanently deleted.</p>
        </div>
        <div className="flex gap-2">
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search…" className="w-64" />
          <Button variant="outline" onClick={exportCsv}><Download className="h-4 w-4 mr-2" />CSV</Button>
        </div>
      </div>

      {combined.length === 0 ? <div className="p-10 text-sm text-muted-foreground text-center rounded-xl border">No events.</div> :
        <ul className="rounded-2xl border bg-card divide-y max-h-[70vh] overflow-auto">
          {combined.map((r, i) => (
            <li key={i} className="p-3 flex justify-between text-sm">
              <div>
                <div className="capitalize font-medium">{r.kind.replace(/_/g, " ")}</div>
                <div className="text-xs text-muted-foreground">{r.actor} · {new Date(r.ts).toLocaleString()} · {r.source}{r.note ? ` — ${r.note}` : ""}</div>
              </div>
              {r.amount ? <div className="text-sm font-medium">₹{r.amount.toLocaleString()}</div> : <Badge variant="outline" className="text-xs">{r.source}</Badge>}
            </li>
          ))}
        </ul>}
    </SuperAdminShell>
  );
}
