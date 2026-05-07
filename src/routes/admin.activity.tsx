import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/admin/activity")({ component: ActivityPage });

const ACTION_COLOR: Record<string, string> = {
  created: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
  updated: "bg-blue-500/15 text-blue-700 dark:text-blue-300",
  deleted: "bg-destructive/15 text-destructive",
  status_changed: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
  login: "bg-muted text-muted-foreground",
};

function ActivityPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin", "activity_log"],
    queryFn: async () => (await supabase.from("activity_log").select("*").order("created_at", { ascending: false }).limit(500)).data ?? [],
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-semibold">Activity Log</h1>
        <p className="text-sm text-muted-foreground mt-1">All admin and staff actions across the panel.</p>
      </div>
      {isLoading ? <p className="text-muted-foreground">Loading…</p> : (
        <Card className="p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-left">
                <tr>
                  <th className="p-3">When</th>
                  <th className="p-3">User</th>
                  <th className="p-3">Action</th>
                  <th className="p-3">Item</th>
                </tr>
              </thead>
              <tbody>
                {(data ?? []).map((a: any) => (
                  <tr key={a.id} className="border-t">
                    <td className="p-3 text-xs text-muted-foreground whitespace-nowrap">{new Date(a.created_at).toLocaleString()}</td>
                    <td className="p-3"><div>{a.user_email}</div><div className="text-xs text-muted-foreground capitalize">{a.user_role}</div></td>
                    <td className="p-3"><Badge variant="outline" className={`capitalize ${ACTION_COLOR[a.action] ?? ""}`}>{a.action.replace("_", " ")}</Badge></td>
                    <td className="p-3"><div className="font-medium">{a.entity_label || a.entity_id || "—"}</div><div className="text-xs text-muted-foreground">{a.entity_type}</div></td>
                  </tr>
                ))}
                {(data ?? []).length === 0 && <tr><td colSpan={4} className="p-8 text-center text-muted-foreground">No activity yet.</td></tr>}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
