import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/lib/auth";
import { useStore } from "@/lib/store";
import { useSuperAdmin, type SupportTicket, type TicketPriority, type TicketStatus } from "@/lib/super-admin-store";
import { SuperAdminShell } from "@/components/super-admin-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus, Trash2, MessageSquare, Phone, Send, Mail } from "lucide-react";

export const Route = createFileRoute("/super-admin/support")({
  head: () => ({ meta: [{ title: "Support CRM · Super Admin" }] }),
  component: SupportPage,
});

const PRIORITIES: TicketPriority[] = ["low", "normal", "high", "urgent"];
const STATUSES: TicketStatus[] = ["open", "in_progress", "waiting", "resolved", "closed"];

function SupportPage() {
  const nav = useNavigate();
  const { user, isSuperAdmin, loading } = useAuth();
  const demoMode = useStore((st) => st.demoMode);
  const { tickets, addTicket, updateTicket, deleteTicket, addTicketNote, touchpoints, addTouchpoint, deleteTouchpoint } = useSuperAdmin();
  const { demoTenants } = useStore();
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState<string>("all");
  const [detail, setDetail] = useState<SupportTicket | null>(null);
  const [newNote, setNewNote] = useState("");

  const [form, setForm] = useState({
    tenantId: "", subject: "", body: "", priority: "normal" as TicketPriority,
    channel: "email" as SupportTicket["channel"], assignedTo: "",
  });

  useEffect(() => {
    if (loading) return;
    if (!user && !demoMode) { nav({ to: "/login" }); return; }
    if (!isSuperAdmin && !demoMode) { nav({ to: "/admin" }); return; }
  }, [user, isSuperAdmin, loading, nav]);

  const allTenants = useMemo(() => {
    const combined = new Map<string, string>();
    demoTenants.forEach((t) => combined.set(t.id, t.name));
    combined.set("demo-tenant", "Demo Tenant");
    return Array.from(combined.entries()).map(([id, name]) => ({ id, name }));
  }, [demoTenants]);

  const filtered = useMemo(() => tickets.filter((t) => filter === "all" || t.status === filter), [tickets, filter]);

  function submit() {
    if (!form.subject.trim() || !form.tenantId) return toast.error("Tenant & subject required");
    addTicket({
      tenantId: form.tenantId, subject: form.subject, body: form.body,
      priority: form.priority, status: "open", channel: form.channel, assignedTo: form.assignedTo || undefined,
    });
    setOpen(false);
    setForm({ tenantId: "", subject: "", body: "", priority: "normal", channel: "email", assignedTo: "" });
    toast.success("Ticket created");
  }

  function logTouchpoint(kind: any) {
    if (!form.tenantId) return toast.error("Pick a tenant first");
    addTouchpoint({ tenantId: form.tenantId, kind, summary: form.subject || `${kind} logged`, by: user?.email ?? "super_admin" });
    toast.success("Logged");
  }

  return (
    <SuperAdminShell>
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-4">
        <div>
          <h1 className="font-display text-2xl font-semibold">Support CRM</h1>
          <p className="text-sm text-muted-foreground">Tickets, meetings, calls, WhatsApp and email history per company.</p>
        </div>
        <div className="flex items-center gap-2">
          <select className="h-10 rounded-md border bg-background px-3 text-sm" value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All statuses</option>
            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button className="bg-gradient-brand text-white"><Plus className="h-4 w-4 mr-2" /> New ticket</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>New support ticket</DialogTitle></DialogHeader>
              <div className="grid gap-3">
                <div><Label>Tenant</Label>
                  <select className="w-full h-10 rounded-md border bg-background px-3 text-sm" value={form.tenantId} onChange={(e) => setForm({ ...form, tenantId: e.target.value })}>
                    <option value="">Select company</option>
                    {allTenants.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
                  </select>
                </div>
                <div><Label>Subject</Label><Input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} /></div>
                <div><Label>Description</Label><Textarea value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} /></div>
                <div className="grid grid-cols-3 gap-2">
                  <div><Label>Priority</Label>
                    <select className="w-full h-10 rounded-md border bg-background px-3 text-sm" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value as any })}>
                      {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                  <div><Label>Channel</Label>
                    <select className="w-full h-10 rounded-md border bg-background px-3 text-sm" value={form.channel} onChange={(e) => setForm({ ...form, channel: e.target.value as any })}>
                      <option>email</option><option>phone</option><option>whatsapp</option><option>portal</option><option>meeting</option>
                    </select>
                  </div>
                  <div><Label>Assign to</Label><Input value={form.assignedTo} onChange={(e) => setForm({ ...form, assignedTo: e.target.value })} placeholder="Executive name" /></div>
                </div>
                <div className="flex gap-2 flex-wrap pt-1">
                  <Button size="sm" variant="outline" onClick={() => logTouchpoint("call")}><Phone className="h-3 w-3 mr-1" />Log call</Button>
                  <Button size="sm" variant="outline" onClick={() => logTouchpoint("whatsapp")}><Send className="h-3 w-3 mr-1" />Log WhatsApp</Button>
                  <Button size="sm" variant="outline" onClick={() => logTouchpoint("email")}><Mail className="h-3 w-3 mr-1" />Log email</Button>
                  <Button size="sm" variant="outline" onClick={() => logTouchpoint("meeting")}><MessageSquare className="h-3 w-3 mr-1" />Log meeting</Button>
                </div>
              </div>
              <DialogFooter><Button onClick={submit} className="bg-gradient-brand text-white">Create ticket</Button></DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="tickets">
        <TabsList>
          <TabsTrigger value="tickets">Tickets ({tickets.length})</TabsTrigger>
          <TabsTrigger value="tp">Touchpoints ({touchpoints.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="tickets">
          {filtered.length === 0 ? <div className="p-8 text-sm text-muted-foreground text-center rounded-xl border">No tickets.</div> :
            <ul className="rounded-2xl border bg-card divide-y">
              {filtered.map((t) => (
                <li key={t.id} className="p-3 flex flex-wrap gap-2 items-center">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium">{t.subject}</span>
                      <Badge variant="outline">{t.priority}</Badge>
                      <Badge>{t.status}</Badge>
                      <span className="text-xs text-muted-foreground">{t.channel}</span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">{allTenants.find((c) => c.id === t.tenantId)?.name ?? t.tenantId} · {new Date(t.createdAt).toLocaleString()}{t.assignedTo ? ` · ${t.assignedTo}` : ""}</div>
                  </div>
                  <select className="h-8 rounded border bg-background px-2 text-xs" value={t.status} onChange={(e) => updateTicket(t.id, { status: e.target.value as TicketStatus })}>
                    {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <Button size="sm" variant="outline" onClick={() => setDetail(t)}>Open</Button>
                  <Button size="sm" variant="ghost" onClick={() => deleteTicket(t.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </li>
              ))}
            </ul>}
        </TabsContent>

        <TabsContent value="tp">
          {touchpoints.length === 0 ? <div className="p-8 text-sm text-muted-foreground text-center rounded-xl border">No touchpoints logged.</div> :
            <ul className="rounded-2xl border bg-card divide-y">
              {touchpoints.map((t) => (
                <li key={t.id} className="p-3 flex justify-between text-sm">
                  <div>
                    <div className="capitalize font-medium">{t.kind} — {t.summary}</div>
                    <div className="text-xs text-muted-foreground">{allTenants.find((c) => c.id === t.tenantId)?.name ?? t.tenantId} · {t.by} · {new Date(t.ts).toLocaleString()}</div>
                  </div>
                  <Button size="sm" variant="ghost" onClick={() => deleteTouchpoint(t.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </li>
              ))}
            </ul>}
        </TabsContent>
      </Tabs>

      {detail && (
        <Dialog open onOpenChange={(o) => !o && setDetail(null)}>
          <DialogContent>
            <DialogHeader><DialogTitle>{detail.subject}</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div className="text-xs text-muted-foreground">{allTenants.find((c) => c.id === detail.tenantId)?.name} · {detail.priority} · {detail.status}</div>
              <div className="text-sm whitespace-pre-wrap">{detail.body || <span className="text-muted-foreground">No description.</span>}</div>
              <div className="border-t pt-3">
                <div className="text-xs font-medium mb-2">Notes</div>
                <div className="space-y-2 max-h-48 overflow-auto">
                  {detail.notes.length === 0 ? <div className="text-xs text-muted-foreground">No notes.</div> :
                    detail.notes.map((n) => (
                      <div key={n.id} className="rounded border p-2 text-xs">
                        <div className="text-muted-foreground">{n.author} · {new Date(n.ts).toLocaleString()}</div>
                        <div>{n.text}</div>
                      </div>
                    ))}
                </div>
                <div className="flex gap-2 mt-2">
                  <Input value={newNote} onChange={(e) => setNewNote(e.target.value)} placeholder="Add a note…" />
                  <Button size="sm" onClick={() => { if (!newNote.trim()) return; addTicketNote(detail.id, { author: user?.email ?? "super_admin", text: newNote }); setNewNote(""); }}>Add</Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </SuperAdminShell>
  );
}
