import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import apiRoutes from './routes';
import { errorHandler, notFoundHandler } from './middleware/error.middleware';

dotenv.config();

const app: Application = express();

// Security and utility middlewares
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS configuration
app.use(cors({
  origin: true, // Allow all origins for hackathon deployment
  credentials: true
}));

// Base Health Check
app.get('/health', (req: Request, res: Response) => {
  res.json({
    success: true,
    status: 'ok'
  });
});

app.get('/api/seed-judges', async (req: Request, res: Response) => {
  try {
    const { db } = require('./lib/firebase/admin');
    const { getAuth } = require('firebase-admin/auth');
    const { FieldValue } = require('firebase-admin/firestore');

    if (!db) {
      res.send('Database not initialized');
      return;
    }

    const judges = [
      { email: 'mohinichaudhri@innovate26.com', password: 'password123', name: 'Mohini Chaudhri' },
      { email: 'rupalibharambe@innovate26.com', password: 'password123', name: 'Rupali Bharambe' },
      { email: 'sushmabendale@innovate26.com', password: 'password123', name: 'Sushma Bendale' },
      { email: 'pratyanksonawane@innovate26.com', password: 'password123', name: 'Pratyank Sonawane' }
    ];

    let results = '';
    for (const j of judges) {
      try {
        const userRecord = await getAuth().createUser({
          email: j.email,
          password: j.password,
          displayName: j.name,
        });

        await db.collection('users').doc(userRecord.uid).set({
          uid: userRecord.uid,
          email: j.email,
          name: j.name,
          role: 'judge',
          accountStatus: 'active',
          createdAt: FieldValue.serverTimestamp()
        });
        results += `Created ${j.email}<br>`;
      } catch (e: any) {
        if (e.code === 'auth/email-already-exists') {
          const userRecord = await getAuth().getUserByEmail(j.email);
          await getAuth().updateUser(userRecord.uid, { password: j.password });
          results += `Updated password for ${j.email}<br>`;
        } else {
          results += `Error for ${j.email}: ${e.message}<br>`;
        }
      }
    }
    res.send(`<h1>Seeding Results</h1><div>${results}</div><p>You can now log in with these accounts.</p>`);
  } catch (error: any) {
    res.status(500).send('Seeding failed: ' + error.message);
  }
});


// API Routes
app.use('/api/v1', apiRoutes);

// Error Handling Middlewares
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
