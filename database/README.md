# Firebase & Database Architecture

This directory contains the Firebase foundation for the College Hackathon Management Platform. 

## Firebase Project Purpose
The platform uses **ONE Firebase project** for all systems (`main-web`, `judge-portal`, `admin-panel`). 
The infrastructure consists of:
- **Firebase Authentication**: For user identity and system role assertion.
- **Cloud Firestore**: Primary NoSQL database.
- **Firebase Storage**: For all file uploads (PPTs, Demo Videos, Screenshots, Certificates).

## Security Approach
The security model is **Default-Deny**.
- All rules in `firestore.rules` and `storage.rules` currently block all public and authenticated access to the database.
- Authorization will eventually be enforced through a combination of **Firestore Security Rules** and **Backend Middleware (Firebase Admin SDK)**.
- System roles are restricted to: `participant`, `judge`, `admin`.
- Team-level roles (`leader`, `member`) exist logically but are NOT system authentication roles.

## Environment Configuration
Do NOT commit any real configuration secrets. 
- Use the `.env.example` in the backend for the **Firebase Admin SDK**.
- For the frontend **Firebase Client SDK**, an example configuration would look like:

```typescript
// Example Firebase Client SDK configuration
export const firebaseConfig = {
  apiKey: "API_KEY",
  authDomain: "PROJECT_ID.firebaseapp.com",
  projectId: "PROJECT_ID",
  storageBucket: "PROJECT_ID.appspot.com",
  messagingSenderId: "SENDER_ID",
  appId: "APP_ID"
};
```
Never expose Admin SDK credentials (like the Service Account JSON or Private Keys) to the frontend.

## Schema Documentation
Information about future data schema domains (users, teams, projects, etc.) can be found in [schema/README.md](schema/README.md).

## Local Development (Emulators)
To test locally, you can initialize Firebase Emulators. 
1. Install firebase-tools: `npm install -g firebase-tools`
2. Initialize emulators: `firebase init emulators`
3. Select Auth, Firestore, and Storage.
4. Run: `firebase emulators:start`
