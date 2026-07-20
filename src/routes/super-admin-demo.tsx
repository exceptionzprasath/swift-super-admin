import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useStore, type DemoTenant } from "@/lib/store";
import { SwiftLogo } from "@/components/swift-logo";
import { ThemeToggle } from "@/components/theme";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  Plus, LogOut, Building2, Users, Shield, ArrowRight, Crown, Pencil, Trash2, Search,
} from "lucide-react";

export const Route = createFileRoute("/super-admin-demo")({
  head: () => ({ meta: [{ title: "Super Admin · Demo · SWIFT" }] }),
  component: SuperAdminDemoPage,
});

function SuperAdminDemoPage() {
  const nav = useNavigate();
  const {
    demoSuper, demoTenants, seedSuperDemo, addDemoTenant, updateDemoTenant, deleteDemoTenant, exitDemo, seedDemo,
  } = useStore();

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<DemoTenant | null>(null);
  const [query, setQuery] = useState("");

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [legalName, setLegalName] = useState("");
  const [plan, setPlan] = useState<DemoTenant["plan"]>("starter");
  const [status, setStatus] = useState<DemoTenant["status"]>("trial");
  const [employees, setEmployees] = useState<number>(0);

  useEffect(() => {
    if (!demoSuper) {
      seedSuperDemo();
    }
  }, [demoSuper, seedSuperDemo]);

  function resetForm() {
    setName(""); setSlug(""); setLegalName(""); setPlan("starter"); setStatus("trial"); setEmployees(0);
    setEditing(null);
  }

  function openCreate() {
    resetForm();
    setOpen(true);
  }

  function openEdit(t: DemoTenant) {
    setEditing(t);
    setName(t.name);
    setSlug(t.slug);
    setLegalName(t.legalName);
    setPlan(t.plan);
    setStatus(t.status);
    setEmployees(t.employees);
    setOpen(true);
  }

  function save() {
    if (!name.trim()) return toast.error("Company name required");
    const cleanSlug = (slug || name).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    if (editing) {
      updateDemoTenant(editing.id, { name, slug: cleanSlug, legalName: legalName || name, plan, status, employees });
      toast.success("Tenant updated");
    } else {
      addDemoTenant({ name, slug: cleanSlug, legalName: legalName || name, plan, status, employees });
      toast.success("Tenant added");
    }
    setOpen(false);
    resetForm();
  }

  function enter(_t: DemoTenant) {
    seedDemo("admin");
    toast.success(`Entering ${_t.name} workspace`);
    nav({ to: "/admin" });
  }

  function handleSignOut() {
    exitDemo();
    nav({ to: "/login" });
  }

  const filtered = demoTenants.filter((t) =>
    !query.trim() || t.name.toLowerCase().includes(query.toLowerCase()) || t.slug.includes(query.toLowerCase()),
  );

  const stats = {
    total: demoTenants.length,
    active: demoTenants.filter((t) => t.status === "active").length,
    employees: demoTenants.reduce((sum, t) => sum + t.employees, 0),
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 glass border-b border-border">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 h-14">
          <div className="flex items-center gap-3">
            <SwiftLogo />
            <Badge variant="outline" className="hidden sm:inline-flex gap-1 border-primary/40 text-primary">
              <Crown className="h-3 w-3" /> Super Admin · Demo
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 sm:mr-2" /><span className="hidden sm:inline">Sign out</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-semibold">Platform Console</h1>
            <p className="text-sm text-muted-foreground">Register, edit, and enter tenant workspaces — every company is fully isolated.</p>
          </div>
          <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) resetForm(); }}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-brand text-white shadow-glow" onClick={openCreate}>
                <Plus className="h-4 w-4 mr-2" /> Register tenant
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>{editing ? "Edit tenant" : "Register a new company tenant"}</DialogTitle>
                <DialogDescription>Onboard a new company onto SWIFT AI. Everything below is editable later.</DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2"><Label>Company name</Label><Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Acme Manufacturing" /></div>
                <div className="col-span-2"><Label>Legal name</Label><Input value={legalName} onChange={(e) => setLegalName(e.target.value)} placeholder="Acme Manufacturing Pvt Ltd" /></div>
                <div><Label>Slug</Label><Input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="acme" /></div>
                <div><Label>Employees</Label><Input type="number" value={employees} onChange={(e) => setEmployees(Number(e.target.value))} /></div>
                <div>
                  <Label>Plan</Label>
                  <Select value={plan} onValueChange={(v) => setPlan(v as DemoTenant["plan"])}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="starter">Starter</SelectItem>
                      <SelectItem value="growth">Growth</SelectItem>
                      <SelectItem value="enterprise">Enterprise</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Status</Label>
                  <Select value={status} onValueChange={(v) => setStatus(v as DemoTenant["status"])}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="trial">Trial</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => { setOpen(false); resetForm(); }}>Cancel</Button>
                <Button onClick={save} className="bg-gradient-brand text-white">
                  {editing ? "Save changes" : "Register tenant"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          <StatCard label="Tenants" value={stats.total} icon={Building2} />
          <StatCard label="Active" value={stats.active} icon={Shield} tone="success" />
          <StatCard label="Employees" value={stats.employees} icon={Users} tone="coral" />
        </div>

        <div className="rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-card">
          <div className="mb-3">
            <div className="font-display text-lg font-semibold">SaaS Control Center</div>
            <div className="text-xs text-muted-foreground">Plan pricing · module access tiers · client payment history · progress</div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
            <Link to="/super-admin/plans"><Button variant="outline" size="sm" className="w-full justify-start">📦 Plans & Pricing</Button></Link>
            <Link to="/super-admin/modules"><Button variant="outline" size="sm" className="w-full justify-start">🧩 Modules & Features</Button></Link>
            <Link to="/super-admin/billing"><Button variant="outline" size="sm" className="w-full justify-start">💳 Billing Ops</Button></Link>
            <Link to="/super-admin/companies"><Button variant="outline" size="sm" className="w-full justify-start">🏢 Companies</Button></Link>
            <Link to="/super-admin/success"><Button variant="outline" size="sm" className="w-full justify-start">📈 Client Progress</Button></Link>
            <Link to="/super-admin/support"><Button variant="outline" size="sm" className="w-full justify-start">🎧 Support CRM</Button></Link>
            <Link to="/super-admin/ai"><Button variant="outline" size="sm" className="w-full justify-start">🤖 Super AI</Button></Link>
            <Link to="/super-admin/audit"><Button variant="outline" size="sm" className="w-full justify-start">📜 Audit Log</Button></Link>
            <Link to="/super-admin/whitelabel"><Button variant="outline" size="sm" className="w-full justify-start">🎨 White-label</Button></Link>
            <Link to="/super-admin"><Button variant="outline" size="sm" className="w-full justify-start">📊 Executive Dashboard</Button></Link>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card shadow-card overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-border flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-display text-lg font-semibold">Tenants</h2>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input className="pl-9 h-9" placeholder="Search…" value={query} onChange={(e) => setQuery(e.target.value)} />
            </div>
          </div>
          {filtered.length === 0 ? (
            <div className="p-10 text-center">
              <Building2 className="h-8 w-8 mx-auto text-muted-foreground mb-3" />
              <p className="text-sm text-muted-foreground">No tenants match. Register a new one to get started.</p>
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {filtered.map((t) => (
                <li key={t.id} className="p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3 hover:bg-muted/40 transition-colors">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium truncate">{t.name}</span>
                      <Badge variant="outline" className="text-xs capitalize">{t.plan}</Badge>
                      <Badge
                        variant={t.status === "active" ? "default" : t.status === "suspended" ? "destructive" : "secondary"}
                        className="text-xs capitalize"
                      >
                        {t.status}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      /{t.slug} · {t.employees} employees · Registered {new Date(t.createdAt).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-muted-foreground truncate">{t.legalName}</div>
                  </div>
                  <div className="flex gap-1.5">
                    <Button size="sm" variant="ghost" onClick={() => openEdit(t)} title="Edit">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        if (confirm(`Delete ${t.name}?`)) {
                          deleteDemoTenant(t.id);
                          toast.success("Tenant removed");
                        }
                      }}
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => enter(t)}>
                      Enter workspace <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <p className="text-xs text-muted-foreground text-center">
          <Link to="/admin" className="hover:text-foreground">Skip to a workspace →</Link>
        </p>
      </main>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, tone }: {
  label: string; value: number; icon: any; tone?: "success" | "coral";
}) {
  const bg = tone === "success" ? "bg-success/15 text-success"
    : tone === "coral" ? "bg-coral/15 text-coral"
    : "bg-primary/15 text-primary";
  return (
    <div className="rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-card">
      <div className={`inline-flex h-9 w-9 items-center justify-center rounded-lg ${bg}`}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="mt-3 font-display text-2xl sm:text-3xl font-semibold">{value}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  );
}
