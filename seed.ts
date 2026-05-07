// Seed script — pre-populate Sanity with initial content
// Run: npx sanity exec seed.ts --with-user-token
import { getCliClient } from 'sanity/cli'

const client = getCliClient()

const documents = [
  {
    "_type": "siteSettings",
    "_id": "siteSettings",
    "siteName": "Joseph Center",
    "ctaLabel": "Get Started",
    "ctaUrl": "/contact",
    "contactEmail": "mhighline@josephcentergj.com",
    "contactPhone": "",
    "contactAddress": "",
    "copyrightText": "© 2026 Joseph Center. All rights reserved."
  },
  {
    "_type": "page",
    "_id": "page-home",
    "title": "Home",
    "slug": {
      "_type": "slug",
      "current": "/"
    },
    "sections": [
      {
        "_type": "heroSection",
        "_key": "heroSection-0",
        "title": "Joseph Center",
        "subtitle": ""
      },
      {
        "_type": "statsSection",
        "_key": "statsSection-1"
      },
      {
        "_type": "textContent",
        "_key": "textContent-2"
      },
      {
        "_type": "featureGrid",
        "_key": "featureGrid-3"
      },
      {
        "_type": "splitSection",
        "_key": "splitSection-4"
      }
    ]
  },
  {
    "_type": "page",
    "_id": "page-about",
    "title": "About",
    "slug": {
      "_type": "slug",
      "current": "/about"
    },
    "sections": [
      {
        "_type": "pricingCtaSection",
        "_key": "pricingCtaSection-0"
      }
    ]
  },
  {
    "_type": "page",
    "_id": "page-contact",
    "title": "Contact",
    "slug": {
      "_type": "slug",
      "current": "/contact"
    },
    "sections": [
      {
        "_type": "heroSection",
        "_key": "heroSection-0"
      },
      {
        "_type": "contactSection",
        "_key": "contactSection-1",
        "email": "mhighline@josephcentergj.com"
      }
    ]
  },
  {
    "_type": "page",
    "_id": "page-donate",
    "title": "Donate",
    "slug": {
      "_type": "slug",
      "current": "/donate"
    },
    "sections": [
      {
        "_type": "heroSection",
        "_key": "heroSection-0"
      },
      {
        "_type": "pricingSection",
        "_key": "pricingSection-1"
      },
      {
        "_type": "pricingCtaSection",
        "_key": "pricingCtaSection-2"
      }
    ]
  },
  {
    "_type": "page",
    "_id": "page-board",
    "title": "Our Board",
    "slug": {
      "_type": "slug",
      "current": "/board"
    },
    "sections": [
      {
        "_type": "heroSection",
        "_key": "heroSection-0"
      },
      {
        "_type": "textContent",
        "_key": "textContent-1"
      },
      {
        "_type": "teamProjectsSection",
        "_key": "teamProjectsSection-2"
      }
    ]
  },
  {
    "_type": "page",
    "_id": "page-staff",
    "title": "Our Staff",
    "slug": {
      "_type": "slug",
      "current": "/staff"
    },
    "sections": [
      {
        "_type": "heroSection",
        "_key": "heroSection-0"
      },
      {
        "_type": "textContent",
        "_key": "textContent-1"
      },
      {
        "_type": "teamProjectsSection",
        "_key": "teamProjectsSection-2"
      }
    ]
  },
  {
    "_type": "page",
    "_id": "page-testimonies",
    "title": "Testimonies",
    "slug": {
      "_type": "slug",
      "current": "/testimonies"
    },
    "sections": [
      {
        "_type": "heroSection",
        "_key": "heroSection-0"
      },
      {
        "_type": "textContent",
        "_key": "textContent-1"
      }
    ]
  },
  {
    "_type": "page",
    "_id": "page-events",
    "title": "Events",
    "slug": {
      "_type": "slug",
      "current": "/events"
    },
    "sections": [
      {
        "_type": "heroSection",
        "_key": "heroSection-0"
      },
      {
        "_type": "textContent",
        "_key": "textContent-1"
      }
    ]
  },
  {
    "_type": "page",
    "_id": "page-formsvolunteer",
    "title": "Volunteer Form",
    "slug": {
      "_type": "slug",
      "current": "/forms/volunteer"
    },
    "sections": [
      {
        "_type": "heroSection",
        "_key": "heroSection-0"
      },
      {
        "_type": "contactSection",
        "_key": "contactSection-1",
        "email": "mhighline@josephcentergj.com"
      }
    ]
  },
  {
    "_type": "page",
    "_id": "page-formsreferral",
    "title": "Referral Form",
    "slug": {
      "_type": "slug",
      "current": "/forms/referral"
    },
    "sections": [
      {
        "_type": "heroSection",
        "_key": "heroSection-0"
      },
      {
        "_type": "contactSection",
        "_key": "contactSection-1",
        "email": "mhighline@josephcentergj.com"
      }
    ]
  },
  {
    "_type": "page",
    "_id": "page-transparency",
    "title": "Transparency",
    "slug": {
      "_type": "slug",
      "current": "/transparency"
    },
    "sections": [
      {
        "_type": "heroSection",
        "_key": "heroSection-0"
      },
      {
        "_type": "textContent",
        "_key": "textContent-1"
      }
    ]
  },
  {
    "_type": "page",
    "_id": "page-media",
    "title": "Media",
    "slug": {
      "_type": "slug",
      "current": "/media"
    },
    "sections": [
      {
        "_type": "heroSection",
        "_key": "heroSection-0"
      },
      {
        "_type": "textContent",
        "_key": "textContent-1"
      }
    ]
  },
  {
    "_type": "page",
    "_id": "page-programs",
    "title": "Programs",
    "slug": {
      "_type": "slug",
      "current": "/programs"
    },
    "sections": [
      {
        "_type": "heroSection",
        "_key": "heroSection-0"
      },
      {
        "_type": "textContent",
        "_key": "textContent-1"
      },
      {
        "_type": "featureGrid",
        "_key": "featureGrid-2"
      }
    ]
  },
  {
    "_type": "page",
    "_id": "page-events:slug",
    "title": "Event Detail",
    "slug": {
      "_type": "slug",
      "current": "/events/:slug"
    },
    "sections": [
      {
        "_type": "heroSection",
        "_key": "heroSection-0"
      },
      {
        "_type": "textContent",
        "_key": "textContent-1"
      }
    ]
  },
  {
    "_type": "page",
    "_id": "page-programs:slug",
    "title": "Program Page",
    "slug": {
      "_type": "slug",
      "current": "/programs/:slug"
    },
    "sections": [
      {
        "_type": "heroSection",
        "_key": "heroSection-0"
      },
      {
        "_type": "textContent",
        "_key": "textContent-1"
      },
      {
        "_type": "pricingCtaSection",
        "_key": "pricingCtaSection-2"
      }
    ]
  },
  {
    "_type": "page",
    "_id": "page-programs:slugdonations",
    "title": "Program Donations",
    "slug": {
      "_type": "slug",
      "current": "/programs/:slug/donations"
    },
    "sections": [
      {
        "_type": "heroSection",
        "_key": "heroSection-0"
      },
      {
        "_type": "featureGrid",
        "_key": "featureGrid-1"
      }
    ]
  },
  {
    "_type": "page",
    "_id": "page-our-story",
    "title": "Our Story",
    "slug": {
      "_type": "slug",
      "current": "/our-story"
    },
    "sections": [
      {
        "_type": "heroSection",
        "_key": "heroSection-0"
      },
      {
        "_type": "splitSection",
        "_key": "splitSection-1"
      },
      {
        "_type": "textContent",
        "_key": "textContent-2"
      },
      {
        "_type": "pricingCtaSection",
        "_key": "pricingCtaSection-3"
      }
    ]
  },
  {
    "_type": "legalPage",
    "_id": "legal-privacy-policy",
    "title": "Privacy Policy",
    "slug": {
      "_type": "slug",
      "current": "/privacy-policy"
    }
  },
  {
    "_type": "legalPage",
    "_id": "legal-terms-and-conditions",
    "title": "Terms & Conditions",
    "slug": {
      "_type": "slug",
      "current": "/terms-and-conditions"
    }
  },
  {
    "_type": "legalPage",
    "_id": "legal-accessibility",
    "title": "Accessibility Statement",
    "slug": {
      "_type": "slug",
      "current": "/accessibility"
    }
  },
  {
    "_type": "navigation",
    "_id": "nav-main",
    "navType": "main",
    "items": [
      {
        "_key": "home",
        "label": "Home",
        "url": "/"
      },
      {
        "_key": "about",
        "label": "About",
        "url": "/about"
      },
      {
        "_key": "contact",
        "label": "Contact",
        "url": "/contact"
      },
      {
        "_key": "donate",
        "label": "Donate",
        "url": "/donate"
      },
      {
        "_key": "media",
        "label": "Media",
        "url": "/media"
      },
      {
        "_key": "programs",
        "label": "Programs",
        "url": "/programs"
      },
      {
        "_key": "our-story",
        "label": "Our Story",
        "url": "/our-story"
      }
    ]
  },
  {
    "_type": "navigation",
    "_id": "nav-footer",
    "navType": "footer",
    "items": [
      {
        "_key": "board",
        "label": "Our Board",
        "url": "/board"
      },
      {
        "_key": "staff",
        "label": "Our Staff",
        "url": "/staff"
      },
      {
        "_key": "testimonies",
        "label": "Testimonies",
        "url": "/testimonies"
      },
      {
        "_key": "events",
        "label": "Events",
        "url": "/events"
      },
      {
        "_key": "transparency",
        "label": "Transparency",
        "url": "/transparency"
      }
    ]
  },
  {
    "_type": "navigation",
    "_id": "nav-legal",
    "navType": "legal",
    "items": [
      {
        "_key": "privacy-policy",
        "label": "Privacy Policy",
        "url": "/privacy-policy"
      },
      {
        "_key": "terms-and-conditions",
        "label": "Terms & Conditions",
        "url": "/terms-and-conditions"
      },
      {
        "_key": "accessibility",
        "label": "Accessibility Statement",
        "url": "/accessibility"
      }
    ]
  }
]

async function seed() {
  console.log(`Seeding ${documents.length} document(s)...`)
  const transaction = client.transaction()
  for (const doc of documents) {
    transaction.createIfNotExists(doc)
  }
  await transaction.commit()
  console.log('Seed complete!')
}

seed().catch((err) => {
  console.error('Seed failed:', err.message)
  process.exit(1)
})
