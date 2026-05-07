import { createFileRoute } from "@tanstack/react-router";
import { SimpleCrud } from "@/components/admin/SimpleCrud";

export const Route = createFileRoute("/admin/gallery")({
  component: () => (
    <SimpleCrud
      table="gallery_items"
      title="Gallery (Photos & Videos)"
      primaryField="title"
      fields={[
        { name: "title", label: "Title" },
        { name: "description", label: "Description", type: "textarea" },
        { name: "media_type", label: "Media Type", type: "select", required: true, options: [
          { value: "image", label: "Photo" },
          { value: "video", label: "Video" },
        ]},
        { name: "media_url", label: "Photo upload, or Video URL / upload", type: "file", required: true, accept: "image/*,video/*" },
        { name: "ratio", label: "Aspect Ratio", type: "select", options: [
          { value: "16:9", label: "16:9 (landscape)" },
          { value: "9:16", label: "9:16 (portrait / reel)" },
          { value: "1:1", label: "1:1 (square)" },
          { value: "4:3", label: "4:3" },
        ]},
        { name: "category", label: "Category (events, programs, projects, volunteers, donations)" },
      ]}
    />
  ),
});
