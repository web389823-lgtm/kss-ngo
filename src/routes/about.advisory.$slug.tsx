import { createFileRoute } from "@tanstack/react-router";
import TeamMemberDetail from "@/components/site/TeamMemberDetail";

export const Route = createFileRoute("/about/advisory/$slug")({
  component: () => <TeamMemberDetail kind="advisory" />,
  head: () => ({ meta: [{ title: "Advisory Board Member — KSS" }] }),
});
