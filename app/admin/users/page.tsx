import { createClient } from "@/lib/supabase/server";

export default async function UsersPage() {
  const supabase = await createClient();
  const { data: users, error } = await supabase
    .from("profiles")
    .select("id, first_name, last_name, email, is_superadmin, is_in_study, is_matrix_admin, created_datetime_utc, modified_datetime_utc")
    .order("created_datetime_utc", { ascending: false });

  return (
    <div>
      <div style={{ marginBottom: 40 }}>
        <div style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: 11,
          color: "var(--accent)",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          marginBottom: 8,
        }}>
          Read-Only
        </div>
        <h1 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 42,
          fontWeight: 900,
          color: "var(--text)",
          lineHeight: 1,
          marginBottom: 8,
        }}>
          Users
        </h1>
        <p style={{ color: "var(--text-muted)", fontFamily: "'DM Mono', monospace", fontSize: 12 }}>
          {users?.length ?? 0} profiles registered
        </p>
      </div>

      <div style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "2fr 2fr 1fr 1fr 1fr 1.5fr",
          padding: "12px 24px",
          borderBottom: "1px solid var(--border)",
          background: "var(--surface2)",
        }}>
          {["Name", "Email", "Superadmin", "Study", "Matrix", "Joined"].map(h => (
            <div key={h} style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 10,
              color: "var(--text-muted)",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
            }}>
              {h}
            </div>
          ))}
        </div>

        {(users ?? []).map((u, i) => (
          <div key={u.id} style={{
            display: "grid",
            gridTemplateColumns: "2fr 2fr 1fr 1fr 1fr 1.5fr",
            padding: "16px 24px",
            borderBottom: i < (users?.length ?? 0) - 1 ? "1px solid var(--border)" : "none",
            alignItems: "center",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{
                width: 32, height: 32,
                borderRadius: "50%",
                background: "var(--surface2)",
                border: "1px solid var(--border)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "'Playfair Display', serif",
                fontSize: 13, fontWeight: 700,
                color: "var(--accent)",
                flexShrink: 0,
              }}>
                {(u.first_name?.[0] ?? u.email?.[0] ?? "?").toUpperCase()}
              </div>
              <div style={{ fontSize: 13, color: "var(--text)" }}>
                {u.first_name} {u.last_name}
              </div>
            </div>

            <div style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 11,
              color: "var(--text-muted)",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}>
              {u.email}
            </div>

            {[u.is_superadmin, u.is_in_study, u.is_matrix_admin].map((val, idx) => (
              <div key={idx}>
                <span style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 9,
                  padding: "3px 8px",
                  letterSpacing: "0.1em",
                  background: val ? "rgba(232,255,71,0.1)" : "transparent",
                  color: val ? "var(--accent)" : "var(--text-dim)",
                  border: `1px solid ${val ? "rgba(232,255,71,0.3)" : "var(--border)"}`,
                }}>
                  {val ? "YES" : "NO"}
                </span>
              </div>
            ))}

            <div style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 10,
              color: "var(--text-dim)",
            }}>
              {u.created_datetime_utc
                ? new Date(u.created_datetime_utc).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                : "—"}
            </div>
          </div>
        ))}

        {(!users || users.length === 0) && (
          <div style={{
            padding: "48px 24px",
            textAlign: "center",
            fontFamily: "'DM Mono', monospace",
            fontSize: 12,
            color: "var(--text-muted)",
          }}>
            {error ? `Error: ${error.message}` : "No users found"}
          </div>
        )}
      </div>
    </div>
  );
}
