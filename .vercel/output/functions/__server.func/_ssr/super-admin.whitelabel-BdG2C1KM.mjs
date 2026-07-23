import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { _ as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { n as useStore } from "./store-S6gS8j3W.mjs";
import { _ as Save, v as RotateCcw } from "../_libs/lucide-react.mjs";
import { t as useAuth } from "./auth-DdbmyJDi.mjs";
import { t as Button } from "./button-DRsC1qZi.mjs";
import { t as Input } from "./input-DicJzR9-.mjs";
import { t as Label } from "./label-B4PTMSG2.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { i as useSuperAdmin, r as defaultWhiteLabel } from "./super-admin-store-t3kBGD03.mjs";
import { t as SuperAdminShell } from "./super-admin-shell-CGd3Qf5E.mjs";
import { i as TabsTrigger, n as TabsContent, r as TabsList, t as Tabs } from "./tabs-BYfOmXtJ.mjs";
import { t as Textarea } from "./textarea-DBn9CRiI.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/super-admin.whitelabel-BdG2C1KM.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function WhiteLabelPage() {
	const nav = useNavigate();
	const { user, isSuperAdmin, loading } = useAuth();
	const demoMode = useStore((st) => st.demoMode);
	const { whiteLabel, updateWhiteLabel, resetWhiteLabel } = useSuperAdmin();
	const [form, setForm] = (0, import_react.useState)(whiteLabel);
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
	(0, import_react.useEffect)(() => {
		setForm(whiteLabel);
	}, [whiteLabel]);
	function upload(field, file) {
		if (!file) return;
		const reader = new FileReader();
		reader.onload = () => setForm((f) => ({
			...f,
			[field]: String(reader.result)
		}));
		reader.readAsDataURL(file);
	}
	function save() {
		updateWhiteLabel(form);
		toast.success("White-label settings saved");
	}
	function reset() {
		resetWhiteLabel();
		setForm(defaultWhiteLabel);
		toast.success("Reset to defaults");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SuperAdminShell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-end justify-between gap-3 mb-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-display text-2xl font-semibold",
			children: "White-label & platform settings"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted-foreground",
			children: "Branding, gateways, providers and domain mapping."
		})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "outline",
				onClick: reset,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "h-4 w-4 mr-2" }), "Reset"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				className: "bg-gradient-brand text-white",
				onClick: save,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "h-4 w-4 mr-2" }), "Save"]
			})]
		})]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
		defaultValue: "brand",
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
				className: "flex-wrap h-auto",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
						value: "brand",
						children: "Brand"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
						value: "assets",
						children: "Logos & PDF"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
						value: "comm",
						children: "Email & Messaging"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
						value: "providers",
						children: "Providers"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
						value: "domain",
						children: "Domain & App"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
				value: "brand",
				className: "grid sm:grid-cols-2 gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Brand name" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: form.brandName,
						onChange: (e) => setForm({
							...form,
							brandName: e.target.value
						})
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Tagline" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: form.tagline,
						onChange: (e) => setForm({
							...form,
							tagline: e.target.value
						})
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Primary color" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "color",
						value: form.primaryColor,
						onChange: (e) => setForm({
							...form,
							primaryColor: e.target.value
						})
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Secondary color" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "color",
						value: form.secondaryColor,
						onChange: (e) => setForm({
							...form,
							secondaryColor: e.target.value
						})
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "sm:col-span-2 rounded-xl border p-4 flex items-center gap-4",
						style: { background: `linear-gradient(90deg, ${form.primaryColor}22, ${form.secondaryColor}22)` },
						children: [form.logoDataUrl && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: form.logoDataUrl,
							alt: "logo",
							className: "h-10"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-display text-lg font-semibold",
							children: form.brandName
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs text-muted-foreground",
							children: form.tagline
						})] })]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
				value: "assets",
				className: "grid sm:grid-cols-2 gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Logo" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "file",
							accept: "image/*",
							onChange: (e) => upload("logoDataUrl", e.target.files?.[0] ?? null)
						}),
						form.logoDataUrl && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: form.logoDataUrl,
							alt: "logo preview",
							className: "mt-2 h-12"
						})
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Favicon" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "file",
							accept: "image/*",
							onChange: (e) => upload("faviconDataUrl", e.target.files?.[0] ?? null)
						}),
						form.faviconDataUrl && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: form.faviconDataUrl,
							alt: "favicon preview",
							className: "mt-2 h-8"
						})
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "sm:col-span-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "PDF header" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							value: form.pdfHeader,
							onChange: (e) => setForm({
								...form,
								pdfHeader: e.target.value
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "sm:col-span-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "PDF footer" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							value: form.pdfFooter,
							onChange: (e) => setForm({
								...form,
								pdfFooter: e.target.value
							})
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
				value: "comm",
				className: "grid sm:grid-cols-2 gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Email from name" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: form.emailFromName,
						onChange: (e) => setForm({
							...form,
							emailFromName: e.target.value
						})
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Email from address" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: form.emailFromAddress,
						onChange: (e) => setForm({
							...form,
							emailFromAddress: e.target.value
						})
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Support email" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: form.supportEmail,
						onChange: (e) => setForm({
							...form,
							supportEmail: e.target.value
						})
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Support phone" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: form.supportPhone,
						onChange: (e) => setForm({
							...form,
							supportPhone: e.target.value
						})
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "SMTP host" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: form.smtpHost ?? "",
						onChange: (e) => setForm({
							...form,
							smtpHost: e.target.value
						})
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "SMTP user" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: form.smtpUser ?? "",
						onChange: (e) => setForm({
							...form,
							smtpUser: e.target.value
						})
					})] })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
				value: "providers",
				className: "grid sm:grid-cols-2 gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "SMS gateway" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: form.smsGateway ?? "",
						onChange: (e) => setForm({
							...form,
							smsGateway: e.target.value
						})
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "WhatsApp gateway" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: form.whatsappGateway ?? "",
						onChange: (e) => setForm({
							...form,
							whatsappGateway: e.target.value
						})
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Payment gateway" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: form.paymentGateway ?? "",
						onChange: (e) => setForm({
							...form,
							paymentGateway: e.target.value
						})
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Storage provider" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: form.storageProvider ?? "",
						onChange: (e) => setForm({
							...form,
							storageProvider: e.target.value
						})
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "AI provider" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: form.aiProvider ?? "",
						onChange: (e) => setForm({
							...form,
							aiProvider: e.target.value
						})
					})] })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
				value: "domain",
				className: "grid sm:grid-cols-2 gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Custom domain" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: form.domain ?? "",
					onChange: (e) => setForm({
						...form,
						domain: e.target.value
					}),
					placeholder: "app.yourbrand.com"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Mobile app URL scheme" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: form.mobileAppScheme ?? "",
					onChange: (e) => setForm({
						...form,
						mobileAppScheme: e.target.value
					}),
					placeholder: "swiftai://"
				})] })]
			})
		]
	})] });
}
//#endregion
export { WhiteLabelPage as component };
