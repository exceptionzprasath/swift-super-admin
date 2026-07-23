import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { _ as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { n as useStore } from "./store-S6gS8j3W.mjs";
import { q as Download } from "../_libs/lucide-react.mjs";
import { t as useAuth } from "./auth-DdbmyJDi.mjs";
import { t as Button } from "./button-DRsC1qZi.mjs";
import { t as Input } from "./input-DicJzR9-.mjs";
import { i as useSuperAdmin } from "./super-admin-store-t3kBGD03.mjs";
import { a as useBilling } from "./billing-store-rNI6wn4Z.mjs";
import { t as Badge } from "./badge-Cc0IblCb.mjs";
import { t as SuperAdminShell } from "./super-admin-shell-CGd3Qf5E.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/super-admin.audit-CQ6bYAT_.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AuditPage() {
	const nav = useNavigate();
	const { user, isSuperAdmin, loading } = useAuth();
	const demoMode = useStore((st) => st.demoMode);
	const { audit, reminderLog } = useBilling();
	const { impersonation } = useSuperAdmin();
	const [q, setQ] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		if (loading) return;
		if (!user && !demoMode) nav({ to: "/login" });
		else if (!isSuperAdmin && !demoMode) nav({ to: "/admin" });
	}, [
		user,
		isSuperAdmin,
		loading,
		nav
	]);
	const combined = (0, import_react.useMemo)(() => {
		return [
			...audit.map((a) => ({
				ts: a.ts,
				kind: a.kind,
				actor: a.actor,
				note: a.note ?? "",
				amount: a.amount ?? 0,
				source: "billing"
			})),
			...reminderLog.map((l) => ({
				ts: l.sentAt,
				kind: `reminder_${l.stage}`,
				actor: "scheduler",
				note: `${l.channels.join(", ")} — ${l.message}`,
				amount: 0,
				source: "scheduler"
			})),
			...impersonation.map((i) => ({
				ts: i.ts,
				kind: "impersonation",
				actor: i.actor,
				note: i.note ?? `Tenant ${i.tenantId}`,
				amount: 0,
				source: "super_admin"
			}))
		].sort((a, b) => Date.parse(b.ts) - Date.parse(a.ts)).filter((r) => !q || JSON.stringify(r).toLowerCase().includes(q.toLowerCase()));
	}, [
		audit,
		reminderLog,
		impersonation,
		q
	]);
	function exportCsv() {
		const header = "timestamp,kind,actor,source,amount,note\n";
		const body = combined.map((r) => `${r.ts},${r.kind},${r.actor},${r.source},${r.amount},"${(r.note || "").replace(/"/g, "\"\"")}"`).join("\n");
		const blob = new Blob([header + body], { type: "text/csv" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `swift-audit-${Date.now()}.csv`;
		a.click();
		URL.revokeObjectURL(url);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SuperAdminShell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-end justify-between gap-3 mb-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-display text-2xl font-semibold",
			children: "Audit Log"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted-foreground",
			children: "Every action across billing, scheduler and super-admin impersonation. Nothing is permanently deleted."
		})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				value: q,
				onChange: (e) => setQ(e.target.value),
				placeholder: "Search…",
				className: "w-64"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "outline",
				onClick: exportCsv,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-4 w-4 mr-2" }), "CSV"]
			})]
		})]
	}), combined.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "p-10 text-sm text-muted-foreground text-center rounded-xl border",
		children: "No events."
	}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
		className: "rounded-2xl border bg-card divide-y max-h-[70vh] overflow-auto",
		children: combined.map((r, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
			className: "p-3 flex justify-between text-sm",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "capitalize font-medium",
				children: r.kind.replace(/_/g, " ")
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-xs text-muted-foreground",
				children: [
					r.actor,
					" · ",
					new Date(r.ts).toLocaleString(),
					" · ",
					r.source,
					r.note ? ` — ${r.note}` : ""
				]
			})] }), r.amount ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-sm font-medium",
				children: ["₹", r.amount.toLocaleString()]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
				variant: "outline",
				className: "text-xs",
				children: r.source
			})]
		}, i))
	})] });
}
//#endregion
export { AuditPage as component };
