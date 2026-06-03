// One-off script — overwrites the `page-testimonies` document with the
// canonical section structure from 13-testimonies-page.md. The existing doc
// was seeded as a placeholder scaffold with the wrong title ("Testimonies"
// instead of "Our Guests") and no content.
//
// Run: SANITY_STUDIO_DATASET=staging pnpm sanity exec patch-testimonies-page.ts --with-user-token
import { getCliClient } from 'sanity/cli'

const client = getCliClient()
const dataset = client.config().dataset

if (dataset === 'production' && process.env.CONFIRM_PRODUCTION !== 'yes') {
  console.error(
    'Refusing to overwrite page-testimonies on production.\n' +
      'If you really mean to do this, re-run with:\n' +
      '  CONFIRM_PRODUCTION=yes SANITY_STUDIO_DATASET=production pnpm sanity exec patch-testimonies-page.ts --with-user-token'
  )
  process.exit(1)
}

const pageTestimonies = {
  _type: 'page',
  _id: 'page-testimonies',
  title: 'Our Guests',
  slug: { _type: 'slug', current: '/testimonies' },
  sections: [
    {
      _type: 'heroSection',
      _key: 'hero-testimonies',
      title: 'Our Guests',
      align: 'right',
      minHeight: '45vh',
      showStripe: true,
      stripeColor: 'gold',
    },
    {
      _type: 'textContent',
      _key: 'intro-testimonies',
      alignment: 'left',
      body: [{
        _type: 'block', _key: 'ti-1', style: 'normal', markDefs: [],
        children: [{ _type: 'span', _key: 'ti-1s', marks: [],
          text: 'Hear from our guests about their stories and how The Joseph Center has helped them.',
        }],
      }],
    },
    {
      _type: 'videoGridSection',
      _key: 'grid-testimonies',
    },
  ],
}

async function run() {
  console.log(`Overwriting page-testimonies on dataset: ${dataset}`)
  await client.createOrReplace(pageTestimonies)
  console.log('page-testimonies updated. Hard-refresh /testimonies to see it.')
}

run().catch((err) => {
  console.error('patch-testimonies-page failed:', err.message)
  process.exit(1)
})
