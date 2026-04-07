import { useEffect, useRef, useState } from "react"
import CmsNav from "../../../components/cms-nav"

type Video = {
  id: string
  key: string
  url: string
  title: string
  text: string
  tag: string
  duration: string
  poster_url: string
}

const POSITIONS = [
  { value: "home",    label: "Home — Homepage video" },
  { value: "store",   label: "Store — Shop page video" },
  { value: "journal", label: "Journal — Blog page video" },
]

const EMPTY: Omit<Video, "id"> = {
  key: "", url: "", title: "", text: "", tag: "", duration: "", poster_url: "",
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

const inp: React.CSSProperties = {
  width: "100%", background: "#fafaf8", border: "1px solid #e8e4dc",
  borderRadius: 8, padding: "7px 12px", fontSize: 13, color: "#1c1c1a",
  outline: "none", boxSizing: "border-box",
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontSize: 10, textTransform: "uppercase" as const, letterSpacing: "0.1em",
      color: "#9b9590", fontWeight: 600, marginBottom: 5 }}>
      {children}
    </p>
  )
}

function VideoForm({
  initial,
  onSave,
  onCancel,
  isCreate,
}: {
  initial: Omit<Video, "id"> & { id?: string }
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
    try { set("poster_url", await uploadImage(file)) }
    catch { alert("Image upload failed.") }
    finally { setUploading(false) }
  }

  const handleSave = async () => {
    if (!form.key.trim()) { setError("Position is required"); return }
    if (!form.url.trim()) { setError("URL is required"); return }
    if (!form.title.trim()) { setError("Title is required"); return }
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
          <FieldLabel>Title *</FieldLabel>
          <input style={inp} value={form.title}
            onChange={(e) => set("title", e.target.value)}
            placeholder="Video title" />
        </div>
      </div>

      <div>
        <FieldLabel>Embed URL * (YouTube or Vimeo)</FieldLabel>
        <input style={inp} value={form.url}
          onChange={(e) => set("url", e.target.value)}
          placeholder="https://www.youtube.com/embed/..." />
      </div>

      <div>
        <FieldLabel>Description</FieldLabel>
        <input style={inp} value={form.text}
          onChange={(e) => set("text", e.target.value)}
          placeholder="Short description shown below the video" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div>
          <FieldLabel>Tag</FieldLabel>
          <input style={inp} value={form.tag}
            onChange={(e) => set("tag", e.target.value)}
            placeholder="e.g. Brand Film, Craft Story" />
        </div>
        <div>
          <FieldLabel>Duration</FieldLabel>
          <input style={inp} value={form.duration}
            onChange={(e) => set("duration", e.target.value)}
            placeholder="e.g. 3:42" />
        </div>
      </div>

      <div>
        <FieldLabel>Thumbnail (poster image)</FieldLabel>
        {form.poster_url && (
          <img src={form.poster_url} alt="thumbnail"
            style={{ width: "100%", maxHeight: 180, objectFit: "cover",
              borderRadius: 8, marginBottom: 8, display: "block" }} />
        )}
        <div style={{ display: "flex", gap: 8 }}>
          <input style={{ ...inp, flex: 1 }} value={form.poster_url}
            onChange={(e) => set("poster_url", e.target.value)}
            placeholder="Paste image URL or upload" />
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
          {saving ? "Saving…" : isCreate ? "Create Video" : "Save Changes"}
        </button>
      </div>
    </div>
  )
}

