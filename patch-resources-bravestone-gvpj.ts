// Adds The Bravestone Project to the Resources page, and fills out the
// Grand Valley Peace & Justice entry that was already there.
//
// Every detail below was taken from the organizations' own websites on
// 15 October 2026, not from memory:
//   bravestoneproject.org/contact  — phone, email
//   gvpeacejustice.org             — phone, what they run
//
// The Joseph Center refers people to these pages, so a wrong number costs
// somebody a phone call they may not be able to make twice. Check both before
// running this, and again if it is run months from now.
//
// Run from studio/:
//   SANITY_STUDIO_DATASET=staging pnpm sanity exec patch-resources-bravestone-gvpj.ts --with-user-token
//   CONFIRM_PRODUCTION=yes SANITY_STUDIO_DATASET=production pnpm sanity exec patch-resources-bravestone-gvpj.ts --with-user-token
import { getCliClient } from 'sanity/cli'

const client = getCliClient()
const dataset = client.config().dataset

if (dataset === 'production' && process.env.CONFIRM_PRODUCTION !== 'yes') {
  console.error(
    'Refusing to patch resources on production.\n' +
      '  CONFIRM_PRODUCTION=yes SANITY_STUDIO_DATASET=production pnpm sanity exec patch-resources-bravestone-gvpj.ts --with-user-token'
  )
  process.exit(1)
}

async function run() {
  console.log(`Dataset: ${dataset}`)

  // New. Denise told this story on the August Coffee Chat; the contact details
  // are from the organization's own contact page.
  await client.createOrReplace({
    _id: 'resource-bravestone-project',
    _type: 'resource',
    title: 'The Bravestone Project',
    url: 'https://bravestoneproject.org',
    description:
      'Trauma-informed, survivor-centered support for survivors of human trafficking and sexual trauma, including peer support, advocacy and community education.',
    category: 'community',
    phone: '(970) 892-9751',
    active: true,
    featured: false,
  })
  console.log('  Bravestone Project — created')

  // Already listed, as "Peace & Justice Center — Monthly Calendar", with no
  // phone and a description that covered only the calendar. They also run a
  // food pantry and an ID project, which is what a guest is most likely to
  // need; the resource guide is the latest of theirs, dated September 2026.
  const existing = await client.fetch<{ _id: string } | null>(
    `*[_type=="resource" && url match "gvpeacejustice*"][0]{_id}`
  )
  if (!existing) {
    console.log('  Grand Valley Peace & Justice — not found, nothing changed')
  } else {
    await client
      .patch(existing._id)
      .set({
        title: 'Grand Valley Peace & Justice',
        description:
          'Food pantry, an ID project for people without documents, and a monthly community resource guide for the Grand Valley.',
        phone: '(970) 243-0136',
      })
      .commit()
    console.log(`  Grand Valley Peace & Justice — updated (${existing._id})`)
  }

  console.log('\nDone.')
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})
