"use client";
import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

interface Image {
  id: string;
  url: string;
  is_public: boolean;
  is_common_use: boolean;
  additional_context: string | null;
  image_description: string | null;
  created_datetime_utc: string;
  profile_id: string | null;
}

const supabase = createClient();

export default function ImagesPage() {
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Image>>({});
  const [showCreate, setShowCreate] = useState(false);
  const [createForm, setCreateForm] = useState({ url: "", is_public: true, is_common_use: false, additional_context: "", image_description: "" });
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const [search, setSearch] = useState("");

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchImages = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("images")
      .select("id, url, is_public, is_common_use, additional_context, image_description, created_datetime_utc, profile_id")
      .order("created_datetime_utc", { ascending: false });
    if (error) showToast(error.message, "error");
    else setImages(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchImages(); }, [fetchImages]);

  const handleCreate = async () => {
    if (!createForm.url.trim()) return showToast("URL is required", "error");
    setSaving(true);
    const { error } = await supabase.from("images").insert({
      url: createForm.url.trim(),
      is_public: createForm.is_public,
      is_common_use: createForm.is_common_use,
      additional_context: createForm.additional_context || null,
      image_description: createForm.image_description || null,
    });
    setSaving(false);
    if (error) return showToast(error.message, "error");
    showToast("Image created");
    setShowCreate(false);
    setCreateForm({ url: "", is_public: true, is_common_use: false, additional_context: "", image_description: "" });
    fetchImages();
  };

  const handleEdit = (img: Image) => {
    setEditingId(img.id);
    setEditForm({ url: img.url, is_public: img.is_public, is_common_use: img.is_common_use, additional_context: img.additional_context ?? "", image_description: img.image_description ?? "" });
  };

  const handleSave = async () => {
    if (!editingId) return;
    setSaving(true);
    const { error } = await supabase.from("images").update({
      url: editForm.url,
      is_public: editForm.is_public,
      is_common_use: editForm.is_common_use,
      additional_context: editForm.additional_context || null,
      image_description: editForm.image_description || null,
    }).eq("id", editingId);
    setSaving(false);
    if (error) return showToast(error.message, "error");
    showToast("Image updated");
    setEditingId(null);
    fetchImages();
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("images").delete().eq("id", id);
    if (error) return showToast(error.message, "error");
    showToast("Image deleted");
    setDeleteConfirm(null);
    fetchImages();
  };

  const filtered = images.filter(img =>
    img.url?.toLowerCase().includes(search.toLowerCase()) ||
    img.image_description?.toLowerCase().includes(search.toLowerCase())
  );

  const inputStyle = {
    background: "var(--surface2)",
    border: "1px solid var(--border)",
    color: "var(--text)",
    borderRadius: 4,
    padding: "8px 12px",
    fontSize: 13,
    width: "100%",
    outline: "none",
    fontFamily: "'DM Sans', sans-serif",
  };

  const btnStyle = (color: string, bg: string) => ({
    padding: "7px 14px",
    background: bg,
    color,
    border: "none",
    borderRadius: 3,
    fontFamily: "'DM Mono', monospace",
    fontSize: 11,
    cursor: "pointer",
    letterSpacing: "0.05em",
    transition: "opacity 0.15s",
  });

  return (
    <div>
      {/* Toast */}
      {toast && (
        <div style={{
          position: "fixed", top: 24, right: 24, zIndex: 1000,
          background: toast.type === "success" ? "rgba(0,212,170,0.15)" : "rgba(255,71,87,0.15)",
          border: `1px solid ${toast.type === "success" ? "var(--accent3)" : "var(--accent2)"}`,
          color: toast.type === "success" ? "var(--accent3)" : "var(--accent2)",
          padding: "12px 20px",
          fontFamily: "'DM Mono', monospace",
          fontSize: 12,
          borderRadius: 4,
        }}>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 32 }}>
        <div>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "var(--accent)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 8 }}>
            CRUD
          </div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 42, fontWeight: 900, color: "var(--text)", lineHeight: 1 }}>
            Images
          </h1>
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <input
            placeholder="Search images..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ ...inputStyle, width: 240 }}
          />
          <button
            onClick={() => setShowCreate(true)}
            style={{
              padding: "10px 20px",
              background: "var(--accent)",
              color: "#0a0a0f",
              fontFamily: "'DM Mono', monospace",
              fontSize: 12,
              fontWeight: 500,
              cursor: "pointer",
              border: "none",
              letterSpacing: "0.05em",
              whiteSpace: "nowrap",
            }}
          >
            + New Image
          </button>
        </div>
      </div>

      {/* Create modal */}
      {showCreate && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", zIndex: 200,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <div style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            padding: 40, width: 560,
            maxHeight: "90vh", overflowY: "auto",
          }}>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 700, marginBottom: 28 }}>
              Create Image
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "var(--text-muted)", letterSpacing: "0.1em", display: "block", marginBottom: 6 }}>URL *</label>
                <input style={inputStyle} value={createForm.url} onChange={e => setCreateForm(f => ({ ...f, url: e.target.value }))} placeholder="https://..." />
              </div>
              <div>
                <label style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "var(--text-muted)", letterSpacing: "0.1em", display: "block", marginBottom: 6 }}>Description</label>
                <textarea style={{ ...inputStyle, minHeight: 80, resize: "vertical" }} value={createForm.image_description} onChange={e => setCreateForm(f => ({ ...f, image_description: e.target.value }))} />
              </div>
              <div>
                <label style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "var(--text-muted)", letterSpacing: "0.1em", display: "block", marginBottom: 6 }}>Additional Context</label>
                <textarea style={{ ...inputStyle, minHeight: 60, resize: "vertical" }} value={createForm.additional_context} onChange={e => setCreateForm(f => ({ ...f, additional_context: e.target.value }))} />
              </div>
              <div style={{ display: "flex", gap: 24 }}>
                <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontFamily: "'DM Mono', monospace", fontSize: 12, color: "var(--text-muted)" }}>
                  <input type="checkbox" checked={createForm.is_public} onChange={e => setCreateForm(f => ({ ...f, is_public: e.target.checked }))} style={{ width: "auto", accentColor: "var(--accent)" }} />
                  Public
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontFamily: "'DM Mono', monospace", fontSize: 12, color: "var(--text-muted)" }}>
                  <input type="checkbox" checked={createForm.is_common_use} onChange={e => setCreateForm(f => ({ ...f, is_common_use: e.target.checked }))} style={{ width: "auto", accentColor: "var(--accent)" }} />
                  Common Use
                </label>
              </div>
              <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", marginTop: 8 }}>
                <button onClick={() => setShowCreate(false)} style={btnStyle("var(--text-muted)", "transparent")}>Cancel</button>
                <button onClick={handleCreate} disabled={saving} style={btnStyle("#0a0a0f", "var(--accent)")}>
                  {saving ? "Creating..." : "Create Image"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit modal */}
      {editingId && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", zIndex: 200,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <div style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            padding: 40, width: 560,
            maxHeight: "90vh", overflowY: "auto",
          }}>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 700, marginBottom: 28 }}>
              Edit Image
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "var(--text-muted)", letterSpacing: "0.1em", display: "block", marginBottom: 6 }}>URL</label>
                <input style={inputStyle} value={editForm.url ?? ""} onChange={e => setEditForm(f => ({ ...f, url: e.target.value }))} />
              </div>
              <div>
                <label style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "var(--text-muted)", letterSpacing: "0.1em", display: "block", marginBottom: 6 }}>Description</label>
                <textarea style={{ ...inputStyle, minHeight: 80, resize: "vertical" }} value={editForm.image_description ?? ""} onChange={e => setEditForm(f => ({ ...f, image_description: e.target.value }))} />
              </div>
              <div>
                <label style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "var(--text-muted)", letterSpacing: "0.1em", display: "block", marginBottom: 6 }}>Additional Context</label>
                <textarea style={{ ...inputStyle, minHeight: 60, resize: "vertical" }} value={editForm.additional_context ?? ""} onChange={e => setEditForm(f => ({ ...f, additional_context: e.target.value }))} />
              </div>
              <div style={{ display: "flex", gap: 24 }}>
                <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontFamily: "'DM Mono', monospace", fontSize: 12, color: "var(--text-muted)" }}>
                  <input type="checkbox" checked={editForm.is_public ?? false} onChange={e => setEditForm(f => ({ ...f, is_public: e.target.checked }))} style={{ width: "auto", accentColor: "var(--accent)" }} />
                  Public
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontFamily: "'DM Mono', monospace", fontSize: 12, color: "var(--text-muted)" }}>
                  <input type="checkbox" checked={editForm.is_common_use ?? false} onChange={e => setEditForm(f => ({ ...f, is_common_use: e.target.checked }))} style={{ width: "auto", accentColor: "var(--accent)" }} />
                  Common Use
                </label>
              </div>
              <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", marginTop: 8 }}>
                <button onClick={() => setEditingId(null)} style={btnStyle("var(--text-muted)", "transparent")}>Cancel</button>
                <button onClick={handleSave} disabled={saving} style={btnStyle("#0a0a0f", "var(--accent)")}>
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleteConfirm && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", zIndex: 200,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <div style={{ background: "var(--surface)", border: "1px solid var(--accent2)", padding: 40, width: 400, textAlign: "center" }}>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, marginBottom: 16 }}>
              Delete Image?
            </div>
            <p style={{ color: "var(--text-muted)", fontFamily: "'DM Mono', monospace", fontSize: 12, marginBottom: 28 }}>
              This action cannot be undone.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              <button onClick={() => setDeleteConfirm(null)} style={btnStyle("var(--text-muted)", "var(--surface2)")}>Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm)} style={btnStyle("#fff", "var(--accent2)")}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Images grid */}
      {loading ? (
        <div style={{ textAlign: "center", padding: 80, fontFamily: "'DM Mono', monospace", fontSize: 12, color: "var(--text-muted)" }}>
          Loading images...
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 1, background: "var(--border)" }}>
          {filtered.map(img => (
            <div key={img.id} style={{ background: "var(--surface)", padding: 0, overflow: "hidden" }}>
              {/* Image preview */}
              <div style={{
                height: 180,
                background: "var(--surface2)",
                overflow: "hidden",
                position: "relative",
              }}>
                {img.url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={img.url}
                    alt={img.image_description ?? ""}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
                  />
                ) : (
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "var(--text-dim)", fontFamily: "'DM Mono', monospace", fontSize: 11 }}>
                    No preview
                  </div>
                )}
                <div style={{ position: "absolute", top: 8, right: 8, display: "flex", gap: 4 }}>
                  {img.is_public && (
                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 8, padding: "2px 6px", background: "rgba(0,212,170,0.9)", color: "#0a0a0f", letterSpacing: "0.1em" }}>
                      PUBLIC
                    </span>
                  )}
                  {img.is_common_use && (
                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 8, padding: "2px 6px", background: "rgba(232,255,71,0.9)", color: "#0a0a0f", letterSpacing: "0.1em" }}>
                      COMMON
                    </span>
                  )}
                </div>
              </div>

              {/* Info */}
              <div style={{ padding: 16 }}>
                <div style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 10,
                  color: "var(--text-muted)",
                  marginBottom: 6,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}>
                  {img.url}
                </div>
                {img.image_description && (
                  <div style={{
                    fontSize: 12,
                    color: "var(--text-muted)",
                    marginBottom: 12,
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}>
                    {img.image_description}
                  </div>
                )}
                <div style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 10,
                  color: "var(--text-dim)",
                  marginBottom: 12,
                }}>
                  {new Date(img.created_datetime_utc).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </div>

                {/* Actions */}
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    onClick={() => handleEdit(img)}
                    style={{
                      flex: 1,
                      padding: "7px",
                      background: "var(--surface2)",
                      border: "1px solid var(--border)",
                      color: "var(--text-muted)",
                      fontFamily: "'DM Mono', monospace",
                      fontSize: 10,
                      cursor: "pointer",
                      letterSpacing: "0.1em",
                      transition: "all 0.15s",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.color = "var(--accent)"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text-muted)"; }}
                  >
                    EDIT
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(img.id)}
                    style={{
                      flex: 1,
                      padding: "7px",
                      background: "transparent",
                      border: "1px solid var(--border)",
                      color: "var(--text-dim)",
                      fontFamily: "'DM Mono', monospace",
                      fontSize: 10,
                      cursor: "pointer",
                      letterSpacing: "0.1em",
                      transition: "all 0.15s",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--accent2)"; e.currentTarget.style.color = "var(--accent2)"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text-dim)"; }}
                  >
                    DELETE
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: 80, fontFamily: "'DM Mono', monospace", fontSize: 12, color: "var(--text-muted)" }}>
          {search ? "No images match your search" : "No images yet — create one above"}
        </div>
      )}
    </div>
  );
}
