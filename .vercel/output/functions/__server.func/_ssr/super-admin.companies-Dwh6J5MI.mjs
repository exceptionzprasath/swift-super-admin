import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { _ as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { n as useStore } from "./store-S6gS8j3W.mjs";
import { A as Pause, E as Play, L as LogIn, R as LoaderCircle, X as Copy, g as Search, s as Trash2, v as RotateCcw, w as PowerOff } from "../_libs/lucide-react.mjs";
import { t as useAuth } from "./auth-DdbmyJDi.mjs";
import { t as Button } from "./button-DRsC1qZi.mjs";
import { t as Input } from "./input-DicJzR9-.mjs";
import { t as Label } from "./label-B4PTMSG2.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { i as useSuperAdmin, n as computeCompletion, t as CHECKLIST_ITEMS } from "./super-admin-store-t3kBGD03.mjs";
import { a as useBilling, r as FEATURE_KEYS, t as ALL_MODULES } from "./billing-store-rNI6wn4Z.mjs";
import { t as Badge } from "./badge-Cc0IblCb.mjs";
import { a as DialogHeader, n as DialogContent, o as DialogTitle, t as Dialog } from "./dialog-CiapfthD.mjs";
import { t as SuperAdminShell } from "./super-admin-shell-CGd3Qf5E.mjs";
import { i as TabsTrigger, n as TabsContent, r as TabsList, t as Tabs } from "./tabs-BYfOmXtJ.mjs";
import { t as Progress } from "./progress-Crx1Tb8I.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/super-admin.companies-Dwh6J5MI.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CompaniesPage() {
	const nav = useNavigate();
	const { user, isSuperAdmin, loading, setActiveTenant } = useAuth();
	const demoMode = useStore((st) => st.demoMode);
	const { plans, subscriptions, invoices, ensureSubscription, updateSubscription } = useBilling();
	const { seedDemo } = useStore();
	const { checklists, recordImpersonation, tickets, tenants, addTenant, deleteTenant, updateTenant } = useSuperAdmin();
	const [companies, setCompanies] = (0, import_react.useState)([]);
	const [q, setQ] = (0, import_react.useState)("");
	const [filter, setFilter] = (0, import_react.useState)("all");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [detail, setDetail] = (0, import_react.useState)(null);
	const [createOpen, setCreateOpen] = (0, import_react.useState)(false);
	const [createName, setCreateName] = (0, import_react.useState)("");
	const [createSlug, setCreateSlug] = (0, import_react.useState)("");
	const [createLegalName, setCreateLegalName] = (0, import_react.useState)("");
	const [createEmployees, setCreateEmployees] = (0, import_react.useState)(0);
	const [createPlan, setCreatePlan] = (0, import_react.useState)("");
	const [createStatus, setCreateStatus] = (0, import_react.useState)("trial");
	const [createAdminEmail, setCreateAdminEmail] = (0, import_react.useState)("");
	const [createAdminPassword, setCreateAdminPassword] = (0, import_react.useState)("");
	const handleNameChange = (val) => {
		setCreateName(val);
		setCreateLegalName(val);
		setCreateSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""));
	};
	(0, import_react.useEffect)(() => {
		if (plans.length > 0 && !createPlan) setCreatePlan(plans[0].id);
	}, [plans, createPlan]);
	(0, import_react.useEffect)(() => {
		if (loading) return;
		if (!user && !demoMode) {
			nav({ to: "/login" });
			return;
		}
		if (!isSuperAdmin && !demoMode) {
			nav({ to: "/login" });
			return;
		}
		reload();
	}, [
		user,
		isSuperAdmin,
		loading,
		nav
	]);
	(0, import_react.useEffect)(() => {
		reload();
	}, [tenants]);
	async function reload() {
		setBusy(true);
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
		setBusy(false);
	}
	const filtered = (0, import_react.useMemo)(() => companies.filter((c) => {
		if (filter !== "all" && c.status !== filter) return false;
		if (q && !c.name.toLowerCase().includes(q.toLowerCase()) && !c.slug.toLowerCase().includes(q.toLowerCase())) return false;
		return true;
	}), [
		companies,
		q,
		filter
	]);
	async function setStatus(row, next) {
		await updateTenant(row.id, { status: next });
		toast.success(`${row.name} → ${next}`);
		reload();
	}
	async function remove(row) {
		if (!confirm(`Delete ${row.name}? Data will be soft-marked in audit log.`)) return;
		await deleteTenant(row.id);
		toast.success("Removed");
		reload();
	}
	async function clone(row) {
		await addTenant({
			name: `${row.name} (copy)`,
			slug: `${row.slug}-copy`,
			legalName: row.name,
			plan: row.plan,
			status: "trial",
			employees: row.employees
		});
		toast.success("Cloned company");
	}
	async function impersonate(row) {
		recordImpersonation(row.id, user?.email ?? "super_admin", `Impersonated ${row.name}`);
		setActiveTenant(row.id);
		seedDemo("admin");
		toast.success(`Now viewing ${row.name}`);
		const adminUrl = "http://localhost:5174";
		window.location.href = `${adminUrl}/login?impersonateTenantId=${row.id}&impersonateRole=admin`;
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SuperAdminShell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-2xl font-semibold",
				children: "Companies"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Manage every tenant on the platform."
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2 flex-wrap",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "h-4 w-4 absolute left-2.5 top-2.5 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: q,
							onChange: (e) => setQ(e.target.value),
							placeholder: "Search company or slug",
							className: "pl-8 w-64"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						className: "h-10 rounded-md border bg-background px-3 text-sm",
						value: filter,
						onChange: (e) => setFilter(e.target.value),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "all",
								children: "All"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "active",
								children: "Active"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "trial",
								children: "Trial"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "suspended",
								children: "Suspended"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						onClick: () => setCreateOpen(true),
						children: "+ New tenant"
					})
				]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "rounded-2xl border border-border bg-card shadow-card overflow-hidden",
			children: busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "p-10 text-center text-sm text-muted-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-5 w-5 animate-spin mx-auto mb-2" }), " Loading…"]
			}) : filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "p-10 text-center text-sm text-muted-foreground",
				children: "No companies match your filter."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "divide-y divide-border",
				children: filtered.map((c) => {
					const sub = subscriptions.find((s) => s.tenantId === c.id);
					const plan = sub ? plans.find((p) => p.id === sub.planId) : void 0;
					const pct = computeCompletion(checklists[c.id] ?? Object.create(null));
					const openTx = tickets.filter((t) => t.tenantId === c.id && t.status !== "closed" && t.status !== "resolved").length;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "p-4 flex flex-wrap gap-3 items-center hover:bg-muted/40 transition-colors",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap items-center gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-medium truncate",
											children: c.name
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											variant: "outline",
											className: "text-xs",
											children: c.plan
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											variant: c.status === "active" ? "default" : c.status === "trial" ? "secondary" : "outline",
											className: "text-xs capitalize",
											children: c.status
										}),
										c.source === "demo" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											variant: "outline",
											className: "text-xs",
											children: "Demo"
										}),
										plan && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-xs text-muted-foreground",
											children: ["Sub: ", plan.name]
										}),
										openTx > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
											variant: "destructive",
											className: "text-xs",
											children: [openTx, " tickets"]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-xs text-muted-foreground mt-1",
									children: [
										"/",
										c.slug,
										" · ",
										c.employees,
										" employees · Created ",
										new Date(c.createdAt).toLocaleDateString()
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2 mt-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, {
										value: pct,
										className: "w-40"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-xs text-muted-foreground",
										children: [pct, "% setup"]
									})]
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap gap-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									variant: "outline",
									onClick: () => setDetail(c),
									children: "View"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									size: "sm",
									variant: "outline",
									onClick: () => impersonate(c),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogIn, { className: "h-3.5 w-3.5 mr-1" }), "Enter"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									variant: "ghost",
									onClick: () => clone(c),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "h-4 w-4" })
								}),
								c.status !== "active" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									variant: "ghost",
									onClick: () => setStatus(c, "active"),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "h-4 w-4 text-success" })
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									variant: "ghost",
									onClick: () => setStatus(c, "suspended"),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pause, { className: "h-4 w-4 text-amber-600" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									variant: "ghost",
									onClick: () => setStatus(c, "deactivated"),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PowerOff, { className: "h-4 w-4" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									variant: "ghost",
									onClick: () => remove(c),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4 text-destructive" })
								}),
								!sub && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									variant: "ghost",
									onClick: () => {
										ensureSubscription(c.id);
										toast.success("Subscription initialised");
									},
									children: "Init sub"
								})
							]
						})]
					}, c.id);
				})
			})
		}),
		detail && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open: true,
			onOpenChange: (o) => !o && setDetail(null),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
				className: "max-w-3xl max-h-[90vh] overflow-y-auto",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: detail.name }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CompanyDetail, { row: detail })]
			})
		}),
		createOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open: true,
			onOpenChange: (o) => !o && setCreateOpen(false),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
				className: "max-w-md",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Register a new company tenant" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4 py-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Company name" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: createName,
								onChange: (e) => handleNameChange(e.target.value),
								placeholder: "Acme Manufacturing"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Legal name" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: createLegalName,
								onChange: (e) => setCreateLegalName(e.target.value),
								placeholder: "Acme Manufacturing Pvt Ltd"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Slug" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: createSlug,
									onChange: (e) => setCreateSlug(e.target.value),
									placeholder: "acme"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Employees" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "number",
									value: createEmployees,
									onChange: (e) => setCreateEmployees(parseInt(e.target.value) || 0),
									placeholder: "0"
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Plan" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
									value: createPlan,
									onChange: (e) => setCreatePlan(e.target.value),
									className: "w-full h-10 rounded-md border bg-background px-3 text-sm",
									children: plans.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: p.id,
										children: p.name
									}, p.id))
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Status" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									value: createStatus,
									onChange: (e) => setCreateStatus(e.target.value),
									className: "w-full h-10 rounded-md border bg-background px-3 text-sm",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "trial",
											children: "Trial"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "active",
											children: "Active"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "suspended",
											children: "Suspended"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "cancelled",
											children: "Cancelled"
										})
									]
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Work Email" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "email",
									value: createAdminEmail,
									onChange: (e) => setCreateAdminEmail(e.target.value),
									placeholder: "admin@acme.com"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Password" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "password",
									value: createAdminPassword,
									onChange: (e) => setCreateAdminPassword(e.target.value),
									placeholder: "••••••••"
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-end gap-2 pt-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								onClick: () => setCreateOpen(false),
								children: "Cancel"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								className: "bg-gradient-brand text-white shadow-glow",
								onClick: async () => {
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
										reload();
									} catch (e) {
										toast.error(e.message || "Failed to create tenant");
									} finally {
										setBusy(false);
									}
								},
								children: "Register tenant"
							})]
						})
					]
				})]
			})
		})
	] });
}
function CompanyDetail({ row }) {
	const { plans, subscriptions, invoices, ensureSubscription, updateSubscription, upgrade, downgrade, renew, setModuleOverride, setFeatureOverride, setLimitOverride } = useBilling();
	const { tickets, touchpoints, checklists, setChecklistItem } = useSuperAdmin();
	const sub = subscriptions.find((s) => s.tenantId === row.id);
	(0, import_react.useEffect)(() => {
		if (!sub) ensureSubscription(row.id);
	}, [
		sub,
		row.id,
		ensureSubscription
	]);
	if (!sub) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center justify-center p-8",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-5 w-5 animate-spin mr-2" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-sm text-muted-foreground",
			children: "Initializing subscription..."
		})]
	});
	const plan = plans.find((p) => p.id === sub.planId);
	const cl = checklists[row.id] ?? Object.fromEntries(CHECKLIST_ITEMS.map((c) => [c.key, false]));
	const inv = invoices.filter((i) => i.tenantId === row.id);
	const tx = tickets.filter((t) => t.tenantId === row.id);
	const tp = touchpoints.filter((t) => t.tenantId === row.id);
	const MODULE_STATUSES = [
		"enabled",
		"trial",
		"read_only",
		"locked",
		"expired",
		"coming_soon",
		"disabled",
		"purchased",
		"custom"
	];
	const effectiveModule = (k) => sub.moduleOverrides[k] ?? plan?.modules[k] ?? "locked";
	const effectiveFeature = (k) => sub.featureOverrides[k] ?? !!plan?.featureFlags[k];
	const effectiveLimit = (k) => sub.limitOverrides[k] ?? plan?.limits[k] ?? 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
		defaultValue: "profile",
		className: "space-y-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
				className: "flex-wrap h-auto",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
						value: "profile",
						children: "Profile"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
						value: "sub",
						children: "Subscription"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
						value: "access",
						children: "Access & Overrides"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
						value: "invoices",
						children: "Invoices"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
						value: "tickets",
						children: "Tickets"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
						value: "crm",
						children: "CRM"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
						value: "checklist",
						children: "Checklist"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
				value: "profile",
				className: "grid grid-cols-2 gap-3 text-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KV, {
						label: "Slug",
						val: row.slug
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KV, {
						label: "Plan",
						val: row.plan
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KV, {
						label: "Status",
						val: row.status
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KV, {
						label: "Source",
						val: row.source
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KV, {
						label: "Employees",
						val: String(row.employees)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KV, {
						label: "Created",
						val: new Date(row.createdAt).toLocaleString()
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
				value: "sub",
				className: "space-y-3 text-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KV, {
								label: "Plan",
								val: plan?.name ?? sub.planId
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KV, {
								label: "Cycle",
								val: sub.cycle
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KV, {
								label: "Status",
								val: sub.status
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KV, {
								label: "Payment",
								val: sub.paymentStatus
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KV, {
								label: "Activated",
								val: new Date(sub.activatedAt).toLocaleDateString()
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KV, {
								label: "Expires",
								val: new Date(sub.expiresAt).toLocaleDateString()
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-lg border p-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs uppercase text-muted-foreground mb-2",
							children: "Change plan"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap gap-2 items-end",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex-1 min-w-[220px]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "text-xs",
									children: "Target plan"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
									className: "w-full h-10 rounded-md border bg-background px-3 text-sm",
									value: sub.planId,
									onChange: (e) => {
										const to = e.target.value;
										const emp = Math.max(1, row.employees || 1);
										const cur = plans.find((p) => p.id === sub.planId);
										const next = plans.find((p) => p.id === to);
										if (!next) return;
										if ((next.basePrice ?? 0) >= (cur?.basePrice ?? 0)) {
											upgrade(sub.id, to, emp, {
												immediate: true,
												actor: "super_admin"
											});
											toast.success(`Upgraded to ${next.name}`);
										} else {
											downgrade(sub.id, to, "super_admin");
											toast.success(`Downgraded to ${next.name}`);
										}
									},
									children: plans.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
										value: p.id,
										children: [
											p.name,
											" · ₹",
											p.basePrice
										]
									}, p.id))
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "outline",
								onClick: () => {
									renew(sub.id, Math.max(1, row.employees || 1), { actor: "super_admin" });
									toast.success("Renewal invoice created");
								},
								children: "Renew now"
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-lg border p-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs uppercase text-muted-foreground mb-2",
							children: "Usage"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-3 gap-2 text-xs",
							children: Object.entries(sub.usage).map(([k, v]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground",
									children: k
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-medium",
									children: v
								})]
							}, k))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "outline",
								onClick: () => {
									updateSubscription(sub.id, { status: "active" });
									toast.success("Activated");
								},
								children: "Activate"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "outline",
								onClick: () => {
									updateSubscription(sub.id, { status: "grace" });
									toast.success("Grace period");
								},
								children: "Grace"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "outline",
								onClick: () => {
									updateSubscription(sub.id, { status: "suspended" });
									toast.success("Suspended");
								},
								children: "Suspend"
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
				value: "access",
				className: "space-y-4 text-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-xs text-muted-foreground",
						children: [
							"Overrides apply only to ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: row.name }),
							" and take precedence over the plan defaults. Click ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "inline h-3 w-3" }),
							" to fall back to the plan value."
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "font-medium mb-2",
						children: [
							"Modules (",
							ALL_MODULES.length,
							")"
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid sm:grid-cols-2 gap-2 max-h-[42vh] overflow-y-auto pr-1",
						children: ALL_MODULES.map((m) => {
							const overridden = sub.moduleOverrides[m.key] !== void 0;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between border rounded px-3 py-2 gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "truncate",
										children: m.label
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-[11px] text-muted-foreground",
										children: [m.group, overridden && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "ml-1 text-primary",
											children: "· override"
										})]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
										className: "h-8 rounded-md border bg-background px-2 text-xs",
										value: effectiveModule(m.key),
										onChange: (e) => {
											setModuleOverride(sub.id, m.key, e.target.value);
											toast.success(`${m.label} → ${e.target.value}`);
										},
										children: MODULE_STATUSES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: s,
											children: s.replace("_", " ")
										}, s))
									}), overridden && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "icon",
										variant: "ghost",
										className: "h-7 w-7",
										onClick: () => {
											setModuleOverride(sub.id, m.key, null);
											toast.success("Reset to plan");
										},
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "h-3 w-3" })
									})]
								})]
							}, m.key);
						})
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "font-medium mb-2",
						children: [
							"Feature flags (",
							FEATURE_KEYS.length,
							")"
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid sm:grid-cols-2 gap-2 max-h-[40vh] overflow-y-auto pr-1",
						children: FEATURE_KEYS.map((f) => {
							const overridden = sub.featureOverrides[f.key] !== void 0;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex items-center justify-between border rounded px-3 py-2 gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "truncate",
									children: [
										f.label,
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-[11px] text-muted-foreground",
											children: [
												"(",
												f.module,
												")",
												overridden && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "ml-1 text-primary",
													children: "· override"
												})
											]
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex items-center gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "checkbox",
										checked: effectiveFeature(f.key),
										onChange: (e) => setFeatureOverride(sub.id, f.key, e.target.checked)
									}), overridden && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "icon",
										variant: "ghost",
										className: "h-7 w-7",
										onClick: () => setFeatureOverride(sub.id, f.key, null),
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "h-3 w-3" })
									})]
								})]
							}, f.key);
						})
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-medium mb-2",
						children: "Limits (-1 = unlimited)"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid sm:grid-cols-2 gap-2 max-h-[40vh] overflow-y-auto pr-1",
						children: plan && Object.keys(plan.limits).map((k) => {
							const overridden = sub.limitOverrides[k] !== void 0;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 border rounded px-3 py-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex-1 capitalize text-xs",
										children: [String(k).replace(/([A-Z])/g, " $1"), overridden && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "ml-1 text-primary",
											children: "· override"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "number",
										className: "h-8 w-28",
										value: effectiveLimit(k),
										onChange: (e) => setLimitOverride(sub.id, k, +e.target.value)
									}),
									overridden && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "icon",
										variant: "ghost",
										className: "h-7 w-7",
										onClick: () => setLimitOverride(sub.id, k, null),
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "h-3 w-3" })
									})
								]
							}, k);
						})
					})] })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
				value: "invoices",
				children: inv.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-sm text-muted-foreground",
					children: "No invoices yet."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "divide-y",
					children: inv.map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "py-2 flex justify-between text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-medium",
							children: i.number
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-xs text-muted-foreground",
							children: [
								new Date(i.issueDate).toLocaleDateString(),
								" · ",
								i.kind
							]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-right",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: ["₹", i.total.toLocaleString()] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "outline",
								className: "text-xs",
								children: i.status
							})]
						})]
					}, i.id))
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
				value: "tickets",
				children: tx.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-sm text-muted-foreground",
					children: "No tickets."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "divide-y",
					children: tx.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "py-2 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-medium",
								children: t.subject
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "outline",
								children: t.status
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-xs text-muted-foreground",
							children: [
								t.priority,
								" · ",
								t.channel,
								" · ",
								new Date(t.createdAt).toLocaleString()
							]
						})]
					}, t.id))
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
				value: "crm",
				children: tp.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-sm text-muted-foreground",
					children: "No touchpoints."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "divide-y",
					children: tp.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: "py-2 text-sm flex justify-between",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "capitalize",
							children: [
								t.kind,
								" · ",
								t.summary
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-xs text-muted-foreground",
							children: [
								t.by,
								" · ",
								new Date(t.ts).toLocaleString()
							]
						})] })
					}, t.id))
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
				value: "checklist",
				className: "space-y-1",
				children: CHECKLIST_ITEMS.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "flex items-center justify-between border rounded px-3 py-2 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						c.label,
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-xs text-muted-foreground",
							children: [
								"(",
								c.group,
								")"
							]
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "checkbox",
						checked: !!cl[c.key],
						onChange: (e) => setChecklistItem(row.id, c.key, e.target.checked)
					})]
				}, c.key))
			})
		]
	});
}
function KV({ label, val }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded border p-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-[11px] uppercase text-muted-foreground",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-sm font-medium",
			children: val
		})]
	});
}
//#endregion
export { CompaniesPage as component };
