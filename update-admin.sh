#!/bin/bash
# Run this from inside your admin-panel project directory
set -e
echo "Applying admin panel updates..."

# ── captions ───────────────────────────────────────────────────────────────
cat > app/admin/captions/page.tsx << 'EOF'
import CrudPage from "@/components/CrudPage";
export default function Page() {
  return <CrudPage title="Captions" table="captions" readOnly searchField="content" fields={[
    { key: "id", label: "ID", readonly: true },
    { key: "content", label: "Content", type: "textarea" },
    { key: "like_count", label: "Likes", type: "number" },
    { key: "is_featured", label: "Featured", type: "boolean" },
    { key: "is_public", label: "Public", type: "boolean" },
    { key: "profile_id", label: "Profile ID" },
    { key: "image_id", label: "Image ID" },
    { key: "created_datetime_utc", label: "Created", readonly: true },
  ]} />;
}
EOF
echo "  ✓ captions"

# ── caption-requests ───────────────────────────────────────────────────────
cat > app/admin/caption-requests/page.tsx << 'EOF'
import CrudPage from "@/components/CrudPage";
export default function Page() {
  return <CrudPage title="Caption Requests" table="caption_requests" readOnly searchField="status" fields={[
    { key: "id", label: "ID" },
    { key: "profile_id", label: "Profile ID" },
    { key: "image_id", label: "Image ID" },
    { key: "status", label: "Status" },
    { key: "created_datetime_utc", label: "Created" },
  ]} />;
}
EOF
echo "  ✓ caption-requests"

# ── caption-examples ───────────────────────────────────────────────────────
cat > app/admin/caption-examples/page.tsx << 'EOF'
import CrudPage from "@/components/CrudPage";
export default function Page() {
  return <CrudPage title="Caption Examples" table="caption_examples" searchField="content" fields={[
    { key: "id", label: "ID", readonly: true },
    { key: "content", label: "Content", type: "textarea" },
    { key: "image_id", label: "Image ID" },
    { key: "humor_flavor_id", label: "Humor Flavor ID" },
    { key: "is_active", label: "Active", type: "boolean" },
    { key: "created_datetime_utc", label: "Created", readonly: true },
  ]} />;
}
EOF
echo "  ✓ caption-examples"

# ── terms ──────────────────────────────────────────────────────────────────
cat > app/admin/terms/page.tsx << 'EOF'
import CrudPage from "@/components/CrudPage";
export default function Page() {
  return <CrudPage title="Terms" table="terms" searchField="term" fields={[
    { key: "id", label: "ID", readonly: true },
    { key: "term", label: "Term" },
    { key: "definition", label: "Definition", type: "textarea" },
    { key: "is_active", label: "Active", type: "boolean" },
    { key: "created_datetime_utc", label: "Created", readonly: true },
  ]} />;
}
EOF
echo "  ✓ terms"

# ── humor-flavors ──────────────────────────────────────────────────────────
cat > app/admin/humor-flavors/page.tsx << 'EOF'
import CrudPage from "@/components/CrudPage";
export default function Page() {
  return <CrudPage title="Humor Flavors" table="humor_flavors" readOnly searchField="name" fields={[
    { key: "id", label: "ID" },
    { key: "name", label: "Name" },
    { key: "description", label: "Description" },
    { key: "is_active", label: "Active", type: "boolean" },
    { key: "created_datetime_utc", label: "Created" },
  ]} />;
}
EOF
echo "  ✓ humor-flavors"

# ── humor-flavor-steps ─────────────────────────────────────────────────────
cat > app/admin/humor-flavor-steps/page.tsx << 'EOF'
import CrudPage from "@/components/CrudPage";
export default function Page() {
  return <CrudPage title="Humor Flavor Steps" table="humor_flavor_steps" readOnly fields={[
    { key: "id", label: "ID" },
    { key: "humor_flavor_id", label: "Flavor ID" },
    { key: "step_number", label: "Step #" },
    { key: "instruction", label: "Instruction" },
    { key: "created_datetime_utc", label: "Created" },
  ]} />;
}
EOF
echo "  ✓ humor-flavor-steps"

# ── humor-mix ──────────────────────────────────────────────────────────────
# (already has a custom read/update page — no change needed)
echo "  ✓ humor-mix (no change)"

# ── llm-providers ──────────────────────────────────────────────────────────
cat > app/admin/llm-providers/page.tsx << 'EOF'
import CrudPage from "@/components/CrudPage";
export default function Page() {
  return <CrudPage title="LLM Providers" table="llm_providers" searchField="name" fields={[
    { key: "id", label: "ID", readonly: true },
    { key: "name", label: "Name" },
    { key: "api_base_url", label: "API Base URL" },
    { key: "is_active", label: "Active", type: "boolean" },
    { key: "created_datetime_utc", label: "Created", readonly: true },
  ]} />;
}
EOF
echo "  ✓ llm-providers"

