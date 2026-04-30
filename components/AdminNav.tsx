"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const links = [
  { href: "/admin", label: "Dashboard", icon: "◈" },
  { href: "/admin/users", label: "Users", icon: "◉" },
  { href: "/admin/images", label: "Images", icon: "◫" },
  { href: "/admin/captions", label: "Captions", icon: "◳" },
];

interface Profile {
  first_name?: string | null;
  last_name?: string | null;
  email?: string | null;
}

export default function AdminNav({ profile }: { profile: Profile }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <nav style={{
      position: "fixed",
      left: 0, top: 0, bottom: 0,
      width: 220,
      background: "var(--surface)",
      borderRight: "1px solid var(--border)",
      display: "flex",
      flexDirection: "column",
      padding: "32px 0",
      zIndex: 100,
    }}>
      <div style={{ padding: "0 24px", marginBottom: 40 }}>
        <div style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: 10,
          letterSpacing: "0.2em",
          color: "var(--accent)",
          textTransform: "uppercase",
          marginBottom: 4,
        }}>
          AlmostCrackd
        </div>
        <div style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 18,
          fontWeight: 700,
          color: "var(--text)",
        }}>
          Admin
        </div>
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 2, padding: "0 12px" }}>
        {links.map(({ href, label, icon }) => {
          const active = href === "/admin"
            ? pathname === "/admin"
            : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "10px 12px",
                borderRadius: 4,
                background: active ? "rgba(232,255,71,0.08)" : "transparent",
                color: active ? "var(--accent)" : "var(--text-muted)",
                fontFamily: "'DM Mono', monospace",
                fontSize: 12,
                letterSpacing: "0.05em",
                borderLeft: active ? "2px solid var(--accent)" : "2px solid transparent",
                textDecoration: "none",
              }}
            >
              <span style={{ fontSize: 14 }}>{icon}</span>
              {label}
            </Link>
          );
        })}
      </div>

      <div style={{ padding: "20px 24px", borderTop: "1px solid var(--border)" }}>
        <div style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: 11,
          color: "var(--text-muted)",
          marginBottom: 4,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}>
          {profile?.first_name} {profile?.last_name}
        </div>
        <div style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: 10,
          color: "var(--text-dim)",
          marginBottom: 12,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}>
          {profile?.email}
        </div>
        <button
          onClick={handleSignOut}
          style={{
            width: "100%",
            padding: "8px",
            background: "transparent",
            border: "1px solid var(--border)",
            color: "var(--text-muted)",
            fontFamily: "'DM Mono', monospace",
            fontSize: 10,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            cursor: "pointer",
          }}
        >
          Sign Out
        </button>
      </div>
    </nav>
  );
}
