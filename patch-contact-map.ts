// One-off — appends a mapEmbedSection to the contact page below the
// contact form. Idempotent: skips if a mapEmbedSection already exists on
// the page.
//
// Run (staging):
//   SANITY_STUDIO_DATASET=staging pnpm sanity exec patch-contact-map.ts --with-user-token
// Run (production — requires explicit opt-in):
//   CONFIRM_PRODUCTION=yes SANITY_STUDIO_DATASET=production pnpm sanity exec patch-contact-map.ts --with-user-token
import { getCliClient } from 'sanity/cli'

const client = getCliClient()
const dataset = client.config().dataset

if (dataset === 'production' && process.env.CONFIRM_PRODUCTION !== 'yes') {
  console.error(
    'Refusing to patch page-contact on production.\n' +
      'Re-run with:\n' +
      '  CONFIRM_PRODUCTION=yes SANITY_STUDIO_DATASET=production pnpm sanity exec patch-contact-map.ts --with-user-token'
  )
  process.exit(1)
}

const EMBED_URL =
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3097.3660224124865!2d-108.53858382348811!3d39.0753597361832!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x87471c3ce066e819%3A0xa115f38d383b22ba!2s2511%20Belford%20Ave%2C%20Grand%20Junction%2C%20CO%2081501!5e0!3m2!1sen!2sus!4v1781293306311!5m2!1sen!2sus'

type Section = { _type: string; _key: string; embedUrl?: string; title?: string }
// `_type` is included because these scripts fetch whole documents (no GROQ
// projection) and hand them straight to createOrReplace, which requires it.
type PageDoc = { _id: string; _type: string; _rev: string; sections: Section[] }

async function run() {
  console.log(`Patching page-contact on dataset: ${dataset}`)
  const doc = await client.fetch<PageDoc | null>('*[_id == "page-contact"][0]')
  if (!doc) {
    console.error('page-contact not found')
    process.exit(1)
  }

  const existing = doc.sections.find((s) => s._type === 'mapEmbedSection')
  if (existing) {
    existing.embedUrl = EMBED_URL
    existing.title = existing.title || 'The Joseph Center location map'
    console.log('  Map section already present — updated embedUrl in place.')
  } else {
    doc.sections.push({
      _type: 'mapEmbedSection',
      _key: 'contact-map',
      embedUrl: EMBED_URL,
      title: 'The Joseph Center location map',
    })
    console.log('  Appended new mapEmbedSection (key: contact-map).')
  }

  await client.createOrReplace(doc)
  await client.delete('drafts.page-contact').catch(() => {})
  console.log('Done.')
}

run().catch((err) => {
  console.error('patch-contact-map failed:', err.message)
  process.exit(1)
})
