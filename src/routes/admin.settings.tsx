import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/settings")({ component: SettingsPage });

function SettingsPage() {
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ["admin", "settings"],
    queryFn: async () => (await supabase.from("site_settings").select("*")).data ?? [],
  });

  async function save(key: string, value: string) {
    try {
      const parsed = JSON.parse(value);
      const { error } = await supabase.from("site_settings").update({ value: parsed }).eq("key", key);
      if (error) throw error;
      toast.success(`${key} saved`);
      qc.invalidateQueries({ queryKey: ["admin", "settings"] });
    } catch (e: any) { toast.error(e.message ?? "Invalid JSON"); }
  }

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-3xl font-semibold">Site Settings</h1>
      <p className="text-sm text-muted-foreground">Edit JSON values for site-wide content blocks.</p>
      <div className="space-y-4">
        {(data ?? []).map((s: any) => (
          <Card key={s.key} className="p-6">
            <Label className="font-mono text-xs">{s.key}</Label>
            <Textarea defaultValue={JSON.stringify(s.value, null, 2)} rows={8} className="font-mono text-xs mt-2"
              onBlur={(e) => save(s.key, e.target.value)} />
            <p className="text-xs text-muted-foreground mt-2">Auto-saves on blur.</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
