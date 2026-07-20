import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/lib/auth";
import { useBilling } from "@/lib/billing-store";
import { useStore } from "@/lib/store";
import { useSuperAdmin, CHECKLIST_ITEMS, computeCompletion, type TenantChecklist } from "@/lib/super-admin-store";
import { SuperAdminShell } from "@/components/super-admin-shell";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/super-admin/success")({
  head: () => ({ meta: [{ title: "Customer Success · Super Admin" }] }),
  component: SuccessPage,
});

type Row = { id: string; name: string; plan: string; status: string };

function SuccessPage() {
  const nav = useNavigate();
  const { user, isSuperAdmin, loading } = useAuth();
  const demoMode = useStore((st) => st.demoMode);
  const { subscriptions, plans, invoices } = useBilling();
  const { demoTenants } = useStore();
  const { checklists, setChecklistItem, tickets } = useSuperAdmin();
  const [q, setQ] = useState("");

  useEffect(() => {
    if (loading) return;
    if (!user && !demoMode) { nav({ to: "/login" }); return; }
    if (!isSuperAdmin && !demoMode) { nav({ to: "/admin" }); return; }
  }, [user, isSuperAdmin, loading, nav]);

  const rows: Row[] = useMemo(() => {
    const combined: Row[] = [];
    demoTenants.forEach((t) => combined.push({ id: t.id, name: t.name, plan: t.plan, status: t.status }));
    return combined.filter((r) => !q || r.name.toLowerCase().includes(q.toLowerCase()));
  }, [demoTenants, q]);

  const scored = rows.map((r) => {
    const sub = subscriptions.find((s) => s.tenantId === r.id);
    const cl: TenantChecklist = (checklists[r.id] as TenantChecklist) ?? Object.fromEntries(CHECKLIST_ITEMS.map((c) => [c.key, false])) as any;
    const setupPct = computeCompletion(cl);
    const paidInv = invoices.filter((i) => i.tenantId === r.id && i.status === "paid").length;
    const daysToExpiry = sub ? Math.max(-30, Math.ceil((Date.parse(sub.expiresAt) - Date.now()) / 86400_000)) : 0;
    const openTickets = tickets.filter((t) => t.tenantId === r.id && t.status !== "closed" && t.status !== "resolved").length;
    const usage = sub ? (sub.usage.aiCredits + sub.usage.pdfDownloads + sub.usage.documents) : 0;
    const usageScore = Math.min(40, Math.round(usage / 5));
    const paymentScore = Math.min(20, paidInv * 4);
    const renewalScore = daysToExpiry > 15 ? 15 : daysToExpiry > 0 ? 8 : -10;
    const ticketPenalty = openTickets * 5;
    const health = Math.max(0, Math.min(100, Math.round(setupPct * 0.25 + usageScore + paymentScore + renewalScore - ticketPenalty)));
    const churn = Math.max(0, 100 - health);
    return { r, sub, cl, setupPct, health, churn, openTickets, daysToExpiry };
  }).sort((a, b) => b.health - a.health);

  return (
    <SuperAdminShell>
      <div className="flex items-end justify-between gap-3 mb-4">
        <div>
          <h1 className="font-display text-2xl font-semibold">Customer Success</h1>
          <p className="text-sm text-muted-foreground">Health score, implementation progress, renewal probability, churn risk.</p>
        </div>
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search company" className="w-64" />
      </div>

      <div className="space-y-3">
        {scored.map(({ r, sub, cl, setupPct, health, churn, openTickets, daysToExpiry }) => {
          const plan = sub ? plans.find((p) => p.id === sub.planId) : undefined;
          return (
            <div key={r.id} className="rounded-2xl border bg-card p-4 shadow-card">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <div className="font-medium">{r.name}</div>
                  <div className="text-xs text-muted-foreground">{plan?.name ?? r.plan} · {r.status} · {openTickets} open tickets · {daysToExpiry >= 0 ? `${daysToExpiry}d to renewal` : `Expired ${Math.abs(daysToExpiry)}d ago`}</div>
                </div>
                <div className="flex gap-4 items-center">
                  <div className="text-right">
                    <div className="text-[11px] uppercase text-muted-foreground">Health</div>
                    <div className={`text-lg font-semibold ${health > 70 ? "text-success" : health > 40 ? "text-amber-600" : "text-destructive"}`}>{health}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[11px] uppercase text-muted-foreground">Churn risk</div>
                    <div className={`text-lg font-semibold ${churn < 30 ? "text-success" : churn < 60 ? "text-amber-600" : "text-destructive"}`}>{churn}%</div>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-3 mt-3 text-sm">
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Setup completion — {setupPct}%</div>
                  <Progress value={setupPct} />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Renewal likelihood</div>
                  <Progress value={100 - churn} />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Usage index</div>
                  <Progress value={sub ? Math.min(100, (sub.usage.aiCredits + sub.usage.documents) / 5) : 0} />
                </div>
              </div>

              <details className="mt-3">
                <summary className="text-xs text-muted-foreground cursor-pointer">Implementation checklist</summary>
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-1 mt-2">
                  {CHECKLIST_ITEMS.map((c) => (
                    <label key={c.key} className="flex items-center justify-between border rounded px-2 py-1.5 text-xs">
                      <span>{c.label}</span>
                      <input type="checkbox" checked={!!cl[c.key]} onChange={(e) => setChecklistItem(r.id, c.key, e.target.checked)} />
                    </label>
                  ))}
                </div>
              </details>

              {(churn > 50 || openTickets > 2) && (
                <div className="mt-3 rounded-lg bg-amber-500/10 border border-amber-500/40 text-xs p-2">
                  <Badge variant="outline" className="mr-2">AI hint</Badge>
                  {churn > 50 ? "Elevated churn risk — schedule a retention call and offer a coupon." : "Ticket volume rising — assign a dedicated CSM."}
                </div>
              )}
            </div>
          );
        })}
        {scored.length === 0 && <div className="p-10 text-center text-sm text-muted-foreground rounded-xl border">No companies yet.</div>}
      </div>
    </SuperAdminShell>
  );
}
