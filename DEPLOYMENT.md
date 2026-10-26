# Deployment

1. Point the DNS A/AAAA record for `DOMAIN` at the server and allow inbound ports 80 and 443.
2. Copy `.env.production.example` to `.env.production` and replace every example value with a production value.
3. Start the stack with `docker compose --env-file .env.production up -d --build`.
4. Create the first staff or admin account, then run `docker compose exec api node dist/scripts/seedRentalCatalog.js` if the catalog should be seeded.
5. Check `https://your-domain/health` through the API container with `docker compose exec api node -e "fetch('http://127.0.0.1:5000/health').then(response => response.json()).then(console.log)"`.

MongoDB runs as a single-node replica set because inventory and reservation state changes require transactions. MongoDB, Redis, and the API are internal-only; Caddy is the only public service and obtains TLS certificates automatically.

## Render portfolio deployment

Render Free is suitable for a portfolio preview, not a production rental business. This deployment uses one web service, so the React application and API share one `onrender.com` origin and signed-cookie authentication works without a custom domain.

1. Create a MongoDB Atlas Free cluster, database user, and connection string. Atlas Free clusters are replica-set clusters, which supports this application's transactions.
2. Create a Render Free Key Value instance in the same region and copy its internal Redis URL.
3. Create a Render Web Service from this repository with these settings:

   - Runtime: `Docker`
   - Dockerfile path: `./Dockerfile.render`
   - Docker build context: `.`
   - Instance type: `Free`
   - Health check path: `/health`
   - Service port: `10000`

4. Choose the service name before its first build. If it is `project-b-portfolio`, set these values in Render:

```env
PORT=10000
NODE_ENV=production
CLIENT_URL=https://project-b-portfolio.onrender.com
VITE_API_BASE_URL=https://project-b-portfolio.onrender.com/api/
VITE_DEFAULT_LANG=en
MONGO_URL=your-atlas-connection-string
REDIS_URL=your-render-key-value-internal-url
JWT_ACCESS_SECRET=unique-secret-at-least-32-characters
JWT_REFRESH_SECRET=a-different-unique-secret-at-least-32-characters
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
COOKIE_SECRET=another-unique-secret-at-least-32-characters
SMTP_HOST=your-smtp-host
SMTP_PORT=2525
SMTP_USER=your-smtp-user
SMTP_PASS=your-smtp-password
SMTP_FROM=no-reply@example.com
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=https://project-b-portfolio.onrender.com/api/auth/google/callback
STORAGE_DRIVER=cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

5. Deploy, open the generated `https://project-b-portfolio.onrender.com` URL, register a staff/admin user, and then run the catalog seed from the Render Shell when it is available on a paid service. On Free, seed locally against the Atlas connection string before the deployment.
