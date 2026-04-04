import { useEditor, EditorContent } from "@tiptap/react"
import { Node, mergeAttributes } from "@tiptap/core"
import StarterKit from "@tiptap/starter-kit"
import Image from "@tiptap/extension-image"
import Link from "@tiptap/extension-link"
import Youtube from "@tiptap/extension-youtube"
import Placeholder from "@tiptap/extension-placeholder"
import Underline from "@tiptap/extension-underline"
import TextAlign from "@tiptap/extension-text-align"
import { useCallback, useRef, useState } from "react"

// ─── Custom Video Node ────────────────────────────────────────────────────────
const VideoBlock = Node.create({
  name: "videoBlock",
  group: "block",
  atom: true,
  draggable: true,
  addAttributes() {
    return { src: { default: null } }
  },
  parseHTML() {
    return [{ tag: "video[src]" }]
  },
  renderHTML({ HTMLAttributes }) {
    return ["video", mergeAttributes({ controls: true, style: "max-width:100%;display:block" }, HTMLAttributes)]
  },
  addNodeView() {
    return ({ node }: any) => {
      const wrapper = document.createElement("div")
      wrapper.style.cssText = "margin:1rem 0;border-radius:8px;overflow:hidden;background:#000"
      const video = document.createElement("video")
      video.src = node.attrs.src
      video.controls = true
      video.style.cssText = "width:100%;max-height:480px;display:block"
      wrapper.appendChild(video)
      return { dom: wrapper }
    }
  },
})

// ─── Custom Audio Node ────────────────────────────────────────────────────────
const AudioBlock = Node.create({
  name: "audioBlock",
  group: "block",
  atom: true,
  draggable: true,
  addAttributes() {
    return { src: { default: null } }
  },
  parseHTML() {
    return [{ tag: "audio[src]" }]
  },
  renderHTML({ HTMLAttributes }) {
    return ["audio", mergeAttributes({ controls: true, style: "width:100%" }, HTMLAttributes)]
  },
  addNodeView() {
    return ({ node }: any) => {
      const wrapper = document.createElement("div")
      wrapper.style.cssText =
        "margin:1rem 0;padding:0.75rem 1rem;border-radius:8px;background:#f5f2ed;border:1px solid #e8e4dc"
      const audio = document.createElement("audio")
      audio.src = node.attrs.src
      audio.controls = true
      audio.style.width = "100%"
      wrapper.appendChild(audio)
      return { dom: wrapper }
    }
  },
})

// ─── Upload helper ────────────────────────────────────────────────────────────
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

// ─── Toolbar button ───────────────────────────────────────────────────────────
function Btn({
  active,
  onClick,
  title,
  children,
}: {
  active?: boolean
  onClick: () => void
  title?: string
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      style={{
        height: 28,
        padding: "0 8px",
        borderRadius: 5,
        fontSize: 12,
        cursor: "pointer",
        border: "none",
        background: active ? "#e8e4dc" : "transparent",
        color: active ? "#1c1c1a" : "#6b6860",
        fontWeight: active ? 600 : 400,
        transition: "all 0.12s",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLButtonElement
        if (!active) { el.style.background = "#f0ede6"; el.style.color = "#1c1c1a" }
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLButtonElement
        if (!active) { el.style.background = "transparent"; el.style.color = "#6b6860" }
      }}
    >
      {children}
    </button>
  )
}

function Sep() {
  return (
    <span style={{
      display: "inline-block", width: 1, height: 16,
      background: "#e0dcd4", margin: "0 4px", verticalAlign: "middle",
    }} />
  )
}

// ─── Media modal ──────────────────────────────────────────────────────────────
type ModalType = "image" | "video" | "audio" | "youtube"

