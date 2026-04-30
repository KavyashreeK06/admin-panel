"use client";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

interface Props {
  imagePublicRatio: { name: string; value: number }[];
  userStudyRatio: { name: string; value: number }[];
}

const COLORS_IMG = ["#00d4aa", "#2a2a35"];
const COLORS_USER = ["#e8ff47", "#2a2a35"];

export default function DashboardCharts({ imagePublicRatio, userStudyRatio }: Props) {
  return (
    <>
      <div style={{ background: "var(--surface)", padding: "28px" }}>
        <div style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: 10,
          color: "var(--accent3)",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          marginBottom: 20,
        }}>
          Image Visibility
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
          <ResponsiveContainer width={140} height={140}>
            <PieChart>
              <Pie
                data={imagePublicRatio}
                cx="50%" cy="50%"
                innerRadius={40} outerRadius={65}
                paddingAngle={3}
                dataKey="value"
                strokeWidth={0}
              >
                {imagePublicRatio.map((_, i) => (
                  <Cell key={i} fill={COLORS_IMG[i % COLORS_IMG.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "var(--surface2)",
                  border: "1px solid var(--border)",
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 11,
                  color: "var(--text)",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {imagePublicRatio.map((item, i) => (
              <div key={item.name} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{
                  width: 8, height: 8,
                  borderRadius: "50%",
                  background: COLORS_IMG[i],
                  flexShrink: 0,
                }} />
                <div>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "var(--text-muted)" }}>
                    {item.name}
                  </div>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: "var(--text)" }}>
                    {item.value}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ background: "var(--surface)", padding: "28px" }}>
        <div style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: 10,
          color: "var(--accent)",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          marginBottom: 20,
        }}>
          User Study Participation
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
          <ResponsiveContainer width={140} height={140}>
            <PieChart>
              <Pie
                data={userStudyRatio}
                cx="50%" cy="50%"
                innerRadius={40} outerRadius={65}
                paddingAngle={3}
                dataKey="value"
                strokeWidth={0}
              >
                {userStudyRatio.map((_, i) => (
                  <Cell key={i} fill={COLORS_USER[i % COLORS_USER.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "var(--surface2)",
                  border: "1px solid var(--border)",
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 11,
                  color: "var(--text)",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {userStudyRatio.map((item, i) => (
              <div key={item.name} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{
                  width: 8, height: 8,
                  borderRadius: "50%",
                  background: COLORS_USER[i],
                  flexShrink: 0,
                }} />
                <div>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "var(--text-muted)" }}>
                    {item.name}
                  </div>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: "var(--text)" }}>
                    {item.value}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
