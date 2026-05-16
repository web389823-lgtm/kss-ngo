import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { logActivity } from "@/lib/activity-log";
import { Check, X, Eye, Pencil } from "lucide-react";

type Kind = "volunteer" | "csr";

const VOLUNTEER_STATUSES = ["pending", "approved", "rejected", "on_hold"];
const CSR_STATUSES = [
  "pending",
  "approved",
  "rejected",
  "in_discussion",
  "partnership_active",
];
const CSR_STAGES = [
  "initial_contact",
  "proposal_sent",
  "meeting_scheduled",
  "agreement_signed",
  "active_partnership",
  "complete",
];

function mask(v?: string | null) {
  if (!v) return "—";
  const s = String(v);
  if (s.length <= 4) return s;
  return `XXXX XXXX ${s.slice(-4)}`;
}

function statusVariant(s: string): "default" | "secondary" | "destructive" | "outline" {
  if (s === "approved" || s === "partnership_active" || s === "active") return "default";
  if (s === "rejected") return "destructive";
  return "secondary";
}

export function ApplicationsAdmin({ kind }: { kind: Kind }) {
  const qc = useQueryClient();
  const table = kind === "volunteer" ? "volunteer_applications" : "csr_applications";
  const title = kind === "volunteer" ? "Volunteer Applications" : "CSR Applications";
  const statuses = kind === "volunteer" ? VOLUNTEER_STATUSES : CSR_STATUSES;

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [viewing, setViewing] = useState<any | null>(null);
  const [editing, setEditing] = useState<any | null>(null);
  const [editValues, setEditValues] = useState<any>({});

  const { data, isLoading } = useQuery({
    queryKey: ["admin", table],
    queryFn: async () =>
      (
        await supabase
          .from(table as any)
          .select("*")
          .order("created_at", { ascending: false })
      ).data ?? [],
  });

  const rows = useMemo(() => {
    const s = search.trim().toLowerCase();
    return (data ?? []).filter((r: any) => {
      if (statusFilter !== "all" && r.status !== statusFilter) return false;
      if (!s) return true;
      const hay =
        kind === "volunteer"
          ? `${r.full_name ?? ""} ${r.email ?? ""}`
          : `${r.company_name ?? r.company ?? ""} ${r.email ?? r.official_email ?? ""} ${r.contact_name ?? r.full_name ?? ""}`;
      return hay.toLowerCase().includes(s);
    });
  }, [data, search, statusFilter, kind]);

  const stats = useMemo(() => {
    const all = data ?? [];
    return {
      total: all.length,
      pending: all.filter((r: any) => r.status === "pending").length,
      approved: all.filter((r: any) => r.status === "approved").length,
      rejected: all.filter((r: any) => r.status === "rejected").length,
    };
  }, [data]);

  async function setStatus(row: any, status: string) {
    const { error } = await supabase
      .from(table as any)
      .update({ status: status as any })
      .eq("id", row.id);
    if (error) return toast.error(error.message);
    await logActivity({
      action: "status_changed",
      entity_type: table,
      entity_id: row.id,
      entity_label: row.full_name || row.company_name || row.company,
      details: { from: row.status, to: status },
    });
    toast.success(`Marked ${status}`);
    qc.invalidateQueries({ queryKey: ["admin", table] });
  }

  function openEdit(row: any) {
    setEditing(row);
    setEditValues({
      status: row.status ?? "pending",
      admin_notes: row.admin_notes ?? "",
      ...(kind === "volunteer"
        ? {
            assigned_program: row.assigned_program ?? "",
            assigned_date: row.assigned_date ?? "",
          }
        : {
            assigned_manager: row.assigned_manager ?? "",
            proposal_stage: row.proposal_stage ?? "",
          }),
    });
  }

  async function saveEdit() {
    if (!editing) return;
    const { error } = await supabase
      .from(table as any)
      .update(editValues)
      .eq("id", editing.id);
    if (error) return toast.error(error.message);
    await logActivity({
      action: "updated",
      entity_type: table,
      entity_id: editing.id,
      entity_label: editing.full_name || editing.company_name || editing.company,
    });
    toast.success("Saved");
    setEditing(null);
    qc.invalidateQueries({ queryKey: ["admin", table] });
  }

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-3xl font-semibold">{title}</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Total" value={stats.total} />
        <StatCard label="Pending" value={stats.pending} />
        <StatCard label="Approved" value={stats.approved} />
        <StatCard label="Rejected" value={stats.rejected} />
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Input
          placeholder={
            kind === "volunteer"
              ? "Search name or email…"
              : "Search company or email…"
          }
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="sm:max-w-sm"
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="sm:w-56">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {statuses.map((s) => (
              <SelectItem key={s} value={s} className="capitalize">
                {s.replace(/_/g, " ")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <p className="text-muted-foreground">Loading…</p>
      ) : (
        <Card className="p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-left">
                {kind === "volunteer" ? (
                  <tr>
                    <th className="p-3">Name</th>
                    <th className="p-3">Age</th>
                    <th className="p-3">Email</th>
                    <th className="p-3">Phone</th>
                    <th className="p-3">State</th>
                    <th className="p-3">Interest</th>
                    <th className="p-3">Availability</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Date</th>
                    <th className="p-3">Actions</th>
                  </tr>
                ) : (
                  <tr>
                    <th className="p-3">Company</th>
                    <th className="p-3">Contact</th>
                    <th className="p-3">Designation</th>
                    <th className="p-3">Email</th>
                    <th className="p-3">Phone</th>
                    <th className="p-3">Budget</th>
                    <th className="p-3">Focus</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Date</th>
                    <th className="p-3">Actions</th>
                  </tr>
                )}
              </thead>
              <tbody>
                {rows.map((r: any) => (
                  <tr key={r.id} className="border-t align-top">
                    {kind === "volunteer" ? (
                      <>
                        <td className="p-3 font-medium">{r.full_name}</td>
                        <td className="p-3">{r.age ?? "—"}</td>
                        <td className="p-3">{r.email}</td>
                        <td className="p-3">{r.phone ?? "—"}</td>
                        <td className="p-3">{r.state ?? "—"}</td>
                        <td className="p-3">{r.primary_interest ?? "—"}</td>
                        <td className="p-3">{r.availability ?? "—"}</td>
                      </>
                    ) : (
                      <>
                        <td className="p-3 font-medium">
                          {r.company_name ?? r.company ?? "—"}
                        </td>
                        <td className="p-3">
                          {r.contact_name ?? r.full_name ?? "—"}
                        </td>
                        <td className="p-3">{r.designation ?? "—"}</td>
                        <td className="p-3">
                          {r.official_email ?? r.email ?? "—"}
                        </td>
                        <td className="p-3">{r.phone ?? "—"}</td>
                        <td className="p-3">
                          {r.budget_range ?? r.csr_budget ?? "—"}
                        </td>
                        <td className="p-3">
                          {r.primary_focus ?? r.focus_areas ?? "—"}
                        </td>
                      </>
                    )}
                    <td className="p-3">
                      <Badge
                        variant={statusVariant(r.status)}
                        className="capitalize"
                      >
                        {String(r.status).replace(/_/g, " ")}
                      </Badge>
                    </td>
                    <td className="p-3 text-xs text-muted-foreground">
                      {new Date(r.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-3">
                      <div className="flex flex-wrap gap-1">
                        <Button
                          size="sm"
                          onClick={() => setStatus(r, "approved")}
                          className="h-7 bg-green-600 hover:bg-green-700 text-white"
                        >
                          <Check className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => setStatus(r, "rejected")}
                          className="h-7"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setViewing(r)}
                          className="h-7"
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openEdit(r)}
                          className="h-7 border-orange-400 text-orange-600 hover:bg-orange-50"
                        >
                          <Pencil className="h-3 w-3" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {rows.length === 0 && (
                  <tr>
                    <td
                      colSpan={10}
                      className="p-8 text-center text-muted-foreground"
                    >
                      No applications match.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* View Details Modal */}
      <Dialog open={!!viewing} onOpenChange={(o) => !o && setViewing(null)}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {kind === "volunteer"
                ? viewing?.full_name
                : viewing?.company_name ?? viewing?.company}{" "}
              — Details
            </DialogTitle>
          </DialogHeader>
          {viewing && (
            <div className="space-y-6">
              {kind === "volunteer" ? (
                <VolunteerDetails r={viewing} />
              ) : (
                <CsrDetails r={viewing} />
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Application</DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="space-y-4">
              <div>
                <Label>Status</Label>
                <Select
                  value={editValues.status}
                  onValueChange={(v) =>
                    setEditValues((s: any) => ({ ...s, status: v }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statuses.map((s) => (
                      <SelectItem key={s} value={s} className="capitalize">
                        {s.replace(/_/g, " ")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Internal Notes (not visible to applicant)</Label>
                <Textarea
                  rows={4}
                  value={editValues.admin_notes ?? ""}
                  onChange={(e) =>
                    setEditValues((s: any) => ({
                      ...s,
                      admin_notes: e.target.value,
                    }))
                  }
                />
              </div>
              {kind === "volunteer" ? (
                <>
                  <div>
                    <Label>Assigned Program</Label>
                    <Input
                      value={editValues.assigned_program ?? ""}
                      onChange={(e) =>
                        setEditValues((s: any) => ({
                          ...s,
                          assigned_program: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div>
                    <Label>Assigned Date</Label>
                    <Input
                      type="date"
                      value={editValues.assigned_date ?? ""}
                      onChange={(e) =>
                        setEditValues((s: any) => ({
                          ...s,
                          assigned_date: e.target.value,
                        }))
                      }
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <Label>Assigned Account Manager</Label>
                    <Input
                      value={editValues.assigned_manager ?? ""}
                      onChange={(e) =>
                        setEditValues((s: any) => ({
                          ...s,
                          assigned_manager: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div>
                    <Label>Proposal Stage</Label>
                    <Select
                      value={editValues.proposal_stage || undefined}
                      onValueChange={(v) =>
                        setEditValues((s: any) => ({
                          ...s,
                          proposal_stage: v,
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select stage" />
                      </SelectTrigger>
                      <SelectContent>
                        {CSR_STAGES.map((s) => (
                          <SelectItem
                            key={s}
                            value={s}
                            className="capitalize"
                          >
                            {s.replace(/_/g, " ")}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}
              <Button onClick={saveEdit} className="w-full">
                Save
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <Card className="p-4">
      <div className="text-xs uppercase text-muted-foreground tracking-wider">
        {label}
      </div>
      <div className="text-3xl font-serif font-semibold mt-1">{value}</div>
    </Card>
  );
}

function Row({ label, value }: { label: string; value?: any }) {
  return (
    <div>
      <div className="text-xs uppercase text-muted-foreground tracking-wider">
        {label}
      </div>
      <div className="text-sm mt-0.5 break-words">
        {value === null || value === undefined || value === "" ? "—" : String(value)}
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="font-semibold text-sm uppercase tracking-wider text-primary mb-3">
        {title}
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{children}</div>
    </div>
  );
}

function VolunteerDetails({ r }: { r: any }) {
  return (
    <>
      <Section title="Personal">
        <Row label="Full Name" value={r.full_name} />
        <Row label="Age" value={r.age} />
        <Row label="Gender" value={r.gender} />
        <Row label="Email" value={r.email} />
        <Row label="Phone" value={r.phone} />
        <Row label="State" value={r.state} />
        <Row label="City" value={r.city} />
        <Row label="Address" value={r.address} />
      </Section>
      <Section title="Education & ID">
        <Row label="Education" value={r.education} />
        <Row label="Aadhaar" value={mask(r.aadhaar)} />
        <Row label="PAN" value={r.pan} />
        <Row label="Occupation" value={r.occupation} />
        <Row label="Organization" value={r.organization} />
      </Section>
      <Section title="Volunteering">
        <Row label="Primary Interest" value={r.primary_interest} />
        <Row label="Secondary Interest" value={r.secondary_interest} />
        <Row label="Availability" value={r.availability} />
        <Row label="Hours per Week" value={r.hours_per_week} />
        <Row label="Mode" value={r.mode} />
        <Row label="Languages" value={r.languages} />
        <Row label="Special Skills" value={r.special_skills} />
        <Row label="Reason" value={r.reason} />
        <Row label="Heard From" value={r.heard_from} />
      </Section>
      <Section title="Admin">
        <Row label="Status" value={r.status} />
        <Row
          label="Submitted"
          value={new Date(r.created_at).toLocaleString()}
        />
        <Row label="Assigned Program" value={r.assigned_program} />
        <Row label="Assigned Date" value={r.assigned_date} />
        <Row label="Internal Notes" value={r.admin_notes} />
      </Section>
    </>
  );
}

function CsrDetails({ r }: { r: any }) {
  return (
    <>
      <Section title="Company">
        <Row label="Company Name" value={r.company_name ?? r.company} />
        <Row label="Type" value={r.company_type} />
        <Row label="PAN" value={r.company_pan ?? r.pan} />
        <Row label="TAN" value={r.company_tan} />
        <Row label="Website" value={r.company_website} />
        <Row label="Address" value={r.company_address ?? r.address} />
        <Row label="State" value={r.state} />
        <Row label="City" value={r.city} />
        <Row label="PIN" value={r.pin_code} />
        <Row label="Employees" value={r.num_employees} />
      </Section>
      <Section title="Contact">
        <Row label="Contact Name" value={r.contact_name ?? r.full_name} />
        <Row label="Designation" value={r.designation} />
        <Row label="Email" value={r.official_email ?? r.email} />
        <Row label="Phone" value={r.phone} />
        <Row label="Alternate Phone" value={r.alternate_phone} />
        <Row label="LinkedIn" value={r.linkedin} />
      </Section>
      <Section title="CSR">
        <Row label="Budget Range" value={r.budget_range ?? r.csr_budget} />
        <Row label="Primary Focus" value={r.primary_focus} />
        <Row label="Secondary Focus" value={r.secondary_focus} />
        <Row label="Preferred Program" value={r.preferred_program} />
        <Row label="Previous Experience" value={r.previous_experience} />
        <Row label="Message" value={r.message ?? r.purpose} />
        <Row label="Heard From" value={r.heard_from} />
      </Section>
      <Section title="Admin">
        <Row label="Status" value={r.status} />
        <Row
          label="Submitted"
          value={new Date(r.created_at).toLocaleString()}
        />
        <Row label="Assigned Manager" value={r.assigned_manager} />
        <Row label="Proposal Stage" value={r.proposal_stage} />
        <Row label="Internal Notes" value={r.admin_notes} />
      </Section>
    </>
  );
}
