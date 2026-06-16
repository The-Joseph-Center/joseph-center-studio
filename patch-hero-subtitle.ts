// One-off — adds "The Joseph Center" as the subtitle on the home hero,
// and updates the Our Vision body on both page-home and page-our-story
// to open with "The Joseph Center" instead of "We". Fetches each doc,
// mutates, createOrReplace — safer than path-based set() for the deeply
// nested Portable Text edit.
//
// Run (staging):
//   SANITY_STUDIO_DATASET=staging pnpm sanity exec patch-hero-subtitle.ts --with-user-token
// Run (production — requires explicit opt-in):
//   CONFIRM_PRODUCTION=yes SANITY_STUDIO_DATASET=production pnpm sanity exec patch-hero-subtitle.ts --with-user-token
import { getCliClient } from 'sanity/cli'

const client = getCliClient()
const dataset = client.config().dataset

if (dataset === 'production' && process.env.CONFIRM_PRODUCTION !== 'yes') {
  console.error(
    'Refusing to patch page-home on production.\n' +
      'If you really mean to do this, re-run with:\n' +
      '  CONFIRM_PRODUCTION=yes SANITY_STUDIO_DATASET=production pnpm sanity exec patch-hero-subtitle.ts --with-user-token'
  )
  process.exit(1)
}

const HERO_SUBTITLE = 'The Joseph Center'
const VISION_OLD_PREFIX = 'We support people'
const VISION_NEW_TEXT =
  'The Joseph Center supports people in need of hope by restoring dignity through resources and encouragement to regain a sense of belonging to the greater community.'

type Span = { _type: 'span'; _key?: string; text: string; marks?: string[] }
type Block = { _type: 'block'; _key?: string; style?: string; children: Span[] }
type Section = {
  _type: string
  _key: string
  subtitle?: string
  heading?: string
  body?: Block[]
}
type PageDoc = { _id: string; _rev: string; sections: Section[] }

function patchVision(section: Section): 'updated' | 'already-current' | 'skipped' {
  if (section._type !== 'textContent' || section.heading !== 'Our Vision' || !section.body) return 'skipped'
  const firstSpan = section.body[0]?.children?.[0]
  if (!firstSpan) return 'skipped'
  if (firstSpan.text === VISION_NEW_TEXT) return 'already-current'
  if (firstSpan.text?.startsWith(VISION_OLD_PREFIX)) {
    firstSpan.text = VISION_NEW_TEXT
    return 'updated'
  }
  return 'skipped'
}

async function patchPageHome() {
  console.log('→ page-home')
  const doc = await client.fetch<PageDoc | null>('*[_id == "page-home"][0]')
  if (!doc) {
    console.warn('  page-home not found — skipping')
    return
  }
  let heroPatched = false
  let visionResult: ReturnType<typeof patchVision> = 'skipped'
  for (const section of doc.sections) {
    if (section._type === 'heroSection' && !heroPatched) {
      section.subtitle = HERO_SUBTITLE
      heroPatched = true
    }
    const r = patchVision(section)
    if (r !== 'skipped') visionResult = r
  }
  await client.createOrReplace(doc)
  await client.delete('drafts.page-home').catch(() => {})
  console.log(`  hero subtitle: ${heroPatched ? 'set' : 'no heroSection found'}`)
  console.log(`  vision body: ${visionResult}`)
}

async function patchPageOurStory() {
  console.log('→ page-our-story')
  const doc = await client.fetch<PageDoc | null>('*[_id == "page-our-story"][0]')
  if (!doc) {
    console.warn('  page-our-story not found — skipping')
    return
  }
  let visionResult: ReturnType<typeof patchVision> = 'skipped'
  for (const section of doc.sections) {
    const r = patchVision(section)
    if (r !== 'skipped') visionResult = r
  }
  await client.createOrReplace(doc)
  await client.delete('drafts.page-our-story').catch(() => {})
  console.log(`  vision body: ${visionResult}`)
}

async function run() {
  console.log(`Patching pages on dataset: ${dataset}`)
  await patchPageHome()
  await patchPageOurStory()
  console.log('Done.')
}

run().catch((err) => {
  console.error('patch-hero-subtitle failed:', err.message)
  process.exit(1)
})
