import { createFileRoute } from "@tanstack/react-router";
import { SimpleCrud } from "@/components/admin/SimpleCrud";
export const Route = createFileRoute("/admin/projects")({
  component: () => <SimpleCrud table="projects" title="Projects" primaryField="title" fields={[
    { name: "title", label: "Title", required: true },
    { name: "slug", label: "Slug", required: true },
    { name: "description", label: "Description", type: "textarea" },
    { name: "location", label: "Location" },
    { name: "project_date", label: "Date", type: "date" },
    { name: "banner_url", label: "Banner URL" },
  ]} />,
});
