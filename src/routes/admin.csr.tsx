import { createFileRoute } from "@tanstack/react-router";
import { ApplicationsAdmin } from "@/components/admin/ApplicationsAdmin";
export const Route = createFileRoute("/admin/csr")({
  component: () => <ApplicationsAdmin kind="csr" />,
});
