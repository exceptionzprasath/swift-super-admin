import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { _ as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { n as useStore } from "./store-S6gS8j3W.mjs";
import { $ as CircleX, V as Image, Z as Clock, _ as Save, et as CircleCheck, i as Upload, s as Trash2, x as QrCode, y as RefreshCw } from "../_libs/lucide-react.mjs";
import { t as useAuth } from "./auth-DdbmyJDi.mjs";
import { t as Button } from "./button-DRsC1qZi.mjs";
import { t as Input } from "./input-DicJzR9-.mjs";
import { t as Label } from "./label-B4PTMSG2.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { i as useSuperAdmin } from "./super-admin-store-t3kBGD03.mjs";
import { a as useBilling } from "./billing-store-rNI6wn4Z.mjs";
import { t as Badge } from "./badge-Cc0IblCb.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, t as Dialog } from "./dialog-CiapfthD.mjs";
import { t as SuperAdminShell } from "./super-admin-shell-CGd3Qf5E.mjs";
import { i as TabsTrigger, n as TabsContent, r as TabsList, t as Tabs } from "./tabs-BYfOmXtJ.mjs";
import { t as Textarea } from "./textarea-DBn9CRiI.mjs";
import { t as require_lib } from "../_libs/qrcode.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/super-admin.payments-SAUo5GCs.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var import_lib = /* @__PURE__ */ __toESM(require_lib());
function buildUpiUri(opts) {
	const p = new URLSearchParams();
	p.set("pa", opts.upiId);
	p.set("pn", opts.payeeName);
	if (opts.amount && opts.amount > 0) p.set("am", opts.amount.toFixed(2));
	p.set("cu", "INR");
	if (opts.note) p.set("tn", opts.note.slice(0, 50));
	if (opts.merchantCode) p.set("mc", opts.merchantCode);
	return `upi://pay?${p.toString()}`;
}
function UpiQR({ upiId, payeeName, amount, note, merchantCode, overrideImage, size = 220 }) {
	const [dataUrl, setDataUrl] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		if (overrideImage) {
			setDataUrl(overrideImage);
			return;
		}
		const uri = buildUpiUri({
			upiId,
			payeeName,
			amount,
			note,
			merchantCode
		});
		import_lib.toDataURL(uri, {
			width: size,
			margin: 1,
			errorCorrectionLevel: "M"
		}).then(setDataUrl).catch(() => setDataUrl(""));
	}, [
		upiId,
		payeeName,
		amount,
		note,
		merchantCode,
		overrideImage,
		size
	]);
	if (!dataUrl) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		style: {
			width: size,
			height: size
		},
		className: "rounded-lg bg-muted animate-pulse"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
		src: dataUrl,
		alt: "UPI QR",
		width: size,
		height: size,
		className: "rounded-lg border bg-white p-2"
	});
}
function PaymentsPage() {
	const nav = useNavigate();
	const { user, isSuperAdmin, loading } = useAuth();
	const demoMode = useStore((s) => s.demoMode);
	const { upi, updateUpi, resetUpi, paymentSubmissions, verifyPayment, rejectPayment, deletePayment } = useSuperAdmin();
	const { invoices, markInvoicePaid, updateSubscription, subscriptions } = useBilling();
	const [tab, setTab] = (0, import_react.useState)("pending");
	const [rejectTarget, setRejectTarget] = (0, import_react.useState)(null);
	const [rejectReason, setRejectReason] = (0, import_react.useState)("");
	const [viewShot, setViewShot] = (0, import_react.useState)(null);
	const [draft, setDraft] = (0, import_react.useState)(upi);
	(0, import_react.useEffect)(() => setDraft(upi), [upi]);
	(0, import_react.useEffect)(() => {
		if (loading) return;
		if (!user && !demoMode) {
			nav({ to: "/login" });
			return;
		}
		if (!isSuperAdmin && !demoMode) nav({ to: "/admin" });
	}, [
		user,
		isSuperAdmin,
		loading,
		demoMode,
		nav
	]);
	const pending = (0, import_react.useMemo)(() => paymentSubmissions.filter((p) => p.status === "pending"), [paymentSubmissions]);
	const verified = (0, import_react.useMemo)(() => paymentSubmissions.filter((p) => p.status === "verified"), [paymentSubmissions]);
	const rejected = (0, import_react.useMemo)(() => paymentSubmissions.filter((p) => p.status === "rejected"), [paymentSubmissions]);
	const save = () => {
		updateUpi(draft);
		toast.success("UPI details saved");
	};
	const onQrFile = async (f) => {
		if (!f) return;
		if (f.size > 2e6) return toast.error("QR image must be under 2 MB");
		const reader = new FileReader();
		reader.onload = () => setDraft((d) => ({
			...d,
			qrImageDataUrl: String(reader.result)
		}));
		reader.readAsDataURL(f);
	};
	const doVerify = (id) => {
		const rec = verifyPayment(id, "super-admin");
		if (!rec) return;
		if (rec.invoiceId) markInvoicePaid(rec.invoiceId, "upi");
		const sub = subscriptions.find((s) => s.tenantId === rec.tenantId);
		if (sub) updateSubscription(sub.id, {
			paymentStatus: "paid",
			status: "active"
		});
		toast.success(`Verified · ${rec.tenantName ?? rec.tenantId} · operations opened`);
	};
	const doReject = () => {
		if (!rejectTarget) return;
		rejectPayment(rejectTarget, "super-admin", rejectReason || "No reason");
		toast.success("Payment rejected");
		setRejectTarget(null);
		setRejectReason("");
	};
	const invoiceFor = (id) => invoices.find((i) => i.id === id);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SuperAdminShell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
				className: "font-display text-2xl font-semibold flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QrCode, { className: "h-6 w-6" }), " UPI Payments"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Clients pay via UPI QR, upload screenshot; you verify and operations open."
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
			value: tab,
			onValueChange: setTab,
			className: "space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
					className: "flex-wrap h-auto",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
							value: "pending",
							children: ["Pending ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "outline",
								className: "ml-2",
								children: pending.length
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
							value: "verified",
							children: ["Verified ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "outline",
								className: "ml-2",
								children: verified.length
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
							value: "rejected",
							children: ["Rejected ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "outline",
								className: "ml-2",
								children: rejected.length
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
							value: "settings",
							children: "UPI / QR settings"
						})
					]
				}),
				[
					"pending",
					"verified",
					"rejected"
				].map((k) => {
					const list = k === "pending" ? pending : k === "verified" ? verified : rejected;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: k,
						className: "space-y-3",
						children: list.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border bg-card p-10 text-center text-sm text-muted-foreground",
							children: [
								"No ",
								k,
								" payments."
							]
						}) : list.map((p) => {
							const inv = invoiceFor(p.invoiceId);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "rounded-xl border bg-card p-4 shadow-card",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-col sm:flex-row sm:items-start gap-4",
									children: [
										p.screenshotDataUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: () => setViewShot(p.screenshotDataUrl),
											className: "shrink-0",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
												src: p.screenshotDataUrl,
												alt: "Payment proof",
												className: "h-28 w-28 rounded-lg border object-cover"
											})
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "h-28 w-28 rounded-lg border bg-muted flex items-center justify-center text-muted-foreground",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Image, { className: "h-6 w-6" })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex-1 min-w-0",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex flex-wrap items-center gap-2",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
															className: "font-semibold truncate",
															children: p.tenantName ?? p.tenantId
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
															variant: "outline",
															className: "capitalize",
															children: [p.status === "pending" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-3 w-3 mr-1" }) : p.status === "verified" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-3 w-3 mr-1" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "h-3 w-3 mr-1" }), p.status]
														}),
														inv && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
															variant: "outline",
															children: ["Invoice ", inv.number]
														})
													]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "mt-1 text-sm",
													children: ["Amount: ", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "font-semibold",
														children: ["₹", p.amount.toLocaleString()]
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "text-xs text-muted-foreground mt-1 space-y-0.5",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: ["UTR / Ref: ", p.utr || "—"] }),
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
															"Payer: ",
															p.payerName || "—",
															" · ",
															p.payerContact || "—"
														] }),
														p.note && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: ["Note: ", p.note] }),
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: ["Submitted: ", new Date(p.submittedAt).toLocaleString()] }),
														p.verifiedAt && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
															"Actioned: ",
															new Date(p.verifiedAt).toLocaleString(),
															" by ",
															p.verifiedBy
														] }),
														p.rejectionReason && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "text-destructive",
															children: ["Reason: ", p.rejectionReason]
														})
													]
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex sm:flex-col gap-2 sm:w-40",
											children: [p.status === "pending" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
												size: "sm",
												className: "flex-1",
												onClick: () => doVerify(p.id),
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4 mr-1" }), "Verify & Open"]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
												size: "sm",
												variant: "outline",
												className: "flex-1",
												onClick: () => setRejectTarget(p.id),
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "h-4 w-4 mr-1" }), "Reject"]
											})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												size: "sm",
												variant: "ghost",
												className: "text-destructive",
												onClick: () => deletePayment(p.id),
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
											})]
										})
									]
								})
							}, p.id);
						})
					}, k);
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
					value: "settings",
					className: "space-y-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid md:grid-cols-2 gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border bg-card p-5 shadow-card space-y-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-medium",
									children: "UPI details"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Payee name" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: draft.payeeName,
									onChange: (e) => setDraft({
										...draft,
										payeeName: e.target.value
									})
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "UPI ID (VPA)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: draft.upiId,
									onChange: (e) => setDraft({
										...draft,
										upiId: e.target.value
									}),
									placeholder: "name@bank"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Merchant code (optional)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: draft.merchantCode ?? "",
									onChange: (e) => setDraft({
										...draft,
										merchantCode: e.target.value
									})
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-2 gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Bank" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: draft.bankName ?? "",
										onChange: (e) => setDraft({
											...draft,
											bankName: e.target.value
										})
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "IFSC" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: draft.ifsc ?? "",
										onChange: (e) => setDraft({
											...draft,
											ifsc: e.target.value
										})
									})] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Account number" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: draft.accountNumber ?? "",
									onChange: (e) => setDraft({
										...draft,
										accountNumber: e.target.value
									})
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Payment instructions" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
									rows: 3,
									value: draft.instructions,
									onChange: (e) => setDraft({
										...draft,
										instructions: e.target.value
									})
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										onClick: save,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "h-4 w-4 mr-1" }), "Save"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										variant: "outline",
										onClick: () => {
											resetUpi();
											toast.success("Reset to defaults");
										},
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-4 w-4 mr-1" }), "Reset"]
									})]
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border bg-card p-5 shadow-card space-y-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-medium",
									children: "QR code preview"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex justify-center",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UpiQR, {
										upiId: draft.upiId,
										payeeName: draft.payeeName,
										merchantCode: draft.merchantCode,
										overrideImage: draft.qrImageDataUrl
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs text-muted-foreground text-center",
									children: "Auto-generated from UPI ID. Upload a custom QR (from your bank app) to override."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-col sm:flex-row gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "flex-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "file",
											accept: "image/*",
											className: "hidden",
											onChange: (e) => onQrFile(e.target.files?.[0] ?? null)
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "w-full inline-flex items-center justify-center rounded-md border px-3 py-2 text-sm cursor-pointer hover:bg-muted",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "h-4 w-4 mr-1" }), "Upload custom QR"]
										})]
									}), draft.qrImageDataUrl && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "outline",
										onClick: () => setDraft({
											...draft,
											qrImageDataUrl: void 0
										}),
										children: "Use auto QR"
									})]
								})
							]
						})]
					})
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open: !!rejectTarget,
			onOpenChange: (o) => !o && setRejectTarget(null),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Reject payment" }) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Reason (shown to client)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
					rows: 3,
					value: rejectReason,
					onChange: (e) => setRejectReason(e.target.value),
					placeholder: "e.g. Amount mismatch, screenshot unclear, UTR not found"
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					onClick: () => setRejectTarget(null),
					children: "Cancel"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: doReject,
					className: "bg-destructive text-destructive-foreground",
					children: "Reject"
				})] })
			] })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open: !!viewShot,
			onOpenChange: (o) => !o && setViewShot(null),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
				className: "max-w-2xl",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Payment screenshot" }) }), viewShot && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: viewShot,
					alt: "Screenshot",
					className: "w-full rounded-lg border"
				})]
			})
		})
	] });
}
//#endregion
export { PaymentsPage as component };
