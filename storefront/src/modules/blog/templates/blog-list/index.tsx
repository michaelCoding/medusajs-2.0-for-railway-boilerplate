import { getAllPosts } from '@lib/data/blog'
import { BannerData } from '@lib/data/cms'
import LocalizedClientLink from '@modules/common/components/localized-client-link'

const FALLBACK_BANNER = {
  headline: "Stories from the atelier.",
  text: "Notes on craft, material, and the slow life.",
  cta_text: "Read more →",
  cta_link: "/blog",
  image_url: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=1600&q=80",
}

export default async function BlogListTemplate({ banner }: { banner?: BannerData | null }) {
  const posts = await getAllPosts()
  const b = banner ?? FALLBACK_BANNER

  if (posts.length === 0) {
    return (
      <div className="min-h-screen bg-[#fcf9f4] flex items-center justify-center">
        <p className="text-sm text-[#6B6860]">No stories yet. Check back soon.</p>
      </div>
    )
  }

  return (
    <div className="bg-[#fcf9f4] min-h-screen">

      {/* CMS-controlled journal banner */}
      <div className="px-8 max-w-screen-2xl mx-auto">
        <section className="mt-8 rounded-xl overflow-hidden relative aspect-[21/9] medium:aspect-[21/7]">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${b.image_url}')` }}
          />
          {/* Gradient overlay from left */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#1c1c19]/55 to-transparent" />
          {/* Content */}
          <div className="absolute inset-0 flex items-center px-8 medium:px-16">
            <div className="max-w-lg space-y-4">
              <span className="inline-block px-3 py-1 bg-[#d8e6a6] text-[#5c6834] text-xs font-semibold tracking-widest rounded-full uppercase">
                The Journal
              </span>
              <h1 className="font-lora text-3xl medium:text-4xl large:text-5xl text-[#fcf9f4] leading-tight">
                {b.headline}
              </h1>
              {b.text && (
                <p className="text-[#fcf9f4]/80 text-base leading-relaxed">{b.text}</p>
              )}
              {b.cta_text && (
                <a
                  href={b.cta_link}
                  className="inline-flex items-center gap-2 bg-[#6f4627] text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-[#8b5e3c] transition-all"
                >
                  {b.cta_text}
                </a>
              )}
            </div>
          </div>
        </section>
      </div>

      {/* Section header */}
      <div className="px-8 max-w-screen-2xl mx-auto pt-20 pb-12 flex flex-col medium:flex-row justify-between items-start medium:items-end gap-6">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-[#6f4627]/60 font-semibold mb-3">The Journal</p>
          <h2 className="font-lora text-4xl medium:text-5xl text-[#1c1c19] leading-tight">
            Stories from the Grain
          </h2>
        </div>
        <a
          href="/blog"
          className="text-[#6f4627] font-medium flex items-center gap-2 pb-1 border-b border-[#6f4627]/20 hover:border-[#6f4627] transition-all text-sm"
        >
          Explore the Archive <span aria-hidden="true">→</span>
        </a>
      </div>

      {/* Posts grid */}
      <div className="px-8 max-w-screen-2xl mx-auto pb-24">
        <div className="grid grid-cols-1 medium:grid-cols-3 gap-16">
          {posts.map((post, i) => (
              <LocalizedClientLink
                key={post.slug}
                href={`/blog/${post.slug}`}
                className={`group space-y-6${i === 1 ? ' medium:mt-20' : ''}`}
              >
                {/* Image */}
                <div className="overflow-hidden rounded-2xl bg-[#f0ede8] aspect-[4/5]">
                  {post.cover_image_url ? (
                    <img
                      src={post.cover_image_url}
                      alt=""
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full bg-[#e5e2dd]" />
                  )}
                </div>

                {/* Meta + title */}
                <div className="space-y-3">
                  <p className="text-xs uppercase tracking-widest text-[#83746b]">
                    {post.author ?? 'The Woodenly'}
                  </p>
                  <h3 className="font-lora text-xl italic text-[#1c1c19] leading-snug group-hover:text-[#6f4627] transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-[#51443c] text-sm leading-relaxed line-clamp-2">{post.excerpt}</p>
                  <span className="text-[#6f4627] font-semibold flex items-center gap-1 text-sm group-hover:gap-2 transition-all">
                    Read story <span aria-hidden="true">→</span>
                  </span>
                </div>
              </LocalizedClientLink>
            ))}
          </div>
        </div>

    </div>
  )
}
