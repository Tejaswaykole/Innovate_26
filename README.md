# Hackathon OS

A complete Hackathon Operating System designed to manage the entire lifecycle of a hackathon, from participant registration to judge evaluations and final result publications.

## Architecture & Workflows

The platform is divided into three isolated frontends and a unified backend, all communicating with a centralized Firebase ecosystem.

### Applications

1. **Main Web** (`frontend/main-web`)
   - **Role:** `participant`
   - **Features:** Team Formation, Open Problem Statement Drafting, Project Pitch Uploads (PPT, Video).
   
2. **Judge Portal** (`frontend/judge-portal`)
   - **Role:** `judge`
   - **Features:** Assigned Team Reviews, Read-Only Project Access, Scoring & Evaluation.
   
3. **Admin Panel** (`frontend/admin-panel`)
   - **Role:** `admin`
   - **Features:** Secure Judge Provisioning, Team Assignment, Real-time Aggregation, Final Results Publication.

### Technology Stack
- **Backend**: Express.js + Node.js + TypeScript
- **Frontend**: React + Vite + TailwindCSS
- **Database**: Firebase Firestore
- **Authentication**: Firebase Authentication
- **Storage**: Firebase Storage (Buckets)

## Local Setup

1. **Backend**
   ```bash
   cd backend
   npm install
   npm run dev
   ```

2. **Frontends**
   ```bash
   cd frontend/main-web
   npm install
   npm run dev
   ```
   *(Repeat for `judge-portal` and `admin-panel`)*

## Environment Configuration

You must create `.env` files in each respective directory. **Never commit these files.**

### Backend (`backend/.env`)
```
PORT=5000
FIREBASE_PROJECT_ID=your-project
# Include your private firebase-admin keys here securely
```

### Frontends (`frontend/*/.env`)
```
VITE_API_URL=http://localhost:5000/api/v1
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-domain
VITE_FIREBASE_PROJECT_ID=your-project
```

## Security & Access
For detailed security architecture, rule boundaries, and known vulnerabilities, refer to `docs/security.md`.

## License
MIT License
