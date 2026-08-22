import { db } from '../lib/firebase/admin';

async function clearCollections() {
  if (!db) {
    console.error('DB not initialized');
    return;
  }
  const collections = ['teams', 'submissions', 'evaluations'];
  
  for (const coll of collections) {
    const snap = await db.collection(coll).get();
    if (snap.size > 0) {
      const batch = db.batch();
      snap.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });
      await batch.commit();
      console.log(`Deleted ${snap.size} documents from ${coll}`);
    } else {
      console.log(`No documents found in ${coll}`);
    }
  }
  console.log('Done!');
  process.exit(0);
}

clearCollections().catch(console.error);
