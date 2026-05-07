import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, UserCog } from "lucide-react";

export const Route = createFileRoute("/admin/users")({ component: UsersPage });

function UsersPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin", "staff_users"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("list_staff_users");
      if (error) throw error;
      return data ?? [];
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-semibold">Admins & Staff</h1>
        <p className="text-sm text-muted-foreground mt-1">Everyone with access to the admin panel.</p>
      </div>
      {isLoading ? <p className="text-muted-foreground">Loading…</p> : (
        <Card className="p-0 overflow-hidden">
          <div className="divide-y">
            {(data ?? []).map((u: any) => (
              <div key={u.user_id} className="p-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center ${u.role === "admin" ? "gradient-saffron text-primary-foreground" : "bg-secondary"}`}>
                    {u.role === "admin" ? <ShieldCheck className="h-5 w-5" /> : <UserCog className="h-5 w-5" />}
                  </div>
                  <div className="min-w-0">
                    <div className="font-medium truncate">{u.full_name || u.email}</div>
                    <div className="text-xs text-muted-foreground truncate">{u.email}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={u.role === "admin" ? "default" : "outline"} className="capitalize">{u.role}</Badge>
                  <span className="text-xs text-muted-foreground hidden sm:inline">Joined {new Date(u.joined_at).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
            {(data ?? []).length === 0 && <div className="p-8 text-center text-muted-foreground text-sm">No staff or admin users yet.</div>}
          </div>
        </Card>
      )}
    </div>
  );
}
