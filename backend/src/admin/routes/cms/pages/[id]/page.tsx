import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Button, Container, Heading, Input, Label, Textarea } from "@medusajs/ui"

const isNew = (id: string) => id === "new"
const getToken = () =>
  (window as any).__medusa_token__ ?? localStorage.getItem("medusa:token") ?? ""

export default function PageEditPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(!isNew(id!))
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [form, setForm] = useState({ slug: "", title: "", content: "" })

  useEffect(() => {
    if (isNew(id!)) return
    fetch(`/admin/cms/pages/${id}`, { headers: { Authorization: `Bearer ${getToken()}` } })
      .then((r) => r.json())
      .then(({ page }) => {
        setForm({ slug: page.slug, title: page.title, content: page.content ?? "" })
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [id])

  const handleSave = async () => {
    setSaving(true)
    setSaveError(null)
    try {
      const method = isNew(id!) ? "POST" : "PUT"
      const url = isNew(id!) ? "/admin/cms/pages" : `/admin/cms/pages/${id}`
      const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${getToken()}`, "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        setSaveError((err as any).message ?? "Save failed.")
        return
      }
      navigate("/cms/pages")
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
        <Heading level="h1">{isNew(id!) ? "New Page" : "Edit Page"}</Heading>
        <div className="flex gap-2">
          <Button variant="secondary" size="small" onClick={() => navigate("/cms/pages")}>Cancel</Button>
          <Button size="small" onClick={handleSave} disabled={saving}>{saving ? "Saving..." : "Save"}</Button>
        </div>
      </div>
      {saveError && <p className="text-red-500 text-sm mb-4">{saveError}</p>}
      <div className="flex flex-col gap-4 max-w-2xl">
        <div>
          <Label>Slug *</Label>
          <Input value={form.slug} onChange={(e) => setForm(p => ({ ...p, slug: e.target.value }))} />
        </div>
        <div>
          <Label>Title *</Label>
          <Input value={form.title} onChange={(e) => setForm(p => ({ ...p, title: e.target.value }))} />
        </div>
        <div>
          <Label>Content (Markdown)</Label>
          <Textarea
            value={form.content}
            onChange={(e) => setForm(p => ({ ...p, content: e.target.value }))}
            rows={20}
            className="font-mono text-sm"
          />
        </div>
      </div>
    </Container>
  )
}
