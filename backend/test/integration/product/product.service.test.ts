//test/integration/product/product.servce.test.s
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { Types } from 'mongoose'
 
import { productService } from '../../../src/modules/product/product.service.js'
import { connectTestDb, clearTestDb, disconnectTestDb } from '../../helpers/testDb.js'

const productInput = (name = 'Canon EOS R6') => ({
  name,
  description: 'Full-frame mirrorless camera for professional photo and video work.',
  brand: 'Canon',
  images: ['https://example.com/canon-r6.jpg'],
  specifications: { sensor: 'Full frame', resolution: '20.1 MP' },
  rentalPricing: { amount: 500, currency: 'ETB' as const, billingUnit: 'day' as const },
})

describe('productService', () => {
  beforeAll(async () => connectTestDb())
  beforeEach(async () => clearTestDb())
  afterAll(async () => disconnectTestDb())

  it('creates a product with a stable generated slug', async () => {
    const product = await productService.create(new Types.ObjectId().toString(), productInput())

    expect(product.slug).toBe('canon-eos-r6')
    expect(product.status).toBe('active')
    expect(product.rentalPricing.amount).toBe(500)
  })

  it('rejects a duplicate product name', async () => {
    const userId = new Types.ObjectId().toString()
    await productService.create(userId, productInput())

await expect(productService.create(userId, productInput())).rejects.toMatchObject({ statusCode: 409 })  })

  it('hides archived products from the public catalog', async () => {
    const created = await productService.create(new Types.ObjectId().toString(), productInput())
    await productService.archive(created.id)

    const result = await productService.list({})
await expect(productService.getBySlug(created.slug)).rejects.toMatchObject({ statusCode: 404 })
    expect(result.products).toHaveLength(0)
  })

  it('keeps a product accessible after a pricing update', async () => {
    const created = await productService.create(new Types.ObjectId().toString(), productInput())
    const updated = await productService.update(created.id, {
      rentalPricing: { amount: 650, currency: 'ETB', billingUnit: 'day' },
    })

    expect(updated.rentalPricing.amount).toBe(650)
    expect(updated.slug).toBe(created.slug)
  })
})
