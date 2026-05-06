import { createFileRoute } from "@tanstack/react-router";
import { SubmissionsTable } from "@/components/admin/SubmissionsTable";
export const Route = createFileRoute("/admin/donations")({
  component: () => <SubmissionsTable table="donations" title="Donations" statuses={["pending", "approved", "rejected", "paid"]} />,
});
