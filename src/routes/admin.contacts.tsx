import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { RefreshCw, Download, ArrowUpDown, Eye, ChevronLeft, ChevronRight, Check, Trash2, X } from "lucide-react";

export const Route = createFileRoute("/admin/contacts")({ component: ContactsAdmin });

type Row = {
  id: string;
  first_name: string;
  last_name: string | null;
  email: string;
  phone: string;
  address: string;
  message: string;
  status: "new" | "approved";
  is_read: boolean;
  created_at: string;
};

type SortKey = "first_name" | "email" | "phone" | "created_at";
type Filter = "all" | "new" | "approved";

function ContactsAdmin() {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("created_at");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [viewing, setViewing] = useState<Row | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Row | null>(null);
  const [filter, setFilter] = useState<Filter>("all");
  const pageSize = 20;

  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ["admin", "contact_submissions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contact_submissions" as any)
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return ((data ?? []) as any[]).map((r) => ({ ...r, status: r.status ?? "new" })) as Row[];
    },
  });

  const filtered = useMemo(() => {
    const all = data ?? [];
    const q = search.trim().toLowerCase();
    let f = filter === "all" ? all : all.filter((r) => r.status === filter);
    if (q) {
      f = f.filter((r) =>
        `${r.first_name} ${r.last_name ?? ""}`.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q),
      );
    }
    const sorted = [...f].sort((a, b) => {
      const av = String((a as any)[sortKey] ?? "");
      const bv = String((b as any)[sortKey] ?? "");
      const cmp = sortKey === "created_at" ? new Date(av).getTime() - new Date(bv).getTime() : av.localeCompare(bv);
      return sortDir === "asc" ? cmp : -cmp;
    });
    return sorted;
  }, [data, search, sortKey, sortDir, filter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageRows = filtered.slice((page - 1) * pageSize, page * pageSize);

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("asc"); }
  }

  async function approve(row: Row) {
    const { error } = await supabase.from("contact_submissions" as any).update({ status: "approved", is_read: true }).eq("id", row.id);
    if (error) return toast.error(error.message);
    toast.success("Submission approved");
    qc.invalidateQueries({ queryKey: ["admin", "contact_submissions"] });
    if (viewing?.id === row.id) setViewing({ ...row, status: "approved" });
  }

  async function doDelete(row: Row) {
    const { error } = await supabase.from("contact_submissions" as any).delete().eq("id", row.id);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.error("Submission deleted.", { duration: 3000 });
    qc.invalidateQueries({ queryKey: ["admin", "contact_submissions"] });
    setConfirmDelete(null);
    if (viewing?.id === row.id) setViewing(null);
  }

  function exportCsv() {
    const headers = ["First Name", "Last Name", "Email", "Phone", "Address", "Message", "Status", "Date"];
    const rows = filtered.map((r) => [
      r.first_name, r.last_name ?? "", r.email, r.phone, r.address, r.message, r.status, new Date(r.created_at).toISOString(),
    ]);
    const esc = (v: string) => `"${String(v).replace(/"/g, '""')}"`;
    const csv = [headers, ...rows].map((row) => row.map((c) => esc(String(c))).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const date = new Date().toISOString().slice(0, 10);
    a.href = url;
    a.download = `kss-contacts-${date}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const StatusDot = ({ status }: { status: "new" | "approved" }) => (
    <span
      title={status}
      style={{
        display: "inline-block",
        width: 10,
        height: 10,
        borderRadius: "50%",
        background: status === "approved" ? "#22c55e" : "#E8540A",
        marginRight: 8,
        verticalAlign: "middle",
      }}
    />
  );

  const FilterBtn = ({ value, label }: { value: Filter; label: string }) => (
    <button
      type="button"
      onClick={() => { setFilter(value); setPage(1); }}
      style={{
        padding: "6px 14px",
        borderRadius: 8,
        fontFamily: "Inter, sans-serif",
        fontSize: 13,
        fontWeight: 500,
        background: filter === value ? "#E8540A" : "#fff",
        color: filter === value ? "#fff" : "#333",
        border: `1.5px solid ${filter === value ? "#E8540A" : "#e0e0e0"}`,
        cursor: "pointer",
      }}
    >
      {label}
    </button>
  );

  return (
    <div className="space-y-5" style={{ fontFamily: "Inter, sans-serif" }}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-serif text-3xl font-semibold" style={{ fontFamily: '"Playfair Display", serif' }}>Get in Touch Applications</h1>
          <p className="text-sm text-muted-foreground mt-1">Total: {filtered.length} submission{filtered.length === 1 ? "" : "s"}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Input
            placeholder="Search name or email…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-64"
          />
          <Button variant="outline" onClick={() => refetch()} disabled={isFetching}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isFetching ? "animate-spin" : ""}`} /> Refresh
          </Button>
          <Button variant="outline" onClick={exportCsv}>
            <Download className="h-4 w-4 mr-2" /> Export CSV
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <FilterBtn value="all" label="All" />
        <FilterBtn value="new" label="New" />
        <FilterBtn value="approved" label="Approved" />
      </div>

      {isLoading ? (
        <p className="text-muted-foreground">Loading…</p>
      ) : (
        <Card className="p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm" style={{ fontFamily: "Inter, sans-serif" }}>
              <thead className="bg-muted/50 text-left">
                <tr>
                  <th className="p-3">Status</th>
                  <Th onClick={() => toggleSort("first_name")}>Name</Th>
                  <Th onClick={() => toggleSort("email")}>Email</Th>
                  <Th onClick={() => toggleSort("phone")}>Phone</Th>
                  <Th onClick={() => toggleSort("created_at")}>Date</Th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pageRows.map((r, idx) => (
                  <tr key={r.id} style={{ background: idx % 2 === 0 ? "#fff" : "#faf5f0" }} className="border-t align-top">
                    <td className="p-3"><StatusDot status={r.status} /></td>
                    <td className="p-3 font-medium">{r.first_name} {r.last_name ?? ""}</td>
                    <td className="p-3">{r.email}</td>
                    <td className="p-3">{r.phone}</td>
                    <td className="p-3 text-xs text-muted-foreground">{new Date(r.created_at).toLocaleString()}</td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => setViewing(r)} title="View">
                          <Eye className="h-3.5 w-3.5" />
                        </Button>
                        {r.status !== "approved" && (
                          <Button size="sm" variant="outline" onClick={() => approve(r)} title="Approve" style={{ color: "#16a34a", borderColor: "#bbf7d0" }}>
                            <Check className="h-3.5 w-3.5" />
                          </Button>
                        )}
                        <Button size="sm" variant="outline" onClick={() => setConfirmDelete(r)} title="Delete" style={{ color: "#dc2626", borderColor: "#fecaca" }}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {pageRows.length === 0 && (
                  <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">No submissions found.</td></tr>
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between gap-2 p-3 border-t bg-muted/30">
              <Button size="sm" variant="ghost" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="flex gap-1 flex-wrap">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <Button
                    key={i}
                    size="sm"
                    variant={page === i + 1 ? "default" : "outline"}
                    onClick={() => setPage(i + 1)}
                    className="h-7 w-7 p-0"
                  >
                    {i + 1}
                  </Button>
                ))}
              </div>
              <Button size="sm" variant="ghost" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </Card>
      )}

      {/* Detail modal */}
      <Dialog open={!!viewing} onOpenChange={(o) => !o && setViewing(null)}>
        <DialogContent
          className="max-w-[560px]"
          style={{ background: "#fff", borderRadius: 16, padding: 32, boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}
        >
          <DialogHeader>
            <DialogTitle style={{ fontFamily: '"Playfair Display", serif', fontSize: 22 }}>
              📋 Submission Details
            </DialogTitle>
          </DialogHeader>
          {viewing && (
            <div className="space-y-4 text-sm">
              <Row2 label="Status" value={<span><StatusDot status={viewing.status} />{viewing.status === "approved" ? "Approved" : "New"}</span>} />
              <Row2 label="Submitted" value={new Date(viewing.created_at).toLocaleString("en-IN", { dateStyle: "long", timeStyle: "short" })} />
              <hr style={{ borderColor: "#eee" }} />
              <div className="grid grid-cols-2 gap-4">
                <Row2 label="First Name" value={viewing.first_name} />
                <Row2 label="Last Name" value={viewing.last_name || "—"} />
                <Row2 label="Email" value={viewing.email} />
                <Row2 label="Phone" value={viewing.phone} />
              </div>
              <Row2 label="Address" value={viewing.address} />
              <hr style={{ borderColor: "#eee" }} />
              <div>
                <div style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: "#999", textTransform: "uppercase", marginBottom: 6 }}>Message</div>
                <div style={{ background: "#faf5f0", borderRadius: 8, padding: "12px 16px", maxHeight: 200, overflowY: "auto", fontFamily: "Inter, sans-serif", fontSize: 15, color: "#1a1a1a", whiteSpace: "pre-wrap" }}>
                  {viewing.message}
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="gap-2 sm:gap-2">
            {viewing && viewing.status !== "approved" && (
              <Button onClick={() => approve(viewing)} style={{ background: "#22c55e", color: "#fff" }}>
                <Check className="h-4 w-4 mr-1" /> Approve
              </Button>
            )}
            {viewing && (
              <Button variant="outline" onClick={() => setConfirmDelete(viewing)} style={{ color: "#dc2626", borderColor: "#fecaca" }}>
                <Trash2 className="h-4 w-4 mr-1" /> Delete
              </Button>
            )}
            <Button variant="outline" onClick={() => setViewing(null)}>
              <X className="h-4 w-4 mr-1" /> Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <AlertDialog open={!!confirmDelete} onOpenChange={(o) => !o && setConfirmDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>This cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => confirmDelete && doDelete(confirmDelete)} style={{ background: "#dc2626" }}>
              Yes, Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function Row2({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <div style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: "#999", textTransform: "uppercase", marginBottom: 4 }}>{label}</div>
      <div style={{ fontFamily: "Inter, sans-serif", fontSize: 15, color: "#1a1a1a" }}>{value}</div>
    </div>
  );
}

function Th({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <th className="p-3 cursor-pointer select-none" onClick={onClick}>
      <span className="inline-flex items-center gap-1">{children}<ArrowUpDown className="h-3 w-3 opacity-50" /></span>
    </th>
  );
}
