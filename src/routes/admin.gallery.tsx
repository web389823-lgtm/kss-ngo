import { createFileRoute } from "@tanstack/react-router";
import { SimpleCrud } from "@/components/admin/SimpleCrud";
export const Route = createFileRoute("/admin/gallery")({
  component: () => <SimpleCrud table="gallery_items" title="Gallery" primaryField="media_url" fields={[
    { name: "title", label: "Title" },
    { name: "media_url", label: "Media URL", required: true },
    { name: "category", label: "Category (events, programs, projects, volunteers, donations)" },
  ]} />,
});
