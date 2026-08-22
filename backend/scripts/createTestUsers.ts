import { auth, db } from '../src/lib/firebase/admin';

async function createTestUsers() {
  if (!auth || !db) {
    console.error('Firebase Admin not initialized');
    process.exit(1);
  }

  const users = [
    {
      uid: 'test_account_a',
      email: 'test_leader_a@hackathon.com',
      password: 'password123',
      displayName: 'Test Leader A',
    },
    {
      uid: 'test_account_b',
      email: 'test_member_b@hackathon.com',
      password: 'password123',
      displayName: 'Test Member B',
    }
  ];

  for (const user of users) {
    try {
      // 1. Delete user if exists to ensure clean state
      try {
        await auth.deleteUser(user.uid);
        console.log(`Deleted existing auth user: ${user.uid}`);
      } catch (e: any) {
        if (e.code !== 'auth/user-not-found') {
          console.error(e);
        }
      }

      // 2. Create Auth User
      await auth.createUser({
        uid: user.uid,
        email: user.email,
        password: user.password,
        displayName: user.displayName,
      });
      console.log(`Created Auth user: ${user.email}`);

      // 3. Create Firestore Profile
      await db.collection('users').doc(user.uid).set({
        uid: user.uid,
        role: 'participant',
        accountStatus: 'active',
        fullName: user.displayName,
        email: user.email,
        collegeDetails: {
          name: 'Test University',
          branch: 'Computer Science',
          year: '3rd Year',
          semester: '5',
          rollNumber: 'CS1001',
        },
        createdAt: new Date().toISOString()
      });
      console.log(`Created Firestore profile for: ${user.uid}`);
      
    } catch (error) {
      console.error(`Error creating user ${user.email}:`, error);
    }
  }

  console.log('\n--- Test Accounts Created ---');
  console.log('Account A (Leader):');
  console.log(`Email: ${users[0].email}`);
  console.log(`Password: ${users[0].password}`);
  console.log('\nAccount B (Member):');
  console.log(`Email: ${users[1].email}`);
  console.log(`Password: ${users[1].password}`);
  
  process.exit(0);
}

createTestUsers();