export default function VideosPage() {
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const load = () => {
    fetch("/admin/cms/videos", { headers: { Authorization: `Bearer ${getToken()}` } })
      .then((r) => r.json())
      .then(({ videos }) => { setVideos(videos ?? []); setLoading(false) })
      .catch(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleCreate = async (data: Omit<Video, "id">) => {
    const res = await fetch("/admin/cms/videos", {
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

  const handleUpdate = async (id: string, data: Omit<Video, "id">) => {
    const res = await fetch(`/admin/cms/videos/${id}`, {
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
    if (!confirm("Delete this video?")) return
    setDeletingId(id)
    try {
      await fetch(`/admin/cms/videos/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${getToken()}` },
      })
      load()
    } finally {
      setDeletingId(null)
    }
  }

  if (loading) {
    return <div style={{ padding: 32, color: "#6b6860", fontSize: 13 }}>Loading…</div>
  }

  return (
    <div style={{ fontFamily: "inherit" }}>
      <CmsNav />
      <div style={{ padding: "0 32px 32px", maxWidth: 900 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: "#1c1c1a", margin: 0 }}>Videos</h1>
            <p style={{ fontSize: 13, color: "#9b9590", marginTop: 4 }}>
              Manage videos shown across the storefront
            </p>
          </div>
          {!creating && (
            <button type="button" onClick={() => setCreating(true)}
              style={{ padding: "7px 16px", borderRadius: 8, border: "none",
                background: "#1c1c1a", color: "#fff", fontSize: 13, fontWeight: 500, cursor: "pointer" }}>
              + New Video
            </button>
          )}
        </div>

        {creating && (
          <div style={{ background: "#fff", border: "1px solid #e8e4dc", borderRadius: 12,
            padding: 24, marginBottom: 24 }}>
            <h2 style={{ fontSize: 14, fontWeight: 600, color: "#1c1c1a", marginBottom: 16 }}>New Video</h2>
            <VideoForm initial={{ ...EMPTY }} onSave={handleCreate} onCancel={() => setCreating(false)} isCreate />
          </div>
        )}

        {videos.length === 0 && !creating && (
          <div style={{ textAlign: "center", padding: "60px 24px", background: "#faf7f3",
            borderRadius: 12, border: "1px dashed #e0dcd4" }}>
            <p style={{ fontSize: 32, marginBottom: 12 }}>▶</p>
            <p style={{ color: "#6b6860", fontSize: 14, marginBottom: 4 }}>No videos yet</p>
            <p style={{ color: "#9b9590", fontSize: 12 }}>
              Add a video to display on the storefront
            </p>
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {videos.map((video) => (
            <div key={video.id}
              style={{ background: "#fff", border: "1px solid #e8e4dc", borderRadius: 12, overflow: "hidden" }}>

              {editingId === video.id ? (
                <div style={{ padding: 24 }}>
                  <h2 style={{ fontSize: 14, fontWeight: 600, color: "#1c1c1a", marginBottom: 16 }}>Edit Video</h2>
                  <VideoForm
                    initial={{ ...video }}
                    onSave={(data) => handleUpdate(video.id, data)}
                    onCancel={() => setEditingId(null)}
                  />
                </div>
              ) : (
                <div style={{ display: "flex", alignItems: "stretch" }}>
                  {/* Thumbnail */}
                  {video.poster_url ? (
                    <div style={{ width: 180, flexShrink: 0, position: "relative" }}>
                      <img src={video.poster_url} alt={video.title}
                        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                      <div style={{ position: "absolute", inset: 0, display: "flex",
                        alignItems: "center", justifyContent: "center",
                        background: "rgba(0,0,0,0.25)" }}>
                        <span style={{ fontSize: 28, color: "#fff", opacity: 0.9 }}>▶</span>
                      </div>
                    </div>
                  ) : (
                    <div style={{ width: 180, background: "#f0ede6", display: "flex",
                      alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <span style={{ fontSize: 28, opacity: 0.3 }}>▶</span>
                    </div>
                  )}

                  {/* Info */}
                  <div style={{ flex: 1, padding: "16px 20px", minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                      <code style={{ fontSize: 10, background: "#f0ede6", padding: "2px 7px",
                        borderRadius: 4, color: "#6b6860", fontFamily: "monospace" }}>
                        {video.key}
                      </code>
                      {video.tag && (
                        <span style={{ fontSize: 10, background: "#e8f4e8", padding: "2px 7px",
                          borderRadius: 4, color: "#4a7c4a" }}>{video.tag}</span>
                      )}
                      {video.duration && (
                        <span style={{ fontSize: 10, color: "#9b9590" }}>{video.duration}</span>
                      )}
                    </div>
                    <p style={{ fontSize: 15, fontWeight: 600, color: "#1c1c1a",
                      marginBottom: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {video.title || <span style={{ color: "#c0bbb4", fontStyle: "italic" }}>No title</span>}
                    </p>
                    {video.text && (
                      <p style={{ fontSize: 12, color: "#6b6860",
                        overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {video.text}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div style={{ display: "flex", flexDirection: "column", justifyContent: "center",
                    gap: 6, padding: "16px 16px 16px 0", flexShrink: 0 }}>
                    <button type="button" onClick={() => setEditingId(video.id)}
                      style={{ padding: "5px 14px", borderRadius: 8, border: "1px solid #e0dcd4",
                        background: "#fff", color: "#1c1c1a", fontSize: 12, cursor: "pointer" }}>
                      Edit
                    </button>
                    <button type="button" onClick={() => handleDelete(video.id)}
                      disabled={deletingId === video.id}
                      style={{ padding: "5px 14px", borderRadius: 8, border: "1px solid #f5c6c6",
                        background: "#fff8f8", color: "#c0392b", fontSize: 12, cursor: "pointer",
                        opacity: deletingId === video.id ? 0.5 : 1 }}>
                      {deletingId === video.id ? "…" : "Delete"}
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
