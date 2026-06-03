// One-off script — creates the socialLinks singleton with the 5 social
// profiles from the Screenshot 2026-06-02 link list. socialLinks is in
// LOCKED_TYPES (sanity.config.ts), so the Studio UI hides the Create button
// for this doc type — it has to be seeded programmatically.
//
// Run: SANITY_STUDIO_DATASET=staging pnpm sanity exec patch-social-links.ts --with-user-token
import { getCliClient } from 'sanity/cli'

const client = getCliClient()
const dataset = client.config().dataset

if (dataset === 'production' && process.env.CONFIRM_PRODUCTION !== 'yes') {
  console.error(
    'Refusing to overwrite socialLinks on production.\n' +
      'If you really mean to do this, re-run with:\n' +
      '  CONFIRM_PRODUCTION=yes SANITY_STUDIO_DATASET=production pnpm sanity exec patch-social-links.ts --with-user-token'
  )
  process.exit(1)
}

const socialLinks = {
  _type: 'socialLinks',
  _id: 'socialLinks',
  links: [
    {
      _key: 'social-facebook',
      _type: 'socialLink',
      platform: 'facebook',
      url: 'https://www.facebook.com/share/1AUxo2ySfv/?mibextid=wwXIfr',
    },
    {
      _key: 'social-instagram',
      _type: 'socialLink',
      platform: 'instagram',
      url: 'https://www.instagram.com/thejosephcentergj',
    },
    {
      _key: 'social-linkedin',
      _type: 'socialLink',
      platform: 'linkedin',
      url: 'https://www.linkedin.com/company/the-joseph-center',
    },
    {
      _key: 'social-youtube',
      _type: 'socialLink',
      platform: 'youtube',
      url: 'https://www.youtube.com/@TheJosephCenterGJ',
    },
    {
      _key: 'social-nextdoor',
      _type: 'socialLink',
      platform: 'nextdoor',
      url: 'https://nextdoor.com/page/the-joseph-center-grand-junction-co',
    },
  ],
}

async function run() {
  console.log(`Seeding socialLinks on dataset: ${dataset}`)
  const tx = client.transaction()
  tx.delete('drafts.socialLinks') // clear any stale draft
  tx.createOrReplace(socialLinks)
  await tx.commit()
  console.log(`Done. ${socialLinks.links.length} links upserted.`)
}

run().catch((err) => {
  console.error('patch-social-links failed:', err.message)
  process.exit(1)
})
