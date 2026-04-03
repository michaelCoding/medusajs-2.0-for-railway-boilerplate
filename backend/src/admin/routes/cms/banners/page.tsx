import { useEffect, useState } from "react"
import { Button, Container, Heading, Input, Label, Textarea } from "@medusajs/ui"

type Banner = {
  id: string
  key: string
  headline: string
  text: string
  cta_text: string
  cta_link: string
  image_url: string
}

const getToken = () =>
  (window as any).__medusa_token__ ?? localStorage.getItem("medusa:token") ?? ""

export default function BannersPage() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [saving, setSaving] = useState<string | null>(null)
  const [saveErrors, setSaveErrors] = useState<Record<string, string>>({})
  const [forms, setForms] = useState<Record<string, Banner>>({})

  useEffect(() => {
    fetch("/admin/cms/banners", {
      headers: { Authorization: `Bearer ${getToken()}` },
    })
      .then((r) => r.json())
      .then(({ banners }) => {
        setBanners(banners)
        const init: Record<string, Banner> = {}
        banners.forEach((b: Banner) => (init[b.id] = { ...b }))
        setForms(init)
      })
      .catch(() => {})
  }, [])

  const handleChange = (id: string, field: keyof Banner, value: string) => {
    setForms((prev) => ({ ...prev, [id]: { ...prev[id], [field]: value } }))
  }

  const handleImageUpload = async (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
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
        if (!res.ok) { alert("Image upload failed."); return }
        const { url } = await res.json()
        handleChange(id, "image_url", url)
      } catch {
        alert("Image upload failed.")
      }
    }
    reader.readAsDataURL(file)
  }

  const handleSave = async (id: string) => {
    setSaving(id)
    setSaveErrors((prev) => ({ ...prev, [id]: "" }))
    try {
      const res = await fetch(`/admin/cms/banners/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${getToken()}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(forms[id]),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        setSaveErrors((prev) => ({ ...prev, [id]: (err as any).message ?? "Save failed." }))
        return
      }
      alert("Saved!")
    } catch {
      setSaveErrors((prev) => ({ ...prev, [id]: "Save failed." }))
    } finally {
      setSaving(null)
    }
  }

  return (
    <Container>
      <Heading level="h1" className="mb-6">Banners</Heading>
      <div className="flex flex-col gap-8">
        {banners.map((banner) => {
          const form = forms[banner.id]
          if (!form) return null
          return (
            <div key={banner.id} className="border rounded p-6">
              <Heading level="h2" className="mb-4 capitalize">{banner.key} Banner</Heading>
              {saveErrors[banner.id] && (
                <p className="text-red-500 text-sm mb-3">{saveErrors[banner.id]}</p>
              )}
              <div className="flex flex-col gap-3 max-w-2xl">
                <div>
                  <Label>Headline</Label>
                  <Input value={form.headline} onChange={(e) => handleChange(banner.id, "headline", e.target.value)} />
                </div>
                <div>
                  <Label>Text</Label>
                  <Textarea value={form.text} onChange={(e) => handleChange(banner.id, "text", e.target.value)} rows={3} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>CTA Text</Label>
                    <Input value={form.cta_text} onChange={(e) => handleChange(banner.id, "cta_text", e.target.value)} />
                  </div>
                  <div>
                    <Label>CTA Link</Label>
                    <Input value={form.cta_link} onChange={(e) => handleChange(banner.id, "cta_link", e.target.value)} />
                  </div>
                </div>
                <div>
                  <Label>Image</Label>
                  {form.image_url && (
                    <img src={form.image_url} alt="banner" className="w-full max-h-48 object-cover mb-2 rounded" />
                  )}
                  <input type="file" accept="image/*" onChange={(e) => handleImageUpload(banner.id, e)} className="mb-1" />
                  <Input
                    value={form.image_url}
                    onChange={(e) => handleChange(banner.id, "image_url", e.target.value)}
                    placeholder="Or enter URL directly"
                  />
                </div>
                <Button
                  size="small"
                  onClick={() => handleSave(banner.id)}
                  disabled={saving === banner.id}
                >
                  {saving === banner.id ? "Saving..." : "Save"}
                </Button>
              </div>
            </div>
          )
        })}
      </div>
    </Container>
  )
}
