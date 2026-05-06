import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Heart, HandHeart, BookOpen, Newspaper } from "lucide-react";

export const Route = createFileRoute("/admin/")({ component: Dashboard });

function Stat({ label, value, icon: Icon }: any) {
  return <Card className="p-6"><div className="flex items-center justify-between"><div><div className="text-xs text-muted-foreground uppercase tracking-wider">{label}</div><div className="font-serif text-3xl font-semibold mt-1">{value ?? "—"}</div></div><Icon className="h-5 w-5 text-primary" /></div></Card>;
}

function Dashboard() {
  const { data } = useQuery({
    queryKey: ["admin", "counts"],
    queryFn: async () => {
      const [d, v, p, b] = await Promise.all([
        supabase.from("donations").select("*", { count: "exact", head: true }),
        supabase.from("volunteers").select("*", { count: "exact", head: true }),
        supabase.from("programs").select("*", { count: "exact", head: true }),
        supabase.from("blog_posts").select("*", { count: "exact", head: true }),
      ]);
      return { donations: d.count, volunteers: v.count, programs: p.count, posts: b.count };
    },
  });
  const { data: pendingD } = useQuery({
    queryKey: ["admin", "pending_donations"],
    queryFn: async () => (await supabase.from("donations").select("*").eq("status", "pending").order("created_at", { ascending: false }).limit(5)).data ?? [],
  });
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-semibold">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Overview of your KSS platform.</p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat label="Donations" value={data?.donations} icon={Heart} />
        <Stat label="Volunteers" value={data?.volunteers} icon={HandHeart} />
        <Stat label="Programs" value={data?.programs} icon={BookOpen} />
        <Stat label="Blog Posts" value={data?.posts} icon={Newspaper} />
      </div>
      <Card className="p-6">
        <h2 className="font-serif text-lg font-semibold mb-3">Pending donations</h2>
        {(pendingD ?? []).length === 0 ? <p className="text-sm text-muted-foreground">No pending donations.</p> : (
          <div className="divide-y">
            {pendingD!.map((d: any) => (
              <div key={d.id} className="py-3 flex justify-between items-center text-sm">
                <div><div className="font-medium">{d.full_name}</div><div className="text-muted-foreground text-xs">{d.email}</div></div>
                <div className="font-serif text-lg">₹{Number(d.amount).toLocaleString()}</div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
