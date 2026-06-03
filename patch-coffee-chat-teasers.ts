// One-off — inserts a latestCoffeeChatSection on:
//   page-home        → just before the partnersSection
//   page-our-story   → just before the dualCtaSection (after the diagonal narrative)
//   page-testimonies → at the end (after the video grid)
//
// Idempotent: if a latestCoffeeChatSection already exists on a page, the
// script skips inserting and reports it.
//
// Run: SANITY_STUDIO_DATASET=staging pnpm sanity exec patch-coffee-chat-teasers.ts --with-user-token
import { getCliClient } from 'sanity/cli'

const client = getCliClient()
const dataset = client.config().dataset

if (dataset === 'production' && process.env.CONFIRM_PRODUCTION !== 'yes') {
  console.error(
    'Refusing to patch pages on production.\n' +
      'If you really mean to do this, re-run with:\n' +
      '  CONFIRM_PRODUCTION=yes SANITY_STUDIO_DATASET=production pnpm sanity exec patch-coffee-chat-teasers.ts --with-user-token'
  )
  process.exit(1)
}

interface Section {
  _key?: string
  _type?: string
  [k: string]: unknown
}

interface PageDoc {
  _id: string
  sections?: Section[]
  [k: string]: unknown
}

function teaserFor(page: 'home' | 'our-story' | 'testimonies'): Section {
  const overrides: Record<typeof page, { heading: string; subtext: string }> = {
    home: {
      heading: 'Latest from Coffee Chat with Mona',
      subtext:
        'Honest conversations about hope, homelessness, and the people The Joseph Center is honored to serve.',
    },
    'our-story': {
      heading: 'Listen to Mona on Coffee Chat',
      subtext:
        "Mona's video series — guests, partners, and conversations about the work and the people behind it.",
    },
    testimonies: {
      heading: 'More Stories on Coffee Chat',
      subtext:
        'Long-form conversations with guests, partners, and friends of The Joseph Center.',
    },
  }
  const { heading, subtext } = overrides[page]
  return {
    _key: `coffee-teaser-${page}`,
    _type: 'latestCoffeeChatSection',
    heading,
    subtext,
    ctaLabel: 'Watch All Episodes →',
  }
}

async function patchPage(
  pageId: string,
  variant: 'home' | 'our-story' | 'testimonies',
  insertBefore: string[] | 'end'
) {
  const doc = await client.fetch<PageDoc | null>(
    `*[_id == $id][0]{ _id, sections, _type, title, slug }`,
    { id: pageId }
  )

  if (!doc) {
    console.log(`  ⨯ ${pageId} not found — skipping`)
    return
  }

  const sections = [...(doc.sections ?? [])]

  if (sections.some((s) => s._type === 'latestCoffeeChatSection')) {
    console.log(`  • ${pageId}: teaser already present, skipping`)
    return
  }

  const teaser = teaserFor(variant)

  let insertAt = sections.length
  if (insertBefore !== 'end') {
    const targetIdx = sections.findIndex(
      (s) => s._type && insertBefore.includes(s._type)
    )
    if (targetIdx >= 0) insertAt = targetIdx
  }

  sections.splice(insertAt, 0, teaser)

  await client
    .patch(pageId)
    .set({ sections })
    .commit()

  await client.delete(`drafts.${pageId}`).catch(() => {})

  console.log(
    `  ✓ ${pageId}: inserted teaser at index ${insertAt} of ${sections.length} sections`
  )
}

async function run() {
  console.log(`Inserting Coffee Chat teasers on dataset: ${dataset}`)
  await patchPage('page-home', 'home', ['partnersSection'])
  await patchPage('page-our-story', 'our-story', ['dualCtaSection'])
  await patchPage('page-testimonies', 'testimonies', 'end')
  console.log('Done.')
}

run().catch((err) => {
  console.error('patch-coffee-chat-teasers failed:', err.message)
  process.exit(1)
})
