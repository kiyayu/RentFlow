import mongoose from 'mongoose'
import { connectDB } from '../config/db.js'
import { Product } from '../modules/product/product.model.js'
import { Unit } from '../modules/unit/unit.model.js'
import { User } from '../modules/user/user.model.js'

// Run once with: npm run seed:rental-catalog
const catalog = [
  ['Canon EOS R6 Mark II', 'Canon', 1800, 'Professional full-frame mirrorless camera for photography and video.', { sensor: '24.2 MP full-frame', video: '4K 60p' }],
  ['Sony A7 IV', 'Sony', 1900, 'Hybrid full-frame camera for commercial photo and video production.', { sensor: '33 MP full-frame', video: '4K 60p' }],
  ['Nikon Z6 II', 'Nikon', 1600, 'Reliable full-frame camera for events and documentary work.', { sensor: '24.5 MP full-frame', video: '4K UHD' }],
  ['Canon RF 24-70mm F2.8 L', 'Canon', 850, 'Professional standard zoom lens for Canon RF cameras.', { focalLength: '24–70 mm', aperture: 'f/2.8' }],
  ['Sony FE 70-200mm F2.8 GM', 'Sony', 1200, 'Telephoto zoom lens for sports, events, and portrait work.', { focalLength: '70–200 mm', aperture: 'f/2.8' }],
  ['DJI RS 3 Pro', 'DJI', 900, 'Three-axis camera stabilizer for professional video production.', { payload: '4.5 kg', axes: '3' }],
  ['DJI Mavic 3 Pro', 'DJI', 2500, 'Triple-camera aerial platform for commercial production.', { flightTime: '43 minutes', video: '5.1K' }],
  ['Aputure 300D II', 'Aputure', 750, 'High-output daylight LED fixture for studio and location lighting.', { output: '350 W', colorTemperature: '5500 K' }],
  ['Rode Wireless PRO', 'Rode', 600, 'Dual-channel wireless microphone system with onboard recording.', { channels: '2', recording: '32-bit float' }],
  ['Zoom H6essential', 'Zoom', 550, 'Six-track field recorder for podcasts, film, and interviews.', { inputs: '4 XLR/TRS', recording: '32-bit float' }],
  ['Apple iPhone 15 Pro Max', 'Apple', 1300, 'Flagship mobile device for content capture, testing, and events.', { storage: '256 GB', display: '6.7 inch' }],
  ['Samsung Galaxy S24 Ultra', 'Samsung', 1250, 'Premium Android phone for mobile production and field testing.', { storage: '256 GB', display: '6.8 inch' }],
  ['MacBook Pro 14 M3 Pro', 'Apple', 2200, 'Professional laptop for editing, development, and production work.', { memory: '18 GB', storage: '512 GB SSD' }],
  ['Dell XPS 15', 'Dell', 1700, 'High-performance Windows laptop for design and engineering workloads.', { memory: '32 GB', storage: '1 TB SSD' }],
  ['Bosch GSB 18V-55 Drill Driver', 'Bosch', 350, 'Cordless drill driver for construction and maintenance work.', { voltage: '18 V', torque: '55 Nm' }],
  ['Makita HR2470 Rotary Hammer', 'Makita', 450, 'Rotary hammer for concrete drilling and light demolition.', { power: '780 W', impactEnergy: '2.4 J' }],
  ['DeWalt DWE7492 Table Saw', 'DeWalt', 1000, 'Portable jobsite table saw for accurate timber cutting.', { power: '2000 W', blade: '250 mm' }],
  ['Hilti TE 70-AVR Breaker', 'Hilti', 1600, 'Heavy-duty combi hammer for concrete drilling and breaking.', { power: '1800 W', impactEnergy: '11.5 J' }],
  ['Honda EU22i Generator', 'Honda', 1400, 'Quiet portable inverter generator for site and event power.', { output: '2200 W', fuel: 'Petrol' }],
  ['Wacker Neuson VP 1550 Plate Compactor', 'Wacker Neuson', 1100, 'Plate compactor for soil and paving preparation.', { force: '15 kN', weight: '92 kg' }],
] as const

const slug = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')

async function seed() {
  await connectDB()
  try {
    const owner = await User.findOne({ role: { $in: ['staff', 'admin'] }, isActive: true }).select('_id')
    if (!owner) throw new Error('Create an active staff or admin user before seeding the rental catalog')
    let productsCreated = 0
    let unitsCreated = 0
    for (const [name, brand, amount, description, specifications] of catalog) {
      const productSlug = slug(name)
      let product = await Product.findOne({ slug: productSlug })
      if (!product) {
        product = await Product.create({ name, slug: productSlug, brand, description, specifications, images: [], rentalPricing: { amount, currency: 'ETB', billingUnit: 'day' }, status: 'active', createdBy: owner._id })
        productsCreated += 1
      }
      for (const unitNumber of [1, 2]) {
        const assetTag = `SEED-${productSlug.slice(0, 18).toUpperCase()}-${unitNumber}`
        const result = await Unit.updateOne({ assetTag }, { $setOnInsert: { productId: product._id, assetTag, serialNumber: `${assetTag}-SN`, condition: 'good', operationalStatus: 'available', custodyStatus: 'in_stock', notes: 'Seed catalog unit' } }, { upsert: true })
        if (result.upsertedCount === 1) unitsCreated += 1
      }
    }
    console.log(`Rental catalog seed complete: ${productsCreated} products and ${unitsCreated} units created.`)
  } finally {
    await mongoose.disconnect()
  }
}

void seed().catch((error: unknown) => {
  console.error(error)
  process.exitCode = 1
})
