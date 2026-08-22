# Deployment & Production Guidelines

## Backend Deployment
The Express backend should be deployed to a Node.js compatible environment (e.g., Google Cloud Run, Heroku, AWS Elastic Beanstalk).

**Required Environment Variables in Production:**
- `NODE_ENV=production`
- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY`

**Build Command:**
```bash
npm run build
npm start
```

## Frontend Deployments
The frontends (Vite + React) are static bundles and should be deployed to CDNs like Vercel, Firebase Hosting, or Netlify.

### 1. Main Web
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Host:** Public Domain (e.g., `hackathonos.com`)

### 2. Judge Portal
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Host:** Separate Subdomain (e.g., `judge.hackathonos.com`)

### 3. Admin Panel
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Host:** Separate, obfuscated, or VPN-protected Subdomain (e.g., `admin-control.hackathonos.com`)

**Required Frontend Environment Variables:**
- `VITE_API_URL` (Pointing to the production Backend URL)
- Firebase Client SDK keys

## CORS Configuration
Before launch, update the Backend CORS origins to explicitly allow only the three frontend production URLs. Reject `*`.
