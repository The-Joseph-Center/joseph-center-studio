// One-off script — copies all `events` (lowercase plural _type) docs from the
// production dataset into the destination dataset (typically staging).
//
// Image refs (`image` on the doc, `logo` inside sponsors[]) are stripped on
// copy. Sanity asset references are dataset-scoped and the mutation API
// rejects cross-dataset refs (verified during the staff/board/testimonials
// copies). The frontend renders gracefully when images are absent.
//
// Run: SANITY_STUDIO_DATASET=staging pnpm sanity exec copy-events-from-production.ts --with-user-token
import { getCliClient } from 'sanity/cli'

const destClient = getCliClient()
const destDataset = destClient.config().dataset

if (destDataset === 'production') {
  console.error('Destination dataset is production — refusing. This script copies INTO a dataset, not out of one.')
  process.exit(1)
}

const sourceClient = destClient.withConfig({ dataset: 'production', useCdn: false })

interface EventDoc {
  _id: string
  _type: 'events'
  sponsors?: { _key?: string; name?: string; website?: string; logo?: unknown }[]
  [k: string]: unknown
}

async function run() {
  console.log(`Copying events docs: production → ${destDataset}`)

  const docs = await sourceClient.fetch<EventDoc[]>(`*[_type == "events"]`)

  if (!docs.length) {
    console.log('No events docs found in production. Nothing to copy.')
    return
  }

  console.log(`Found ${docs.length} doc(s):`)
  for (const d of docs) console.log(`  ${d._id}: ${(d as any).title ?? '?'}`)

  const tx = destClient.transaction()
  let docImagesStripped = 0
  let sponsorLogosStripped = 0

  for (const d of docs) {
    const { _rev, _createdAt, _updatedAt, image, sponsors, ...rest } =
      d as Record<string, unknown> & EventDoc
    void _rev; void _createdAt; void _updatedAt

    if (image) docImagesStripped++

    // Sanitize sponsors[] — drop the logo image ref from each sponsor.
    let cleanedSponsors: unknown = undefined
    if (Array.isArray(sponsors)) {
      cleanedSponsors = sponsors.map((s) => {
        const { logo, ...sponsorRest } = s as Record<string, unknown>
        if (logo) sponsorLogosStripped++
        return sponsorRest
      })
    }

    const next: Record<string, unknown> = { ...rest }
    if (cleanedSponsors !== undefined) next.sponsors = cleanedSponsors

    tx.createOrReplace(next as EventDoc)
  }

  await tx.commit()
  console.log(`Done. ${docs.length} doc(s) upserted into ${destDataset}.`)
  console.log(`Stripped image field from ${docImagesStripped} doc(s); ${sponsorLogosStripped} sponsor logo(s) removed.`)
}

run().catch((err) => {
  console.error('copy-events-from-production failed:', err.message)
  process.exit(1)
})
