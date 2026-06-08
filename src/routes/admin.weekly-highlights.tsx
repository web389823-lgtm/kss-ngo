import { createFileRoute } from "@tanstack/react-router";
import { SimpleCrud } from "@/components/admin/SimpleCrud";

export const Route = createFileRoute("/admin/weekly-highlights")({
  component: () => (
    <SimpleCrud
      table="weekly_highlights"
      title="Weekly Highlights"
      primaryField="title"
      orderBy="sort_order"
      ascending
      fields={[
        { name: "image_url", label: "Highlight image", type: "image", accept: "image/*" },
        { name: "title", label: "Title", required: true },
        { name: "week_label", label: "Week label (e.g. Week of June 8)" },
        { name: "description", label: "Short description", type: "textarea" },
        { name: "link_type", label: "Link to", type: "select", options: [
          { value: "program", label: "A Program" },
          { value: "project", label: "A Project" },
          { value: "blog", label: "A News / Blog post" },
          { value: "custom", label: "Custom URL" },
        ]},
        { name: "link_target", label: "Slug or URL (e.g. balagokula, or https://...)" },
        { name: "sort_order", label: "Sort order", type: "number" },
        { name: "status", label: "Status", type: "select", options: [
          { value: "published", label: "Published" },
          { value: "draft", label: "Draft" },
        ]},
      ]}
    />
  ),
});
