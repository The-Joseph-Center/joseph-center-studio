// Adds The Bravestone Project to the Resources page, and fills out the
// Peace & Justice Center entry that was already there.
//
// Sources, and they disagree in one place:
//   bravestoneproject.org/contact        — phone, 15 Oct 2026
//   Coffee Chat with Denise              — what Bravestone does, how intake works
//   Coffee Chat with Sherry and Dee      — what Peace & Justice does, office hours,
//                                          the number Sherry gives out, and the fact
//                                          that the name is no longer "Grand Valley"
//   gvpeacejustice.org                   — a different phone, and the older name
//
// Where the website and the people disagree, this follows the people and says
// so below. Both organizations now keep space at The Joseph Center.
//
// The Joseph Center refers people to these pages, so a wrong number costs
// somebody a phone call they may not be able to make twice. Check both before
// running this, and again if it is run months from now.
//
// Run from studio/:
//   SANITY_STUDIO_DATASET=staging pnpm sanity exec patch-resources-bravestone-pjc.ts --with-user-token
//   CONFIRM_PRODUCTION=yes SANITY_STUDIO_DATASET=production pnpm sanity exec patch-resources-bravestone-pjc.ts --with-user-token
import { getCliClient } from 'sanity/cli'

const client = getCliClient()
const dataset = client.config().dataset

if (dataset === 'production' && process.env.CONFIRM_PRODUCTION !== 'yes') {
  console.error(
    'Refusing to patch resources on production.\n' +
      '  CONFIRM_PRODUCTION=yes SANITY_STUDIO_DATASET=production pnpm sanity exec patch-resources-bravestone-pjc.ts --with-user-token'
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
      'Trauma-informed support for survivors of human trafficking and sexual trauma — survivor advocacy, care coordination and community education, at their own pace and without re-telling more than they want to.',
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
        // The name is deliberate: they dropped "Grand Valley" once they were
        // helping people from Utah, Vail and further, and Sherry says so on
        // the Coffee Chat. The website still carries the old one.
        title: 'Peace & Justice Center',
        description:
          'Help replacing birth certificates, social security cards and other identification, lightweight food bags for people living outside or in a vehicle, the WE Shelter winter program, and a monthly community resource guide. Nobody is turned away; what they cannot do themselves they refer to Colorado Legal Services.',
        // Sherry gives this number out on air, and its exchange matches the
        // Joseph Center's. The 243-0136 on their website is the older one.
        phone: '(970) 985-4253',
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
