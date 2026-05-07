import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { logActivity } from "@/lib/activity-log";

export const Route = createFileRoute("/admin/settings")({ component: SettingsPage });

const FRIENDLY_LABELS: Record<string, string> = {
  hero: "Hero (legacy)",
  home_hero: "Home — Hero Section",
  home_about: "Home — About Section",
  home_mission_vision: "Home — Mission & Vision",
  home_contact: "Home — Contact Block",
  contact: "Contact Page",
  socials: "Social Media Links",
};

function prettyKey(k: string) {
  return k.split("_").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

function SettingsPage() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["admin", "settings"],
    queryFn: async () => (await supabase.from("site_settings").select("*").order("key")).data ?? [],
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-semibold">Site Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Edit website content. Changes save when you click <strong>Save</strong>.</p>
      </div>
      {isLoading && <p className="text-muted-foreground">Loading…</p>}
      <div className="space-y-6">
        {(data ?? []).map((s: any) => (
          <SettingCard key={s.key} settingKey={s.key} value={s.value} onSaved={() => qc.invalidateQueries({ queryKey: ["admin", "settings"] })} />
        ))}
      </div>
    </div>
  );
}

function SettingCard({ settingKey, value, onSaved }: { settingKey: string; value: any; onSaved: () => void }) {
  const [draft, setDraft] = useState<any>(value);
  const [saving, setSaving] = useState(false);
  useEffect(() => { setDraft(value); }, [value]);

  const isObject = value && typeof value === "object" && !Array.isArray(value);

  async function save() {
    setSaving(true);
    const { error } = await supabase.from("site_settings").update({ value: draft }).eq("key", settingKey);
    setSaving(false);
    if (error) return toast.error(error.message);
    await logActivity({ action: "updated", entity_type: "site_settings", entity_id: settingKey, entity_label: FRIENDLY_LABELS[settingKey] ?? settingKey });
    toast.success("Saved");
    onSaved();
  }

  return (
    <Card className="p-6 space-y-4">
      <div>
        <h2 className="font-serif text-xl font-semibold">{FRIENDLY_LABELS[settingKey] ?? prettyKey(settingKey)}</h2>
        <p className="text-xs text-muted-foreground font-mono mt-1">{settingKey}</p>
      </div>
      {isObject ? (
        <div className="grid sm:grid-cols-2 gap-4">
          {Object.entries(draft as Record<string, any>).map(([field, v]) => {
            const isLong = typeof v === "string" && (v.length > 80 || field.includes("description") || field.startsWith("p"));
            return (
              <div key={field} className={isLong ? "sm:col-span-2" : ""}>
                <Label htmlFor={`${settingKey}-${field}`} className="capitalize">{prettyKey(field)}</Label>
                {isLong ? (
                  <Textarea id={`${settingKey}-${field}`} rows={3} value={String(v ?? "")} onChange={(e) => setDraft({ ...draft, [field]: e.target.value })} />
                ) : (
                  <Input id={`${settingKey}-${field}`} value={String(v ?? "")} onChange={(e) => setDraft({ ...draft, [field]: e.target.value })} />
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <Textarea rows={4} value={JSON.stringify(draft, null, 2)} onChange={(e) => { try { setDraft(JSON.parse(e.target.value)); } catch { /* ignore */ } }} className="font-mono text-xs" />
      )}
      <div className="flex justify-end">
        <Button onClick={save} disabled={saving}>{saving ? "Saving…" : "Save changes"}</Button>
      </div>
    </Card>
  );
}
