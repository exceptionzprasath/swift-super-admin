import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { _ as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { n as useStore } from "./store-S6gS8j3W.mjs";
import { D as Phone, F as Mail, P as MessageSquare, T as Plus, h as Send, s as Trash2 } from "../_libs/lucide-react.mjs";
import { t as useAuth } from "./auth-DdbmyJDi.mjs";
import { t as Button } from "./button-DRsC1qZi.mjs";
import { t as Input } from "./input-DicJzR9-.mjs";
import { t as Label } from "./label-B4PTMSG2.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { i as useSuperAdmin } from "./super-admin-store-t3kBGD03.mjs";
import { t as Badge } from "./badge-Cc0IblCb.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, s as DialogTrigger, t as Dialog } from "./dialog-CiapfthD.mjs";
import { t as SuperAdminShell } from "./super-admin-shell-CGd3Qf5E.mjs";
import { i as TabsTrigger, n as TabsContent, r as TabsList, t as Tabs } from "./tabs-BYfOmXtJ.mjs";
import { t as Textarea } from "./textarea-DBn9CRiI.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/super-admin.support-DBaFzmsu.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var PRIORITIES = [
	"low",
	"normal",
	"high",
	"urgent"
];
var STATUSES = [
	"open",
	"in_progress",
	"waiting",
	"resolved",
	"closed"
];
function SupportPage() {
	const nav = useNavigate();
	const { user, isSuperAdmin, loading } = useAuth();
	const demoMode = useStore((st) => st.demoMode);
	const { tickets, addTicket, updateTicket, deleteTicket, addTicketNote, touchpoints, addTouchpoint, deleteTouchpoint } = useSuperAdmin();
	const { demoTenants } = useStore();
	const [open, setOpen] = (0, import_react.useState)(false);
	const [filter, setFilter] = (0, import_react.useState)("all");
	const [detail, setDetail] = (0, import_react.useState)(null);
	const [newNote, setNewNote] = (0, import_react.useState)("");
	const [form, setForm] = (0, import_react.useState)({
		tenantId: "",
		subject: "",
		body: "",
		priority: "normal",
		channel: "email",
		assignedTo: ""
	});
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
	const allTenants = (0, import_react.useMemo)(() => {
		const combined = /* @__PURE__ */ new Map();
		demoTenants.forEach((t) => combined.set(t.id, t.name));
		combined.set("demo-tenant", "Demo Tenant");
		return Array.from(combined.entries()).map(([id, name]) => ({
			id,
			name
		}));
	}, [demoTenants]);
	const filtered = (0, import_react.useMemo)(() => tickets.filter((t) => filter === "all" || t.status === filter), [tickets, filter]);
	function submit() {
		if (!form.subject.trim() || !form.tenantId) return toast.error("Tenant & subject required");
		addTicket({
			tenantId: form.tenantId,
			subject: form.subject,
			body: form.body,
			priority: form.priority,
			status: "open",
			channel: form.channel,
			assignedTo: form.assignedTo || void 0
		});
		setOpen(false);
		setForm({
			tenantId: "",
			subject: "",
			body: "",
			priority: "normal",
			channel: "email",
			assignedTo: ""
		});
		toast.success("Ticket created");
	}
	function logTouchpoint(kind) {
		if (!form.tenantId) return toast.error("Pick a tenant first");
		addTouchpoint({
			tenantId: form.tenantId,
			kind,
			summary: form.subject || `${kind} logged`,
			by: user?.email ?? "super_admin"
		});
		toast.success("Logged");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SuperAdminShell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-2xl font-semibold",
				children: "Support CRM"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Tickets, meetings, calls, WhatsApp and email history per company."
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
					className: "h-10 rounded-md border bg-background px-3 text-sm",
					value: filter,
					onChange: (e) => setFilter(e.target.value),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "all",
						children: "All statuses"
					}), STATUSES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: s,
						children: s
					}, s))]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, {
					open,
					onOpenChange: setOpen,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTrigger, {
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							className: "bg-gradient-brand text-white",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4 mr-2" }), " New ticket"]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "New support ticket" }) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Tenant" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									className: "w-full h-10 rounded-md border bg-background px-3 text-sm",
									value: form.tenantId,
									onChange: (e) => setForm({
										...form,
										tenantId: e.target.value
									}),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "",
										children: "Select company"
									}), allTenants.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: t.id,
										children: t.name
									}, t.id))]
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Subject" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: form.subject,
									onChange: (e) => setForm({
										...form,
										subject: e.target.value
									})
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Description" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
									value: form.body,
									onChange: (e) => setForm({
										...form,
										body: e.target.value
									})
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-3 gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Priority" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
											className: "w-full h-10 rounded-md border bg-background px-3 text-sm",
											value: form.priority,
											onChange: (e) => setForm({
												...form,
												priority: e.target.value
											}),
											children: PRIORITIES.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: p,
												children: p
											}, p))
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Channel" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
											className: "w-full h-10 rounded-md border bg-background px-3 text-sm",
											value: form.channel,
											onChange: (e) => setForm({
												...form,
												channel: e.target.value
											}),
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "email" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "phone" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "whatsapp" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "portal" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "meeting" })
											]
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Assign to" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											value: form.assignedTo,
											onChange: (e) => setForm({
												...form,
												assignedTo: e.target.value
											}),
											placeholder: "Executive name"
										})] })
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex gap-2 flex-wrap pt-1",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											size: "sm",
											variant: "outline",
											onClick: () => logTouchpoint("call"),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "h-3 w-3 mr-1" }), "Log call"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											size: "sm",
											variant: "outline",
											onClick: () => logTouchpoint("whatsapp"),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "h-3 w-3 mr-1" }), "Log WhatsApp"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											size: "sm",
											variant: "outline",
											onClick: () => logTouchpoint("email"),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "h-3 w-3 mr-1" }), "Log email"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											size: "sm",
											variant: "outline",
											onClick: () => logTouchpoint("meeting"),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquare, { className: "h-3 w-3 mr-1" }), "Log meeting"]
										})
									]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogFooter, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: submit,
							className: "bg-gradient-brand text-white",
							children: "Create ticket"
						}) })
					] })]
				})]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
			defaultValue: "tickets",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
					value: "tickets",
					children: [
						"Tickets (",
						tickets.length,
						")"
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
					value: "tp",
					children: [
						"Touchpoints (",
						touchpoints.length,
						")"
					]
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
					value: "tickets",
					children: filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "p-8 text-sm text-muted-foreground text-center rounded-xl border",
						children: "No tickets."
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "rounded-2xl border bg-card divide-y",
						children: filtered.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "p-3 flex flex-wrap gap-2 items-center",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0 flex-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2 flex-wrap",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-medium",
												children: t.subject
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
												variant: "outline",
												children: t.priority
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: t.status }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-xs text-muted-foreground",
												children: t.channel
											})
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-xs text-muted-foreground mt-0.5",
										children: [
											allTenants.find((c) => c.id === t.tenantId)?.name ?? t.tenantId,
											" · ",
											new Date(t.createdAt).toLocaleString(),
											t.assignedTo ? ` · ${t.assignedTo}` : ""
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
									className: "h-8 rounded border bg-background px-2 text-xs",
									value: t.status,
									onChange: (e) => updateTicket(t.id, { status: e.target.value }),
									children: STATUSES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: s,
										children: s
									}, s))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									variant: "outline",
									onClick: () => setDetail(t),
									children: "Open"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									variant: "ghost",
									onClick: () => deleteTicket(t.id),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4 text-destructive" })
								})
							]
						}, t.id))
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
					value: "tp",
					children: touchpoints.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "p-8 text-sm text-muted-foreground text-center rounded-xl border",
						children: "No touchpoints logged."
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "rounded-2xl border bg-card divide-y",
						children: touchpoints.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "p-3 flex justify-between text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "capitalize font-medium",
								children: [
									t.kind,
									" — ",
									t.summary
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-xs text-muted-foreground",
								children: [
									allTenants.find((c) => c.id === t.tenantId)?.name ?? t.tenantId,
									" · ",
									t.by,
									" · ",
									new Date(t.ts).toLocaleString()
								]
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "ghost",
								onClick: () => deleteTouchpoint(t.id),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4 text-destructive" })
							})]
						}, t.id))
					})
				})
			]
		}),
		detail && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open: true,
			onOpenChange: (o) => !o && setDetail(null),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: detail.subject }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-xs text-muted-foreground",
						children: [
							allTenants.find((c) => c.id === detail.tenantId)?.name,
							" · ",
							detail.priority,
							" · ",
							detail.status
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-sm whitespace-pre-wrap",
						children: detail.body || /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-muted-foreground",
							children: "No description."
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "border-t pt-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs font-medium mb-2",
								children: "Notes"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "space-y-2 max-h-48 overflow-auto",
								children: detail.notes.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs text-muted-foreground",
									children: "No notes."
								}) : detail.notes.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded border p-2 text-xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-muted-foreground",
										children: [
											n.author,
											" · ",
											new Date(n.ts).toLocaleString()
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: n.text })]
								}, n.id))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex gap-2 mt-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: newNote,
									onChange: (e) => setNewNote(e.target.value),
									placeholder: "Add a note…"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									onClick: () => {
										if (!newNote.trim()) return;
										addTicketNote(detail.id, {
											author: user?.email ?? "super_admin",
											text: newNote
										});
										setNewNote("");
									},
									children: "Add"
								})]
							})
						]
					})
				]
			})] })
		})
	] });
}
//#endregion
export { SupportPage as component };
