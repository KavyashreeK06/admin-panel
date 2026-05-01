import type React from "react";
import { createClient } from "@/lib/supabase/server";
import DashboardCharts from "@/components/DashboardCharts";

export default async function AdminDashboard() {
  const supabase = await createClient();

  const [
    { count: totalUsers },
    { count: totalImages },
    { count: totalCaptions },
    { count: publicImages },
    { count: featuredCaptions },
    { count: studyUsers },
    { count: totalVotes },
    { count: upvotes },
    { count: downvotes },
    { data: recentUsers },
    { data: topCaptions },
    { data: mostVotedCaptions },
    { data: recentVotes },
  ] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("images").select("*", { count: "exact", head: true }),
    supabase.from("captions").select("*", { count: "exact", head: true }),
    supabase.from("images").select("*", { count: "exact", head: true }).eq("is_public", true),
    supabase.from("captions").select("*", { count: "exact", head: true }).eq("is_featured", true),
    supabase.from("profiles").select("*", { count: "exact", head: true }).eq("is_in_study", true),
    supabase.from("caption_votes").select("*", { count: "exact", head: true }),
    supabase.from("caption_votes").select("*", { count: "exact", head: true }).eq("vote_value", 1),
    supabase.from("caption_votes").select("*", { count: "exact", head: true }).eq("vote_value", -1),
    supabase.from("profiles").select("first_name, last_name, email, created_datetime_utc, is_in_study, is_superadmin").order("created_datetime_utc", { ascending: false }).limit(5),
    supabase.from("captions").select("content, like_count, is_featured, created_datetime_utc").order("like_count", { ascending: false }).limit(5),
    supabase.from("captions").select("content, like_count").order("like_count", { ascending: false }).limit(10),
    supabase.from("caption_votes").select("caption_id, vote_value, created_datetime_utc, captions(content)").order("created_datetime_utc", { ascending: false }).limit(8),
  ]);

  const stats = {
    totalUsers: totalUsers ?? 0,
    totalImages: totalImages ?? 0,
    totalCaptions: totalCaptions ?? 0,
    publicImages: publicImages ?? 0,
    featuredCaptions: featuredCaptions ?? 0,
    studyUsers: studyUsers ?? 0,
    privateImages: (totalImages ?? 0) - (publicImages ?? 0),
    captionsPerImage: totalImages ? ((totalCaptions ?? 0) / totalImages).toFixed(1) : "0",
    totalVotes: totalVotes ?? 0,
    upvotes: upvotes ?? 0,
    downvotes: downvotes ?? 0,
    upvotePct: totalVotes ? Math.round(((upvotes ?? 0) / totalVotes) * 100) : 0,
  };

  const card = (children: React.ReactNode) => (
    <div style={{ background: "var(--surface)", padding: "28px" }}>{children}</div>
  );

  const sectionLabel = (text: string, color = "var(--accent)") => (
    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 20 }}>
      {text}
    </div>
  );

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 48 }}>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "var(--accent)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 8 }}>Overview</div>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 42, fontWeight: 900, color: "var(--text)", lineHeight: 1 }}>Dashboard</h1>
      </div>

      {/* KPI Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 1, background: "var(--border)", marginBottom: 1 }}>
        {[
          { label: "Total Users", value: stats.totalUsers, accent: "var(--accent)", sub: `${stats.studyUsers} in study` },
          { label: "Total Images", value: stats.totalImages, accent: "var(--accent3)", sub: `${stats.publicImages} public` },
          { label: "Total Captions", value: stats.totalCaptions, accent: "#a78bfa", sub: `${stats.featuredCaptions} featured` },
          { label: "Captions / Image", value: stats.captionsPerImage, accent: "#fb923c", sub: "avg ratio" },
        ].map(({ label, value, accent, sub }) => (
          <div key={label} style={{ background: "var(--surface)", padding: "32px 28px" }}>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "var(--text-muted)", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 12 }}>{label}</div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 48, fontWeight: 900, color: accent, lineHeight: 1, marginBottom: 8 }}>{value}</div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "var(--text-dim)" }}>{sub}</div>
          </div>
        ))}
      </div>

      {/* Rating KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 1, background: "var(--border)", marginBottom: 1 }}>
        {[
          { label: "Total Votes Cast", value: stats.totalVotes, accent: "#60a5fa", sub: "all time" },
          { label: "Upvotes", value: stats.upvotes, accent: "var(--accent3)", sub: `${stats.upvotePct}% positive` },
          { label: "Downvotes", value: stats.downvotes, accent: "var(--accent2)", sub: `${100 - stats.upvotePct}% negative` },
          { label: "Votes / Caption", value: stats.totalCaptions ? ((stats.totalVotes) / stats.totalCaptions).toFixed(1) : "0", accent: "#f472b6", sub: "avg engagement" },
        ].map(({ label, value, accent, sub }) => (
          <div key={label} style={{ background: "var(--surface)", padding: "32px 28px" }}>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "var(--text-muted)", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 12 }}>{label}</div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 48, fontWeight: 900, color: accent, lineHeight: 1, marginBottom: 8 }}>{value}</div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "var(--text-dim)" }}>{sub}</div>
          </div>
        ))}
      </div>

      {/* Upvote ratio bar */}
      <div style={{ background: "var(--border)", marginBottom: 1 }}>
        {card(
          <div>
            {sectionLabel("Upvote vs Downvote Ratio", "#60a5fa")}
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "var(--accent3)", width: 40, flexShrink: 0 }}>{stats.upvotePct}%</div>
              <div style={{ flex: 1, height: 8, background: "var(--surface2)", borderRadius: 4, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${stats.upvotePct}%`, background: "linear-gradient(90deg, var(--accent3), #60a5fa)", borderRadius: 4, transition: "width 0.5s ease" }} />
              </div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "var(--accent2)", width: 40, flexShrink: 0, textAlign: "right" }}>{100 - stats.upvotePct}%</div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: "var(--accent3)", letterSpacing: "0.1em" }}>👍 UPVOTES</span>
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: "var(--accent2)", letterSpacing: "0.1em" }}>DOWNVOTES 👎</span>
            </div>
          </div>
        )}
      </div>

      {/* Charts row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1, background: "var(--border)", marginBottom: 1 }}>
        <DashboardCharts
          imagePublicRatio={[
            { name: "Public", value: stats.publicImages },
            { name: "Private", value: stats.privateImages },
          ]}
          userStudyRatio={[
            { name: "In Study", value: stats.studyUsers },
            { name: "Regular", value: stats.totalUsers - stats.studyUsers },
          ]}
        />
      </div>

      {/* Bottom tables */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1, background: "var(--border)", marginBottom: 1 }}>
        {/* Top captions by likes */}
        <div style={{ background: "var(--surface)", padding: "28px" }}>
          {sectionLabel("Top Captions by Likes")}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {(topCaptions ?? []).map((c, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 16, padding: "10px 0", borderBottom: "1px solid var(--border)" }}>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 900, color: "var(--text-dim)", width: 28, flexShrink: 0 }}>{i + 1}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, color: "var(--text)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", marginBottom: 2 }}>{c.content}</div>
                  {c.is_featured && <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: "var(--accent)", background: "rgba(232,255,71,0.1)", padding: "2px 6px", letterSpacing: "0.1em" }}>FEATURED</span>}
                </div>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: "var(--accent3)", flexShrink: 0 }}>{c.like_count ?? 0}</div>
              </div>
            ))}
            {(!topCaptions || topCaptions.length === 0) && <div style={{ color: "var(--text-muted)", fontFamily: "'DM Mono', monospace", fontSize: 12 }}>No captions yet</div>}
          </div>
        </div>

        {/* Recent users */}
        <div style={{ background: "var(--surface)", padding: "28px" }}>
          {sectionLabel("Recent Signups", "var(--accent3)")}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {(recentUsers ?? []).map((u, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: "1px solid var(--border)" }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--surface2)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Playfair Display', serif", fontSize: 13, fontWeight: 700, color: "var(--accent)", flexShrink: 0 }}>
                  {(u.first_name?.[0] ?? u.email?.[0] ?? "?").toUpperCase()}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, color: "var(--text)", marginBottom: 2 }}>{u.first_name} {u.last_name}</div>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "var(--text-muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{u.email}</div>
                </div>
                <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                  {u.is_superadmin && <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 8, color: "var(--accent2)", background: "rgba(255,71,87,0.1)", padding: "2px 6px", letterSpacing: "0.1em" }}>SUPER</span>}
                  {u.is_in_study && <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 8, color: "var(--accent3)", background: "rgba(0,212,170,0.1)", padding: "2px 6px", letterSpacing: "0.1em" }}>STUDY</span>}
                </div>
              </div>
            ))}
            {(!recentUsers || recentUsers.length === 0) && <div style={{ color: "var(--text-muted)", fontFamily: "'DM Mono', monospace", fontSize: 12 }}>No users yet</div>}
          </div>
        </div>
      </div>

      {/* Caption engagement leaderboard */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1, background: "var(--border)" }}>
        {/* Most engaged captions bar chart */}
        <div style={{ background: "var(--surface)", padding: "28px" }}>
          {sectionLabel("Caption Engagement Leaderboard", "#f472b6")}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {(mostVotedCaptions ?? []).map((c, i) => {
              const max = mostVotedCaptions?.[0]?.like_count ?? 1;
              const pct = max > 0 ? Math.max(0, ((c.like_count ?? 0) / max) * 100) : 0;
              return (
                <div key={i}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "var(--text-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "80%" }}>{c.content}</div>
                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "var(--accent3)", flexShrink: 0, marginLeft: 8 }}>{c.like_count ?? 0}</div>
                  </div>
                  <div style={{ height: 4, background: "var(--surface2)", borderRadius: 2, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${pct}%`, background: `hsl(${280 - i * 15}, 70%, 65%)`, borderRadius: 2, transition: "width 0.5s ease" }} />
                  </div>
                </div>
              );
            })}
            {(!mostVotedCaptions || mostVotedCaptions.length === 0) && <div style={{ color: "var(--text-muted)", fontFamily: "'DM Mono', monospace", fontSize: 12 }}>No votes yet</div>}
          </div>
        </div>

        {/* Recent votes feed */}
        <div style={{ background: "var(--surface)", padding: "28px" }}>
          {sectionLabel("Recent Votes", "#60a5fa")}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {(recentVotes ?? []).map((v, i) => {
              const caption = (v as unknown as { captions: { content: string } | null }).captions;
              return (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 0", borderBottom: "1px solid var(--border)" }}>
                  <span style={{ fontSize: 18, flexShrink: 0 }}>{v.vote_value === 1 ? "👍" : "👎"}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "var(--text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {caption?.content ?? "Unknown caption"}
                    </div>
                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: "var(--text-dim)", marginTop: 2 }}>
                      {new Date(v.created_datetime_utc).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, padding: "2px 8px", background: v.vote_value === 1 ? "rgba(0,212,170,0.1)" : "rgba(255,71,87,0.1)", color: v.vote_value === 1 ? "var(--accent3)" : "var(--accent2)", flexShrink: 0 }}>
                    {v.vote_value === 1 ? "+1" : "-1"}
                  </span>
                </div>
              );
            })}
            {(!recentVotes || recentVotes.length === 0) && <div style={{ color: "var(--text-muted)", fontFamily: "'DM Mono', monospace", fontSize: 12 }}>No votes yet</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
