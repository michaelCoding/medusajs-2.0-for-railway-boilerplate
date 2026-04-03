import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Button, Container, Heading, Table, Badge, Text } from "@medusajs/ui"

type Post = {
  id: string
  title: string
  slug: string
  status: "draft" | "published"
  published_at: string | null
  author: string | null
}

const getToken = () =>
  (window as any).__medusa_token__ ?? localStorage.getItem("medusa:token") ?? ""

async function fetchPosts(): Promise<Post[]> {
  const res = await fetch("/admin/cms/blog-posts", {
    headers: { Authorization: `Bearer ${getToken()}` },
  })
  const data = await res.json()
  return data.posts ?? []
}

async function deletePost(id: string) {
  await fetch(`/admin/cms/blog-posts/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${getToken()}` },
  })
}

export default function BlogListPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    setPosts(await fetchPosts())
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this post?")) return
    await deletePost(id)
    await load()
  }

  return (
    <Container>
      <div className="flex items-center justify-between mb-6">
        <Heading level="h1">Blog Posts</Heading>
        <Button asChild size="small">
          <Link to="/cms/blog/new">New Post</Link>
        </Button>
      </div>
      {loading ? (
        <Text>Loading...</Text>
      ) : posts.length === 0 ? (
        <Text>No posts yet.</Text>
      ) : (
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Title</Table.HeaderCell>
              <Table.HeaderCell>Slug</Table.HeaderCell>
              <Table.HeaderCell>Status</Table.HeaderCell>
              <Table.HeaderCell>Published</Table.HeaderCell>
              <Table.HeaderCell></Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {posts.map((post) => (
              <Table.Row key={post.id}>
                <Table.Cell>{post.title}</Table.Cell>
                <Table.Cell>{post.slug}</Table.Cell>
                <Table.Cell>
                  <Badge color={post.status === "published" ? "green" : "grey"}>
                    {post.status}
                  </Badge>
                </Table.Cell>
                <Table.Cell>
                  {post.published_at
                    ? new Date(post.published_at).toLocaleDateString()
                    : "—"}
                </Table.Cell>
                <Table.Cell>
                  <div className="flex gap-2">
                    <Button variant="secondary" size="small" asChild>
                      <Link to={`/cms/blog/${post.id}`}>Edit</Link>
                    </Button>
                    <Button
                      variant="danger"
                      size="small"
                      onClick={() => handleDelete(post.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      )}
    </Container>
  )
}
