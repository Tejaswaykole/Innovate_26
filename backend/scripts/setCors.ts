import { initializeApp, cert } from 'firebase-admin/app';
import { getStorage } from 'firebase-admin/storage';
import * as dotenv from 'dotenv';

dotenv.config();

initializeApp({
  credential: cert({
    projectId: process.env.FIREBASE_PROJECT_ID as string,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL as string,
    privateKey: (process.env.FIREBASE_PRIVATE_KEY as string).replace(/\\n/g, '\n'),
  }),
  storageBucket: 'innovate26-a8bb1.appspot.com'
});

async function setCors() {
  const bucket = getStorage().bucket();
  const cors = [
    {
      origin: ['*'],
      method: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      responseHeader: ['*'],
      maxAgeSeconds: 3600,
    },
  ];
  await bucket.setCorsConfiguration(cors);
  console.log('CORS updated successfully');
}

setCors().catch(console.error);
