import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { useStore } from "@/lib/store";
import { useSuperAdmin, defaultWhiteLabel } from "@/lib/super-admin-store";
import { SuperAdminShell } from "@/components/super-admin-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { RotateCcw, Save } from "lucide-react";

export const Route = createFileRoute("/super-admin/whitelabel")({
  head: () => ({ meta: [{ title: "White Label · Super Admin" }] }),
  component: WhiteLabelPage,
});

function WhiteLabelPage() {
  const nav = useNavigate();
  const { user, isSuperAdmin, loading } = useAuth();
  const demoMode = useStore((st) => st.demoMode);
  const { whiteLabel, updateWhiteLabel, resetWhiteLabel } = useSuperAdmin();
  const [form, setForm] = useState(whiteLabel);

  useEffect(() => {
    if (loading) return;
    if (!user && !demoMode) nav({ to: "/login" });
    else if (!isSuperAdmin && !demoMode) nav({ to: "/admin" });
  }, [user, isSuperAdmin, loading, nav]);

  useEffect(() => { setForm(whiteLabel); }, [whiteLabel]);

  function upload(field: "logoDataUrl" | "faviconDataUrl", file: File | null) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setForm((f) => ({ ...f, [field]: String(reader.result) }));
    reader.readAsDataURL(file);
  }

  function save() { updateWhiteLabel(form); toast.success("White-label settings saved"); }
  function reset() { resetWhiteLabel(); setForm(defaultWhiteLabel); toast.success("Reset to defaults"); }

  return (
    <SuperAdminShell>
      <div className="flex items-end justify-between gap-3 mb-4">
        <div>
          <h1 className="font-display text-2xl font-semibold">White-label & platform settings</h1>
          <p className="text-sm text-muted-foreground">Branding, gateways, providers and domain mapping.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={reset}><RotateCcw className="h-4 w-4 mr-2" />Reset</Button>
          <Button className="bg-gradient-brand text-white" onClick={save}><Save className="h-4 w-4 mr-2" />Save</Button>
        </div>
      </div>

      <Tabs defaultValue="brand" className="space-y-4">
        <TabsList className="flex-wrap h-auto">
          <TabsTrigger value="brand">Brand</TabsTrigger>
          <TabsTrigger value="assets">Logos & PDF</TabsTrigger>
          <TabsTrigger value="comm">Email & Messaging</TabsTrigger>
          <TabsTrigger value="providers">Providers</TabsTrigger>
          <TabsTrigger value="domain">Domain & App</TabsTrigger>
        </TabsList>

        <TabsContent value="brand" className="grid sm:grid-cols-2 gap-3">
          <div><Label>Brand name</Label><Input value={form.brandName} onChange={(e) => setForm({ ...form, brandName: e.target.value })} /></div>
          <div><Label>Tagline</Label><Input value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} /></div>
          <div><Label>Primary color</Label><Input type="color" value={form.primaryColor} onChange={(e) => setForm({ ...form, primaryColor: e.target.value })} /></div>
          <div><Label>Secondary color</Label><Input type="color" value={form.secondaryColor} onChange={(e) => setForm({ ...form, secondaryColor: e.target.value })} /></div>
          <div className="sm:col-span-2 rounded-xl border p-4 flex items-center gap-4" style={{ background: `linear-gradient(90deg, ${form.primaryColor}22, ${form.secondaryColor}22)` }}>
            {form.logoDataUrl && <img src={form.logoDataUrl} alt="logo" className="h-10" />}
            <div>
              <div className="font-display text-lg font-semibold">{form.brandName}</div>
              <div className="text-xs text-muted-foreground">{form.tagline}</div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="assets" className="grid sm:grid-cols-2 gap-3">
          <div>
            <Label>Logo</Label>
            <Input type="file" accept="image/*" onChange={(e) => upload("logoDataUrl", e.target.files?.[0] ?? null)} />
            {form.logoDataUrl && <img src={form.logoDataUrl} alt="logo preview" className="mt-2 h-12" />}
          </div>
          <div>
            <Label>Favicon</Label>
            <Input type="file" accept="image/*" onChange={(e) => upload("faviconDataUrl", e.target.files?.[0] ?? null)} />
            {form.faviconDataUrl && <img src={form.faviconDataUrl} alt="favicon preview" className="mt-2 h-8" />}
          </div>
          <div className="sm:col-span-2"><Label>PDF header</Label><Textarea value={form.pdfHeader} onChange={(e) => setForm({ ...form, pdfHeader: e.target.value })} /></div>
          <div className="sm:col-span-2"><Label>PDF footer</Label><Textarea value={form.pdfFooter} onChange={(e) => setForm({ ...form, pdfFooter: e.target.value })} /></div>
        </TabsContent>

        <TabsContent value="comm" className="grid sm:grid-cols-2 gap-3">
          <div><Label>Email from name</Label><Input value={form.emailFromName} onChange={(e) => setForm({ ...form, emailFromName: e.target.value })} /></div>
          <div><Label>Email from address</Label><Input value={form.emailFromAddress} onChange={(e) => setForm({ ...form, emailFromAddress: e.target.value })} /></div>
          <div><Label>Support email</Label><Input value={form.supportEmail} onChange={(e) => setForm({ ...form, supportEmail: e.target.value })} /></div>
          <div><Label>Support phone</Label><Input value={form.supportPhone} onChange={(e) => setForm({ ...form, supportPhone: e.target.value })} /></div>
          <div><Label>SMTP host</Label><Input value={form.smtpHost ?? ""} onChange={(e) => setForm({ ...form, smtpHost: e.target.value })} /></div>
          <div><Label>SMTP user</Label><Input value={form.smtpUser ?? ""} onChange={(e) => setForm({ ...form, smtpUser: e.target.value })} /></div>
        </TabsContent>

        <TabsContent value="providers" className="grid sm:grid-cols-2 gap-3">
          <div><Label>SMS gateway</Label><Input value={form.smsGateway ?? ""} onChange={(e) => setForm({ ...form, smsGateway: e.target.value })} /></div>
          <div><Label>WhatsApp gateway</Label><Input value={form.whatsappGateway ?? ""} onChange={(e) => setForm({ ...form, whatsappGateway: e.target.value })} /></div>
          <div><Label>Payment gateway</Label><Input value={form.paymentGateway ?? ""} onChange={(e) => setForm({ ...form, paymentGateway: e.target.value })} /></div>
          <div><Label>Storage provider</Label><Input value={form.storageProvider ?? ""} onChange={(e) => setForm({ ...form, storageProvider: e.target.value })} /></div>
          <div><Label>AI provider</Label><Input value={form.aiProvider ?? ""} onChange={(e) => setForm({ ...form, aiProvider: e.target.value })} /></div>
        </TabsContent>

        <TabsContent value="domain" className="grid sm:grid-cols-2 gap-3">
          <div><Label>Custom domain</Label><Input value={form.domain ?? ""} onChange={(e) => setForm({ ...form, domain: e.target.value })} placeholder="app.yourbrand.com" /></div>
          <div><Label>Mobile app URL scheme</Label><Input value={form.mobileAppScheme ?? ""} onChange={(e) => setForm({ ...form, mobileAppScheme: e.target.value })} placeholder="swiftai://" /></div>
        </TabsContent>
      </Tabs>
    </SuperAdminShell>
  );
}
