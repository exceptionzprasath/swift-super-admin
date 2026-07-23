import { create } from "zustand";
import {
  defaultPlans, defaultCoupons, defaultReferralPrograms,
  emptyUsage, buildInvoice, cycleDays, prorateCredit, referralCodeFor,
  type Plan, type Coupon, type ReferralProgram, type TenantSubscription,
  type Invoice, type ModuleKey, type ModuleStatus, type PlanLimits,
  type PaymentMethod, type UsageCounters, type SubscriptionHistoryEntry,
} from "./billing";
import {
  defaultReminderConfig, computeReminderPlan, dueReminders, resolveScheduledStatus,
  type ReminderConfig, type ReminderLogEntry, type ReminderPlan,
} from "./renewal-scheduler";

type ReferralLedger = {
  tenantId: string;
  code: string;
  invited: string[];
  registered: string[];
  activated: string[];
  paid: string[];
  rewardsEarned: number;
};

type BillingState = {
  plans: Plan[];
  coupons: Coupon[];
  referralPrograms: ReferralProgram[];
  subscriptions: TenantSubscription[];
  invoices: Invoice[];
  referrals: ReferralLedger[];
  audit: SubscriptionHistoryEntry[];
  reminderConfig: ReminderConfig;
  reminderLog: ReminderLogEntry[];

  loadBilling: () => Promise<void>;

  // plan CRUD
  addPlan: (p: Plan) => Promise<void>;
  updatePlan: (id: string, patch: Partial<Plan>) => Promise<void>;
  deletePlan: (id: string) => Promise<void>;

  // subscription
  ensureSubscription: (tenantId: string, planId?: string) => Promise<TenantSubscription>;
  updateSubscription: (id: string, patch: Partial<TenantSubscription>) => Promise<void>;
  setModuleOverride: (subId: string, module: ModuleKey, status: ModuleStatus | null) => Promise<void>;
  setFeatureOverride: (subId: string, key: string, value: boolean | null) => Promise<void>;
  setLimitOverride: (subId: string, key: keyof PlanLimits, value: number | null) => Promise<void>;
  bumpUsage: (tenantId: string, key: keyof UsageCounters, by?: number) => Promise<void>;
  setUsage: (tenantId: string, patch: Partial<UsageCounters>) => Promise<void>;

  // billing actions
  upgrade: (subId: string, toPlanId: string, employees: number, opts?: { immediate?: boolean; couponCode?: string; paymentMethod?: PaymentMethod; actor?: string }) => Promise<Invoice | null>;
  downgrade: (subId: string, toPlanId: string, actor?: string) => Promise<void>;
  renew: (subId: string, employees: number, opts?: { couponCode?: string; paymentMethod?: PaymentMethod; actor?: string }) => Promise<Invoice | null>;
  markInvoicePaid: (invoiceId: string, method: PaymentMethod) => Promise<void>;

  // coupons / referrals
  addCoupon: (c: Coupon) => Promise<void>;
  updateCoupon: (id: string, patch: Partial<Coupon>) => Promise<void>;
  deleteCoupon: (id: string) => Promise<void>;
  addReferralProgram: (p: ReferralProgram) => Promise<void>;
  updateReferralProgram: (id: string, patch: Partial<ReferralProgram>) => Promise<void>;
  deleteReferralProgram: (id: string) => Promise<void>;
  recordReferral: (referrerTenantId: string, invitedIdentifier: string, stage: "invited" | "registered" | "activated" | "paid") => Promise<void>;

  // renewal scheduler
  updateReminderConfig: (patch: Partial<ReminderConfig>) => Promise<void>;
  setReminderChannel: (subId: string, channel: keyof TenantSubscription["reminderChannels"], on: boolean) => Promise<void>;
  runRenewalScheduler: (now?: Date) => Promise<ReminderLogEntry[]>;
  previewReminderPlan: (subId: string, now?: Date) => ReminderPlan[];
  clearReminderLog: (subId?: string) => Promise<void>;

  // reset
  resetBilling: () => Promise<void>;
};

import { safeFetch } from "./super-admin-store";

const initial = () => ({
  plans: defaultPlans(),
  coupons: defaultCoupons(),
  referralPrograms: defaultReferralPrograms(),
  subscriptions: [] as TenantSubscription[],
  invoices: [] as Invoice[],
  referrals: [] as ReferralLedger[],
  audit: [] as SubscriptionHistoryEntry[],
  reminderConfig: defaultReminderConfig,
  reminderLog: [] as ReminderLogEntry[],
});

