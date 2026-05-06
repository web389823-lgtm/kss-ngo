import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2 } from "lucide-react";

export type Field = { name: string; label: string; type?: "text" | "textarea" | "number" | "date"; required?: boolean };

export function SimpleCrud({ table, title, fields, primaryField, orderBy = "created_at", ascending = false }: {
  table: string; title: string; fields: Field[]; primaryField: string; orderBy?: string; ascending?: boolean;
}) {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<any | null>(null);
  const [open, setOpen] = useState(false);

  const { data } = useQuery({
    queryKey: ["admin", table],
    queryFn: async () => (await (supabase.from(table as any).select("*").order(orderBy, { ascending }))).data ?? [],
  });

  async function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const obj: any = {};
    for (const f of fields) {
      const v = fd.get(f.name);
      if (v === null || v === "") continue;
      obj[f.name] = f.type === "number" ? Number(v) : String(v);
    }
    if (editing?.id) {
      const { error } = await supabase.from(table as any).update(obj).eq("id", editing.id);
      if (error) return toast.error(error.message);
    } else {
      const { error } = await supabase.from(table as any).insert(obj);
      if (error) return toast.error(error.message);
    }
    toast.success("Saved");
    setOpen(false); setEditing(null);
    qc.invalidateQueries({ queryKey: ["admin", table] });
  }
  async function remove(id: string) {
    if (!confirm("Delete this item?")) return;
    const { error } = await supabase.from(table as any).delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    qc.invalidateQueries({ queryKey: ["admin", table] });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-3xl font-semibold">{title}</h1>
        <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) setEditing(null); }}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditing(null)}><Plus className="mr-1 h-4 w-4" />New</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader><DialogTitle>{editing ? "Edit" : "New"} {title}</DialogTitle></DialogHeader>
            <form onSubmit={save} className="space-y-4">
              {fields.map((f) => (
                <div key={f.name}>
                  <Label htmlFor={f.name}>{f.label}{f.required && " *"}</Label>
                  {f.type === "textarea"
                    ? <Textarea id={f.name} name={f.name} rows={4} required={f.required} defaultValue={editing?.[f.name] ?? ""} />
                    : <Input id={f.name} name={f.name} type={f.type ?? "text"} required={f.required} defaultValue={editing?.[f.name] ?? ""} />}
                </div>
              ))}
              <Button type="submit" className="w-full">Save</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <Card className="p-0 overflow-hidden">
        <div className="divide-y">
          {(data ?? []).map((row: any) => (
            <div key={row.id} className="p-4 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="font-medium truncate">{row[primaryField]}</div>
                <div className="text-xs text-muted-foreground">{new Date(row.created_at).toLocaleDateString()}</div>
              </div>
              <div className="flex gap-1">
                <Button size="sm" variant="ghost" onClick={() => { setEditing(row); setOpen(true); }}><Pencil className="h-4 w-4" /></Button>
                <Button size="sm" variant="ghost" onClick={() => remove(row.id)} className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
              </div>
            </div>
          ))}
          {(data ?? []).length === 0 && <div className="p-8 text-center text-muted-foreground text-sm">No items yet.</div>}
        </div>
      </Card>
    </div>
  );
}
