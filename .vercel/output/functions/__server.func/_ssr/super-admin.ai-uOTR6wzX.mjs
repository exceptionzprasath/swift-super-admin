import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { _ as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { r as createServerFn } from "./ssr.mjs";
import { a as unknownType, i as stringType, n as enumType, r as objectType, t as arrayType } from "../_libs/zod.mjs";
import { n as useStore } from "./store-S6gS8j3W.mjs";
import { R as LoaderCircle, d as Sparkles, h as Send, z as Lightbulb } from "../_libs/lucide-react.mjs";
import { t as useAuth } from "./auth-DdbmyJDi.mjs";
import { t as Button } from "./button-DRsC1qZi.mjs";
import { t as Input } from "./input-DicJzR9-.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { i as useSuperAdmin, n as computeCompletion } from "./super-admin-store-t3kBGD03.mjs";
import { a as useBilling } from "./billing-store-rNI6wn4Z.mjs";
import { t as Badge } from "./badge-Cc0IblCb.mjs";
import { t as SuperAdminShell } from "./super-admin-shell-CGd3Qf5E.mjs";
import { t as createSsrRpc } from "./createSsrRpc-B2Izd0c7.mjs";
import { t as Markdown } from "../_libs/react-markdown+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/super-admin.ai-uOTR6wzX.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var InputSchema = objectType({
	messages: arrayType(objectType({
		role: enumType([
			"user",
			"assistant",
			"system"
		]),
		content: stringType().max(2e4)
	})).min(1).max(30),
	snapshot: unknownType()
});
var askSwiftAi = createServerFn({ method: "POST" }).inputValidator((input) => InputSchema.parse(input)).handler(createSsrRpc("af211be017b1f11806ab14644bd9fb219a3adb1d3414d2bf890a471ecad5d6d9"));
var SUGGESTIONS = [
	"Which companies have not renewed?",
	"Which companies are not using Payroll?",
	"Which companies have compliance due this month?",
	"Which customers require urgent follow-up?",
	"Which modules generate the highest revenue?",
	"Which companies are growing rapidly?"
];
function SuperAiPage() {
	const nav = useNavigate();
	const { user, isSuperAdmin, loading } = useAuth();
	const demoMode = useStore((st) => st.demoMode);
	const { plans, subscriptions, invoices, coupons, reminderLog } = useBilling();
	const { demoTenants } = useStore();
	const { tickets, touchpoints, checklists } = useSuperAdmin();
	const [messages, setMessages] = (0, import_react.useState)([]);
	const [input, setInput] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
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
	const snapshot = (0, import_react.useMemo)(() => ({
		role: "super_admin",
		generatedAt: (/* @__PURE__ */ new Date()).toISOString(),
		companies: demoTenants.map((t) => ({
			id: t.id,
			name: t.name,
			plan: t.plan,
			status: t.status,
			employees: t.employees,
			demo: true
		})),
		plans: plans.map((p) => ({
			id: p.id,
			name: p.name,
			price: p.basePrice,
			cycle: p.cycle
		})),
		subscriptions: subscriptions.map((s) => ({
			tenantId: s.tenantId,
			planId: s.planId,
			status: s.status,
			paymentStatus: s.paymentStatus,
			expiresAt: s.expiresAt,
			usage: s.usage
		})),
		invoices: invoices.slice(0, 60).map((i) => ({
			tenantId: i.tenantId,
			total: i.total,
			status: i.status,
			issueDate: i.issueDate,
			kind: i.kind
		})),
		tickets: tickets.map((t) => ({
			tenantId: t.tenantId,
			subject: t.subject,
			priority: t.priority,
			status: t.status
		})),
		touchpoints: touchpoints.slice(0, 40),
		completion: Object.fromEntries(Object.entries(checklists).map(([k, v]) => [k, computeCompletion(v)])),
		activeCoupons: coupons.filter((c) => c.active).map((c) => ({
			code: c.code,
			kind: c.kind,
			value: c.value
		})),
		remindersSent: reminderLog.length
	}), [
		demoTenants,
		plans,
		subscriptions,
		invoices,
		tickets,
		touchpoints,
		checklists,
		coupons,
		reminderLog
	]);
	const insights = (0, import_react.useMemo)(() => {
		const list = [];
		const upcoming = subscriptions.filter((s) => Date.parse(s.expiresAt) - Date.now() < 15 * 864e5 && Date.parse(s.expiresAt) > Date.now());
		if (upcoming.length) list.push({
			icon: Lightbulb,
			tone: "warn",
			label: `${upcoming.length} subscriptions renew within 15 days — trigger reminders.`
		});
		const failed = invoices.filter((i) => i.status === "overdue");
		if (failed.length) list.push({
			icon: Lightbulb,
			tone: "warn",
			label: `${failed.length} invoices overdue — assign to collections.`
		});
		const highTx = tickets.filter((t) => t.priority === "urgent" || t.priority === "high");
		if (highTx.length) list.push({
			icon: Lightbulb,
			tone: "warn",
			label: `${highTx.length} high/urgent tickets open — escalate to CSM.`
		});
		const noPayroll = subscriptions.filter((s) => (s.usage.pdfDownloads ?? 0) === 0);
		if (noPayroll.length) list.push({
			icon: Lightbulb,
			tone: "info",
			label: `${noPayroll.length} companies haven't processed payroll yet — send an activation nudge.`
		});
		if (list.length === 0) list.push({
			icon: Sparkles,
			tone: "success",
			label: "Platform looks healthy. No urgent super-admin actions."
		});
		return list;
	}, [
		subscriptions,
		invoices,
		tickets
	]);
	async function send(text) {
		if (!text.trim() || busy) return;
		const next = [...messages, {
			role: "user",
			content: text
		}];
		setMessages(next);
		setInput("");
		setBusy(true);
		try {
			const res = await askSwiftAi({ data: {
				messages: next,
				snapshot
			} });
			if (res.ok) setMessages([...next, {
				role: "assistant",
				content: res.content
			}]);
			else toast.error(res.error);
		} catch (e) {
			toast.error(e.message ?? "AI request failed");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SuperAdminShell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex items-end justify-between gap-3 mb-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
			className: "font-display text-2xl font-semibold flex items-center gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-5 w-5 text-primary" }), " Super AI"]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted-foreground",
			children: "Asks answered from live platform data. Recommendations updated continuously."
		})] })
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid lg:grid-cols-3 gap-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "lg:col-span-2 rounded-2xl border bg-card shadow-card flex flex-col min-h-[60vh]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex-1 p-4 overflow-auto space-y-3",
				children: [
					messages.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-sm text-muted-foreground",
						children: ["Try one of these:", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex gap-2 flex-wrap mt-2",
							children: SUGGESTIONS.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "outline",
								onClick: () => send(s),
								children: s
							}, s))
						})]
					}),
					messages.map((m, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: `rounded-lg p-3 text-sm ${m.role === "user" ? "bg-primary/10" : "bg-muted"}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[10px] uppercase text-muted-foreground mb-1",
							children: m.role
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "prose prose-sm max-w-none",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Markdown, { children: m.content })
						})]
					}, i)),
					busy && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-xs text-muted-foreground flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-3 w-3 animate-spin" }), " Thinking…"]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "border-t p-3 flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: input,
					onChange: (e) => setInput(e.target.value),
					onKeyDown: (e) => e.key === "Enter" && send(input),
					placeholder: "Ask about renewals, usage, revenue, churn…"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: () => send(input),
					disabled: busy,
					className: "bg-gradient-brand text-white",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "h-4 w-4" })
				})]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-2xl border bg-card shadow-card p-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-sm font-medium mb-2 flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lightbulb, { className: "h-4 w-4 text-primary" }), " AI recommendations"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "space-y-2",
					children: insights.map((i, k) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: `text-sm rounded-md border p-2 ${i.tone === "warn" ? "border-amber-500/40 bg-amber-500/10" : i.tone === "success" ? "border-success/40 bg-success/10" : ""}`,
						children: i.label
					}, k))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 text-xs text-muted-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: "outline",
						className: "mr-1",
						children: "Live"
					}), "Snapshot regenerated on every message. AI answers only from the data above."]
				})
			]
		})]
	})] });
}
//#endregion
export { SuperAiPage as component };