export const useBilling = create<BillingState>()((set, get) => ({
  ...initial(),

  loadBilling: async () => {
    const res = await safeFetch("/api/initial-state");
    if (res && res.ok) {
      try {
        const data = await res.json();
        set({
          plans: data.plans && data.plans.length ? data.plans : get().plans,
          coupons: data.coupons && data.coupons.length ? data.coupons : get().coupons,
          referralPrograms: data.referralPrograms && data.referralPrograms.length ? data.referralPrograms : get().referralPrograms,
          subscriptions: data.subscriptions || get().subscriptions,
          invoices: data.invoices || get().invoices,
          referrals: data.referrals || get().referrals,
          audit: data.audit || get().audit,
          reminderConfig: data.reminderConfig || get().reminderConfig,
          reminderLog: data.reminderLog || get().reminderLog,
        });
      } catch (_err) {}
    }
  },

  addPlan: async (p) => {
    try {
      const res = await fetch(`${API_URL}/api/plans`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(p),
      });
      if (res.ok) {
        const item = await res.json();
        set((s) => ({ plans: [...s.plans, item] }));
      }
    } catch (err) {
      console.error("Error in addPlan:", err);
    }
  },

  updatePlan: async (id, patch) => {
    try {
      const res = await fetch(`${API_URL}/api/plans/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      if (res.ok) {
        const updated = await res.json();
        set((s) => ({ plans: s.plans.map((p) => p.id === id ? updated : p) }));
      }
    } catch (err) {
      console.error("Error in updatePlan:", err);
    }
  },

  deletePlan: async (id) => {
    try {
      const res = await fetch(`${API_URL}/api/plans/${id}`, { method: "DELETE" });
      if (res.ok) {
        set((s) => ({ plans: s.plans.filter((p) => p.id !== id) }));
      }
    } catch (err) {
      console.error("Error in deletePlan:", err);
    }
  },

  ensureSubscription: async (tenantId, planId) => {
    try {
      const existing = get().subscriptions.find((s) => s.tenantId === tenantId);
      if (existing) return existing;

      const res = await fetch(`${API_URL}/api/subscriptions/ensure`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tenantId, planId }),
      });
      const data = await res.json();
      set((s) => ({
        subscriptions: [...s.subscriptions, data.subscription],
        referrals: s.referrals.find((r) => r.tenantId === tenantId) ? s.referrals : [...s.referrals, data.referral],
      }));
      return data.subscription;
    } catch (err) {
      console.error("Error in ensureSubscription:", err);
      throw err;
    }
  },

  updateSubscription: async (id, patch) => {
    try {
      const res = await fetch(`${API_URL}/api/subscriptions/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      if (res.ok) {
        const updated = await res.json();
        set((s) => ({ subscriptions: s.subscriptions.map((x) => x.id === id ? updated : x) }));
      }
    } catch (err) {
      console.error("Error in updateSubscription:", err);
    }
  },

  setModuleOverride: async (subId, module, status) => {
    try {
      const res = await fetch(`${API_URL}/api/subscriptions/${subId}/module`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ module, status }),
      });
      if (res.ok) {
        const updated = await res.json();
        set((s) => ({ subscriptions: s.subscriptions.map((x) => x.id === subId ? updated : x) }));
      }
    } catch (err) {
      console.error("Error in setModuleOverride:", err);
    }
  },

  setFeatureOverride: async (subId, key, value) => {
    try {
      const res = await fetch(`${API_URL}/api/subscriptions/${subId}/feature`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, value }),
      });
      if (res.ok) {
        const updated = await res.json();
        set((s) => ({ subscriptions: s.subscriptions.map((x) => x.id === subId ? updated : x) }));
      }
    } catch (err) {
      console.error("Error in setFeatureOverride:", err);
    }
  },

  setLimitOverride: async (subId, key, value) => {
    try {
      const res = await fetch(`${API_URL}/api/subscriptions/${subId}/limit`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, value }),
      });
      if (res.ok) {
        const updated = await res.json();
        set((s) => ({ subscriptions: s.subscriptions.map((x) => x.id === subId ? updated : x) }));
      }
    } catch (err) {
      console.error("Error in setLimitOverride:", err);
    }
  },

  bumpUsage: async (tenantId, key, by = 1) => {
    try {
      const res = await fetch(`${API_URL}/api/subscriptions/usage/bump`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tenantId, key, by }),
      });
      if (res.ok) {
        const updated = await res.json();
        set((s) => ({ subscriptions: s.subscriptions.map((x) => x.tenantId === tenantId ? updated : x) }));
      }
    } catch (err) {
      console.error("Error in bumpUsage:", err);
    }
  },

  setUsage: async (tenantId, patch) => {
    try {
      const res = await fetch(`${API_URL}/api/subscriptions/usage/set`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tenantId, patch }),
      });
      if (res.ok) {
        const updated = await res.json();
        set((s) => ({ subscriptions: s.subscriptions.map((x) => x.tenantId === tenantId ? updated : x) }));
      }
    } catch (err) {
      console.error("Error in setUsage:", err);
    }
  },

  upgrade: async (subId, toPlanId, employees, opts = {}) => {
    try {
      const sub = get().subscriptions.find((x) => x.id === subId);
      const toPlan = get().plans.find((p) => p.id === toPlanId);
      const fromPlan = sub && get().plans.find((p) => p.id === sub.planId);
      if (!sub || !toPlan) return null;
      const coupon = opts.couponCode ? get().coupons.find((c) => c.code === opts.couponCode) : undefined;
      const proration = fromPlan ? prorateCredit(sub, fromPlan, employees) : 0;
      const invoice = buildInvoice({
        tenantId: sub.tenantId, plan: toPlan, employees,
        coupon, prorationCredit: proration, kind: "upgrade",
        paymentMethod: opts.paymentMethod,
      });
      const now = new Date();
      const activateAt = opts.immediate === false ? new Date(sub.expiresAt) : now;
      const expires = new Date(activateAt.getTime() + cycleDays(toPlan.cycle) * 86400_000);

      const nextSub = {
        ...sub, planId: toPlan.id, cycle: toPlan.cycle,
        status: "active" as const, paymentStatus: (opts.paymentMethod ? "paid" : "pending") as any,
        activatedAt: activateAt.toISOString(),
        renewalAt: expires.toISOString(), expiresAt: expires.toISOString(),
        couponCode: coupon?.code ?? sub.couponCode,
        history: [{ ts: now.toISOString(), actor: opts.actor ?? "admin", kind: "upgrade" as const, fromPlanId: sub.planId, toPlanId: toPlan.id, amount: invoice.total, note: `Upgraded to ${toPlan.name}` }, ...(sub.history || [])],
      };

      const updatedCoupon = coupon ? { ...coupon, used: coupon.used + 1 } : undefined;
      const auditEntry = { ts: now.toISOString(), id: crypto.randomUUID(), actor: opts.actor ?? "admin", kind: "upgrade" as const, fromPlanId: sub.planId, toPlanId: toPlan.id, amount: invoice.total };

      const res = await fetch(`${API_URL}/api/billing/upgrade`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invoice, subscription: nextSub, coupon: updatedCoupon, auditEntry }),
      });

      if (res.ok) {
        set((s) => ({
          invoices: [invoice, ...s.invoices],
          coupons: coupon ? s.coupons.map((c) => c.id === coupon.id ? updatedCoupon! : c) : s.coupons,
          subscriptions: s.subscriptions.map((x) => x.id === subId ? nextSub : x),
          audit: [auditEntry, ...s.audit],
        }));
        return invoice;
      }
      return null;
    } catch (err) {
      console.error("Error in upgrade:", err);
      return null;
    }
  },

  downgrade: async (subId, toPlanId, actor = "admin") => {
    try {
      const sub = get().subscriptions.find((x) => x.id === subId);
      const toPlan = get().plans.find((p) => p.id === toPlanId);
      if (!sub || !toPlan) return;
      const now = new Date().toISOString();
      const nextSub = {
        ...sub, planId: toPlan.id,
        history: [{ ts: now, actor, kind: "downgrade" as const, fromPlanId: sub.planId, toPlanId: toPlan.id, note: "Premium features locked; data retained." }, ...(sub.history || [])],
      };
      const auditEntry = { ts: now, id: crypto.randomUUID(), actor, kind: "downgrade" as const, fromPlanId: sub.planId, toPlanId: toPlan.id };

      const res = await fetch(`${API_URL}/api/billing/downgrade`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subscription: nextSub, auditEntry }),
      });

      if (res.ok) {
        set((s) => ({
          subscriptions: s.subscriptions.map((x) => x.id === subId ? nextSub : x),
          audit: [auditEntry, ...s.audit],
        }));
      }
    } catch (err) {
      console.error("Error in downgrade:", err);
    }
  },

  renew: async (subId, employees, opts = {}) => {
    try {
      const sub = get().subscriptions.find((x) => x.id === subId);
      const plan = sub && get().plans.find((p) => p.id === sub.planId);
      if (!sub || !plan) return null;
      const coupon = opts.couponCode ? get().coupons.find((c) => c.code === opts.couponCode) : undefined;
      const invoice = buildInvoice({ tenantId: sub.tenantId, plan, employees, coupon, kind: "renewal", paymentMethod: opts.paymentMethod });
      const now = new Date();
      const expires = new Date(now.getTime() + cycleDays(plan.cycle) * 86400_000);

      const nextSub = {
        ...sub, status: "active" as const, paymentStatus: (opts.paymentMethod ? "paid" : "pending") as any,
        renewalAt: expires.toISOString(), expiresAt: expires.toISOString(),
        history: [{ ts: now.toISOString(), actor: opts.actor ?? "admin", kind: "renewal" as const, amount: invoice.total }, ...(sub.history || [])],
      };

      const updatedCoupon = coupon ? { ...coupon, used: coupon.used + 1 } : undefined;
      const auditEntry = { ts: now.toISOString(), id: crypto.randomUUID(), actor: opts.actor ?? "admin", kind: "renewal" as const, amount: invoice.total };

      const res = await fetch(`${API_URL}/api/billing/renew`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invoice, subscription: nextSub, coupon: updatedCoupon, auditEntry }),
      });

      if (res.ok) {
        set((s) => ({
          invoices: [invoice, ...s.invoices],
          coupons: coupon ? s.coupons.map((c) => c.id === coupon.id ? updatedCoupon! : c) : s.coupons,
          subscriptions: s.subscriptions.map((x) => x.id === subId ? nextSub : x),
          audit: [auditEntry, ...s.audit],
        }));
        return invoice;
      }
      return null;
    } catch (err) {
      console.error("Error in renew:", err);
      return null;
    }
  },

  markInvoicePaid: async (invoiceId, method) => {
    try {
      const res = await fetch(`${API_URL}/api/invoices/${invoiceId}/pay`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ method }),
      });
      if (res.ok) {
        const updated = await res.json();
        set((s) => ({ invoices: s.invoices.map((i) => i.id === invoiceId ? updated : i) }));
      }
    } catch (err) {
      console.error("Error in markInvoicePaid:", err);
    }
  },

  addCoupon: async (c) => {
    try {
      const res = await fetch(`${API_URL}/api/coupons`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(c),
      });
      if (res.ok) {
        const item = await res.json();
        set((s) => ({ coupons: [...s.coupons, item] }));
      }
    } catch (err) {
      console.error("Error in addCoupon:", err);
    }
  },

  updateCoupon: async (id, patch) => {
    try {
      const res = await fetch(`${API_URL}/api/coupons/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      if (res.ok) {
        const updated = await res.json();
        set((s) => ({ coupons: s.coupons.map((c) => c.id === id ? updated : c) }));
      }
    } catch (err) {
      console.error("Error in updateCoupon:", err);
    }
  },

  deleteCoupon: async (id) => {
    try {
      const res = await fetch(`${API_URL}/api/coupons/${id}`, { method: "DELETE" });
      if (res.ok) {
        set((s) => ({ coupons: s.coupons.filter((c) => c.id !== id) }));
      }
    } catch (err) {
      console.error("Error in deleteCoupon:", err);
    }
  },

  addReferralProgram: async (p) => {
    try {
      const res = await fetch(`${API_URL}/api/referrals/programs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(p),
      });
      if (res.ok) {
        const item = await res.json();
        set((s) => ({ referralPrograms: [...s.referralPrograms, item] }));
      }
    } catch (err) {
      console.error("Error in addReferralProgram:", err);
    }
  },

  updateReferralProgram: async (id, patch) => {
    try {
      const res = await fetch(`${API_URL}/api/referrals/programs/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      if (res.ok) {
        const updated = await res.json();
        set((s) => ({ referralPrograms: s.referralPrograms.map((p) => p.id === id ? updated : p) }));
      }
    } catch (err) {
      console.error("Error in updateReferralProgram:", err);
    }
  },

  deleteReferralProgram: async (id) => {
    try {
      const res = await fetch(`${API_URL}/api/referrals/programs/${id}`, { method: "DELETE" });
      if (res.ok) {
        set((s) => ({ referralPrograms: s.referralPrograms.filter((p) => p.id !== id) }));
      }
    } catch (err) {
      console.error("Error in deleteReferralProgram:", err);
    }
  },

  recordReferral: async (referrerTenantId, invitedIdentifier, stage) => {
    try {
      const referrals = get().referrals.map((r) => {
        if (r.tenantId !== referrerTenantId) return r;
        const bucket = { ...r, [stage]: Array.from(new Set([...(r as any)[stage], invitedIdentifier])) };
        return bucket;
      });
      const res = await fetch(`${API_URL}/api/referrals/record`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ referralsList: referrals }),
      });
      if (res.ok) {
        set({ referrals });
      }
    } catch (err) {
      console.error("Error in recordReferral:", err);
    }
  },

  updateReminderConfig: async (patch) => {
    try {
      const nextConfig = {
        ...get().reminderConfig, ...patch,
        channels: { ...get().reminderConfig.channels, ...(patch.channels ?? {}) },
      };
      const res = await fetch(`${API_URL}/api/settings/reminder-config`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nextConfig),
      });
      if (res.ok) {
        set({ reminderConfig: nextConfig });
      }
    } catch (err) {
      console.error("Error in updateReminderConfig:", err);
    }
  },

  setReminderChannel: async (subId, channel, on) => {
    try {
      const sub = get().subscriptions.find((x) => x.id === subId);
      if (!sub) return;
      const nextChannels = { ...sub.reminderChannels, [channel]: on };
      const res = await fetch(`${API_URL}/api/subscriptions/${subId}/reminder-channels`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reminderChannels: nextChannels }),
      });
      if (res.ok) {
        set((s) => ({
          subscriptions: s.subscriptions.map((x) => x.id === subId ? { ...x, reminderChannels: nextChannels } : x),
        }));
      }
    } catch (err) {
      console.error("Error in setReminderChannel:", err);
    }
  },

  runRenewalScheduler: async (now = new Date()) => {
    try {
      const { subscriptions, reminderConfig, reminderLog } = get();
      const newLog: ReminderLogEntry[] = [];
      const statusPatches: Record<string, TenantSubscription["status"]> = {};

      for (const sub of subscriptions) {
        const nextStatus = resolveScheduledStatus(sub, reminderConfig, now);
        if (nextStatus !== sub.status) statusPatches[sub.id] = nextStatus;

        const subChans = sub.reminderChannels;
        const due = dueReminders(sub, reminderConfig, reminderLog, now)
          .map((r) => ({
            ...r,
            channels: r.channels.filter((c) => (subChans as any)[c]),
          }))
          .filter((r) => r.channels.length > 0);

        for (const r of due) {
          newLog.push({
            id: crypto.randomUUID(),
            subscriptionId: sub.id,
            tenantId: sub.tenantId,
            stage: r.stage,
            channels: r.channels,
            sentAt: now.toISOString(),
            message: r.message,
          });
        }
      }

      if (newLog.length === 0 && Object.keys(statusPatches).length === 0) return [];

      const updatedSubscriptions = subscriptions.map((x) => {
        const newStatus = statusPatches[x.id];
        if (!newStatus) return x;
        return {
          ...x, status: newStatus,
          history: [
            { ts: now.toISOString(), actor: "scheduler", kind: "grace_start" as const, note: `Auto status → ${newStatus}` },
            ...(x.history || []),
          ],
        };
      });

      const res = await fetch(`${API_URL}/api/billing/scheduler/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ logEntries: newLog, updatedSubscriptions }),
      });

      if (res.ok) {
        set((s) => ({
          reminderLog: [...newLog, ...s.reminderLog].slice(0, 500),
          subscriptions: updatedSubscriptions,
        }));
      }

      return newLog;
    } catch (err) {
      console.error("Error in runRenewalScheduler:", err);
      return [];
    }
  },

  previewReminderPlan: (subId, now) => {
    const sub = get().subscriptions.find((x) => x.id === subId);
    if (!sub) return [];
    return computeReminderPlan(sub, get().reminderConfig, now);
  },

  clearReminderLog: async (subId) => {
    try {
      const query = subId ? `?subId=${subId}` : "";
      const res = await fetch(`${API_URL}/api/billing/scheduler/log${query}`, { method: "DELETE" });
      if (res.ok) {
        set((s) => ({
          reminderLog: subId ? s.reminderLog.filter((l) => l.subscriptionId !== subId) : [],
        }));
      }
    } catch (err) {
      console.error("Error in clearReminderLog:", err);
    }
  },

  resetBilling: async () => {
    try {
      await fetch(`${API_URL}/api/billing/reset`, { method: "POST" });
      await get().loadBilling();
    } catch (err) {
      console.error("Error in resetBilling:", err);
    }
  },
}));
