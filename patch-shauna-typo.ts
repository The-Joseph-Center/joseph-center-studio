// One-off fix — the testimonial title in production was "Andrew and Shauna";
// the correct spelling is "Andrew and Shawna". Patches the staging doc that
// was copied from production by copy-testimonials-from-production.ts.
//
// NOTE: production still has the typo. To fix there, re-run with
//   CONFIRM_PRODUCTION=yes SANITY_STUDIO_DATASET=production pnpm sanity exec patch-shauna-typo.ts --with-user-token
//
// Run: SANITY_STUDIO_DATASET=staging pnpm sanity exec patch-shauna-typo.ts --with-user-token
import { getCliClient } from 'sanity/cli'

const client = getCliClient()
const dataset = client.config().dataset

if (dataset === 'production' && process.env.CONFIRM_PRODUCTION !== 'yes') {
  console.error(
    'Refusing to patch production. Re-run with CONFIRM_PRODUCTION=yes if you really mean to.'
  )
  process.exit(1)
}

async function run() {
  console.log(`Fixing Shauna → Shawna on dataset: ${dataset}`)
  const result = await client
    .patch('abeba357-6f4c-4e85-9e21-0fd7c8a01898')
    .set({ title: 'Andrew and Shawna' })
    .commit()
  console.log(`Updated doc ${result._id}: title is now "${(result as any).title}"`)
}

run().catch((err) => {
  console.error('patch-shauna-typo failed:', err.message)
  process.exit(1)
})
