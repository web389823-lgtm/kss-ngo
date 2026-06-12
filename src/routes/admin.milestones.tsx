import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Pencil, Trash2, Plus, Upload, Loader2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/milestones")({ component: MilestonesAdmin });

type Milestone = {
  id: string;
  year: number;
  title: string;
  description: string | null;
  photo_url: string | null;
  link_url: string | null;
  link_text: string | null;
  display_order: number;
};

const EMPTY: Omit<Milestone, "id"> = {
  year: new Date().getFullYear(),
  title: "",
  description: "",
  photo_url: "",
  link_url: "",
  link_text: "",
  display_order: 0,
};

function MilestonesAdmin() {
  const [rows, setRows] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Milestone | null>(null);
  const [form, setForm] = useState<Omit<Milestone, "id">>(EMPTY);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("milestones" as any)
      .select("*")
      .order("year", { ascending: false })
      .order("display_order", { ascending: true });
    if (error) toast.error(error.message);
    setRows((data as any[] as Milestone[]) || []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const openAdd = () => { setEditing(null); setForm(EMPTY); setOpen(true); };
  const openEdit = (m: Milestone) => {
    setEditing(m);
    setForm({
      year: m.year, title: m.title, description: m.description ?? "",
      photo_url: m.photo_url ?? "", link_url: m.link_url ?? "",
      link_text: m.link_text ?? "", display_order: m.display_order,
    });
    setOpen(true);
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this milestone?")) return;
    const { error } = await supabase.from("milestones" as any).delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    load();
  };

  const upload = async (file: File) => {
    setUploading(true);
    try {
      const ext = file.name.split(".").pop() || "jpg";
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await supabase.storage.from("milestone-photos").upload(path, file, { upsert: false });
      if (error) throw error;
      const { data } = supabase.storage.from("milestone-photos").getPublicUrl(path);
      setForm((f) => ({ ...f, photo_url: data.publicUrl }));
      toast.success("Image uploaded");
    } catch (e: any) {
      toast.error(e.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const save = async () => {
    if (!form.title.trim() || !form.year) return toast.error("Year and title are required");
    setSaving(true);
    const payload = {
      year: Number(form.year),
      title: form.title.trim(),
      description: form.description || null,
      photo_url: form.photo_url || null,
      link_url: form.link_url || null,
      link_text: form.link_text || null,
      display_order: Number(form.display_order) || 0,
    };
    const { error } = editing
      ? await supabase.from("milestones" as any).update(payload).eq("id", editing.id)
      : await supabase.from("milestones" as any).insert(payload);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Saved");
    setOpen(false);
    load();
  };

  const grouped = rows.reduce<Record<number, Milestone[]>>((acc, r) => {
    (acc[r.year] = acc[r.year] || []).push(r); return acc;
  }, {});
  const years = Object.keys(grouped).map(Number).sort((a, b) => b - a);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-semibold">Milestones</h1>
          <p className="text-sm text-muted-foreground">Manage the timeline shown on the About Us page.</p>
        </div>
        <Button onClick={openAdd}><Plus className="h-4 w-4 mr-1" />Add Milestone</Button>
      </div>

      {loading ? (
        <Card className="p-10 text-center text-muted-foreground"><Loader2 className="h-5 w-5 animate-spin inline-block mr-2" />Loading…</Card>
      ) : years.length === 0 ? (
        <Card className="p-10 text-center text-muted-foreground">No milestones yet.</Card>
      ) : (
        <div className="space-y-6">
          {years.map((y) => (
            <Card key={y} className="p-4">
              <div className="text-lg font-bold text-orange-600 mb-3">{y}</div>
              <div className="divide-y">
                {grouped[y].map((m) => (
                  <div key={m.id} className="flex items-center gap-3 py-2">
                    {m.photo_url ? (
                      <img src={m.photo_url} alt="" className="w-16 h-10 object-cover rounded" />
                    ) : (
                      <div className="w-16 h-10 rounded bg-orange-100" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{m.title}</div>
                      <div className="text-xs text-muted-foreground truncate">{m.description}</div>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => openEdit(m)}><Pencil className="h-3.5 w-3.5" /></Button>
                    <Button size="sm" variant="destructive" onClick={() => remove(m.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto top-[5%] translate-y-0 sm:top-[50%] sm:translate-y-[-50%]">
          <DialogHeader><DialogTitle>{editing ? "Edit" : "Add"} Milestone</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Year *</Label>
                <Input type="number" value={form.year} onChange={(e) => setForm((f) => ({ ...f, year: Number(e.target.value) }))} />
              </div>
              <div>
                <Label>Display order</Label>
                <Input type="number" value={form.display_order} onChange={(e) => setForm((f) => ({ ...f, display_order: Number(e.target.value) }))} />
              </div>
            </div>
            <div>
              <Label>Title *</Label>
              <Input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea rows={4} value={form.description ?? ""} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
            </div>
            <div>
              <Label>Photo</Label>
              <div className="flex gap-2">
                <label className="flex-1">
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} />
                  <div className="border rounded-md px-3 py-2 text-sm flex items-center gap-2 cursor-pointer hover:bg-accent">
                    {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                    Upload image
                  </div>
                </label>
              </div>
              <Input className="mt-2" placeholder="…or paste image URL" value={form.photo_url ?? ""} onChange={(e) => setForm((f) => ({ ...f, photo_url: e.target.value }))} />
              {form.photo_url && <img src={form.photo_url} alt="" className="mt-2 w-full aspect-video object-cover rounded-md" />}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Link URL</Label>
                <Input placeholder="https://…" value={form.link_url ?? ""} onChange={(e) => setForm((f) => ({ ...f, link_url: e.target.value }))} />
              </div>
              <div>
                <Label>Link text</Label>
                <Input placeholder="Read More" value={form.link_text ?? ""} onChange={(e) => setForm((f) => ({ ...f, link_text: e.target.value }))} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={save} disabled={saving}>{saving && <Loader2 className="h-4 w-4 animate-spin mr-1" />}Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
