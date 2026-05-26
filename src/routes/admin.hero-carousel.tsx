import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2, Upload, Plus, ArrowUp, ArrowDown, Pencil, Trash2 } from "lucide-react";

export const Route = createFileRoute("/admin/hero-carousel")({ component: HeroCarouselAdmin });

type Slide = {
  id?: string;
  image_url: string;
  image_source: "upload" | "url";
  headline: string | null;
  subtext: string | null;
  cta_text: string;
  cta_link: string;
  text_position: "center" | "left" | "right";
  overlay_opacity: number;
  status: "active" | "hidden";
  display_order: number;
};

type Settings = {
  id?: string;
  advance_seconds: number;
  transition_type: "fade" | "slide";
};

const EMPTY: Slide = {
  image_url: "",
  image_source: "upload",
  headline: "",
  subtext: "",
  cta_text: "Join Now",
  cta_link: "/get-involved",
  text_position: "center",
  overlay_opacity: 40,
  status: "active",
  display_order: 0,
};

function HeroCarouselAdmin() {
  const qc = useQueryClient();
  const { data: slides = [] } = useQuery({
    queryKey: ["admin", "hero_carousel_slides"],
    queryFn: async () =>
      (((await supabase
        .from("hero_carousel_slides" as any)
        .select("*")
        .order("display_order")).data ?? []) as unknown) as Slide[],
  });
  const { data: settingsRows } = useQuery({
    queryKey: ["admin", "carousel_settings"],
    queryFn: async () =>
      (((await supabase.from("carousel_settings" as any).select("*").limit(1)).data ?? []) as unknown) as Settings[],
  });
  const settings = settingsRows?.[0];

  const [editing, setEditing] = useState<Slide | null>(null);
  const [deleting, setDeleting] = useState<Slide | null>(null);
  const [advance, setAdvance] = useState(5);
  const [transition, setTransition] = useState<"fade" | "slide">("fade");

  useEffect(() => {
    if (settings) {
      setAdvance(settings.advance_seconds);
      setTransition(settings.transition_type);
    }
  }, [settings?.id]);

  function refresh() {
    qc.invalidateQueries({ queryKey: ["admin", "hero_carousel_slides"] });
    qc.invalidateQueries({ queryKey: ["hero_carousel_slides"] });
  }

  async function move(slide: Slide, dir: -1 | 1) {
    const sorted = [...slides].sort((a, b) => a.display_order - b.display_order);
    const idx = sorted.findIndex((s) => s.id === slide.id);
    const swap = sorted[idx + dir];
    if (!swap) return;
    await Promise.all([
      supabase.from("hero_carousel_slides" as any).update({ display_order: swap.display_order }).eq("id", slide.id!),
      supabase.from("hero_carousel_slides" as any).update({ display_order: slide.display_order }).eq("id", swap.id!),
    ]);
    refresh();
  }

  async function saveSettings() {
    const payload = { advance_seconds: advance, transition_type: transition };
    const res = settings?.id
      ? await supabase.from("carousel_settings" as any).update(payload).eq("id", settings.id)
      : await supabase.from("carousel_settings" as any).insert(payload);
    if (res.error) return toast.error(res.error.message);
    toast.success("Settings saved");
    qc.invalidateQueries({ queryKey: ["admin", "carousel_settings"] });
    qc.invalidateQueries({ queryKey: ["carousel_settings"] });
  }

  async function doDelete() {
    if (!deleting?.id) return;
    if (slides.length <= 1) {
      toast.error("Cannot delete the last slide.");
      setDeleting(null);
      return;
    }
    const { error } = await supabase.from("hero_carousel_slides" as any).delete().eq("id", deleting.id);
    setDeleting(null);
    if (error) return toast.error(error.message);
    toast.success("Slide deleted");
    refresh();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-3xl font-semibold">🖼 Hero Carousel</h1>
        <Button
          onClick={() =>
            setEditing({
              ...EMPTY,
              display_order: (slides[slides.length - 1]?.display_order ?? 0) + 1,
            })
          }
          disabled={slides.length >= 6}
        >
          <Plus className="h-4 w-4 mr-2" /> Add New Slide
        </Button>
      </div>

      {slides.length < 2 && (
        <Card className="p-4 text-sm text-muted-foreground">
          Add more slides for carousel effect.
        </Card>
      )}

      <div className="space-y-3">
        {slides.map((s, i) => (
          <Card key={s.id} className="p-4 flex gap-4 items-center">
            <div className="w-40 aspect-video bg-muted rounded overflow-hidden flex-shrink-0">
              {s.image_url ? <img src={s.image_url} alt="" className="w-full h-full object-cover" /> : null}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs text-muted-foreground">SLIDE {i + 1}</div>
              <div className="font-serif text-lg font-semibold truncate">{s.headline || "—"}</div>
              <div className="text-sm text-muted-foreground line-clamp-1">{s.subtext}</div>
              <div className="text-xs mt-1">
                <span className={s.status === "active" ? "text-green-600" : "text-muted-foreground"}>
                  ● {s.status === "active" ? "Active" : "Hidden"}
                </span>
              </div>
            </div>
            <div className="flex gap-1">
              <Button size="sm" variant="ghost" onClick={() => move(s, -1)} disabled={i === 0}>
                <ArrowUp className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="ghost" onClick={() => move(s, 1)} disabled={i === slides.length - 1}>
                <ArrowDown className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setEditing(s)}>
                <Pencil className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setDeleting(s)}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-4 flex flex-wrap gap-4 items-end">
        <div>
          <Label>Auto-advance (seconds)</Label>
          <Input
            type="number"
            min={3}
            max={10}
            value={advance}
            onChange={(e) => setAdvance(Number(e.target.value))}
            className="w-24"
          />
        </div>
        <div>
          <Label>Transition</Label>
          <div className="flex gap-3 mt-2">
            <label className="flex items-center gap-1 text-sm">
              <input type="radio" checked={transition === "fade"} onChange={() => setTransition("fade")} /> Fade
            </label>
            <label className="flex items-center gap-1 text-sm">
              <input type="radio" checked={transition === "slide"} onChange={() => setTransition("slide")} /> Slide
            </label>
          </div>
        </div>
        <Button onClick={saveSettings}>Save Settings</Button>
      </Card>

      {editing && (
        <SlideEditor
          slide={editing}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            refresh();
          }}
        />
      )}

      <AlertDialog open={!!deleting} onOpenChange={(open) => !open && setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this slide?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={doDelete}>Yes, Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function SlideEditor({ slide, onClose, onSaved }: { slide: Slide; onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState<Slide>(slide);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  async function upload(file: File) {
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `${Date.now()}.${ext}`;
    const { error } = await supabase.storage
      .from("carousel-images")
      .upload(path, file, { upsert: true, contentType: file.type });
    if (error) {
      setUploading(false);
      return toast.error(error.message);
    }
    const { data: pub } = supabase.storage.from("carousel-images").getPublicUrl(path);
    setForm((f) => ({ ...f, image_url: pub.publicUrl, image_source: "upload" }));
    setUploading(false);
  }

  async function save() {
    if (!form.image_url) return toast.error("Image is required");
    setSaving(true);
    const payload = { ...form };
    delete (payload as any).id;
    const res = slide.id
      ? await supabase.from("hero_carousel_slides" as any).update(payload).eq("id", slide.id)
      : await supabase.from("hero_carousel_slides" as any).insert(payload);
    setSaving(false);
    if (res.error) return toast.error(res.error.message);
    toast.success("Slide saved");
    onSaved();
  }

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{slide.id ? "Edit Slide" : "Add Slide"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Image Source</Label>
            <div className="flex gap-4 mt-2">
              <label className="flex items-center gap-2 text-sm">
                <input type="radio" checked={form.image_source === "upload"} onChange={() => setForm({ ...form, image_source: "upload" })} /> Upload File
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="radio" checked={form.image_source === "url"} onChange={() => setForm({ ...form, image_source: "url" })} /> Image URL
              </label>
            </div>
          </div>

          {form.image_source === "upload" ? (
            <label className="inline-flex items-center gap-2 cursor-pointer">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) upload(f);
                  e.currentTarget.value = "";
                }}
              />
              <span className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm hover:bg-accent">
                {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                {uploading ? "Uploading…" : "Choose File"}
              </span>
            </label>
          ) : (
            <Input
              placeholder="https://…"
              value={form.image_url}
              onChange={(e) => setForm({ ...form, image_url: e.target.value, image_source: "url" })}
            />
          )}

          {form.image_url && (
            <div className="aspect-video bg-muted rounded overflow-hidden">
              <img src={form.image_url} alt="" className="w-full h-full object-cover" />
            </div>
          )}

          <div>
            <Label>Headline</Label>
            <Input value={form.headline ?? ""} onChange={(e) => setForm({ ...form, headline: e.target.value })} />
          </div>
          <div>
            <Label>Subtext</Label>
            <Textarea rows={2} value={form.subtext ?? ""} onChange={(e) => setForm({ ...form, subtext: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>CTA Button Text</Label>
              <Input value={form.cta_text} onChange={(e) => setForm({ ...form, cta_text: e.target.value })} />
            </div>
            <div>
              <Label>CTA Button Link</Label>
              <Input value={form.cta_link} onChange={(e) => setForm({ ...form, cta_link: e.target.value })} />
            </div>
          </div>
          <div>
            <Label>Text Position</Label>
            <div className="flex gap-4 mt-2">
              {(["center", "left", "right"] as const).map((p) => (
                <label key={p} className="flex items-center gap-1 text-sm capitalize">
                  <input type="radio" checked={form.text_position === p} onChange={() => setForm({ ...form, text_position: p })} /> {p}
                </label>
              ))}
            </div>
          </div>
          <div>
            <Label>Overlay Darkness ({form.overlay_opacity}%)</Label>
            <input
              type="range"
              min={0}
              max={80}
              value={form.overlay_opacity}
              onChange={(e) => setForm({ ...form, overlay_opacity: Number(e.target.value) })}
              className="w-full"
            />
          </div>
          <div>
            <Label>Status</Label>
            <div className="flex gap-4 mt-2">
              <label className="flex items-center gap-1 text-sm">
                <input type="radio" checked={form.status === "active"} onChange={() => setForm({ ...form, status: "active" })} /> Active
              </label>
              <label className="flex items-center gap-1 text-sm">
                <input type="radio" checked={form.status === "hidden"} onChange={() => setForm({ ...form, status: "hidden" })} /> Hidden
              </label>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={save} disabled={saving || uploading}>{saving ? "Saving…" : "Save Slide"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
