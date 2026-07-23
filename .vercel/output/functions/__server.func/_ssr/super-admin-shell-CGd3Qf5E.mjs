import { _ as useNavigate, g as Link, l as useRouterState } from "../_libs/@tanstack/react-router+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { n as useStore } from "./store-S6gS8j3W.mjs";
import { B as LayoutDashboard, I as LogOut, J as Crown, M as PackageOpen, Q as ClipboardList, S as Puzzle, U as HeartPulse, Y as CreditCard, at as Building2, ct as BookOpen, d as Sparkles, j as Palette, l as Ticket, ot as Brain, x as QrCode } from "../_libs/lucide-react.mjs";
import { n as ThemeToggle } from "./theme-mF6rYaFu.mjs";
import { t as useAuth } from "./auth-DdbmyJDi.mjs";
import { t as SwiftLogo } from "./swift-logo-wcrzygCw.mjs";
import { t as Button } from "./button-DRsC1qZi.mjs";
import { t as Badge } from "./badge-Cc0IblCb.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/super-admin-shell-CGd3Qf5E.js
var import_jsx_runtime = require_jsx_runtime();
var NAV = [
	{
		to: "/super-admin",
		label: "Dashboard",
		icon: LayoutDashboard,
		exact: true
	},
	{
		to: "/super-admin/companies",
		label: "Companies",
		icon: Building2
	},
	{
		to: "/super-admin/plans",
		label: "Plans",
		icon: PackageOpen
	},
	{
		to: "/super-admin/modules",
		label: "Modules",
		icon: Puzzle
	},
	{
		to: "/super-admin/compliance-registry",
		label: "Compliance Registry",
		icon: BookOpen
	},
	{
		to: "/super-admin/compliance-knowledge",
		label: "Knowledge Brain",
		icon: Brain
	},
	{
		to: "/super-admin/billing",
		label: "Billing Ops",
		icon: CreditCard
	},
	{
		to: "/super-admin/payments",
		label: "UPI Payments",
		icon: QrCode
	},
	{
		to: "/super-admin/support",
		label: "Support CRM",
		icon: Ticket
	},
	{
		to: "/super-admin/success",
		label: "Customer Success",
		icon: HeartPulse
	},
	{
		to: "/super-admin/ai",
		label: "Super AI",
		icon: Sparkles
	},
	{
		to: "/super-admin/audit",
		label: "Audit Log",
		icon: ClipboardList
	},
	{
		to: "/super-admin/whitelabel",
		label: "White Label",
		icon: Palette
	}
];
function SuperAdminShell({ children }) {
	const nav = useNavigate();
	const { signOut } = useAuth();
	const { demoMode, exitDemo } = useStore();
	const path = useRouterState({ select: (s) => s.location.pathname });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "sticky top-0 z-40 glass border-b border-border",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 h-14",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SwiftLogo, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
						variant: "outline",
						className: "hidden sm:inline-flex gap-1 border-primary/40 text-primary",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Crown, { className: "h-3 w-3" }), " Super Admin"]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThemeToggle, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "ghost",
						size: "sm",
						onClick: async () => {
							if (demoMode) exitDemo();
							await signOut();
							nav({ to: "/login" });
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "h-4 w-4 sm:mr-2" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "hidden sm:inline",
							children: "Sign out"
						})]
					})]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: "max-w-7xl mx-auto flex gap-1 overflow-x-auto px-2 sm:px-4 pb-2",
				children: NAV.map((n) => {
					const active = n.exact ? path === n.to : path.startsWith(n.to);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: n.to,
						className: `flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-colors ${active ? "bg-gradient-brand text-white shadow-soft" : "text-muted-foreground hover:bg-muted"}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(n.icon, { className: "h-3.5 w-3.5" }), n.label]
					}, n.to);
				})
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
			className: "max-w-7xl mx-auto p-4 sm:p-6",
			children
		})]
	});
}
//#endregion
export { SuperAdminShell as t };
