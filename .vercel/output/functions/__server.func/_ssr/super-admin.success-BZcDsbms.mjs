import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { _ as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { n as useStore } from "./store-S6gS8j3W.mjs";
import { t as useAuth } from "./auth-DdbmyJDi.mjs";
import { t as Input } from "./input-DicJzR9-.mjs";
import { i as useSuperAdmin, n as computeCompletion, t as CHECKLIST_ITEMS } from "./super-admin-store-t3kBGD03.mjs";
import { a as useBilling } from "./billing-store-rNI6wn4Z.mjs";
import { t as Badge } from "./badge-Cc0IblCb.mjs";
import { t as SuperAdminShell } from "./super-admin-shell-CGd3Qf5E.mjs";
import { t as Progress } from "./progress-Crx1Tb8I.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/super-admin.success-BZcDsbms.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SuccessPage() {
	const nav = useNavigate();
	const { user, isSuperAdmin, loading } = useAuth();
	const demoMode = useStore((st) => st.demoMode);
	const { subscriptions, plans, invoices } = useBilling();
	const { demoTenants } = useStore();
	const { checklists, setChecklistItem, tickets } = useSuperAdmin();
	const [q, setQ] = (0, import_react.useState)("");
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
	const scored = (0, import_react.useMemo)(() => {
		const combined = [];
		demoTenants.forEach((t) => combined.push({
			id: t.id,
			name: t.name,
			plan: t.plan,
			status: t.status
		}));
		return combined.filter((r) => !q || r.name.toLowerCase().includes(q.toLowerCase()));
	}, [demoTenants, q]).map((r) => {
		const sub = subscriptions.find((s) => s.tenantId === r.id);
		const cl = checklists[r.id] ?? Object.fromEntries(CHECKLIST_ITEMS.map((c) => [c.key, false]));
		const setupPct = computeCompletion(cl);
		const paidInv = invoices.filter((i) => i.tenantId === r.id && i.status === "paid").length;
		const daysToExpiry = sub ? Math.max(-30, Math.ceil((Date.parse(sub.expiresAt) - Date.now()) / 864e5)) : 0;
		const openTickets = tickets.filter((t) => t.tenantId === r.id && t.status !== "closed" && t.status !== "resolved").length;
		const usage = sub ? sub.usage.aiCredits + sub.usage.pdfDownloads + sub.usage.documents : 0;
		const usageScore = Math.min(40, Math.round(usage / 5));
		const paymentScore = Math.min(20, paidInv * 4);
		const renewalScore = daysToExpiry > 15 ? 15 : daysToExpiry > 0 ? 8 : -10;
		const ticketPenalty = openTickets * 5;
		const health = Math.max(0, Math.min(100, Math.round(setupPct * .25 + usageScore + paymentScore + renewalScore - ticketPenalty)));
		return {
			r,
			sub,
			cl,
			setupPct,
			health,
			churn: Math.max(0, 100 - health),
			openTickets,
			daysToExpiry
		};
	}).sort((a, b) => b.health - a.health);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SuperAdminShell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-end justify-between gap-3 mb-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-display text-2xl font-semibold",
			children: "Customer Success"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted-foreground",
			children: "Health score, implementation progress, renewal probability, churn risk."
		})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
			value: q,
			onChange: (e) => setQ(e.target.value),
			placeholder: "Search company",
			className: "w-64"
		})]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-3",
		children: [scored.map(({ r, sub, cl, setupPct, health, churn, openTickets, daysToExpiry }) => {
			const plan = sub ? plans.find((p) => p.id === sub.planId) : void 0;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border bg-card p-4 shadow-card",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center justify-between gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-medium",
							children: r.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-xs text-muted-foreground",
							children: [
								plan?.name ?? r.plan,
								" · ",
								r.status,
								" · ",
								openTickets,
								" open tickets · ",
								daysToExpiry >= 0 ? `${daysToExpiry}d to renewal` : `Expired ${Math.abs(daysToExpiry)}d ago`
							]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-4 items-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-right",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[11px] uppercase text-muted-foreground",
									children: "Health"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: `text-lg font-semibold ${health > 70 ? "text-success" : health > 40 ? "text-amber-600" : "text-destructive"}`,
									children: health
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-right",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[11px] uppercase text-muted-foreground",
									children: "Churn risk"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: `text-lg font-semibold ${churn < 30 ? "text-success" : churn < 60 ? "text-amber-600" : "text-destructive"}`,
									children: [churn, "%"]
								})]
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid md:grid-cols-3 gap-3 mt-3 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-xs text-muted-foreground mb-1",
								children: [
									"Setup completion — ",
									setupPct,
									"%"
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, { value: setupPct })] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs text-muted-foreground mb-1",
								children: "Renewal likelihood"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, { value: 100 - churn })] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs text-muted-foreground mb-1",
								children: "Usage index"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, { value: sub ? Math.min(100, (sub.usage.aiCredits + sub.usage.documents) / 5) : 0 })] })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
						className: "mt-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("summary", {
							className: "text-xs text-muted-foreground cursor-pointer",
							children: "Implementation checklist"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid sm:grid-cols-2 md:grid-cols-3 gap-1 mt-2",
							children: CHECKLIST_ITEMS.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex items-center justify-between border rounded px-2 py-1.5 text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: c.label }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "checkbox",
									checked: !!cl[c.key],
									onChange: (e) => setChecklistItem(r.id, c.key, e.target.checked)
								})]
							}, c.key))
						})]
					}),
					(churn > 50 || openTickets > 2) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 rounded-lg bg-amber-500/10 border border-amber-500/40 text-xs p-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: "outline",
							className: "mr-2",
							children: "AI hint"
						}), churn > 50 ? "Elevated churn risk — schedule a retention call and offer a coupon." : "Ticket volume rising — assign a dedicated CSM."]
					})
				]
			}, r.id);
		}), scored.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "p-10 text-center text-sm text-muted-foreground rounded-xl border",
			children: "No companies yet."
		})]
	})] });
}
//#endregion
export { SuccessPage as component };
