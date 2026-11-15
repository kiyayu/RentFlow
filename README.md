# RentFlow

RentFlow is an equipment-rental app for cameras, laptops, phones, and site tools. It keeps track of the actual physical units behind each listing, so a unit cannot be booked twice for the same dates.

Customers browse equipment, choose rental dates, and follow their bookings. Staff manage products, units, handover, returns, and late fees.

**Live demo:** https://rentflow-164r.onrender.com/

Use the one-click demo login to look around without signing up. The app runs on Render's free tier, so the first load after a break can take up to a minute.

## Highlights

- Product catalog with search, filters, specifications, and image uploads
- Physical inventory tracked by asset tag, condition, and custody status
- Reservations allocate specific available units and reject date conflicts
- Staff workflow for checkout, returns, inspection, and overdue rentals
- Signed-cookie authentication with customer, staff, and admin roles
- English and Amharic interface

## Built with

React, TypeScript, Vite, Tailwind, TanStack Query, Express, MongoDB, Mongoose, Redis, BullMQ, and Cloudinary.

## Run locally

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

cd backend && npm install
cd ../frontend && npm install
```

Use a MongoDB replica set, because reservation allocation uses transactions. Then run the API and web client in separate terminals:

```bash
cd backend && npm run build && npm start
cd frontend && npm run dev
```

## Demo data

The catalog seed adds 20 equipment listings, two units per listing, product images from Unsplash, and one verified demo customer. It is safe to run again.

```bash
cd backend
npm run seed:rental-catalog
```

It creates `rentflow@gmail.com`, the customer account used by the one-click demo.

Set `DEMO_MODE=true` in Render to enable the one-click demo. Visitors do not need to see the password.

## Checks

```bash
cd frontend && npm run check
cd backend && npm run build && npx vitest run
```

## Notes

Payments are simulated during local development and disabled in production. A real launch would need a payment-provider webhook and a settlement flow. Render's free tier is fine for a portfolio demo, not for a commercial service.

Deployment notes are in [DEPLOYMENT.md](DEPLOYMENT.md).