import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Upload, ImageIcon } from "lucide-react";

export const Route = createFileRoute("/admin/news-banner")({ component: NewsBannerAdmin });

type Banner = { id?: string; image_url: string | null; tag_label: string | null; headline: string | null; link_url: string | null; is_active: boolean };

function NewsBannerAdmin() {
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ["admin", "news_banner"],
    queryFn: async () => (await supabase.from("news_banner" as any).select("*").order("updated_at", { ascending: false }).limit(1)).data as Banner[] | null,
  });
  const existing = data?.[0];

  const [form, setForm] = useState<Banner>({ image_url: "", tag_label: "LATEST NEWS", headline: "", link_url: "", is_active: true });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (existing) setForm({ image_url: existing.image_url ?? "", tag_label: existing.tag_label ?? "LATEST NEWS", headline: existing.headline ?? "", link_url: existing.link_url ?? "", is_active: existing.is_active });
  }, [existing?.id]);

  async function upload(file: File) {
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `news-banner/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("kss-media").upload(path, file, { upsert: true, contentType: file.type });
    if (error) { setUploading(false); return toast.error(error.message); }
    const { data: pub } = supabase.storage.from("kss-media").getPublicUrl(path);
    setForm((f) => ({ ...f, image_url: pub.publicUrl }));
    setUploading(false);
    toast.success("Uploaded");
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const payload = { ...form };
    const res = existing?.id
      ? await supabase.from("news_banner" as any).update(payload).eq("id", existing.id)
      : await supabase.from("news_banner" as any).insert(payload);
    setSaving(false);
    if (res.error) return toast.error(res.error.message);
    toast.success("Banner saved");
    qc.invalidateQueries({ queryKey: ["admin", "news_banner"] });
    qc.invalidateQueries({ queryKey: ["news_banner"] });
  }

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-3xl font-semibold">News Page Banner</h1>
      <Card className="p-6">
        <form onSubmit={save} className="space-y-5">
          <div>
            <Label>Banner image (16:9 recommended)</Label>
            <div className="mt-2 border-2 border-dashed rounded-lg p-4 text-center" style={{ aspectRatio: "16 / 9", maxWidth: 600 }}>
              {form.image_url ? (
                <img src={form.image_url} alt="" className="mx-auto h-full w-full object-cover rounded" />
              ) : (
                <div className="text-muted-foreground h-full flex flex-col items-center justify-center">
                  <ImageIcon className="h-8 w-8 mb-2" />
                  <p className="text-sm">No banner image set</p>
                </div>
              )}
            </div>
            <label className="mt-3 inline-flex items-center gap-2 cursor-pointer">
              <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) upload(f); e.currentTarget.value = ""; }} />
              <span className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm hover:bg-accent">
                {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                {uploading ? "Uploading…" : "Upload Image"}
              </span>
            </label>
          </div>
          <div>
            <Label htmlFor="tag">Tag label</Label>
            <Input id="tag" value={form.tag_label ?? ""} onChange={(e) => setForm({ ...form, tag_label: e.target.value })} />
          </div>
          <div>
            <Label htmlFor="headline">Headline</Label>
            <Input id="headline" value={form.headline ?? ""} onChange={(e) => setForm({ ...form, headline: e.target.value })} />
          </div>
          <div>
            <Label htmlFor="link">"Read More" link URL</Label>
            <Input id="link" placeholder="/blog/some-post or https://…" value={form.link_url ?? ""} onChange={(e) => setForm({ ...form, link_url: e.target.value })} />
          </div>
          <div className="flex items-center gap-2">
            <input id="active" type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} />
            <Label htmlFor="active">Show banner on News page</Label>
          </div>
          <Button type="submit" disabled={saving || uploading}>{saving ? "Saving…" : "Save Banner"}</Button>
        </form>
      </Card>
    </div>
  );
}
