import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export function SubmissionsTable({ table, statuses, title }: { table: "donations" | "volunteers"; statuses: string[]; title: string }) {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["admin", table],
    queryFn: async () => (await supabase.from(table).select("*").order("created_at", { ascending: false })).data ?? [],
  });

  async function setStatus(id: string, status: string) {
    const { error } = await supabase.from(table).update({ status }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Updated");
    qc.invalidateQueries({ queryKey: ["admin", table] });
  }
  async function remove(id: string) {
    if (!confirm("Delete this submission?")) return;
    const { error } = await supabase.from(table).delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    qc.invalidateQueries({ queryKey: ["admin", table] });
  }

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-3xl font-semibold">{title}</h1>
      {isLoading ? <p className="text-muted-foreground">Loading…</p> : (
        <Card className="p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-left">
                <tr>
                  <th className="p-3">Name</th><th className="p-3">Contact</th>
                  {table === "donations" ? <th className="p-3">Amount</th> : <th className="p-3">Interest</th>}
                  <th className="p-3">Status</th><th className="p-3">Date</th><th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {(data ?? []).map((r: any) => (
                  <tr key={r.id} className="border-t">
                    <td className="p-3"><div className="font-medium">{r.full_name}</div><div className="text-xs text-muted-foreground">{r.gender} {r.age && `· ${r.age}y`}</div></td>
                    <td className="p-3"><div>{r.email}</div><div className="text-xs text-muted-foreground">{r.phone}</div></td>
                    {table === "donations" ? <td className="p-3 font-serif">₹{Number(r.amount).toLocaleString()}</td> : <td className="p-3">{r.area_of_interest}<div className="text-xs text-muted-foreground">{r.availability}</div></td>}
                    <td className="p-3"><Badge variant="outline" className="capitalize">{r.status}</Badge></td>
                    <td className="p-3 text-xs text-muted-foreground">{new Date(r.created_at).toLocaleDateString()}</td>
                    <td className="p-3">
                      <div className="flex flex-wrap gap-1">
                        {statuses.filter((s) => s !== r.status).map((s) => (
                          <Button key={s} size="sm" variant="outline" onClick={() => setStatus(r.id, s)} className="capitalize text-xs h-7">{s}</Button>
                        ))}
                        <Button size="sm" variant="ghost" onClick={() => remove(r.id)} className="text-destructive text-xs h-7">Delete</Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
