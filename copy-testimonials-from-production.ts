// One-off script — copies all `testimonialvideo` documents from the
// production dataset into the destination dataset (typically staging).
//
// Image refs are stripped on copy. Sanity asset references are dataset-scoped
// and the mutation API rejects cross-dataset refs (verified during the
// board/staff copy). The frontend's VideoCard.vue gracefully falls back to
// the YouTube CDN thumbnail when the Sanity image is absent.
//
// Run: SANITY_STUDIO_DATASET=staging pnpm sanity exec copy-testimonials-from-production.ts --with-user-token
import { getCliClient } from 'sanity/cli'

const destClient = getCliClient()
const destDataset = destClient.config().dataset

if (destDataset === 'production') {
  console.error('Destination dataset is production — refusing. This script copies INTO a dataset, not out of one.')
  process.exit(1)
}

const sourceClient = destClient.withConfig({ dataset: 'production', useCdn: false })

interface TestimonialDoc {
  _id: string
  _type: 'testimonialvideo'
  [k: string]: unknown
}

async function run() {
  console.log(`Copying testimonialvideo docs: production → ${destDataset}`)

  const docs = await sourceClient.fetch<TestimonialDoc[]>(`*[_type == "testimonialvideo"]`)

  if (!docs.length) {
    console.log('No testimonialvideo docs found in production. Nothing to copy.')
    return
  }

  console.log(`Found ${docs.length} doc(s):`)
  for (const d of docs) console.log(`  ${d._id}: ${(d as any).title ?? '?'}`)

  const tx = destClient.transaction()
  let stripped = 0
  for (const d of docs) {
    const { _rev, _createdAt, _updatedAt, image, ...rest } = d as Record<string, unknown> & TestimonialDoc
    void _rev; void _createdAt; void _updatedAt
    if (image) stripped++
    tx.createOrReplace(rest as TestimonialDoc)
  }

  await tx.commit()
  console.log(`Done. ${docs.length} doc(s) upserted into ${destDataset}.`)
  console.log(`Stripped image field from ${stripped} doc(s) — VideoCard.vue falls back to YouTube CDN thumbnails.`)
}

run().catch((err) => {
  console.error('copy-testimonials-from-production failed:', err.message)
  process.exit(1)
})
