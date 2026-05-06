import { createFileRoute } from "@tanstack/react-router";
import { SimpleCrud } from "@/components/admin/SimpleCrud";
export const Route = createFileRoute("/admin/impact")({
  component: () => <SimpleCrud table="impact_stats" title="Impact Stats" primaryField="label" orderBy="sort_order" ascending fields={[
    { name: "label", label: "Label", required: true },
    { name: "value", label: "Value", type: "number", required: true },
    { name: "suffix", label: "Suffix (e.g. +)" },
    { name: "icon", label: "Icon (GraduationCap, Home, Stethoscope, Sparkles, Users, Award)" },
    { name: "sort_order", label: "Sort order", type: "number" },
  ]} />,
});
