"use client";
import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();
const inputStyle = { background: "var(--surface2)", border: "1px solid var(--border)", color: "var(--text)", borderRadius: 4, padding: "8px 12px", fontSize: 13, width: "100%", outline: "none", fontFamily: "'DM Sans', sans-serif" } as const;
const btnPrimary = { padding: "10px 20px", background: "var(--accent)", color: "#0a0a0f", fontFamily: "'DM Mono', monospace", fontSize: 12, fontWeight: 500, cursor: "pointer", border: "none", letterSpacing: "0.05em", whiteSpace: "nowrap" } as const;
const btnSecondary = { padding: "7px 14px", background: "transparent", color: "var(--text-muted)", fontFamily: "'DM Mono', monospace", fontSize: 11, cursor: "pointer", border: "1px solid var(--border)", letterSpacing: "0.05em" } as const;
const btnDanger = { padding: "7px 14px", background: "var(--accent2)", color: "#fff", fontFamily: "'DM Mono', monospace", fontSize: 11, cursor: "pointer", border: "none", letterSpacing: "0.05em" } as const;

export interface FieldDef {
  key: string;
  label: string;
  type?: "text" | "textarea" | "boolean" | "number" | "select";
  options?: string[];
  readonly?: boolean;
  hidden?: boolean;
}

interface Props {
  title: string;
  table: string;
  fields: FieldDef[];
  orderBy?: string;
  orderAsc?: boolean;
  readOnly?: boolean;
  searchField?: string;
}

