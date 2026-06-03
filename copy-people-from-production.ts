// One-off script — copies all `staff` and `board` documents from the
// production dataset into the destination dataset (typically staging).
//
// IMPORTANT: Image asset references are dataset-scoped in Sanity. The docs
// will land with their production asset _refs intact, but the underlying
// image binaries won't resolve in the destination dataset until assets are
// also synced. PersonCard.vue degrades gracefully — broken images fall back
// to a deep-green placeholder showing the person's first initial.
//
// Run: SANITY_STUDIO_DATASET=staging pnpm sanity exec copy-people-from-production.ts --with-user-token
import { getCliClient } from 'sanity/cli'

const destClient = getCliClient()
const destDataset = destClient.config().dataset

if (destDataset === 'production') {
  console.error('Destination dataset is production — refusing. This script copies INTO a dataset, not out of one.')
  process.exit(1)
}

// Read from production; write to whatever the destination is configured to be.
const sourceClient = destClient.withConfig({ dataset: 'production', useCdn: false })

interface PersonDoc {
  _id: string
  _type: 'staff' | 'board'
  [k: string]: unknown
}

async function run() {
  console.log(`Copying staff + board docs: production → ${destDataset}`)

  const docs = (await sourceClient.fetch<PersonDoc[]>(
    `*[_type in ["staff", "board"]]`
  )) as PersonDoc[]

  if (!docs.length) {
    console.log('No staff/board docs found in production. Nothing to copy.')
    return
  }

  console.log(`Found ${docs.length} doc(s):`)
  for (const d of docs) console.log(`  ${d._type}: ${d._id} (${(d as any).name ?? '?'})`)

  // Strip system fields and the image field. Sanity validates asset refs on
  // mutation and rejects docs that point to assets missing from the dataset,
  // so leaving image refs intact would fail the whole transaction. Photos
  // are re-uploaded via Studio (or via a separate asset-sync) later.
  const tx = destClient.transaction()
  let stripped = 0
  for (const d of docs) {
    const { _rev, _createdAt, _updatedAt, image, ...rest } = d as Record<string, unknown> & PersonDoc
    void _rev; void _createdAt; void _updatedAt
    if (image) stripped++
    tx.createOrReplace(rest as PersonDoc)
  }

  await tx.commit()
  console.log(`Done. ${docs.length} doc(s) upserted into ${destDataset}.`)
  console.log(`Stripped image field from ${stripped} doc(s) (asset refs don't resolve cross-dataset).`)
  console.log('Photos can be re-uploaded via Studio, or sync the underlying assets separately.')
}

run().catch((err) => {
  console.error('copy-people-from-production failed:', err.message)
  process.exit(1)
})
