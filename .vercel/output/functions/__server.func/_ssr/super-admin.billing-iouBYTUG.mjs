import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { _ as useNavigate, g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { n as useStore } from "./store-S6gS8j3W.mjs";
import { G as Gift, Q as ClipboardList, T as Plus, l as Ticket, o as TrendingUp, s as Trash2, ut as ArrowLeft } from "../_libs/lucide-react.mjs";
import { t as useAuth } from "./auth-DdbmyJDi.mjs";
import { t as Button } from "./button-DRsC1qZi.mjs";
import { t as Input } from "./input-DicJzR9-.mjs";
import { t as Label } from "./label-B4PTMSG2.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as useBilling } from "./billing-store-rNI6wn4Z.mjs";
import { t as Badge } from "./badge-Cc0IblCb.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, s as DialogTrigger, t as Dialog } from "./dialog-CiapfthD.mjs";
import { i as TabsTrigger, n as TabsContent, r as TabsList, t as Tabs } from "./tabs-BYfOmXtJ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/super-admin.billing-iouBYTUG.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function BillingOpsPage() {
	const nav = useNavigate();
	const { user, isSuperAdmin, loading } = useAuth();
	const demoMode = useStore((st) => st.demoMode);
	const { plans, subscriptions, invoices, coupons, referralPrograms, referrals, addCoupon, updateCoupon, deleteCoupon, addReferralProgram, updateReferralProgram, deleteReferralProgram, audit } = useBilling();
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
	const stats = (0, import_react.useMemo)(() => {
		const paid = invoices.filter((i) => i.status === "paid");
		const revenue = paid.reduce((a, i) => a + i.total, 0);
		const monthly = paid.filter((i) => Date.parse(i.issueDate) > Date.now() - 30 * 864e5).reduce((a, i) => a + i.total, 0);
		const yearly = paid.filter((i) => Date.parse(i.issueDate) > Date.now() - 365 * 864e5).reduce((a, i) => a + i.total, 0);
		return {
			total: subscriptions.length,
			active: subscriptions.filter((s) => s.status === "active").length,
			trial: subscriptions.filter((s) => s.status === "trial").length,
			expired: subscriptions.filter((s) => s.status === "suspended" || s.status === "cancelled").length,
			revenue,
			monthly,
			yearly,
			pendingPayments: invoices.filter((i) => i.status !== "paid" && i.status !== "refunded").length
		};
	}, [invoices, subscriptions]);
	const topPlans = (0, import_react.useMemo)(() => {
		const c = {};
		subscriptions.forEach((s) => {
			c[s.planId] = (c[s.planId] ?? 0) + 1;
		});
		return Object.entries(c).map(([id, n]) => ({
			plan: plans.find((p) => p.id === id)?.name ?? id,
			n
		})).sort((a, b) => b.n - a.n).slice(0, 5);
	}, [subscriptions, plans]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen bg-background p-4 sm:p-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-7xl mx-auto space-y-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/super-admin",
					className: "text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-3 w-3" }), "Back"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-2xl font-semibold mt-1",
					children: "Billing operations"
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 md:grid-cols-4 gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							label: "Companies",
							value: stats.total
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							label: "Active",
							value: stats.active,
							tone: "success"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							label: "Trial",
							value: stats.trial
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							label: "Suspended",
							value: stats.expired,
							tone: "warn"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							label: "Total revenue",
							value: `₹${stats.revenue.toLocaleString()}`
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							label: "Last 30 days",
							value: `₹${stats.monthly.toLocaleString()}`
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							label: "Last 365 days",
							value: `₹${stats.yearly.toLocaleString()}`
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							label: "Pending payments",
							value: stats.pendingPayments,
							tone: "warn"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
					defaultValue: "subs",
					className: "space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
							className: "flex-wrap h-auto",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
									value: "subs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "h-4 w-4 mr-1" }), "Subscriptions"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
									value: "invoices",
									children: "Invoices"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
									value: "coupons",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ticket, { className: "h-4 w-4 mr-1" }), "Coupons"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
									value: "referrals",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Gift, { className: "h-4 w-4 mr-1" }), "Referrals"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
									value: "audit",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClipboardList, { className: "h-4 w-4 mr-1" }), "Audit"]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
							value: "subs",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid md:grid-cols-3 gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "md:col-span-2 rounded-xl border bg-card p-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-medium mb-2",
										children: "All subscriptions"
									}), subscriptions.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-sm text-muted-foreground",
										children: "None yet."
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
										className: "divide-y",
										children: subscriptions.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
											className: "py-2 flex justify-between text-sm",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "font-medium",
												children: s.tenantId
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "text-xs text-muted-foreground",
												children: [
													plans.find((p) => p.id === s.planId)?.name,
													" · ",
													s.cycle,
													" · renews ",
													new Date(s.expiresAt).toLocaleDateString()
												]
											})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
												variant: "outline",
												className: "capitalize",
												children: s.status
											})]
										}, s.id))
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-xl border bg-card p-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-medium mb-2",
										children: "Top plans"
									}), topPlans.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-sm text-muted-foreground",
										children: "No data"
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
										className: "space-y-2 text-sm",
										children: topPlans.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
											className: "flex justify-between",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: p.plan }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: p.n })]
										}, p.plan))
									})]
								})]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
							value: "invoices",
							children: invoices.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-sm text-muted-foreground",
								children: "No invoices."
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "rounded-xl border bg-card divide-y",
								children: invoices.map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-3 flex justify-between text-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-medium",
										children: i.number
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-xs text-muted-foreground",
										children: [
											i.tenantId,
											" · ",
											new Date(i.issueDate).toLocaleDateString()
										]
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-right",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: ["₹", i.total.toLocaleString()] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											variant: "outline",
											className: "capitalize text-xs",
											children: i.status
										})]
									})]
								}, i.id))
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
							value: "coupons",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CouponsTab, {
								coupons,
								add: addCoupon,
								update: updateCoupon,
								del: deleteCoupon
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
							value: "referrals",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReferralsTab, {
									programs: referralPrograms,
									add: addReferralProgram,
									update: updateReferralProgram,
									del: deleteReferralProgram
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-xl border bg-card p-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-medium mb-2",
										children: "Referral ledger"
									}), referrals.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-sm text-muted-foreground",
										children: "No referrals yet."
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
										className: "divide-y",
										children: referrals.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
											className: "py-2 text-sm flex justify-between",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "font-mono",
												children: r.code
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-xs text-muted-foreground",
												children: r.tenantId
											})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "text-xs text-muted-foreground",
												children: [
													"Invited ",
													r.invited.length,
													" · Registered ",
													r.registered.length,
													" · Activated ",
													r.activated.length,
													" · Paid ",
													r.paid.length
												]
											})]
										}, r.tenantId))
									})]
								})]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
							value: "audit",
							children: audit.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-sm text-muted-foreground",
								children: "No entries."
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "rounded-xl border bg-card divide-y",
								children: audit.map((a, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "p-3 text-sm flex justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "capitalize",
										children: a.kind.replace("_", " ")
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-xs text-muted-foreground",
										children: [
											a.actor,
											" · ",
											new Date(a.ts).toLocaleString(),
											a.note ? ` · ${a.note}` : ""
										]
									})] }), a.amount && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-sm font-medium",
										children: ["₹", a.amount.toLocaleString()]
									})]
								}, i))
							})
						})
					]
				})
			]
		})
	});
}
function Stat({ label, value, tone }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl border bg-card p-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-xs text-muted-foreground",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: `text-2xl font-display font-semibold mt-1 ${tone === "success" ? "text-success" : tone === "warn" ? "text-amber-600" : ""}`,
			children: value
		})]
	});
}
function CouponsTab({ coupons, add, update, del }) {
	const [open, setOpen] = (0, import_react.useState)(false);
	const [c, setC] = (0, import_react.useState)({
		id: "",
		code: "",
		kind: "percent",
		value: 10,
		maxUses: -1,
		used: 0,
		active: true
	});
	const save = () => {
		if (!c.code.trim()) return toast.error("Code required");
		add({
			...c,
			id: crypto.randomUUID(),
			code: c.code.toUpperCase()
		});
		setC({
			id: "",
			code: "",
			kind: "percent",
			value: 10,
			maxUses: -1,
			used: 0,
			active: true
		});
		setOpen(false);
		toast.success("Coupon created");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, {
			open,
			onOpenChange: setOpen,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTrigger, {
				asChild: true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					size: "sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4 mr-2" }), "New coupon"]
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "New coupon" }) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Code" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: c.code,
							onChange: (e) => setC({
								...c,
								code: e.target.value
							})
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Kind" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							className: "w-full h-10 rounded-md border bg-background px-3 text-sm",
							value: c.kind,
							onChange: (e) => setC({
								...c,
								kind: e.target.value
							}),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "percent",
									children: "Percent"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "flat",
									children: "Flat"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "module",
									children: "Module"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "plan",
									children: "Plan"
								})
							]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Value" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "number",
							value: c.value,
							onChange: (e) => setC({
								...c,
								value: +e.target.value
							})
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Max uses (-1 = unlimited)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "number",
							value: c.maxUses,
							onChange: (e) => setC({
								...c,
								maxUses: +e.target.value
							})
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "col-span-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Expires at" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "date",
								onChange: (e) => setC({
									...c,
									expiresAt: e.target.value ? new Date(e.target.value).toISOString() : void 0
								})
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogFooter, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: save,
					children: "Create"
				}) })
			] })]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid md:grid-cols-2 gap-2",
			children: coupons.map((cp) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "border rounded-lg p-3 bg-card flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "font-mono font-semibold",
					children: cp.code
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-xs text-muted-foreground capitalize",
					children: [
						cp.kind,
						" · ",
						cp.value,
						cp.kind === "percent" ? "%" : "",
						" · used ",
						cp.used,
						"/",
						cp.maxUses === -1 ? "∞" : cp.maxUses
					]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "text-xs flex items-center gap-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							checked: cp.active,
							onChange: (e) => update(cp.id, { active: e.target.checked })
						}), "Active"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: "ghost",
						onClick: () => del(cp.id),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4 text-destructive" })
					})]
				})]
			}, cp.id))
		})]
	});
}
function ReferralsTab({ programs, add, update, del }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
			size: "sm",
			onClick: () => add({
				id: crypto.randomUUID(),
				name: "New Program",
				active: true,
				tiers: [{
					referrals: 1,
					rewardKind: "discount_pct",
					value: 5
				}]
			}),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4 mr-2" }), "New program"]
		}), programs.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-xl border bg-card p-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: p.name,
					onChange: (e) => update(p.id, { name: e.target.value }),
					className: "max-w-xs"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "text-xs flex items-center gap-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							checked: p.active,
							onChange: (e) => update(p.id, { active: e.target.checked })
						}), "Active"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: "ghost",
						onClick: () => del(p.id),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4 text-destructive" })
					})]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 space-y-2",
				children: [p.tiers.map((t, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-4 gap-2 items-end",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							className: "text-xs",
							children: "Referrals ≥"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "number",
							value: t.referrals,
							onChange: (e) => {
								const tiers = [...p.tiers];
								tiers[i] = {
									...t,
									referrals: +e.target.value
								};
								update(p.id, { tiers });
							}
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							className: "text-xs",
							children: "Reward kind"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							className: "w-full h-10 rounded-md border bg-background px-2 text-sm",
							value: t.rewardKind,
							onChange: (e) => {
								const tiers = [...p.tiers];
								tiers[i] = {
									...t,
									rewardKind: e.target.value
								};
								update(p.id, { tiers });
							},
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "discount_pct",
									children: "Discount %"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "ai_credits",
									children: "AI credits"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "storage_mb",
									children: "Storage MB"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "users",
									children: "Users"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "modules",
									children: "Modules"
								})
							]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							className: "text-xs",
							children: "Value"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "number",
							value: t.value,
							onChange: (e) => {
								const tiers = [...p.tiers];
								tiers[i] = {
									...t,
									value: +e.target.value
								};
								update(p.id, { tiers });
							}
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "ghost",
							onClick: () => update(p.id, { tiers: p.tiers.filter((_, j) => j !== i) }),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4 text-destructive" })
						})
					]
				}, i)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					size: "sm",
					variant: "outline",
					onClick: () => update(p.id, { tiers: [...p.tiers, {
						referrals: 1,
						rewardKind: "discount_pct",
						value: 5
					}] }),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4 mr-1" }), "Add tier"]
				})]
			})]
		}, p.id))]
	});
}
//#endregion
export { BillingOpsPage as component };
