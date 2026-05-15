import { createFileRoute } from "@tanstack/react-router";
import { SubmissionsTable } from "@/components/admin/SubmissionsTable";
export const Route = createFileRoute("/admin/volunteers")({
  component: () => <SubmissionsTable table="volunteer_applications" title="Volunteer Applications" statuses={["pending", "approved", "rejected", "active"]} />,
});
