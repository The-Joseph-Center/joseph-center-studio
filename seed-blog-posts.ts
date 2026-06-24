// One-shot seed for sample blog posts on STAGING.
// Idempotent: uses createIfNotExists keyed by _id. Re-running is a no-op.
//
//   SANITY_STUDIO_DATASET=staging pnpm sanity exec ./seed-blog-posts.ts --with-user-token
//
// All content goes to staging only. Production is intentionally untouched.

import { getCliClient } from 'sanity/cli';

const client = getCliClient();

type Span = { _key: string; _type: 'span'; text: string; marks?: string[] };
type Block = {
  _key: string;
  _type: 'block';
  style?: 'normal' | 'h2' | 'h3' | 'h4' | 'blockquote';
  markDefs?: unknown[];
  children: Span[];
};

const span = (key: string, text: string, marks: string[] = []): Span => ({
  _key: key,
  _type: 'span',
  text,
  marks,
});

const p = (key: string, text: string, marks: string[] = []): Block => ({
  _key: key,
  _type: 'block',
  style: 'normal',
  markDefs: [],
  children: [span(`${key}s`, text, marks)],
});

const h = (
  key: string,
  text: string,
  style: 'h2' | 'h3' | 'h4' = 'h2'
): Block => ({
  _key: key,
  _type: 'block',
  style,
  markDefs: [],
  children: [span(`${key}s`, text)],
});

const li = (key: string, text: string): Block => ({
  _key: key,
  _type: 'block',
  style: 'normal',
  markDefs: [],
  children: [span(`${key}s`, text)],
  // Sanity recognizes listItem on blocks; cast for the local typing
  ...({ listItem: 'bullet', level: 1 } as object),
});

// --- POST 1 — June 2026 Newsletter Recap (from the screenshots) -------------

const newsletterBody: Block[] = [
  h('nl-h1', 'Be Just Josè: She Never Lost Her Smile', 'h2'),
  p(
    'nl-p1',
    'Josè came to the Western Slope from Mexico twenty-three years ago and has been part of the rhythm of this community ever since. When life shifted under her in the span of a few months — health, family, work — she didn\'t know where to turn. A neighbor pointed her toward The Joseph Center.'
  ),
  p(
    'nl-p2',
    'Today, Josè has steady footing again: stable housing, reliable income, and a quiet confidence she had almost forgotten. Through it all, she never lost her smile.'
  ),
  p('nl-p3', 'Watch her full story on Coffee Chat with Mona →'),

  h('nl-h2', 'Where No Parent Walks Alone: The Family Center', 'h2'),
  p(
    'nl-p4',
    'The court system is hard enough to navigate when you have ample resources. Without them, it can feel impossible.'
  ),
  p(
    'nl-p5',
    'The Family Center provides resources, advocacy, and emotional support for parents navigating custody and dependency-and-neglect cases — for fathers and mothers, whether they are appearing in family court themselves, supporting a partner who is, or stepping into custody for a child in crisis.'
  ),
  p(
    'nl-p6',
    'We are 100% community & foundation funded. Donating to The Joseph Center\'s Family Center provides:'
  ),
  li('nl-l1', 'Family engagement meetings (FEM) and home visits for reunification'),
  li('nl-l2', 'Life skills, peer-to-peer mentoring, and community connection'),
  li('nl-l3', 'Support groups and assistance programs'),
  li('nl-l4', '1-on-1 case management with caring, compassionate staff'),

  h('nl-h3', 'June Impact & May Videos', 'h2'),
  h('nl-h4', 'This Month in Numbers', 'h3'),
  li('nl-n1', 'Meals served at the Day Shelter'),
  li('nl-n2', 'Walk-ins welcomed for community resources'),
  li('nl-n3', 'New clients beginning case management'),
  li('nl-n4', 'Clients maintaining financial stability through IFS'),
  p(
    'nl-p7',
    'Exact totals for June will be added once the month closes — we\'ll update this post when numbers are in.',
    ['em']
  ),

  h('nl-h5', "This Month's Coffee Chat Episodes", 'h3'),
  li('nl-c1', 'Watch: "Be Just Josè: The Girl That\'s Always Smiling" — Coffee Chat with Mona'),
  li('nl-c2', 'Watch: "I Saved Everything Away and Started Over — Because I Knew I\'d Get It Back" — Bonus content'),
  li('nl-c3', 'Watch short: Bible\'s story at The Joseph Center\'s Family Center'),
  li('nl-c4', 'Watch short: "I had to make a choice"'),
  li('nl-c5', 'Watch short: "Stability keeps you on the path"'),

  h('nl-h6', 'Become a Stability Partner', 'h2'),
  p(
    'nl-p8',
    'The Joseph Center is a bridge that helps families and individuals move from crisis to stability across the Western Slope of Colorado. Every bridge needs supporters to keep it strong and standing.'
  ),
  p(
    'nl-p9',
    'Right now we\'re in the middle of our Bridge to Stability campaign, raising the community support we need to make sure every person who walks across our bridge has firm ground on the other side.'
  ),
  p('nl-p10', 'Your monthly partnership strengthens the bridge:'),
  li('nl-s1', '$15/month feeds one person facing hunger'),
  li('nl-s2', '$25/month supports a parent navigating the court system'),
  li('nl-s3', '$50/month covers a person\'s first month of stability in crisis'),
  li('nl-s4', '$100/month provides comprehensive case management for someone in crisis'),
  p(
    'nl-p11',
    'Every recurring gift creates predictable stability — for our guests, and for our ability to stand here with confidence and say "yes" when someone needs help.'
  ),

  h('nl-h7', 'Building Community Support Together', 'h2'),
  p(
    'nl-p12',
    'We\'re deeply grateful to the foundation partners who believe in our mission and make our work possible.'
  ),
  h('nl-h8', "This Quarter's Foundation Partners", 'h3'),
  li('nl-f1', 'Western Colorado Community Foundation'),
  li('nl-f2', 'Colorado Health Foundation'),
  p(
    'nl-p13',
    'Can\'t donate right now? Volunteering is just as valuable. We\'re especially looking for a photographer to capture life at The Joseph Center — around 60–75 images monthly. We\'ll credit your work.'
  ),
  p(
    'nl-p14',
    'The Joseph Center is a bridge. Whether you give, volunteer, or simply share our story, you\'re helping strengthen the pathway from crisis to stability for families across the Western Slope.'
  ),
  p('nl-p15', 'Thank you for being part of this community.'),
  p('nl-p16', 'Gratefully, The Joseph Center Team', ['em']),
];

// --- POST 2 — Short article on the Bridge to Stability campaign --------------

const bridgeBody: Block[] = [
  p(
    'br-p1',
    'A bridge only works when both sides hold. The Joseph Center has spent years building the bridge from crisis to stability — but every bridge needs ground crew. That\'s where Stability Partners come in.'
  ),
  h('br-h1', 'Why monthly matters', 'h3'),
  p(
    'br-p2',
    'Recurring gifts give us something one-time donations cannot: the ability to say "yes" immediately when a parent calls at 4pm needing groceries for the weekend, when a guest at the Day Shelter needs a bus pass to make their job interview, when a veteran needs help untangling benefits before rent is due.'
  ),
  p(
    'br-p3',
    'Predictable income lets us hold staffing, hold open doors, and hold space for people in the middle of the hardest weeks of their lives.'
  ),
  h('br-h2', 'What your monthly gift does', 'h3'),
  li('br-l1', '$15/month feeds one person facing hunger'),
  li('br-l2', '$25/month supports a parent navigating the family court system'),
  li('br-l3', '$50/month covers a person\'s first month of stability in crisis'),
  li('br-l4', '$100/month provides comprehensive case management'),
  p(
    'br-p4',
    'Whatever amount fits your life, the math is the same: a few dollars a month, multiplied across a community that shows up, is what holds the bridge in place.'
  ),
];

// --- POST 3 — Programs spotlight: Day Shelter ---------------------------------

const dayShelterBody: Block[] = [
  p(
    'ds-p1',
    'On any given morning at the Day Shelter, you\'ll find people who don\'t fit a single story. A construction worker between jobs, waiting for a paycheck that\'s a week late. A grandmother riding two buses to pick up a prescription. A young veteran who slept in his truck again last night and needed somewhere warm to think.'
  ),
  h('ds-h1', 'What the Day Shelter is — and isn\'t', 'h3'),
  p(
    'ds-p2',
    'The Day Shelter isn\'t emergency housing. It\'s a daytime space — open, warm, and staffed — where anyone on the Western Slope navigating a hard season can land for a few hours, get a meal, use the showers and laundry, and connect with case management if they want it.'
  ),
  p(
    'ds-p3',
    'No paperwork at the door. No qualifying questions. The work starts with the relationship.'
  ),
  h('ds-h2', 'How to help', 'h3'),
  p(
    'ds-p4',
    'The Day Shelter runs on community support: meals donated by local restaurants, hygiene kits assembled by volunteers, and the steady gifts of Stability Partners. If you\'re looking for a tangible way to plug in, the Day Shelter is one of the most direct.'
  ),
];

// ----------------------------------------------------------------------------

const posts = [
  {
    _id: 'post-newsletter-june-2026',
    _type: 'post',
    title: 'June 2026 Newsletter: Be Just Josè, the Family Center, and the Bridge to Stability',
    slug: { current: 'june-2026-newsletter', _type: 'slug' },
    postType: 'newsletter',
    author: { _type: 'reference', _ref: 'author-jc' },
    excerpt:
      "Josè's story, a closer look at the Family Center, May's impact numbers, and how the Bridge to Stability campaign is building monthly community support.",
    category: 'Newsletter',
    publishedAt: '2026-06-20',
    body: newsletterBody,
    tags: ['newsletter', 'family-center', 'stability-partners', 'coffee-chat'],
  },
  {
    _id: 'post-bridge-to-stability',
    _type: 'post',
    title: 'Bridge to Stability: Why Monthly Giving Holds the Whole Thing Up',
    slug: { current: 'bridge-to-stability', _type: 'slug' },
    postType: 'manual',
    excerpt:
      "Recurring gifts give The Joseph Center the one thing one-time donations cannot — the ability to say yes the moment someone calls.",
    category: 'Community',
    publishedAt: '2026-06-12',
    body: bridgeBody,
    tags: ['giving', 'stability-partners', 'campaign'],
  },
  {
    _id: 'post-day-shelter-spotlight',
    _type: 'post',
    title: 'A Morning at the Day Shelter: Who Walks Through the Door',
    slug: { current: 'day-shelter-spotlight', _type: 'slug' },
    postType: 'manual',
    excerpt:
      'The Day Shelter is a daytime space — no paperwork at the door, no qualifying questions. The work starts with the relationship.',
    category: 'Programs',
    publishedAt: '2026-05-28',
    body: dayShelterBody,
    tags: ['day-shelter', 'programs'],
  },
];

async function run() {
  const ds = (client.config() as { dataset?: string }).dataset ?? '(unknown)';
  if (ds !== 'staging') {
    console.error(`Refusing to seed: dataset=${ds}. Run with SANITY_STUDIO_DATASET=staging.`);
    process.exit(1);
  }
  for (const p of posts) {
    const result = await client.createIfNotExists(p as unknown as { _id: string; _type: string });
    const created = result._createdAt === result._updatedAt;
    console.log(`${created ? 'created' : 'exists '}  ${p._id}  ${p.title}`);
  }
  console.log('Done.');
}

run().catch((err: Error) => {
  console.error(err.message);
  process.exit(1);
});
