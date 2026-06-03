// One-off script — overwrites the `page-home` document with the canonical
// section structure from 08-home-page.md. Use after schema changes when the
// regular seed script's createIfNotExists won't replace existing docs.
//
// Run: SANITY_STUDIO_DATASET=staging pnpm sanity exec reset-page-home.ts --with-user-token
// (or use the package.json scripts: pnpm reset:home:staging / reset:home:production)
import { getCliClient } from 'sanity/cli'

const client = getCliClient()
const dataset = client.config().dataset

if (dataset === 'production' && process.env.CONFIRM_PRODUCTION !== 'yes') {
  console.error(
    'Refusing to overwrite page-home on production.\n' +
      'If you really mean to do this, re-run with:\n' +
      '  CONFIRM_PRODUCTION=yes pnpm reset:home:production'
  )
  process.exit(1)
}

const pageHome = {
  _type: 'page',
  _id: 'page-home',
  title: 'Home',
  slug: { _type: 'slug', current: '/' },
  sections: [
    {
      _type: 'heroSection',
      _key: 'heroSection-0',
      title: 'Empowering Lives\nWith Purpose',
      align: 'right',
      minHeight: '70vh',
      showStripe: true,
      stripeColor: 'gold',
    },
    {
      _type: 'pillarsBar',
      _key: 'pillarsBar-1',
    },
    {
      _type: 'textContent',
      _key: 'textContent-2',
      heading: 'Our Vision',
      body: [
        {
          _type: 'block',
          _key: 'vision-body',
          style: 'normal',
          children: [
            {
              _type: 'span',
              _key: 'vision-span',
              text: 'We support people in need of hope by restoring dignity through resources and encouragement to regain a sense of belonging to the greater community.',
              marks: [],
            },
          ],
        },
      ],
    },
    {
      _type: 'programsGrid',
      _key: 'programsGrid-3',
    },
    {
      _type: 'ourStorySection',
      _key: 'ourStorySection-4',
    },
    {
      _type: 'partnersSection',
      _key: 'partnersSection-5',
    },
  ],
}

async function run() {
  console.log(`Overwriting page-home on dataset: ${dataset}`)
  await client.createOrReplace(pageHome)
  console.log('page-home updated. Hard-refresh the frontend to see new sections.')
}

run().catch((err) => {
  console.error('reset-page-home failed:', err.message)
  process.exit(1)
})
