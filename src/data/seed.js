/**
 * Demo workspace for Proofboard. Dates are generated relative to "now" the first time the
 * app loads, so the demo always has something due this week.
 */
const day = 86400000
const at = (days, hour = 10, minute = 0) => {
  const d = new Date(Date.now() + days * day)
  d.setHours(hour, minute, 0, 0)
  return d.toISOString()
}

export const FREELANCER = { name: 'Jordan Lee', role: 'freelancer', initials: 'JL' }

export function createSeed() {
  const projects = [
    {
      id: 'northwind-redesign',
      name: 'Website redesign',
      type: 'Website',
      client: { name: 'Elena Marsh', company: 'Northwind Coffee Roasters', initials: 'EM' },
      budget: 6800,
      startedAt: at(-38),
      dueAt: at(16),
      summary:
        'A faster, easier-to-shop site for a 3-location roastery. Moving from a template to a custom design with a subscription-first homepage.',
      palette: ['#2E2A26', '#C88B4A', '#F3EBDD'],
      milestones: [
        { id: 'm1', title: 'Discovery & sitemap', dueAt: at(-30), done: true },
        { id: 'm2', title: 'Wireframes', dueAt: at(-19), done: true },
        { id: 'm3', title: 'Visual design', dueAt: at(-4), done: true },
        { id: 'm4', title: 'Front-end build', dueAt: at(6), done: false },
        { id: 'm5', title: 'Content & launch', dueAt: at(16), done: false },
      ],
      deliverables: [
        {
          id: 'd-nw-1',
          title: 'Sitemap & user flows',
          kind: 'sitemap',
          version: 2,
          status: 'approved',
          updatedAt: at(-29, 15),
          comments: [
            { id: 'c1', author: 'client', text: 'Love that subscriptions sit at the top level now.', at: at(-29, 16) },
          ],
        },
        {
          id: 'd-nw-2',
          title: 'Homepage design',
          kind: 'web',
          version: 3,
          status: 'in-review',
          updatedAt: at(-1, 17, 20),
          comments: [
            {
              id: 'c2',
              author: 'client',
              text: 'v2 felt a bit dark on mobile. Could the hero photo be brighter?',
              at: at(-3, 11),
            },
            {
              id: 'c3',
              author: 'freelancer',
              text: 'Brightened the hero and moved the subscription CTA above the fold on mobile. v3 is up.',
              at: at(-1, 17, 22),
            },
          ],
        },
        {
          id: 'd-nw-3',
          title: 'Product page design',
          kind: 'shop',
          version: 1,
          status: 'changes',
          updatedAt: at(-2, 9),
          comments: [
            {
              id: 'c4',
              author: 'client',
              text: 'Can we show tasting notes before the price? Our customers choose by flavour first.',
              at: at(-1, 10, 5),
            },
          ],
        },
      ],
    },
    {
      id: 'halden-identity',
      name: 'Brand identity',
      type: 'Branding',
      client: { name: 'Marcus Halden', company: 'Halden & Co. Joinery', initials: 'MH' },
      budget: 4200,
      startedAt: at(-27),
      dueAt: at(5),
      summary:
        'A new identity for a family joinery workshop: wordmark, monogram, colour and type system, and a short guidelines document.',
      palette: ['#1F2A24', '#B9703F', '#E9E2D3'],
      milestones: [
        { id: 'm1', title: 'Brief & moodboard', dueAt: at(-22), done: true },
        { id: 'm2', title: 'Logo concepts', dueAt: at(-12), done: true },
        { id: 'm3', title: 'Refinement', dueAt: at(-2), done: true },
        { id: 'm4', title: 'Brand guidelines', dueAt: at(5), done: false },
      ],
      deliverables: [
        {
          id: 'd-hal-1',
          title: 'Moodboard',
          kind: 'moodboard',
          version: 1,
          status: 'approved',
          updatedAt: at(-23, 14),
          comments: [{ id: 'c5', author: 'client', text: 'Spot on. Warm, solid, not rustic-cliché.', at: at(-22, 9) }],
        },
        {
          id: 'd-hal-2',
          title: 'Final logo system',
          kind: 'brand',
          version: 2,
          status: 'in-review',
          updatedAt: at(0, 9, 40),
          comments: [
            {
              id: 'c6',
              author: 'client',
              text: 'The monogram is great. Could the wordmark be a touch heavier so it holds up when engraved?',
              at: at(-2, 16),
            },
            {
              id: 'c7',
              author: 'freelancer',
              text: 'Increased the stroke weight by 8% and tested at 12 mm engraving size. Both versions are in the file for comparison.',
              at: at(0, 9, 42),
            },
          ],
        },
        {
          id: 'd-hal-3',
          title: 'Brand guidelines',
          kind: 'doc',
          version: 1,
          status: 'draft',
          updatedAt: at(0, 8),
          comments: [],
        },
      ],
    },
    {
      id: 'marlowe-shop',
      name: 'E-commerce build',
      type: 'Development',
      client: { name: 'Inès Marlowe', company: 'Marlowe Ceramics', initials: 'IM' },
      budget: 9400,
      startedAt: at(-14),
      dueAt: at(34),
      summary:
        'An online shop for a small ceramics studio: collection pages, product variants for glazes, and a simple checkout with local pickup.',
      palette: ['#3A3330', '#8FA39A', '#F2EEE8'],
      milestones: [
        { id: 'm1', title: 'Requirements', dueAt: at(-10), done: true },
        { id: 'm2', title: 'Shop design', dueAt: at(3), done: false },
        { id: 'm3', title: 'Theme development', dueAt: at(20), done: false },
        { id: 'm4', title: 'Payments & testing', dueAt: at(28), done: false },
        { id: 'm5', title: 'Launch', dueAt: at(34), done: false },
      ],
      deliverables: [
        {
          id: 'd-mar-1',
          title: 'Collection page design',
          kind: 'shop',
          version: 1,
          status: 'approved',
          updatedAt: at(-6, 12),
          comments: [],
        },
        {
          id: 'd-mar-2',
          title: 'Checkout flow',
          kind: 'wireframe',
          version: 1,
          status: 'in-review',
          updatedAt: at(-1, 11, 15),
          comments: [
            {
              id: 'c8',
              author: 'freelancer',
              text: 'Three steps instead of five, and local pickup is a delivery option rather than a separate page.',
              at: at(-1, 11, 16),
            },
          ],
        },
      ],
    },
    {
      id: 'fieldnote-landing',
      name: 'Landing page',
      type: 'Website',
      client: { name: 'Theo Park', company: 'Fieldnote', initials: 'TP' },
      budget: 2600,
      startedAt: at(-60),
      dueAt: at(-24),
      summary: 'A launch page for a note-taking app for field researchers, with a waitlist sign-up.',
      palette: ['#14213D', '#E9C46A', '#F7F4EC'],
      milestones: [
        { id: 'm1', title: 'Copy & structure', dueAt: at(-52), done: true },
        { id: 'm2', title: 'Design', dueAt: at(-40), done: true },
        { id: 'm3', title: 'Build & launch', dueAt: at(-24), done: true },
      ],
      deliverables: [
        {
          id: 'd-fn-1',
          title: 'Landing page design',
          kind: 'landing',
          version: 2,
          status: 'approved',
          updatedAt: at(-41, 15),
          comments: [{ id: 'c9', author: 'client', text: 'Approved. The waitlist form feels effortless.', at: at(-40, 10) }],
        },
      ],
    },
    {
      id: 'oakline-refresh',
      name: 'Website refresh',
      type: 'Website',
      client: { name: 'Dr. Amara Nwosu', company: 'Oakline Dental', initials: 'AN' },
      budget: 3100,
      startedAt: at(-90),
      dueAt: at(-55),
      summary: 'Accessible appointment booking and a calmer visual style for a two-dentist practice.',
      palette: ['#23395B', '#7FB7BE', '#F4F7F6'],
      milestones: [
        { id: 'm1', title: 'Audit', dueAt: at(-85), done: true },
        { id: 'm2', title: 'Design', dueAt: at(-70), done: true },
        { id: 'm3', title: 'Build', dueAt: at(-55), done: true },
      ],
      deliverables: [
        {
          id: 'd-oak-1',
          title: 'Homepage & booking',
          kind: 'web',
          version: 2,
          status: 'approved',
          updatedAt: at(-71, 9),
          comments: [],
        },
      ],
    },
  ]

  const activity = [
    { id: 'a1', projectId: 'halden-identity', deliverableId: 'd-hal-2', type: 'upload', actor: 'freelancer', text: 'uploaded v2 of Final logo system', at: at(0, 9, 40), read: false },
    { id: 'a2', projectId: 'northwind-redesign', deliverableId: 'd-nw-3', type: 'changes', actor: 'client', text: 'requested changes on Product page design', at: at(-1, 10, 5), read: false },
    { id: 'a3', projectId: 'northwind-redesign', deliverableId: 'd-nw-2', type: 'upload', actor: 'freelancer', text: 'uploaded v3 of Homepage design', at: at(-1, 17, 20), read: true },
    { id: 'a4', projectId: 'marlowe-shop', deliverableId: 'd-mar-2', type: 'upload', actor: 'freelancer', text: 'shared Checkout flow for review', at: at(-1, 11, 15), read: true },
    { id: 'a5', projectId: 'halden-identity', type: 'milestone', actor: 'freelancer', text: 'completed the milestone Refinement', at: at(-2, 17), read: true },
    { id: 'a6', projectId: 'halden-identity', deliverableId: 'd-hal-2', type: 'comment', actor: 'client', text: 'commented on Final logo system', at: at(-2, 16), read: true },
    { id: 'a7', projectId: 'northwind-redesign', type: 'milestone', actor: 'freelancer', text: 'completed the milestone Visual design', at: at(-4, 18), read: true },
    { id: 'a8', projectId: 'marlowe-shop', deliverableId: 'd-mar-1', type: 'approve', actor: 'client', text: 'approved Collection page design', at: at(-6, 12, 30), read: true },
  ]

  return { role: 'freelancer', projects, activity }
}
