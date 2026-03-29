import { getAllPosts } from '@lib/data/blog'
import BlogCard from '@modules/blog/components/blog-card'

export default function BlogListTemplate() {
  const posts = getAllPosts()

  return (
    <div className="content-container py-12">
      <h1 className="mb-8 text-basic-primary">Blog</h1>
      {posts.length === 0 ? (
        <p className="text-md text-secondary">No posts yet. Check back soon.</p>
      ) : (
        <div className="grid gap-6 medium:grid-cols-2 xl:grid-cols-3">
          {posts.map((post) => (
            <BlogCard key={post.slug} {...post} />
          ))}
        </div>
      )}
    </div>
  )
}
