"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();
const inp = { background: "var(--surface2)", border: "1px solid var(--border)", color: "var(--text)", borderRadius: 4, padding: "8px 12px", fontSize: 13, width: "100%", outline: "none", fontFamily: "'DM Sans', sans-serif" } as const;

export default function HumorMixPage() {
  const [rows, setRows] = useState<Record<string, unknown>[]>([]);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<Record<string, unknown>>({});
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

  const msg = (m: string, ok = true) => { setToast({ msg: m, ok }); setTimeout(() => setToast(null), 3000); };

  const load = async () => {
    const { data, error } = await supabase.from("humor_mix").select("*");
    if (error) msg(error.message, false); else setRows(data ?? []);
  };

  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!editId) return;
    setSaving(true);
    const { id, created_datetime_utc, ...updates } = form;
    const { error } = await supabase.from("humor_mix").update(updates).eq("id", editId);
    setSaving(false);
    if (error) return msg(error.message, false);
    msg("Saved"); setEditId(null); load();
  };

  return (
    <div>
      {toast && <div style={{ position: "fixed", top: 24, right: 24, zIndex: 1000, background: toast.ok ? "rgba(0,212,170,0.15)" : "rgba(255,71,87,0.15)", border: `1px solid ${toast.ok ? "var(--accent3)" : "var(--accent2)"}`, color: toast.ok ? "var(--accent3)" : "var(--accent2)", padding: "12px 20px", fontFamily: "'DM Mono', monospace", fontSize: 12, borderRadius: 4 }}>{toast.msg}</div>}

      <div style={{ marginBottom: 40 }}>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "var(--accent)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 8 }}>Read / Update</div>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 42, fontWeight: 900, color: "var(--text)", lineHeight: 1 }}>Humor Mix</h1>
      </div>

      {editId && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", padding: 40, width: 560, maxHeight: "90vh", overflowY: "auto" }}>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 700, marginBottom: 28, color: "var(--text)" }}>Edit Humor Mix</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {Object.entries(form).filter(([k]) => k !== "id" && k !== "created_datetime_utc").map(([key, val]) => (
                <div key={key}>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "var(--text-muted)", marginBottom: 6 }}>{key}</div>
                  {typeof val === "boolean"
                    ? <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontFamily: "'DM Mono', monospace", fontSize: 12, color: "var(--text-muted)" }}>
                        <input type="checkbox" checked={val} onChange={e => setForm(f => ({ ...f, [key]: e.target.checked }))} style={{ width: "auto", accentColor: "var(--accent)" }} />
                        {key}
                      </label>
                    : typeof val === "number"
                    ? <input style={inp} type="number" value={val} onChange={e => setForm(f => ({ ...f, [key]: Number(e.target.value) }))} />
                    : <input style={inp} value={String(val ?? "")} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} />
                  }
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", marginTop: 24 }}>
              <button onClick={() => setEditId(null)} style={{ padding: "7px 14px", background: "transparent", color: "var(--text-muted)", fontFamily: "'DM Mono', monospace", fontSize: 11, cursor: "pointer", border: "1px solid var(--border)" }}>Cancel</button>
              <button onClick={save} disabled={saving} style={{ padding: "10px 20px", background: "var(--accent)", color: "#0a0a0f", fontFamily: "'DM Mono', monospace", fontSize: 12, cursor: "pointer", border: "none" }}>{saving ? "Saving..." : "Save"}</button>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 1, background: "var(--border)" }}>
        {rows.length === 0 && <div style={{ background: "var(--surface)", padding: "48px 24px", textAlign: "center", fontFamily: "'DM Mono', monospace", fontSize: 12, color: "var(--text-muted)" }}>No humor mix records found</div>}
        {rows.map(row => (
          <div key={String(row.id)} style={{ background: "var(--surface)", padding: "24px 28px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "12px 28px", flex: 1 }}>
              {Object.entries(row).map(([k, v]) => (
                <div key={k}>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: "var(--text-dim)", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 3 }}>{k}</div>
                  <div style={{ fontSize: 12, color: "var(--text)" }}>{typeof v === "boolean" ? (v ? "✓ yes" : "✗ no") : v === null ? "—" : String(v).slice(0, 80)}</div>
                </div>
              ))}
            </div>
            <button onClick={() => { setEditId(String(row.id)); setForm({ ...row }); }}
              style={{ marginLeft: 24, padding: "7px 16px", background: "var(--surface2)", border: "1px solid var(--border)", color: "var(--text-muted)", fontFamily: "'DM Mono', monospace", fontSize: 11, cursor: "pointer", flexShrink: 0 }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.color = "var(--accent)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text-muted)"; }}>
              Edit
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
