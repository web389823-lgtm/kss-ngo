import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, Loader2, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { CARD_IMAGE_SLOTS } from "@/lib/card-images";

export const Route = createFileRoute("/admin/images")({
  component: AdminImages,
});

function AdminImages() {
  const qc = useQueryClient();
  const { data: overrides } = useQuery({
    queryKey: ["site_settings", "card_images"],
    queryFn: async () => {
      const { data } = await supabase
        .from("site_settings")
        .select("value")
        .eq("key", "card_images")
        .maybeSingle();
      return (data?.value as Record<string, string>) ?? {};
    },
  });

  // Group slots
  const groups: Record<string, typeof CARD_IMAGE_SLOTS> = {};
  CARD_IMAGE_SLOTS.forEach((s) => {
    (groups[s.group] ||= []).push(s);
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-2xl font-semibold flex items-center gap-2">
          <ImageIcon className="h-6 w-6 text-primary" /> Image Manager
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Upload custom photos for cards across the site. If no custom image is set, the default placeholder photo is shown.
        </p>
      </div>

      {Object.entries(groups).map(([group, slots]) => (
        <Card key={group} className="p-5">
          <h2 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-4">{group}</h2>
          <div className="space-y-3">
            {slots.map((s) => (
              <ImageSlotRow
                key={s.id}
                slot={s}
                currentUrl={overrides?.[s.id] || s.fallback}
                isCustom={!!overrides?.[s.id]}
                onSaved={() => qc.invalidateQueries({ queryKey: ["site_settings", "card_images"] })}
                allOverrides={overrides ?? {}}
              />
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
}

function ImageSlotRow({
  slot,
  currentUrl,
  isCustom,
  onSaved,
  allOverrides,
}: {
  slot: { id: string; label: string; fallback: string };
  currentUrl: string;
  isCustom: boolean;
  onSaved: () => void;
  allOverrides: Record<string, string>;
}) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview); }, [preview]);

  const onPick = async (f: File | null | undefined) => {
    if (!f) return;
    setPreview(URL.createObjectURL(f));
    setUploading(true);
    try {
      const ext = f.name.split(".").pop() || "jpg";
      const path = `card-images/${slot.id}-${Date.now()}.${ext}`;
      const { error } = await supabase.storage.from("kss-media").upload(path, f, { upsert: false, contentType: f.type });
      if (error) throw error;
      const { data: pub } = supabase.storage.from("kss-media").getPublicUrl(path);
      const next = { ...allOverrides, [slot.id]: pub.publicUrl };
      const { error: upErr } = await supabase.from("site_settings").upsert(
        { key: "card_images", value: next as any },
        { onConflict: "key" },
      );
      if (upErr) throw upErr;
      toast.success(`Updated image for ${slot.label}`);
      onSaved();
    } catch (e: any) {
      toast.error(e.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const onReset = async () => {
    const next = { ...allOverrides };
    delete next[slot.id];
    const { error } = await supabase.from("site_settings").upsert(
      { key: "card_images", value: next as any },
      { onConflict: "key" },
    );
    if (error) return toast.error(error.message);
    toast.success(`Reset ${slot.label} to default`);
    onSaved();
  };

  return (
    <div className="flex items-center gap-4 p-3 rounded-lg border bg-card">
      <div className="w-20 h-[60px] rounded overflow-hidden bg-muted shrink-0">
        <img src={preview || currentUrl} alt={slot.label} className="w-full h-full object-cover" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-medium text-sm">{slot.label}</div>
        <div className="text-xs text-muted-foreground">{isCustom ? "Custom image" : "Using default"}</div>
      </div>
      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => onPick(e.target.files?.[0])}
      />
      {isCustom && (
        <Button type="button" variant="ghost" size="sm" onClick={onReset} disabled={uploading}>
          Reset
        </Button>
      )}
      <Button type="button" variant="outline" size="sm" onClick={() => fileRef.current?.click()} disabled={uploading}>
        {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Upload className="h-4 w-4 mr-1.5" /> Change</>}
      </Button>
    </div>
  );
}
