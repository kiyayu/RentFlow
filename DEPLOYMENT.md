# Deploying RentFlow

The simplest portfolio setup is one Render Docker web service, MongoDB Atlas, and Render Key Value. The web app and API stay on the same URL, which keeps signed-cookie authentication simple.

## Render

1. Create a free MongoDB Atlas cluster and copy its connection string. Atlas supports the transactions used for reservations.
2. Create a Render Key Value instance and copy its internal Redis URL.
3. Create a Render Web Service from this repository:
   - Environment: `Docker`
   - Dockerfile: `./Dockerfile.render`
   - Build context: `.`
   - Health check: `/health`
   - Port: `10000`
4. Add the values from `.env.production.example` in Render's environment settings. Set `CLIENT_URL` and `VITE_API_BASE_URL` to your generated `https://<service>.onrender.com` URL.
5. Deploy. Open `/health` first, then open the site.

## Seed the live demo

Free Render services do not provide a shell. On your computer, put the Atlas connection string in `backend/.env` and run:

```bash
cd backend
npm run seed:rental-catalog
```

Set `DEMO_MODE=true` in Render, then redeploy. Visitors can use the one-click demo login as `rentflow@gmail.com`. No password needs to be shown on the site.

## Docker Compose

`compose.yaml` is for a future VPS deployment. Copy `.env.production.example` to `.env.production`, supply real values, then run:

```bash
docker compose --env-file .env.production up -d --build
```

The production stack includes MongoDB as a single-node replica set because reservations use transactions.