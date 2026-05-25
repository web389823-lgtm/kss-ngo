import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/admin/volunteer-page")({
  component: () => <PageSettingsEditor settingsKey="volunteer_page_content" title="Volunteer Page Editor" />,
});

export function PageSettingsEditor({ settingsKey, title }: { settingsKey: string; title: string }) {
  const { data } = useQuery({
    queryKey: ["site_settings", settingsKey],
    queryFn: async () => (await supabase.from("site_settings").select("value").eq("key", settingsKey).maybeSingle()).data,
  });
  const [json, setJson] = useState<string>("");
  const [form, setForm] = useState({ hero_headline: "", hero_subtext: "", cta_text: "", intro: "" });

  useEffect(() => {
    const v = (data?.value as any) ?? {};
    setForm({
      hero_headline: v.hero_headline ?? "",
      hero_subtext: v.hero_subtext ?? "",
      cta_text: v.cta_text ?? "",
      intro: v.intro ?? "",
    });
    setJson(JSON.stringify(v, null, 2));
  }, [data]);

  async function saveFields(e: React.FormEvent) {
    e.preventDefault();
    const value = { ...((data?.value as any) ?? {}), ...form };
    const { error } = await supabase.from("site_settings").upsert({ key: settingsKey, value } as any);
    if (error) return toast.error(error.message);
    toast.success("Saved");
  }
  async function saveJson() {
    try {
      const value = JSON.parse(json);
      const { error } = await supabase.from("site_settings").upsert({ key: settingsKey, value } as any);
      if (error) return toast.error(error.message);
      toast.success("Saved (JSON)");
    } catch (err: any) {
      toast.error("Invalid JSON: " + err.message);
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-3xl font-semibold">{title}</h1>

      <Card className="p-6">
        <form onSubmit={saveFields} className="space-y-4">
          <div><Label>Hero / Banner headline</Label><Input value={form.hero_headline} onChange={(e) => setForm({ ...form, hero_headline: e.target.value })} /></div>
          <div><Label>Hero subtext</Label><Textarea rows={2} value={form.hero_subtext} onChange={(e) => setForm({ ...form, hero_subtext: e.target.value })} /></div>
          <div><Label>CTA button text</Label><Input value={form.cta_text} onChange={(e) => setForm({ ...form, cta_text: e.target.value })} /></div>
          <div><Label>Intro / body text</Label><Textarea rows={5} value={form.intro} onChange={(e) => setForm({ ...form, intro: e.target.value })} /></div>
          <Button type="submit">Save Hero & Intro</Button>
        </form>
      </Card>

      <Card className="p-6">
        <Label>Advanced — full JSON (e.g. ways_to_volunteer cards, benefits, tiers)</Label>
        <Textarea rows={14} className="font-mono text-xs mt-2" value={json} onChange={(e) => setJson(e.target.value)} />
        <Button className="mt-3" onClick={saveJson} type="button">Save JSON</Button>
        <p className="text-xs text-muted-foreground mt-2">
          Tip: add arrays here for structured content (e.g. <code>{`"ways_to_volunteer": [{"icon":"hands","title":"…","body":"…"}]`}</code>). Pages will use these if present.
        </p>
      </Card>
    </div>
  );
}