function MediaModal({
  type, onClose, onInsert,
}: {
  type: ModalType
  onClose: () => void
  onInsert: (url: string) => void
}) {
  const [url, setUrl] = useState("")
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const isYT = type === "youtube"
  const label = { image: "Image", video: "Video", audio: "Audio", youtube: "YouTube" }[type]
  const accept = { image: "image/*", video: "video/*", audio: "audio/*", youtube: "" }[type]

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try { onInsert(await uploadFile(file)) }
    catch { alert("Upload failed") }
    finally { setUploading(false) }
  }

  return (
    <div
      style={{ position:"fixed",inset:0,zIndex:9999,background:"rgba(0,0,0,0.4)",
        display:"flex",alignItems:"center",justifyContent:"center" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div style={{ background:"#fff",borderRadius:16,padding:24,width:360,
        boxShadow:"0 20px 60px rgba(0,0,0,0.15)",border:"1px solid #e8e4dc" }}>
        <p style={{ color:"#1c1c1a",fontWeight:600,marginBottom:16,fontSize:15 }}>
          Insert {label}
        </p>

        <p style={{ fontSize:10,textTransform:"uppercase",letterSpacing:"0.1em",color:"#9b9590",marginBottom:6 }}>
          {isYT ? "YouTube URL" : "URL"}
        </p>
        <input
          style={{ width:"100%",background:"#fafaf8",border:"1px solid #e8e4dc",
            borderRadius:8,padding:"8px 12px",fontSize:13,color:"#1c1c1a",
            outline:"none",boxSizing:"border-box" }}
          placeholder={isYT ? "https://youtube.com/watch?v=…" : "https://…"}
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && url && onInsert(url)}
          autoFocus
        />

        {!isYT && (
          <>
            <p style={{ fontSize:11,color:"#b0a89e",textAlign:"center",margin:"12px 0" }}>— or upload —</p>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              style={{ width:"100%",border:"1.5px dashed #d0ccc4",borderRadius:8,
                padding:"12px",fontSize:13,color:"#9b9590",background:"transparent",cursor:"pointer" }}
            >
              {uploading ? "Uploading…" : `Upload ${label}`}
            </button>
            <input ref={fileRef} type="file" accept={accept} style={{ display:"none" }} onChange={handleFile} />
          </>
        )}

        <div style={{ display:"flex",gap:8,marginTop:20 }}>
          <button type="button" onClick={onClose}
            style={{ flex:1,padding:"8px",borderRadius:8,border:"1px solid #e0dcd4",
              background:"transparent",color:"#6b6860",fontSize:13,cursor:"pointer" }}>
            Cancel
          </button>
          <button type="button" onClick={() => url && onInsert(url)} disabled={!url}
            style={{ flex:1,padding:"8px",borderRadius:8,border:"none",
              background: url ? "#1c1c1a" : "#e8e4dc",
              color: url ? "#fff" : "#a0a0a0",
              fontSize:13,fontWeight:500,cursor: url ? "pointer" : "not-allowed" }}>
            Insert
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Main editor ──────────────────────────────────────────────────────────────
export interface RichTextEditorProps {
  value: string
  onChange: (html: string) => void
  placeholder?: string
}

export default function RichTextEditor({ value, onChange, placeholder = "Start writing…" }: RichTextEditorProps) {
  const [modal, setModal] = useState<ModalType | null>(null)

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Image.configure({ allowBase64: false }),
      Link.configure({ openOnClick: false }),
      Youtube.configure({ width: 720, height: 405, nocookie: true }),
      Placeholder.configure({ placeholder }),
      VideoBlock,
      AudioBlock,
    ],
    content: value,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: { class: "rte-content" },
      handleDrop(view, event) {
        const file = event.dataTransfer?.files?.[0]
        if (!file?.type.startsWith("image/")) return false
        event.preventDefault()
        uploadFile(file).then((url) => {
          const node = view.state.schema.nodes.image?.create({ src: url })
          if (node) view.dispatch(view.state.tr.replaceSelectionWith(node))
        }).catch(() => alert("Upload failed"))
        return true
      },
      handlePaste(view, event) {
        const item = Array.from(event.clipboardData?.items ?? []).find((i) => i.type.startsWith("image/"))
        if (!item) return false
        const file = item.getAsFile()
        if (!file) return false
        event.preventDefault()
        uploadFile(file).then((url) => {
          const node = view.state.schema.nodes.image?.create({ src: url })
          if (node) view.dispatch(view.state.tr.replaceSelectionWith(node))
        }).catch(() => alert("Upload failed"))
        return true
      },
    },
  })

  const insertMedia = useCallback((url: string) => {
    if (!editor || !modal) return
    switch (modal) {
      case "image":   editor.chain().focus().setImage({ src: url }).run(); break
      case "video":   editor.chain().focus().insertContent({ type: "videoBlock", attrs: { src: url } }).run(); break
      case "audio":   editor.chain().focus().insertContent({ type: "audioBlock", attrs: { src: url } }).run(); break
      case "youtube": editor.chain().focus().setYoutubeVideo({ src: url }).run(); break
    }
    setModal(null)
  }, [editor, modal])

  if (!editor) return null
  const e = editor

  return (
    <>
      <div style={{ borderRadius:10,border:"1px solid #e8e4dc",background:"#fff",overflow:"hidden" }}>
        {/* Toolbar */}
        <div style={{ display:"flex",flexWrap:"wrap",alignItems:"center",gap:2,
          padding:"6px 10px",borderBottom:"1px solid #ede9e2",background:"#faf7f3" }}>
          <Btn title="H1" active={e.isActive("heading",{level:1})}
            onClick={() => e.chain().focus().toggleHeading({level:1}).run()}>H1</Btn>
          <Btn title="H2" active={e.isActive("heading",{level:2})}
            onClick={() => e.chain().focus().toggleHeading({level:2}).run()}>H2</Btn>
          <Btn title="H3" active={e.isActive("heading",{level:3})}
            onClick={() => e.chain().focus().toggleHeading({level:3}).run()}>H3</Btn>
          <Sep />
          <Btn title="Bold" active={e.isActive("bold")}
            onClick={() => e.chain().focus().toggleBold().run()}><b>B</b></Btn>
          <Btn title="Italic" active={e.isActive("italic")}
            onClick={() => e.chain().focus().toggleItalic().run()}><i>I</i></Btn>
          <Btn title="Underline" active={e.isActive("underline")}
            onClick={() => e.chain().focus().toggleUnderline().run()}><u>U</u></Btn>
          <Btn title="Strike" active={e.isActive("strike")}
            onClick={() => e.chain().focus().toggleStrike().run()}><s>S</s></Btn>
          <Sep />
          <Btn title="Bullet list" active={e.isActive("bulletList")}
            onClick={() => e.chain().focus().toggleBulletList().run()}>≡</Btn>
          <Btn title="Ordered list" active={e.isActive("orderedList")}
            onClick={() => e.chain().focus().toggleOrderedList().run()}>№</Btn>
          <Btn title="Blockquote" active={e.isActive("blockquote")}
            onClick={() => e.chain().focus().toggleBlockquote().run()}>" "</Btn>
          <Btn title="Code" active={e.isActive("codeBlock")}
            onClick={() => e.chain().focus().toggleCodeBlock().run()}>{"</>"}</Btn>
          <Btn title="Divider"
            onClick={() => e.chain().focus().setHorizontalRule().run()}>—</Btn>
          <Sep />
          <Btn title="Align left" active={e.isActive({textAlign:"left"})}
            onClick={() => e.chain().focus().setTextAlign("left").run()}>⬅</Btn>
          <Btn title="Align center" active={e.isActive({textAlign:"center"})}
            onClick={() => e.chain().focus().setTextAlign("center").run()}>↔</Btn>
          <Btn title="Align right" active={e.isActive({textAlign:"right"})}
            onClick={() => e.chain().focus().setTextAlign("right").run()}>➡</Btn>
          <Sep />
          <Btn title="Link" active={e.isActive("link")} onClick={() => {
            const prev = e.getAttributes("link").href ?? ""
            const url = window.prompt("Link URL:", prev)
            if (url === null) return
            url === "" ? e.chain().focus().unsetLink().run()
              : e.chain().focus().setLink({ href: url }).run()
          }}>🔗</Btn>
          <Sep />
          <Btn title="Insert image" onClick={() => setModal("image")}>🖼 Image</Btn>
          <Btn title="Insert video" onClick={() => setModal("video")}>🎬 Video</Btn>
          <Btn title="Insert audio" onClick={() => setModal("audio")}>🎵 Audio</Btn>
          <Btn title="YouTube embed" onClick={() => setModal("youtube")}>▶ YouTube</Btn>
        </div>

        {/* Editor area */}
        <div style={{ padding:"20px 24px",background:"#fff" }}>
          <EditorContent editor={editor} />
        </div>
      </div>

      {modal && <MediaModal type={modal} onClose={() => setModal(null)} onInsert={insertMedia} />}

      <style>{`
        .rte-content { min-height: 400px; outline: none; color: #2c2c2a; line-height: 1.75; }
        .rte-content p.is-editor-empty:first-child::before {
          content: attr(data-placeholder); float: left; color: #c0bbb4; pointer-events: none; height: 0;
        }
        .rte-content h1 { font-size: 1.75rem; font-weight: 700; color: #1c1c1a; margin: 1.5rem 0 0.6rem; line-height: 1.15; letter-spacing: -0.02em; }
        .rte-content h2 { font-size: 1.35rem; font-weight: 600; color: #1c1c1a; margin: 1.25rem 0 0.5rem; }
        .rte-content h3 { font-size: 1.1rem; font-weight: 600; color: #1c1c1a; margin: 1rem 0 0.4rem; }
        .rte-content p { margin: 0 0 0.85rem; }
        .rte-content a { color: #7A9E7E; text-decoration: underline; }
        .rte-content ul, .rte-content ol { padding-left: 1.5rem; margin-bottom: 0.85rem; }
        .rte-content li { margin-bottom: 0.2rem; }
        .rte-content blockquote { border-left: 3px solid #e0dcd4; padding-left: 1rem; color: #8b8780; font-style: italic; margin: 1.25rem 0; }
        .rte-content code { background: #f5f2ed; padding: 0.15rem 0.4rem; border-radius: 4px; font-size: 0.82em; color: #C07B5A; }
        .rte-content pre { background: #f5f2ed; border: 1px solid #e8e4dc; border-radius: 8px; padding: 1rem; margin: 1rem 0; overflow-x: auto; }
        .rte-content pre code { background: none; padding: 0; color: #2c2c2a; }
        .rte-content hr { border: none; border-top: 1px solid #e8e4dc; margin: 1.75rem 0; }
        .rte-content img { max-width: 100%; border-radius: 8px; margin: 1rem 0; display: block; }
        .rte-content iframe { width: 100%; aspect-ratio: 16/9; border-radius: 8px; margin: 1rem 0; border: none; display: block; }
        .rte-content .ProseMirror-selectednode { outline: 2px solid #7A9E7E; outline-offset: 2px; border-radius: 4px; }
      `}</style>
    </>
  )
}
