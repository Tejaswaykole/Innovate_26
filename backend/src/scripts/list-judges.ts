import { db } from '../lib/firebase/admin';

async function getJudges() {
  if (!db) {
    console.error('DB not initialized');
    return;
  }
  const snap = await db.collection('users').where('role', '==', 'judge').get();
  snap.docs.forEach(doc => console.log(doc.data()));
  process.exit(0);
}

getJudges().catch(console.error);
