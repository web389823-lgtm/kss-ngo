import { createFileRoute } from "@tanstack/react-router";
import { SimpleCrud } from "@/components/admin/SimpleCrud";
export const Route = createFileRoute("/admin/blog")({
  component: () => <SimpleCrud table="blog_posts" title="Blog Posts" primaryField="title" fields={[
    { name: "title", label: "Title", required: true },
    { name: "slug", label: "Slug", required: true },
    { name: "category", label: "Category" },
    { name: "excerpt", label: "Excerpt", type: "textarea" },
    { name: "content", label: "Content", type: "textarea" },
    { name: "featured_image", label: "Featured image URL" },
  ]} />,
});
