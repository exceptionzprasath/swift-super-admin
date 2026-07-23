import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { _ as useNavigate, g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { n as useStore } from "./store-S6gS8j3W.mjs";
import { T as Plus, m as Settings2, s as Trash2, ut as ArrowLeft } from "../_libs/lucide-react.mjs";
import { t as useAuth } from "./auth-DdbmyJDi.mjs";
import { t as Button } from "./button-DRsC1qZi.mjs";
import { t as Input } from "./input-DicJzR9-.mjs";
import { t as Label } from "./label-B4PTMSG2.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as useBilling, i as makePlan, n as EMPTY_LIMITS, r as FEATURE_KEYS, t as ALL_MODULES } from "./billing-store-rNI6wn4Z.mjs";
import { t as Badge } from "./badge-Cc0IblCb.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, s as DialogTrigger, t as Dialog } from "./dialog-CiapfthD.mjs";
import { i as TabsTrigger, n as TabsContent, r as TabsList, t as Tabs } from "./tabs-BYfOmXtJ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/super-admin.plans-DHW_164n.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var MODULE_STATUSES = [
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
var CYCLES = [
	"monthly",
	"quarterly",
	"half_yearly",
	"yearly",
	"custom"
];
var PRICINGS = [
	"per_employee",
	"flat",
	"tiered",
	"usage",
	"custom"
];
function PlansPage() {
	const nav = useNavigate();
	const { user, isSuperAdmin, loading } = useAuth();
	const demoMode = useStore((st) => st.demoMode);
	const { plans, addPlan, updatePlan, deletePlan } = useBilling();
	const [editing, setEditing] = (0, import_react.useState)(null);
	const [openNew, setOpenNew] = (0, import_react.useState)(false);
	const [newName, setNewName] = (0, import_react.useState)("");
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
	const createPlan = () => {
		if (!newName.trim()) return toast.error("Name required");
		addPlan(makePlan({
			name: newName.trim(),
			limits: {
				...EMPTY_LIMITS,
				employees: 25
			}
		}));
		setNewName("");
		setOpenNew(false);
		toast.success("Plan created");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background p-4 sm:p-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-7xl mx-auto space-y-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/super-admin",
						className: "text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-3 w-3" }), "Back"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-2xl font-semibold mt-1",
						children: "Plan management"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "Create unlimited plans. Toggle modules, feature flags and limits per plan."
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, {
					open: openNew,
					onOpenChange: setOpenNew,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTrigger, {
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							className: "bg-gradient-brand text-white",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4 mr-2" }), "New plan"]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "New plan" }) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Name" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: newName,
							onChange: (e) => setNewName(e.target.value),
							placeholder: "e.g. Factory HR"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogFooter, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: createPlan,
							children: "Create"
						}) })
					] })]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid md:grid-cols-2 lg:grid-cols-3 gap-3",
				children: plans.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border bg-card p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between items-start",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-display text-lg font-semibold",
								children: p.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-xs text-muted-foreground",
								children: [
									p.cycle,
									" · ",
									p.pricing
								]
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: p.active ? "default" : "outline",
								children: p.active ? "Active" : "Inactive"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-2xl font-semibold mt-2",
							children: [
								"₹",
								p.basePrice.toLocaleString(),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-normal text-muted-foreground",
									children: " base"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-xs text-muted-foreground",
							children: [
								"+ ₹",
								p.perEmployeePrice ?? 0,
								"/emp · GST ",
								p.gstPct,
								"%"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2 mt-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "sm",
								variant: "outline",
								className: "flex-1",
								onClick: () => setEditing(p),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings2, { className: "h-3 w-3 mr-1" }), "Configure"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "ghost",
								onClick: () => {
									if (confirm(`Delete ${p.name}?`)) deletePlan(p.id);
								},
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4 text-destructive" })
							})]
						})
					]
				}, p.id))
			})]
		}), editing && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open: true,
			onOpenChange: (o) => !o && setEditing(null),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
				className: "max-w-4xl max-h-[90vh] overflow-y-auto",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, { children: ["Configure — ", editing.name] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlanEditor, {
					plan: editing,
					onSave: (patch) => {
						updatePlan(editing.id, patch);
						toast.success("Saved");
						setEditing(null);
					}
				})]
			})
		})]
	});
}
function PlanEditor({ plan, onSave }) {
	const [name, setName] = (0, import_react.useState)(plan.name);
	const [desc, setDesc] = (0, import_react.useState)(plan.description ?? "");
	const [cycle, setCycle] = (0, import_react.useState)(plan.cycle);
	const [pricing, setPricing] = (0, import_react.useState)(plan.pricing);
	const [basePrice, setBasePrice] = (0, import_react.useState)(plan.basePrice);
	const [perEmp, setPerEmp] = (0, import_react.useState)(plan.perEmployeePrice ?? 0);
	const [gst, setGst] = (0, import_react.useState)(plan.gstPct);
	const [trial, setTrial] = (0, import_react.useState)(plan.trialDays);
	const [grace, setGrace] = (0, import_react.useState)(plan.gracePeriodDays);
	const [active, setActive] = (0, import_react.useState)(plan.active);
	const [modules, setModules] = (0, import_react.useState)(plan.modules);
	const [flags, setFlags] = (0, import_react.useState)(plan.featureFlags);
	const [limits, setLimits] = (0, import_react.useState)(plan.limits);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
		defaultValue: "basics",
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
				className: "flex-wrap h-auto",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
						value: "basics",
						children: "Basics"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
						value: "modules",
						children: "Modules"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
						value: "features",
						children: "Feature flags"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
						value: "limits",
						children: "Limits"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
				value: "basics",
				className: "grid sm:grid-cols-2 gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Name" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: name,
						onChange: (e) => setName(e.target.value)
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Description" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: desc,
						onChange: (e) => setDesc(e.target.value)
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Cycle" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
						className: "w-full h-10 rounded-md border bg-background px-3 text-sm",
						value: cycle,
						onChange: (e) => setCycle(e.target.value),
						children: CYCLES.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: c,
							children: c
						}, c))
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Pricing model" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
						className: "w-full h-10 rounded-md border bg-background px-3 text-sm",
						value: pricing,
						onChange: (e) => setPricing(e.target.value),
						children: PRICINGS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: p,
							children: p
						}, p))
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Base price" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "number",
						value: basePrice,
						onChange: (e) => setBasePrice(+e.target.value)
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Per-employee price" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "number",
						value: perEmp,
						onChange: (e) => setPerEmp(+e.target.value)
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "GST %" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "number",
						value: gst,
						onChange: (e) => setGst(+e.target.value)
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Trial days" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "number",
						value: trial,
						onChange: (e) => setTrial(+e.target.value)
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Grace period (days)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "number",
						value: grace,
						onChange: (e) => setGrace(+e.target.value)
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex items-center gap-2 sm:col-span-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							checked: active,
							onChange: (e) => setActive(e.target.checked)
						}), "Plan is active and visible to customers"]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
				value: "modules",
				className: "space-y-2 max-h-[50vh] overflow-y-auto",
				children: ALL_MODULES.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between border rounded px-3 py-2 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: m.label }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs text-muted-foreground",
						children: m.group
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
						className: "h-8 rounded-md border bg-background px-2 text-xs",
						value: modules[m.key] ?? "locked",
						onChange: (e) => setModules({
							...modules,
							[m.key]: e.target.value
						}),
						children: MODULE_STATUSES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: s,
							children: s.replace("_", " ")
						}, s))
					})]
				}, m.key))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
				value: "features",
				className: "grid sm:grid-cols-2 gap-2 max-h-[50vh] overflow-y-auto",
				children: FEATURE_KEYS.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "flex items-center justify-between border rounded px-3 py-2 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [f.label, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-xs text-muted-foreground ml-2",
						children: [
							"(",
							f.module,
							")"
						]
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "checkbox",
						checked: !!flags[f.key],
						onChange: (e) => setFlags({
							...flags,
							[f.key]: e.target.checked
						})
					})]
				}, f.key))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
				value: "limits",
				className: "grid sm:grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto",
				children: Object.keys(limits).map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						className: "capitalize",
						children: String(k).replace(/([A-Z])/g, " $1")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "number",
						value: limits[k],
						onChange: (e) => setLimits({
							...limits,
							[k]: +e.target.value
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs text-muted-foreground mt-1",
						children: "Use -1 for unlimited"
					})
				] }, k))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogFooter, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				onClick: () => onSave({
					name,
					description: desc,
					cycle,
					pricing,
					basePrice,
					perEmployeePrice: perEmp,
					gstPct: gst,
					trialDays: trial,
					gracePeriodDays: grace,
					active,
					modules,
					featureFlags: flags,
					limits
				}),
				children: "Save plan"
			}) })
		]
	});
}
//#endregion
export { PlansPage as component };
