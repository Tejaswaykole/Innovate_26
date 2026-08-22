import { db } from '../lib/firebase/admin';
import { getAuth } from 'firebase-admin/auth';

async function removeExtraJudge() {
  if (!db) return;

  try {
    // We want to delete judge@example.com (or change its role)
    const emailToDelete = 'judge@example.com';
    const userRecord = await getAuth().getUserByEmail(emailToDelete).catch(() => null);
    
    if (userRecord) {
      await getAuth().deleteUser(userRecord.uid);
      await db.collection('users').doc(userRecord.uid).delete();
      console.log(`Deleted extra judge: ${emailToDelete}`);
    } else {
      console.log(`Extra judge ${emailToDelete} not found in Auth. Checking Firestore...`);
      const snap = await db.collection('users').where('email', '==', emailToDelete).get();
      for (const doc of snap.docs) {
        await doc.ref.delete();
        console.log(`Deleted Firestore record for ${emailToDelete}`);
      }
    }
  } catch (error) {
    console.error('Error removing extra judge:', error);
  }
  
  // Just to be sure, list remaining judges
  const judgesSnap = await db.collection('users').where('role', '==', 'judge').get();
  console.log(`Total judges remaining: ${judgesSnap.size}`);
  
  process.exit(0);
}

removeExtraJudge().catch(console.error);
