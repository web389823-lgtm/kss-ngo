import { createFileRoute } from "@tanstack/react-router";
import { SimpleCrud } from "@/components/admin/SimpleCrud";

export const Route = createFileRoute("/admin/voices")({
  component: () => (
    <SimpleCrud
      table="voices_of_appreciation"
      title="Voices of Appreciation"
      primaryField="name"
      orderBy="display_order"
      ascending={true}
      fields={[
        { name: "photo_url", label: "Photo", type: "image", accept: "image/*", bucket: "kss-media", folder: "voa" },
        { name: "name", label: "Name", required: true },
        { name: "title", label: "Title / Role" },
        { name: "quote", label: "Quote", type: "textarea", required: true },
        { name: "highlight_words", label: "Highlight words (comma separated, colored green in quote)", type: "textarea" },
        { name: "display_order", label: "Display order (lower = first)", type: "number" },
      ]}
    />
  ),
});
