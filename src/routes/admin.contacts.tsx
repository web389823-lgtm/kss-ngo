import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { RefreshCw, Download, ArrowUpDown, Eye, ChevronLeft, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/admin/contacts")({ component: ContactsAdmin });

type Row = {
  id: string;
  first_name: string;
  last_name: string | null;
  email: string;
  phone: string;
  address: string;
  message: string;
  is_read: boolean;
  created_at: string;
};

type SortKey = "first_name" | "email" | "phone" | "created_at";

function ContactsAdmin() {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("created_at");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [viewing, setViewing] = useState<Row | null>(null);
  const pageSize = 20;

  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ["admin", "contact_submissions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contact_submissions" as any)
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as unknown as Row[];
    },
  });

  const filtered = useMemo(() => {
    const all = data ?? [];
    const q = search.trim().toLowerCase();
    const f = q
      ? all.filter((r) =>
          `${r.first_name} ${r.last_name ?? ""}`.toLowerCase().includes(q) ||
          r.email.toLowerCase().includes(q),
        )
      : all;
    const sorted = [...f].sort((a, b) => {
      const av = String((a as any)[sortKey] ?? "");
      const bv = String((b as any)[sortKey] ?? "");
      const cmp = sortKey === "created_at" ? new Date(av).getTime() - new Date(bv).getTime() : av.localeCompare(bv);
      return sortDir === "asc" ? cmp : -cmp;
    });
    return sorted;
  }, [data, search, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageRows = filtered.slice((page - 1) * pageSize, page * pageSize);

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("asc"); }
  }

  async function markRead(row: Row) {
    const { error } = await supabase.from("contact_submissions" as any).update({ is_read: true }).eq("id", row.id);
    if (error) return toast.error(error.message);
    toast.success("Marked as read");
    qc.invalidateQueries({ queryKey: ["admin", "contact_submissions"] });
    setViewing(null);
  }

  function exportCsv() {
    const headers = ["First Name", "Last Name", "Email", "Phone", "Address", "Message", "Read", "Date"];
    const rows = filtered.map((r) => [
      r.first_name, r.last_name ?? "", r.email, r.phone, r.address, r.message, r.is_read ? "yes" : "no", new Date(r.created_at).toISOString(),
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

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-serif text-3xl font-semibold">Get in Touch Applications</h1>
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

      {isLoading ? (
        <p className="text-muted-foreground">Loading…</p>
      ) : (
        <Card className="p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm" style={{ fontFamily: "Inter, sans-serif" }}>
              <thead className="bg-muted/50 text-left">
                <tr>
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
                    <td className="p-3 font-medium">
                      {r.first_name} {r.last_name ?? ""}
                      {!r.is_read && <span className="ml-2 inline-block h-2 w-2 rounded-full bg-primary" aria-label="unread" />}
                    </td>
                    <td className="p-3">{r.email}</td>
                    <td className="p-3">{r.phone}</td>
                    <td className="p-3 text-xs text-muted-foreground">{new Date(r.created_at).toLocaleString()}</td>
                    <td className="p-3">
                      <Button size="sm" variant="outline" onClick={() => setViewing(r)}>
                        <Eye className="h-3.5 w-3.5 mr-1" /> View
                      </Button>
                    </td>
                  </tr>
                ))}
                {pageRows.length === 0 && (
                  <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">No submissions found.</td></tr>
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

      <Dialog open={!!viewing} onOpenChange={(o) => !o && setViewing(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Submission details</DialogTitle>
          </DialogHeader>
          {viewing && (
            <dl className="grid grid-cols-[120px_1fr] gap-3 text-sm">
              <dt className="text-muted-foreground">Name</dt><dd>{viewing.first_name} {viewing.last_name ?? ""}</dd>
              <dt className="text-muted-foreground">Email</dt><dd>{viewing.email}</dd>
              <dt className="text-muted-foreground">Phone</dt><dd>{viewing.phone}</dd>
              <dt className="text-muted-foreground">Address</dt><dd>{viewing.address}</dd>
              <dt className="text-muted-foreground">Message</dt><dd className="whitespace-pre-wrap">{viewing.message}</dd>
              <dt className="text-muted-foreground">Date</dt><dd>{new Date(viewing.created_at).toLocaleString()}</dd>
              <dt className="text-muted-foreground">Status</dt><dd>{viewing.is_read ? "Read" : "Unread"}</dd>
            </dl>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewing(null)}>Close</Button>
            {viewing && !viewing.is_read && (
              <Button onClick={() => markRead(viewing)}>Mark as Read</Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
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
