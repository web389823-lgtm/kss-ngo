import { createFileRoute } from "@tanstack/react-router";
import { SimpleCrud } from "@/components/admin/SimpleCrud";
export const Route = createFileRoute("/admin/programs")({
  component: () => <SimpleCrud table="programs" title="Programs" primaryField="title" orderBy="sort_order" ascending fields={[
    { name: "banner_url", label: "Banner image (upload from device)", type: "image", accept: "image/*" },
    { name: "title", label: "Title", required: true },
    { name: "slug", label: "Slug (unique)", required: true },
    { name: "category", label: "Category" },
    { name: "summary", label: "Summary", type: "textarea" },
    { name: "description", label: "Full description", type: "textarea" },
    { name: "sort_order", label: "Sort order", type: "number" },
  ]} />,
});
