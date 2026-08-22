import { db } from '../lib/firebase/admin';
import { FieldValue } from 'firebase-admin/firestore';

async function resetUsers() {
  if (!db) {
    console.error('DB not initialized');
    return;
  }
  
  const snap = await db.collection('users').get();
  if (snap.size > 0) {
    const batch = db.batch();
    let count = 0;
    snap.docs.forEach((doc) => {
      const data = doc.data();
      if (data.teamId || data.teamRole) {
        batch.update(doc.ref, {
          teamId: FieldValue.delete(),
          teamRole: FieldValue.delete()
        });
        count++;
      }
    });
    
    if (count > 0) {
      await batch.commit();
      console.log(`Reset team info for ${count} users`);
    } else {
      console.log('No users needed reset');
    }
  }
  
  console.log('Done!');
  process.exit(0);
}

resetUsers().catch(console.error);
