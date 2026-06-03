// One-off script — copies the production banner document into the
// destination dataset (typically staging).
//
// Run: SANITY_STUDIO_DATASET=staging pnpm sanity exec copy-banner-from-production.ts --with-user-token
import { getCliClient } from 'sanity/cli'

const destClient = getCliClient()
const destDataset = destClient.config().dataset

if (destDataset === 'production') {
  console.error('Destination dataset is production — refusing. This script copies INTO a dataset, not out of one.')
  process.exit(1)
}

const sourceClient = destClient.withConfig({ dataset: 'production', useCdn: false })

interface BannerDoc {
  _id: string
  _type: 'banner'
  [k: string]: unknown
}

async function run() {
  console.log(`Copying banner doc: production → ${destDataset}`)

  const docs = await sourceClient.fetch<BannerDoc[]>(`*[_type == "banner"]`)

  if (!docs.length) {
    console.log('No banner docs found in production. Nothing to copy.')
    return
  }

  const tx = destClient.transaction()
  for (const d of docs) {
    const { _rev, _createdAt, _updatedAt, ...rest } =
      d as Record<string, unknown> & BannerDoc
    void _rev; void _createdAt; void _updatedAt
    tx.createOrReplace(rest as BannerDoc)
    console.log(`  ${d._id}: ${(d as any).title ?? '?'}`)
  }

  await tx.commit()
  console.log(`Done. ${docs.length} doc(s) upserted into ${destDataset}.`)
}

run().catch((err) => {
  console.error('copy-banner-from-production failed:', err.message)
  process.exit(1)
})
