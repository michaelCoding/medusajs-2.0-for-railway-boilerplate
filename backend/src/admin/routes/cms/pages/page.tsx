import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Button, Container, Heading, Table, Text } from "@medusajs/ui"

type Page = { id: string; slug: string; title: string }

const getToken = () =>
  (window as any).__medusa_token__ ?? localStorage.getItem("medusa:token") ?? ""

export default function PagesListPage() {
  const [pages, setPages] = useState<Page[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/admin/cms/pages", { headers: { Authorization: `Bearer ${getToken()}` } })
      .then((r) => r.ok ? r.json() : { pages: [] })
      .then(({ pages }) => { setPages(pages ?? []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  return (
    <Container>
      <div className="flex items-center justify-between mb-6">
        <Heading level="h1">Static Pages</Heading>
        <Button asChild size="small"><Link to="/cms/pages/new">New Page</Link></Button>
      </div>
      {loading ? <Text>Loading...</Text> : pages.length === 0 ? <Text>No pages.</Text> : (
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Slug</Table.HeaderCell>
              <Table.HeaderCell>Title</Table.HeaderCell>
              <Table.HeaderCell></Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {pages.map((page) => (
              <Table.Row key={page.id}>
                <Table.Cell>{page.slug}</Table.Cell>
                <Table.Cell>{page.title}</Table.Cell>
                <Table.Cell>
                  <Button variant="secondary" size="small" asChild>
                    <Link to={`/cms/pages/${page.id}`}>Edit</Link>
                  </Button>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      )}
    </Container>
  )
}
