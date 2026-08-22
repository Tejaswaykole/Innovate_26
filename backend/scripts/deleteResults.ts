import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
const serviceAccount = require('../serviceAccountKey.json');

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

async function run() {
  console.log('Deleting published results...');
  await db.collection('results').doc('official_rankings').delete();
  console.log('Done.');
}
run();