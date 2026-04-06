// Static reviews section — layout matches source design
// Replace with dynamic data source when available

const REVIEWS = [
  {
    id: "1",
    author: "Elias Thorne",
    date: "October 14, 2023",
    rating: 5,
    title: "Quietly perfect craftsmanship",
    body: "The weight in hand is substantial yet balanced. There's a tactile warmth to the wood that ceramic simply cannot replicate. It has transformed my morning ritual into a more grounded experience.",
    verified: true,
  },
  {
    id: "2",
    author: "Sarah Jenkins",
    date: "September 28, 2023",
    rating: 5,
    title: "A beautiful heirloom piece",
    body: "Bought the walnut version and the grain is absolutely stunning. It's clear this wasn't just manufactured, but crafted. The packaging was also plastic-free and very thoughtful.",
    verified: true,
  },
]

const RATING_BREAKDOWN = [
  { star: 5, pct: 85 },
  { star: 4, pct: 10 },
  { star: 3, pct: 3 },
  { star: 2, pct: 1 },
  { star: 1, pct: 1 },
]

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <span
      className="material-symbols-outlined"
      style={{
        fontVariationSettings: filled
          ? "'FILL' 1, 'wght' 300, 'GRAD' 0, 'opsz' 20"
          : "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 20",
        fontSize: "inherit",
      }}
    >
      star
    </span>
  )
}

function StarRow({ count, size = "18px" }: { count: number; size?: string }) {
  return (
    <div className="flex text-primary" style={{ fontSize: size }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <StarIcon key={i} filled={i <= count} />
      ))}
    </div>
  )
}

export default function ProductReviews() {
  const totalReviews = 124
  const avgRating = 4.8

  return (
    <section className="py-24 max-w-7xl mx-auto px-6 large:px-12 border-b border-outline-variant/10">
      <div className="grid grid-cols-1 large:grid-cols-12 gap-16">

        {/* Summary column */}
        <div className="large:col-span-4 space-y-8">
          <div className="space-y-4">
            <h3 className="text-3xl font-headline text-on-surface">Community Journal</h3>
            <div className="flex items-center gap-4">
              <div className="text-5xl font-headline text-primary">{avgRating}</div>
              <div className="space-y-1">
                <StarRow count={Math.round(avgRating)} size="20px" />
                <p className="text-sm text-on-surface-variant">Based on {totalReviews} reviews</p>
              </div>
            </div>
          </div>

          {/* Ratings breakdown */}
          <div className="space-y-3">
            {RATING_BREAKDOWN.map(({ star, pct }) => (
              <div key={star} className="flex items-center gap-4">
                <span className="text-xs font-semibold w-8">{star}★</span>
                <div className="flex-1 h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                  <div className="bg-[#6f4627] h-full" style={{ width: `${pct}%` }} />
                </div>
                <span className="text-xs text-on-surface-variant w-8">{pct}%</span>
              </div>
            ))}
          </div>

          <button className="w-full py-3 border border-[#6f4627] text-[#6f4627] rounded-md font-semibold text-sm hover:bg-[#6f4627]/5 transition-all uppercase tracking-widest">
            Share your experience
          </button>
        </div>

        {/* Reviews column */}
        <div className="large:col-span-8 space-y-12">
          {REVIEWS.map((review) => (
            <div key={review.id} className="space-y-4 pb-12 border-b border-outline-variant/10">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <StarRow count={review.rating} size="18px" />
                  <div className="flex items-center gap-2 mt-2">
                    <span className="font-bold text-sm text-on-surface">{review.author}</span>
                    {review.verified && (
                      <span className="flex items-center gap-1 text-[10px] bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded-full font-bold uppercase tracking-tighter">
                        <span
                          className="material-symbols-outlined"
                          style={{ fontVariationSettings: "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 12", fontSize: "12px" }}
                        >
                          verified
                        </span>
                        Verified Buyer
                      </span>
                    )}
                  </div>
                </div>
                <span className="text-xs text-on-surface-variant font-medium">{review.date}</span>
              </div>
              <div className="space-y-2">
                <h4 className="text-xl font-headline italic text-on-surface">{review.title}</h4>
                <p className="text-on-surface-variant leading-relaxed text-sm">{review.body}</p>
              </div>
            </div>
          ))}

          <div className="text-center pt-4">
            <button className="text-primary font-bold text-sm underline decoration-2 underline-offset-8 hover:opacity-70 transition-opacity">
              View all {totalReviews} reviews
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
