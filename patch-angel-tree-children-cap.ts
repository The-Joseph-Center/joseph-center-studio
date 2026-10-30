// Adds a "Number of children" question to the Christmas Angel Tree form and
// caps it at 150 children.
//
// Why both at once: the cap counts a field, and the field it needs to count did
// not exist. The form has been asking "Number in household (if receiving)",
// which is adults and children together and cannot be turned into a number of
// gifts. So the question is added, the cap is pointed at it, and from here the
// form adds itself up.
//
// What this CANNOT recover: the sign-ups already taken. They hold a household
// size and no child count, so there is no sum to compute for them. The cap's
// `alreadyCounted` is therefore left at 0 and has to be set by hand, in the
// dashboard, to staff's own figure for everyone counted so far — the Forms page
// prints how many stored sign-ups carry no number, which is the size of what
// you are estimating. Until it is set the cap undercounts by that whole group,
// so set it before the form reopens.
//
// The household question is kept, not replaced. It is in the answers already
// stored and removing it would leave them pointing at a question that no longer
// exists.
//
// Run from studio/:
//   SANITY_STUDIO_DATASET=staging pnpm sanity exec patch-angel-tree-children-cap.ts --with-user-token
//   CONFIRM_PRODUCTION=yes SANITY_STUDIO_DATASET=production pnpm sanity exec patch-angel-tree-children-cap.ts --with-user-token
import { getCliClient } from 'sanity/cli'

const client = getCliClient()
const dataset = client.config().dataset

if (dataset === 'production' && process.env.CONFIRM_PRODUCTION !== 'yes') {
  console.error(
    'Refusing to patch the Angel Tree form on production.\n' +
      '  CONFIRM_PRODUCTION=yes SANITY_STUDIO_DATASET=production pnpm sanity exec patch-angel-tree-children-cap.ts --with-user-token'
  )
  process.exit(1)
}

const CHILDREN_FIELD = {
  _key: 'at-8',
  label: 'How many children are you signing up?',
  name: 'childrenCount',
  type: 'number',
  required: false,
}

const CAP = {
  limit: 150,
  countField: 'childrenCount',
  // Deliberately zero. See the note at the top of this file.
  alreadyCounted: 0,
  fullMessage:
    'We have reached the number of children we are able to serve this year. Thank you — please call us at (970) 245-4672 and we will do what we can.',
}

interface Field { _key?: string; name?: string }

async function run() {
  console.log(`Dataset: ${dataset}`)

  const form = await client.fetch<{ _id: string; fields?: Field[]; cap?: unknown } | null>(
    `*[_type=="dynamicForm" && slug.current=="angel-tree"][0]{_id, fields, cap}`
  )
  if (!form) {
    console.error('  No angel-tree form found. Nothing changed.')
    process.exit(1)
  }

  const fields = form.fields ?? []
  const already = fields.some((f) => f.name === CHILDREN_FIELD.name)

  // Placed before the free-text notes, so the questions still read in the
  // order somebody would ask them.
  const notesAt = fields.findIndex((f) => f.name === 'notes')
  const next = already
    ? fields
    : notesAt >= 0
      ? [...fields.slice(0, notesAt), CHILDREN_FIELD, ...fields.slice(notesAt)]
      : [...fields, CHILDREN_FIELD]

  await client.patch(form._id).set({ fields: next, cap: CAP }).commit()

  console.log(already
    ? '  childrenCount — already there, left alone'
    : `  childrenCount — added${notesAt >= 0 ? ' before the notes question' : ''}`)
  console.log(`  cap — ${CAP.limit} children, counting "${CAP.countField}", starting from ${CAP.alreadyCounted}`)
  console.log('\nSet "Counted before the form tracked it" in the dashboard before the form reopens.')
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})
