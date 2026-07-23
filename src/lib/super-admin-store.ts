// SWIFT — Super Admin operations store (CRM, checklists, white-label)
import { create } from "zustand";

export type TicketPriority = "low" | "normal" | "high" | "urgent";
export type TicketStatus = "open" | "in_progress" | "waiting" | "resolved" | "closed";
export type TicketNote = { id: string; ts: string; author: string; text: string };
export type SupportTicket = {
  id: string;
  tenantId: string;
  subject: string;
  body: string;
  priority: TicketPriority;
  status: TicketStatus;
  assignedTo?: string;
  channel: "email" | "phone" | "whatsapp" | "portal" | "meeting";
  createdAt: string;
  updatedAt: string;
  notes: TicketNote[];
};

export type TouchpointKind = "call" | "meeting" | "whatsapp" | "email" | "note";
export type Touchpoint = {
  id: string;
  tenantId: string;
  ts: string;
  kind: TouchpointKind;
  summary: string;
  by: string;
};

export type ChecklistKey =
  | "company_created" | "branch_added" | "employees_imported"
  | "attendance_configured" | "payroll_configured" | "pf_configured"
  | "esi_configured" | "leave_configured" | "ai_configured"
  | "compliance_configured" | "documents_configured" | "training_completed";

export const CHECKLIST_ITEMS: { key: ChecklistKey; label: string; group: string }[] = [
  { key: "company_created", label: "Company created", group: "Setup" },
  { key: "branch_added", label: "Branch added", group: "Setup" },
  { key: "employees_imported", label: "Employees imported", group: "Setup" },
  { key: "attendance_configured", label: "Attendance configured", group: "Modules" },
  { key: "payroll_configured", label: "Payroll configured", group: "Modules" },
  { key: "pf_configured", label: "PF configured", group: "Statutory" },
  { key: "esi_configured", label: "ESI configured", group: "Statutory" },
  { key: "leave_configured", label: "Leave configured", group: "Modules" },
  { key: "ai_configured", label: "AI configured", group: "AI" },
  { key: "compliance_configured", label: "Compliance configured", group: "Compliance" },
  { key: "documents_configured", label: "Documents configured", group: "Documents" },
  { key: "training_completed", label: "Training completed", group: "Onboarding" },
];

export type TenantChecklist = Record<ChecklistKey, boolean>;
export const emptyChecklist = (): TenantChecklist =>
  Object.fromEntries(CHECKLIST_ITEMS.map((c) => [c.key, false])) as TenantChecklist;

export type ImpersonationLog = {
  id: string; ts: string; tenantId: string; actor: string; note?: string;
};

export type WhiteLabelSettings = {
  brandName: string;
  tagline: string;
  logoDataUrl?: string;
  faviconDataUrl?: string;
  primaryColor: string;
  secondaryColor: string;
  pdfHeader: string;
  pdfFooter: string;
  emailFromName: string;
  emailFromAddress: string;
  supportEmail: string;
  supportPhone: string;
  smtpHost?: string;
  smtpUser?: string;
  smsGateway?: string;
  whatsappGateway?: string;
  paymentGateway?: string;
  storageProvider?: string;
  aiProvider?: string;
  domain?: string;
  mobileAppScheme?: string;
};

export const defaultWhiteLabel: WhiteLabelSettings = {
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
  aiProvider: "OpenAI ChatGPT",
};

export type UsageSnapshot = { tenantId: string; day: string; aiConversations: number; docs: number; loginCount: number };

export type UpiSettings = {
  payeeName: string;
  upiId: string;
  merchantCode?: string;
  qrImageDataUrl?: string;
  instructions: string;
  bankName?: string;
  accountNumber?: string;
  ifsc?: string;
};
export const defaultUpi: UpiSettings = {
  payeeName: "SWIFT AI Technologies",
  upiId: "swiftai@icici",
  instructions: "Scan the QR with any UPI app (GPay, PhonePe, Paytm, BHIM). After payment, upload the screenshot for verification.",
  bankName: "ICICI Bank",
  accountNumber: "1234567890",
  ifsc: "ICIC0001234",
};

