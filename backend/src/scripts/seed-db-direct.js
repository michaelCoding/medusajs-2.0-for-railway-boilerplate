const { Client } = require('pg');
const { ulid } = require('ulid');

const DB_URL = 'postgres://postgres:postgres@localhost:5432/medusa';
const now = new Date().toISOString();

const posts = [
  {
    id: ulid(),
    title: 'The Quiet Ritual of Morning Tea',
    slug: 'quiet-ritual-of-morning-tea',
    excerpt: 'Before the world wakes to its noise, there is a span of time where the only movement is the slow climb of steam and the warming of wood against a cold palm.',
    author: 'Elias Thorne',
    cover_image_url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1600&q=80',
    status: 'published',
    published_at: '2024-09-22T08:00:00Z',
    tags: JSON.stringify(['ritual', 'morning', 'tea', 'wood']),
    content: [
      'The wooden bowl is a conductor of heat, but unlike ceramic, it is a gentle negotiator. It allows the liquid within to breathe while keeping the exterior soft, never scalding. This morning, as the first light filters through the cedar trees outside my window, I find myself tracing the grain of the white oak. Each ring is a year of a tree\'s life, now serving as a vessel for my own brief moment of reflection.',
      '',
      'There is a tactile honesty in wood. It changes over time, absorbing the oils of your hands, darkening where it is held most often. To drink tea from a bowl carved by hand is to engage in a conversation between two lives — the life of the wood and the life of the person holding it.',
      '',
      'Crafting these vessels requires a deep understanding of tension and moisture. Our artisans at The Atelier select wood that has aged for three seasons before the first cut is even made. The bowl used in this ritual was turned slowly, keeping the walls thick enough for insulation but thin enough to feel light, almost weightless, when empty.',
      '',
      'It is not just about the object; it is about the stillness it demands. You cannot rush a tea bowl. It requires two hands to hold properly. It requires you to sit, to breathe, and to wait for the tea to reach the temperature the wood suggests. In this waiting, the day begins to take shape — not with anxiety, but with intention.',
      '',
      '## The Grain Remembers',
      '',
      'Every bowl we turn tells the story of where the tree stood. An oak grown on a south-facing slope shows tighter rings — it worked harder against the wind. A walnut from a forest floor grows with wider rings, nourished by deep roots and fallen leaves. When you hold such a bowl, you are holding that particular history.',
      '',
      'We believe this matters. The objects we surround ourselves with shape the quality of our attention. A bowl that carries history invites you to slow down. It asks you to notice.',
    ].join('\n'),
  },
  {
    id: ulid(),
    title: 'Understanding Oak',
    slug: 'understanding-oak',
    excerpt: 'A material that ages with you — the touch of the chisel, deep and enduring durability.',
    author: 'Maren Lindqvist',
    cover_image_url: 'https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=1600&q=80',
    status: 'published',
    published_at: '2024-08-15T08:00:00Z',
    tags: JSON.stringify(['materials', 'oak', 'craft']),
    content: [
      'Oak is perhaps the most storied of all woods used in the craft of object-making. Its grain is pronounced, its weight reassuring, and its durability legendary. But to work with oak is to accept a partnership — the wood has opinions, and the maker must listen.',
      '',
      'When we select an oak board at The Atelier, we spend time with it before we begin. We look at how the grain runs, where the knots live, how the figure catches the light. This is not sentimentality. It is practical wisdom. A piece of oak that is forced into a form it resists will eventually tell you — through crack, through movement, through a surface that never quite settles.',
      '',
      '## The Patience of the Material',
      '',
      'Oak requires patience in curing. We air-dry our timber for a minimum of two years per inch of thickness before it comes near a lathe or a plane. This slow drying allows the wood to release its tension gradually, to settle into its own nature.',
      '',
      '## How Oak Ages',
      '',
      'Unlike many materials, oak does not simply wear — it develops. The surface of an oak bowl used daily for a year will show a patina that no finishing process can replicate. The areas held most often will darken first. The grain will begin to emerge more clearly as the surface is worked by touch.',
      '',
      'This is the promise of quality wood objects: they become more themselves over time, not less. They carry the record of their use without embarrassment.',
    ].join('\n'),
  },
  {
    id: ulid(),
    title: 'Restoring the Grove',
    slug: 'restoring-the-grove',
    excerpt: 'Planting more than we harvest — our circular commitment to the forests that sustain our craft.',
    author: 'The Woodenly Atelier',
    cover_image_url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=1600&q=80',
    status: 'published',
    published_at: '2024-07-01T08:00:00Z',
    tags: JSON.stringify(['sustainability', 'forest', 'commitment']),
    content: [
      'Every piece of wood we turn was once a living tree. This is not a fact we take lightly, nor is it one we allow to become abstract in the business of making things. The forest is not a warehouse. It is a community of organisms with its own logic, its own timescale, its own memory.',
      '',
      'Our sourcing policy is simple in principle and demanding in practice: we only use timber from forests managed with a strict replanting programme, and we plant three trees for every one we consume.',
      '',
      '## Why This Matters to Us',
      '',
      'There is no craft without material. And there is no material without the land that produced it. We are not neutral parties in this relationship — we are active participants, and we want to be beneficial ones.',
      '',
      '## The Long View',
      '',
      'A tree planted today will not be harvested for timber in our lifetimes. Perhaps not in our children\'s lifetimes. This is an act of faith — a commitment to a future we will not see.',
      '',
      'This is the spirit of slow living made material. To plant a tree is to acknowledge that the world does not begin and end with you. It is an optimistic act, a statement of trust in the continuation of things.',
      '',
      'When you choose an object made from traceable, certified timber, you are voting for this approach. Thank you for that. It matters to us too.',
    ].join('\n'),
  },
];

(async () => {
  const client = new Client({ connectionString: DB_URL });
  await client.connect();
  console.log('Connected to DB');

  // Update hero banner
  const bannerRes = await client.query("SELECT id FROM cms_banner WHERE key = 'hero' LIMIT 1");
  if (bannerRes.rows.length) {
    await client.query(
      "UPDATE cms_banner SET headline=$1, text=$2, cta_text=$3, cta_link=$4, image_url=$5 WHERE key='hero'",
      [
        'Live gently. Live woodenly.',
        'Handcrafted wooden objects for a quieter, more intentional life.',
        'Enter the moment \u2192',
        '/store',
        'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1600&q=80',
      ]
    );
    console.log('Updated hero banner');
  }

  for (const post of posts) {
    const exists = await client.query('SELECT id FROM cms_blog_post WHERE slug = $1', [post.slug]);
    if (!exists.rows.length) {
      await client.query(
        `INSERT INTO cms_blog_post
          (id, title, slug, excerpt, content, cover_image_url, author, status, published_at, tags, created_at, updated_at)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)`,
        [post.id, post.title, post.slug, post.excerpt, post.content,
         post.cover_image_url, post.author, post.status, post.published_at,
         post.tags, now, now]
      );
      console.log('Inserted:', post.slug);
    } else {
      console.log('Already exists:', post.slug);
    }
  }

  await client.end();
  console.log('Done');
})().catch(e => { console.error(e.message); process.exit(1); });
