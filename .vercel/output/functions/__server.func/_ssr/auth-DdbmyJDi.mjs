import { n as create } from "../_libs/zustand.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth-DdbmyJDi.js
var useAuth = create((set, get) => ({
	user: null,
	loading: true,
	isSuperAdmin: false,
	memberships: [],
	activeTenantId: null,
	setActiveTenant: (id) => {
		localStorage.setItem("swift-active-tenant", id);
		set({ activeTenantId: id });
	},
	signIn: async (email, role) => {
		const user = {
			id: crypto.randomUUID(),
			email
		};
		localStorage.setItem("swift-auth-user", JSON.stringify(user));
		let memberships = [];
		let isSuperAdmin = false;
		if (role === "super_admin" || email.startsWith("super")) isSuperAdmin = true;
		else if (role === "admin" || email.startsWith("admin")) memberships = [{
			tenant_id: "demo-tenant-1",
			role: "owner",
			tenant: {
				id: "demo-tenant-1",
				name: "SWIFT Demo Pvt Ltd",
				slug: "demo",
				legal_name: "SWIFT Demo Private Limited",
				address: "123 Business Ave, Suite 100, Bangalore, India",
				gstin: "29ABCDE1234F1Z5",
				plan: "growth",
				status: "active",
				created_at: (/* @__PURE__ */ new Date()).toISOString()
			}
		}];
		else memberships = [{
			tenant_id: "demo-tenant-1",
			role: "employee",
			tenant: {
				id: "demo-tenant-1",
				name: "SWIFT Demo Pvt Ltd",
				slug: "demo",
				legal_name: "SWIFT Demo Private Limited",
				address: "123 Business Ave, Suite 100, Bangalore, India",
				gstin: "29ABCDE1234F1Z5",
				plan: "growth",
				status: "active",
				created_at: (/* @__PURE__ */ new Date()).toISOString()
			}
		}];
		localStorage.setItem("swift-auth-role", isSuperAdmin ? "super_admin" : "user");
		localStorage.setItem("swift-auth-memberships", JSON.stringify(memberships));
		const activeTenantId = memberships[0]?.tenant_id ?? null;
		if (activeTenantId) localStorage.setItem("swift-active-tenant", activeTenantId);
		set({
			user,
			isSuperAdmin,
			memberships,
			activeTenantId,
			loading: false
		});
	},
	signUp: async (email) => {
		await get().signIn(email, "admin");
	},
	refresh: async () => {
		const userStr = localStorage.getItem("swift-auth-user");
		if (!userStr) {
			set({
				user: null,
				isSuperAdmin: false,
				memberships: [],
				activeTenantId: null,
				loading: false
			});
			return;
		}
		const user = JSON.parse(userStr);
		const isSuperAdmin = localStorage.getItem("swift-auth-role") === "super_admin";
		const memsStr = localStorage.getItem("swift-auth-memberships");
		const memberships = memsStr ? JSON.parse(memsStr) : [];
		const saved = localStorage.getItem("swift-active-tenant");
		set({
			user,
			isSuperAdmin,
			memberships,
			activeTenantId: memberships.find((m) => m.tenant_id === saved)?.tenant_id ?? memberships[0]?.tenant_id ?? null,
			loading: false
		});
	},
	signOut: async () => {
		localStorage.removeItem("swift-auth-user");
		localStorage.removeItem("swift-auth-role");
		localStorage.removeItem("swift-auth-memberships");
		localStorage.removeItem("swift-active-tenant");
		set({
			user: null,
			isSuperAdmin: false,
			memberships: [],
			activeTenantId: null
		});
	}
}));
if (typeof window !== "undefined") useAuth.getState().refresh();
//#endregion
export { useAuth as t };