export type PaymentSubmission = {
  id: string;
  tenantId: string;
  tenantName?: string;
  invoiceId?: string;
  invoiceNumber?: string;
  amount: number;
  utr?: string;
  payerName?: string;
  payerContact?: string;
  note?: string;
  screenshotDataUrl?: string;
  status: "pending" | "verified" | "rejected";
  submittedAt: string;
  verifiedAt?: string;
  verifiedBy?: string;
  rejectionReason?: string;
};

export type Tenant = {
  id: string;
  name: string;
  slug: string;
  legalName?: string;
  plan: string;
  status: "active" | "trial" | "suspended" | "cancelled" | string;
  createdAt: string;
  employees: number;
  adminEmail?: string;
  adminPassword?: string;
};

type State = {
  tickets: SupportTicket[];
  touchpoints: Touchpoint[];
  checklists: Record<string, TenantChecklist>;
  impersonation: ImpersonationLog[];
  whiteLabel: WhiteLabelSettings;
  usage: UsageSnapshot[];
  upi: UpiSettings;
  paymentSubmissions: PaymentSubmission[];
  tenants: Tenant[];

  loadSuperAdmin: () => Promise<void>;
  addTicket: (t: Omit<SupportTicket, "id" | "createdAt" | "updatedAt" | "notes">) => Promise<void>;
  updateTicket: (id: string, patch: Partial<SupportTicket>) => Promise<void>;
  addTicketNote: (id: string, note: Omit<TicketNote, "id" | "ts">) => Promise<void>;
  deleteTicket: (id: string) => Promise<void>;

  addTouchpoint: (t: Omit<Touchpoint, "id" | "ts">) => Promise<void>;
  deleteTouchpoint: (id: string) => Promise<void>;

  getChecklist: (tenantId: string) => TenantChecklist;
  setChecklistItem: (tenantId: string, key: ChecklistKey, val: boolean) => Promise<void>;

  recordImpersonation: (tenantId: string, actor: string, note?: string) => Promise<void>;

  updateWhiteLabel: (patch: Partial<WhiteLabelSettings>) => Promise<void>;
  resetWhiteLabel: () => Promise<void>;

  updateUpi: (patch: Partial<UpiSettings>) => Promise<void>;
  resetUpi: () => Promise<void>;
  submitPayment: (p: Omit<PaymentSubmission, "id" | "submittedAt" | "status">) => Promise<PaymentSubmission>;
  verifyPayment: (id: string, verifiedBy: string) => Promise<PaymentSubmission | null>;
  rejectPayment: (id: string, verifiedBy: string, reason: string) => Promise<void>;
  deletePayment: (id: string) => Promise<void>;

  addTenant: (t: Omit<Tenant, "id" | "createdAt">) => Promise<Tenant>;
  updateTenant: (id: string, patch: Partial<Tenant>) => Promise<void>;
  deleteTenant: (id: string) => Promise<void>;

  seedDemoOps: () => Promise<void>;
  resetOps: () => Promise<void>;
};

export function getBackendUrl(): string {
  const customUrl = import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_API_URL;
  if (customUrl) return customUrl.replace(/\/+$/, "");
  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    if (host !== "localhost" && host !== "127.0.0.1" && host !== "0.0.0.0") {
      return "";
    }
  }
  return "http://localhost:5000";
}

export async function safeFetch(path: string, options?: RequestInit): Promise<Response | null> {
  const baseUrl = getBackendUrl();
  if (!baseUrl && typeof window !== "undefined") {
    return null;
  }
  try {
    const fullUrl = path.startsWith("http") ? path : `${baseUrl}${path}`;
    const res = await fetch(fullUrl, options);
    return res;
  } catch (_err) {
    return null;
  }
}

const initial = () => ({
  tickets: [] as SupportTicket[],
  touchpoints: [] as Touchpoint[],
  checklists: {} as Record<string, TenantChecklist>,
  impersonation: [] as ImpersonationLog[],
  whiteLabel: defaultWhiteLabel,
  usage: [] as UsageSnapshot[],
  upi: defaultUpi,
  paymentSubmissions: [] as PaymentSubmission[],
  tenants: [] as Tenant[],
});

