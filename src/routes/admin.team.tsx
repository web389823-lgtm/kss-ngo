import { createFileRoute } from "@tanstack/react-router";
import { SimpleCrud } from "@/components/admin/SimpleCrud";
export const Route = createFileRoute("/admin/team")({
  component: () => (
    <div className="space-y-10">
      <SimpleCrud table="advisory_team" title="Advisory Team" primaryField="name" orderBy="sort_order" ascending fields={[
        { name: "name", label: "Name", required: true },
        { name: "position", label: "Position" },
        { name: "bio", label: "Bio", type: "textarea" },
        { name: "photo_url", label: "Photo URL" },
        { name: "sort_order", label: "Sort order", type: "number" },
      ]} />
      <SimpleCrud table="trusted_members" title="Trusted Members" primaryField="name" orderBy="sort_order" ascending fields={[
        { name: "name", label: "Name", required: true },
        { name: "role", label: "Role" },
        { name: "description", label: "Description", type: "textarea" },
        { name: "photo_url", label: "Photo URL" },
        { name: "sort_order", label: "Sort order", type: "number" },
      ]} />
    </div>
  ),
});
