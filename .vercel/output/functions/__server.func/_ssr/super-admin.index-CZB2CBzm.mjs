import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { _ as useNavigate, g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { n as useStore } from "./store-S6gS8j3W.mjs";
import { B as LayoutDashboard, D as Phone, F as Mail, K as FileText, M as PackageOpen, P as MessageSquare, Q as ClipboardList, R as LoaderCircle, S as Puzzle, U as HeartPulse, W as HardDrive, Y as CreditCard, a as TriangleAlert, at as Building2, c as Timer, d as Sparkles, dt as Activity, h as Send, it as Calendar, j as Palette, l as Ticket, lt as ArrowRight, n as Wallet, o as TrendingUp, p as ShieldCheck, r as Users, st as Bot, y as RefreshCw } from "../_libs/lucide-react.mjs";
import { t as useAuth } from "./auth-DdbmyJDi.mjs";
import { t as Button } from "./button-DRsC1qZi.mjs";
import { i as useSuperAdmin, n as computeCompletion } from "./super-admin-store-t3kBGD03.mjs";
import { a as useBilling } from "./billing-store-rNI6wn4Z.mjs";
import { t as Badge } from "./badge-Cc0IblCb.mjs";
import { t as SuperAdminShell } from "./super-admin-shell-CGd3Qf5E.mjs";
import { t as Progress } from "./progress-Crx1Tb8I.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/super-admin.index-CZB2CBzm.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SuperAdminDashboard() {
	const nav = useNavigate();
	const { user, isSuperAdmin, loading } = useAuth();
	const demoMode = useStore((st) => st.demoMode);
	const { plans, subscriptions, invoices, reminderLog, audit, runRenewalScheduler } = useBilling();
	const { employees, company, attendance, docRequests } = useStore();
	const branches = company.branches ?? [];
	const { tickets, touchpoints, checklists, seedDemoOps, tenants } = useSuperAdmin();
	const [companies, setCompanies] = (0, import_react.useState)([]);
	const [loadingCloud, setLoadingCloud] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (loading) return;
		if (!user && !demoMode) {
			nav({ to: "/login" });
			return;
		}
		if (!isSuperAdmin && !demoMode) {
			nav({ to: "/admin" });
			return;
		}
	}, [
		user,
		isSuperAdmin,
		loading,
		nav
	]);
	(0, import_react.useEffect)(() => {
		seedDemoOps();
	}, [seedDemoOps]);
	(0, import_react.useEffect)(() => {
		setLoadingCloud(true);
		const demo = tenants.map((t) => ({
			id: t.id,
			name: t.name,
			slug: t.slug,
			plan: t.plan,
			status: t.status,
			createdAt: t.createdAt,
			employees: t.employees,
			source: "cloud"
		}));
		setCompanies(demo);
		setLoadingCloud(false);
	}, [tenants]);
	const stats = (0, import_react.useMemo)(() => {
		const paid = invoices.filter((i) => i.status === "paid");
		const today = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
		const monthlyStart = Date.now() - 30 * 864e5;
		const yearlyStart = Date.now() - 365 * 864e5;
		subscriptions.filter((s) => s.status === "active");
		subscriptions.filter((s) => s.status === "trial");
		subscriptions.filter((s) => s.status === "suspended" || s.status === "cancelled");
		subscriptions.filter((s) => Date.parse(s.expiresAt) < Date.now());
		const upcoming = subscriptions.filter((s) => {
			const t = Date.parse(s.expiresAt) - Date.now();
			return t > 0 && t < 30 * 864e5;
		});
		const usage = subscriptions.reduce((a, s) => ({
			ai: a.ai + s.usage.aiCredits,
			storage: a.storage + s.usage.storageMB,
			sms: a.sms + s.usage.smsCredits,
			whatsapp: a.whatsapp + s.usage.whatsappCredits,
			email: a.email + s.usage.emailCredits,
			docs: a.docs + s.usage.documents
		}), {
			ai: 0,
			storage: 0,
			sms: 0,
			whatsapp: 0,
			email: 0,
			docs: 0
		});
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
			openTickets: tickets.filter((t) => t.status !== "closed" && t.status !== "resolved").length
		};
	}, [
		companies,
		subscriptions,
		invoices,
		branches,
		attendance,
		docRequests,
		tickets
	]);
	const upcomingList = subscriptions.filter((s) => Date.parse(s.expiresAt) - Date.now() > 0 && Date.parse(s.expiresAt) - Date.now() < 45 * 864e5).sort((a, b) => Date.parse(a.expiresAt) - Date.parse(b.expiresAt)).slice(0, 6);
	const recentRevenue = invoices.filter((i) => i.status === "paid").sort((a, b) => Date.parse(b.issueDate) - Date.parse(a.issueDate)).slice(0, 6);
	const topCompletion = companies.map((c) => ({
		...c,
		pct: computeCompletion(checklists[c.id] ?? Object.create(null))
	})).sort((a, b) => b.pct - a.pct).slice(0, 5);
	const portalMap = [
		{
			to: "/super-admin",
			label: "Executive Dashboard",
			icon: LayoutDashboard,
			count: stats.total,
			unit: "companies"
		},
		{
			to: "/super-admin/companies",
			label: "Companies",
			icon: Building2,
			count: companies.length,
			unit: "tenants"
		},
		{
			to: "/super-admin/plans",
			label: "Plans & Pricing",
			icon: PackageOpen,
			count: plans.length,
			unit: "plans"
		},
		{
			to: "/super-admin/modules",
			label: "Modules & Features",
			icon: Puzzle,
			count: plans.reduce((a, p) => a + Object.keys(p.modules).length, 0),
			unit: "grants"
		},
		{
			to: "/super-admin/billing",
			label: "Billing & Invoices",
			icon: CreditCard,
			count: invoices.length,
			unit: "invoices"
		},
		{
			to: "/super-admin/payments",
			label: "UPI Payments",
			icon: Wallet,
			count: useSuperAdmin.getState().paymentSubmissions.filter((p) => p.status === "pending").length,
			unit: "pending"
		},
		{
			to: "/super-admin/support",
			label: "Support CRM",
			icon: Ticket,
			count: tickets.length,
			unit: "tickets"
		},
		{
			to: "/super-admin/success",
			label: "Customer Success",
			icon: HeartPulse,
			count: Object.keys(checklists).length,
			unit: "checklists"
		},
		{
			to: "/super-admin/ai",
			label: "Super AI",
			icon: Sparkles,
			count: stats.aiConversations,
			unit: "credits"
		},
		{
			to: "/super-admin/audit",
			label: "Audit Log",
			icon: ClipboardList,
			count: audit.length,
			unit: "events"
		},
		{
			to: "/super-admin/whitelabel",
			label: "White-label",
			icon: Palette,
			count: 1,
			unit: "brand"
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SuperAdminShell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex items-center gap-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-2xl sm:text-3xl font-semibold",
					children: "Executive Dashboard"
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Live command center for the entire SWIFT SaaS platform."
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-2 flex-wrap",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "outline",
					size: "sm",
					onClick: () => runRenewalScheduler(),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-4 w-4 mr-2" }), " Run scheduler"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/super-admin/companies",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						className: "bg-gradient-brand text-white",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "h-4 w-4 mr-2" }), " Manage companies"]
					})
				})]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mb-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between mb-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "font-display text-sm font-semibold",
					children: "Portal Map · route reachability"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-xs text-muted-foreground",
					children: "Every super-admin surface with live counts — click to jump in."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
					variant: "outline",
					className: "text-success border-success/40",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: "h-3 w-3 mr-1" }), "All routes live"]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2",
				children: portalMap.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: r.to,
					className: "group rounded-xl border bg-card p-3 hover:border-primary/50 hover:shadow-soft transition-all",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(r.icon, { className: "h-4 w-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-3 w-3 text-muted-foreground group-hover:text-primary transition-colors" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-2 text-sm font-medium truncate",
							children: r.label
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-xs text-muted-foreground",
							children: [
								r.count,
								" ",
								r.unit
							]
						})
					]
				}, r.to))
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
					label: "Total companies",
					value: stats.total,
					icon: Building2,
					loading: loadingCloud
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
					label: "Active",
					value: stats.active,
					tone: "success",
					icon: ShieldCheck
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
					label: "Trial",
					value: stats.trial,
					icon: Timer
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
					label: "Expired",
					value: stats.expired,
					tone: "warn",
					icon: TriangleAlert
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
					label: "Suspended",
					value: stats.suspended,
					tone: "warn",
					icon: TriangleAlert
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
					label: "Employees",
					value: stats.employees,
					icon: Users
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
					label: "Branches",
					value: stats.branches,
					icon: Building2
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
					label: "Live active",
					value: stats.liveActive,
					tone: "success",
					icon: Activity
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
					label: "Open tickets",
					value: stats.openTickets,
					icon: MessageSquare
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
					label: "Failed payments",
					value: stats.failedPayments,
					tone: "warn",
					icon: TriangleAlert
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
					label: "Pending renewals",
					value: stats.pendingRenewals,
					icon: Timer
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
					label: "Upcoming (30d)",
					value: stats.upcomingRenewals,
					icon: Calendar
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "grid grid-cols-2 md:grid-cols-4 gap-3 mt-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
					label: "Today's collection",
					value: `₹${stats.today.toLocaleString()}`,
					tone: "success",
					icon: Wallet
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
					label: "Monthly revenue",
					value: `₹${stats.monthly.toLocaleString()}`,
					icon: TrendingUp
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
					label: "Annual revenue",
					value: `₹${stats.yearly.toLocaleString()}`,
					icon: TrendingUp
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
					label: "Lifetime revenue",
					value: `₹${stats.revenue.toLocaleString()}`,
					icon: Wallet
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 mt-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
					label: "AI credits used",
					value: stats.usage.ai,
					icon: Bot
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
					label: "Storage (MB)",
					value: stats.usage.storage,
					icon: HardDrive
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
					label: "SMS sent",
					value: stats.usage.sms,
					icon: Phone
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
					label: "WhatsApp",
					value: stats.usage.whatsapp,
					icon: Send
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
					label: "Emails",
					value: stats.usage.email,
					icon: Mail
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
					label: "Docs generated",
					value: stats.docsGenerated,
					icon: FileText
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
					label: "Compliance forms",
					value: stats.complianceForms,
					icon: ShieldCheck
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
					label: "Payrolls processed",
					value: stats.payrollsProcessed,
					icon: Wallet
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
					label: "Attendance records",
					value: stats.attendanceRecords,
					icon: Activity
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
					label: "AI conversations",
					value: stats.aiConversations,
					icon: Bot
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
					label: "Touchpoints",
					value: touchpoints.length,
					icon: MessageSquare
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
					label: "Reminders sent",
					value: reminderLog.length,
					icon: Send
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "grid lg:grid-cols-3 gap-4 mt-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					title: "Upcoming renewals",
					cta: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/super-admin/billing",
						className: "text-xs text-primary",
						children: "All →"
					}),
					children: upcomingList.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { label: "No renewals in the next 45 days." }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "divide-y divide-border",
						children: upcomingList.map((s) => {
							const plan = plans.find((p) => p.id === s.planId);
							const days = Math.ceil((Date.parse(s.expiresAt) - Date.now()) / 864e5);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "py-2.5 flex items-center justify-between text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-medium truncate",
										children: companies.find((c) => c.id === s.tenantId)?.name ?? s.tenantId
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-xs text-muted-foreground",
										children: [
											plan?.name,
											" · ",
											s.cycle
										]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
									variant: days <= 7 ? "destructive" : days <= 15 ? "default" : "outline",
									children: [days, "d"]
								})]
							}, s.id);
						})
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					title: "Recent revenue",
					cta: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/super-admin/billing",
						className: "text-xs text-primary",
						children: "Invoices →"
					}),
					children: recentRevenue.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { label: "No paid invoices yet." }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "divide-y divide-border",
						children: recentRevenue.map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "py-2.5 flex items-center justify-between text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-medium truncate",
									children: i.number
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-xs text-muted-foreground",
									children: [
										new Date(i.issueDate).toLocaleDateString(),
										" · ",
										i.kind
									]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-sm font-semibold",
								children: ["₹", i.total.toLocaleString()]
							})]
						}, i.id))
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					title: "Implementation leaders",
					cta: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/super-admin/success",
						className: "text-xs text-primary",
						children: "All →"
					}),
					children: topCompletion.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { label: "Add companies to see progress." }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "space-y-3",
						children: topCompletion.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between mb-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-medium truncate",
									children: c.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-xs text-muted-foreground",
									children: [c.pct, "%"]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, { value: c.pct })]
						}, c.id))
					})
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "mt-6",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				title: "Recent platform activity",
				cta: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/super-admin/audit",
					className: "text-xs text-primary",
					children: "Full log →"
				}),
				children: audit.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { label: "No audit events yet." }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "divide-y divide-border max-h-80 overflow-auto",
					children: audit.slice(0, 20).map((a, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "py-2 flex justify-between text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "capitalize",
								children: [a.kind.replace(/_/g, " "), a.note ? ` — ${a.note}` : ""]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-xs text-muted-foreground",
								children: [
									a.actor,
									" · ",
									new Date(a.ts).toLocaleString()
								]
							})]
						}), a.amount ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-sm font-medium",
							children: ["₹", a.amount.toLocaleString()]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4 text-muted-foreground" })]
					}, i))
				})
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mt-6 grid md:grid-cols-3 gap-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/super-admin/ai",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuickTile, {
						icon: Sparkles,
						title: "Ask Super AI",
						desc: "Which companies haven't renewed? What churn risk this month?"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/super-admin/support",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuickTile, {
						icon: Ticket,
						title: "Support CRM",
						desc: "Tickets, meetings, WhatsApp & email history."
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/super-admin/whitelabel",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuickTile, {
						icon: Palette,
						title: "White-label",
						desc: "Brand, domain, SMTP, SMS, WhatsApp, payment gateway."
					})
				})
			]
		})
	] });
}
function Kpi({ label, value, icon: Icon, tone, loading }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl border bg-card p-3 sm:p-4 shadow-card",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-[11px] uppercase tracking-wide text-muted-foreground",
				children: label
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-3.5 w-3.5 text-muted-foreground" })]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: `mt-1.5 font-display text-xl sm:text-2xl font-semibold ${tone === "success" ? "text-success" : tone === "warn" ? "text-amber-600" : "text-foreground"}`,
			children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : value
		})]
	});
}
function Card({ title, cta, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-border bg-card shadow-card p-4 sm:p-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between mb-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "font-display text-sm font-semibold",
				children: title
			}), cta]
		}), children]
	});
}
function Empty({ label }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "text-sm text-muted-foreground py-6 text-center",
		children: label
	});
}
function QuickTile({ icon: Icon, title, desc }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border bg-card p-4 hover:border-primary/40 transition-colors",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-2 mb-1",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "font-medium",
				children: title
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-xs text-muted-foreground",
			children: desc
		})]
	});
}
//#endregion
export { SuperAdminDashboard as component };
