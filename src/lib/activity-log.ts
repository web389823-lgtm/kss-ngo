import { supabase } from "@/integrations/supabase/client";

export type ActivityAction = "created" | "updated" | "deleted" | "status_changed" | "login";

export async function logActivity(params: {
  action: ActivityAction;
  entity_type: string;
  entity_id?: string | null;
  entity_label?: string | null;
  details?: Record<string, unknown> | null;
}) {
  try {
    const { data: u } = await supabase.auth.getUser();
    const user = u?.user;
    if (!user) return;
    let role: string | null = null;
    try {
      const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", user.id);
      const rs = (roles ?? []).map((r: any) => r.role);
      role = rs.includes("admin") ? "admin" : rs.includes("staff") ? "staff" : (rs[0] ?? null);
    } catch { /* ignore */ }
    await supabase.from("activity_log").insert({
      user_id: user.id,
      user_email: user.email ?? null,
      user_role: role,
      action: params.action,
      entity_type: params.entity_type,
      entity_id: params.entity_id ?? null,
      entity_label: params.entity_label ?? null,
      details: (params.details ?? null) as any,
    });
  } catch { /* swallow logging errors */ }
}
