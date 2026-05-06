import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Session, User } from "@supabase/supabase-js";

export type Role = "admin" | "staff" | null;

type AuthCtx = {
  user: User | null;
  session: Session | null;
  role: Role;
  isAdmin: boolean;
  isStaff: boolean;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshRole: () => Promise<void>;
};

const Ctx = createContext<AuthCtx>({
  user: null, session: null, role: null, isAdmin: false, isStaff: false,
  loading: true, signOut: async () => {}, refreshRole: async () => {},
});

async function fetchRole(userId: string): Promise<Role> {
  const { data } = await supabase
    .from("user_roles").select("role").eq("user_id", userId);
  const roles = (data ?? []).map((r: any) => r.role);
  if (roles.includes("admin")) return "admin";
  if (roles.includes("staff")) return "staff";
  return null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<Role>(null);
  const [loading, setLoading] = useState(true);

  const refreshRole = async () => {
    const uid = (await supabase.auth.getUser()).data.user?.id;
    setRole(uid ? await fetchRole(uid) : null);
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
      if (s?.user) setTimeout(async () => setRole(await fetchRole(s.user.id)), 0);
      else setRole(null);
    });
    supabase.auth.getSession().then(async ({ data: { session: s } }) => {
      setSession(s);
      if (s?.user) setRole(await fetchRole(s.user.id));
      setLoading(false);
    });
    return () => subscription.unsubscribe();
  }, []);

  return (
    <Ctx.Provider value={{
      user: session?.user ?? null, session, role,
      isAdmin: role === "admin", isStaff: role === "admin" || role === "staff",
      loading, refreshRole,
      signOut: async () => { await supabase.auth.signOut(); },
    }}>
      {children}
    </Ctx.Provider>
  );
}

export const useAuth = () => useContext(Ctx);