# ── llm-models ─────────────────────────────────────────────────────────────
cat > app/admin/llm-models/page.tsx << 'EOF'
import CrudPage from "@/components/CrudPage";
export default function Page() {
  return <CrudPage title="LLM Models" table="llm_models" searchField="name" fields={[
    { key: "id", label: "ID", readonly: true },
    { key: "name", label: "Name" },
    { key: "llm_provider_id", label: "Provider ID" },
    { key: "model_string", label: "Model String" },
    { key: "is_active", label: "Active", type: "boolean" },
    { key: "max_tokens", label: "Max Tokens", type: "number" },
    { key: "created_datetime_utc", label: "Created", readonly: true },
  ]} />;
}
EOF
echo "  ✓ llm-models"

# ── llm-prompt-chains ──────────────────────────────────────────────────────
cat > app/admin/llm-prompt-chains/page.tsx << 'EOF'
import CrudPage from "@/components/CrudPage";
export default function Page() {
  return <CrudPage title="LLM Prompt Chains" table="llm_prompt_chains" readOnly searchField="name" fields={[
    { key: "id", label: "ID" },
    { key: "name", label: "Name" },
    { key: "description", label: "Description" },
    { key: "is_active", label: "Active", type: "boolean" },
    { key: "created_datetime_utc", label: "Created" },
  ]} />;
}
EOF
echo "  ✓ llm-prompt-chains"

# ── llm-responses ──────────────────────────────────────────────────────────
cat > app/admin/llm-responses/page.tsx << 'EOF'
import CrudPage from "@/components/CrudPage";
export default function Page() {
  return <CrudPage title="LLM Responses" table="llm_responses" readOnly fields={[
    { key: "id", label: "ID" },
    { key: "llm_model_id", label: "Model ID" },
    { key: "prompt_chain_id", label: "Chain ID" },
    { key: "input_tokens", label: "Input Tokens", type: "number" },
    { key: "output_tokens", label: "Output Tokens", type: "number" },
    { key: "response_text", label: "Response" },
    { key: "created_datetime_utc", label: "Created" },
  ]} />;
}
EOF
echo "  ✓ llm-responses"

# ── allowed-domains ────────────────────────────────────────────────────────
cat > app/admin/allowed-domains/page.tsx << 'EOF'
import CrudPage from "@/components/CrudPage";
export default function Page() {
  return <CrudPage title="Allowed Signup Domains" table="allowed_signup_domains" searchField="domain" fields={[
    { key: "id", label: "ID", readonly: true },
    { key: "domain", label: "Domain" },
    { key: "is_active", label: "Active", type: "boolean" },
    { key: "created_datetime_utc", label: "Created", readonly: true },
  ]} />;
}
EOF
echo "  ✓ allowed-domains"

# ── whitelisted-emails ─────────────────────────────────────────────────────
cat > app/admin/whitelisted-emails/page.tsx << 'EOF'
import CrudPage from "@/components/CrudPage";
export default function Page() {
  return <CrudPage title="Whitelisted Emails" table="whitelisted_emails" searchField="email" fields={[
    { key: "id", label: "ID", readonly: true },
    { key: "email", label: "Email" },
    { key: "is_active", label: "Active", type: "boolean" },
    { key: "created_datetime_utc", label: "Created", readonly: true },
  ]} />;
}
EOF
echo "  ✓ whitelisted-emails"

# ── images (with file upload support) ─────────────────────────────────────
cat > app/admin/images/page.tsx << 'EOF'
"use client";
import { useState, useEffect, useCallback, useRef } from "react";
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
const inputStyle = { background: "var(--surface2)", border: "1px solid var(--border)", color: "var(--text)", borderRadius: 4, padding: "8px 12px", fontSize: 13, width: "100%", outline: "none", fontFamily: "'DM Sans', sans-serif" } as const;
const btnPrimary = { padding: "10px 20px", background: "var(--accent)", color: "#0a0a0f", fontFamily: "'DM Mono', monospace", fontSize: 12, fontWeight: 500, cursor: "pointer", border: "none", letterSpacing: "0.05em", whiteSpace: "nowrap" } as const;
const btnSecondary = { padding: "7px 14px", background: "transparent", color: "var(--text-muted)", fontFamily: "'DM Mono', monospace", fontSize: 11, cursor: "pointer", border: "1px solid var(--border)", letterSpacing: "0.05em" } as const;

