// One-off — finds all draft board documents and publishes them. Used after
// editors upload photos in Studio without clicking Publish; the uploads sit
// in drafts.* but the frontend only sees the published versions via the CDN.
//
// Run: SANITY_STUDIO_DATASET=staging pnpm sanity exec publish-board-drafts.ts --with-user-token
import { getCliClient } from 'sanity/cli'

const client = getCliClient()
const dataset = client.config().dataset

if (dataset === 'production' && process.env.CONFIRM_PRODUCTION !== 'yes') {
  console.error(
    'Refusing to bulk-publish board drafts on production.\n' +
      'If you really mean to do this, re-run with:\n' +
      '  CONFIRM_PRODUCTION=yes SANITY_STUDIO_DATASET=production pnpm sanity exec publish-board-drafts.ts --with-user-token'
  )
  process.exit(1)
}

interface BoardDraft {
  _id: string
  _rev?: string
  _createdAt?: string
  _updatedAt?: string
  [key: string]: unknown
}

async function run() {
  console.log(`Scanning for board drafts on dataset: ${dataset}`)

  const drafts = await client.fetch<BoardDraft[]>(
    `*[_type == "board" && _id in path("drafts.**")]`
  )

  if (!drafts.length) {
    console.log('No board drafts found. Nothing to publish.')
    return
  }

  console.log(`Publishing ${drafts.length} draft(s):`)
  const tx = client.transaction()
  for (const draft of drafts) {
    const publishedId = draft._id.replace(/^drafts\./, '')
    const { _id, _rev, _createdAt, _updatedAt, ...content } = draft
    void _id; void _rev; void _createdAt; void _updatedAt

    console.log(`  ${publishedId} — ${(draft as any).name ?? '?'}`)

    // Overwrite the published doc with the draft's content, then delete the draft.
    tx.createOrReplace({ ...(content as Record<string, unknown>), _id: publishedId, _type: 'board' })
    tx.delete(draft._id)
  }

  await tx.commit()
  console.log(`\nDone. ${drafts.length} board doc(s) published.`)
  console.log('Hard-refresh /board on the frontend to see them.')
}

run().catch((err) => {
  console.error('publish-board-drafts failed:', err.message)
  process.exit(1)
})
