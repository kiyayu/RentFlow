import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import { Product } from '../modules/product/product.model.js';
import { Unit } from '../modules/unit/unit.model.js';
import { User } from '../modules/user/user.model.js';
import { hashPassword } from '../common/utils/password.js';

type CatalogItem = {
  name: string;
  brand: string;
  amount: number;
  description: string;
  specifications: Record<string, string>;
  image: string;
};

const image = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=80`;

const catalog: CatalogItem[] = [
  {
    name: 'Canon EOS R6 Mark II',
    brand: 'Canon',
    amount: 1800,
    description: 'Professional full-frame mirrorless camera for photography and video.',
    specifications: { sensor: '24.2 MP full-frame', video: '4K 60p' },
    image: image('photo-1516035069371-29a1b244cc32'),
  },
  {
    name: 'Sony A7 IV',
    brand: 'Sony',
    amount: 1900,
    description: 'Hybrid full-frame camera for commercial photo and video production.',
    specifications: { sensor: '33 MP full-frame', video: '4K 60p' },
    image: image('photo-1452780212940-6f5c0d14d848'),
  },
  {
    name: 'Nikon Z6 II',
    brand: 'Nikon',
    amount: 1600,
    description: 'Reliable full-frame camera for events and documentary work.',
    specifications: { sensor: '24.5 MP full-frame', video: '4K UHD' },
    image: image('photo-1510127034890-ba27508e9f1c'),
  },
  {
    name: 'Canon RF 24-70mm F2.8 L',
    brand: 'Canon',
    amount: 850,
    description: 'Professional standard zoom lens for Canon RF cameras.',
    specifications: { focalLength: '24–70 mm', aperture: 'f/2.8' },
    image: image('photo-1616423640778-28d1b53229bd'),
  },
  {
    name: 'Sony FE 70-200mm F2.8 GM',
    brand: 'Sony',
    amount: 1200,
    description: 'Telephoto zoom lens for sports, events, and portrait work.',
    specifications: { focalLength: '70–200 mm', aperture: 'f/2.8' },
    image: image('photo-1510127034890-ba27508e9f1c'),
  },
  {
    name: 'DJI RS 3 Pro',
    brand: 'DJI',
    amount: 900,
    description: 'Three-axis camera stabilizer for professional video production.',
    specifications: { payload: '4.5 kg', axes: '3' },
    image: image('photo-1536240478700-b869070f9279'),
  },
  {
    name: 'DJI Mavic 3 Pro',
    brand: 'DJI',
    amount: 2500,
    description: 'Triple-camera aerial platform for commercial production.',
    specifications: { flightTime: '43 minutes', video: '5.1K' },
    image: image('photo-1473968512647-3e447244af8f'),
  },
  {
    name: 'Aputure 300D II',
    brand: 'Aputure',
    amount: 750,
    description: 'High-output daylight LED fixture for studio and location lighting.',
    specifications: { output: '350 W', colorTemperature: '5500 K' },
    image: image('photo-1483985988355-763728e1935b'),
  },
  {
    name: 'Rode Wireless PRO',
    brand: 'Rode',
    amount: 600,
    description: 'Dual-channel wireless microphone system with onboard recording.',
    specifications: { channels: '2', recording: '32-bit float' },
    image: image('photo-1590602847861-f357a9332bbc'),
  },
  {
    name: 'Zoom H6essential',
    brand: 'Zoom',
    amount: 550,
    description: 'Six-track field recorder for podcasts, film, and interviews.',
    specifications: { inputs: '4 XLR/TRS', recording: '32-bit float' },
    image: image('photo-1593697821252-0c9137d9fc45'),
  },
  {
    name: 'Apple iPhone 15 Pro Max',
    brand: 'Apple',
    amount: 1300,
    description: 'Flagship mobile device for content capture, testing, and events.',
    specifications: { storage: '256 GB', display: '6.7 inch' },
    image: image('photo-1592750475338-74b7b21085ab'),
  },
  {
    name: 'Samsung Galaxy S24 Ultra',
    brand: 'Samsung',
    amount: 1250,
    description: 'Premium Android phone for mobile production and field testing.',
    specifications: { storage: '256 GB', display: '6.8 inch' },
    image: image('photo-1610945265064-0e34e5519bbf'),
  },
  {
    name: 'MacBook Pro 14 M3 Pro',
    brand: 'Apple',
    amount: 2200,
    description: 'Professional laptop for editing, development, and production work.',
    specifications: { memory: '18 GB', storage: '512 GB SSD' },
    image: image('photo-1517336714731-489689fd1ca8'),
  },
  {
    name: 'Dell XPS 15',
    brand: 'Dell',
    amount: 1700,
    description: 'High-performance Windows laptop for design and engineering workloads.',
    specifications: { memory: '32 GB', storage: '1 TB SSD' },
    image: image('photo-1496181133206-80ce9b88a853'),
  },
  {
    name: 'Bosch GSB 18V-55 Drill Driver',
    brand: 'Bosch',
    amount: 350,
    description: 'Cordless drill driver for construction and maintenance work.',
    specifications: { voltage: '18 V', torque: '55 Nm' },
    image: image('photo-1504148455328-c376907d081c'),
  },
  {
    name: 'Makita HR2470 Rotary Hammer',
    brand: 'Makita',
    amount: 450,
    description: 'Rotary hammer for concrete drilling and light demolition.',
    specifications: { power: '780 W', impactEnergy: '2.4 J' },
    image: image('photo-1572981779307-38b8cabb2407'),
  },
  {
    name: 'DeWalt DWE7492 Table Saw',
    brand: 'DeWalt',
    amount: 1000,
    description: 'Portable jobsite table saw for accurate timber cutting.',
    specifications: { power: '2000 W', blade: '250 mm' },
    image: image('photo-1503387762-592deb58ef4e'),
  },
  {
    name: 'Hilti TE 70-AVR Breaker',
    brand: 'Hilti',
    amount: 1600,
    description: 'Heavy-duty combi hammer for concrete drilling and breaking.',
    specifications: { power: '1800 W', impactEnergy: '11.5 J' },
    image: image('photo-1504917595217-d4dc5ebe6122'),
  },
  {
    name: 'Honda EU22i Generator',
    brand: 'Honda',
    amount: 1400,
    description: 'Quiet portable inverter generator for site and event power.',
    specifications: { output: '2200 W', fuel: 'Petrol' },
    image: image('photo-1530124566582-a618bc2615dc'),
  },
  {
    name: 'Wacker Neuson VP 1550 Plate Compactor',
    brand: 'Wacker Neuson',
    amount: 1100,
    description: 'Plate compactor for soil and paving preparation.',
    specifications: { force: '15 kN', weight: '92 kg' },
    image: image('photo-1503387762-592deb58ef4e'),
  },
];

const slug = (name: string) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const demoUser = {
  name: 'RentFlow Demo Customer',
  email: 'rentflow@gmail.com',
  role: 'customer' as const,
};

async function seedDemoUsers() {
  const password = process.env.DEMO_PASSWORD?.trim() || 'Rentflow12345';

  const passwordHash = await hashPassword(password);
  const existing = await User.findOne({ email: demoUser.email }).select('_id');
  if (existing) return 0;

  await User.create({ ...demoUser, password: passwordHash, emailVerified: true, isActive: true });
  return 1;
}

async function seed() {
  await connectDB();
  try {
    const owner = await User.findOne({ role: { $in: ['staff', 'admin'] }, isActive: true }).select(
      '_id'
    );
    if (!owner)
      throw new Error('Create an active staff or admin user before seeding the rental catalog');
    const demo = await seedDemoUsers();
    let productsCreated = 0;
    let unitsCreated = 0;
    for (const { name, brand, amount, description, specifications, image: imageUrl } of catalog) {
      const productSlug = slug(name);
      let product = await Product.findOne({ slug: productSlug });
      if (!product) {
        product = await Product.create({
          name,
          slug: productSlug,
          brand,
          description,
          specifications,
          images: [imageUrl],
          rentalPricing: { amount, currency: 'ETB', billingUnit: 'day' },
          status: 'active',
          createdBy: owner._id,
        });
        productsCreated += 1;
      } else if (
        product.images.length === 0 ||
        product.images.some((url) => url.includes('$%7Bid%7D') || url.includes('${id}'))
      ) {
        product.images = [imageUrl];
        await product.save();
      }
      for (const unitNumber of [1, 2]) {
        const assetTag = `SEED-${productSlug.slice(0, 18).toUpperCase()}-${unitNumber}`;
        const result = await Unit.updateOne(
          { assetTag },
          {
            $setOnInsert: {
              productId: product._id,
              assetTag,
              serialNumber: `${assetTag}-SN`,
              condition: 'good',
              operationalStatus: 'available',
              custodyStatus: 'in_stock',
              notes: 'Seed catalog unit',
            },
          },
          { upsert: true }
        );
        if (result.upsertedCount === 1) unitsCreated += 1;
      }
    }
    console.log(
      `Rental catalog seed complete: ${productsCreated} products and ${unitsCreated} units created.`
    );
    if (demo > 0) console.log(`Demo user created: ${demoUser.email}`);
  } finally {
    await mongoose.disconnect();
  }
}

void seed().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
