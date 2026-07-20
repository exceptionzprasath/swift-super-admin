import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { useStore } from "@/lib/store";
import { useBilling } from "@/lib/billing-store";
import {
  ALL_MODULES, FEATURE_KEYS, makePlan, EMPTY_LIMITS,
  type Plan, type ModuleKey, type ModuleStatus, type PlanLimits, type BillingCycle, type PricingModel,
} from "@/lib/billing";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Plus, Trash2, ArrowLeft, Settings2 } from "lucide-react";

export const Route = createFileRoute("/super-admin/plans")({
  head: () => ({ meta: [{ title: "Plans · SWIFT Super Admin" }] }),
  component: PlansPage,
});

const MODULE_STATUSES: ModuleStatus[] = ["enabled", "trial", "read_only", "locked", "expired", "coming_soon", "disabled", "purchased", "custom"];
const CYCLES: BillingCycle[] = ["monthly", "quarterly", "half_yearly", "yearly", "custom"];
const PRICINGS: PricingModel[] = ["per_employee", "flat", "tiered", "usage", "custom"];

function PlansPage() {
  const nav = useNavigate();
  const { user, isSuperAdmin, loading } = useAuth();
  const demoMode = useStore((st) => st.demoMode);
  const { plans, addPlan, updatePlan, deletePlan } = useBilling();
  const [editing, setEditing] = useState<Plan | null>(null);
  const [openNew, setOpenNew] = useState(false);
  const [newName, setNewName] = useState("");

  useEffect(() => {
    if (loading) return;
    if (!user && !demoMode) nav({ to: "/login" });
    else if (!isSuperAdmin && !demoMode) nav({ to: "/admin" });
  }, [user, isSuperAdmin, loading, nav]);

  const createPlan = () => {
    if (!newName.trim()) return toast.error("Name required");
    addPlan(makePlan({ name: newName.trim(), limits: { ...EMPTY_LIMITS, employees: 25 } }));
    setNewName(""); setOpenNew(false); toast.success("Plan created");
  };

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <Link to="/super-admin" className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1"><ArrowLeft className="h-3 w-3" />Back</Link>
            <h1 className="font-display text-2xl font-semibold mt-1">Plan management</h1>
            <p className="text-sm text-muted-foreground">Create unlimited plans. Toggle modules, feature flags and limits per plan.</p>
          </div>
          <Dialog open={openNew} onOpenChange={setOpenNew}>
            <DialogTrigger asChild><Button className="bg-gradient-brand text-white"><Plus className="h-4 w-4 mr-2" />New plan</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>New plan</DialogTitle></DialogHeader>
              <div><Label>Name</Label><Input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="e.g. Factory HR" /></div>
              <DialogFooter><Button onClick={createPlan}>Create</Button></DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {plans.map((p) => (
            <div key={p.id} className="rounded-xl border bg-card p-4">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-display text-lg font-semibold">{p.name}</div>
                  <div className="text-xs text-muted-foreground">{p.cycle} · {p.pricing}</div>
                </div>
                <Badge variant={p.active ? "default" : "outline"}>{p.active ? "Active" : "Inactive"}</Badge>
              </div>
              <div className="text-2xl font-semibold mt-2">₹{p.basePrice.toLocaleString()}<span className="text-xs font-normal text-muted-foreground"> base</span></div>
              <div className="text-xs text-muted-foreground">+ ₹{p.perEmployeePrice ?? 0}/emp · GST {p.gstPct}%</div>
              <div className="flex gap-2 mt-3">
                <Button size="sm" variant="outline" className="flex-1" onClick={() => setEditing(p)}><Settings2 className="h-3 w-3 mr-1" />Configure</Button>
                <Button size="sm" variant="ghost" onClick={() => { if (confirm(`Delete ${p.name}?`)) deletePlan(p.id); }}><Trash2 className="h-4 w-4 text-destructive" /></Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {editing && (
        <Dialog open onOpenChange={(o) => !o && setEditing(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>Configure — {editing.name}</DialogTitle></DialogHeader>
            <PlanEditor plan={editing} onSave={(patch) => { updatePlan(editing.id, patch); toast.success("Saved"); setEditing(null); }} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

function PlanEditor({ plan, onSave }: { plan: Plan; onSave: (p: Partial<Plan>) => void }) {
  const [name, setName] = useState(plan.name);
  const [desc, setDesc] = useState(plan.description ?? "");
  const [cycle, setCycle] = useState<BillingCycle>(plan.cycle);
  const [pricing, setPricing] = useState<PricingModel>(plan.pricing);
  const [basePrice, setBasePrice] = useState(plan.basePrice);
  const [perEmp, setPerEmp] = useState(plan.perEmployeePrice ?? 0);
  const [gst, setGst] = useState(plan.gstPct);
  const [trial, setTrial] = useState(plan.trialDays);
  const [grace, setGrace] = useState(plan.gracePeriodDays);
  const [active, setActive] = useState(plan.active);
  const [modules, setModules] = useState(plan.modules);
  const [flags, setFlags] = useState(plan.featureFlags);
  const [limits, setLimits] = useState<PlanLimits>(plan.limits);

  return (
    <Tabs defaultValue="basics" className="space-y-4">
      <TabsList className="flex-wrap h-auto">
        <TabsTrigger value="basics">Basics</TabsTrigger>
        <TabsTrigger value="modules">Modules</TabsTrigger>
        <TabsTrigger value="features">Feature flags</TabsTrigger>
        <TabsTrigger value="limits">Limits</TabsTrigger>
      </TabsList>

      <TabsContent value="basics" className="grid sm:grid-cols-2 gap-3">
        <div><Label>Name</Label><Input value={name} onChange={(e) => setName(e.target.value)} /></div>
        <div><Label>Description</Label><Input value={desc} onChange={(e) => setDesc(e.target.value)} /></div>
        <div><Label>Cycle</Label>
          <select className="w-full h-10 rounded-md border bg-background px-3 text-sm" value={cycle} onChange={(e) => setCycle(e.target.value as BillingCycle)}>
            {CYCLES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div><Label>Pricing model</Label>
          <select className="w-full h-10 rounded-md border bg-background px-3 text-sm" value={pricing} onChange={(e) => setPricing(e.target.value as PricingModel)}>
            {PRICINGS.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
        <div><Label>Base price</Label><Input type="number" value={basePrice} onChange={(e) => setBasePrice(+e.target.value)} /></div>
        <div><Label>Per-employee price</Label><Input type="number" value={perEmp} onChange={(e) => setPerEmp(+e.target.value)} /></div>
        <div><Label>GST %</Label><Input type="number" value={gst} onChange={(e) => setGst(+e.target.value)} /></div>
        <div><Label>Trial days</Label><Input type="number" value={trial} onChange={(e) => setTrial(+e.target.value)} /></div>
        <div><Label>Grace period (days)</Label><Input type="number" value={grace} onChange={(e) => setGrace(+e.target.value)} /></div>
        <label className="flex items-center gap-2 sm:col-span-2"><input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} />Plan is active and visible to customers</label>
      </TabsContent>

      <TabsContent value="modules" className="space-y-2 max-h-[50vh] overflow-y-auto">
        {ALL_MODULES.map((m) => (
          <div key={m.key} className="flex items-center justify-between border rounded px-3 py-2 text-sm">
            <div><div>{m.label}</div><div className="text-xs text-muted-foreground">{m.group}</div></div>
            <select className="h-8 rounded-md border bg-background px-2 text-xs" value={modules[m.key] ?? "locked"} onChange={(e) => setModules({ ...modules, [m.key]: e.target.value as ModuleStatus })}>
              {MODULE_STATUSES.map((s) => <option key={s} value={s}>{s.replace("_", " ")}</option>)}
            </select>
          </div>
        ))}
      </TabsContent>

      <TabsContent value="features" className="grid sm:grid-cols-2 gap-2 max-h-[50vh] overflow-y-auto">
        {FEATURE_KEYS.map((f) => (
          <label key={f.key} className="flex items-center justify-between border rounded px-3 py-2 text-sm">
            <span>{f.label}<span className="text-xs text-muted-foreground ml-2">({f.module})</span></span>
            <input type="checkbox" checked={!!flags[f.key]} onChange={(e) => setFlags({ ...flags, [f.key]: e.target.checked })} />
          </label>
        ))}
      </TabsContent>

      <TabsContent value="limits" className="grid sm:grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto">
        {(Object.keys(limits) as (keyof PlanLimits)[]).map((k) => (
          <div key={k}>
            <Label className="capitalize">{String(k).replace(/([A-Z])/g, " $1")}</Label>
            <Input type="number" value={limits[k]} onChange={(e) => setLimits({ ...limits, [k]: +e.target.value })} />
            <div className="text-xs text-muted-foreground mt-1">Use -1 for unlimited</div>
          </div>
        ))}
      </TabsContent>

      <DialogFooter>
        <Button onClick={() => onSave({ name, description: desc, cycle, pricing, basePrice, perEmployeePrice: perEmp, gstPct: gst, trialDays: trial, gracePeriodDays: grace, active, modules, featureFlags: flags, limits })}>Save plan</Button>
      </DialogFooter>
    </Tabs>
  );
}
