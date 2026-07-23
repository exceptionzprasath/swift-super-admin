import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { C as Power, H as History, T as Plus, X as Copy, b as RefreshCcw, i as Upload, k as PenLine, p as ShieldCheck, q as Download, s as Trash2 } from "../_libs/lucide-react.mjs";
import { n as cn, t as Button } from "./button-DRsC1qZi.mjs";
import { t as Input } from "./input-DicJzR9-.mjs";
import { t as Label } from "./label-B4PTMSG2.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Badge } from "./badge-Cc0IblCb.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, t as Dialog } from "./dialog-CiapfthD.mjs";
import { t as SuperAdminShell } from "./super-admin-shell-CGd3Qf5E.mjs";
import { i as TabsTrigger, n as TabsContent, r as TabsList, t as Tabs } from "./tabs-BYfOmXtJ.mjs";
import { n as useComplianceRegistry, t as REGISTRY_KIND_LABEL } from "./compliance-registry-store-GzMJ44lQ.mjs";
import { t as Textarea } from "./textarea-DBn9CRiI.mjs";
import { n as SwitchThumb, t as Switch$1 } from "../_libs/radix-ui__react-switch.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/super-admin.compliance-registry-iGh776NQ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Switch = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch$1, {
	className: cn("peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input", className),
	...props,
	ref,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SwitchThumb, { className: cn("pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0") })
}));
Switch.displayName = Switch$1.displayName;
var KINDS = [
	"act",
	"rule",
	"section",
	"form",
	"register",
	"notice",
	"return",
	"licence",
	"circular",
	"amendment"
];
var FREQS = [
	"daily",
	"weekly",
	"monthly",
	"quarterly",
	"half_yearly",
	"annual",
	"financial_year",
	"calendar_year",
	"biennial",
	"one_time",
	"on_event",
	"ongoing",
	"custom"
];
var TRIGGERS = [
	"event",
	"time",
	"conditional",
	"manual"
];
function RegistryPage() {
	const { entries, addEntry, updateEntry, deleteEntry, toggleEntry, duplicateEntry, resetSeed, addAmendment } = useComplianceRegistry();
	const [q, setQ] = (0, import_react.useState)("");
	const [kind, setKind] = (0, import_react.useState)("all");
	const [editing, setEditing] = (0, import_react.useState)(null);
	const [showNew, setShowNew] = (0, import_react.useState)(false);
	const filtered = (0, import_react.useMemo)(() => {
		const s = q.trim().toLowerCase();
		return entries.filter((e) => (kind === "all" || e.kind === kind) && (!s || `${e.act} ${e.title} ${e.code ?? ""} ${e.state ?? ""}`.toLowerCase().includes(s)));
	}, [
		entries,
		q,
		kind
	]);
	const stats = (0, import_react.useMemo)(() => {
		const by = {};
		for (const e of entries) by[e.kind] = (by[e.kind] ?? 0) + 1;
		return by;
	}, [entries]);
	function exportJSON() {
		const blob = new Blob([JSON.stringify(entries, null, 2)], { type: "application/json" });
		const a = document.createElement("a");
		a.href = URL.createObjectURL(blob);
		a.download = `swift-compliance-registry-${Date.now()}.json`;
		a.click();
		URL.revokeObjectURL(a.href);
	}
	async function importJSON(file) {
		try {
			const txt = await file.text();
			const arr = JSON.parse(txt);
			if (!Array.isArray(arr)) throw new Error("Invalid file");
			let imported = 0;
			for (const e of arr) {
				addEntry(e);
				imported++;
			}
			toast.success(`Imported ${imported} entries`);
		} catch (err) {
			toast.error(`Import failed: ${err.message}`);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SuperAdminShell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap items-end justify-between gap-3 mb-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
				className: "font-display text-2xl font-semibold flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-6 w-6 text-primary" }), " Master Compliance Registry"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Central catalogue of every Act, Rule, Section, Form, Register, Notice, Return, Licence, Circular and Amendment. Fully configuration-driven — add unlimited entries without any code change."
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						size: "sm",
						onClick: exportJSON,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-4 w-4 mr-2" }), "Export"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "cursor-pointer",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "file",
							accept: "application/json",
							className: "hidden",
							onChange: (e) => {
								const f = e.target.files?.[0];
								if (f) importJSON(f);
								e.currentTarget.value = "";
							}
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "inline-flex items-center h-9 px-3 rounded-md border text-sm bg-background hover:bg-muted",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "h-4 w-4 mr-2" }), "Import"]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						size: "sm",
						onClick: () => {
							resetSeed();
							toast.success("Registry reset to seed");
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCcw, { className: "h-4 w-4 mr-2" }), "Reset seed"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						onClick: () => setShowNew(true),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4 mr-2" }), "New entry"]
					})
				]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-2 md:grid-cols-6 gap-2 mb-4",
			children: [
				"act",
				"form",
				"register",
				"notice",
				"return",
				"licence"
			].map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl border bg-card p-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-xs text-muted-foreground uppercase",
					children: [REGISTRY_KIND_LABEL[k], "s"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-2xl font-semibold",
					children: stats[k] ?? 0
				})]
			}, k))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap gap-2 mb-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: q,
					onChange: (e) => setQ(e.target.value),
					placeholder: "Search act, title, code, state…",
					className: "w-72"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
					value: kind,
					onChange: (e) => setKind(e.target.value),
					className: "h-9 rounded-md border bg-background px-3 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "all",
						children: "All kinds"
					}), KINDS.map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: k,
						children: REGISTRY_KIND_LABEL[k]
					}, k))]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-xs text-muted-foreground self-center ml-auto",
					children: [
						filtered.length,
						" of ",
						entries.length
					]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "rounded-2xl border bg-card overflow-hidden",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "w-full text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
					className: "bg-muted/40 text-xs text-muted-foreground",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "text-left px-3 py-2",
							children: "Kind"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "text-left px-3 py-2",
							children: "Act / Code"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "text-left px-3 py-2",
							children: "Title"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "text-left px-3 py-2",
							children: "Frequency"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "text-left px-3 py-2",
							children: "Trigger"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "text-left px-3 py-2",
							children: "Version"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "text-left px-3 py-2",
							children: "State"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "text-right px-3 py-2",
							children: "Actions"
						})
					] })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", { children: [filtered.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "border-t hover:bg-muted/30",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-3 py-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "outline",
								className: "text-xs capitalize",
								children: e.kind
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
							className: "px-3 py-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-medium",
								children: e.act
							}), e.code && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs text-muted-foreground",
								children: e.code
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
							className: "px-3 py-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [e.title, !e.enabled && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "outline",
								className: "ml-2 text-xs",
								children: "disabled"
							})] }), e.section && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-xs text-muted-foreground",
								children: ["§ ", e.section]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-3 py-2 text-xs uppercase text-muted-foreground",
							children: e.frequency.replace(/_/g, " ")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
							className: "px-3 py-2 text-xs",
							children: [e.triggerKind, e.eventKey ? ` · ${e.eventKey}` : ""]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-3 py-2 text-xs",
							children: e.version
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-3 py-2 text-xs",
							children: e.state ?? "—"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-3 py-2 text-right",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-end gap-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "ghost",
										size: "icon",
										title: "Edit",
										onClick: () => setEditing(e),
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PenLine, { className: "h-4 w-4" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "ghost",
										size: "icon",
										title: "Toggle",
										onClick: () => toggleEntry(e.id),
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Power, { className: "h-4 w-4" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "ghost",
										size: "icon",
										title: "Duplicate",
										onClick: () => {
											duplicateEntry(e.id);
											toast.success("Duplicated");
										},
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "h-4 w-4" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "ghost",
										size: "icon",
										title: "Delete",
										onClick: () => {
											if (confirm(`Delete "${e.title}"?`)) {
												deleteEntry(e.id);
												toast.info("Deleted");
											}
										},
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4 text-destructive" })
									})
								]
							})
						})
					]
				}, e.id)), filtered.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
					colSpan: 8,
					className: "text-center text-sm text-muted-foreground p-10",
					children: "No entries match."
				}) })] })]
			})
		}),
		showNew && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EntryEditor, {
			onClose: () => setShowNew(false),
			onSave: (data) => {
				addEntry(data);
				toast.success("Added");
				setShowNew(false);
			}
		}),
		editing && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EntryEditor, {
			initial: editing,
			onClose: () => setEditing(null),
			onSave: (data) => {
				updateEntry(editing.id, data);
				toast.success("Saved");
				setEditing(null);
			},
			onAmend: (a) => {
				addAmendment(editing.id, a);
				toast.success("Amendment logged");
			}
		})
	] });
}
function EntryEditor({ initial, onClose, onSave, onAmend }) {
	const [form, setForm] = (0, import_react.useState)(initial ?? {
		id: "",
		kind: "form",
		act: "",
		title: "",
		frequency: "ongoing",
		triggerKind: "manual",
		version: "1.0",
		applicability: {},
		autoFill: [],
		approval: {
			stages: [
				"draft",
				"hr_review",
				"digital_signature",
				"final_pdf",
				"archive"
			],
			requireDigitalSignature: true,
			requireSeal: true,
			requireWatermark: false,
			requireQR: true,
			autoArchive: true
		},
		amendments: [],
		createdAt: "",
		updatedAt: "",
		enabled: true
	});
	const [newAmend, setNewAmend] = (0, import_react.useState)({
		date: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
		summary: "",
		circularRef: ""
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open: true,
		onOpenChange: (o) => !o && onClose(),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-w-3xl max-h-[90vh] overflow-auto",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: initial ? "Edit entry" : "New compliance entry" }) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
					defaultValue: "core",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "core",
								children: "Core"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "timing",
								children: "Timing"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "scope",
								children: "Scope"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "automation",
								children: "Automation"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "approval",
								children: "Approval"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "history",
								children: "History"
							})
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
							value: "core",
							className: "space-y-3 pt-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Kind",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
											className: "h-10 w-full rounded-md border bg-background px-3 text-sm",
											value: form.kind,
											onChange: (e) => setForm({
												...form,
												kind: e.target.value
											}),
											children: KINDS.map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: k,
												children: REGISTRY_KIND_LABEL[k]
											}, k))
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Enabled",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "h-10 flex items-center",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
												checked: form.enabled,
												onCheckedChange: (v) => setForm({
													...form,
													enabled: v
												})
											})
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Act *",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											value: form.act,
											onChange: (e) => setForm({
												...form,
												act: e.target.value
											})
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Authority",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											value: form.authority ?? "",
											onChange: (e) => setForm({
												...form,
												authority: e.target.value
											})
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Rule",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											value: form.rule ?? "",
											onChange: (e) => setForm({
												...form,
												rule: e.target.value
											})
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Section",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											value: form.section ?? "",
											onChange: (e) => setForm({
												...form,
												section: e.target.value
											})
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Code (Form/Register No.)",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											value: form.code ?? "",
											onChange: (e) => setForm({
												...form,
												code: e.target.value
											})
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Version",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											value: form.version,
											onChange: (e) => setForm({
												...form,
												version: e.target.value
											})
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "col-span-2",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
											label: "Title *",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												value: form.title,
												onChange: (e) => setForm({
													...form,
													title: e.target.value
												})
											})
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "col-span-2",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
											label: "Purpose",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
												rows: 2,
												value: form.purpose ?? "",
												onChange: (e) => setForm({
													...form,
													purpose: e.target.value
												})
											})
										})
									})
								]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
							value: "timing",
							className: "space-y-3 pt-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Frequency",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
											className: "h-10 w-full rounded-md border bg-background px-3 text-sm",
											value: form.frequency,
											onChange: (e) => setForm({
												...form,
												frequency: e.target.value
											}),
											children: FREQS.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: f,
												children: f
											}, f))
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Trigger kind",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
											className: "h-10 w-full rounded-md border bg-background px-3 text-sm",
											value: form.triggerKind,
											onChange: (e) => setForm({
												...form,
												triggerKind: e.target.value
											}),
											children: TRIGGERS.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: t,
												children: t
											}, t))
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Due day",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											type: "number",
											value: form.dueDay ?? "",
											onChange: (e) => setForm({
												...form,
												dueDay: +e.target.value || void 0
											})
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Due month",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											type: "number",
											value: form.dueMonth ?? "",
											onChange: (e) => setForm({
												...form,
												dueMonth: +e.target.value || void 0
											})
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Custom cron / expr",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											value: form.customCron ?? "",
											onChange: (e) => setForm({
												...form,
												customCron: e.target.value
											})
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Event key",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											value: form.eventKey ?? "",
											placeholder: "employee_joined",
											onChange: (e) => setForm({
												...form,
												eventKey: e.target.value
											})
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Effective date",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											type: "date",
											value: form.effectiveDate?.slice(0, 10) ?? "",
											onChange: (e) => setForm({
												...form,
												effectiveDate: e.target.value
											})
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Expiry date",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											type: "date",
											value: form.expiryDate?.slice(0, 10) ?? "",
											onChange: (e) => setForm({
												...form,
												expiryDate: e.target.value
											})
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "col-span-2",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
											label: "Reminder days (comma-separated)",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												value: (form.reminderDays ?? []).join(","),
												placeholder: "30,15,7,3,1",
												onChange: (e) => setForm({
													...form,
													reminderDays: e.target.value.split(",").map((x) => +x.trim()).filter((n) => n > 0)
												})
											})
										})
									})
								]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
							value: "scope",
							className: "space-y-3 pt-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "State",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											value: form.state ?? "",
											onChange: (e) => setForm({
												...form,
												state: e.target.value
											})
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Industry",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											value: form.industry ?? "",
											onChange: (e) => setForm({
												...form,
												industry: e.target.value
											})
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Department",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											value: form.department ?? "",
											onChange: (e) => setForm({
												...form,
												department: e.target.value
											})
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Min employees",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											type: "number",
											value: form.applicability.minEmployees ?? "",
											onChange: (e) => setForm({
												...form,
												applicability: {
													...form.applicability,
													minEmployees: +e.target.value || void 0
												}
											})
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Min women",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											type: "number",
											value: form.applicability.minWomen ?? "",
											onChange: (e) => setForm({
												...form,
												applicability: {
													...form.applicability,
													minWomen: +e.target.value || void 0
												}
											})
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Min branches",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											type: "number",
											value: form.applicability.minBranches ?? "",
											onChange: (e) => setForm({
												...form,
												applicability: {
													...form.applicability,
													minBranches: +e.target.value || void 0
												}
											})
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Establishment types (csv)",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											value: (form.applicability.establishmentTypes ?? []).join(","),
											onChange: (e) => setForm({
												...form,
												applicability: {
													...form.applicability,
													establishmentTypes: e.target.value.split(",").map((s) => s.trim()).filter(Boolean)
												}
											})
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "States (csv)",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											value: (form.applicability.states ?? []).join(","),
											onChange: (e) => setForm({
												...form,
												applicability: {
													...form.applicability,
													states: e.target.value.split(",").map((s) => s.trim()).filter(Boolean)
												}
											})
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "col-span-2 flex flex-wrap gap-3",
										children: [
											"requiresContractLabour",
											"requiresHazardous",
											"requiresNightShift",
											"requiresPower"
										].map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
											className: "flex items-center gap-2 text-sm",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "checkbox",
												checked: !!form.applicability[k],
												onChange: (e) => setForm({
													...form,
													applicability: {
														...form.applicability,
														[k]: e.target.checked
													}
												})
											}), k.replace(/^requires/, "").replace(/([A-Z])/g, " $1").trim()]
										}, k))
									})
								]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
							value: "automation",
							className: "space-y-3 pt-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-xs",
										children: "Auto-fill mappings"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs text-muted-foreground mb-2",
										children: "Map form fields to data sources (employee.name, branch.address, payroll.month …)."
									}),
									form.autoFill.map((m, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid grid-cols-4 gap-2 mb-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												placeholder: "field",
												value: m.field,
												onChange: (e) => {
													const c = [...form.autoFill];
													c[i] = {
														...c[i],
														field: e.target.value
													};
													setForm({
														...form,
														autoFill: c
													});
												}
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												placeholder: "source",
												value: m.source,
												onChange: (e) => {
													const c = [...form.autoFill];
													c[i] = {
														...c[i],
														source: e.target.value
													};
													setForm({
														...form,
														autoFill: c
													});
												}
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												placeholder: "transform",
												value: m.transform ?? "",
												onChange: (e) => {
													const c = [...form.autoFill];
													c[i] = {
														...c[i],
														transform: e.target.value
													};
													setForm({
														...form,
														autoFill: c
													});
												}
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex gap-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													placeholder: "fallback",
													value: m.fallback ?? "",
													onChange: (e) => {
														const c = [...form.autoFill];
														c[i] = {
															...c[i],
															fallback: e.target.value
														};
														setForm({
															...form,
															autoFill: c
														});
													}
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
													variant: "ghost",
													size: "icon",
													onClick: () => setForm({
														...form,
														autoFill: form.autoFill.filter((_, j) => j !== i)
													}),
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4 text-destructive" })
												})]
											})
										]
									}, i)),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										variant: "outline",
										size: "sm",
										onClick: () => setForm({
											...form,
											autoFill: [...form.autoFill, {
												field: "",
												source: ""
											}]
										}),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4 mr-1" }), "Add mapping"]
									})
								] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "AI instructions",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
										rows: 3,
										value: form.aiInstructions ?? "",
										onChange: (e) => setForm({
											...form,
											aiInstructions: e.target.value
										}),
										placeholder: "Tell SWIFT AI how to fill/validate this document…"
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Government circular / reference",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: form.circular ?? "",
										onChange: (e) => setForm({
											...form,
											circular: e.target.value
										})
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Penalty on non-compliance",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: form.penalty ?? "",
										onChange: (e) => setForm({
											...form,
											penalty: e.target.value
										})
									})
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
							value: "approval",
							className: "space-y-3 pt-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Approval stages (ordered, csv)",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: form.approval.stages.join(","),
									onChange: (e) => setForm({
										...form,
										approval: {
											...form.approval,
											stages: e.target.value.split(",").map((s) => s.trim()).filter(Boolean)
										}
									})
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid grid-cols-2 gap-3",
								children: [
									"requireDigitalSignature",
									"requireSeal",
									"requireWatermark",
									"requireQR",
									"autoArchive"
								].map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "flex items-center gap-2 text-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
										checked: form.approval[k],
										onCheckedChange: (v) => setForm({
											...form,
											approval: {
												...form.approval,
												[k]: v
											}
										})
									}), k.replace(/^require/, "Require ").replace(/^auto/, "Auto ")]
								}, k))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
							value: "history",
							className: "space-y-3 pt-3",
							children: [
								onAmend && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-lg border p-3 space-y-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-sm font-medium flex items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(History, { className: "h-4 w-4" }), "Log amendment"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "grid grid-cols-3 gap-2",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													type: "date",
													value: newAmend.date,
													onChange: (e) => setNewAmend({
														...newAmend,
														date: e.target.value
													})
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													placeholder: "Circular ref",
													value: newAmend.circularRef,
													onChange: (e) => setNewAmend({
														...newAmend,
														circularRef: e.target.value
													})
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
													size: "sm",
													onClick: () => {
														if (!newAmend.summary.trim()) {
															toast.error("Summary required");
															return;
														}
														onAmend({
															...newAmend,
															by: "super_admin"
														});
														setNewAmend({
															date: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
															summary: "",
															circularRef: ""
														});
													},
													children: "Log"
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
											rows: 2,
											placeholder: "What changed?",
											value: newAmend.summary,
											onChange: (e) => setNewAmend({
												...newAmend,
												summary: e.target.value
											})
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-sm font-medium",
									children: [
										"Amendment history (",
										form.amendments.length,
										")"
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
									className: "space-y-1 text-sm max-h-56 overflow-auto",
									children: [form.amendments.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
										className: "rounded border p-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-xs text-muted-foreground",
											children: [
												a.date,
												" · ",
												a.circularRef || "—"
											]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: a.summary })]
									}, a.id)), form.amendments.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
										className: "text-xs text-muted-foreground",
										children: "No amendments logged."
									})]
								})
							]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					onClick: onClose,
					children: "Cancel"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: () => {
						if (!form.act || !form.title) {
							toast.error("Act and Title are required");
							return;
						}
						onSave(form);
					},
					children: "Save"
				})] })
			]
		})
	});
}
function Field({ label, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
		className: "text-xs",
		children: label
	}), children] });
}
//#endregion
export { RegistryPage as component };
