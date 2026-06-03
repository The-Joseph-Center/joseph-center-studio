// One-off script — adds the Stay Connected subscribe section to page-events
// per 23-stay-connected-form.md.
//
// Deletes any shadow draft first so Studio shows the canonical published
// version after the patch lands.
//
// Run: SANITY_STUDIO_DATASET=staging pnpm sanity exec patch-stay-connected.ts --with-user-token
import { getCliClient } from 'sanity/cli'

const client = getCliClient()
const dataset = client.config().dataset

if (dataset === 'production' && process.env.CONFIRM_PRODUCTION !== 'yes') {
  console.error(
    'Refusing to patch page-events on production.\n' +
      'If you really mean to do this, re-run with:\n' +
      '  CONFIRM_PRODUCTION=yes SANITY_STUDIO_DATASET=production pnpm sanity exec patch-stay-connected.ts --with-user-token'
  )
  process.exit(1)
}

const pageEvents = {
  _type: 'page',
  _id: 'page-events',
  title: 'Events',
  slug: { _type: 'slug', current: '/events' },
  sections: [
    {
      _type: 'eventsListSection',
      _key: 'events-list-main',
      bannerText: 'Join Us at an Upcoming Event',
      showPastEvents: false,
    },
    {
      _type: 'stayConnectedSection',
      _key: 'events-subscribe',
      heading: 'Stay Updated on Events',
      subtext:
        'Be the first to know about upcoming events, giveaways, and community gatherings.',
      background: 'cream',
    },
  ],
}

async function run() {
  console.log(`Patching page-events on dataset: ${dataset}`)
  const tx = client.transaction()
  tx.delete('drafts.page-events')
  tx.createOrReplace(pageEvents)
  await tx.commit()
  console.log('page-events updated. Stay Connected section now renders below the events list.')
}

run().catch((err) => {
  console.error('patch-stay-connected failed:', err.message)
  process.exit(1)
})
