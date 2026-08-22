import { db } from '../lib/firebase/admin';
import { getAuth } from 'firebase-admin/auth';
import { FieldValue } from 'firebase-admin/firestore';

async function seedJudges() {
  if (!db) return;

  const judges = [
    { email: 'mohinichaudhri@innovate26.com', password: 'password123', name: 'Mohini Chaudhri' },
    { email: 'rupalibharambe@innovate26.com', password: 'password123', name: 'Rupali Bharambe' },
    { email: 'sushmabendale@innovate26.com', password: 'password123', name: 'Sushma Bendale' },
    { email: 'pratyanksonawane@innovate26.com', password: 'password123', name: 'Pratyank Sonawane' }
  ];

  for (const j of judges) {
    try {
      // Create user in Auth
      const userRecord = await getAuth().createUser({
        email: j.email,
        password: j.password,
        displayName: j.name,
      });

      // Add to Firestore
      await db.collection('users').doc(userRecord.uid).set({
        uid: userRecord.uid,
        email: j.email,
        name: j.name,
        role: 'judge',
        accountStatus: 'active',
        createdAt: FieldValue.serverTimestamp()
      });
      console.log(`Created ${j.email}`);
    } catch (e: any) {
      if (e.code === 'auth/email-already-exists') {
        const userRecord = await getAuth().getUserByEmail(j.email);
        await getAuth().updateUser(userRecord.uid, { password: j.password });
        console.log(`Updated password for ${j.email}`);
      } else {
        console.error(e.message);
      }
    }
  }
  process.exit(0);
}

seedJudges().catch(console.error);
