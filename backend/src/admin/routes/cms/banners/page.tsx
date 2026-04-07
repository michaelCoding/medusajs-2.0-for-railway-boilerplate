import { useEffect, useRef, useState } from "react"
import CmsNav from "../../../components/cms-nav"

type Banner = {
  id: string
  key: string
  headline: string
  text: string
  cta_text: string
  cta_link: string
  image_url: string
}

const POSITIONS = [
  { value: "home",    label: "Home — Homepage banner" },
  { value: "store",   label: "Store — Shop page banner" },
  { value: "journal", label: "Journal — Blog page banner" },
]

const EMPTY: Omit<Banner, "id"> = {
  key: "", headline: "", text: "", cta_text: "", cta_link: "", image_url: "",
}

const getToken = () =>
  (window as any).__medusa_token__ ?? localStorage.getItem("medusa:token") ?? ""

async function uploadImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = async () => {
      try {
        const base64 = (reader.result as string).split(",")[1]
        const res = await fetch("/admin/cms/upload", {
          method: "POST",
          headers: { Authorization: `Bearer ${getToken()}`, "Content-Type": "application/json" },
          body: JSON.stringify({ filename: file.name, mimeType: file.type, data: base64 }),
        })
        if (!res.ok) throw new Error("Upload failed")
        resolve((await res.json()).url)
      } catch (e) { reject(e) }
    }
    reader.readAsDataURL(file)
  })
}

// ─── Inline styles ────────────────────────────────────────────────────────────
const inp: React.CSSProperties = {
  width: "100%", background: "#fafaf8", border: "1px solid #e8e4dc",
  borderRadius: 8, padding: "7px 12px", fontSize: 13, color: "#1c1c1a",
  outline: "none", boxSizing: "border-box",
}
const ta: React.CSSProperties = { ...inp, resize: "none" as const }

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontSize: 10, textTransform: "uppercase" as const, letterSpacing: "0.1em",
      color: "#9b9590", fontWeight: 600, marginBottom: 5 }}>
      {children}
    </p>
  )
}

