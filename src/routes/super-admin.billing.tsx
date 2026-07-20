import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/lib/auth";
import { useStore } from "@/lib/store";
import { useBilling } from "@/lib/billing-store";
import type { Coupon, ReferralProgram } from "@/lib/billing";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { ArrowLeft, Plus, Trash2, TrendingUp, Ticket, Gift, ClipboardList } from "lucide-react";

export const Route = createFileRoute("/super-admin/billing")({
  head: () => ({ meta: [{ title: "Billing Ops · SWIFT" }] }),
  component: BillingOpsPage,
});

function BillingOpsPage() {
  const nav = useNavigate();
  const { user, isSuperAdmin, loading } = useAuth();
  const demoMode = useStore((st) => st.demoMode);
  const { plans, subscriptions, invoices, coupons, referralPrograms, referrals,
    addCoupon, updateCoupon, deleteCoupon, addReferralProgram, updateReferralProgram, deleteReferralProgram,
    audit } = useBilling();

  useEffect(() => {
    if (loading) return;
    if (!user && !demoMode) nav({ to: "/login" });
    else if (!isSuperAdmin && !demoMode) nav({ to: "/admin" });
  }, [user, isSuperAdmin, loading, nav]);

  const stats = useMemo(() => {
    const paid = invoices.filter((i) => i.status === "paid");
    const revenue = paid.reduce((a, i) => a + i.total, 0);
    const monthly = paid.filter((i) => Date.parse(i.issueDate) > Date.now() - 30 * 86400_000).reduce((a, i) => a + i.total, 0);
    const yearly = paid.filter((i) => Date.parse(i.issueDate) > Date.now() - 365 * 86400_000).reduce((a, i) => a + i.total, 0);
    return {
      total: subscriptions.length,
      active: subscriptions.filter((s) => s.status === "active").length,
      trial: subscriptions.filter((s) => s.status === "trial").length,
      expired: subscriptions.filter((s) => s.status === "suspended" || s.status === "cancelled").length,
      revenue, monthly, yearly,
      pendingPayments: invoices.filter((i) => i.status !== "paid" && i.status !== "refunded").length,
    };
  }, [invoices, subscriptions]);

  const topPlans = useMemo(() => {
    const c: Record<string, number> = {};
    subscriptions.forEach((s) => { c[s.planId] = (c[s.planId] ?? 0) + 1; });
    return Object.entries(c).map(([id, n]) => ({ plan: plans.find((p) => p.id === id)?.name ?? id, n })).sort((a, b) => b.n - a.n).slice(0, 5);
  }, [subscriptions, plans]);

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-5">
        <div>
          <Link to="/super-admin" className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1"><ArrowLeft className="h-3 w-3" />Back</Link>
          <h1 className="font-display text-2xl font-semibold mt-1">Billing operations</h1>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Stat label="Companies" value={stats.total} />
          <Stat label="Active" value={stats.active} tone="success" />
          <Stat label="Trial" value={stats.trial} />
          <Stat label="Suspended" value={stats.expired} tone="warn" />
          <Stat label="Total revenue" value={`₹${stats.revenue.toLocaleString()}`} />
          <Stat label="Last 30 days" value={`₹${stats.monthly.toLocaleString()}`} />
          <Stat label="Last 365 days" value={`₹${stats.yearly.toLocaleString()}`} />
          <Stat label="Pending payments" value={stats.pendingPayments} tone="warn" />
        </div>

        <Tabs defaultValue="subs" className="space-y-4">
          <TabsList className="flex-wrap h-auto">
            <TabsTrigger value="subs"><TrendingUp className="h-4 w-4 mr-1" />Subscriptions</TabsTrigger>
            <TabsTrigger value="invoices">Invoices</TabsTrigger>
            <TabsTrigger value="coupons"><Ticket className="h-4 w-4 mr-1" />Coupons</TabsTrigger>
            <TabsTrigger value="referrals"><Gift className="h-4 w-4 mr-1" />Referrals</TabsTrigger>
            <TabsTrigger value="audit"><ClipboardList className="h-4 w-4 mr-1" />Audit</TabsTrigger>
          </TabsList>

          <TabsContent value="subs">
            <div className="grid md:grid-cols-3 gap-3">
              <div className="md:col-span-2 rounded-xl border bg-card p-4">
                <div className="font-medium mb-2">All subscriptions</div>
                {subscriptions.length === 0 ? <div className="text-sm text-muted-foreground">None yet.</div> :
                  <ul className="divide-y">
                    {subscriptions.map((s) => (
                      <li key={s.id} className="py-2 flex justify-between text-sm">
                        <div>
                          <div className="font-medium">{s.tenantId}</div>
                          <div className="text-xs text-muted-foreground">{plans.find((p) => p.id === s.planId)?.name} · {s.cycle} · renews {new Date(s.expiresAt).toLocaleDateString()}</div>
                        </div>
                        <Badge variant="outline" className="capitalize">{s.status}</Badge>
                      </li>
                    ))}
                  </ul>}
              </div>
              <div className="rounded-xl border bg-card p-4">
                <div className="font-medium mb-2">Top plans</div>
                {topPlans.length === 0 ? <div className="text-sm text-muted-foreground">No data</div> :
                  <ul className="space-y-2 text-sm">{topPlans.map((p) => <li key={p.plan} className="flex justify-between"><span>{p.plan}</span><Badge>{p.n}</Badge></li>)}</ul>}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="invoices">
            {invoices.length === 0 ? <div className="text-sm text-muted-foreground">No invoices.</div> :
              <div className="rounded-xl border bg-card divide-y">
                {invoices.map((i) => (
                  <div key={i.id} className="p-3 flex justify-between text-sm">
                    <div><div className="font-medium">{i.number}</div><div className="text-xs text-muted-foreground">{i.tenantId} · {new Date(i.issueDate).toLocaleDateString()}</div></div>
                    <div className="text-right"><div>₹{i.total.toLocaleString()}</div><Badge variant="outline" className="capitalize text-xs">{i.status}</Badge></div>
                  </div>
                ))}
              </div>}
          </TabsContent>

          <TabsContent value="coupons"><CouponsTab coupons={coupons} add={addCoupon} update={updateCoupon} del={deleteCoupon} /></TabsContent>

          <TabsContent value="referrals">
            <div className="space-y-4">
              <ReferralsTab programs={referralPrograms} add={addReferralProgram} update={updateReferralProgram} del={deleteReferralProgram} />
              <div className="rounded-xl border bg-card p-4">
                <div className="font-medium mb-2">Referral ledger</div>
                {referrals.length === 0 ? <div className="text-sm text-muted-foreground">No referrals yet.</div> :
                  <ul className="divide-y">
                    {referrals.map((r) => (
                      <li key={r.tenantId} className="py-2 text-sm flex justify-between">
                        <div><div className="font-mono">{r.code}</div><div className="text-xs text-muted-foreground">{r.tenantId}</div></div>
                        <div className="text-xs text-muted-foreground">Invited {r.invited.length} · Registered {r.registered.length} · Activated {r.activated.length} · Paid {r.paid.length}</div>
                      </li>
                    ))}
                  </ul>}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="audit">
            {audit.length === 0 ? <div className="text-sm text-muted-foreground">No entries.</div> :
              <ul className="rounded-xl border bg-card divide-y">
                {audit.map((a, i) => (
                  <li key={i} className="p-3 text-sm flex justify-between">
                    <div><div className="capitalize">{a.kind.replace("_", " ")}</div><div className="text-xs text-muted-foreground">{a.actor} · {new Date(a.ts).toLocaleString()}{a.note ? ` · ${a.note}` : ""}</div></div>
                    {a.amount && <div className="text-sm font-medium">₹{a.amount.toLocaleString()}</div>}
                  </li>
                ))}
              </ul>}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function Stat({ label, value, tone }: { label: string; value: string | number; tone?: "success" | "warn" }) {
  const cls = tone === "success" ? "text-success" : tone === "warn" ? "text-amber-600" : "";
  return (
    <div className="rounded-xl border bg-card p-4">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className={`text-2xl font-display font-semibold mt-1 ${cls}`}>{value}</div>
    </div>
  );
}

function CouponsTab({ coupons, add, update, del }: { coupons: Coupon[]; add: (c: Coupon) => void; update: (id: string, p: Partial<Coupon>) => void; del: (id: string) => void }) {
  const [open, setOpen] = useState(false);
  const [c, setC] = useState<Coupon>({ id: "", code: "", kind: "percent", value: 10, maxUses: -1, used: 0, active: true });
  const save = () => {
    if (!c.code.trim()) return toast.error("Code required");
    add({ ...c, id: crypto.randomUUID(), code: c.code.toUpperCase() });
    setC({ id: "", code: "", kind: "percent", value: 10, maxUses: -1, used: 0, active: true });
    setOpen(false); toast.success("Coupon created");
  };
  return (
    <div className="space-y-3">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild><Button size="sm"><Plus className="h-4 w-4 mr-2" />New coupon</Button></DialogTrigger>
        <DialogContent>
          <DialogHeader><DialogTitle>New coupon</DialogTitle></DialogHeader>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Code</Label><Input value={c.code} onChange={(e) => setC({ ...c, code: e.target.value })} /></div>
            <div><Label>Kind</Label>
              <select className="w-full h-10 rounded-md border bg-background px-3 text-sm" value={c.kind} onChange={(e) => setC({ ...c, kind: e.target.value as Coupon["kind"] })}>
                <option value="percent">Percent</option><option value="flat">Flat</option><option value="module">Module</option><option value="plan">Plan</option>
              </select>
            </div>
            <div><Label>Value</Label><Input type="number" value={c.value} onChange={(e) => setC({ ...c, value: +e.target.value })} /></div>
            <div><Label>Max uses (-1 = unlimited)</Label><Input type="number" value={c.maxUses} onChange={(e) => setC({ ...c, maxUses: +e.target.value })} /></div>
            <div className="col-span-2"><Label>Expires at</Label><Input type="date" onChange={(e) => setC({ ...c, expiresAt: e.target.value ? new Date(e.target.value).toISOString() : undefined })} /></div>
          </div>
          <DialogFooter><Button onClick={save}>Create</Button></DialogFooter>
        </DialogContent>
      </Dialog>
      <div className="grid md:grid-cols-2 gap-2">
        {coupons.map((cp) => (
          <div key={cp.id} className="border rounded-lg p-3 bg-card flex items-center justify-between">
            <div>
              <div className="font-mono font-semibold">{cp.code}</div>
              <div className="text-xs text-muted-foreground capitalize">{cp.kind} · {cp.value}{cp.kind === "percent" ? "%" : ""} · used {cp.used}/{cp.maxUses === -1 ? "∞" : cp.maxUses}</div>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs flex items-center gap-1"><input type="checkbox" checked={cp.active} onChange={(e) => update(cp.id, { active: e.target.checked })} />Active</label>
              <Button size="sm" variant="ghost" onClick={() => del(cp.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ReferralsTab({ programs, add, update, del }: { programs: ReferralProgram[]; add: (p: ReferralProgram) => void; update: (id: string, p: Partial<ReferralProgram>) => void; del: (id: string) => void }) {
  return (
    <div className="space-y-3">
      <Button size="sm" onClick={() => add({ id: crypto.randomUUID(), name: "New Program", active: true, tiers: [{ referrals: 1, rewardKind: "discount_pct", value: 5 }] })}><Plus className="h-4 w-4 mr-2" />New program</Button>
      {programs.map((p) => (
        <div key={p.id} className="rounded-xl border bg-card p-4">
          <div className="flex items-center justify-between gap-3">
            <Input value={p.name} onChange={(e) => update(p.id, { name: e.target.value })} className="max-w-xs" />
            <div className="flex items-center gap-3">
              <label className="text-xs flex items-center gap-1"><input type="checkbox" checked={p.active} onChange={(e) => update(p.id, { active: e.target.checked })} />Active</label>
              <Button size="sm" variant="ghost" onClick={() => del(p.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
            </div>
          </div>
          <div className="mt-3 space-y-2">
            {p.tiers.map((t, i) => (
              <div key={i} className="grid grid-cols-4 gap-2 items-end">
                <div><Label className="text-xs">Referrals ≥</Label><Input type="number" value={t.referrals} onChange={(e) => { const tiers = [...p.tiers]; tiers[i] = { ...t, referrals: +e.target.value }; update(p.id, { tiers }); }} /></div>
                <div><Label className="text-xs">Reward kind</Label>
                  <select className="w-full h-10 rounded-md border bg-background px-2 text-sm" value={t.rewardKind} onChange={(e) => { const tiers = [...p.tiers]; tiers[i] = { ...t, rewardKind: e.target.value as any }; update(p.id, { tiers }); }}>
                    <option value="discount_pct">Discount %</option><option value="ai_credits">AI credits</option><option value="storage_mb">Storage MB</option><option value="users">Users</option><option value="modules">Modules</option>
                  </select>
                </div>
                <div><Label className="text-xs">Value</Label><Input type="number" value={t.value} onChange={(e) => { const tiers = [...p.tiers]; tiers[i] = { ...t, value: +e.target.value }; update(p.id, { tiers }); }} /></div>
                <Button size="sm" variant="ghost" onClick={() => update(p.id, { tiers: p.tiers.filter((_, j) => j !== i) })}><Trash2 className="h-4 w-4 text-destructive" /></Button>
              </div>
            ))}
            <Button size="sm" variant="outline" onClick={() => update(p.id, { tiers: [...p.tiers, { referrals: 1, rewardKind: "discount_pct", value: 5 }] })}><Plus className="h-4 w-4 mr-1" />Add tier</Button>
          </div>
        </div>
      ))}
    </div>
  );
}
