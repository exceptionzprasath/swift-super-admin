import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/lib/auth";
import { useStore } from "@/lib/store";
import { useSuperAdmin } from "@/lib/super-admin-store";
import { useBilling } from "@/lib/billing-store";
import { SuperAdminShell } from "@/components/super-admin-shell";
import { UpiQR } from "@/components/upi-qr";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { QrCode, Upload, CheckCircle2, XCircle, Clock, Save, RefreshCw, Image as ImageIcon, Trash2 } from "lucide-react";

export const Route = createFileRoute("/super-admin/payments")({
  head: () => ({ meta: [{ title: "UPI Payments · SWIFT Super Admin" }] }),
  component: PaymentsPage,
});

function PaymentsPage() {
  const nav = useNavigate();
  const { user, isSuperAdmin, loading } = useAuth();
  const demoMode = useStore((s) => s.demoMode);
  const { upi, updateUpi, resetUpi, paymentSubmissions, verifyPayment, rejectPayment, deletePayment } = useSuperAdmin();
  const { invoices, markInvoicePaid, updateSubscription, subscriptions } = useBilling();
  const [tab, setTab] = useState("pending");
  const [rejectTarget, setRejectTarget] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [viewShot, setViewShot] = useState<string | null>(null);
  const [draft, setDraft] = useState(upi);

  useEffect(() => setDraft(upi), [upi]);
  useEffect(() => {
    if (loading) return;
    if (!user && !demoMode) { nav({ to: "/login" }); return; }
    if (!isSuperAdmin && !demoMode) { nav({ to: "/admin" }); }
  }, [user, isSuperAdmin, loading, demoMode, nav]);

  const pending = useMemo(() => paymentSubmissions.filter((p) => p.status === "pending"), [paymentSubmissions]);
  const verified = useMemo(() => paymentSubmissions.filter((p) => p.status === "verified"), [paymentSubmissions]);
  const rejected = useMemo(() => paymentSubmissions.filter((p) => p.status === "rejected"), [paymentSubmissions]);

  const save = () => { updateUpi(draft); toast.success("UPI details saved"); };

  const onQrFile = async (f: File | null) => {
    if (!f) return;
    if (f.size > 2_000_000) return toast.error("QR image must be under 2 MB");
    const reader = new FileReader();
    reader.onload = () => setDraft((d) => ({ ...d, qrImageDataUrl: String(reader.result) }));
    reader.readAsDataURL(f);
  };

  const doVerify = (id: string) => {
    const rec = verifyPayment(id, "super-admin");
    if (!rec) return;
    if (rec.invoiceId) markInvoicePaid(rec.invoiceId, "upi");
    // activate the subscription for that tenant
    const sub = subscriptions.find((s) => s.tenantId === rec.tenantId);
    if (sub) updateSubscription(sub.id, { paymentStatus: "paid", status: "active" });
    toast.success(`Verified · ${rec.tenantName ?? rec.tenantId} · operations opened`);
  };

  const doReject = () => {
    if (!rejectTarget) return;
    rejectPayment(rejectTarget, "super-admin", rejectReason || "No reason");
    toast.success("Payment rejected");
    setRejectTarget(null); setRejectReason("");
  };

  const invoiceFor = (id?: string) => invoices.find((i) => i.id === id);

  return (
    <SuperAdminShell>
      <div className="mb-4">
        <h1 className="font-display text-2xl font-semibold flex items-center gap-2"><QrCode className="h-6 w-6" /> UPI Payments</h1>
        <p className="text-sm text-muted-foreground">Clients pay via UPI QR, upload screenshot; you verify and operations open.</p>
      </div>

      <Tabs value={tab} onValueChange={setTab} className="space-y-4">
        <TabsList className="flex-wrap h-auto">
          <TabsTrigger value="pending">Pending <Badge variant="outline" className="ml-2">{pending.length}</Badge></TabsTrigger>
          <TabsTrigger value="verified">Verified <Badge variant="outline" className="ml-2">{verified.length}</Badge></TabsTrigger>
          <TabsTrigger value="rejected">Rejected <Badge variant="outline" className="ml-2">{rejected.length}</Badge></TabsTrigger>
          <TabsTrigger value="settings">UPI / QR settings</TabsTrigger>
        </TabsList>

        {(["pending", "verified", "rejected"] as const).map((k) => {
          const list = k === "pending" ? pending : k === "verified" ? verified : rejected;
          return (
            <TabsContent key={k} value={k} className="space-y-3">
              {list.length === 0 ? (
                <div className="rounded-xl border bg-card p-10 text-center text-sm text-muted-foreground">No {k} payments.</div>
              ) : list.map((p) => {
                const inv = invoiceFor(p.invoiceId);
                return (
                  <div key={p.id} className="rounded-xl border bg-card p-4 shadow-card">
                    <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                      {p.screenshotDataUrl ? (
                        <button onClick={() => setViewShot(p.screenshotDataUrl!)} className="shrink-0">
                          <img src={p.screenshotDataUrl} alt="Payment proof" className="h-28 w-28 rounded-lg border object-cover" />
                        </button>
                      ) : (
                        <div className="h-28 w-28 rounded-lg border bg-muted flex items-center justify-center text-muted-foreground"><ImageIcon className="h-6 w-6" /></div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <div className="font-semibold truncate">{p.tenantName ?? p.tenantId}</div>
                          <Badge variant="outline" className="capitalize">
                            {p.status === "pending" ? <Clock className="h-3 w-3 mr-1" /> : p.status === "verified" ? <CheckCircle2 className="h-3 w-3 mr-1" /> : <XCircle className="h-3 w-3 mr-1" />}
                            {p.status}
                          </Badge>
                          {inv && <Badge variant="outline">Invoice {inv.number}</Badge>}
                        </div>
                        <div className="mt-1 text-sm">Amount: <span className="font-semibold">₹{p.amount.toLocaleString()}</span></div>
                        <div className="text-xs text-muted-foreground mt-1 space-y-0.5">
                          <div>UTR / Ref: {p.utr || "—"}</div>
                          <div>Payer: {p.payerName || "—"} · {p.payerContact || "—"}</div>
                          {p.note && <div>Note: {p.note}</div>}
                          <div>Submitted: {new Date(p.submittedAt).toLocaleString()}</div>
                          {p.verifiedAt && <div>Actioned: {new Date(p.verifiedAt).toLocaleString()} by {p.verifiedBy}</div>}
                          {p.rejectionReason && <div className="text-destructive">Reason: {p.rejectionReason}</div>}
                        </div>
                      </div>
                      <div className="flex sm:flex-col gap-2 sm:w-40">
                        {p.status === "pending" && (
                          <>
                            <Button size="sm" className="flex-1" onClick={() => doVerify(p.id)}><CheckCircle2 className="h-4 w-4 mr-1" />Verify & Open</Button>
                            <Button size="sm" variant="outline" className="flex-1" onClick={() => setRejectTarget(p.id)}><XCircle className="h-4 w-4 mr-1" />Reject</Button>
                          </>
                        )}
                        <Button size="sm" variant="ghost" className="text-destructive" onClick={() => deletePayment(p.id)}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </TabsContent>
          );
        })}

        <TabsContent value="settings" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="rounded-xl border bg-card p-5 shadow-card space-y-3">
              <div className="font-medium">UPI details</div>
              <div><Label>Payee name</Label><Input value={draft.payeeName} onChange={(e) => setDraft({ ...draft, payeeName: e.target.value })} /></div>
              <div><Label>UPI ID (VPA)</Label><Input value={draft.upiId} onChange={(e) => setDraft({ ...draft, upiId: e.target.value })} placeholder="name@bank" /></div>
              <div><Label>Merchant code (optional)</Label><Input value={draft.merchantCode ?? ""} onChange={(e) => setDraft({ ...draft, merchantCode: e.target.value })} /></div>
              <div className="grid grid-cols-2 gap-2">
                <div><Label>Bank</Label><Input value={draft.bankName ?? ""} onChange={(e) => setDraft({ ...draft, bankName: e.target.value })} /></div>
                <div><Label>IFSC</Label><Input value={draft.ifsc ?? ""} onChange={(e) => setDraft({ ...draft, ifsc: e.target.value })} /></div>
              </div>
              <div><Label>Account number</Label><Input value={draft.accountNumber ?? ""} onChange={(e) => setDraft({ ...draft, accountNumber: e.target.value })} /></div>
              <div><Label>Payment instructions</Label><Textarea rows={3} value={draft.instructions} onChange={(e) => setDraft({ ...draft, instructions: e.target.value })} /></div>
              <div className="flex gap-2">
                <Button onClick={save}><Save className="h-4 w-4 mr-1" />Save</Button>
                <Button variant="outline" onClick={() => { resetUpi(); toast.success("Reset to defaults"); }}><RefreshCw className="h-4 w-4 mr-1" />Reset</Button>
              </div>
            </div>
            <div className="rounded-xl border bg-card p-5 shadow-card space-y-3">
              <div className="font-medium">QR code preview</div>
              <div className="flex justify-center">
                <UpiQR upiId={draft.upiId} payeeName={draft.payeeName} merchantCode={draft.merchantCode} overrideImage={draft.qrImageDataUrl} />
              </div>
              <div className="text-xs text-muted-foreground text-center">Auto-generated from UPI ID. Upload a custom QR (from your bank app) to override.</div>
              <div className="flex flex-col sm:flex-row gap-2">
                <label className="flex-1">
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => onQrFile(e.target.files?.[0] ?? null)} />
                  <span className="w-full inline-flex items-center justify-center rounded-md border px-3 py-2 text-sm cursor-pointer hover:bg-muted">
                    <Upload className="h-4 w-4 mr-1" />Upload custom QR
                  </span>
                </label>
                {draft.qrImageDataUrl && (
                  <Button variant="outline" onClick={() => setDraft({ ...draft, qrImageDataUrl: undefined })}>Use auto QR</Button>
                )}
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={!!rejectTarget} onOpenChange={(o) => !o && setRejectTarget(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Reject payment</DialogTitle></DialogHeader>
          <div><Label>Reason (shown to client)</Label><Textarea rows={3} value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} placeholder="e.g. Amount mismatch, screenshot unclear, UTR not found" /></div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectTarget(null)}>Cancel</Button>
            <Button onClick={doReject} className="bg-destructive text-destructive-foreground">Reject</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!viewShot} onOpenChange={(o) => !o && setViewShot(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>Payment screenshot</DialogTitle></DialogHeader>
          {viewShot && <img src={viewShot} alt="Screenshot" className="w-full rounded-lg border" />}
        </DialogContent>
      </Dialog>
    </SuperAdminShell>
  );
}
