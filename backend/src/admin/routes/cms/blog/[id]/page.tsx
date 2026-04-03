import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Button, Container, Heading, Input, Label, Select, Textarea } from "@medusajs/ui"

const isNew = (id: string) => id === "new"

const getToken = () =>
  (window as any).__medusa_token__ ?? localStorage.getItem("medusa:token") ?? ""

export default function BlogEditPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(!isNew(id!))
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [coverUrl, setCoverUrl] = useState("")
  const [form, setForm] = useState({
    title: "",
    slug: "",
    excerpt: "",
    author: "",
    content: "",
    status: "draft" as "draft" | "published",
    cover_image_url: "",
  })

  useEffect(() => {
    if (isNew(id!)) return
    fetch(`/admin/cms/blog-posts/${id}`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    })
      .then((r) => r.json())
      .then(({ post }) => {
        setForm({
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt ?? "",
          author: post.author ?? "",
          content: post.content ?? "",
          status: post.status,
          cover_image_url: post.cover_image_url ?? "",
        })
        setCoverUrl(post.cover_image_url ?? "")
        setLoading(false)
      })
  }, [id])

  const handleChange = (field: string, value: string) => {
    setForm((prev) => {
      const next = { ...prev, [field]: value }
      if (field === "title" && isNew(id!)) {
        next.slug = value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")
      }
      return next
    })
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
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
        if (!res.ok) {
          alert("Image upload failed.")
          return
        }
        const { url } = await res.json()
        setCoverUrl(url)
        setForm((prev) => ({ ...prev, cover_image_url: url }))
      } catch {
        alert("Image upload failed.")
      }
    }
    reader.readAsDataURL(file)
  }

  const handleSave = async () => {
    setSaving(true)
    setSaveError(null)
    try {
      const method = isNew(id!) ? "POST" : "PUT"
      const url = isNew(id!)
        ? "/admin/cms/blog-posts"
        : `/admin/cms/blog-posts/${id}`

      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${getToken()}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
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

  if (loading) return <Container><p>Loading...</p></Container>

  return (
    <Container>
      <div className="flex items-center justify-between mb-6">
        <Heading level="h1">{isNew(id!) ? "New Post" : "Edit Post"}</Heading>
        <div className="flex gap-2">
          <Button variant="secondary" size="small" onClick={() => navigate("/cms/blog")}>
            Cancel
          </Button>
          <Button size="small" onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>
      {saveError && (
        <p className="text-red-500 text-sm mb-4">{saveError}</p>
      )}

      <div className="flex flex-col gap-4 max-w-2xl">
        <div>
          <Label>Title *</Label>
          <Input value={form.title} onChange={(e) => handleChange("title", e.target.value)} />
        </div>
        <div>
          <Label>Slug *</Label>
          <Input value={form.slug} onChange={(e) => handleChange("slug", e.target.value)} />
        </div>
        <div>
          <Label>Author</Label>
          <Input value={form.author} onChange={(e) => handleChange("author", e.target.value)} />
        </div>
        <div>
          <Label>Excerpt</Label>
          <Textarea
            value={form.excerpt}
            onChange={(e) => handleChange("excerpt", e.target.value)}
            rows={3}
          />
        </div>
        <div>
          <Label>Content (Markdown)</Label>
          <Textarea
            value={form.content}
            onChange={(e) => handleChange("content", e.target.value)}
            rows={15}
            className="font-mono text-sm"
          />
        </div>
        <div>
          <Label>Status</Label>
          <Select
            value={form.status}
            onValueChange={(v) => handleChange("status", v)}
          >
            <Select.Trigger>
              <Select.Value />
            </Select.Trigger>
            <Select.Content>
              <Select.Item value="draft">Draft</Select.Item>
              <Select.Item value="published">Published</Select.Item>
            </Select.Content>
          </Select>
        </div>
        <div>
          <Label>Cover Image</Label>
          {coverUrl && (
            <img src={coverUrl} alt="cover" className="w-full max-h-48 object-cover mb-2 rounded" />
          )}
          <input type="file" accept="image/*" onChange={handleImageUpload} />
          {form.cover_image_url && (
            <p className="text-xs text-gray-500 mt-1">{form.cover_image_url}</p>
          )}
        </div>
      </div>
    </Container>
  )
}
