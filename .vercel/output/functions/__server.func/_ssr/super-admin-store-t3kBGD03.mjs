import { n as create } from "../_libs/zustand.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/super-admin-store-t3kBGD03.js
var CHECKLIST_ITEMS = [
	{
		key: "company_created",
		label: "Company created",
		group: "Setup"
	},
	{
		key: "branch_added",
		label: "Branch added",
		group: "Setup"
	},
	{
		key: "employees_imported",
		label: "Employees imported",
		group: "Setup"
	},
	{
		key: "attendance_configured",
		label: "Attendance configured",
		group: "Modules"
	},
	{
		key: "payroll_configured",
		label: "Payroll configured",
		group: "Modules"
	},
	{
		key: "pf_configured",
		label: "PF configured",
		group: "Statutory"
	},
	{
		key: "esi_configured",
		label: "ESI configured",
		group: "Statutory"
	},
	{
		key: "leave_configured",
		label: "Leave configured",
		group: "Modules"
	},
	{
		key: "ai_configured",
		label: "AI configured",
		group: "AI"
	},
	{
		key: "compliance_configured",
		label: "Compliance configured",
		group: "Compliance"
	},
	{
		key: "documents_configured",
		label: "Documents configured",
		group: "Documents"
	},
	{
		key: "training_completed",
		label: "Training completed",
		group: "Onboarding"
	}
];
var emptyChecklist = () => Object.fromEntries(CHECKLIST_ITEMS.map((c) => [c.key, false]));
var defaultWhiteLabel = {
	brandName: "SWIFT AI",
	tagline: "Enterprise HR, Payroll & Compliance",
	primaryColor: "#4f46e5",
	secondaryColor: "#0ea5e9",
	pdfHeader: "Powered by SWIFT AI",
	pdfFooter: "Confidential — for internal use only",
	emailFromName: "SWIFT AI",
	emailFromAddress: "no-reply@swift.ai",
	supportEmail: "support@swift.ai",
	supportPhone: "+91 00000 00000",
	smtpHost: "smtp.swift.ai",
	smsGateway: "MSG91",
	whatsappGateway: "Gupshup",
	paymentGateway: "Razorpay",
	storageProvider: "Cloudflare R2",
	aiProvider: "OpenAI ChatGPT"
};
var defaultUpi = {
	payeeName: "SWIFT AI Technologies",
	upiId: "swiftai@icici",
	instructions: "Scan the QR with any UPI app (GPay, PhonePe, Paytm, BHIM). After payment, upload the screenshot for verification.",
	bankName: "ICICI Bank",
	accountNumber: "1234567890",
	ifsc: "ICIC0001234"
};
var API_URL = "http://localhost:5000".replace(/\/+$/, "");
var initial = () => ({
	tickets: [],
	touchpoints: [],
	checklists: {},
	impersonation: [],
	whiteLabel: defaultWhiteLabel,
	usage: [],
	upi: defaultUpi,
	paymentSubmissions: [],
	tenants: []
});
var useSuperAdmin = create()((set, get) => ({
	...initial(),
	loadSuperAdmin: async () => {
		try {
			const res = await fetch(`${API_URL}/api/initial-state`);
			if (res.ok) {
				const data = await res.json();
				set({
					tickets: data.tickets || [],
					touchpoints: data.touchpoints || [],
					checklists: data.checklists || {},
					impersonation: data.impersonation || [],
					whiteLabel: data.whiteLabel || defaultWhiteLabel,
					upi: data.upi || defaultUpi,
					paymentSubmissions: data.paymentSubmissions || [],
					tenants: data.tenants || []
				});
			}
		} catch (err) {
			console.error("Failed to load Super Admin state from API", err);
		}
	},
	addTicket: async (t) => {
		try {
			const res = await fetch(`${API_URL}/api/tickets`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(t)
			});
			if (res.ok) {
				const ticket = await res.json();
				set((s) => ({ tickets: [ticket, ...s.tickets] }));
			}
		} catch (err) {
			console.error("Error in addTicket:", err);
		}
	},
	updateTicket: async (id, patch) => {
		try {
			const res = await fetch(`${API_URL}/api/tickets/${id}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(patch)
			});
			if (res.ok) {
				const updated = await res.json();
				set((s) => ({ tickets: s.tickets.map((t) => t.id === id ? updated : t) }));
			}
		} catch (err) {
			console.error("Error in updateTicket:", err);
		}
	},
	addTicketNote: async (id, note) => {
		try {
			const res = await fetch(`${API_URL}/api/tickets/${id}/notes`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(note)
			});
			if (res.ok) {
				const updated = await res.json();
				set((s) => ({ tickets: s.tickets.map((t) => t.id === id ? updated : t) }));
			}
		} catch (err) {
			console.error("Error in addTicketNote:", err);
		}
	},
	deleteTicket: async (id) => {
		try {
			if ((await fetch(`${API_URL}/api/tickets/${id}`, { method: "DELETE" })).ok) set((s) => ({ tickets: s.tickets.filter((t) => t.id !== id) }));
		} catch (err) {
			console.error("Error in deleteTicket:", err);
		}
	},
	addTouchpoint: async (t) => {
		try {
			const res = await fetch(`${API_URL}/api/touchpoints`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(t)
			});
			if (res.ok) {
				const item = await res.json();
				set((s) => ({ touchpoints: [item, ...s.touchpoints] }));
			}
		} catch (err) {
			console.error("Error in addTouchpoint:", err);
		}
	},
	deleteTouchpoint: async (id) => {
		try {
			if ((await fetch(`${API_URL}/api/touchpoints/${id}`, { method: "DELETE" })).ok) set((s) => ({ touchpoints: s.touchpoints.filter((t) => t.id !== id) }));
		} catch (err) {
			console.error("Error in deleteTouchpoint:", err);
		}
	},
	getChecklist: (tenantId) => {
		return get().checklists[tenantId] ?? emptyChecklist();
	},
	setChecklistItem: async (tenantId, key, val) => {
		try {
			const nextChecklist = {
				...get().checklists[tenantId] ?? emptyChecklist(),
				[key]: val
			};
			const res = await fetch(`${API_URL}/api/checklists/${tenantId}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ checklist: nextChecklist })
			});
			if (res.ok) {
				const item = await res.json();
				set((s) => ({ checklists: {
					...s.checklists,
					[tenantId]: item.checklist
				} }));
			}
		} catch (err) {
			console.error("Error in setChecklistItem:", err);
		}
	},
	recordImpersonation: async (tenantId, actor, note) => {
		try {
			const res = await fetch(`${API_URL}/api/impersonations`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					tenantId,
					actor,
					note
				})
			});
			if (res.ok) {
				const item = await res.json();
				set((s) => ({ impersonation: [item, ...s.impersonation].slice(0, 200) }));
			}
		} catch (err) {
			console.error("Error in recordImpersonation:", err);
		}
	},
	updateWhiteLabel: async (patch) => {
		try {
			const res = await fetch(`${API_URL}/api/settings/whitelabel`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					...get().whiteLabel,
					...patch
				})
			});
			if (res.ok) set({ whiteLabel: await res.json() });
		} catch (err) {
			console.error("Error in updateWhiteLabel:", err);
		}
	},
	resetWhiteLabel: async () => {
		try {
			const res = await fetch(`${API_URL}/api/settings/whitelabel/reset`, { method: "POST" });
			if (res.ok) set({ whiteLabel: await res.json() });
		} catch (err) {
			console.error("Error in resetWhiteLabel:", err);
		}
	},
	updateUpi: async (patch) => {
		try {
			const res = await fetch(`${API_URL}/api/settings/upi`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					...get().upi,
					...patch
				})
			});
			if (res.ok) set({ upi: await res.json() });
		} catch (err) {
			console.error("Error in updateUpi:", err);
		}
	},
	resetUpi: async () => {
		try {
			const res = await fetch(`${API_URL}/api/settings/upi/reset`, { method: "POST" });
			if (res.ok) set({ upi: await res.json() });
		} catch (err) {
			console.error("Error in resetUpi:", err);
		}
	},
	submitPayment: async (p) => {
		try {
			const item = await (await fetch(`${API_URL}/api/payments`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(p)
			})).json();
			set((s) => ({ paymentSubmissions: [item, ...s.paymentSubmissions] }));
			return item;
		} catch (err) {
			console.error("Error in submitPayment:", err);
			throw err;
		}
	},
	verifyPayment: async (id, verifiedBy) => {
		try {
			const res = await fetch(`${API_URL}/api/payments/${id}/verify`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ verifiedBy })
			});
			if (res.ok) {
				const updated = await res.json();
				set((s) => ({ paymentSubmissions: s.paymentSubmissions.map((x) => x.id === id ? updated : x) }));
				return updated;
			}
			return null;
		} catch (err) {
			console.error("Error in verifyPayment:", err);
			return null;
		}
	},
	rejectPayment: async (id, verifiedBy, reason) => {
		try {
			const res = await fetch(`${API_URL}/api/payments/${id}/reject`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					verifiedBy,
					reason
				})
			});
			if (res.ok) {
				const updated = await res.json();
				set((s) => ({ paymentSubmissions: s.paymentSubmissions.map((x) => x.id === id ? updated : x) }));
			}
		} catch (err) {
			console.error("Error in rejectPayment:", err);
		}
	},
	deletePayment: async (id) => {
		try {
			if ((await fetch(`${API_URL}/api/payments/${id}`, { method: "DELETE" })).ok) set((s) => ({ paymentSubmissions: s.paymentSubmissions.filter((x) => x.id !== id) }));
		} catch (err) {
			console.error("Error in deletePayment:", err);
		}
	},
	seedDemoOps: async () => {
		if (get().tickets.length > 0) return;
		const t1 = {
			tenantId: "demo-tenant",
			subject: "PF challan generation issue",
			body: "PF challan for April 2026 shows wrong wage ceiling.",
			priority: "high",
			status: "in_progress",
			assignedTo: "Aditi (Support L2)",
			channel: "email"
		};
		const t2 = {
			tenantId: "demo-tenant",
			subject: "Onboarding walk-through",
			body: "HR team wants a live walk-through of registration + attendance profiles.",
			priority: "normal",
			status: "waiting",
			assignedTo: "Priya (CSM)",
			channel: "meeting"
		};
		const tp1 = {
			tenantId: "demo-tenant",
			kind: "call",
			summary: "Renewal call — plan upgrade discussed",
			by: "Priya (CSM)"
		};
		const tp2 = {
			tenantId: "demo-tenant",
			kind: "whatsapp",
			summary: "Sent implementation checklist",
			by: "Aditi"
		};
		await get().addTicket(t1);
		await get().addTicket(t2);
		await get().addTouchpoint(tp1);
		await get().addTouchpoint(tp2);
	},
	addTenant: async (t) => {
		try {
			const item = await (await fetch(`${API_URL}/api/tenants`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(t)
			})).json();
			set((s) => ({ tenants: [item, ...s.tenants] }));
			return item;
		} catch (err) {
			console.error("Error in addTenant:", err);
			throw err;
		}
	},
	updateTenant: async (id, patch) => {
		try {
			const res = await fetch(`${API_URL}/api/tenants/${id}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(patch)
			});
			if (res.ok) {
				const updated = await res.json();
				set((s) => ({ tenants: s.tenants.map((t) => t.id === id ? updated : t) }));
			}
		} catch (err) {
			console.error("Error in updateTenant:", err);
		}
	},
	deleteTenant: async (id) => {
		try {
			if ((await fetch(`${API_URL}/api/tenants/${id}`, { method: "DELETE" })).ok) set((s) => ({ tenants: s.tenants.filter((t) => t.id !== id) }));
		} catch (err) {
			console.error("Error in deleteTenant:", err);
		}
	},
	resetOps: async () => {
		try {
			await fetch(`${API_URL}/api/billing/reset`, { method: "POST" });
			await get().loadSuperAdmin();
		} catch (err) {
			console.error("Error in resetOps:", err);
		}
	}
}));
function computeCompletion(cl) {
	const total = CHECKLIST_ITEMS.length;
	const done = CHECKLIST_ITEMS.filter((c) => cl[c.key]).length;
	return Math.round(done / total * 100);
}
//#endregion
export { useSuperAdmin as i, computeCompletion as n, defaultWhiteLabel as r, CHECKLIST_ITEMS as t };
