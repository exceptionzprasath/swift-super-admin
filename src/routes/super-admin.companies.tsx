import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/lib/auth";
import { useBilling } from "@/lib/billing-store";
import { useStore } from "@/lib/store";
import { useSuperAdmin, CHECKLIST_ITEMS, computeCompletion } from "@/lib/super-admin-store";
import { SuperAdminShell } from "@/components/super-admin-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ALL_MODULES, FEATURE_KEYS, type ModuleStatus, type PlanLimits } from "@/lib/billing";
import { toast } from "sonner";
import {
  Search, Play, Pause, Trash2, Copy, LogIn, Loader2, PowerOff, RotateCcw, Lock, Eye, EyeOff,
} from "lucide-react";


export const Route = createFileRoute("/super-admin/companies")({
  head: () => ({ meta: [{ title: "Companies · Super Admin" }] }),
  component: CompaniesPage,
});

type Row = {
  id: string; name: string; slug: string; plan: string; status: string;
  createdAt: string; employees: number; source: "cloud" | "demo";
};

function CompaniesPage() {
  const nav = useNavigate();
  const { user, isSuperAdmin, loading, setActiveTenant } = useAuth();
  const demoMode = useStore((st) => st.demoMode);
  const { plans, subscriptions, invoices, ensureSubscription, updateSubscription } = useBilling();
  const { seedDemo } = useStore();
  const { checklists, recordImpersonation, tickets, tenants, addTenant, deleteTenant, updateTenant } = useSuperAdmin();

  const [companies, setCompanies] = useState<Row[]>([]);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<string>("all");
  const [busy, setBusy] = useState(false);
  const [detail, setDetail] = useState<Row | null>(null);

  const [createOpen, setCreateOpen] = useState(false);
  const [createName, setCreateName] = useState("");
  const [createSlug, setCreateSlug] = useState("");
  const [createLegalName, setCreateLegalName] = useState("");
  const [createEmployees, setCreateEmployees] = useState(0);
  const [createPlan, setCreatePlan] = useState("");
  const [createStatus, setCreateStatus] = useState("trial");
  const [createAdminEmail, setCreateAdminEmail] = useState("");
  const [createAdminPassword, setCreateAdminPassword] = useState("");

  const handleNameChange = (val: string) => {
    setCreateName(val);
    setCreateLegalName(val);
    setCreateSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""));
  };

  useEffect(() => {
    if (plans.length > 0 && !createPlan) {
      setCreatePlan(plans[0].id);
    }
  }, [plans, createPlan]);

  useEffect(() => {
    if (loading) return;
    if (!user && !demoMode) { nav({ to: "/login" }); return; }
    if (!isSuperAdmin && !demoMode) { nav({ to: "/login" }); return; }
    void reload();
  }, [user, isSuperAdmin, loading, nav]);

  useEffect(() => { void reload(); /* refresh when tenants change */ }, [tenants]);

  async function reload() {
    setBusy(true);
    const demo: Row[] = tenants.map((t) => ({
      id: t.id, name: t.name, slug: t.slug, plan: t.plan, status: t.status,
      createdAt: t.createdAt, employees: t.employees, source: "cloud",
    }));
    setCompanies(demo);
    setBusy(false);
  }

  const filtered = useMemo(() => companies.filter((c) => {
    if (filter !== "all" && c.status !== filter) return false;
    if (q && !c.name.toLowerCase().includes(q.toLowerCase()) && !c.slug.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  }), [companies, q, filter]);

  async function setStatus(row: Row, next: string) {
    await updateTenant(row.id, { status: next });
    toast.success(`${row.name} → ${next}`);
    void reload();
  }

  async function remove(row: Row) {
    if (!confirm(`Delete ${row.name}? Data will be soft-marked in audit log.`)) return;
    await deleteTenant(row.id);
    toast.success("Removed");
    void reload();
  }

  async function clone(row: Row) {
    await addTenant({
      name: `${row.name} (copy)`, slug: `${row.slug}-copy`, legalName: row.name,
      plan: row.plan, status: "trial", employees: row.employees,
    });
    toast.success("Cloned company");
  }

  async function impersonate(row: Row) {
    recordImpersonation(row.id, user?.email ?? "super_admin", `Impersonated ${row.name}`);
    setActiveTenant(row.id);
    seedDemo("admin");
    toast.success(`Now viewing ${row.name}`);
    const adminUrl = import.meta.env.VITE_COMPANY_ADMIN_URL || "http://localhost:5174";
    window.location.href = `${adminUrl}/login?impersonateTenantId=${row.id}&impersonateRole=admin`;
  }

  return (
    <SuperAdminShell>
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-4">
        <div>
          <h1 className="font-display text-2xl font-semibold">Companies</h1>
          <p className="text-sm text-muted-foreground">Manage every tenant on the platform.</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-2.5 top-2.5 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search company or slug" className="pl-8 w-64" />
          </div>
          <select className="h-10 rounded-md border bg-background px-3 text-sm"
            value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="trial">Trial</option>
            <option value="suspended">Suspended</option>
          </select>
          <Button size="sm" onClick={() => setCreateOpen(true)}>+ New tenant</Button>
        </div>

      </div>

      <div className="rounded-2xl border border-border bg-card shadow-card overflow-hidden">
        {busy ? (
          <div className="p-10 text-center text-sm text-muted-foreground"><Loader2 className="h-5 w-5 animate-spin mx-auto mb-2" /> Loading…</div>
        ) : filtered.length === 0 ? (
          <div className="p-10 text-center text-sm text-muted-foreground">No companies match your filter.</div>
        ) : (
          <ul className="divide-y divide-border">
            {filtered.map((c) => {
              const sub = subscriptions.find((s) => s.tenantId === c.id);
              const plan = sub ? plans.find((p) => p.id === sub.planId) : undefined;
              const pct = computeCompletion(checklists[c.id] ?? Object.create(null));
              const openTx = tickets.filter((t) => t.tenantId === c.id && t.status !== "closed" && t.status !== "resolved").length;
              return (
                <li key={c.id} className="p-4 flex flex-wrap gap-3 items-center hover:bg-muted/40 transition-colors">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-medium truncate">{c.name}</span>
                      <Badge variant="outline" className="text-xs">{c.plan}</Badge>
                      <Badge variant={c.status === "active" ? "default" : c.status === "trial" ? "secondary" : "outline"} className="text-xs capitalize">{c.status}</Badge>
                      {c.source === "demo" && <Badge variant="outline" className="text-xs">Demo</Badge>}
                      {plan && <span className="text-xs text-muted-foreground">Sub: {plan.name}</span>}
                      {openTx > 0 && <Badge variant="destructive" className="text-xs">{openTx} tickets</Badge>}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      /{c.slug} · {c.employees} employees · Created {new Date(c.createdAt).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <Progress value={pct} className="w-40" />
                      <span className="text-xs text-muted-foreground">{pct}% setup</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    <Button size="sm" variant="outline" onClick={() => setDetail(c)}>View</Button>
                    <Button size="sm" variant="outline" onClick={() => impersonate(c)}><LogIn className="h-3.5 w-3.5 mr-1" />Enter</Button>
                    <Button size="sm" variant="ghost" onClick={() => clone(c)}><Copy className="h-4 w-4" /></Button>
                    {c.status !== "active" ? (
                      <Button size="sm" variant="ghost" onClick={() => setStatus(c, "active")}><Play className="h-4 w-4 text-success" /></Button>
                    ) : (
                      <Button size="sm" variant="ghost" onClick={() => setStatus(c, "suspended")}><Pause className="h-4 w-4 text-amber-600" /></Button>
                    )}
                    <Button size="sm" variant="ghost" onClick={() => setStatus(c, "deactivated")}><PowerOff className="h-4 w-4" /></Button>
                    <Button size="sm" variant="ghost" onClick={() => remove(c)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    {!sub && <Button size="sm" variant="ghost" onClick={() => { ensureSubscription(c.id); toast.success("Subscription initialised"); }}>Init sub</Button>}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {detail && (
        <Dialog open onOpenChange={(o) => !o && setDetail(null)}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>{detail.name}</DialogTitle></DialogHeader>
            <CompanyDetail row={detail} />
          </DialogContent>
        </Dialog>
      )}

      {createOpen && (
        <Dialog open onOpenChange={(o) => !o && setCreateOpen(false)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Register a new company tenant</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-3">
              <div className="space-y-1.5">
                <Label>Company name</Label>
                <Input value={createName} onChange={(e) => handleNameChange(e.target.value)} placeholder="Acme Manufacturing" />
              </div>
              <div className="space-y-1.5">
                <Label>Legal name</Label>
                <Input value={createLegalName} onChange={(e) => setCreateLegalName(e.target.value)} placeholder="Acme Manufacturing Pvt Ltd" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Slug</Label>
                  <Input value={createSlug} onChange={(e) => setCreateSlug(e.target.value)} placeholder="acme" />
                </div>
                <div className="space-y-1.5">
                  <Label>Employees</Label>
                  <Input type="number" value={createEmployees} onChange={(e) => setCreateEmployees(parseInt(e.target.value) || 0)} placeholder="0" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Plan</Label>
                  <select value={createPlan} onChange={(e) => setCreatePlan(e.target.value)} className="w-full h-10 rounded-md border bg-background px-3 text-sm">
                    {plans.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label>Status</Label>
                  <select value={createStatus} onChange={(e) => setCreateStatus(e.target.value)} className="w-full h-10 rounded-md border bg-background px-3 text-sm">
                    <option value="trial">Trial</option>
                    <option value="active">Active</option>
                    <option value="suspended">Suspended</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Work Email</Label>
                  <Input type="email" value={createAdminEmail} onChange={(e) => setCreateAdminEmail(e.target.value)} placeholder="admin@acme.com" />
                </div>
                <div className="space-y-1.5">
                  <Label>Password</Label>
                  <Input type="password" value={createAdminPassword} onChange={(e) => setCreateAdminPassword(e.target.value)} placeholder="••••••••" />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
                <Button className="bg-gradient-brand text-white shadow-glow" onClick={async () => {
                  if (!createName || !createSlug) {
                    toast.error("Please fill in company name and slug");
                    return;
                  }
                  setBusy(true);
                  try {
                    const t = await addTenant({
                      name: createName,
                      slug: createSlug,
                      legalName: createLegalName,
                      plan: createPlan,
                      status: createStatus,
                      employees: createEmployees,
                      adminEmail: createAdminEmail,
                      adminPassword: createAdminPassword
                    });
                    await ensureSubscription(t.id, createPlan);
                    toast.success("Tenant registered successfully");
                    setCreateOpen(false);
                    setCreateName("");
                    setCreateSlug("");
                    setCreateLegalName("");
                    setCreateEmployees(0);
                    setCreateStatus("trial");
                    setCreateAdminEmail("");
                    setCreateAdminPassword("");
                    void reload();
                  } catch (e: any) {
                    toast.error(e.message || "Failed to create tenant");
                  } finally {
                    setBusy(false);
                  }
                }}>Register tenant</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </SuperAdminShell>
  );
}

function CompanyDetail({ row }: { row: Row }) {
  const {
    plans, subscriptions, invoices, ensureSubscription, updateSubscription,
    upgrade, downgrade, renew, setModuleOverride, setFeatureOverride, setLimitOverride,
  } = useBilling();
  const { tickets, touchpoints, checklists, setChecklistItem, tenants, updateTenant } = useSuperAdmin();
  const sub = subscriptions.find((s) => s.tenantId === row.id);

  const tenantDetails = tenants.find((t) => t.id === row.id);
  const [email, setEmail] = useState(tenantDetails?.adminEmail || "");
  const [password, setPassword] = useState(tenantDetails?.adminPassword || "");
  const [payrollLockPassword, setPayrollLockPassword] = useState(tenantDetails?.payrollLockPassword || "");
  const [showPassword, setShowPassword] = useState(false);
  const [showPayrollPassword, setShowPayrollPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (tenantDetails) {
      setEmail(tenantDetails.adminEmail || "");
      setPassword(tenantDetails.adminPassword || "");
      setPayrollLockPassword(tenantDetails.payrollLockPassword || "");
    }
  }, [tenantDetails]);

  const handleSaveCredentials = async () => {
    if (!email.trim()) {
      toast.error("Admin Email/Username cannot be empty");
      return;
    }
    setIsSaving(true);
    try {
      const success = await updateTenant(row.id, {
        adminEmail: email.trim(),
        adminPassword: password.trim(),
        payrollLockPassword: payrollLockPassword.trim(),
      });
      if (success) {
        toast.success("Admin credentials & Payroll Lock password updated successfully");
      } else {
        toast.error("Failed to update credentials on server");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to update credentials");
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    if (!sub) {
      void ensureSubscription(row.id);
    }
  }, [sub, row.id, ensureSubscription]);

  if (!sub) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-5 w-5 animate-spin mr-2" />
        <span className="text-sm text-muted-foreground">Initializing subscription...</span>
      </div>
    );
  }

  const plan = plans.find((p) => p.id === sub.planId);
  const cl = checklists[row.id] ?? Object.fromEntries(CHECKLIST_ITEMS.map((c) => [c.key, false])) as any;
  const inv = invoices.filter((i) => i.tenantId === row.id);
  const tx = tickets.filter((t) => t.tenantId === row.id);
  const tp = touchpoints.filter((t) => t.tenantId === row.id);

  const MODULE_STATUSES: ModuleStatus[] = ["enabled", "trial", "read_only", "locked", "expired", "coming_soon", "disabled", "purchased", "custom"];
  const effectiveModule = (k: import("@/lib/billing").ModuleKey): ModuleStatus =>
    (sub.moduleOverrides[k] as ModuleStatus) ?? (plan?.modules[k] as ModuleStatus) ?? "locked";

  const effectiveFeature = (k: string): boolean =>
    sub.featureOverrides[k] ?? !!plan?.featureFlags[k];
  const effectiveLimit = (k: keyof PlanLimits): number =>
    (sub.limitOverrides as any)[k] ?? plan?.limits[k] ?? 0;

  return (
    <Tabs defaultValue="profile" className="space-y-3">
      <TabsList className="flex-wrap h-auto">
        <TabsTrigger value="profile">Profile</TabsTrigger>
        <TabsTrigger value="credentials">Credentials</TabsTrigger>
        <TabsTrigger value="sub">Subscription</TabsTrigger>
        <TabsTrigger value="access">Access & Overrides</TabsTrigger>
        <TabsTrigger value="invoices">Invoices</TabsTrigger>
        <TabsTrigger value="tickets">Tickets</TabsTrigger>
        <TabsTrigger value="crm">CRM</TabsTrigger>
        <TabsTrigger value="checklist">Checklist</TabsTrigger>
      </TabsList>

      <TabsContent value="profile" className="grid grid-cols-2 gap-3 text-sm">
        <KV label="Slug" val={row.slug} />
        <KV label="Plan" val={row.plan} />
        <KV label="Status" val={row.status} />
        <KV label="Source" val={row.source} />
        <KV label="Employees" val={String(row.employees)} />
        <KV label="Created" val={new Date(row.createdAt).toLocaleString()} />
      </TabsContent>

      <TabsContent value="credentials" className="space-y-4 text-sm mt-2">
        <div className="rounded-lg border p-4 space-y-4">
          <div>
            <h3 className="font-semibold text-sm">Reset Admin Credentials</h3>
            <p className="text-xs text-muted-foreground">
              Update the login credentials for this company's owner/administrator account.
            </p>
          </div>
          
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label>Admin Username (Email)</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@company.com"
              />
            </div>
            
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label>New Password</Label>
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 cursor-pointer focus:outline-none"
                >
                  {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
              />
            </div>

            {/* Change Password for Payroll Lock Option */}
            <div className="space-y-1.5 pt-3 border-t border-border/60">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-1.5 font-medium">
                  <Lock className="h-3.5 w-3.5 text-primary" />
                  Change Password for Payroll Lock
                </Label>
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPayrollPassword(!showPayrollPassword)}
                  className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 cursor-pointer focus:outline-none"
                >
                  {showPayrollPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  {showPayrollPassword ? "Hide" : "Show"}
                </button>
              </div>
              <Input
                type={showPayrollPassword ? "text" : "password"}
                value={payrollLockPassword}
                onChange={(e) => setPayrollLockPassword(e.target.value)}
                placeholder="Enter new password for payroll lock"
              />
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                This password is required by admins when locking or unlocking monthly payroll periods in the Admin Panel. If left empty, payroll locking in the Admin Panel will not be permitted.
              </p>
            </div>

            <Button
              className="w-full bg-gradient-brand text-white shadow-glow mt-2"
              onClick={handleSaveCredentials}
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Update Credentials"}
            </Button>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="sub" className="space-y-3 text-sm">
        <div className="grid grid-cols-2 gap-3">
          <KV label="Plan" val={plan?.name ?? sub.planId} />
          <KV label="Cycle" val={sub.cycle} />
          <KV label="Status" val={sub.status} />
          <KV label="Payment" val={sub.paymentStatus} />
          <KV label="Activated" val={new Date(sub.activatedAt).toLocaleDateString()} />
          <KV label="Expires" val={new Date(sub.expiresAt).toLocaleDateString()} />
        </div>
        <div className="rounded-lg border p-3">
          <div className="text-xs uppercase text-muted-foreground mb-2">Change plan</div>
          <div className="flex flex-wrap gap-2 items-end">
            <div className="flex-1 min-w-[220px]">
              <Label className="text-xs">Target plan</Label>
              <select
                className="w-full h-10 rounded-md border bg-background px-3 text-sm"
                value={sub.planId}
                onChange={(e) => {
                  const to = e.target.value;
                  const emp = Math.max(1, row.employees || 1);
                  const cur = plans.find((p) => p.id === sub.planId);
                  const next = plans.find((p) => p.id === to);
                  if (!next) return;
                  if ((next.basePrice ?? 0) >= (cur?.basePrice ?? 0)) {
                    upgrade(sub.id, to, emp, { immediate: true, actor: "super_admin" });
                    toast.success(`Upgraded to ${next.name}`);
                  } else {
                    downgrade(sub.id, to, "super_admin");
                    toast.success(`Downgraded to ${next.name}`);
                  }
                }}
              >
                {plans.map((p) => <option key={p.id} value={p.id}>{p.name} · ₹{p.basePrice}</option>)}
              </select>
            </div>
            <Button size="sm" variant="outline" onClick={() => { renew(sub.id, Math.max(1, row.employees || 1), { actor: "super_admin" }); toast.success("Renewal invoice created"); }}>Renew now</Button>
          </div>
        </div>
        <div className="rounded-lg border p-3">
          <div className="text-xs uppercase text-muted-foreground mb-2">Usage</div>
          <div className="grid grid-cols-3 gap-2 text-xs">
            {Object.entries(sub.usage).map(([k, v]) => (
              <div key={k} className="flex justify-between"><span className="text-muted-foreground">{k}</span><span className="font-medium">{v}</span></div>
            ))}
          </div>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => { updateSubscription(sub.id, { status: "active" }); toast.success("Activated"); }}>Activate</Button>
          <Button size="sm" variant="outline" onClick={() => { updateSubscription(sub.id, { status: "grace" }); toast.success("Grace period"); }}>Grace</Button>
          <Button size="sm" variant="outline" onClick={() => { updateSubscription(sub.id, { status: "suspended" }); toast.success("Suspended"); }}>Suspend</Button>
        </div>
      </TabsContent>

      <TabsContent value="access" className="space-y-4 text-sm">
        <div className="text-xs text-muted-foreground">
          Overrides apply only to <b>{row.name}</b> and take precedence over the plan defaults.
          Click <RotateCcw className="inline h-3 w-3" /> to fall back to the plan value.
        </div>

        <div>
          <div className="font-medium mb-2">Modules ({ALL_MODULES.length})</div>
          <div className="grid sm:grid-cols-2 gap-2 max-h-[42vh] overflow-y-auto pr-1">
            {ALL_MODULES.map((m) => {
              const overridden = sub.moduleOverrides[m.key] !== undefined;
              return (
                <div key={m.key} className="flex items-center justify-between border rounded px-3 py-2 gap-2">
                  <div className="min-w-0">
                    <div className="truncate">{m.label}</div>
                    <div className="text-[11px] text-muted-foreground">{m.group}{overridden && <span className="ml-1 text-primary">· override</span>}</div>
                  </div>
                  <div className="flex items-center gap-1">
                    <select
                      className="h-8 rounded-md border bg-background px-2 text-xs"
                      value={effectiveModule(m.key)}
                      onChange={(e) => { setModuleOverride(sub.id, m.key, e.target.value as ModuleStatus); toast.success(`${m.label} → ${e.target.value}`); }}
                    >
                      {MODULE_STATUSES.map((s) => <option key={s} value={s}>{s.replace("_", " ")}</option>)}
                    </select>
                    {overridden && (
                      <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => { setModuleOverride(sub.id, m.key, null); toast.success("Reset to plan"); }}>
                        <RotateCcw className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <div className="font-medium mb-2">Feature flags ({FEATURE_KEYS.length})</div>
          <div className="grid sm:grid-cols-2 gap-2 max-h-[40vh] overflow-y-auto pr-1">
            {FEATURE_KEYS.map((f) => {
              const overridden = sub.featureOverrides[f.key] !== undefined;
              return (
                <label key={f.key} className="flex items-center justify-between border rounded px-3 py-2 gap-2">
                  <span className="truncate">{f.label} <span className="text-[11px] text-muted-foreground">({f.module}){overridden && <span className="ml-1 text-primary">· override</span>}</span></span>
                  <span className="flex items-center gap-1">
                    <input type="checkbox" checked={effectiveFeature(f.key)} onChange={(e) => setFeatureOverride(sub.id, f.key, e.target.checked)} />
                    {overridden && (
                      <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => setFeatureOverride(sub.id, f.key, null)}>
                        <RotateCcw className="h-3 w-3" />
                      </Button>
                    )}
                  </span>
                </label>
              );
            })}
          </div>
        </div>

        <div>
          <div className="font-medium mb-2">Limits (-1 = unlimited)</div>
          <div className="grid sm:grid-cols-2 gap-2 max-h-[40vh] overflow-y-auto pr-1">
            {plan && (Object.keys(plan.limits) as (keyof PlanLimits)[]).map((k) => {
              const overridden = (sub.limitOverrides as any)[k] !== undefined;
              return (
                <div key={k} className="flex items-center gap-2 border rounded px-3 py-2">
                  <div className="flex-1 capitalize text-xs">
                    {String(k).replace(/([A-Z])/g, " $1")}
                    {overridden && <span className="ml-1 text-primary">· override</span>}
                  </div>
                  <Input
                    type="number"
                    className="h-8 w-28"
                    value={effectiveLimit(k)}
                    onChange={(e) => setLimitOverride(sub.id, k, +e.target.value)}
                  />
                  {overridden && (
                    <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => setLimitOverride(sub.id, k, null)}>
                      <RotateCcw className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </TabsContent>

      <TabsContent value="invoices">
        {inv.length === 0 ? <div className="text-sm text-muted-foreground">No invoices yet.</div> : (
          <ul className="divide-y">
            {inv.map((i) => (
              <li key={i.id} className="py-2 flex justify-between text-sm">
                <div><div className="font-medium">{i.number}</div><div className="text-xs text-muted-foreground">{new Date(i.issueDate).toLocaleDateString()} · {i.kind}</div></div>
                <div className="text-right"><div>₹{i.total.toLocaleString()}</div><Badge variant="outline" className="text-xs">{i.status}</Badge></div>
              </li>
            ))}
          </ul>
        )}
      </TabsContent>

      <TabsContent value="tickets">
        {tx.length === 0 ? <div className="text-sm text-muted-foreground">No tickets.</div> : (
          <ul className="divide-y">
            {tx.map((t) => (
              <li key={t.id} className="py-2 text-sm">
                <div className="flex justify-between"><span className="font-medium">{t.subject}</span><Badge variant="outline">{t.status}</Badge></div>
                <div className="text-xs text-muted-foreground">{t.priority} · {t.channel} · {new Date(t.createdAt).toLocaleString()}</div>
              </li>
            ))}
          </ul>
        )}
      </TabsContent>

      <TabsContent value="crm">
        {tp.length === 0 ? <div className="text-sm text-muted-foreground">No touchpoints.</div> : (
          <ul className="divide-y">
            {tp.map((t) => (
              <li key={t.id} className="py-2 text-sm flex justify-between">
                <div><div className="capitalize">{t.kind} · {t.summary}</div><div className="text-xs text-muted-foreground">{t.by} · {new Date(t.ts).toLocaleString()}</div></div>
              </li>
            ))}
          </ul>
        )}
      </TabsContent>

      <TabsContent value="checklist" className="space-y-1">
        {CHECKLIST_ITEMS.map((c) => (
          <label key={c.key} className="flex items-center justify-between border rounded px-3 py-2 text-sm">
            <span>{c.label} <span className="text-xs text-muted-foreground">({c.group})</span></span>
            <input type="checkbox" checked={!!cl[c.key]} onChange={(e) => setChecklistItem(row.id, c.key, e.target.checked)} />
          </label>
        ))}
      </TabsContent>
    </Tabs>
  );
}


function KV({ label, val }: { label: string; val: string }) {
  return (
    <div className="rounded border p-2">
      <div className="text-[11px] uppercase text-muted-foreground">{label}</div>
      <div className="text-sm font-medium">{val}</div>
    </div>
  );
}