export const useSuperAdmin = create<State>()((set, get) => ({
  ...initial(),

  loadSuperAdmin: async () => {
    const res = await safeFetch("/api/initial-state");
    if (res && res.ok) {
      try {
        const data = await res.json();
        set({
          tickets: data.tickets && data.tickets.length ? data.tickets : get().tickets,
          touchpoints: data.touchpoints && data.touchpoints.length ? data.touchpoints : get().touchpoints,
          checklists: data.checklists || get().checklists,
          impersonation: data.impersonation || get().impersonation,
          whiteLabel: data.whiteLabel || defaultWhiteLabel,
          upi: data.upi || defaultUpi,
          paymentSubmissions: data.paymentSubmissions || get().paymentSubmissions,
          tenants: data.tenants && data.tenants.length ? data.tenants : get().tenants,
        });
      } catch (_err) {
        // Fallback to local store state
      }
    }
  },

  addTicket: async (t) => {
    const ticket: SupportTicket = {
      ...t,
      id: (t as any).id || crypto.randomUUID(),
      createdAt: (t as any).createdAt || new Date().toISOString(),
      updatedAt: (t as any).updatedAt || new Date().toISOString(),
      notes: t.notes || [],
    };
    set((s) => ({ tickets: [ticket, ...s.tickets.filter((x) => x.id !== ticket.id)] }));
    const res = await safeFetch("/api/tickets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(ticket),
    });
    if (res && res.ok) {
      try {
        const item = await res.json();
        set((s) => ({ tickets: s.tickets.map((x) => (x.id === ticket.id ? item : x)) }));
      } catch (_err) {}
    }
  },

  updateTicket: async (id, patch) => {
    set((s) => ({ tickets: s.tickets.map((t) => (t.id === id ? { ...t, ...patch, updatedAt: new Date().toISOString() } : t)) }));
    const res = await safeFetch(`/api/tickets/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    if (res && res.ok) {
      try {
        const updated = await res.json();
        set((s) => ({ tickets: s.tickets.map((t) => (t.id === id ? updated : t)) }));
      } catch (_err) {}
    }
  },

  addTicketNote: async (id, note) => {
    const noteObj: TicketNote = { ...note, id: (note as any).id || crypto.randomUUID(), ts: note.ts || new Date().toISOString() };
    set((s) => ({
      tickets: s.tickets.map((t) => (t.id === id ? { ...t, notes: [...t.notes, noteObj], updatedAt: new Date().toISOString() } : t)),
    }));
    await safeFetch(`/api/tickets/${id}/notes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(noteObj),
    });
  },

  deleteTicket: async (id) => {
    set((s) => ({ tickets: s.tickets.filter((t) => t.id !== id) }));
    await safeFetch(`/api/tickets/${id}`, { method: "DELETE" });
  },

  addTouchpoint: async (t) => {
    const touchpoint: Touchpoint = {
      ...t,
      id: (t as any).id || crypto.randomUUID(),
      ts: t.ts || new Date().toISOString(),
    };
    set((s) => ({ touchpoints: [touchpoint, ...s.touchpoints.filter((x) => x.id !== touchpoint.id)] }));
    const res = await safeFetch("/api/touchpoints", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(touchpoint),
    });
    if (res && res.ok) {
      try {
        const item = await res.json();
        set((s) => ({ touchpoints: s.touchpoints.map((x) => (x.id === touchpoint.id ? item : x)) }));
      } catch (_err) {}
    }
  },

  deleteTouchpoint: async (id) => {
    set((s) => ({ touchpoints: s.touchpoints.filter((t) => t.id !== id) }));
    await safeFetch(`/api/touchpoints/${id}`, { method: "DELETE" });
  },

  getChecklist: (tenantId) => {
    return get().checklists[tenantId] ?? emptyChecklist();
  },

  setChecklistItem: async (tenantId, key, val) => {
    const current = get().checklists[tenantId] ?? emptyChecklist();
    const nextChecklist = { ...current, [key]: val };
    set((s) => ({ checklists: { ...s.checklists, [tenantId]: nextChecklist } }));
    await safeFetch(`/api/checklists/${tenantId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ checklist: nextChecklist }),
    });
  },

  recordImpersonation: async (tenantId, actor, note) => {
    const item: ImpersonationLog = { id: crypto.randomUUID(), tenantId, actor, note, ts: new Date().toISOString() };
    set((s) => ({ impersonation: [item, ...s.impersonation].slice(0, 200) }));
    await safeFetch("/api/impersonations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tenantId, actor, note }),
    });
  },

  updateWhiteLabel: async (patch) => {
    try {
      const res = await fetch(`${API_URL}/api/settings/whitelabel`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...get().whiteLabel, ...patch }),
      });
      if (res.ok) {
        const updated = await res.json();
        set({ whiteLabel: updated });
      }
    } catch (err) {
      console.error("Error in updateWhiteLabel:", err);
    }
  },

  resetWhiteLabel: async () => {
    try {
      const res = await fetch(`${API_URL}/api/settings/whitelabel/reset`, { method: "POST" });
      if (res.ok) {
        const updated = await res.json();
        set({ whiteLabel: updated });
      }
    } catch (err) {
      console.error("Error in resetWhiteLabel:", err);
    }
  },

  updateUpi: async (patch) => {
    try {
      const res = await fetch(`${API_URL}/api/settings/upi`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...get().upi, ...patch }),
      });
      if (res.ok) {
        const updated = await res.json();
        set({ upi: updated });
      }
    } catch (err) {
      console.error("Error in updateUpi:", err);
    }
  },

  resetUpi: async () => {
    try {
      const res = await fetch(`${API_URL}/api/settings/upi/reset`, { method: "POST" });
      if (res.ok) {
        const updated = await res.json();
        set({ upi: updated });
      }
    } catch (err) {
      console.error("Error in resetUpi:", err);
    }
  },

  submitPayment: async (p) => {
    try {
      const res = await fetch(`${API_URL}/api/payments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(p),
      });
      const item = await res.json();
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
        body: JSON.stringify({ verifiedBy }),
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
        body: JSON.stringify({ verifiedBy, reason }),
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
      const res = await fetch(`${API_URL}/api/payments/${id}`, { method: "DELETE" });
      if (res.ok) {
        set((s) => ({ paymentSubmissions: s.paymentSubmissions.filter((x) => x.id !== id) }));
      }
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
      priority: "high" as const,
      status: "in_progress" as const,
      assignedTo: "Aditi (Support L2)",
      channel: "email" as const,
    };
    const t2 = {
      tenantId: "demo-tenant",
      subject: "Onboarding walk-through",
      body: "HR team wants a live walk-through of registration + attendance profiles.",
      priority: "normal" as const,
      status: "waiting" as const,
      assignedTo: "Priya (CSM)",
      channel: "meeting" as const,
    };
    const tp1 = { tenantId: "demo-tenant", kind: "call" as const, summary: "Renewal call — plan upgrade discussed", by: "Priya (CSM)" };
    const tp2 = { tenantId: "demo-tenant", kind: "whatsapp" as const, summary: "Sent implementation checklist", by: "Aditi" };

    await get().addTicket(t1);
    await get().addTicket(t2);
    await get().addTouchpoint(tp1);
    await get().addTouchpoint(tp2);
  },

  addTenant: async (t) => {
    try {
      const res = await fetch(`${API_URL}/api/tenants`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(t),
      });
      const item = await res.json();
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
        body: JSON.stringify(patch),
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
      const res = await fetch(`${API_URL}/api/tenants/${id}`, { method: "DELETE" });
      if (res.ok) {
        set((s) => ({ tenants: s.tenants.filter((t) => t.id !== id) }));
      }
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
  },
}));

export function computeCompletion(cl: TenantChecklist): number {
  const total = CHECKLIST_ITEMS.length;
  const done = CHECKLIST_ITEMS.filter((c) => cl[c.key]).length;
  return Math.round((done / total) * 100);
}