type FormState = { url: string; is_public: boolean; is_common_use: boolean; additional_context: string; image_description: string };
const emptyForm: FormState = { url: "", is_public: true, is_common_use: false, additional_context: "", image_description: "" };

export default function ImagesPage() {
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<FormState>(emptyForm);
  const [showCreate, setShowCreate] = useState(false);
  const [createForm, setCreateForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const [search, setSearch] = useState("");
  const [uploading, setUploading] = useState(false);
  const createFileRef = useRef<HTMLInputElement>(null);
  const editFileRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchImages = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from("images").select("*").order("created_datetime_utc", { ascending: false });
    if (error) showToast(error.message, "error");
    else setImages(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchImages(); }, [fetchImages]);

  const handleUpload = async (file: File, onDone: (url: string) => void) => {
    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `public/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error: uploadError } = await supabase.storage.from("images").upload(path, file);
      if (uploadError) { showToast(uploadError.message, "error"); setUploading(false); return; }
      const { data: { publicUrl } } = supabase.storage.from("images").getPublicUrl(path);
      onDone(publicUrl);
      showToast("File uploaded — URL filled in");
    } catch (e) {
      showToast(String(e), "error");
    }
    setUploading(false);
  };

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
    setCreateForm(emptyForm);
    fetchImages();
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
    showToast("Deleted");
    setDeleteConfirm(null);
    fetchImages();
  };

  const Fields = ({ form, setForm, fileRef }: { form: FormState; setForm: (f: FormState) => void; fileRef: React.RefObject<HTMLInputElement | null> }) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div>
        <label style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "var(--text-muted)", letterSpacing: "0.1em", display: "block", marginBottom: 6 }}>URL *</label>
        <input style={inputStyle} value={form.url} onChange={e => setForm({ ...form, url: e.target.value })} placeholder="https://..." />
      </div>
      <div>
        <label style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "var(--text-muted)", letterSpacing: "0.1em", display: "block", marginBottom: 6 }}>OR UPLOAD A FILE</label>
        <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={e => { if (e.target.files?.[0]) handleUpload(e.target.files[0], url => setForm({ ...form, url })); }} />
        <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading} style={{ ...btnSecondary, width: "100%", textAlign: "center" }}>
          {uploading ? "Uploading..." : "📁  Choose File to Upload"}
        </button>
      </div>
      <div>
        <label style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "var(--text-muted)", letterSpacing: "0.1em", display: "block", marginBottom: 6 }}>Description</label>
        <textarea style={{ ...inputStyle, minHeight: 70, resize: "vertical" }} value={form.image_description} onChange={e => setForm({ ...form, image_description: e.target.value })} />
      </div>
      <div>
        <label style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "var(--text-muted)", letterSpacing: "0.1em", display: "block", marginBottom: 6 }}>Additional Context</label>
        <textarea style={{ ...inputStyle, minHeight: 60, resize: "vertical" }} value={form.additional_context} onChange={e => setForm({ ...form, additional_context: e.target.value })} />
      </div>
      <div style={{ display: "flex", gap: 24 }}>
        {(["is_public", "is_common_use"] as const).map(key => (
          <label key={key} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontFamily: "'DM Mono', monospace", fontSize: 12, color: "var(--text-muted)" }}>
            <input type="checkbox" checked={form[key]} onChange={e => setForm({ ...form, [key]: e.target.checked })} style={{ width: "auto", accentColor: "var(--accent)" }} />
            {key === "is_public" ? "Public" : "Common Use"}
          </label>
        ))}
      </div>
    </div>
  );

  const filtered = images.filter(img =>
    img.url.toLowerCase().includes(search.toLowerCase()) ||
    (img.image_description ?? "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      {toast && (
        <div style={{ position: "fixed", top: 24, right: 24, zIndex: 1000, background: toast.type === "success" ? "rgba(0,212,170,0.15)" : "rgba(255,71,87,0.15)", border: `1px solid ${toast.type === "success" ? "var(--accent3)" : "var(--accent2)"}`, color: toast.type === "success" ? "var(--accent3)" : "var(--accent2)", padding: "12px 20px", fontFamily: "'DM Mono', monospace", fontSize: 12, borderRadius: 4 }}>
          {toast.msg}
        </div>
      )}

      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 32 }}>
        <div>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "var(--accent)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 8 }}>CRUD</div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 42, fontWeight: 900, color: "var(--text)", lineHeight: 1 }}>Images</h1>
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <input placeholder="Search images..." value={search} onChange={e => setSearch(e.target.value)} style={{ ...inputStyle, width: 220 }} />
          <button onClick={() => { setCreateForm(emptyForm); setShowCreate(true); }} style={btnPrimary}>+ New Image</button>
        </div>
      </div>

      {showCreate && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", padding: 40, width: 560, maxHeight: "90vh", overflowY: "auto" }}>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 700, marginBottom: 28, color: "var(--text)" }}>Create Image</div>
            <Fields form={createForm} setForm={setCreateForm} fileRef={createFileRef} />
            <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", marginTop: 24 }}>
              <button onClick={() => setShowCreate(false)} style={btnSecondary}>Cancel</button>
              <button onClick={handleCreate} disabled={saving} style={btnPrimary}>{saving ? "Creating..." : "Create Image"}</button>
            </div>
          </div>
        </div>
      )}

      {editingId && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", padding: 40, width: 560, maxHeight: "90vh", overflowY: "auto" }}>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 700, marginBottom: 28, color: "var(--text)" }}>Edit Image</div>
            <Fields form={editForm} setForm={setEditForm} fileRef={editFileRef} />
            <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", marginTop: 24 }}>
              <button onClick={() => setEditingId(null)} style={btnSecondary}>Cancel</button>
              <button onClick={handleSave} disabled={saving} style={btnPrimary}>{saving ? "Saving..." : "Save Changes"}</button>
            </div>
          </div>
        </div>
      )}

      {deleteConfirm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "var(--surface)", border: "1px solid var(--accent2)", padding: 40, width: 400, textAlign: "center" }}>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, marginBottom: 16, color: "var(--text)" }}>Delete Image?</div>
            <p style={{ color: "var(--text-muted)", fontFamily: "'DM Mono', monospace", fontSize: 12, marginBottom: 28 }}>This cannot be undone.</p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              <button onClick={() => setDeleteConfirm(null)} style={btnSecondary}>Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm)} style={{ ...btnSecondary, background: "var(--accent2)", color: "#fff", border: "none" }}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: "center", padding: 80, fontFamily: "'DM Mono', monospace", fontSize: 12, color: "var(--text-muted)" }}>Loading images...</div>
      ) : (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 1, background: "var(--border)" }}>
            {filtered.map(img => (
              <div key={img.id} style={{ background: "var(--surface)", overflow: "hidden" }}>
                <div style={{ height: 180, background: "var(--surface2)", overflow: "hidden", position: "relative" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.url} alt={img.image_description ?? ""} style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                  <div style={{ position: "absolute", top: 8, right: 8, display: "flex", gap: 4 }}>
                    {img.is_public && <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 8, padding: "2px 6px", background: "rgba(0,212,170,0.9)", color: "#0a0a0f" }}>PUBLIC</span>}
                    {img.is_common_use && <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 8, padding: "2px 6px", background: "rgba(232,255,71,0.9)", color: "#0a0a0f" }}>COMMON</span>}
                  </div>
                </div>
                <div style={{ padding: 16 }}>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "var(--text-muted)", marginBottom: 6, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{img.url}</div>
                  {img.image_description && <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 10, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{img.image_description}</div>}
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "var(--text-dim)", marginBottom: 12 }}>
                    {new Date(img.created_datetime_utc).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      onClick={() => { setEditingId(img.id); setEditForm({ url: img.url, is_public: img.is_public, is_common_use: img.is_common_use, additional_context: img.additional_context ?? "", image_description: img.image_description ?? "" }); }}
                      style={{ flex: 1, padding: "7px", background: "var(--surface2)", border: "1px solid var(--border)", color: "var(--text-muted)", fontFamily: "'DM Mono', monospace", fontSize: 10, cursor: "pointer", transition: "all 0.15s" }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.color = "var(--accent)"; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text-muted)"; }}>
                      EDIT
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(img.id)}
                      style={{ flex: 1, padding: "7px", background: "transparent", border: "1px solid var(--border)", color: "var(--text-dim)", fontFamily: "'DM Mono', monospace", fontSize: 10, cursor: "pointer", transition: "all 0.15s" }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--accent2)"; e.currentTarget.style.color = "var(--accent2)"; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text-dim)"; }}>
                      DELETE
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <div style={{ background: "var(--surface)", padding: "80px 24px", textAlign: "center", fontFamily: "'DM Mono', monospace", fontSize: 12, color: "var(--text-muted)", gridColumn: "1/-1" }}>
                {search ? "No images match your search" : "No images yet — create one above"}
              </div>
            )}
          </div>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "var(--text-dim)", marginTop: 12 }}>{filtered.length} images</div>
        </>
      )}
    </div>
  );
}
EOF
echo "  ✓ images (with file upload)"

# ── commit and push ────────────────────────────────────────────────────────
git add -A
git commit -m "feat: expand admin to all required tables with image upload support"
git push

echo ""
echo "✅ Done! Vercel will redeploy automatically."
