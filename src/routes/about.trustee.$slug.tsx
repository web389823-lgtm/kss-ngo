import { createFileRoute } from "@tanstack/react-router";
import TeamMemberDetail from "@/components/site/TeamMemberDetail";

export const Route = createFileRoute("/about/trustee/$slug")({
  component: () => <TeamMemberDetail kind="trustee" />,
  head: () => ({ meta: [{ title: "Trustee Board Member — KSS" }] }),
});
