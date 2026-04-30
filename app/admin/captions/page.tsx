import { createClient } from "@/lib/supabase/server";

export default async function CaptionsPage() {
  const supabase = await createClient();
  const { data: captions, error } = await supabase
    .from("captions")
    .select("id, content, like_count, is_featured, is_public, created_datetime_utc, profile_id, image_id")
    .order("like_count", { ascending: false });

  const featured = captions?.filter(c => c.is_featured) ?? [];
  const maxLikes = Math.max(...(captions?.map(c => c.like_count ?? 0) ?? [1]), 1);

  return (
    <div>
      <div style={{ marginBottom: 40 }}>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "var(--accent)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 8 }}>
          Read-Only
        </div>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 42, fontWeight: 900, color: "var(--text)", lineHeight: 1, marginBottom: 8 }}>
          Captions
        </h1>
        <p style={{ color: "var(--text-muted)", fontFamily: "'DM Mono', monospace", fontSize: 12 }}>
          {captions?.length ?? 0} total · {featured.length} featured
        </p>
      </div>

      {/* Featured strip */}
      {featured.length > 0 && (
        <div style={{ marginBottom: 40 }}>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "var(--accent)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 16 }}>
            Featured
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 1, background: "var(--border)" }}>
            {featured.slice(0, 3).map(c => (
              <div key={c.id} style={{
                background: "rgba(232,255,71,0.05)",
                borderLeft: "3px solid var(--accent)",
                padding: "20px 24px",
              }}>
                <div style={{ fontSize: 14, color: "var(--text)", lineHeight: 1.6, marginBottom: 12 }}>
                  "{c.content}"
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: "var(--accent3)" }}>
                    {c.like_count ?? 0}
                  </span>
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: "var(--text-dim)" }}>likes</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All captions with like bar */}
      <div style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "3fr 100px 100px 100px 1.2fr",
          padding: "12px 24px",
          borderBottom: "1px solid var(--border)",
          background: "var(--surface2)",
        }}>
          {["Caption", "Likes", "Featured", "Public", "Created"].map(h => (
            <div key={h} style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "var(--text-muted)", letterSpacing: "0.15em", textTransform: "uppercase" }}>
              {h}
            </div>
          ))}
        </div>

        {(captions ?? []).map((c, i) => (
          <div key={c.id} style={{
            display: "grid",
            gridTemplateColumns: "3fr 100px 100px 100px 1.2fr",
            padding: "16px 24px",
            borderBottom: i < (captions?.length ?? 0) - 1 ? "1px solid var(--border)" : "none",
            alignItems: "center",
          }}>
            <div>
              <div style={{ fontSize: 13, color: "var(--text)", lineHeight: 1.5, marginBottom: 8 }}>
                {c.content}
              </div>
              {/* Like bar */}
              <div style={{ height: 2, background: "var(--border)", borderRadius: 1, overflow: "hidden", maxWidth: 200 }}>
                <div style={{
                  height: "100%",
                  width: `${((c.like_count ?? 0) / maxLikes) * 100}%`,
                  background: "var(--accent3)",
                  borderRadius: 1,
                  transition: "width 0.3s",
                }} />
              </div>
            </div>

            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: "var(--accent3)" }}>
              {c.like_count ?? 0}
            </div>

            {[c.is_featured, c.is_public].map((val, idx) => (
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

            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "var(--text-dim)" }}>
              {c.created_datetime_utc
                ? new Date(c.created_datetime_utc).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                : "—"}
            </div>
          </div>
        ))}

        {(!captions || captions.length === 0) && (
          <div style={{ padding: "48px 24px", textAlign: "center", fontFamily: "'DM Mono', monospace", fontSize: 12, color: "var(--text-muted)" }}>
            {error ? `Error: ${error.message}` : "No captions found"}
          </div>
        )}
      </div>
    </div>
  );
}
