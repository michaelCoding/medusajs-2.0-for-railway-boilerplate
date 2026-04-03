'use client'

import useEmblaCarousel from 'embla-carousel-react'
import { Box } from '@modules/common/components/box'
import { Button } from '@modules/common/components/button'
import { Container } from '@modules/common/components/container'
import { Heading } from '@modules/common/components/heading'
import LocalizedClientLink from '@modules/common/components/localized-client-link'
import BlogCard from '@modules/blog/components/blog-card'

type Post = { slug: string; title: string; date: string; excerpt: string; author: string }

export function ExploreBlog({ posts }: { posts: Post[] }) {
  const [emblaRef] = useEmblaCarousel({ align: 'start', loop: false })

  return (
    <Container className="overflow-hidden">
      <Box className="flex flex-col gap-6 small:gap-12">
        <Box className="flex items-center justify-between">
          <Heading as="h2" className="text-2xl text-basic-primary small:text-3xl">
            Get inspired
          </Heading>
          <Button className="hidden w-max large:flex" variant="tonal" asChild>
            <LocalizedClientLink href="/blog">Read more</LocalizedClientLink>
          </Button>
        </Box>
        <Box className="hidden items-center gap-2 large:grid large:grid-cols-3">
          {posts.map((post) => (
            <BlogCard
              key={post.slug}
              slug={post.slug}
              title={post.title}
              date={post.date}
              excerpt={post.excerpt}
              author={post.author}
            />
          ))}
        </Box>
        <div ref={emblaRef} className="block large:hidden">
          <Box className="flex gap-2">
            {posts.map((post) => (
              <Box key={post.slug} className="flex-[0_0_calc(72.666%-8px)]">
                <BlogCard
                  slug={post.slug}
                  title={post.title}
                  date={post.date}
                  excerpt={post.excerpt}
                  author={post.author}
                />
              </Box>
            ))}
          </Box>
        </div>
        <Button className="mx-auto flex w-max large:hidden" variant="tonal" asChild>
          <LocalizedClientLink href="/blog">Read more</LocalizedClientLink>
        </Button>
      </Box>
    </Container>
  )
}
