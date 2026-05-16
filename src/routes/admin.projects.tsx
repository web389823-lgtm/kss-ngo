import { createFileRoute } from "@tanstack/react-router";
import { SimpleCrud } from "@/components/admin/SimpleCrud";
export const Route = createFileRoute("/admin/projects")({
  component: () => <SimpleCrud table="projects" title="Projects" primaryField="title" fields={[
    { name: "title", label: "Title", required: true },
    { name: "slug", label: "Slug", required: true },
    { name: "description", label: "Description / documentation", type: "textarea" },
    { name: "location", label: "Location" },
    { name: "project_date", label: "Date", type: "date" },
    { name: "thumbnail_url", label: "Thumbnail image", type: "file", accept: "image/*" },
    { name: "banner_url", label: "Banner image", type: "file", accept: "image/*" },
    { name: "gallery_urls", label: "Gallery images", type: "gallery" },
    { name: "video_url", label: "Video URL (YouTube / Vimeo / mp4)", type: "text" },
    { name: "status", label: "Status", type: "select", options: [
      { value: "active", label: "Active / Ongoing" },
      { value: "draft", label: "Planned / Draft" },
      { value: "archived", label: "Completed / Archived" },
    ]},
  ]} />,
});
