import { createFileRoute } from "@tanstack/react-router";
import { SimpleCrud } from "@/components/admin/SimpleCrud";
export const Route = createFileRoute("/admin/blog")({
  component: () => <SimpleCrud table="blog_posts" title="Blog Posts" primaryField="title" fields={[
    { name: "featured_image", label: "Banner Image (landscape, upload from device)", type: "image", accept: "image/*" },
    { name: "title", label: "Title", required: true },
    { name: "slug", label: "Slug (URL friendly)", required: true },
    { name: "category", label: "Category" },
    { name: "excerpt", label: "Short excerpt", type: "textarea" },
    { name: "content", label: "Full content / description", type: "textarea" },
    { name: "status", label: "Status", type: "select", options: [
      { value: "draft", label: "Draft" }, { value: "published", label: "Published" },
    ]},
  ]} />,
});
