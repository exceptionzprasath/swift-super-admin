import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { c as HeadContent, d as createRouter, f as Outlet, g as Link, h as createRootRouteWithContext, j as redirect, m as createFileRoute, p as lazyRouteComponent, s as Scripts, v as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { t as ThemeInit } from "./theme-mF6rYaFu.mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
import { i as useSuperAdmin } from "./super-admin-store-t3kBGD03.mjs";
import { a as useBilling } from "./billing-store-rNI6wn4Z.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { t as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-C92_I1PV.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var styles_default = "/assets/styles-CJm4NI-y.css";
var Toaster$1 = ({ ...props }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
		className: "toaster group",
		toastOptions: { classNames: {
			toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
			description: "group-[.toast]:text-muted-foreground",
			actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
			cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
		} },
		...props
	});
};
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Page not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Go home"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong on our end. You can try refreshing or head back home."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Try again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$17 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "SWIFT — People. Performance. Progress." },
			{
				name: "description",
				content: "Enterprise HRMS with geo-fenced attendance, face check-in, and configurable payroll for any industry."
			},
			{
				name: "author",
				content: "SWIFT"
			},
			{
				property: "og:title",
				content: "SWIFT — People. Performance. Progress."
			},
			{
				property: "og:description",
				content: "Enterprise HRMS with geo-fenced attendance, face check-in, and configurable payroll for any industry."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary"
			},
			{
				name: "twitter:title",
				content: "SWIFT — People. Performance. Progress."
			},
			{
				name: "twitter:description",
				content: "Enterprise HRMS with geo-fenced attendance, face check-in, and configurable payroll for any industry."
			},
			{
				property: "og:image",
				content: "https://storage.googleapis.com/gpt-engineer-file-uploads/wMauJRXZpcbAEBy9uXM9XoCbIF53/social-images/social-1784253289111-Screenshot_2026-07-09_at_10.06.09_PM.webp"
			},
			{
				name: "twitter:image",
				content: "https://storage.googleapis.com/gpt-engineer-file-uploads/wMauJRXZpcbAEBy9uXM9XoCbIF53/social-images/social-1784253289111-Screenshot_2026-07-09_at_10.06.09_PM.webp"
			}
		],
		links: [{
			rel: "stylesheet",
			href: styles_default
		}]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$17.useRouteContext();
	const loadSuperAdmin = useSuperAdmin((s) => s.loadSuperAdmin);
	const loadBilling = useBilling((s) => s.loadBilling);
	(0, import_react.useEffect)(() => {
		loadSuperAdmin();
		loadBilling();
	}, [loadSuperAdmin, loadBilling]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(QueryClientProvider, {
		client: queryClient,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThemeInit, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster$1, {
				position: "top-right",
				richColors: true
			})
		]
	});
}
var $$splitComponentImporter$15 = () => import("./super-admin-demo-DxmW7cvW.mjs");
var Route$16 = createFileRoute("/super-admin-demo")({
	head: () => ({ meta: [{ title: "Super Admin · Demo · SWIFT" }] }),
	component: lazyRouteComponent($$splitComponentImporter$15, "component")
});
var $$splitComponentImporter$14 = () => import("./super-admin-CTUD_Rj0.mjs");
var Route$15 = createFileRoute("/super-admin")({ component: lazyRouteComponent($$splitComponentImporter$14, "component") });
var $$splitComponentImporter$13 = () => import("./login-DQwTFlu_.mjs");
var Route$14 = createFileRoute("/login")({
	head: () => ({ meta: [{ title: "Super Admin Sign in · SWIFT" }] }),
	component: lazyRouteComponent($$splitComponentImporter$13, "component")
});
var Route$13 = createFileRoute("/")({ beforeLoad: () => {
	throw redirect({ to: "/login" });
} });
var $$splitComponentImporter$12 = () => import("./super-admin.index-CZB2CBzm.mjs");
var Route$12 = createFileRoute("/super-admin/")({
	head: () => ({ meta: [{ title: "Super Admin · SWIFT" }] }),
	component: lazyRouteComponent($$splitComponentImporter$12, "component")
});
var $$splitComponentImporter$11 = () => import("./super-admin.whitelabel-BdG2C1KM.mjs");
var Route$11 = createFileRoute("/super-admin/whitelabel")({
	head: () => ({ meta: [{ title: "White Label · Super Admin" }] }),
	component: lazyRouteComponent($$splitComponentImporter$11, "component")
});
var $$splitComponentImporter$10 = () => import("./super-admin.support-DBaFzmsu.mjs");
var Route$10 = createFileRoute("/super-admin/support")({
	head: () => ({ meta: [{ title: "Support CRM · Super Admin" }] }),
	component: lazyRouteComponent($$splitComponentImporter$10, "component")
});
var $$splitComponentImporter$9 = () => import("./super-admin.success-BZcDsbms.mjs");
var Route$9 = createFileRoute("/super-admin/success")({
	head: () => ({ meta: [{ title: "Customer Success · Super Admin" }] }),
	component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
var $$splitComponentImporter$8 = () => import("./super-admin.plans-DHW_164n.mjs");
var Route$8 = createFileRoute("/super-admin/plans")({
	head: () => ({ meta: [{ title: "Plans · SWIFT Super Admin" }] }),
	component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
var $$splitComponentImporter$7 = () => import("./super-admin.payments-SAUo5GCs.mjs");
var Route$7 = createFileRoute("/super-admin/payments")({
	head: () => ({ meta: [{ title: "UPI Payments · SWIFT Super Admin" }] }),
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
var $$splitComponentImporter$6 = () => import("./super-admin.modules-COxmXfTd.mjs");
var Route$6 = createFileRoute("/super-admin/modules")({
	head: () => ({ meta: [{ title: "Modules & Features · Super Admin" }] }),
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
var $$splitComponentImporter$5 = () => import("./super-admin.compliance-registry-iGh776NQ.mjs");
var Route$5 = createFileRoute("/super-admin/compliance-registry")({
	head: () => ({ meta: [{ title: "Compliance Registry · Super Admin" }] }),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
var $$splitComponentImporter$4 = () => import("./super-admin.compliance-knowledge-BwqN5yvM.mjs");
var Route$4 = createFileRoute("/super-admin/compliance-knowledge")({
	head: () => ({ meta: [{ title: "Compliance Knowledge Brain · SWIFT AI" }] }),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
var $$splitComponentImporter$3 = () => import("./super-admin.companies-Dwh6J5MI.mjs");
var Route$3 = createFileRoute("/super-admin/companies")({
	head: () => ({ meta: [{ title: "Companies · Super Admin" }] }),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("./super-admin.billing-iouBYTUG.mjs");
var Route$2 = createFileRoute("/super-admin/billing")({
	head: () => ({ meta: [{ title: "Billing Ops · SWIFT" }] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("./super-admin.audit-CQ6bYAT_.mjs");
var Route$1 = createFileRoute("/super-admin/audit")({
	head: () => ({ meta: [{ title: "Audit Log · Super Admin" }] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("./super-admin.ai-uOTR6wzX.mjs");
var Route = createFileRoute("/super-admin/ai")({
	head: () => ({ meta: [{ title: "Super AI · SWIFT" }] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var SuperAdminDemoRoute = Route$16.update({
	id: "/super-admin-demo",
	path: "/super-admin-demo",
	getParentRoute: () => Route$17
});
var SuperAdminRoute = Route$15.update({
	id: "/super-admin",
	path: "/super-admin",
	getParentRoute: () => Route$17
});
var LoginRoute = Route$14.update({
	id: "/login",
	path: "/login",
	getParentRoute: () => Route$17
});
var IndexRoute = Route$13.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$17
});
var SuperAdminIndexRoute = Route$12.update({
	id: "/",
	path: "/",
	getParentRoute: () => SuperAdminRoute
});
var SuperAdminWhitelabelRoute = Route$11.update({
	id: "/whitelabel",
	path: "/whitelabel",
	getParentRoute: () => SuperAdminRoute
});
var SuperAdminSupportRoute = Route$10.update({
	id: "/support",
	path: "/support",
	getParentRoute: () => SuperAdminRoute
});
var SuperAdminSuccessRoute = Route$9.update({
	id: "/success",
	path: "/success",
	getParentRoute: () => SuperAdminRoute
});
var SuperAdminPlansRoute = Route$8.update({
	id: "/plans",
	path: "/plans",
	getParentRoute: () => SuperAdminRoute
});
var SuperAdminPaymentsRoute = Route$7.update({
	id: "/payments",
	path: "/payments",
	getParentRoute: () => SuperAdminRoute
});
var SuperAdminModulesRoute = Route$6.update({
	id: "/modules",
	path: "/modules",
	getParentRoute: () => SuperAdminRoute
});
var SuperAdminComplianceRegistryRoute = Route$5.update({
	id: "/compliance-registry",
	path: "/compliance-registry",
	getParentRoute: () => SuperAdminRoute
});
var SuperAdminComplianceKnowledgeRoute = Route$4.update({
	id: "/compliance-knowledge",
	path: "/compliance-knowledge",
	getParentRoute: () => SuperAdminRoute
});
var SuperAdminCompaniesRoute = Route$3.update({
	id: "/companies",
	path: "/companies",
	getParentRoute: () => SuperAdminRoute
});
var SuperAdminBillingRoute = Route$2.update({
	id: "/billing",
	path: "/billing",
	getParentRoute: () => SuperAdminRoute
});
var SuperAdminAuditRoute = Route$1.update({
	id: "/audit",
	path: "/audit",
	getParentRoute: () => SuperAdminRoute
});
var SuperAdminRouteChildren = {
	SuperAdminAiRoute: Route.update({
		id: "/ai",
		path: "/ai",
		getParentRoute: () => SuperAdminRoute
	}),
	SuperAdminAuditRoute,
	SuperAdminBillingRoute,
	SuperAdminCompaniesRoute,
	SuperAdminComplianceKnowledgeRoute,
	SuperAdminComplianceRegistryRoute,
	SuperAdminModulesRoute,
	SuperAdminPaymentsRoute,
	SuperAdminPlansRoute,
	SuperAdminSuccessRoute,
	SuperAdminSupportRoute,
	SuperAdminWhitelabelRoute,
	SuperAdminIndexRoute
};
var rootRouteChildren = {
	IndexRoute,
	LoginRoute,
	SuperAdminRoute: SuperAdminRoute._addFileChildren(SuperAdminRouteChildren),
	SuperAdminDemoRoute
};
var routeTree = Route$17._addFileChildren(rootRouteChildren)._addFileTypes();
var getRouter = () => {
	return createRouter({
		routeTree,
		context: { queryClient: new QueryClient() },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };
