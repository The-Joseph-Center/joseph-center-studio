// One-off — creates 3 placeholder `events` docs in staging so the
// /events page renders with realistic content while you tune the layout.
//
// Identifiers and titles are prefixed `[TEST]` / `event-fake-*` so they're
// easy to spot in Studio and delete afterward.
//
// Run: SANITY_STUDIO_DATASET=staging pnpm sanity exec patch-fake-events.ts --with-user-token
import { getCliClient } from 'sanity/cli'

const client = getCliClient()
const dataset = client.config().dataset

if (dataset === 'production' && process.env.CONFIRM_PRODUCTION !== 'yes') {
  console.error(
    'Refusing to seed fake events on production.\n' +
      'If you really mean to do this, re-run with:\n' +
      '  CONFIRM_PRODUCTION=yes SANITY_STUDIO_DATASET=production pnpm sanity exec patch-fake-events.ts --with-user-token'
  )
  process.exit(1)
}

// ─── Portable text helpers ──────────────────────────────────────────────────
let k = 0
const key = () => `b${(++k).toString(36)}`

function block(text: string, style: 'normal' | 'h3' = 'normal') {
  return {
    _key: key(),
    _type: 'block',
    style,
    markDefs: [],
    children: [{ _key: key(), _type: 'span', text, marks: [] }],
  }
}

// ─── 3 fake events with varied shapes for layout testing ────────────────────
const fakeEvents = [
  {
    _type: 'events',
    _id: 'event-fake-pancake-breakfast',
    title: '[TEST] Community Pancake Breakfast',
    slug: { _type: 'slug', current: 'test-pancake-breakfast' },
    date: '2026-07-12T15:00:00.000Z', // Sat Jul 12, 9am MT
    alt: 'Family-style pancake breakfast at The Joseph Center',
    description: [
      block(
        'Join us for an all-you-can-eat pancake breakfast benefiting our day-shelter food program. Pancakes, sausage, coffee, juice — and a chance to meet the team and tour our facility.'
      ),
      block(
        'Tickets are $10 at the door, free for kids under 10. All proceeds go directly to weekly meal service.'
      ),
    ],
    location: [
      block('The Joseph Center, 2511 Belford Ave #9, Grand Junction, CO 81501'),
    ],
    ctaLabel: 'Register Today',
    ctaHref: '/contact',
    featured: true,
  },
  {
    _type: 'events',
    _id: 'event-fake-backpack-drive',
    title: '[TEST] Back-to-School Backpack Drive',
    slug: { _type: 'slug', current: 'test-backpack-drive' },
    date: '2026-08-15T16:00:00.000Z', // Sat Aug 15, 10am MT
    alt: 'Volunteers sorting school supplies for families',
    description: [
      block(
        'Drop off new or gently-used backpacks and school supplies anytime between 10am and 4pm. We pair every backpack with a family in our network ahead of the new school year.'
      ),
      block(
        "Most-needed items: lined notebooks, #2 pencils, glue sticks, kid-friendly scissors, and reusable water bottles. Can't make it in person? Use the Donate Supplies link to ship items directly."
      ),
    ],
    location: [
      block('Drop-off lobby at The Joseph Center, 2511 Belford Ave #9, Grand Junction, CO'),
    ],
    ctaLabel: 'Drop-off Details',
    ctaHref: '/contact',
    featured: false,
  },
  {
    _type: 'events',
    _id: 'event-fake-hope-gala',
    title: '[TEST] Annual Hope Gala',
    slug: { _type: 'slug', current: 'test-hope-gala' },
    date: '2026-10-04T01:00:00.000Z', // Sat Oct 3, 7pm MT
    alt: 'Annual Joseph Center gala',
    description: [
      block(
        'Our flagship fundraising evening — three courses, live music, and a brief program featuring stories from Golden Girls graduates and Family Center families.'
      ),
      block('Tables of eight are available for sponsoring partners. Individual tickets open three weeks before the event.'),
    ],
    location: [
      block('Two Rivers Convention Center — 159 Main St, Grand Junction, CO 81501'),
    ],
    invitation: [
      block(
        "Black-tie optional. Doors at 6pm, program begins at 7pm. Complimentary valet."
      ),
    ],
    ctaLabel: 'Sponsor a Table',
    ctaHref: '/contact',
    featured: false,
  },
]

async function run() {
  console.log(`Seeding ${fakeEvents.length} fake events on dataset: ${dataset}`)
  const tx = client.transaction()
  for (const ev of fakeEvents) {
    tx.delete(`drafts.${ev._id}`)
    tx.createOrReplace(ev)
    console.log(`  ✓ ${ev._id} — ${ev.title}`)
  }
  await tx.commit()
  console.log('Done. Hard-refresh /events to see them.')
  console.log(
    'To remove: search "event-fake-" in Studio and delete, OR run:\n' +
      '  pnpm sanity exec -e "client.delete({query:`*[_type==\\"events\\" && _id match \\"event-fake-*\\"]`})" --with-user-token'
  )
}

run().catch((err) => {
  console.error('patch-fake-events failed:', err.message)
  process.exit(1)
})
