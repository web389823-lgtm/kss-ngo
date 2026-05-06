import { createFileRoute } from "@tanstack/react-router";
import { SubmissionsTable } from "@/components/admin/SubmissionsTable";
export const Route = createFileRoute("/admin/volunteers")({
  component: () => <SubmissionsTable table="volunteers" title="Volunteer Applications" statuses={["pending", "approved", "rejected", "active"]} />,
});
