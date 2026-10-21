//src/lib/i18n/locales/en/marketing.ts
export const marketing = {
  tagline: 'Equipment rental, managed with confidence.',
  hero: {
    title: 'The equipment you need, ready when you need it.',
    description:
      'Browse dependable equipment, reserve the dates that work for you, and keep every rental detail in one clear place.',
    primary: 'Browse equipment',
    secondary: 'Sign in',
  },
  features: {
    title: 'A clearer rental experience',
    items: [
      { title: 'Find the right equipment', description: 'Explore equipment details, pricing, and availability before you make a plan.', icon: 'zap' },
      { title: 'Reserve with confidence', description: 'Your rental dates and agreed price stay clear from reservation to return.', icon: 'shield' },
      { title: 'Keep every rental organized', description: 'Manage equipment, bookings, handovers, and returns from one workspace.', icon: 'layers' },
    ],
  },
  cta: {
    title: 'Ready to plan your rental?',
    description: 'Create an account to reserve equipment and manage your bookings.',
    button: 'Create an account',
  },
  contact: {
    title: 'Contact',
    description: 'Questions about equipment, reservations, or your account.',
    body: 'Send us a message and include your reservation number when your request relates to an existing rental.',
  },
  pricing: {
    title: 'Rental pricing',
    description: 'Every item has a clear daily rental rate shown before you reserve it.',
    itemBased: {
      title: 'Pricing is based on the equipment you choose',
      body: 'Each equipment listing shows its current daily rate. Your reservation total is calculated from the selected items and rental dates before you proceed.',
    },
    booking: {
      title: 'Your reservation keeps the agreed rate',
      body: 'Once a reservation is created, its pricing is recorded with that booking. Later changes to a listing do not rewrite an existing rental agreement.',
    },
    support: {
      title: 'Need help planning a rental?',
      body: 'Contact the rental team for help choosing equipment, confirming availability, or understanding pickup and return requirements.',
    },
    action: 'Browse equipment',
  },
  categories: {
    eyebrow: 'Equipment for real work',
    title: 'Built around the equipment people depend on',
    description: 'Start with the category that fits the job, then compare the details that matter.',
    items: [
      { title: 'Photo and video', description: 'Cameras, lenses, lighting, and supporting equipment for shoots of every size.' },
      { title: 'Computing', description: 'Laptops and practical accessories for projects, teams, and short-term work.' },
      { title: 'Events and presentations', description: 'Projectors, displays, and audio equipment for meetings and live events.' },
    ],
  },
  process: {
    eyebrow: 'How it works',
    title: 'From selection to return, every step is clear',
    steps: [
      { title: 'Choose your equipment', description: 'Review the item details and select the equipment that matches your work.' },
      { title: 'Reserve your dates', description: 'Choose your rental period and receive a record of the agreed equipment and price.' },
      { title: 'Pick up and return', description: 'Collect the confirmed equipment, use it responsibly, and return it when your rental ends.' },
    ],
  },
} as const
