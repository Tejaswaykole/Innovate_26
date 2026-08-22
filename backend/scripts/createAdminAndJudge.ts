import { auth, db } from '../src/lib/firebase/admin';

async function provisionAccounts() {
  if (!auth || !db) {
    console.error('Firebase Admin not initialized');
    process.exit(1);
  }

  const users = [
    {
      uid: 'admin_test_1',
      email: 'admin@hacksprint.io',
      password: 'password123',
      displayName: 'System Admin',
      role: 'admin',
      organization: 'HackSprint'
    },
    {
      uid: 'judge_test_1',
      email: 'judge@example.com',
      password: 'password123',
      displayName: 'Senior Judge 1',
      role: 'judge',
      organization: 'Tech Corp'
    }
  ];

  for (const user of users) {
    try {
      try {
        await auth.deleteUser(user.uid);
      } catch (e: any) {}

      await auth.createUser({
        uid: user.uid,
        email: user.email,
        password: user.password,
        displayName: user.displayName,
      });

      await db.collection('users').doc(user.uid).set({
        uid: user.uid,
        role: user.role,
        accountStatus: 'active',
        name: user.displayName,
        email: user.email,
        organization: user.organization,
        createdAt: new Date().toISOString()
      });
      console.log(`Created ${user.role}: ${user.email}`);
    } catch (error) {
      console.error(`Error creating ${user.email}:`, error);
    }
  }

  process.exit(0);
}

provisionAccounts();
