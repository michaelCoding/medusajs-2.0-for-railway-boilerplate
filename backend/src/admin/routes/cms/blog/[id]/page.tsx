import { useEffect, useRef, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import RichTextEditor from "../../../../components/rich-text-editor"

const isNew = (id: string) => id === "new"

const getToken = () =>
  (window as any).__medusa_token__ ?? localStorage.getItem("medusa:token") ?? ""

async function uploadFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = async () => {
      try {
        const base64 = (reader.result as string).split(",")[1]
        const res = await fetch("/admin/cms/upload", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${getToken()}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ filename: file.name, mimeType: file.type, data: base64 }),
        })
        if (!res.ok) throw new Error("Upload failed")
        const { url } = await res.json()
        resolve(url)
      } catch (e) {
        reject(e)
      }
    }
    reader.readAsDataURL(file)
  })
}

// ─── Shared input style ───────────────────────────────────────────────────────
const inp: React.CSSProperties = {
  width: "100%",
  background: "#fafaf8",
  border: "1px solid #e8e4dc",
  borderRadius: 8,
  padding: "7px 12px",
  fontSize: 13,
  color: "#1c1c1a",
  outline: "none",
  boxSizing: "border-box",
}

const ta: React.CSSProperties = { ...inp, resize: "none" as const }

// ─── Sidebar section label ────────────────────────────────────────────────────
function Label({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontSize: 10, textTransform: "uppercase" as const, letterSpacing: "0.1em",
      color: "#9b9590", fontWeight: 600, marginBottom: 6 }}>
      {children}
    </p>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <Label>{label}</Label>
      {children}
    </div>
  )
}