// ─── Banner form (create or edit) ─────────────────────────────────────────────
function BannerForm({
  initial,
  onSave,
  onCancel,
  isCreate,
}: {
  initial: Omit<Banner, "id"> & { id?: string }
  onSave: (data: typeof initial) => Promise<void>
  onCancel: () => void
  isCreate?: boolean
}) {
  const [form, setForm] = useState(initial)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState("")
  const fileRef = useRef<HTMLInputElement>(null)

  const set = (field: string, val: string) =>
    setForm((p) => ({ ...p, [field]: val }))

  const handleImg = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try { set("image_url", await uploadImage(file)) }
    catch { alert("Image upload failed.") }
    finally { setUploading(false) }
  }

  const handleSave = async () => {
    if (!form.key.trim()) { setError("Key is required"); return }
    if (!form.headline.trim()) { setError("Headline is required"); return }
    setSaving(true); setError("")
    try { await onSave(form) }
    catch (e: any) { setError(e.message ?? "Save failed") }
    finally { setSaving(false) }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {error && (
        <p style={{ fontSize: 12, color: "#c0392b", padding: "6px 10px",
          background: "#fef0f0", borderRadius: 6 }}>{error}</p>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div>
          <FieldLabel>Position *</FieldLabel>
          {isCreate ? (
            <select style={{ ...inp, cursor: "pointer" }} value={form.key}
              onChange={(e) => set("key", e.target.value)}>
              <option value="">— select position —</option>
              {POSITIONS.map((p) => (
                <option key={p.value} value={p.value}>{p.label}</option>
              ))}
            </select>
          ) : (
            <div style={{ ...inp, color: "#6b6860", background: "#f5f3ef" }}>
              {POSITIONS.find((p) => p.value === form.key)?.label ?? form.key}
            </div>
          )}
        </div>
        <div>
          <FieldLabel>Headline *</FieldLabel>
          <input style={inp} value={form.headline}
            onChange={(e) => set("headline", e.target.value)}
            placeholder="Main banner heading" />
        </div>
      </div>

      <div>
        <FieldLabel>Body Text</FieldLabel>
        <textarea style={{ ...ta, minHeight: 64 }} value={form.text}
          onChange={(e) => set("text", e.target.value)}
          placeholder="Supporting text below the headline" rows={2} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div>
          <FieldLabel>CTA Button Text</FieldLabel>
          <input style={inp} value={form.cta_text}
            onChange={(e) => set("cta_text", e.target.value)}
            placeholder="e.g. Shop Now" />
        </div>
        <div>
          <FieldLabel>CTA Link</FieldLabel>
          <input style={inp} value={form.cta_link}
            onChange={(e) => set("cta_link", e.target.value)}
            placeholder="/collections/new-arrivals" />
        </div>
      </div>

      <div>
        <FieldLabel>Image</FieldLabel>
        {form.image_url && (
          <img src={form.image_url} alt="banner"
            style={{ width: "100%", maxHeight: 200, objectFit: "cover",
              borderRadius: 8, marginBottom: 8, display: "block" }} />
        )}
        <div style={{ display: "flex", gap: 8 }}>
          <input style={{ ...inp, flex: 1 }} value={form.image_url}
            onChange={(e) => set("image_url", e.target.value)}
            placeholder="Paste URL or upload below" />
          <button type="button" onClick={() => fileRef.current?.click()}
            disabled={uploading}
            style={{ padding: "7px 14px", borderRadius: 8, border: "1px solid #e0dcd4",
              background: "#fff", color: "#1c1c1a", fontSize: 12, cursor: "pointer",
              whiteSpace: "nowrap" }}>
            {uploading ? "Uploading…" : "↑ Upload"}
          </button>
        </div>
        <input ref={fileRef} type="file" accept="image/*"
          style={{ display: "none" }} onChange={handleImg} />
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, paddingTop: 4 }}>
        <button type="button" onClick={onCancel}
          style={{ padding: "6px 16px", borderRadius: 8, border: "1px solid #e0dcd4",
            background: "#fff", color: "#6b6860", fontSize: 13, cursor: "pointer" }}>
          Cancel
        </button>
        <button type="button" onClick={handleSave} disabled={saving}
          style={{ padding: "6px 16px", borderRadius: 8, border: "none",
            background: "#1c1c1a", color: "#fff", fontSize: 13, fontWeight: 500,
            cursor: "pointer", opacity: saving ? 0.5 : 1 }}>
          {saving ? "Saving…" : isCreate ? "Create Banner" : "Save Changes"}
        </button>
      </div>
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function BannersPage() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const load = () => {
    fetch("/admin/cms/banners", { headers: { Authorization: `Bearer ${getToken()}` } })
      .then((r) => r.json())
      .then(({ banners }) => { setBanners(banners ?? []); setLoading(false) })
      .catch(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleCreate = async (data: Omit<Banner, "id">) => {
    const res = await fetch("/admin/cms/banners", {
      method: "POST",
      headers: { Authorization: `Bearer ${getToken()}`, "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error((err as any).message ?? "Create failed")
    }
    setCreating(false)
    load()
  }

  const handleUpdate = async (id: string, data: Omit<Banner, "id">) => {
    const res = await fetch(`/admin/cms/banners/${id}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${getToken()}`, "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error((err as any).message ?? "Save failed")
    }
    setEditingId(null)
    load()
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this banner?")) return
    setDeletingId(id)
    try {
      await fetch(`/admin/cms/banners/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${getToken()}` },
      })
      load()
    } finally {
      setDeletingId(null)
    }
  }

  if (loading) {
    return (
      <div style={{ padding: 32, color: "#6b6860", fontSize: 13 }}>Loading…</div>
    )
  }

  return (
    <div style={{ fontFamily: "inherit" }}>
      <CmsNav />
      <div style={{ padding: "0 32px 32px", maxWidth: 900 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#1c1c1a", margin: 0 }}>Banners</h1>
          <p style={{ fontSize: 13, color: "#9b9590", marginTop: 4 }}>
            Manage promotional banners shown across the storefront
          </p>
        </div>
        {!creating && (
          <button type="button" onClick={() => setCreating(true)}
            style={{ padding: "7px 16px", borderRadius: 8, border: "none",
              background: "#1c1c1a", color: "#fff", fontSize: 13, fontWeight: 500, cursor: "pointer" }}>
            + New Banner
          </button>
        )}
      </div>

      {/* Create form */}
      {creating && (
        <div style={{ background: "#fff", border: "1px solid #e8e4dc", borderRadius: 12,
          padding: 24, marginBottom: 24 }}>
          <h2 style={{ fontSize: 14, fontWeight: 600, color: "#1c1c1a", marginBottom: 16 }}>
            New Banner
          </h2>
          <BannerForm
            initial={{ ...EMPTY }}
            onSave={handleCreate}
            onCancel={() => setCreating(false)}
            isCreate
          />
        </div>
      )}

      {/* Empty state */}
      {banners.length === 0 && !creating && (
        <div style={{ textAlign: "center", padding: "60px 24px", background: "#faf7f3",
          borderRadius: 12, border: "1px dashed #e0dcd4" }}>
          <p style={{ fontSize: 32, marginBottom: 12 }}>🖼</p>
          <p style={{ color: "#6b6860", fontSize: 14, marginBottom: 4 }}>No banners yet</p>
          <p style={{ color: "#9b9590", fontSize: 12 }}>
            Create your first banner to display promotions on the storefront
          </p>
        </div>
      )}

      {/* Banner list */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {banners.map((banner) => (
          <div key={banner.id}
            style={{ background: "#fff", border: "1px solid #e8e4dc", borderRadius: 12, overflow: "hidden" }}>

            {editingId === banner.id ? (
              <div style={{ padding: 24 }}>
                <h2 style={{ fontSize: 14, fontWeight: 600, color: "#1c1c1a", marginBottom: 16 }}>
                  Edit Banner
                </h2>
                <BannerForm
                  initial={{ ...banner }}
                  onSave={(data) => handleUpdate(banner.id, data)}
                  onCancel={() => setEditingId(null)}
                />
              </div>
            ) : (
              <div style={{ display: "flex", alignItems: "stretch" }}>
                {/* Image preview */}
                {banner.image_url ? (
                  <img src={banner.image_url} alt={banner.key}
                    style={{ width: 180, objectFit: "cover", flexShrink: 0 }} />
                ) : (
                  <div style={{ width: 180, background: "#f0ede6", display: "flex",
                    alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span style={{ fontSize: 28, opacity: 0.3 }}>🖼</span>
                  </div>
                )}

                {/* Info */}
                <div style={{ flex: 1, padding: "16px 20px", minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                    <code style={{ fontSize: 10, background: "#f0ede6", padding: "2px 7px",
                      borderRadius: 4, color: "#6b6860", fontFamily: "monospace" }}>
                      {banner.key}
                    </code>
                  </div>
                  <p style={{ fontSize: 15, fontWeight: 600, color: "#1c1c1a",
                    marginBottom: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {banner.headline || <span style={{ color: "#c0bbb4", fontStyle: "italic" }}>No headline</span>}
                  </p>
                  {banner.text && (
                    <p style={{ fontSize: 12, color: "#6b6860", marginBottom: 6,
                      overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {banner.text}
                    </p>
                  )}
                  {banner.cta_text && (
                    <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 20,
                      border: "1px solid #e0dcd4", color: "#9b9590" }}>
                      CTA: {banner.cta_text} → {banner.cta_link}
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div style={{ display: "flex", flexDirection: "column", justifyContent: "center",
                  gap: 6, padding: "16px 16px 16px 0", flexShrink: 0 }}>
                  <button type="button" onClick={() => setEditingId(banner.id)}
                    style={{ padding: "5px 14px", borderRadius: 8, border: "1px solid #e0dcd4",
                      background: "#fff", color: "#1c1c1a", fontSize: 12, cursor: "pointer" }}>
                    Edit
                  </button>
                  <button type="button"
                    onClick={() => handleDelete(banner.id)}
                    disabled={deletingId === banner.id}
                    style={{ padding: "5px 14px", borderRadius: 8, border: "1px solid #f5c6c6",
                      background: "#fff8f8", color: "#c0392b", fontSize: 12, cursor: "pointer",
                      opacity: deletingId === banner.id ? 0.5 : 1 }}>
                    {deletingId === banner.id ? "…" : "Delete"}
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      </div>
    </div>
  )
}
