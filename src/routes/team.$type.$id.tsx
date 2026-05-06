import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/team/$type/$id")({
  component: MemberDetailPage,
  head: () => ({
    meta: [{ title: "Member — Keshava Seva Samiti" }],
  }),
});

function MemberDetailPage() {
  const { type, id } = useParams({ from: "/team/$type/$id" });
  const table = type === "trustee" ? "trusted_members" : "advisory_team";

  const { data: member, isLoading } = useQuery({
    queryKey: [table, id],
    queryFn: async () => {
      const { data } = await supabase.from(table).select("*").eq("id", id).maybeSingle();
      return data;
    },
  });

  if (isLoading) {
    return <div className="container-page py-20 text-center text-muted-foreground">Loading…</div>;
  }

  if (!member) {
    return (
      <div className="container-page py-20 text-center">
        <p className="text-muted-foreground">Member not found.</p>
        <Button asChild variant="outline" className="mt-6"><Link to="/">Back to home</Link></Button>
      </div>
    );
  }

  const subtitle = (member as any).position ?? (member as any).role;
  const description = (member as any).bio ?? (member as any).description;

  return (
    <div className="container-page py-16 md:py-20">
      <Button asChild variant="ghost" size="sm" className="mb-8">
        <Link to="/"><ArrowLeft className="mr-2 h-4 w-4" />Back to home</Link>
      </Button>

      <div className="grid md:grid-cols-[320px_1fr] gap-10 md:gap-14 items-start">
        <div className="mx-auto md:mx-0 w-64 h-64 md:w-80 md:h-80 rounded-2xl overflow-hidden gradient-saffron shadow-elevated ring-4 ring-background">
          {member.photo_url && (
            <img src={member.photo_url} alt={member.name} className="h-full w-full object-cover" />
          )}
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            {type === "trustee" ? "Trustee Board" : "Advisory Board"}
          </p>
          <h1 className="mt-3 font-serif text-4xl md:text-5xl font-semibold">{member.name}</h1>
          {subtitle && <p className="mt-2 text-lg text-muted-foreground">{subtitle}</p>}
          {description && (
            <div className="mt-8 prose prose-neutral max-w-none whitespace-pre-line text-foreground/90 leading-relaxed">
              {description}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
