// One-off script — overwrites the `page-staff` and `page-board` documents
// with the canonical section structure from 12-staff-board-pages.md.
// The existing docs were seeded as empty placeholder scaffolds with no content.
//
// Run: SANITY_STUDIO_DATASET=staging pnpm sanity exec patch-staff-board-pages.ts --with-user-token
import { getCliClient } from 'sanity/cli'

const client = getCliClient()
const dataset = client.config().dataset

if (dataset === 'production' && process.env.CONFIRM_PRODUCTION !== 'yes') {
  console.error(
    'Refusing to overwrite page-staff/page-board on production.\n' +
      'If you really mean to do this, re-run with:\n' +
      '  CONFIRM_PRODUCTION=yes SANITY_STUDIO_DATASET=production pnpm sanity exec patch-staff-board-pages.ts --with-user-token'
  )
  process.exit(1)
}

const pageStaff = {
  _type: 'page',
  _id: 'page-staff',
  title: 'Our Staff',
  slug: { _type: 'slug', current: '/staff' },
  sections: [
    {
      _type: 'heroSection',
      _key: 'hero-staff',
      title: 'Our Staff',
      align: 'right',
      minHeight: '45vh',
      showStripe: true,
      stripeColor: 'gold',
    },
    {
      _type: 'textContent',
      _key: 'intro-staff',
      alignment: 'left',
      body: [{
        _type: 'block', _key: 'si-1', style: 'normal', markDefs: [],
        children: [{ _type: 'span', _key: 'si-1s', marks: [],
          text: 'Our staff is the heartbeat of The Joseph Center. We are all here to help you in any way we can.',
        }],
      }],
    },
    {
      _type: 'peopleGrid',
      _key: 'grid-staff',
      source: 'staff',
      showContact: true,
    },
  ],
}

const pageBoard = {
  _type: 'page',
  _id: 'page-board',
  title: 'Our Board',
  slug: { _type: 'slug', current: '/board' },
  sections: [
    {
      _type: 'heroSection',
      _key: 'hero-board',
      title: 'Our Board',
      align: 'right',
      minHeight: '45vh',
      showStripe: true,
      stripeColor: 'gold',
    },
    {
      _type: 'textContent',
      _key: 'intro-board',
      alignment: 'left',
      body: [{
        _type: 'block', _key: 'bi-1', style: 'normal', markDefs: [],
        children: [{ _type: 'span', _key: 'bi-1s', marks: [],
          text: "Meet the board of directors who guide The Joseph Center's mission and ensure we serve our community with integrity and purpose.",
        }],
      }],
    },
    {
      _type: 'peopleGrid',
      _key: 'grid-board',
      source: 'board',
      showContact: false,
    },
  ],
}

async function run() {
  console.log(`Overwriting page-staff and page-board on dataset: ${dataset}`)
  const tx = client.transaction()
  tx.createOrReplace(pageStaff)
  tx.createOrReplace(pageBoard)
  await tx.commit()
  console.log('Pages updated. Hard-refresh /staff and /board to see them.')
}

run().catch((err) => {
  console.error('patch-staff-board-pages failed:', err.message)
  process.exit(1)
})
