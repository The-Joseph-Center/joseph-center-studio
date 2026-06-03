// One-off script — overwrites the `page-events` document and creates the new
// `page-event-donations` document from 14-events-pages.md.
//
// Run: SANITY_STUDIO_DATASET=staging pnpm sanity exec patch-event-pages.ts --with-user-token
import { getCliClient } from 'sanity/cli'

const client = getCliClient()
const dataset = client.config().dataset

if (dataset === 'production' && process.env.CONFIRM_PRODUCTION !== 'yes') {
  console.error(
    'Refusing to overwrite event pages on production.\n' +
      'If you really mean to do this, re-run with:\n' +
      '  CONFIRM_PRODUCTION=yes SANITY_STUDIO_DATASET=production pnpm sanity exec patch-event-pages.ts --with-user-token'
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
  ],
}

const pageEventDonations = {
  _type: 'page',
  _id: 'page-event-donations',
  title: 'Event Donations',
  slug: { _type: 'slug', current: '/events/donations' },
  sections: [
    {
      _type: 'programDonationsSection',
      _key: 'event-donations-section',
      programName: 'Event',
      sponsorCard: {
        enabled: true,
        title: 'Sponsor an Event',
        description: 'Partner with The Joseph Center to sponsor community events that raise funds and awareness for the people we serve.',
        buttonLabel: 'Contact Us',
        buttonHref: '/contact',
      },
      donateCard: {
        enabled: true,
        title: 'Donate Supplies',
        description: 'Your donated supplies support our events and help us provide a welcoming experience for everyone who attends.',
        buttonLabel: 'Give',
        buttonHref: '/donate',
      },
    },
  ],
}

async function run() {
  console.log(`Overwriting page-events and page-event-donations on dataset: ${dataset}`)
  const tx = client.transaction()
  tx.createOrReplace(pageEvents)
  tx.createOrReplace(pageEventDonations)
  await tx.commit()
  console.log('Pages updated. Hard-refresh /events and /events/donations to see them.')
}

run().catch((err) => {
  console.error('patch-event-pages failed:', err.message)
  process.exit(1)
})
