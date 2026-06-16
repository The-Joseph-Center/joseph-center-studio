// Seed script — pre-populate Sanity with initial content
// Run: npx sanity exec seed.ts --with-user-token
import { getCliClient } from 'sanity/cli'

const client = getCliClient()

const dataset = client.config().dataset
if (dataset === 'production' && process.env.CONFIRM_PRODUCTION !== 'yes') {
  console.error(
    'Refusing to seed the production dataset.\n' +
      'If you really mean to do this, re-run with:\n' +
      '  CONFIRM_PRODUCTION=yes pnpm seed:production'
  )
  process.exit(1)
}

const documents = [
  {
    "_type": "siteSettings",
    "_id": "siteSettings",
    "siteName": "Joseph Center",
    "ctaLabel": "Get Started",
    "ctaUrl": "/contact",
    "ctaHeadline": "We're Community Funded",
    "ctaSubtext": "Your generosity restores dignity and changes lives in Grand Junction, Colorado.",
    "ctaFooterLabel": "Support Our Mission",
    "ctaFooterUrl": "/donate",
    "copyrightText": "© 2026 Joseph Center. All rights reserved.",
    "craftedBy": "Crafted by Phifer Web Solutions",
    "businessContact": {
      "phone": "(970) 243-7672",
      "addressLine1": "2511 Belford Ave #9",
      "addressLine2": "Grand Junction, CO 81501"
    },
    "hours": {
      "office": { "days": "Monday – Friday", "time": "8:00am – 5:00pm" },
      "dayShelter": { "days": "Mon – Sat", "time": "8:00am – 3:00pm" }
    }
  },
  {
    "_type": "socialLinks",
    "_id": "socialLinks",
    "links": [
      { "_key": "social-facebook",  "_type": "socialLink", "platform": "facebook",  "url": "https://www.facebook.com/share/1AUxo2ySfv/?mibextid=wwXIfr" },
      { "_key": "social-instagram", "_type": "socialLink", "platform": "instagram", "url": "https://www.instagram.com/thejosephcentergj" },
      { "_key": "social-linkedin",  "_type": "socialLink", "platform": "linkedin",  "url": "https://www.linkedin.com/company/the-joseph-center" },
      { "_key": "social-youtube",   "_type": "socialLink", "platform": "youtube",   "url": "https://www.youtube.com/@TheJosephCenterGJ" },
      { "_key": "social-nextdoor",  "_type": "socialLink", "platform": "nextdoor",  "url": "https://nextdoor.com/page/the-joseph-center-grand-junction-co" }
    ]
  },
  {
    "_type": "footerColumns",
    "_id": "footerColumns",
    "columns": [
      {
        "_key": "col-programs",
        "_type": "footerColumn",
        "title": "Programs",
        "links": [
          { "_key": "p-1", "_type": "navLink", "label": "Day Shelter & Food Pantry", "url": "/programs/day-shelter" },
          { "_key": "p-2", "_type": "navLink", "label": "Golden Girls", "url": "/programs/golden-girls" },
          { "_key": "p-3", "_type": "navLink", "label": "Integrated Financial Services", "url": "/programs/financial-services" },
          { "_key": "p-4", "_type": "navLink", "label": "Family Center", "url": "/programs/family-center" },
          { "_key": "p-5", "_type": "navLink", "label": "Events", "url": "/events" }
        ]
      },
      {
        "_key": "col-about",
        "_type": "footerColumn",
        "title": "About Us",
        "links": [
          { "_key": "a-1", "_type": "navLink", "label": "Our Story", "url": "/our-story" },
          { "_key": "a-2", "_type": "navLink", "label": "Our Board", "url": "/board" },
          { "_key": "a-3", "_type": "navLink", "label": "Our Staff", "url": "/staff" },
          { "_key": "a-4", "_type": "navLink", "label": "Our Guests", "url": "/testimonies" },
          { "_key": "a-5", "_type": "navLink", "label": "Contact Us", "url": "/contact" }
        ]
      },
      {
        "_key": "col-forms",
        "_type": "footerColumn",
        "title": "Forms",
        "links": [
          { "_key": "f-1", "_type": "navLink", "label": "Volunteer", "url": "/forms/volunteer" },
          { "_key": "f-2", "_type": "navLink", "label": "Referral", "url": "/forms/referral" }
        ]
      }
    ]
  },
  {
    "_type": "volunteerSkills",
    "_id": "volunteerSkills",
    "categories": [
      {
        "_key": "cat-media",
        "name": "Media & Creative",
        "skills": ["Photography", "Videography", "Graphic Design", "Social Media"]
      },
      {
        "_key": "cat-legal",
        "name": "Legal & Financial",
        "skills": ["Legal / Attorney", "Accounting / Bookkeeping", "Financial Counseling"]
      },
      {
        "_key": "cat-medical",
        "name": "Medical & Wellness",
        "skills": ["Medical / Nursing", "Mental Health / Counseling", "Dental"]
      },
      {
        "_key": "cat-trades",
        "name": "Trades & Facilities",
        "skills": ["Carpentry / Repairs", "Plumbing", "Electrical", "Landscaping / Groundskeeping", "Painting"]
      },
      {
        "_key": "cat-other",
        "name": "Other",
        "skills": ["Transportation / Driving", "Teaching / Tutoring", "IT / Technology", "Grant Writing", "Translation / Interpretation"]
      }
    ]
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
        "title": "Empowering Lives\nWith Purpose",
        "subtitle": "The Joseph Center",
        "align": "right",
        "minHeight": "70vh",
        "showStripe": true,
        "stripeColor": "gold"
      },
      {
        "_type": "pillarsBar",
        "_key": "pillarsBar-1"
      },
      {
        "_type": "textContent",
        "_key": "textContent-2",
        "heading": "Our Vision",
        "body": [
          {
            "_type": "block",
            "_key": "vision-body",
            "style": "normal",
            "children": [
              {
                "_type": "span",
                "_key": "vision-span",
                "text": "The Joseph Center supports people in need of hope by restoring dignity through resources and encouragement to regain a sense of belonging to the greater community.",
                "marks": []
              }
            ]
          }
        ]
      },
      {
        "_type": "programsGrid",
        "_key": "programsGrid-3",
        "heading": "Our Programs",
        "programs": [
          {
            "_key": "pg-day-shelter",
            "name": "Day Shelter",
            "description": "A safe place to rest, shower, do laundry, and figure out what comes next — open to anyone in the Grand Valley.",
            "href": "/programs/day-shelter"
          },
          {
            "_key": "pg-food-pantry",
            "name": "Food Pantry",
            "description": "Hot meals and food boxes for our guests in Grand Junction, every Tuesday through Friday.",
            "href": "/programs/food-pantry"
          },
          {
            "_key": "pg-family-center",
            "name": "Family Center",
            "description": "Parent Advocacy and the Family Empowerment Model — walking alongside parents working toward reunification.",
            "href": "/programs/family-center"
          },
          {
            "_key": "pg-financial-services",
            "name": "Integrated Financial Services",
            "description": "Representative Payee, guardianship, and budget counseling across 16 counties of the Western Slope.",
            "href": "/programs/financial-services"
          },
          {
            "_key": "pg-golden-girls",
            "name": "Golden Girls Project",
            "description": "Temporary housing and case management for women over 50 starting over in the Grand Valley.",
            "href": "/programs/golden-girls"
          }
        ]
      },
      {
        "_type": "ourStorySection",
        "_key": "ourStorySection-4"
      },
      {
        "_type": "partnersSection",
        "_key": "partnersSection-5"
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
    "title": "Contact Us",
    "slug": {
      "_type": "slug",
      "current": "/contact"
    },
    "sections": [
      {
        "_type": "heroSection",
        "_key": "hero-contact",
        "title": "Contact Us",
        "align": "center",
        "minHeight": "30vh",
        "showStripe": true,
        "stripeColor": "gold"
      },
      {
        "_type": "contactSection",
        "_key": "contact-form",
        "heading": "We're here to help.",
        "preferenceNotes": "Reach out by phone, email, or the form below — whichever works best for you. Our team responds within one business day."
      },
      {
        "_type": "mapEmbedSection",
        "_key": "contact-map",
        "embedUrl": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3097.3660224124865!2d-108.53858382348811!3d39.0753597361832!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x87471c3ce066e819%3A0xa115f38d383b22ba!2s2511%20Belford%20Ave%2C%20Grand%20Junction%2C%20CO%2081501!5e0!3m2!1sen!2sus!4v1781293306311!5m2!1sen!2sus",
        "title": "The Joseph Center location map"
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
        "_type": "partnershipSection",
        "_key": "partner-tiers",
        "heading": "Partner With Us"
      },
      {
        "_type": "oneTimeGiftSection",
        "_key": "one-time-gift",
        "heading": "One-Time Gift",
        "subheading": "Make a secure one-time donation to The Joseph Center."
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
        "_key": "hero-board",
        "title": "Our Board",
        "align": "right",
        "minHeight": "45vh",
        "showStripe": true,
        "stripeColor": "gold"
      },
      {
        "_type": "textContent",
        "_key": "intro-board",
        "alignment": "left",
        "body": [
          {
            "_type": "block", "_key": "bi-1", "style": "normal", "markDefs": [],
            "children": [{ "_type": "span", "_key": "bi-1s", "marks": [],
              "text": "Meet the board of directors who guide The Joseph Center's mission and ensure we serve our community with integrity and purpose."
            }]
          }
        ]
      },
      {
        "_type": "peopleGrid",
        "_key": "grid-board",
        "source": "board",
        "showContact": false
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
        "_key": "hero-staff",
        "title": "Our Staff",
        "align": "right",
        "minHeight": "45vh",
        "showStripe": true,
        "stripeColor": "gold"
      },
      {
        "_type": "textContent",
        "_key": "intro-staff",
        "alignment": "left",
        "body": [
          {
            "_type": "block", "_key": "si-1", "style": "normal", "markDefs": [],
            "children": [{ "_type": "span", "_key": "si-1s", "marks": [],
              "text": "Our staff is the heartbeat of The Joseph Center. We are all here to help you in any way we can."
            }]
          }
        ]
      },
      {
        "_type": "peopleGrid",
        "_key": "grid-staff",
        "source": "staff",
        "showContact": true
      }
    ]
  },
  // Staff and board member documents (_type: staff and _type: board) live only
  // in the production dataset. Use studio/copy-people-from-production.ts to
  // pull them into staging — not seeded here.
  {
    "_type": "page",
    "_id": "page-testimonies",
    "title": "Our Guests",
    "slug": {
      "_type": "slug",
      "current": "/testimonies"
    },
    "sections": [
      {
        "_type": "heroSection",
        "_key": "hero-testimonies",
        "title": "Our Guests",
        "align": "right",
        "minHeight": "45vh",
        "showStripe": true,
        "stripeColor": "gold"
      },
      {
        "_type": "textContent",
        "_key": "intro-testimonies",
        "alignment": "left",
        "body": [
          {
            "_type": "block", "_key": "ti-1", "style": "normal", "markDefs": [],
            "children": [{ "_type": "span", "_key": "ti-1s", "marks": [],
              "text": "Hear from our guests about their stories and how The Joseph Center has helped them."
            }]
          }
        ]
      },
      {
        "_type": "videoGridSection",
        "_key": "grid-testimonies"
      }
    ]
  },
  // testimonialvideo docs (lowercase _type) live only in production. Use
  // studio/copy-testimonials-from-production.ts to pull them into staging.
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
        "_type": "eventsListSection",
        "_key": "events-list-main",
        "bannerText": "Join Us at an Upcoming Event",
        "showPastEvents": false
      },
      {
        "_type": "stayConnectedSection",
        "_key": "events-subscribe",
        "heading": "Stay Updated on Events",
        "subtext": "Be the first to know about upcoming events, giveaways, and community gatherings.",
        "background": "cream"
      }
    ]
  },
  {
    "_type": "page",
    "_id": "page-event-donations",
    "title": "Event Donations",
    "slug": {
      "_type": "slug",
      "current": "/events/donations"
    },
    "sections": [
      {
        "_type": "programDonationsSection",
        "_key": "event-donations-section",
        "programName": "Event",
        "sponsorCard": {
          "enabled": true,
          "title": "Sponsor an Event",
          "description": "Partner with The Joseph Center to sponsor community events that raise funds and awareness for the people we serve.",
          "buttonLabel": "Contact Us",
          "buttonHref": "/contact"
        },
        "donateCard": {
          "enabled": true,
          "title": "Donate Supplies",
          "description": "Your donated supplies support our events and help us provide a welcoming experience for everyone who attends.",
          "buttonLabel": "Give",
          "buttonHref": "/donate"
        }
      }
    ]
  },
  // events docs (plural lowercase _type) live in production only. Use
  // studio/copy-events-from-production.ts to pull them into staging.
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
        "_type": "transparencySection",
        "_key": "transparency-main",
        "heading": "Transparency",
        "intro": "The Joseph Center is committed to financial transparency. Below you'll find our annual reports and IRS Form 990s available for public review."
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
        "_key": "hero-media",
        "title": "Coffee Chat with Mona",
        "align": "center",
        "minHeight": "35vh",
        "showStripe": true,
        "stripeColor": "gold"
      },
      {
        "_type": "podcastEpisodesSection",
        "_key": "episodes-media",
        "seriesTitle": "Coffee Chat with Mona",
        "seriesDescription": "Honest conversations about hope, homelessness, and the people The Joseph Center is honored to serve."
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
    "_id": "page-event-detail",
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
    "_id": "page-program-detail",
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
    "_id": "page-program-donations",
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
        "_key": "hero-our-story",
        "title": "Our Story",
        "align": "right",
        "minHeight": "55vh",
        "showStripe": true,
        "stripeColor": "gold"
      },
      {
        "_type": "videoSection",
        "_key": "video-our-story",
        "introText": "Hear from Mona Highline, Founder and CEO, about the vision of The Joseph Center.",
        "videoId": "",
        "placeholderLabel": "Video coming soon"
      },
      {
        "_type": "textContent",
        "_key": "vision-our-story",
        "heading": "Our Vision",
        "alignment": "center",
        "textTransform": "uppercase",
        "body": [
          {
            "_type": "block", "_key": "vis-1", "style": "normal", "markDefs": [],
            "children": [{ "_type": "span", "_key": "vis-1s", "marks": [],
              "text": "We support people in need of hope by restoring dignity through resources and encouragement to regain a sense of belonging to the greater community."
            }]
          }
        ]
      },
      {
        "_type": "diagonalTextSection",
        "_key": "narrative-our-story",
        "title": "Our Story",
        "color": "gold",
        "body": [
          {
            "_type": "block", "_key": "n-1", "style": "normal", "markDefs": [],
            "children": [{ "_type": "span", "_key": "n-1s", "marks": [],
              "text": "The concept of a Joseph Center was a long-standing vision of the founder Mona Highline. In 2015, Mrs. Highline and a group of women came together to establish The Joseph Center. During a community needs assessment, the women discovered a gap in services for homeless women with their children. An auxiliary building at a church was offered to the women to open as a day shelter. The Joseph Center opened its doors September 8, 2016 to provide a safe place during the day for homeless women and their children. The mission was to provide resources to empower these women's lives with purpose."
            }]
          },
          {
            "_type": "block", "_key": "n-2", "style": "normal", "markDefs": [],
            "children": [{ "_type": "span", "_key": "n-2s", "marks": [],
              "text": "The Joseph Center was able to help these families with long-term housing, employment, food, and many other supportive services. Initially the Joseph Center was located at the auxiliary building for about a year, when the church came under new leadership. We were asked to leave and were forced to find a new space."
            }]
          },
          {
            "_type": "block", "_key": "n-3", "style": "normal", "markDefs": [],
            "children": [{ "_type": "span", "_key": "n-3s", "marks": [],
              "text": "The Joseph Center split its services to a building at the Salvation Army and another more active office at the Center for Independence. At first, we thought this was a setback however it opened the door for us to serve more people and expand our services and programs. The organization thrived in these new locations for about a year although there were some logistical challenges. That fall, we were once again told that the day shelter program would have to move. Winter was coming. We were donated a large warehouse space with the intention of merging all of our services together under one roof."
            }]
          },
          {
            "_type": "block", "_key": "n-4", "style": "normal", "markDefs": [],
            "children": [{ "_type": "span", "_key": "n-4s", "marks": [],
              "text": "A generous donation was given to the Joseph Center to purchase a new building. Early 2019, the Joseph Center had a new home and renovations on the building began. The Joseph Center now operates a day shelter as well as the Joseph Center Adult Advocacy Program (JCAAP) and Generating Our Resources (GOR) through our fundraising events. The GOR program changed into Integrated Financial Services providing guardianship, conservatorship, VA fiduciary, and budget counseling."
            }]
          },
          {
            "_type": "block", "_key": "n-5", "style": "normal", "markDefs": [],
            "children": [{ "_type": "span", "_key": "n-5s", "marks": [],
              "text": "We always can use more support. Become a partner or volunteer to start building the community."
            }]
          }
        ]
      },
      {
        "_type": "dualCtaSection",
        "_key": "ctas-our-story",
        "buttons": [
          { "_key": "cta-partner", "_type": "ctaButton", "label": "Become a Partner", "href": "/donate", "variant": "secondary" },
          { "_key": "cta-volunteer", "_type": "ctaButton", "label": "Find a Position That Fits Your Ability", "href": "/forms/volunteer", "variant": "primary" }
        ]
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
  // ── Programs (per 09-program-pages.md) ─────────────────────────────────────
  {
    "_type": "program",
    "_id": "program-day-shelter",
    "title": "Day Shelter & Food Pantry",
    "slug": { "_type": "slug", "current": "day-shelter" },
    "metaDescription": "Hot meals, showers, laundry, and a safe place to rest — open to anyone in need in Grand Junction, CO.",
    "visionHeading": "Our Vision",
    "visionBody": "We create a safe place for families to eat and shower while managing their path to independence. Our day shelter is open to anyone in need.",
    "howWeHelpContent": [
      {
        "_type": "block", "_key": "ds-1", "style": "normal", "markDefs": [],
        "children": [{ "_type": "span", "_key": "ds-1s", "text": "We provide hot meals, showers, laundry facilities, and a safe space for people to rest during the day. Our food pantry serves families throughout the Grand Valley.", "marks": [] }]
      }
    ],
    "inlineCtas": [
      { "_key": "ds-cta-1", "label": "Fill Out a Referral Form", "href": "/forms/referral", "variant": "primary" }
    ],
    "donorAppealEnabled": true,
    "personDescriptor": "a guest",
    "donationsPageEnabled": true,
    "donationsSection": {
      "programName": "Day Shelter & Food Pantry",
      "sponsorCard": {
        "enabled": true,
        "title": "Sponsor an Event",
        "description": "Sponsor a meal service or shelter event. Your sponsorship directly supports the people we serve.",
        "buttonLabel": "Contact Us",
        "buttonHref": "/contact"
      },
      "donateCard": {
        "enabled": true,
        "title": "Donate Supplies",
        "description": "We accept donations of food, clothing, hygiene products, and household supplies. Every item makes a difference.",
        "buttonLabel": "Give",
        "buttonHref": "/donate"
      }
    },
    "resourcesSection": {
      "programName": "Day Shelter & Food Pantry",
      "learnCard": {
        "enabled": true,
        "title": "Learn",
        "description": "Learn about food insecurity and homelessness in Mesa County and how The Joseph Center is responding.",
        "buttonLabel": "Learn More",
        "buttonHref": "/our-story"
      },
      "resourcesCard": {
        "enabled": true,
        "title": "Free Resources",
        "description": "Access our list of free community resources including food assistance, housing support, and more.",
        "buttonLabel": "Learn More",
        "buttonHref": "/our-story"
      }
    }
  },
  {
    "_type": "program",
    "_id": "program-golden-girls",
    "title": "Golden Girls",
    "slug": { "_type": "slug", "current": "golden-girls" },
    "metaDescription": "Transitional housing and support for women over 50 — a safe place to start a new beginning in Grand Junction, CO.",
    "visionHeading": "Our Vision",
    "visionBody": "Golden Girls provides transitional housing and support, to empower women over 50 to gain permanent housing because everyone should have a safe place to start a new beginning.",
    "howWeHelpContent": [
      {
        "_type": "block", "_key": "gg-1", "style": "normal", "markDefs": [],
        "children": [{ "_type": "span", "_key": "gg-1s", "text": "The Golden Girls Program started in 2018 when we saw in our community the need for women over 50 to gain stable, permanent housing. Many are waiting for VA disability benefits or survivor benefits, which limits employment and opportunities for permanent housing. Since the start we've provided over 60 women with housing assistance, job training and support. We are able to house our golden girls free of charge for up to 6 months. Our house is a large three-bedroom space with a maximum of 6 beds. Guests have access to a kitchen, bathroom facilities, washer and dryer. An intake form is required to be accepted into the Golden Girls Program.", "marks": [] }]
      },
      {
        "_type": "block", "_key": "gg-2", "style": "h4", "markDefs": [],
        "children": [{ "_type": "span", "_key": "gg-2s", "text": "Other Help", "marks": [] }]
      },
      {
        "_type": "block", "_key": "gg-3", "style": "normal", "markDefs": [],
        "children": [{ "_type": "span", "_key": "gg-3s", "text": "In addition to shelter, we have an onsite health clinic available on the last Wednesday of each month, provided by Parkway Medical Care. We also provide help with onsite case management, navigating DHS programs (SNAP, Medicaid, Medicare, etc.), resources, case documents, long-term care, and housing assistance.", "marks": [] }]
      }
    ],
    "inlineCtas": [
      { "_key": "gg-cta-1", "label": "Fill Out an Intake Form", "href": "/forms/referral", "variant": "primary" }
    ],
    "donorAppealEnabled": true,
    "personDescriptor": "a Golden Girl",
    "donationsPageEnabled": true,
    "donationsSection": {
      "programName": "Golden Girls",
      "sponsorCard": {
        "enabled": true,
        "title": "Sponsor an Event",
        "description": "Sponsor a Golden Girl for a month and help provide housing, food, and case management support.",
        "buttonLabel": "Contact Us",
        "buttonHref": "/contact"
      },
      "donateCard": {
        "enabled": true,
        "title": "Donate Supplies",
        "description": "Household items, clothing, and personal care products make an immediate impact for women in transition.",
        "buttonLabel": "Give",
        "buttonHref": "/donate"
      }
    },
    "resourcesSection": {
      "programName": "Golden Girls",
      "learnCard": {
        "enabled": true,
        "title": "Learn",
        "description": "Learn about the challenges women over 50 face with housing and how transitional programs change outcomes.",
        "buttonLabel": "Learn More",
        "buttonHref": "/our-story"
      },
      "resourcesCard": {
        "enabled": true,
        "title": "Free Resources",
        "description": "Resources for women navigating housing, benefits, and senior services in the Grand Valley.",
        "buttonLabel": "Learn More",
        "buttonHref": "/our-story"
      }
    }
  },
  {
    "_type": "program",
    "_id": "program-financial-services",
    "title": "Integrated Financial Services",
    "slug": { "_type": "slug", "current": "financial-services" },
    "metaDescription": "Financial management of social security and veterans benefits for disabled people at risk of homelessness.",
    "visionHeading": "Our Vision",
    "visionBody": "Integrated Financial Services provides resources and accounting to disabled people at-risk of homelessness because everyone deserves to have peace of mind.",
    "howWeHelpContent": [
      {
        "_type": "block", "_key": "ifs-1", "style": "normal", "markDefs": [],
        "children": [{ "_type": "span", "_key": "ifs-1s", "text": "Integrated Financial Services (IFS) helps with the financial management of social security and veterans benefits to maximize trust, including paying household expenses on time and avoiding late fees. We also provide our clients with personal care and supportive services.", "marks": [] }]
      },
      {
        "_type": "block", "_key": "ifs-2", "style": "h4", "markDefs": [],
        "children": [{ "_type": "span", "_key": "ifs-2s", "text": "Guardianship", "marks": [] }]
      },
      {
        "_type": "block", "_key": "ifs-3", "style": "h4", "markDefs": [],
        "children": [{ "_type": "span", "_key": "ifs-3s", "text": "Budget Counseling", "marks": [] }]
      },
      {
        "_type": "block", "_key": "ifs-4", "style": "h4", "markDefs": [],
        "children": [{ "_type": "span", "_key": "ifs-4s", "text": "Need Help?", "marks": [] }]
      }
    ],
    "inlineCtas": [
      { "_key": "ifs-cta-1", "label": "Fill Out the Form", "href": "/forms/referral", "variant": "primary" },
      { "_key": "ifs-cta-2", "label": "Call Us", "href": "tel:+19702437672", "variant": "ghost" }
    ],
    "donorAppealEnabled": true,
    "personDescriptor": "a disabled person in need",
    "donationsPageEnabled": true,
    "donationsSection": {
      "programName": "IFS",
      "sponsorCard": {
        "enabled": true,
        "title": "Sponsor an Event",
        "description": "Sponsor financial services support for a disabled individual and help them achieve stability and independence.",
        "buttonLabel": "Contact Us",
        "buttonHref": "/contact"
      },
      "donateCard": {
        "enabled": true,
        "title": "Donate Supplies",
        "description": "Your gift funds financial coaching, guardianship services, and benefit navigation for those who need it most.",
        "buttonLabel": "Give",
        "buttonHref": "/donate"
      }
    },
    "resourcesSection": {
      "programName": "IFS",
      "learnCard": {
        "enabled": true,
        "title": "Learn",
        "description": "Learn about financial management services, guardianship, and how we help individuals with disabilities.",
        "buttonLabel": "Learn More",
        "buttonHref": "/our-story"
      },
      "resourcesCard": {
        "enabled": true,
        "title": "Free Resources",
        "description": "Access free financial literacy resources, VA benefit guides, and community support links.",
        "buttonLabel": "Learn More",
        "buttonHref": "/our-story"
      }
    }
  },
  {
    "_type": "program",
    "_id": "program-family-center",
    "title": "Family Center",
    "slug": { "_type": "slug", "current": "family-center" },
    "metaDescription": "Parent advocacy and support navigating parent/child legal challenges in Grand Junction, CO.",
    "visionHeading": "Our Vision",
    "visionBody": "Providing parents with a support system to navigate parent / child legal challenges.",
    "howWeHelpContent": [
      {
        "_type": "block", "_key": "fc-1", "style": "normal", "markDefs": [],
        "children": [{ "_type": "span", "_key": "fc-1s", "text": "Our parent advocacy program provides support to parents navigating the legal system to maintain or restore custody of their children.", "marks": [] }]
      }
    ],
    "inlineCtas": [
      { "_key": "fc-cta-1", "label": "Fill Out a Referral Form", "href": "/forms/referral", "variant": "primary" }
    ],
    "donorAppealEnabled": true,
    "personDescriptor": "a family",
    "donationsPageEnabled": true,
    "donationsSection": {
      "programName": "Family Center",
      "sponsorCard": {
        "enabled": true,
        "title": "Sponsor an Event",
        "description": "Sponsor parent advocacy services and help families navigate the legal system to stay together.",
        "buttonLabel": "Contact Us",
        "buttonHref": "/contact"
      },
      "donateCard": {
        "enabled": true,
        "title": "Donate Supplies",
        "description": "Your donation funds parent support services and resources for families in crisis.",
        "buttonLabel": "Give",
        "buttonHref": "/donate"
      }
    },
    "resourcesSection": {
      "programName": "Family Center",
      "learnCard": {
        "enabled": true,
        "title": "Learn",
        "description": "Learn about parent advocacy and the legal challenges families face in the Grand Junction area.",
        "buttonLabel": "Learn More",
        "buttonHref": "/our-story"
      },
      "resourcesCard": {
        "enabled": true,
        "title": "Free Resources",
        "description": "Free resources for parents including legal aid guides, support groups, and family services contacts.",
        "buttonLabel": "Learn More",
        "buttonHref": "/our-story"
      }
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
  },
  // ── Seasonal dynamic forms (22-seasonal-special-forms.md) ────────────────
  // Both default to active: false. Staff opens them in Studio each season by
  // toggling `active` to true and (optionally) setting an activeDates window.
  {
    "_type": "dynamicForm",
    "_id": "form-easter-basket",
    "title": "Easter Basket Order",
    "slug": { "_type": "slug", "current": "easter-basket-order" },
    "active": false,
    "description": "Place your Easter basket order for The Joseph Center community. All orders support families in the Grand Valley.",
    "fields": [
      { "_key": "eb-1", "label": "First Name", "name": "firstName", "type": "text", "required": true },
      { "_key": "eb-2", "label": "Last Name", "name": "lastName", "type": "text", "required": true },
      { "_key": "eb-3", "label": "Phone Number", "name": "phone", "type": "phone", "required": true },
      { "_key": "eb-4", "label": "Email Address", "name": "email", "type": "email", "required": true },
      { "_key": "eb-5", "label": "Number of Baskets", "name": "quantity", "type": "number", "required": true },
      { "_key": "eb-6", "label": "Special Requests or Notes", "name": "notes", "type": "textarea", "required": false }
    ],
    "successMessage": "Thank you for your Easter basket order! We'll be in touch with pickup details.",
    "notifyEmail": ""
  },
  {
    "_type": "dynamicForm",
    "_id": "form-angel-tree",
    "title": "Christmas Angel Tree",
    "slug": { "_type": "slug", "current": "angel-tree" },
    "active": false,
    "description": "Sign up to give or receive gifts through The Joseph Center's Christmas Angel Tree program.",
    "fields": [
      { "_key": "at-1", "label": "First Name", "name": "firstName", "type": "text", "required": true },
      { "_key": "at-2", "label": "Last Name", "name": "lastName", "type": "text", "required": true },
      { "_key": "at-3", "label": "Phone Number", "name": "phone", "type": "phone", "required": true },
      { "_key": "at-4", "label": "Email Address", "name": "email", "type": "email", "required": true },
      {
        "_key": "at-5",
        "label": "I would like to",
        "name": "participation",
        "type": "select",
        "required": true,
        "options": ["Donate gifts", "Receive gifts", "Both"]
      },
      { "_key": "at-6", "label": "Number in household (if receiving)", "name": "householdSize", "type": "number", "required": false },
      { "_key": "at-7", "label": "Notes or special requests", "name": "notes", "type": "textarea", "required": false }
    ],
    "successMessage": "Thank you for signing up for the Angel Tree program! We'll follow up with more details.",
    "notifyEmail": ""
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
