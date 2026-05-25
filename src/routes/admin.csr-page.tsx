import { createFileRoute } from "@tanstack/react-router";
import { PageSettingsEditor } from "./admin.volunteer-page";

export const Route = createFileRoute("/admin/csr-page")({
  component: () => <PageSettingsEditor settingsKey="csr_page_content" title="CSR Page Editor" />,
});