function Divider() {
  return <div style={{ height: 1, background: "#ede9e2", margin: "16px 0" }} />
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function BlogEditPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(!isNew(id!))
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [coverUploading, setCoverUploading] = useState(false)
  const [tagInput, setTagInput] = useState("")

  const [form, setForm] = useState({
    title: "",
    slug: "",
    excerpt: "",
    author: "",
    content: "",
    status: "draft" as "draft" | "published",
    cover_image_url: "",
    tags: [] as string[],
  })

  const coverRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isNew(id!)) return
    fetch(`/admin/cms/blog-posts/${id}`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    })
      .then((r) => r.json())
      .then(({ post }) => {
        setForm({
          title: post.title ?? "",
          slug: post.slug ?? "",
          excerpt: post.excerpt ?? "",
          author: post.author ?? "",
          content: post.content ?? "",
          status: post.status ?? "draft",
          cover_image_url: post.cover_image_url ?? "",
          tags: Array.isArray(post.tags) ? post.tags : [],
        })
        setLoading(false)
      })
  }, [id])

  const set = (field: string, value: any) =>
    setForm((prev) => {
      const next = { ...prev, [field]: value }
      if (field === "title" && isNew(id!)) {
        next.slug = value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")
      }
      return next
    })

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setCoverUploading(true)
    try {
      set("cover_image_url", await uploadFile(file))
    } catch {
      alert("Cover image upload failed.")
    } finally {
      setCoverUploading(false)
    }
  }

  const addTag = () => {
    const t = tagInput.trim()
    if (!t || form.tags.includes(t)) return
    set("tags", [...form.tags, t])
    setTagInput("")
  }

  const handleSave = async (publishNow?: boolean) => {
    setSaving(true)
    setSaveError(null)
    const payload = { ...form, ...(publishNow ? { status: "published" } : {}) }
    try {
      const method = isNew(id!) ? "POST" : "PUT"
      const url = isNew(id!) ? "/admin/cms/blog-posts" : `/admin/cms/blog-posts/${id}`
      const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${getToken()}`, "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        setSaveError((err as any).message ?? "Save failed.")
        return
      }
      navigate("/cms/blog")
    } catch {
      setSaveError("Save failed.")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div style={{ display:"flex",alignItems:"center",justifyContent:"center",
        minHeight:"100vh",background:"#f7f4ef" }}>
        <div style={{ display:"flex",gap:6 }}>
          {[0,1,2].map((i) => (
            <div key={i} style={{ width:6,height:6,borderRadius:"50%",background:"#c0bbb4",
              animation:"bounce 0.8s infinite",animationDelay:`${i*0.15}s` }} />
          ))}
        </div>
      </div>
    )
  }

  const isPublished = form.status === "published"

  return (
    <div style={{ minHeight:"100vh",background:"#f7f4ef",color:"#1c1c1a",fontFamily:"inherit" }}>
      {/* ── Top bar ── */}
      <header style={{ position:"sticky",top:0,zIndex:40,display:"flex",alignItems:"center",
        justifyContent:"space-between",padding:"0 24px",height:56,
        background:"rgba(247,244,239,0.92)",backdropFilter:"blur(8px)",
        borderBottom:"1px solid #e8e4dc" }}>

        <button type="button" onClick={() => navigate("/cms/blog")}
          style={{ display:"flex",alignItems:"center",gap:6,fontSize:13,color:"#6b6860",
            background:"none",border:"none",cursor:"pointer",padding:0 }}>
          <span style={{ fontSize:16 }}>←</span> Journal
        </button>

        <div style={{ display:"flex",alignItems:"center",gap:8 }}>
          <span style={{ padding:"3px 10px",borderRadius:20,fontSize:11,fontWeight:500,
            background: isPublished ? "#e6f4ea" : "#f0ede6",
            color: isPublished ? "#2d7a3a" : "#9b9590",
            border: `1px solid ${isPublished ? "#b8dfc0" : "#e0dcd4"}` }}>
            {isPublished ? "● Published" : "○ Draft"}
          </span>

          {saveError && (
            <span style={{ fontSize:12,color:"#c0392b",maxWidth:240 }}>{saveError}</span>
          )}

          <button type="button" onClick={() => navigate("/cms/blog")}
            style={{ padding:"5px 14px",fontSize:13,color:"#6b6860",background:"#fff",
              border:"1px solid #e0dcd4",borderRadius:8,cursor:"pointer" }}>
            Discard
          </button>

          <button type="button" onClick={() => handleSave()} disabled={saving}
            style={{ padding:"5px 14px",fontSize:13,color:"#1c1c1a",background:"#fff",
              border:"1px solid #d0ccc4",borderRadius:8,cursor:"pointer",opacity:saving?0.5:1 }}>
            {saving ? "Saving…" : "Save Draft"}
          </button>

          {!isPublished && (
            <button type="button" onClick={() => handleSave(true)} disabled={saving}
              style={{ padding:"5px 14px",fontSize:13,color:"#fff",background:"#1c1c1a",
                border:"none",borderRadius:8,cursor:"pointer",fontWeight:500,opacity:saving?0.5:1 }}>
              Publish
            </button>
          )}
        </div>
      </header>

      {/* ── Body ── */}
      <div style={{ display:"flex" }}>

        {/* ── Main column ── */}
        <main style={{ flex:1,minWidth:0,padding:"32px",maxWidth:780 }}>

          {/* Cover image */}
          <div
            onClick={() => coverRef.current?.click()}
            style={{ position:"relative",width:"100%",aspectRatio:"16/6",marginBottom:32,
              borderRadius:12,overflow:"hidden",background:"#ede9e2",
              border:"1px solid #e0dcd4",cursor:"pointer" }}>
            {form.cover_image_url ? (
              <>
                <img src={form.cover_image_url} alt="Cover"
                  style={{ position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover" }} />
                <div style={{ position:"absolute",inset:0,background:"rgba(0,0,0,0)",
                  display:"flex",alignItems:"center",justifyContent:"center",
                  transition:"background 0.2s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(0,0,0,0.25)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(0,0,0,0)")}>
                  <span style={{ color:"#fff",fontSize:12,fontWeight:500,padding:"4px 10px",
                    background:"rgba(0,0,0,0.5)",borderRadius:6,opacity:0,transition:"opacity 0.2s" }}
                    onMouseEnter={(e) => (e.currentTarget.style.opacity="1")}
                    onMouseLeave={(e) => (e.currentTarget.style.opacity="0")}>
                    Change cover
                  </span>
                </div>
              </>
            ) : (
              <div style={{ position:"absolute",inset:0,display:"flex",flexDirection:"column",
                alignItems:"center",justifyContent:"center",gap:8 }}>
                {coverUploading ? (
                  <span style={{ fontSize:13,color:"#9b9590" }}>Uploading…</span>
                ) : (
                  <>
                    <span style={{ fontSize:24,opacity:0.3 }}>🖼</span>
                    <span style={{ fontSize:12,color:"#a0988e" }}>Click to add cover image</span>
                  </>
                )}
              </div>
            )}
            <input ref={coverRef} type="file" accept="image/*"
              style={{ display:"none" }} onChange={handleCoverUpload} />
          </div>

          {/* Title */}
          <input
            style={{ width:"100%",background:"transparent",border:"none",outline:"none",
              fontSize:28,fontWeight:700,color:"#1c1c1a",letterSpacing:"-0.02em",
              marginBottom:4,padding:0,fontFamily:"inherit" }}
            placeholder="Article title…"
            value={form.title}
            onChange={(e) => set("title", e.target.value)}
          />

          {/* Slug */}
          <div style={{ display:"flex",alignItems:"center",gap:4,marginBottom:28 }}>
            <span style={{ fontSize:12,color:"#b0a89e" }}>/blog/</span>
            <input
              style={{ fontSize:12,color:"#9b9590",background:"transparent",border:"none",
                outline:"none",borderBottom:"1px solid transparent",padding:"1px 0",
                fontFamily:"inherit" }}
              value={form.slug}
              onChange={(e) => set("slug", e.target.value)}
              placeholder="post-slug"
              onFocus={(e) => (e.currentTarget.style.borderBottomColor = "#e0dcd4")}
              onBlur={(e) => (e.currentTarget.style.borderBottomColor = "transparent")}
            />
          </div>

          {/* Rich text editor */}
          <RichTextEditor
            value={form.content}
            onChange={(html) => set("content", html)}
            placeholder="Begin writing your article…"
          />
        </main>

        {/* ── Sidebar ── */}
        <aside style={{ width:260,flexShrink:0,borderLeft:"1px solid #e8e4dc",
          padding:"28px 20px",position:"sticky",top:56,
          height:"calc(100vh - 56px)",overflowY:"auto",background:"#faf7f3" }}>

          <Field label="Status">
            <div style={{ display:"flex",gap:6 }}>
              {(["draft","published"] as const).map((s) => (
                <button key={s} type="button" onClick={() => set("status", s)}
                  style={{ flex:1,padding:"5px 0",borderRadius:8,fontSize:11,
                    textTransform:"capitalize",cursor:"pointer",
                    fontWeight: form.status===s ? 600 : 400,
                    background: form.status===s
                      ? s==="published" ? "#e6f4ea" : "#ede9e2"
                      : "transparent",
                    color: form.status===s
                      ? s==="published" ? "#2d7a3a" : "#1c1c1a"
                      : "#9b9590",
                    border: `1px solid ${form.status===s
                      ? s==="published" ? "#b8dfc0" : "#d0ccc4"
                      : "#e8e4dc"}` }}>
                  {s}
                </button>
              ))}
            </div>
          </Field>

          <Divider />

          <Field label="Author">
            <input style={inp} value={form.author}
              onChange={(e) => set("author", e.target.value)} placeholder="Author name" />
          </Field>

          <Field label="Excerpt">
            <textarea style={{ ...ta, minHeight:80 }} value={form.excerpt}
              onChange={(e) => set("excerpt", e.target.value)}
              placeholder="Brief description for previews…" rows={3} />
          </Field>

          <Field label="Tags">
            <div style={{ display:"flex",flexWrap:"wrap",gap:6,marginBottom:8 }}>
              {form.tags.map((tag) => (
                <span key={tag} style={{ display:"inline-flex",alignItems:"center",gap:4,
                  padding:"2px 8px",borderRadius:20,background:"#ede9e2",
                  fontSize:11,color:"#4a4a48" }}>
                  {tag}
                  <button type="button" onClick={() => set("tags", form.tags.filter(t=>t!==tag))}
                    style={{ color:"#9b9590",background:"none",border:"none",cursor:"pointer",
                      fontSize:13,lineHeight:1,padding:0 }}>×</button>
                </span>
              ))}
            </div>
            <div style={{ display:"flex",gap:6 }}>
              <input style={{ ...inp, flex:1 }} value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key==="Enter" && (e.preventDefault(), addTag())}
                placeholder="Add tag…" />
              <button type="button" onClick={addTag}
                style={{ padding:"6px 10px",borderRadius:8,border:"1px solid #e0dcd4",
                  background:"#fff",color:"#6b6860",fontSize:13,cursor:"pointer" }}>+</button>
            </div>
          </Field>

          <Divider />

          <Field label="Cover Image">
            {form.cover_image_url ? (
              <div style={{ borderRadius:8,overflow:"hidden",position:"relative" }}>
                <img src={form.cover_image_url} alt="Cover"
                  style={{ width:"100%",aspectRatio:"16/9",objectFit:"cover",display:"block" }} />
                <button type="button" onClick={() => set("cover_image_url", "")}
                  style={{ display:"block",marginTop:6,fontSize:11,color:"#c0392b",
                    background:"none",border:"none",cursor:"pointer",padding:0 }}>
                  Remove cover
                </button>
              </div>
            ) : (
              <button type="button" onClick={() => coverRef.current?.click()}
                disabled={coverUploading}
                style={{ width:"100%",aspectRatio:"16/9",borderRadius:8,
                  border:"1.5px dashed #d0ccc4",display:"flex",flexDirection:"column",
                  alignItems:"center",justifyContent:"center",gap:6,background:"transparent",
                  cursor:"pointer" }}>
                <span style={{ fontSize:20,opacity:0.3 }}>↑</span>
                <span style={{ fontSize:11,color:"#a0988e" }}>
                  {coverUploading ? "Uploading…" : "Upload cover"}
                </span>
              </button>
            )}
          </Field>
        </aside>
      </div>

      <style>{`
        @keyframes bounce {
          0%,100%{transform:translateY(0)}
          50%{transform:translateY(-4px)}
        }
      `}</style>
    </div>
  )
}
