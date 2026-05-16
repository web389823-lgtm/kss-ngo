import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Upload, Loader2, ImageIcon } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { logActivity } from "@/lib/activity-log";

export type Field = {
  name: string;
  label: string;
  // image = upload only (no URL); file = upload OR paste URL (good for videos)
  type?: "text" | "textarea" | "number" | "date" | "select" | "file" | "image" | "gallery";
  required?: boolean;
  options?: { value: string; label: string }[];
  accept?: string;
  bucket?: string;
  folder?: string;
};

export function SimpleCrud({ table, title, fields, primaryField, orderBy = "created_at", ascending = false }: {
  table: string; title: string; fields: Field[]; primaryField: string; orderBy?: string; ascending?: boolean;
}) {
  const qc = useQueryClient();
  const { isAdmin } = useAuth();
  const [editing, setEditing] = useState<any | null>(null);
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState<Record<string, any>>({});
  const [uploading, setUploading] = useState<string | null>(null);

  const { data } = useQuery({
    queryKey: ["admin", table],
    queryFn: async () => (await (supabase.from(table as any).select("*").order(orderBy, { ascending }))).data ?? [],
  });

  function openDialog(row: any | null) {
    setEditing(row);
    const init: Record<string, any> = {};
    for (const f of fields) init[f.name] = row?.[f.name] ?? "";
    setValues(init);
    setOpen(true);
  }

  async function handleFile(field: Field, file: File) {
    const bucket = field.bucket ?? "kss-media";
    const folder = field.folder ?? table;
    const ext = file.name.split(".").pop();
    const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    setUploading(field.name);
    const { error } = await supabase.storage.from(bucket).upload(path, file, { upsert: false, contentType: file.type });
    setUploading(null);
    if (error) { toast.error(error.message); return; }
    const { data: pub } = supabase.storage.from(bucket).getPublicUrl(path);
    setValues((v) => ({ ...v, [field.name]: pub.publicUrl }));
    toast.success("Uploaded");
  }

  async function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const obj: any = {};
    for (const f of fields) {
      const v = values[f.name];
      if (f.type === "gallery") {
        obj[f.name] = Array.isArray(v) ? v : [];
        continue;
      }
      if (v === null || v === undefined || v === "") continue;
      obj[f.name] = f.type === "number" ? Number(v) : v;
    }
    if (editing?.id) {
      const { error } = await supabase.from(table as any).update(obj).eq("id", editing.id);
      if (error) return toast.error(error.message);
      await logActivity({ action: "updated", entity_type: table, entity_id: editing.id, entity_label: obj[primaryField] || obj.title || obj.name });
    } else {
      const { data: ins, error } = await supabase.from(table as any).insert(obj).select().single();
      if (error) return toast.error(error.message);
      await logActivity({ action: "created", entity_type: table, entity_id: (ins as any)?.id, entity_label: obj[primaryField] || obj.title || obj.name });
    }
    toast.success("Saved");
    setOpen(false); setEditing(null);
    qc.invalidateQueries({ queryKey: ["admin", table] });
  }

  async function remove(row: any) {
    if (!confirm("Delete this item?")) return;
    const { error } = await supabase.from(table as any).delete().eq("id", row.id);
    if (error) return toast.error(error.message);
    await logActivity({ action: "deleted", entity_type: table, entity_id: row.id, entity_label: row[primaryField] || row.title || row.name });
    toast.success("Deleted");
    qc.invalidateQueries({ queryKey: ["admin", table] });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-3xl font-semibold">{title}</h1>
        <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) { setEditing(null); setValues({}); } }}>
          <DialogTrigger asChild>
            <Button onClick={() => openDialog(null)}><Plus className="mr-1 h-4 w-4" />New</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
            <DialogHeader><DialogTitle>{editing ? "Edit" : "New"} {title}</DialogTitle></DialogHeader>
            <form onSubmit={save} className="space-y-4">
              {fields.map((f) => (
                <FieldInput key={f.name} field={f} value={values[f.name] ?? ""} onChange={(v) => setValues((s) => ({ ...s, [f.name]: v }))} onFile={(file) => handleFile(f, file)} uploading={uploading === f.name} />
              ))}
              <Button type="submit" className="w-full" disabled={!!uploading}>Save</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <Card className="p-0 overflow-hidden">
        <div className="divide-y">
          {(data ?? []).map((row: any) => {
            const thumb = row.thumbnail_url || row.photo_url || row.featured_image || row.banner_url || (row.media_type !== "video" ? row.media_url : null);
            return (
              <div key={row.id} className="p-4 flex items-center justify-between gap-3">
                <div className="min-w-0 flex items-center gap-3 flex-1">
                  {thumb ? (
                    <img src={thumb} alt="" className="h-12 w-12 rounded object-cover border" />
                  ) : (
                    <div className="h-12 w-12 rounded bg-muted flex items-center justify-center border">
                      <ImageIcon className="h-5 w-5 text-muted-foreground" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="font-medium truncate">{row[primaryField] || row.title || row.name || "(untitled)"}</div>
                    <div className="text-xs text-muted-foreground flex gap-2 flex-wrap mt-0.5">
                      {row.category && <span>{row.category}</span>}
                      {row.status && <span className="capitalize px-1.5 py-0.5 rounded bg-muted">{row.status}</span>}
                      {row.sort_order !== undefined && row.sort_order !== null && <span>Order: {row.sort_order}</span>}
                      <span>{new Date(row.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button size="sm" variant="ghost" onClick={() => openDialog(row)}><Pencil className="h-4 w-4" /></Button>
                  {isAdmin && <Button size="sm" variant="ghost" onClick={() => remove(row)} className="text-destructive"><Trash2 className="h-4 w-4" /></Button>}
                </div>
              </div>
            );
          })}
          {(data ?? []).length === 0 && <div className="p-8 text-center text-muted-foreground text-sm">No items yet.</div>}
        </div>
      </Card>
    </div>
  );
}

function FieldInput({ field: f, value, onChange, onFile, uploading }: {
  field: Field; value: any; onChange: (v: any) => void; onFile: (file: File) => void; uploading: boolean;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  if (f.type === "textarea") {
    return (
      <div>
        <Label htmlFor={f.name}>{f.label}{f.required && " *"}</Label>
        <Textarea id={f.name} rows={4} required={f.required} value={value} onChange={(e) => onChange(e.target.value)} />
      </div>
    );
  }
  if (f.type === "select") {
    return (
      <div>
        <Label htmlFor={f.name}>{f.label}{f.required && " *"}</Label>
        <Select value={value || undefined} onValueChange={onChange}>
          <SelectTrigger id={f.name}><SelectValue placeholder="Select" /></SelectTrigger>
          <SelectContent>
            {(f.options ?? []).map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
    );
  }
  // image: upload-only (no URL input)
  if (f.type === "image") {
    return (
      <div className="space-y-2">
        <Label>{f.label}{f.required && " *"}</Label>
        <div
          onClick={() => fileRef.current?.click()}
          className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-accent/50 transition-colors"
        >
          {value ? (
            <img src={value} alt="preview" className="mx-auto max-h-48 rounded object-cover" />
          ) : (
            <div className="text-muted-foreground">
              <ImageIcon className="h-8 w-8 mx-auto mb-2" />
              <p className="text-sm">Click to upload an image from your device</p>
            </div>
          )}
          {uploading && <Loader2 className="mt-2 h-4 w-4 animate-spin mx-auto" />}
        </div>
        <input ref={fileRef} type="file" accept={f.accept ?? "image/*"} className="hidden"
          onChange={(e) => { const file = e.target.files?.[0]; if (file) onFile(file); e.target.value = ""; }} />
        {value && (
          <Button type="button" variant="ghost" size="sm" onClick={() => onChange("")}>Remove image</Button>
        )}
      </div>
    );
  }
  // file: upload OR paste URL (videos can use either)
  if (f.type === "file") {
    return (
      <div className="space-y-2">
        <Label>{f.label}{f.required && " *"}</Label>
        <div className="flex gap-2">
          <Input placeholder="Paste URL or upload below" value={value} onChange={(e) => onChange(e.target.value)} />
          <Button type="button" variant="outline" onClick={() => fileRef.current?.click()} disabled={uploading}>
            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
          </Button>
          <input ref={fileRef} type="file" accept={f.accept} className="hidden" onChange={(e) => { const file = e.target.files?.[0]; if (file) onFile(file); e.target.value = ""; }} />
        </div>
        {value && (f.accept?.includes("video") ? <video src={value} className="mt-2 max-h-40 rounded" controls /> : <img src={value} alt="preview" className="mt-2 max-h-40 rounded object-cover" />)}
      </div>
    );
  }
  return (
    <div>
      <Label htmlFor={f.name}>{f.label}{f.required && " *"}</Label>
      <Input id={f.name} type={f.type ?? "text"} required={f.required} value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}
