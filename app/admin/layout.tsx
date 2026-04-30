import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AdminNav from "@/components/AdminNav";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("first_name, last_name, email, is_superadmin")
    .eq("id", user.id)
    .single();

  if (!profile?.is_superadmin) redirect("/login?error=unauthorized");

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg)" }}>
      <AdminNav profile={profile} />
      <main style={{
        flex: 1,
        marginLeft: 220,
        padding: "40px 48px",
        maxWidth: "calc(100vw - 220px)",
        overflowX: "hidden",
      }}>
        {children}
      </main>
    </div>
  );
}
