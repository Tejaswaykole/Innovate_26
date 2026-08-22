import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import * as dotenv from 'dotenv';

dotenv.config();

// Conditionally initialize based on whether apps exist and env vars are present
if (!getApps().length) {
  try {
    if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL) {
      let rawKey = process.env.FIREBASE_PRIVATE_KEY;
      
      // The ultimate foolproof private key formatter
      // Extracts the raw base64 data regardless of spaces, missing newlines, or quotes
      const match = rawKey.match(/-----BEGIN PRIVATE KEY-----(.*?)-----END PRIVATE KEY-----/s);
      let formattedKey = rawKey;
      
      if (match) {
        // Strip out all whitespace, newlines, literal '\n', and quotes from the payload
        const cleanBase64 = match[1].replace(/\\n/g, '').replace(/[^A-Za-z0-9+/=]/g, '');
        // Split into standard 64-character lines for strict PEM format
        const chunks = cleanBase64.match(/.{1,64}/g) || [];
        formattedKey = `-----BEGIN PRIVATE KEY-----\n${chunks.join('\n')}\n-----END PRIVATE KEY-----\n`;
      } else {
        // Fallback basic unescaping if the regex somehow fails
        formattedKey = rawKey.replace(/^["']+|["']+$/g, '').replace(/\\n/g, '\n');
      }

      initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: formattedKey,
        }),
      });
      console.log('Firebase Admin SDK initialized successfully.');
    } else {
      console.warn('Firebase Admin SDK not initialized: Missing credentials in environment variables.');
    }
  } catch (error) {
    console.error('Firebase Admin SDK initialization error:', error);
  }
}

export const auth = getApps().length ? getAuth() : null;
export const db = getApps().length ? getFirestore() : null;
