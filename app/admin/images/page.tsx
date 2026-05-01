"use client";
import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

interface Img {
  id: string;
  url: string;
  is_public: boolean;
  is_common_use: boolean;
  additional_context: string | null;
  image_description: string | null;
  created_datetime_utc: string;
}

const supabase = createClient();
const inp = { background: "var(--surface2)", border: "1px solid var(--border)", color: "var(--text)", borderRadius: 4, padding: "8px 12px", fontSize: 13, width: "100%", outline: "none", fontFamily: "'DM Sans', sans-serif" } as const;
const btnP = { padding: "10px 20px", background: "var(--accent)", color: "#0a0a0f", fontFamily: "'DM Mono', monospace", fontSize: 12, fontWeight: 500, cursor: "pointer", border: "none", letterSpacing: "0.05em" } as const;
const btnS = { padding: "7px 14px", background: "transparent", color: "var(--text-muted)", fontFamily: "'DM Mono', monospace", fontSize: 11, cursor: "pointer", border: "1px solid var(--border)" } as const;
const blank = { url: "", is_public: true, is_common_use: false, additional_context: "", image_description: "" };

export default function ImagesPage() {
  const [images, setImages] = useState<Img[]>([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(blank);
  const [showCreate, setShowCreate] = useState(false);
  const [cform, setCform] = useState(blank);
  const [saving, setSaving] = useState(false);
  const [delId, setDelId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);
  const [search, setSearch] = useState("");
  const [uploading, setUploading] = useState(false);

  const msg = (m: string, ok = true) => { setToast({ msg: m, ok }); setTimeout(() => setToast(null), 3500); };

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from("images").select("*").order("created_datetime_utc", { ascending: false });
    if (error) msg(error.message, false); else setImages(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const upload = async (file: File, set: (u: string) => void) => {
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `public/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("images").upload(path, file);
    if (error) { msg(error.message, false); setUploading(false); return; }
    const { data: { publicUrl } } = supabase.storage.from("images").getPublicUrl(path);
    set(publicUrl);
    msg("Uploaded — URL filled in");
    setUploading(false);
  };

  const create = async () => {
    if (!cform.url.trim()) return msg("URL required", false);
    setSaving(true);
    const { error } = await supabase.from("images").insert({ url: cform.url.trim(), is_public: cform.is_public, is_common_use: cform.is_common_use, additional_context: cform.additional_context || null, image_description: cform.image_description || null });
    setSaving(false);
    if (error) return msg(error.message, false);
    msg("Created"); setShowCreate(false); setCform(blank); load();
  };

  const save = async () => {
    if (!editId) return;
    setSaving(true);
    const { error } = await supabase.from("images").update({ url: form.url, is_public: form.is_public, is_common_use: form.is_common_use, additional_context: form.additional_context || null, image_description: form.image_description || null }).eq("id", editId);
    setSaving(false);
    if (error) return msg(error.message, false);
    msg("Saved"); setEditId(null); load();
  };

  const del = async (id: string) => {
    const { error } = await supabase.from("images").delete().eq("id", id);
    if (error) return msg(error.message, false);
    msg("Deleted"); setDelId(null); load();
  };

  const FormFields = ({ f, set }: { f: typeof blank; set: (x: typeof blank) => void }) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "var(--text-muted)", marginBottom: 6 }}>URL *</div>
        <input style={inp} value={f.url} onChange={e => set({ ...f, url: e.target.value })} placeholder="https://..." />
      </div>
      <div>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "var(--text-muted)", marginBottom: 6 }}>OR UPLOAD FILE</div>
        <label style={{ display: "block" }}>
          <input type="file" accept="image/*" style={{ display: "none" }} onChange={e => { if (e.target.files?.[0]) upload(e.target.files[0], u => set({ ...f, url: u })); }} />
          <span style={{ ...btnS, display: "block", textAlign: "center" as const, cursor: "pointer" }}>{uploading ? "Uploading..." : "📁 Choose File"}</span>
        </label>
      </div>
      <div>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "var(--text-muted)", marginBottom: 6 }}>Description</div>
        <textarea style={{ ...inp, minHeight: 70, resize: "vertical" as const }} value={f.image_description ?? ""} onChange={e => set({ ...f, image_description: e.target.value })} />
      </div>
      <div>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "var(--text-muted)", marginBottom: 6 }}>Additional Context</div>
        <textarea style={{ ...inp, minHeight: 50, resize: "vertical" as const }} value={f.additional_context ?? ""} onChange={e => set({ ...f, additional_context: e.target.value })} />
      </div>
      <div style={{ display: "flex", gap: 20 }}>
        {(["is_public", "is_common_use"] as const).map(k => (
          <label key={k} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontFamily: "'DM Mono', monospace", fontSize: 12, color: "var(--text-muted)" }}>
            <input type="checkbox" checked={f[k]} onChange={e => set({ ...f, [k]: e.target.checked })} style={{ width: "auto", accentColor: "var(--accent)" }} />
            {k === "is_public" ? "Public" : "Common Use"}
          </label>
        ))}
      </div>
    </div>
  );

  const filtered = images.filter(i => i.url?.toLowerCase().includes(search.toLowerCase()) || (i.image_description ?? "").toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      {toast && <div style={{ position: "fixed", top: 24, right: 24, zIndex: 1000, background: toast.ok ? "rgba(0,212,170,0.15)" : "rgba(255,71,87,0.15)", border: `1px solid ${toast.ok ? "var(--accent3)" : "var(--accent2)"}`, color: toast.ok ? "var(--accent3)" : "var(--accent2)", padding: "12px 20px", fontFamily: "'DM Mono', monospace", fontSize: 12, borderRadius: 4 }}>{toast.msg}</div>}

      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 32 }}>
        <div>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "var(--accent)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 8 }}>CRUD</div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 42, fontWeight: 900, color: "var(--text)", lineHeight: 1 }}>Images</h1>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} style={{ ...inp, width: 200 }} />
          <button onClick={() => { setCform(blank); setShowCreate(true); }} style={btnP}>+ New Image</button>
        </div>
      </div>

      {showCreate && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", padding: 40, width: 540, maxHeight: "90vh", overflowY: "auto" }}>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 700, marginBottom: 24, color: "var(--text)" }}>Create Image</div>
            <FormFields f={cform} set={setCform} />
            <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", marginTop: 24 }}>
              <button onClick={() => setShowCreate(false)} style={btnS}>Cancel</button>
              <button onClick={create} disabled={saving} style={btnP}>{saving ? "Creating..." : "Create"}</button>
            </div>
          </div>
        </div>
      )}

      {editId && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", padding: 40, width: 540, maxHeight: "90vh", overflowY: "auto" }}>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 700, marginBottom: 24, color: "var(--text)" }}>Edit Image</div>
            <FormFields f={form} set={setForm} />
            <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", marginTop: 24 }}>
              <button onClick={() => setEditId(null)} style={btnS}>Cancel</button>
              <button onClick={save} disabled={saving} style={btnP}>{saving ? "Saving..." : "Save"}</button>
            </div>
          </div>
        </div>
      )}

      {delId && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "var(--surface)", border: "1px solid var(--accent2)", padding: 40, width: 380, textAlign: "center" }}>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, marginBottom: 12, color: "var(--text)" }}>Delete Image?</div>
            <p style={{ color: "var(--text-muted)", fontFamily: "'DM Mono', monospace", fontSize: 12, marginBottom: 24 }}>This cannot be undone.</p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              <button onClick={() => setDelId(null)} style={btnS}>Cancel</button>
              <button onClick={() => del(delId)} style={{ ...btnS, background: "var(--accent2)", color: "#fff", border: "none" }}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: "center", padding: 80, fontFamily: "'DM Mono', monospace", fontSize: 12, color: "var(--text-muted)" }}>Loading...</div>
      ) : (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 1, background: "var(--border)" }}>
            {filtered.map(img => (
              <div key={img.id} style={{ background: "var(--surface)" }}>
                <div style={{ height: 160, background: "var(--surface2)", position: "relative", overflow: "hidden" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                  <div style={{ position: "absolute", top: 6, right: 6, display: "flex", gap: 3 }}>
                    {img.is_public && <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 8, padding: "2px 5px", background: "rgba(0,212,170,0.9)", color: "#000" }}>PUB</span>}
                    {img.is_common_use && <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 8, padding: "2px 5px", background: "rgba(232,255,71,0.9)", color: "#000" }}>COM</span>}
                  </div>
                </div>
                <div style={{ padding: 14 }}>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: "var(--text-muted)", marginBottom: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{img.url}</div>
                  {img.image_description && <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 8, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{img.image_description}</div>}
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: "var(--text-dim)", marginBottom: 10 }}>{new Date(img.created_datetime_utc).toLocaleDateString()}</div>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button onClick={() => { setEditId(img.id); setForm({ url: img.url, is_public: img.is_public, is_common_use: img.is_common_use, additional_context: img.additional_context ?? "", image_description: img.image_description ?? "" }); }}
                      style={{ flex: 1, padding: 6, background: "var(--surface2)", border: "1px solid var(--border)", color: "var(--text-muted)", fontFamily: "'DM Mono', monospace", fontSize: 9, cursor: "pointer" }}>EDIT</button>
                    <button onClick={() => setDelId(img.id)}
                      style={{ flex: 1, padding: 6, background: "transparent", border: "1px solid var(--border)", color: "var(--text-dim)", fontFamily: "'DM Mono', monospace", fontSize: 9, cursor: "pointer" }}>DEL</button>
                  </div>
                </div>
              </div>
            ))}
            {filtered.length === 0 && <div style={{ background: "var(--surface)", padding: "60px 24px", textAlign: "center", fontFamily: "'DM Mono', monospace", fontSize: 12, color: "var(--text-muted)", gridColumn: "1/-1" }}>No images yet — click + New Image to add one</div>}
          </div>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "var(--text-dim)", marginTop: 10 }}>{filtered.length} images</div>
        </>
      )}
    </div>
  );
}
