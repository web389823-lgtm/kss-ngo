import { createFileRoute } from "@tanstack/react-router";
import { SimpleCrud } from "@/components/admin/SimpleCrud";
export const Route = createFileRoute("/admin/programs")({
  component: () => <SimpleCrud table="programs" title="Programs" primaryField="title" orderBy="sort_order" ascending fields={[
    { name: "title", label: "Title", required: true },
    { name: "slug", label: "Slug (unique)", required: true },
    { name: "category", label: "Category" },
    { name: "summary", label: "Short description", type: "textarea" },
    { name: "description", label: "Full description / documentation", type: "textarea" },
    { name: "thumbnail_url", label: "Thumbnail image", type: "file", accept: "image/*" },
    { name: "banner_url", label: "Banner image", type: "file", accept: "image/*" },
    { name: "video_url", label: "Video URL (YouTube / Vimeo / mp4)", type: "text" },
    { name: "status", label: "Status", type: "select", options: [
      { value: "active", label: "Active" },
      { value: "draft", label: "Inactive / Draft" },
      { value: "archived", label: "Completed / Archived" },
    ]},
    { name: "sort_order", label: "Sort order", type: "number" },
  ]} />,
});
