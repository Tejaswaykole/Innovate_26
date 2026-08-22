import { Request, Response } from 'express';
import { db } from '../lib/firebase/admin';
import { successResponse, errorResponse } from '../utils/response';

export const getPublishedResults = async (req: Request, res: Response) => {
  try {
    if (!db) throw new Error('DB not initialized');

    const resultsRef = db.collection('results').doc('official_rankings');
    const doc = await resultsRef.get();

    if (!doc.exists || doc.data()?.status !== 'PUBLISHED') {
      return res.status(404).json(errorResponse('NOT_FOUND', 'Results have not been published yet'));
    }

    res.json(successResponse(doc.data()));
  } catch (error: any) {
    res.status(500).json(errorResponse('INTERNAL_SERVER_ERROR', error.message));
  }
};

export const getAnnouncements = async (req: Request, res: Response) => {
  try {
    const snap = await db!.collection('announcements')
      .where('status', '==', 'PUBLISHED')
      .get();
    
    // Sort in memory to avoid requiring a composite index in Firestore
    const announcements = snap.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .sort((a: any, b: any) => {
        const dateA = a.createdAt?._seconds || 0;
        const dateB = b.createdAt?._seconds || 0;
        return dateB - dateA; // Descending
      });
      
    res.json(successResponse({ announcements }));
  } catch (error: any) {
    res.status(500).json(errorResponse('INTERNAL_SERVER_ERROR', error.message));
  }
};

export const getRules = async (req: Request, res: Response) => {
  try {
    const doc = await db!.collection('hackathonRules').doc('official').get();
    if (!doc.exists) {
      return res.json(successResponse({ rules: null }));
    }
    const data = doc.data();
    if (data?.status !== 'PUBLISHED') {
        return res.json(successResponse({ rules: null }));
    }
    res.json(successResponse({ rules: { id: doc.id, ...data } }));
  } catch (error: any) {
    res.status(500).json(errorResponse('INTERNAL_SERVER_ERROR', error.message));
  }
};
