import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { logActivity } from "@/lib/activity-log";

export const Route = createFileRoute("/admin/csr")({ component: CsrAdmin });

const STATUSES = ["pending", "approved", "rejected", "active"];

function CsrAdmin() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["admin", "csr_applications"],
    queryFn: async () => (await supabase.from("csr_applications").select("*").order("created_at", { ascending: false })).data ?? [],
  });

  async function setStatus(row: any, status: string) {
    const { error } = await supabase.from("csr_applications").update({ status: status as any }).eq("id", row.id);
    if (error) return toast.error(error.message);
    await logActivity({ action: "status_changed", entity_type: "csr_applications", entity_id: row.id, entity_label: row.company || row.full_name, details: { from: row.status, to: status } });
    toast.success("Status updated");
    qc.invalidateQueries({ queryKey: ["admin", "csr_applications"] });
  }
  async function remove(row: any) {
    if (!confirm("Delete this CSR application?")) return;
    const { error } = await supabase.from("csr_applications").delete().eq("id", row.id);
    if (error) return toast.error(error.message);
    await logActivity({ action: "deleted", entity_type: "csr_applications", entity_id: row.id, entity_label: row.company || row.full_name });
    toast.success("Deleted");
    qc.invalidateQueries({ queryKey: ["admin", "csr_applications"] });
  }

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-3xl font-semibold">CSR Applications</h1>
      {isLoading ? <p className="text-muted-foreground">Loading…</p> : (
        <Card className="p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-left">
                <tr>
                  <th className="p-3">Company / Contact</th><th className="p-3">Reach</th><th className="p-3">Purpose</th>
                  <th className="p-3">Budget</th><th className="p-3">Status</th><th className="p-3">Date</th><th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {(data ?? []).map((r: any) => (
                  <tr key={r.id} className="border-t align-top">
                    <td className="p-3"><div className="font-medium">{r.company}</div><div className="text-xs text-muted-foreground">{r.full_name}{r.designation && ` · ${r.designation}`}</div></td>
                    <td className="p-3"><div className="text-xs">{r.email}</div><div className="text-xs text-muted-foreground">{r.phone}</div></td>
                    <td className="p-3 max-w-xs"><p className="line-clamp-3 text-xs">{r.purpose}</p></td>
                    <td className="p-3 text-xs">{r.budget_range ?? "—"}</td>
                    <td className="p-3"><Badge variant="outline" className="capitalize">{r.status}</Badge></td>
                    <td className="p-3 text-xs text-muted-foreground">{new Date(r.created_at).toLocaleDateString()}</td>
                    <td className="p-3">
                      <div className="flex flex-wrap gap-1">
                        {STATUSES.filter((s) => s !== r.status).map((s) => (
                          <Button key={s} size="sm" variant="outline" onClick={() => setStatus(r, s)} className="capitalize text-xs h-7">{s}</Button>
                        ))}
                        <Button size="sm" variant="ghost" onClick={() => remove(r)} className="text-destructive text-xs h-7">Delete</Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {(data ?? []).length === 0 && <tr><td colSpan={7} className="p-8 text-center text-muted-foreground">No CSR applications yet.</td></tr>}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
