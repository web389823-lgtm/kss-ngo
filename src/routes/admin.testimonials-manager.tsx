import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Star, Check, X as XIcon, Trash2, Eye, Plus } from "lucide-react";

export const Route = createFileRoute("/admin/testimonials-manager")({ component: TestimonialsManager });

type T = { id: string; name: string; role: string | null; content: string; rating: number | null; photo_url: string | null; status: string; created_at: string };

function TestimonialsManager() {
  const qc = useQueryClient();
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");
  const [viewing, setViewing] = useState<T | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState({ name: "", role: "", stars: 5, content: "" });

  const { data } = useQuery({
    queryKey: ["admin", "testimonials_all", filter],
    queryFn: async () => {
      let q = supabase.from("testimonials").select("*").order("created_at", { ascending: false });
      if (filter !== "all") q = q.eq("status" as any, filter);
      return (await q).data as T[] | null;
    },
  });

  async function setStatus(row: T, status: "approved" | "rejected") {
    const { error } = await supabase.from("testimonials").update({ status } as any).eq("id", row.id);
    if (error) return toast.error(error.message);
    toast.success(status === "approved" ? "Approved — now showing on homepage" : "Rejected");
    qc.invalidateQueries({ queryKey: ["admin", "testimonials_all"] });
    qc.invalidateQueries({ queryKey: ["testimonials_approved"] });
  }
  async function remove(row: T) {
    if (!confirm("Delete this testimonial permanently?")) return;
    const { error } = await supabase.from("testimonials").delete().eq("id", row.id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    qc.invalidateQueries({ queryKey: ["admin", "testimonials_all"] });
    qc.invalidateQueries({ queryKey: ["testimonials_approved"] });
  }
  async function addManually(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.content.trim()) return toast.error("Name and review required");
    const { error } = await supabase.from("testimonials").insert({
      name: form.name.trim(), role: form.role.trim() || null, content: form.content.trim(),
      rating: form.stars, status: "approved" as any, is_featured: true,
    } as any);
    if (error) return toast.error(error.message);
    toast.success("Added");
    setForm({ name: "", role: "", stars: 5, content: "" });
    setAddOpen(false);
    qc.invalidateQueries({ queryKey: ["admin", "testimonials_all"] });
    qc.invalidateQueries({ queryKey: ["testimonials_approved"] });
  }

  const items = data ?? [];
  const counts = (data ?? []).reduce<Record<string, number>>((a, t) => { a[t.status] = (a[t.status] ?? 0) + 1; return a; }, {});

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="font-serif text-3xl font-semibold">Testimonials Manager</h1>
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="mr-1 h-4 w-4" />Add Manually</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add Testimonial</DialogTitle></DialogHeader>
            <form onSubmit={addManually} className="space-y-3">
              <div><Label>Name *</Label><Input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
              <div><Label>Role / Location</Label><Input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} /></div>
              <div>
                <Label>Star Rating</Label>
                <div className="flex gap-1 mt-1">
                  {[1,2,3,4,5].map(s => (
                    <button key={s} type="button" onClick={() => setForm({ ...form, stars: s })}>
                      <Star size={22} fill={s <= form.stars ? "#F59E0B" : "transparent"} stroke="#F59E0B" />
                    </button>
                  ))}
                </div>
              </div>
              <div><Label>Review *</Label><Textarea required rows={4} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} /></div>
              <Button type="submit" className="w-full">Add & Approve</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-2 flex-wrap">
        {(["all","pending","approved","rejected"] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-md text-sm capitalize transition ${filter===f?"bg-primary text-primary-foreground":"bg-muted hover:bg-accent"}`}>
            {f} {counts[f] !== undefined && f !== "all" && <span className="opacity-70">({counts[f]})</span>}
          </button>
        ))}
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="divide-y">
          {items.map(t => (
            <div key={t.id} className="p-4 flex items-center gap-3 flex-wrap">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium">{t.name}</span>
                  <span className="text-xs text-muted-foreground">{t.role}</span>
                  <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded"
                    style={{ background: t.status === "approved" ? "#dcfce7" : t.status === "rejected" ? "#fee2e2" : "#fef3c7",
                             color: t.status === "approved" ? "#166534" : t.status === "rejected" ? "#991b1b" : "#92400e" }}>
                    {t.status}
                  </span>
                  <span className="text-xs flex gap-0.5" style={{ color: "#F59E0B" }}>
                    {Array.from({ length: t.rating ?? 5 }).map((_,k) => <Star key={k} size={12} fill="#F59E0B" stroke="#F59E0B" />)}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{t.content}</p>
                <p className="text-xs text-muted-foreground mt-1">{new Date(t.created_at).toLocaleString()}</p>
              </div>
              <div className="flex gap-1">
                <Button size="sm" variant="ghost" onClick={() => setViewing(t)}><Eye className="h-4 w-4" /></Button>
                {t.status !== "approved" && <Button size="sm" variant="ghost" onClick={() => setStatus(t, "approved")} className="text-green-600"><Check className="h-4 w-4" /></Button>}
                {t.status !== "rejected" && <Button size="sm" variant="ghost" onClick={() => setStatus(t, "rejected")} className="text-amber-600"><XIcon className="h-4 w-4" /></Button>}
                <Button size="sm" variant="ghost" onClick={() => remove(t)} className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
              </div>
            </div>
          ))}
          {items.length === 0 && <div className="p-8 text-center text-muted-foreground text-sm">No testimonials in this view.</div>}
        </div>
      </Card>

      <Dialog open={!!viewing} onOpenChange={(o) => !o && setViewing(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>{viewing?.name}</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">{viewing?.role}</p>
          <p className="mt-3 whitespace-pre-wrap">{viewing?.content}</p>
        </DialogContent>
      </Dialog>
    </div>
  );
}