export default function CrudPage({ title, table, fields, orderBy = "id", orderAsc = false, readOnly = false, searchField }: Props) {
  const [rows, setRows] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Record<string, unknown>>({});
  const [showCreate, setShowCreate] = useState(false);
  const [createForm, setCreateForm] = useState<Record<string, unknown>>({});
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const [search, setSearch] = useState("");

  const editableFields = fields.filter(f => !f.readonly && !f.hidden);
  const displayFields = fields.filter(f => !f.hidden);

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchRows = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from(table).select("*").order(orderBy, { ascending: orderAsc });
    if (error) showToast(error.message, "error");
    else setRows(data ?? []);
    setLoading(false);
  }, [table, orderBy, orderAsc]);

  useEffect(() => { fetchRows(); }, [fetchRows]);

  const filtered = search && searchField
    ? rows.filter(r => String(r[searchField] ?? "").toLowerCase().includes(search.toLowerCase()))
    : rows;

  const initCreate = () => {
    const init: Record<string, unknown> = {};
    editableFields.forEach(f => { init[f.key] = f.type === "boolean" ? false : f.type === "number" ? 0 : ""; });
    setCreateForm(init);
    setShowCreate(true);
  };

  const handleCreate = async () => {
    setSaving(true);
    const { error } = await supabase.from(table).insert(createForm);
    setSaving(false);
    if (error) return showToast(error.message, "error");
    showToast(`${title} created`);
    setShowCreate(false);
    fetchRows();
  };

  const handleEdit = (row: Record<string, unknown>) => {
    setEditingId(String(row.id));
    const form: Record<string, unknown> = {};
    editableFields.forEach(f => { form[f.key] = row[f.key] ?? (f.type === "boolean" ? false : ""); });
    setEditForm(form);
  };

  const handleSave = async () => {
    if (!editingId) return;
    setSaving(true);
    const { error } = await supabase.from(table).update(editForm).eq("id", editingId);
    setSaving(false);
    if (error) return showToast(error.message, "error");
    showToast("Saved");
    setEditingId(null);
    fetchRows();
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from(table).delete().eq("id", id);
    if (error) return showToast(error.message, "error");
    showToast("Deleted");
    setDeleteConfirm(null);
    fetchRows();
  };

  const renderValue = (row: Record<string, unknown>, field: FieldDef) => {
    const val = row[field.key];
    if (field.type === "boolean") return (
      <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, padding: "2px 6px", background: val ? "rgba(232,255,71,0.1)" : "transparent", color: val ? "var(--accent)" : "var(--text-dim)", border: `1px solid ${val ? "rgba(232,255,71,0.3)" : "var(--border)"}` }}>
        {val ? "YES" : "NO"}
      </span>
    );
    if (val === null || val === undefined) return <span style={{ color: "var(--text-dim)" }}>—</span>;
    const str = String(val);
    return <span style={{ color: "var(--text)", fontSize: 12, fontFamily: field.type === "number" ? "'DM Mono', monospace" : undefined }}>{str.length > 60 ? str.slice(0, 60) + "…" : str}</span>;
  };

  const renderField = (field: FieldDef, val: unknown, onChange: (v: unknown) => void) => {
    if (field.type === "boolean") return (
      <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontFamily: "'DM Mono', monospace", fontSize: 12, color: "var(--text-muted)" }}>
        <input type="checkbox" checked={Boolean(val)} onChange={e => onChange(e.target.checked)} style={{ width: "auto", accentColor: "var(--accent)" }} />
        {field.label}
      </label>
    );
    if (field.type === "textarea") return <textarea style={{ ...inputStyle, minHeight: 80, resize: "vertical" }} value={String(val ?? "")} onChange={e => onChange(e.target.value)} />;
    if (field.type === "select" && field.options) return (
      <select style={inputStyle} value={String(val ?? "")} onChange={e => onChange(e.target.value)}>
        {field.options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    );
    return <input style={inputStyle} type={field.type === "number" ? "number" : "text"} value={String(val ?? "")} onChange={e => onChange(field.type === "number" ? Number(e.target.value) : e.target.value)} />;
  };

  const Modal = ({ title: t, form, setForm, onSave, onCancel, saveLabel }: { title: string; form: Record<string, unknown>; setForm: (f: Record<string, unknown>) => void; onSave: () => void; onCancel: () => void; saveLabel: string }) => (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", padding: 40, width: 560, maxHeight: "90vh", overflowY: "auto" }}>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 700, marginBottom: 28, color: "var(--text)" }}>{t}</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {editableFields.map(f => (
            <div key={f.key}>
              {f.type !== "boolean" && <label style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "var(--text-muted)", letterSpacing: "0.1em", display: "block", marginBottom: 6 }}>{f.label}</label>}
              {renderField(f, form[f.key], v => setForm({ ...form, [f.key]: v }))}
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", marginTop: 24 }}>
          <button onClick={onCancel} style={btnSecondary}>Cancel</button>
          <button onClick={onSave} disabled={saving} style={btnPrimary}>{saving ? "Saving..." : saveLabel}</button>
        </div>
      </div>
    </div>
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
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "var(--accent)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 8 }}>{readOnly ? "Read-Only" : "CRUD"}</div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 42, fontWeight: 900, color: "var(--text)", lineHeight: 1 }}>{title}</h1>
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          {searchField && <input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} style={{ ...inputStyle, width: 200 }} />}
          {!readOnly && <button onClick={initCreate} style={btnPrimary}>+ New</button>}
        </div>
      </div>

      {showCreate && <Modal title={`Create ${title}`} form={createForm} setForm={setCreateForm} onSave={handleCreate} onCancel={() => setShowCreate(false)} saveLabel="Create" />}
      {editingId && <Modal title={`Edit ${title}`} form={editForm} setForm={setEditForm} onSave={handleSave} onCancel={() => setEditingId(null)} saveLabel="Save Changes" />}

      {deleteConfirm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "var(--surface)", border: "1px solid var(--accent2)", padding: 40, width: 400, textAlign: "center" }}>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, marginBottom: 16, color: "var(--text)" }}>Delete?</div>
            <p style={{ color: "var(--text-muted)", fontFamily: "'DM Mono', monospace", fontSize: 12, marginBottom: 28 }}>This cannot be undone.</p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              <button onClick={() => setDeleteConfirm(null)} style={btnSecondary}>Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm)} style={btnDanger}>Delete</button>
            </div>
          </div>
        </div>
      )}

      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", overflowX: "auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: `${displayFields.map(() => "1fr").join(" ")} ${!readOnly ? "120px" : ""}`, padding: "12px 24px", borderBottom: "1px solid var(--border)", background: "var(--surface2)", minWidth: 600 }}>
          {displayFields.map(f => <div key={f.key} style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "var(--text-muted)", letterSpacing: "0.15em", textTransform: "uppercase" }}>{f.label}</div>)}
          {!readOnly && <div />}
        </div>
        {loading ? (
          <div style={{ padding: "48px 24px", textAlign: "center", fontFamily: "'DM Mono', monospace", fontSize: 12, color: "var(--text-muted)" }}>Loading...</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: "48px 24px", textAlign: "center", fontFamily: "'DM Mono', monospace", fontSize: 12, color: "var(--text-muted)" }}>No records found</div>
        ) : filtered.map((row, i) => (
          <div key={String(row.id ?? i)} style={{ display: "grid", gridTemplateColumns: `${displayFields.map(() => "1fr").join(" ")} ${!readOnly ? "120px" : ""}`, padding: "14px 24px", borderBottom: i < filtered.length - 1 ? "1px solid var(--border)" : "none", alignItems: "center", minWidth: 600 }}
            onMouseEnter={e => (e.currentTarget.style.background = "var(--surface2)")}
            onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
            {displayFields.map(f => <div key={f.key} style={{ paddingRight: 12 }}>{renderValue(row, f)}</div>)}
            {!readOnly && (
              <div style={{ display: "flex", gap: 6 }}>
                <button onClick={() => handleEdit(row)} style={{ ...btnSecondary, padding: "5px 10px", fontSize: 10 }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.color = "var(--accent)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text-muted)"; }}>
                  Edit
                </button>
                <button onClick={() => setDeleteConfirm(String(row.id))} style={{ ...btnSecondary, padding: "5px 10px", fontSize: 10 }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--accent2)"; e.currentTarget.style.color = "var(--accent2)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text-muted)"; }}>
                  Del
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "var(--text-dim)", marginTop: 12 }}>{filtered.length} records</div>
    </div>
  );
}
