import { Request, Response, NextFunction } from 'express';
import { errorResponse } from '../utils/response';
import { auth, db } from '../lib/firebase/admin';

// Extend Express Request to include user data
declare global {
  namespace Express {
    interface Request {
      user?: {
        uid: string;
        email?: string;
        role?: string;
      };
    }
  }
}

export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json(errorResponse('UNAUTHORIZED', 'Missing or invalid token'));
      return;
    }

    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await auth!.verifyIdToken(token);
    
    // Attach basic auth info first
    req.user = { 
      uid: decodedToken.uid,
      email: decodedToken.email
    };
    
    next();
  } catch (error) {
    console.error('Auth verification error:', error);
    res.status(401).json(errorResponse('UNAUTHORIZED', 'Authentication failed: ' + (error instanceof Error ? error.message : 'Unknown error')));
  }
};

export const requireRole = (requiredRole: 'participant' | 'judge' | 'admin') => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user || !req.user.uid) {
        res.status(401).json(errorResponse('UNAUTHORIZED', 'Authentication required'));
        return;
      }

      // Fetch user profile from Firestore
      if (!db) {
        throw new Error('Firestore DB not initialized');
      }

      const userDoc = await db.collection('users').doc(req.user.uid).get();
      if (!userDoc.exists) {
        res.status(404).json(errorResponse('NOT_FOUND', 'User profile not found'));
        return;
      }

      const userData = userDoc.data();
      const userRole = userData?.role;

      if (userRole !== requiredRole) {
        res.status(403).json(errorResponse('FORBIDDEN', 'Insufficient permissions'));
        return;
      }

      // Attach the verified role to the request user object
      req.user.role = userRole;
      next();
    } catch (error) {
      res.status(500).json(errorResponse('INTERNAL_SERVER_ERROR', 'Role verification failed'));
    }
  };
};
