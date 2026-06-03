// One-off script — overwrites page-contact, page-transparency, page-media,
// and page-donate documents with the canonical structures from
// 16-contact-transparency-about.md and 17-media-donate-pages.md.
//
// Run: SANITY_STUDIO_DATASET=staging pnpm sanity exec patch-contact-transparency-media-donate.ts --with-user-token
import { getCliClient } from 'sanity/cli'

const client = getCliClient()
const dataset = client.config().dataset

if (dataset === 'production' && process.env.CONFIRM_PRODUCTION !== 'yes') {
  console.error(
    'Refusing to overwrite these pages on production.\n' +
      'If you really mean to do this, re-run with:\n' +
      '  CONFIRM_PRODUCTION=yes SANITY_STUDIO_DATASET=production pnpm sanity exec patch-contact-transparency-media-donate.ts --with-user-token'
  )
  process.exit(1)
}

const pageContact = {
  _type: 'page',
  _id: 'page-contact',
  title: 'Contact Us',
  slug: { _type: 'slug', current: '/contact' },
  sections: [
    {
      _type: 'heroSection',
      _key: 'hero-contact',
      title: 'Contact Us',
      align: 'center',
      minHeight: '30vh',
      showStripe: true,
      stripeColor: 'gold',
    },
    {
      _type: 'contactSection',
      _key: 'contact-form',
      heading: "We're here to help.",
      preferenceNotes:
        'Reach out by phone, email, or the form below — whichever works best for you. Our team responds within one business day.',
    },
  ],
}

const pageTransparency = {
  _type: 'page',
  _id: 'page-transparency',
  title: 'Transparency',
  slug: { _type: 'slug', current: '/transparency' },
  sections: [
    {
      _type: 'transparencySection',
      _key: 'transparency-main',
      heading: 'Transparency',
      intro:
        "The Joseph Center is committed to financial transparency. Below you'll find our annual reports and IRS Form 990s available for public review.",
    },
  ],
}

const pageMedia = {
  _type: 'page',
  _id: 'page-media',
  title: 'Media',
  slug: { _type: 'slug', current: '/media' },
  sections: [
    {
      _type: 'heroSection',
      _key: 'hero-media',
      title: 'Coffee Chat with Mona',
      align: 'center',
      minHeight: '35vh',
      showStripe: true,
      stripeColor: 'gold',
    },
    {
      _type: 'podcastEpisodesSection',
      _key: 'episodes-media',
      seriesTitle: 'Coffee Chat with Mona',
      seriesDescription:
        'Honest conversations about hope, homelessness, and the people The Joseph Center is honored to serve.',
    },
  ],
}

const pageDonate = {
  _type: 'page',
  _id: 'page-donate',
  title: 'Donate',
  slug: { _type: 'slug', current: '/donate' },
  sections: [
    {
      _type: 'partnershipSection',
      _key: 'partner-tiers',
      heading: 'Partner With Us',
    },
    {
      _type: 'oneTimeGiftSection',
      _key: 'one-time-gift',
      heading: 'One-Time Gift',
      subheading: 'Make a secure one-time donation to The Joseph Center.',
    },
  ],
}

async function run() {
  console.log(`Overwriting 4 pages on dataset: ${dataset}`)
  const tx = client.transaction()
  tx.createOrReplace(pageContact)
  tx.createOrReplace(pageTransparency)
  tx.createOrReplace(pageMedia)
  tx.createOrReplace(pageDonate)
  await tx.commit()
  console.log('Pages updated: /contact, /transparency, /media, /donate')
}

run().catch((err) => {
  console.error('patch failed:', err.message)
  process.exit(1)
})
