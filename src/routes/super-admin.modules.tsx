import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/lib/auth";
import { useStore } from "@/lib/store";
import { useBilling } from "@/lib/billing-store";
import { ALL_MODULES, FEATURE_KEYS, type ModuleKey, type ModuleStatus } from "@/lib/billing";
import { SuperAdminShell } from "@/components/super-admin-shell";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Search, Save } from "lucide-react";

export const Route = createFileRoute("/super-admin/modules")({
  head: () => ({ meta: [{ title: "Modules & Features · Super Admin" }] }),
  component: ModulesPage,
});

const STATUSES: ModuleStatus[] = ["enabled", "trial", "read_only", "locked", "expired", "coming_soon", "disabled", "purchased", "custom"];

function ModulesPage() {
  const nav = useNavigate();
  const { user, isSuperAdmin, loading } = useAuth();
  const demoMode = useStore((st) => st.demoMode);
  const { plans, updatePlan } = useBilling();
  const [q, setQ] = useState("");

  useEffect(() => {
    if (loading) return;
    if (!user && !demoMode) nav({ to: "/login" });
    else if (!isSuperAdmin && !demoMode) nav({ to: "/admin" });
  }, [user, isSuperAdmin, loading, nav]);

  const modules = useMemo(() => ALL_MODULES.filter((m) => !q || m.label.toLowerCase().includes(q.toLowerCase())), [q]);
  const features = useMemo(() => FEATURE_KEYS.filter((f) => !q || f.label.toLowerCase().includes(q.toLowerCase())), [q]);

  function setModuleStatus(planId: string, key: ModuleKey, status: ModuleStatus) {
    const plan = plans.find((p) => p.id === planId);
    if (!plan) return;
    updatePlan(planId, { modules: { ...plan.modules, [key]: status } });
  }
  function setFeature(planId: string, key: string, val: boolean) {
    const plan = plans.find((p) => p.id === planId);
    if (!plan) return;
    updatePlan(planId, { featureFlags: { ...plan.featureFlags, [key]: val } });
  }

  return (
    <SuperAdminShell>
      <div className="flex items-end justify-between gap-3 mb-4">
        <div>
          <h1 className="font-display text-2xl font-semibold">Module & Feature Catalog</h1>
          <p className="text-sm text-muted-foreground">Global switches across every plan. Changes propagate to tenants on next resolve.</p>
        </div>
        <div className="relative">
          <Search className="h-4 w-4 absolute left-2.5 top-2.5 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search modules/features" className="pl-8 w-64" />
        </div>
      </div>

      <Tabs defaultValue="modules">
        <TabsList>
          <TabsTrigger value="modules">Modules</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
        </TabsList>

        <TabsContent value="modules" className="space-y-2">
          <div className="rounded-2xl border bg-card overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-xs text-muted-foreground">
                <tr>
                  <th className="text-left px-3 py-2">Module</th>
                  {plans.map((p) => <th key={p.id} className="text-left px-3 py-2 whitespace-nowrap">{p.name}</th>)}
                </tr>
              </thead>
              <tbody>
                {modules.map((m) => (
                  <tr key={m.key} className="border-t">
                    <td className="px-3 py-2">
                      <div className="font-medium">{m.label}</div>
                      <div className="text-xs text-muted-foreground">{m.group}</div>
                    </td>
                    {plans.map((p) => (
                      <td key={p.id} className="px-3 py-2">
                        <select className="h-8 rounded-md border bg-background px-2 text-xs"
                          value={p.modules[m.key] ?? "locked"}
                          onChange={(e) => setModuleStatus(p.id, m.key, e.target.value as ModuleStatus)}>
                          {STATUSES.map((s) => <option key={s} value={s}>{s.replace("_", " ")}</option>)}
                        </select>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="features" className="space-y-2">
          <div className="rounded-2xl border bg-card overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-xs text-muted-foreground">
                <tr>
                  <th className="text-left px-3 py-2">Feature</th>
                  {plans.map((p) => <th key={p.id} className="text-left px-3 py-2 whitespace-nowrap">{p.name}</th>)}
                </tr>
              </thead>
              <tbody>
                {features.map((f) => (
                  <tr key={f.key} className="border-t">
                    <td className="px-3 py-2">
                      <div className="font-medium">{f.label}</div>
                      <div className="text-xs text-muted-foreground">{f.module}</div>
                    </td>
                    {plans.map((p) => (
                      <td key={p.id} className="px-3 py-2">
                        <input type="checkbox" checked={!!p.featureFlags[f.key]}
                          onChange={(e) => setFeature(p.id, f.key, e.target.checked)} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-4 text-xs text-muted-foreground flex items-center gap-2">
        <Save className="h-3.5 w-3.5" /> Autosaved locally. Deep per-tenant overrides live in the tenant subscription view.
      </div>
    </SuperAdminShell>
  );
}
