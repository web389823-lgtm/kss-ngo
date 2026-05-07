import { createFileRoute } from "@tanstack/react-router";
import { SimpleCrud } from "@/components/admin/SimpleCrud";
export const Route = createFileRoute("/admin/testimonials")({
  component: () => <SimpleCrud table="testimonials" title="Testimonials" primaryField="name" fields={[
    { name: "name", label: "Name", required: true },
    { name: "role", label: "Role" },
    { name: "content", label: "Quote", type: "textarea", required: true },
    { name: "photo_url", label: "Photo (upload from device)", type: "image", accept: "image/*" },
    { name: "rating", label: "Rating (1-5)", type: "number" },
  ]} />,
});
