import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/lib/auth";
import { useBilling } from "@/lib/billing-store";
import { useStore } from "@/lib/store";
import { useSuperAdmin, computeCompletion } from "@/lib/super-admin-store";
import { SuperAdminShell } from "@/components/super-admin-shell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Building2, Users, ShieldCheck, AlertTriangle, Activity, Wallet, TrendingUp,
  Bot, MessageSquare, FileText, Calendar, HardDrive, Send, Phone, Mail,
  Timer, Sparkles, RefreshCw, ArrowRight, Loader2, LayoutDashboard, PackageOpen,
  Puzzle, CreditCard, HeartPulse, ClipboardList, Palette, Ticket, UserCog, User,
} from "lucide-react";

export const Route = createFileRoute("/super-admin/")({
  head: () => ({ meta: [{ title: "Super Admin · SWIFT" }] }),
  component: SuperAdminDashboard,
});

type CompanyRow = {
  id: string; name: string; slug: string; plan: string; status: string;
  createdAt: string; employees: number; source: "cloud" | "demo";
};

function SuperAdminDashboard() {
  const nav = useNavigate();
  const { user, isSuperAdmin, loading } = useAuth();
  const demoMode = useStore((st) => st.demoMode);
  const { plans, subscriptions, invoices, reminderLog, audit, runRenewalScheduler } = useBilling();
  const { employees, company, attendance, docRequests } = useStore();
  const branches = company.branches ?? [];
  const { tickets, touchpoints, checklists, seedDemoOps, tenants } = useSuperAdmin();

  const [companies, setCompanies] = useState<CompanyRow[]>([]);
  const [loadingCloud, setLoadingCloud] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!user && !demoMode) { nav({ to: "/login" }); return; }
    if (!isSuperAdmin && !demoMode) { nav({ to: "/admin" }); return; }
  }, [user, isSuperAdmin, loading, nav]);

  useEffect(() => { seedDemoOps(); }, [seedDemoOps]);

  useEffect(() => {
    setLoadingCloud(true);
    const demo: CompanyRow[] = tenants.map((t) => ({
      id: t.id, name: t.name, slug: t.slug, plan: t.plan, status: t.status,
      createdAt: t.createdAt, employees: t.employees, source: "cloud",
    }));
    setCompanies(demo);
    setLoadingCloud(false);
  }, [tenants]);

  const stats = useMemo(() => {
    const paid = invoices.filter((i) => i.status === "paid");
    const today = new Date().toISOString().slice(0, 10);
    const monthlyStart = Date.now() - 30 * 86400_000;
    const yearlyStart = Date.now() - 365 * 86400_000;
    const activeSubs = subscriptions.filter((s) => s.status === "active");
    const trialSubs = subscriptions.filter((s) => s.status === "trial");
    const suspSubs = subscriptions.filter((s) => s.status === "suspended" || s.status === "cancelled");
    const expiredSubs = subscriptions.filter((s) => Date.parse(s.expiresAt) < Date.now());
    const upcoming = subscriptions.filter((s) => {
      const t = Date.parse(s.expiresAt) - Date.now();
      return t > 0 && t < 30 * 86400_000;
    });
    const usage = subscriptions.reduce((a, s) => ({
      ai: a.ai + s.usage.aiCredits,
      storage: a.storage + s.usage.storageMB,
      sms: a.sms + s.usage.smsCredits,
      whatsapp: a.whatsapp + s.usage.whatsappCredits,
      email: a.email + s.usage.emailCredits,
      docs: a.docs + s.usage.documents,
    }), { ai: 0, storage: 0, sms: 0, whatsapp: 0, email: 0, docs: 0 });
    return {
      total: companies.length,
      active: companies.filter((c) => c.status === "active").length,
      trial: companies.filter((c) => c.status === "trial").length,
      expired: companies.filter((c) => c.status === "expired" || c.status === "cancelled").length,
      suspended: companies.filter((c) => c.status === "suspended").length,
      users: 0,
      employees: companies.reduce((sum, c) => sum + (c.employees || 0), 0),
      branches: companies.reduce((sum, c) => sum + (c.id === "demo-tenant-1" ? branches.length : 1), 0),
      revenue: paid.reduce((a, i) => a + i.total, 0),
      monthly: paid.filter((i) => Date.parse(i.issueDate) > monthlyStart).reduce((a, i) => a + i.total, 0),
      yearly: paid.filter((i) => Date.parse(i.issueDate) > yearlyStart).reduce((a, i) => a + i.total, 0),
      today: paid.filter((i) => i.issueDate.startsWith(today)).reduce((a, i) => a + i.total, 0),
      pendingRenewals: subscriptions.filter((s) => s.status === "grace" || s.status === "past_due").length,
      upcomingRenewals: upcoming.length,
      failedPayments: invoices.filter((i) => i.status === "overdue").length,
      usage,
      docsGenerated: docRequests.length,
      attendanceRecords: attendance.length,
      complianceForms: subscriptions.reduce((a, s) => a + s.usage.reports, 0),
      payrollsProcessed: subscriptions.reduce((a, s) => a + s.usage.pdfDownloads, 0),
      aiConversations: subscriptions.reduce((a, s) => a + s.usage.aiCredits, 0),
      liveActive: companies.filter((c) => c.status === "active").length,
      openTickets: tickets.filter((t) => t.status !== "closed" && t.status !== "resolved").length,
    };
  }, [companies, subscriptions, invoices, branches, attendance, docRequests, tickets]);

  const upcomingList = subscriptions
    .filter((s) => Date.parse(s.expiresAt) - Date.now() > 0 && Date.parse(s.expiresAt) - Date.now() < 45 * 86400_000)
    .sort((a, b) => Date.parse(a.expiresAt) - Date.parse(b.expiresAt))
    .slice(0, 6);

  const recentRevenue = invoices
    .filter((i) => i.status === "paid")
    .sort((a, b) => Date.parse(b.issueDate) - Date.parse(a.issueDate))
    .slice(0, 6);

  const topCompletion = companies
    .map((c) => ({ ...c, pct: computeCompletion(checklists[c.id] ?? Object.create(null)) }))
    .sort((a, b) => b.pct - a.pct)
    .slice(0, 5);

  const portalMap = [
    { to: "/super-admin", label: "Executive Dashboard", icon: LayoutDashboard, count: stats.total, unit: "companies" },
    { to: "/super-admin/companies", label: "Companies", icon: Building2, count: companies.length, unit: "tenants" },
    { to: "/super-admin/plans", label: "Plans & Pricing", icon: PackageOpen, count: plans.length, unit: "plans" },
    { to: "/super-admin/modules", label: "Modules & Features", icon: Puzzle, count: plans.reduce((a, p) => a + Object.keys(p.modules).length, 0), unit: "grants" },
    { to: "/super-admin/billing", label: "Billing & Invoices", icon: CreditCard, count: invoices.length, unit: "invoices" },
    { to: "/super-admin/payments", label: "UPI Payments", icon: Wallet, count: useSuperAdmin.getState().paymentSubmissions.filter(p => p.status === "pending").length, unit: "pending" },

    { to: "/super-admin/support", label: "Support CRM", icon: Ticket, count: tickets.length, unit: "tickets" },
    { to: "/super-admin/success", label: "Customer Success", icon: HeartPulse, count: Object.keys(checklists).length, unit: "checklists" },
    { to: "/super-admin/ai", label: "Super AI", icon: Sparkles, count: stats.aiConversations, unit: "credits" },
    { to: "/super-admin/audit", label: "Audit Log", icon: ClipboardList, count: audit.length, unit: "events" },
    { to: "/super-admin/whitelabel", label: "White-label", icon: Palette, count: 1, unit: "brand" },
  ];

  return (
    <SuperAdminShell>
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-2xl sm:text-3xl font-semibold">Executive Dashboard</h1>
          </div>
          <p className="text-sm text-muted-foreground">Live command center for the entire SWIFT SaaS platform.</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" size="sm" onClick={() => runRenewalScheduler()}>
            <RefreshCw className="h-4 w-4 mr-2" /> Run scheduler
          </Button>
          <Link to="/super-admin/companies"><Button size="sm" className="bg-gradient-brand text-white">
            <Building2 className="h-4 w-4 mr-2" /> Manage companies
          </Button></Link>
        </div>
      </div>

      <section className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="font-display text-sm font-semibold">Portal Map · route reachability</div>
            <div className="text-xs text-muted-foreground">Every super-admin surface with live counts — click to jump in.</div>
          </div>
          <Badge variant="outline" className="text-success border-success/40"><Activity className="h-3 w-3 mr-1" />All routes live</Badge>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {portalMap.map((r) => (
            <Link key={r.to} to={r.to} className="group rounded-xl border bg-card p-3 hover:border-primary/50 hover:shadow-soft transition-all">
              <div className="flex items-center justify-between">
                <r.icon className="h-4 w-4 text-primary" />
                <ArrowRight className="h-3 w-3 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <div className="mt-2 text-sm font-medium truncate">{r.label}</div>
              <div className="text-xs text-muted-foreground">{r.count} {r.unit}</div>
            </Link>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        <Kpi label="Total companies" value={stats.total} icon={Building2} loading={loadingCloud} />
        <Kpi label="Active" value={stats.active} tone="success" icon={ShieldCheck} />
        <Kpi label="Trial" value={stats.trial} icon={Timer} />
        <Kpi label="Expired" value={stats.expired} tone="warn" icon={AlertTriangle} />
        <Kpi label="Suspended" value={stats.suspended} tone="warn" icon={AlertTriangle} />
        <Kpi label="Employees" value={stats.employees} icon={Users} />
        <Kpi label="Branches" value={stats.branches} icon={Building2} />
        <Kpi label="Live active" value={stats.liveActive} tone="success" icon={Activity} />
        <Kpi label="Open tickets" value={stats.openTickets} icon={MessageSquare} />
        <Kpi label="Failed payments" value={stats.failedPayments} tone="warn" icon={AlertTriangle} />
        <Kpi label="Pending renewals" value={stats.pendingRenewals} icon={Timer} />
        <Kpi label="Upcoming (30d)" value={stats.upcomingRenewals} icon={Calendar} />
      </section>

      <section className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
        <Kpi label="Today's collection" value={`₹${stats.today.toLocaleString()}`} tone="success" icon={Wallet} />
        <Kpi label="Monthly revenue" value={`₹${stats.monthly.toLocaleString()}`} icon={TrendingUp} />
        <Kpi label="Annual revenue" value={`₹${stats.yearly.toLocaleString()}`} icon={TrendingUp} />
        <Kpi label="Lifetime revenue" value={`₹${stats.revenue.toLocaleString()}`} icon={Wallet} />
      </section>

      <section className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 mt-4">
        <Kpi label="AI credits used" value={stats.usage.ai} icon={Bot} />
        <Kpi label="Storage (MB)" value={stats.usage.storage} icon={HardDrive} />
        <Kpi label="SMS sent" value={stats.usage.sms} icon={Phone} />
        <Kpi label="WhatsApp" value={stats.usage.whatsapp} icon={Send} />
        <Kpi label="Emails" value={stats.usage.email} icon={Mail} />
        <Kpi label="Docs generated" value={stats.docsGenerated} icon={FileText} />
        <Kpi label="Compliance forms" value={stats.complianceForms} icon={ShieldCheck} />
        <Kpi label="Payrolls processed" value={stats.payrollsProcessed} icon={Wallet} />
        <Kpi label="Attendance records" value={stats.attendanceRecords} icon={Activity} />
        <Kpi label="AI conversations" value={stats.aiConversations} icon={Bot} />
        <Kpi label="Touchpoints" value={touchpoints.length} icon={MessageSquare} />
        <Kpi label="Reminders sent" value={reminderLog.length} icon={Send} />
      </section>

      <section className="grid lg:grid-cols-3 gap-4 mt-6">
        <Card title="Upcoming renewals" cta={<Link to="/super-admin/billing" className="text-xs text-primary">All →</Link>}>
          {upcomingList.length === 0 ? <Empty label="No renewals in the next 45 days." /> : (
            <ul className="divide-y divide-border">
              {upcomingList.map((s) => {
                const plan = plans.find((p) => p.id === s.planId);
                const days = Math.ceil((Date.parse(s.expiresAt) - Date.now()) / 86400_000);
                return (
                  <li key={s.id} className="py-2.5 flex items-center justify-between text-sm">
                    <div className="min-w-0">
                      <div className="font-medium truncate">{companies.find((c) => c.id === s.tenantId)?.name ?? s.tenantId}</div>
                      <div className="text-xs text-muted-foreground">{plan?.name} · {s.cycle}</div>
                    </div>
                    <Badge variant={days <= 7 ? "destructive" : days <= 15 ? "default" : "outline"}>{days}d</Badge>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>

        <Card title="Recent revenue" cta={<Link to="/super-admin/billing" className="text-xs text-primary">Invoices →</Link>}>
          {recentRevenue.length === 0 ? <Empty label="No paid invoices yet." /> : (
            <ul className="divide-y divide-border">
              {recentRevenue.map((i) => (
                <li key={i.id} className="py-2.5 flex items-center justify-between text-sm">
                  <div className="min-w-0">
                    <div className="font-medium truncate">{i.number}</div>
                    <div className="text-xs text-muted-foreground">{new Date(i.issueDate).toLocaleDateString()} · {i.kind}</div>
                  </div>
                  <div className="text-sm font-semibold">₹{i.total.toLocaleString()}</div>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card title="Implementation leaders" cta={<Link to="/super-admin/success" className="text-xs text-primary">All →</Link>}>
          {topCompletion.length === 0 ? <Empty label="Add companies to see progress." /> : (
            <ul className="space-y-3">
              {topCompletion.map((c) => (
                <li key={c.id} className="text-sm">
                  <div className="flex justify-between mb-1">
                    <span className="font-medium truncate">{c.name}</span>
                    <span className="text-xs text-muted-foreground">{c.pct}%</span>
                  </div>
                  <Progress value={c.pct} />
                </li>
              ))}
            </ul>
          )}
        </Card>
      </section>

      <section className="mt-6">
        <Card title="Recent platform activity" cta={<Link to="/super-admin/audit" className="text-xs text-primary">Full log →</Link>}>
          {audit.length === 0 ? <Empty label="No audit events yet." /> : (
            <ul className="divide-y divide-border max-h-80 overflow-auto">
              {audit.slice(0, 20).map((a, i) => (
                <li key={i} className="py-2 flex justify-between text-sm">
                  <div className="min-w-0">
                    <div className="capitalize">{a.kind.replace(/_/g, " ")}{a.note ? ` — ${a.note}` : ""}</div>
                    <div className="text-xs text-muted-foreground">{a.actor} · {new Date(a.ts).toLocaleString()}</div>
                  </div>
                  {a.amount ? <div className="text-sm font-medium">₹{a.amount.toLocaleString()}</div> : <ArrowRight className="h-4 w-4 text-muted-foreground" />}
                </li>
              ))}
            </ul>
          )}
        </Card>
      </section>

      <section className="mt-6 grid md:grid-cols-3 gap-3">
        <Link to="/super-admin/ai"><QuickTile icon={Sparkles} title="Ask Super AI" desc="Which companies haven't renewed? What churn risk this month?" /></Link>
        <Link to="/super-admin/support"><QuickTile icon={Ticket} title="Support CRM" desc="Tickets, meetings, WhatsApp & email history." /></Link>
        <Link to="/super-admin/whitelabel"><QuickTile icon={Palette} title="White-label" desc="Brand, domain, SMTP, SMS, WhatsApp, payment gateway." /></Link>
      </section>
    </SuperAdminShell>
  );
}

function Kpi({ label, value, icon: Icon, tone, loading }: {
  label: string; value: number | string; icon: any; tone?: "success" | "warn"; loading?: boolean;
}) {
  const cls = tone === "success" ? "text-success" : tone === "warn" ? "text-amber-600" : "text-foreground";
  return (
    <div className="rounded-xl border bg-card p-3 sm:p-4 shadow-card">
      <div className="flex items-center justify-between">
        <span className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</span>
        <Icon className="h-3.5 w-3.5 text-muted-foreground" />
      </div>
      <div className={`mt-1.5 font-display text-xl sm:text-2xl font-semibold ${cls}`}>
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : value}
      </div>
    </div>
  );
}

function Card({ title, cta, children }: { title: string; cta?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-card shadow-card p-4 sm:p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="font-display text-sm font-semibold">{title}</div>
        {cta}
      </div>
      {children}
    </div>
  );
}

function Empty({ label }: { label: string }) { return <div className="text-sm text-muted-foreground py-6 text-center">{label}</div>; }

function QuickTile({ icon: Icon, title, desc }: { icon: any; title: string; desc: string }) {
  return (
    <div className="rounded-2xl border bg-card p-4 hover:border-primary/40 transition-colors">
      <div className="flex items-center gap-2 mb-1">
        <Icon className="h-4 w-4 text-primary" />
        <div className="font-medium">{title}</div>
      </div>
      <div className="text-xs text-muted-foreground">{desc}</div>
    </div>
  );
}


