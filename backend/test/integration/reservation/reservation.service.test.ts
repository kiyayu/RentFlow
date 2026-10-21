//test/integration/reservation/reservation.service.test.ts
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { productService } from '../../../src/modules/product/product.service.js'
import { reservationService } from '../../../src/modules/reservation/reservation.service.js'
import { Unit } from '../../../src/modules/unit/unit.model.js'
import { User } from '../../../src/modules/user/user.model.js'
import { connectTestDb, clearTestDb, disconnectTestDb } from '../../helpers/testDb.js'

const productInput = {
  name: 'Canon EOS R6',
  description: 'Full-frame mirrorless camera for professional photo and video work.',
  brand: 'Canon',
  images: ['https://example.com/canon-r6.jpg'],
  specifications: { sensor: 'Full frame' },
  rentalPricing: { amount: 500, currency: 'ETB' as const, billingUnit: 'day' as const },
}

const rentalWindow = () => ({
  startAt: new Date(Date.now() + 48 * 60 * 60 * 1000),
  endAt: new Date(Date.now() + 72 * 60 * 60 * 1000),
})

describe('reservationService', () => {
  beforeAll(async () => connectTestDb())
  beforeEach(async () => clearTestDb())
  afterAll(async () => disconnectTestDb())

  const setup = async (unitCount = 1) => {
    const customer = await User.create({ name: 'Customer One', email: 'customer@example.com', password: 'password', role: 'customer', emailVerified: true })
    const product = await productService.create(customer.id, productInput)
    await Unit.create(Array.from({ length: unitCount }, (_, index) => ({ productId: product.id, assetTag: `CAM-${index + 1}`, condition: 'good', operationalStatus: 'available', custodyStatus: 'in_stock' })))
    return { customer, product }
  }

  it('automatically allocates an available unit before payment', async () => {
    const { customer, product } = await setup()
    const reservation = await reservationService.create(customer.id, { items: [{ productId: product.id, quantity: 1 }], ...rentalWindow() })

    const listed = await reservationService.listMine(customer.id, {})
    expect(reservation.status).toBe('pending_payment')
    expect(listed.reservations[0].assignedUnits).toHaveLength(1)
    expect(listed.reservations[0].assignedUnits[0].assetTag).toBe('CAM-1')
  })

  it('rejects an overlapping booking when there is no remaining unit', async () => {
    const { customer, product } = await setup()
    const input = { items: [{ productId: product.id, quantity: 1 }], ...rentalWindow() }
    await reservationService.create(customer.id, input)

    await expect(reservationService.create(customer.id, input)).rejects.toMatchObject({ statusCode: 409 })
  })

  it('moves the allocated unit through check-out and return custody', async () => {
    const { customer, product } = await setup()
    const created = await reservationService.create(customer.id, { items: [{ productId: product.id, quantity: 1 }], ...rentalWindow() })
    await reservationService.simulatePayment(customer.id, created.id)
    await reservationService.updateStatus(created.id, { status: 'checked_out' })

    expect((await Unit.findOne({ assetTag: 'CAM-1' }))?.custodyStatus).toBe('checked_out')

    await reservationService.updateStatus(created.id, { status: 'completed', returnCondition: 'good' })
    expect((await Unit.findOne({ assetTag: 'CAM-1' }))?.custodyStatus).toBe('inspection_required')
  })
})
