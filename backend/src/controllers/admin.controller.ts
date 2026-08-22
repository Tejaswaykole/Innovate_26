import { Request, Response } from 'express';
import { db, auth } from '../lib/firebase/admin';
import { errorResponse, successResponse } from '../utils/response';
import { FieldValue } from 'firebase-admin/firestore';

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    if (!db) throw new Error('DB not initialized');
    
    // In production, maintain counter documents for large collections.
    // For this prototype, we query the collections.
    const usersSnap = await db.collection('users').get();
    const teamsSnap = await db.collection('teams').get();
    const submissionsSnap = await db.collection('submissions').get();
    const evalsSnap = await db.collection('evaluations').get();

    const participants = usersSnap.docs.filter(d => d.data().role === 'participant').length;
    const judges = usersSnap.docs.filter(d => d.data().role === 'judge').length;
    const teams = teamsSnap.size;
    const submissions = submissionsSnap.docs.filter(d => d.data().status === 'SUBMITTED').length;
    const evaluationsCompleted = evalsSnap.docs.filter(d => d.data().status === 'SUBMITTED').length;
    const evaluationsPending = evalsSnap.docs.filter(d => d.data().status !== 'SUBMITTED').length;

    // Collect recent activity
    const activity: any[] = [];
    const usersMap = new Map<string, string>();
    const teamsMap = new Map<string, string>();
    usersSnap.docs.forEach(doc => {
      const data = doc.data();
      usersMap.set(doc.id, data.name || data.email || `User ${doc.id.substring(0, 8)}`);
      if (data.createdAt && data.createdAt.toDate) {
        activity.push({
          id: doc.id,
          type: data.role === 'participant' ? 'PARTICIPANT_REGISTERED' : 'JUDGE_REGISTERED',
          title: data.role === 'participant' ? 'New Participant' : 'New Judge',
          description: data.email,
          timestamp: data.createdAt.toDate().toISOString()
        });
      }
    });

    teamsSnap.docs.forEach(doc => {
      const data = doc.data();
      teamsMap.set(doc.id, data.name || `Team ${doc.id.substring(0, 8)}`);
      if (data.createdAt && data.createdAt.toDate) {
        activity.push({
          id: doc.id,
          type: 'TEAM_CREATED',
          title: 'New Team',
          description: data.name,
          timestamp: data.createdAt.toDate().toISOString()
        });
      }
    });

    submissionsSnap.docs.forEach(doc => {
      const data = doc.data();
      if (data.submittedAt && data.submittedAt.toDate) {
        const teamName = teamsMap.get(data.teamId) || `Team ${data.teamId.substring(0, 8)}`;
        activity.push({
          id: doc.id,
          type: 'PROJECT_SUBMITTED',
          title: 'Project Submitted',
          description: teamName,
          timestamp: data.submittedAt.toDate().toISOString()
        });
      }
    });

    evalsSnap.docs.forEach(doc => {
      const data = doc.data();
      if (data.submittedAt && data.submittedAt.toDate && data.status === 'SUBMITTED') {
        const judgeName = usersMap.get(data.judgeUid) || `Judge ${data.judgeUid.substring(0, 8)}`;
        activity.push({
          id: doc.id,
          type: 'EVALUATION_COMPLETED',
          title: 'Evaluation Completed',
          description: judgeName,
          timestamp: data.submittedAt.toDate().toISOString()
        });
      }
    });

    activity.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    const recentActivity = activity.slice(0, 10);

    res.json(successResponse({
      participants,
      teams,
      judges,
      submissions,
      evaluationsCompleted,
      evaluationsPending,
      hackathonStatus: null,
      recentActivity
    }));
  } catch (error: any) {
    res.status(500).json(errorResponse('INTERNAL_SERVER_ERROR', error.message));
  }
};

export const createJudge = async (req: Request, res: Response) => {
  try {
    const { email, password, name, organization } = req.body;
    if (!auth || !db) throw new Error('Firebase admin not initialized');

    // Create user in Firebase Auth
    const userRecord = await auth.createUser({
      email,
      password,
      displayName: name,
    });

    // Create user profile in Firestore
    await db.collection('users').doc(userRecord.uid).set({
      uid: userRecord.uid,
      email: userRecord.email,
      name,
      organization,
      role: 'judge',
      accountStatus: 'active',
      createdAt: FieldValue.serverTimestamp()
    });

    res.status(201).json(successResponse({ message: 'Judge created successfully', uid: userRecord.uid }));
  } catch (error: any) {
    res.status(400).json(errorResponse('BAD_REQUEST', error.message));
  }
};

export const assignJudge = async (req: Request, res: Response) => {
  try {
    const { judgeUid, teamId } = req.body;
    if (!db) throw new Error('DB not initialized');

    await db.runTransaction(async (t) => {
      // Verify judge exists
      const judgeDoc = await t.get(db!.collection('users').doc(judgeUid));
      if (!judgeDoc.exists || judgeDoc.data()?.role !== 'judge') throw new Error('Invalid judge');

      // Verify team exists
      const teamDoc = await t.get(db!.collection('teams').doc(teamId));
      if (!teamDoc.exists) throw new Error('Invalid team');

      // Check if assignment already exists
      const assignmentQuery = db!.collection('judgeAssignments').where('judgeUid', '==', judgeUid).where('teamId', '==', teamId).limit(1);
      const assignmentSnap = await t.get(assignmentQuery);
      
      if (!assignmentSnap.empty) {
        throw new Error('Judge is already assigned to this team');
      }

      // Create assignment
      const assignmentRef = db!.collection('judgeAssignments').doc();
      t.set(assignmentRef, {
        judgeUid,
        teamId,
        assignedAt: FieldValue.serverTimestamp()
      });
    });

    res.status(200).json(successResponse({ message: 'Judge assigned successfully' }));
  } catch (error: any) {
    res.status(400).json(errorResponse('BAD_REQUEST', error.message));
  }
};

const generateResultsSnapshot = async (db: FirebaseFirestore.Firestore) => {
  const [judgesSnap, submissionsSnap, evalsSnap, teamsSnap] = await Promise.all([
    db.collection('users').where('role', '==', 'judge').get(),
    db.collection('submissions').where('status', '==', 'SUBMITTED').get(),
    db.collection('evaluations').where('status', '==', 'SUBMITTED').get(),
    db.collection('teams').get()
  ]);

  const activeJudgesCount = judgesSnap.docs.filter(d => d.data().accountStatus !== 'disabled').length;
  const eligibleTeamsCount = submissionsSnap.size;
  const expectedEvaluations = activeJudgesCount * eligibleTeamsCount;
  const completedEvaluations = evalsSnap.size;

  if (activeJudgesCount === 0 || eligibleTeamsCount === 0) {
    throw new Error('NOT_READY: No active judges or submitted teams available.');
  }

  if (completedEvaluations < expectedEvaluations) {
    throw new Error(`NOT_READY: Judging in progress (${completedEvaluations}/${expectedEvaluations} completed).`);
  }

  const teamMap = new Map();
  teamsSnap.docs.forEach(doc => teamMap.set(doc.id, doc.data()));
  
  const subMap = new Map();
  submissionsSnap.docs.forEach(doc => subMap.set(doc.id, doc.data()));

  const teamScores: { [key: string]: { total: number, count: number } } = {};
  evalsSnap.docs.forEach(doc => {
    const data = doc.data() as any;
    if (!teamScores[data.teamId]) teamScores[data.teamId] = { total: 0, count: 0 };
    teamScores[data.teamId].total += (data.totalScore || 0);
    teamScores[data.teamId].count += 1;
  });

  const rawResults = Object.keys(teamScores).map(teamId => {
    const scoreSum = teamScores[teamId].total;
    const count = teamScores[teamId].count;
    const averageScore = count > 0 ? Number((scoreSum / count).toFixed(2)) : 0;
    
    const team = teamMap.get(teamId) || {};
    const sub = subMap.get(teamId) || {};

    return {
      teamId,
      teamName: (team.teamName || team.name) || 'Unknown',
      teamCode: team.teamCode || 'N/A',
      projectTitle: sub.projectTitle || 'Untitled',
      finalScore: averageScore
    };
  });

  rawResults.sort((a, b) => b.finalScore - a.finalScore);

  let currentRank = 1;
  let previousScore = -1;

  const rankedResults = rawResults.map((r, index) => {
    if (r.finalScore !== previousScore) {
      currentRank = index + 1;
    }
    previousScore = r.finalScore;
    
    return {
      ...r,
      rank: currentRank
    };
  });

  return rankedResults;
}

export const getResults = async (req: Request, res: Response) => {
  try {
    if (!db) throw new Error('DB not initialized');
    
    // Check if published results exist
    const resultsRef = db.collection('results').doc('official_rankings');
    const doc = await resultsRef.get();
    
    if (doc.exists && doc.data()?.status === 'PUBLISHED') {
      return res.json(successResponse({
        status: 'PUBLISHED',
        publishedAt: doc.data()?.publishedAt?.toDate ? doc.data()?.publishedAt.toDate().toISOString() : null,
        rankings: doc.data()?.rankings || []
      }));
    }

    // Otherwise, generate preview
    try {
      const rankings = await generateResultsSnapshot(db);
      return res.json(successResponse({
        status: 'PREVIEW',
        publishedAt: null,
        rankings
      }));
    } catch (err: any) {
      if (err.message.startsWith('NOT_READY:')) {
        return res.json(successResponse({
          status: 'NOT_READY',
          message: err.message.split('NOT_READY: ')[1],
          publishedAt: null,
          rankings: []
        }));
      }
      throw err;
    }
  } catch (error: any) {
    res.status(500).json(errorResponse('INTERNAL_SERVER_ERROR', error.message));
  }
};

export const publishResults = async (req: Request, res: Response) => {
  try {
    if (!db) throw new Error('DB not initialized');

    await db.runTransaction(async (t) => {
      const resultsRef = db!.collection('results').doc('official_rankings');
      const doc = await t.get(resultsRef);
      if (doc.exists && doc.data()?.status === 'PUBLISHED') {
        throw new Error('Results are already published');
      }

      // Generate results safely
      const rankings = await generateResultsSnapshot(db!);
      
      t.set(resultsRef, {
        status: 'PUBLISHED',
        publishedAt: FieldValue.serverTimestamp(),
        rankings
      });
    });

    res.json(successResponse({ message: 'Results published successfully' }));
  } catch (error: any) {
    res.status(400).json(errorResponse('BAD_REQUEST', error.message));
  }
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    if (!db) throw new Error('DB not initialized');
    const usersSnap = await db.collection('users').get();
    
    const teamsSnap = await db.collection('teams').get();
    const teamMap = new Map();
    teamsSnap.docs.forEach(doc => teamMap.set(doc.id, doc.data()));

    const users = usersSnap.docs.map(doc => {
      const data = doc.data();
      return {
        uid: doc.id,
        name: data.name,
        email: data.email,
        role: data.role,
        accountStatus: data.accountStatus || 'active',
        teamId: data.teamId,
        teamName: data.teamId && teamMap.has(data.teamId) ? teamMap.get(data.teamId).teamName : null,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : null,
      };
    });

    res.json(successResponse(users));
  } catch (error: any) {
    res.status(500).json(errorResponse('INTERNAL_SERVER_ERROR', error.message));
  }
};

export const updateUserRole = async (req: Request, res: Response) => {
  try {
    const uid = req.params.uid as string;
    const { role } = req.body;
    
    if (!db) throw new Error('DB not initialized');
    
    if (uid === (req as any).user.uid && role !== 'admin') {
      return res.status(403).json(errorResponse('FORBIDDEN', 'Self-demotion is not allowed.'));
    }

    if (role !== 'admin') {
      const adminsSnap = await db.collection('users').where('role', '==', 'admin').get();
      if (adminsSnap.size <= 1) {
         const isLastAdmin = adminsSnap.docs.some(doc => doc.id === uid);
         if (isLastAdmin) {
            return res.status(403).json(errorResponse('FORBIDDEN', 'At least one administrator account must remain active.'));
         }
      }
    }

    const userRef = db.collection('users').doc(uid);
    const userDoc = await userRef.get();
    
    if (!userDoc.exists) {
      return res.status(404).json(errorResponse('NOT_FOUND', 'User not found'));
    }

    await userRef.update({ role, updatedAt: FieldValue.serverTimestamp() });

    res.json(successResponse({ message: 'Role updated successfully' }));
  } catch (error: any) {
    res.status(500).json(errorResponse('INTERNAL_SERVER_ERROR', error.message));
  }
};

export const updateUserStatus = async (req: Request, res: Response) => {
  try {
    const uid = req.params.uid as string;
    const { disabled } = req.body;

    if (!db || !auth) throw new Error('Firebase admin not initialized');

    if (uid === (req as any).user.uid) {
       return res.status(403).json(errorResponse('FORBIDDEN', 'Cannot disable your own account.'));
    }

    const userRef = db.collection('users').doc(uid);
    const userDoc = await userRef.get();
    
    if (!userDoc.exists) {
      return res.status(404).json(errorResponse('NOT_FOUND', 'User not found'));
    }

    await auth.updateUser(uid, { disabled });
    await userRef.update({ 
      accountStatus: disabled ? 'disabled' : 'active', 
      updatedAt: FieldValue.serverTimestamp() 
    });

    res.json(successResponse({ message: `Account ${disabled ? 'disabled' : 'enabled'} successfully` }));
  } catch (error: any) {
    res.status(500).json(errorResponse('INTERNAL_SERVER_ERROR', error.message));
  }
};

export const getTeams = async (req: Request, res: Response) => {
  try {
    if (!db) throw new Error('DB not initialized');
    
    const [teamsSnap, usersSnap, submissionsSnap, requestsSnap] = await Promise.all([
      db.collection('teams').get(),
      db.collection('users').get(),
      db.collection('submissions').get(),
      db.collection('teamJoinRequests').where('status', '==', 'pending').get()
    ]);

    const userMap = new Map();
    usersSnap.docs.forEach(doc => userMap.set(doc.id, doc.data()));

    const submissionMap = new Map();
    submissionsSnap.docs.forEach(doc => submissionMap.set(doc.data().teamId, doc.data()));

    const requestCountMap = new Map();
    requestsSnap.docs.forEach(doc => {
      const tid = doc.data().teamId;
      requestCountMap.set(tid, (requestCountMap.get(tid) || 0) + 1);
    });

    const teams = teamsSnap.docs.map(doc => {
      const data = doc.data();
      const leaderData = userMap.get(data.leaderUid);
      const submissionData = submissionMap.get(doc.id);
      
      return {
        teamId: doc.id,
        teamName: data.teamName,
        teamCode: data.teamCode,
        leaderUid: data.leaderUid,
        leaderName: leaderData?.fullName || leaderData?.name || 'Unknown',
        leaderEmail: leaderData?.email || 'Unknown',
        members: (data.members || []).map((m: any) => {
           const uData = userMap.get(m.uid);
           return {
             uid: m.uid,
             fullName: m.fullName || uData?.fullName || uData?.name || 'Unknown',
             email: uData?.email || 'Unknown',
             teamRole: m.teamRole
           };
        }),
        memberCount: data.memberCount || 0,
        maxMembers: 6,
        submissionStatus: submissionData && submissionData.status === 'SUBMITTED' ? 'Submitted' : 'Not Submitted',
        submissionTime: submissionData?.submittedAt?.toDate ? submissionData.submittedAt.toDate().toISOString() : null,
        pendingJoinRequests: requestCountMap.get(doc.id) || 0,
        createdAt: data.createdTimestamp?.toDate ? data.createdTimestamp.toDate().toISOString() : null,
        status: data.eligibilityStatus || 'pending'
      };
    });

    res.json(successResponse(teams));
  } catch (error: any) {
    res.status(500).json(errorResponse('INTERNAL_SERVER_ERROR', error.message));
  }
};

export const getHackathonConfig = async (req: Request, res: Response) => {
  try {
    if (!db) throw new Error('DB not initialized');
    const doc = await db.collection('hackathon').doc('config').get();
    
    if (!doc.exists) {
      return res.json(successResponse({
        name: 'HackSprint 2024',
        description: 'Default Hackathon Description',
        status: 'DRAFT',
        registrationDeadline: null,
        submissionDeadline: null,
      }));
    }
    const data = doc.data() || {};
    const configData: any = { ...data };
    ['registrationDeadline', 'teamFormationDate', 'hackingBeginsDate', 'submissionDeadline', 'ceremonyDate'].forEach(key => {
      if (configData[key] && configData[key].toDate) {
        configData[key] = configData[key].toDate().toISOString();
      }
    });
    
    res.json(successResponse(configData));
  } catch (error: any) {
    res.status(500).json(errorResponse('INTERNAL_SERVER_ERROR', error.message));
  }
};

export const updateHackathonConfig = async (req: Request, res: Response) => {
  try {
    if (!db) throw new Error('DB not initialized');
    const { name, description, status, currentTimelineStage, registrationDeadline, teamFormationDate, hackingBeginsDate, submissionDeadline, ceremonyDate } = req.body;
    
    if (!name || name.trim() === '') throw new Error('Name is required');
    
    if (registrationDeadline && submissionDeadline) {
      if (new Date(registrationDeadline) > new Date(submissionDeadline)) {
        throw new Error('Registration deadline cannot be after submission deadline');
      }
    }

    const configRef = db.collection('hackathon').doc('config');
    await configRef.set({
      name,
      description,
      status,
      currentTimelineStage,
      registrationDeadline: registrationDeadline ? new Date(registrationDeadline) : null,
      teamFormationDate: teamFormationDate ? new Date(teamFormationDate) : null,
      hackingBeginsDate: hackingBeginsDate ? new Date(hackingBeginsDate) : null,
      submissionDeadline: submissionDeadline ? new Date(submissionDeadline) : null,
      ceremonyDate: ceremonyDate ? new Date(ceremonyDate) : null,
      updatedAt: FieldValue.serverTimestamp()
    }, { merge: true });
    
    res.json(successResponse({ message: 'Hackathon configuration updated successfully' }));
  } catch (error: any) {
    res.status(400).json(errorResponse('BAD_REQUEST', error.message));
  }
};

export const getProblemStatements = async (req: Request, res: Response) => {
  try {
    if (!db) throw new Error('DB not initialized');
    const snap = await db.collection('problemStatements').orderBy('order', 'asc').get();
    const statements = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(successResponse(statements));
  } catch (error: any) {
    res.status(500).json(errorResponse('INTERNAL_SERVER_ERROR', error.message));
  }
};

export const createProblemStatement = async (req: Request, res: Response) => {
  try {
    if (!db) throw new Error('DB not initialized');
    const { title, description } = req.body;
    
    if (!title || title.trim() === '') throw new Error('Title is required');
    if (!description || description.trim() === '') throw new Error('Description is required');

    const snap = await db.collection('problemStatements').get();
    const order = snap.size;

    const newRef = db.collection('problemStatements').doc();
    const data = {
      title: title.trim(),
      description: description.trim(),
      status: 'Draft',
      order,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp()
    };
    
    await newRef.set(data);
    res.json(successResponse({ id: newRef.id, ...data }));
  } catch (error: any) {
    res.status(400).json(errorResponse('BAD_REQUEST', error.message));
  }
};

export const updateProblemStatement = async (req: Request, res: Response) => {
  try {
    if (!db) throw new Error('DB not initialized');
    const { id } = req.params;
    const { title, description, status } = req.body;
    
    if (!title || title.trim() === '') throw new Error('Title is required');
    if (!description || description.trim() === '') throw new Error('Description is required');
    if (!['Draft', 'Published'].includes(status)) throw new Error('Invalid status');

    const ref = db.collection('problemStatements').doc(id as string);
    const doc = await ref.get();
    
    if (!doc.exists) throw new Error('Problem statement not found');

    await ref.update({
      title: title.trim(),
      description: description.trim(),
      status,
      updatedAt: FieldValue.serverTimestamp()
    });
    
    res.json(successResponse({ message: 'Problem statement updated successfully' }));
  } catch (error: any) {
    res.status(400).json(errorResponse('BAD_REQUEST', error.message));
  }
};

export const reorderProblemStatements = async (req: Request, res: Response) => {
  try {
    if (!db) throw new Error('DB not initialized');
    const { updates } = req.body;
    
    if (!Array.isArray(updates)) throw new Error('Invalid updates format');

    const batch = db.batch();
    for (const update of updates) {
      if (update.id && typeof update.order === 'number') {
        const ref = db.collection('problemStatements').doc(update.id);
        batch.update(ref, { 
          order: update.order,
          updatedAt: FieldValue.serverTimestamp()
        });
      }
    }
    
    await batch.commit();
    res.json(successResponse({ message: 'Problem statements reordered successfully' }));
  } catch (error: any) {
    res.status(400).json(errorResponse('BAD_REQUEST', error.message));
  }
};

export const getJudges = async (req: Request, res: Response) => {
  try {
    if (!db) throw new Error('DB not initialized');
    
    // 1. Fetch all judges
    const usersSnap = await db.collection('users').where('role', '==', 'judge').get();
    
    // 2. Fetch all SUBMITTED teams (Eligible Teams)
    const submissionsSnap = await db.collection('submissions').where('status', '==', 'SUBMITTED').get();
    const eligibleTeamsCount = submissionsSnap.size;

    // 3. Fetch all evaluations to aggregate completed/pending for each judge
    const evalsSnap = await db.collection('evaluations').get();
    const allEvaluations = evalsSnap.docs.map(d => d.data());

    const judges = usersSnap.docs.map(doc => {
      const data = doc.data();
      
      // Get evaluations by this judge
      const judgeEvals = allEvaluations.filter(e => e.judgeUid === doc.id);
      
      // Filter to completed evaluations (status === 'SUBMITTED')
      const completed = judgeEvals.filter(e => e.status === 'SUBMITTED').length;
      const pending = Math.max(0, eligibleTeamsCount - completed);
      const progress = eligibleTeamsCount > 0 ? Math.round((completed / eligibleTeamsCount) * 100) : 0;
      
      // Calculate last activity (max updatedAt)
      let lastActivity: string | null = null;
      if (judgeEvals.length > 0) {
        const timestamps = judgeEvals
          .map(e => e.updatedAt?.toDate?.()?.getTime() || 0)
          .filter(t => t > 0);
        if (timestamps.length > 0) {
          lastActivity = new Date(Math.max(...timestamps)).toISOString();
        }
      }

      return {
        uid: doc.id,
        name: data.name || 'Unknown',
        email: data.email || 'No email',
        status: data.accountStatus || 'active',
        eligibleTeams: eligibleTeamsCount,
        completedEvaluations: completed,
        pendingEvaluations: pending,
        progress,
        lastActivity
      };
    });

    res.json(successResponse(judges));
  } catch (error: any) {
    res.status(500).json(errorResponse('INTERNAL_SERVER_ERROR', error.message));
  }
};

export const getJudgingSummary = async (req: Request, res: Response) => {
  try {
    if (!db) throw new Error('DB not initialized');
    
    const judgesSnap = await db.collection('users').where('role', '==', 'judge').get();
    const activeJudgesCount = judgesSnap.docs.filter(d => d.data().accountStatus !== 'disabled').length;

    const submissionsSnap = await db.collection('submissions').where('status', '==', 'SUBMITTED').get();
    const eligibleTeamsCount = submissionsSnap.size;

    const expectedEvaluations = activeJudgesCount * eligibleTeamsCount;

    const evalsSnap = await db.collection('evaluations').where('status', '==', 'SUBMITTED').get();
    const completedEvaluations = evalsSnap.size;
    
    const pendingEvaluations = Math.max(0, expectedEvaluations - completedEvaluations);
    const progress = expectedEvaluations > 0 ? Math.round((completedEvaluations / expectedEvaluations) * 100) : 0;

    res.json(successResponse({
      totalJudges: judgesSnap.size,
      activeJudges: activeJudgesCount,
      eligibleTeams: eligibleTeamsCount,
      expectedEvaluations,
      completedEvaluations,
      pendingEvaluations,
      progress
    }));
  } catch (error: any) {
    res.status(500).json(errorResponse('INTERNAL_SERVER_ERROR', error.message));
  }
};

export const getSubmissions = async (req: Request, res: Response) => {
  try {
    if (!db) throw new Error('DB not initialized');
    
    // Fetch submissions, teams, users, evaluations, and judges
    const [submissionsSnap, teamsSnap, usersSnap, evalsSnap, judgesSnap] = await Promise.all([
      db.collection('submissions').get(),
      db.collection('teams').get(),
      db.collection('users').get(),
      db.collection('evaluations').get(),
      db.collection('users').where('role', '==', 'judge').get()
    ]);

    const activeJudgesCount = judgesSnap.docs.filter(d => d.data().accountStatus !== 'disabled').length;

    const teamMap = new Map();
    teamsSnap.docs.forEach(doc => teamMap.set(doc.id, { id: doc.id, ...doc.data() }));

    const userList = usersSnap.docs.map(doc => ({ uid: doc.id, ...(doc.data() as any) }));
    
    const evalsList = evalsSnap.docs.map(doc => doc.data() as any);

    const result = submissionsSnap.docs.map(doc => {
      const subData = doc.data() as any;
      const teamId = doc.id; // Usually submission document ID is teamId
      const team = teamMap.get(teamId);
      
      const members = userList.filter(u => u.teamId === teamId);
      const leader = members.find(u => u.uid === team?.leaderUid) || null;

      const teamEvals = evalsList.filter(e => e.teamId === teamId && e.status === 'SUBMITTED');
      const completedEvals = teamEvals.length;
      const pendingEvals = Math.max(0, activeJudgesCount - completedEvals);
      
      let averageScore = 0;
      if (completedEvals > 0) {
        const total = teamEvals.reduce((sum, e) => sum + (e.totalScore || 0), 0);
        averageScore = total / completedEvals;
      }

      let judgingStatus = 'Awaiting Judges';
      if (completedEvals > 0 && completedEvals < activeJudgesCount) judgingStatus = 'Judging In Progress';
      if (completedEvals > 0 && completedEvals >= activeJudgesCount) judgingStatus = 'Judging Complete';

      return {
        id: teamId,
        teamId: teamId,
        teamName: team?.name || 'Unknown Team',
        teamCode: team?.teamCode || 'N/A',
        leaderName: leader?.name || 'Unknown Leader',
        memberCount: members.length,
        projectTitle: subData.projectTitle || 'Untitled',
        status: subData.status || 'DRAFT',
        submittedAt: subData.submittedAt?.toDate ? subData.submittedAt.toDate().toISOString() : null,
        judgingSummary: {
          totalJudges: activeJudgesCount,
          completedEvaluations: completedEvals,
          pendingEvaluations: pendingEvals,
          averageScore: Number(averageScore.toFixed(2)),
          judgingStatus
        }
      };
    });

    res.json(successResponse(result));
  } catch (error: any) {
    res.status(500).json(errorResponse('INTERNAL_SERVER_ERROR', error.message));
  }
};

export const getSubmissionDetails = async (req: Request, res: Response) => {
  try {
    const submissionId = req.params.submissionId as string;
    if (!db) throw new Error('DB not initialized');
    
    const subDoc = await db.collection('submissions').doc(submissionId).get();
    if (!subDoc.exists) {
      return res.status(404).json(errorResponse('NOT_FOUND', 'Submission not found'));
    }

    const subData = subDoc.data() as any;
    const teamId = subDoc.id;

    const teamDoc = await db.collection('teams').doc(teamId).get();
    const team = teamDoc.data() as any;

    const usersSnap = await db.collection('users').where('teamId', '==', teamId).get();
    const members = usersSnap.docs.map(doc => ({ uid: doc.id, name: doc.data().name, email: doc.data().email }));
    const leader = members.find(m => m.uid === team?.leaderUid) || null;

    const judgesSnap = await db.collection('users').where('role', '==', 'judge').get();
    const activeJudgesCount = judgesSnap.docs.filter(d => d.data().accountStatus !== 'disabled').length;

    const evalsSnap = await db.collection('evaluations').where('teamId', '==', teamId).where('status', '==', 'SUBMITTED').get();
    const completedEvals = evalsSnap.size;
    const pendingEvals = Math.max(0, activeJudgesCount - completedEvals);
    
    let averageScore = 0;
    if (completedEvals > 0) {
      const total = evalsSnap.docs.reduce((sum, d) => sum + (d.data().totalScore || 0), 0);
      averageScore = total / completedEvals;
    }

    let judgingStatus = 'Awaiting Judges';
    if (completedEvals > 0 && completedEvals < activeJudgesCount) judgingStatus = 'Judging In Progress';
    if (completedEvals > 0 && completedEvals >= activeJudgesCount) judgingStatus = 'Judging Complete';

    const result = {
      id: teamId,
      teamId: teamId,
      teamName: team?.name || 'Unknown Team',
      teamCode: team?.teamCode || 'N/A',
      leader,
      members,
      projectTitle: subData.projectTitle || 'Untitled',
      description: subData.description || '',
      proposedSolution: subData.proposedSolution || '',
      problemStatement: subData.problemStatement || '',
      githubUrl: subData.githubUrl || null,
      demoUrl: subData.demoUrl || null,
      pptUrl: subData.pptUrl || null,
      videoUrl: subData.videoUrl || null,
      screenshotsUrl: subData.screenshotsUrl || null,
      status: subData.status || 'DRAFT',
      submittedAt: subData.submittedAt?.toDate ? subData.submittedAt.toDate().toISOString() : null,
      judgingSummary: {
        totalJudges: activeJudgesCount,
        completedEvaluations: completedEvals,
        pendingEvaluations: pendingEvals,
        averageScore: Number(averageScore.toFixed(2)),
        judgingStatus
      }
    };

    res.json(successResponse(result));
  } catch (error: any) {
    res.status(500).json(errorResponse('INTERNAL_SERVER_ERROR', error.message));
  }
};

export const getEvaluations = async (req: Request, res: Response) => {
  try {
    if (!db) throw new Error('DB not initialized');
    
    const [evalsSnap, teamsSnap, usersSnap, submissionsSnap] = await Promise.all([
      db.collection('evaluations').get(),
      db.collection('teams').get(),
      db.collection('users').get(),
      db.collection('submissions').get()
    ]);

    const teamMap = new Map();
    teamsSnap.docs.forEach(doc => teamMap.set(doc.id, doc.data()));

    const userMap = new Map();
    usersSnap.docs.forEach(doc => userMap.set(doc.id, doc.data()));

    const submissionMap = new Map();
    submissionsSnap.docs.forEach(doc => submissionMap.set(doc.id, doc.data()));

    const result = evalsSnap.docs.map(doc => {
      const evalData = doc.data() as any;
      const team = teamMap.get(evalData.teamId) || {};
      const judge = userMap.get(evalData.judgeUid) || {};
      const sub = submissionMap.get(evalData.teamId) || {};

      return {
        id: doc.id,
        evaluationId: doc.id,
        teamId: evalData.teamId,
        judgeUid: evalData.judgeUid,
        teamName: (team.teamName || team.name) || 'Unknown Team',
        teamCode: team.teamCode || 'N/A',
        projectTitle: sub.projectTitle || 'Untitled',
        judgeName: judge.name || 'Unknown Judge',
        judgeEmail: judge.email || 'N/A',
        status: evalData.status || 'DRAFT',
        totalScore: evalData.totalScore || 0,
        submittedAt: evalData.submittedAt?.toDate ? evalData.submittedAt.toDate().toISOString() : null
      };
    });

    res.json(successResponse(result));
  } catch (error: any) {
    res.status(500).json(errorResponse('INTERNAL_SERVER_ERROR', error.message));
  }
};

export const getEvaluationDetails = async (req: Request, res: Response) => {
  try {
    const evaluationId = req.params.evaluationId as string;
    if (!db) throw new Error('DB not initialized');
    
    const evalDoc = await db.collection('evaluations').doc(evaluationId).get();
    if (!evalDoc.exists) {
      return res.status(404).json(errorResponse('NOT_FOUND', 'Evaluation not found'));
    }

    const evalData = evalDoc.data() as any;
    
    const [teamDoc, judgeDoc, subDoc] = await Promise.all([
      db.collection('teams').doc(evalData.teamId).get(),
      db.collection('users').doc(evalData.judgeUid).get(),
      db.collection('submissions').doc(evalData.teamId).get()
    ]);

    const team = teamDoc.data() || {};
    const judge = judgeDoc.data() || {};
    const sub = subDoc.data() || {};

    const result = {
      id: evaluationId,
      evaluationId,
      teamId: evalData.teamId,
      judgeUid: evalData.judgeUid,
      teamName: (team.teamName || team.name) || 'Unknown Team',
      teamCode: team.teamCode || 'N/A',
      projectTitle: sub.projectTitle || 'Untitled',
      judgeName: judge.name || 'Unknown Judge',
      judgeEmail: judge.email || 'N/A',
      status: evalData.status || 'DRAFT',
      totalScore: evalData.totalScore || 0,
      criteriaScores: evalData.criteriaScores || [],
      overallFeedback: evalData.overallFeedback || '',
      submittedAt: evalData.submittedAt?.toDate ? evalData.submittedAt.toDate().toISOString() : null
    };

    res.json(successResponse(result));
  } catch (error: any) {
    res.status(500).json(errorResponse('INTERNAL_SERVER_ERROR', error.message));
  }
};

export const getEvaluationSummary = async (req: Request, res: Response) => {
  try {
    if (!db) throw new Error('DB not initialized');
    
    const [judgesSnap, submissionsSnap, evalsSnap, teamsSnap] = await Promise.all([
      db.collection('users').where('role', '==', 'judge').get(),
      db.collection('submissions').where('status', '==', 'SUBMITTED').get(),
      db.collection('evaluations').get(),
      db.collection('teams').get()
    ]);

    const activeJudges = judgesSnap.docs
      .map(doc => ({ uid: doc.id, ...doc.data() as any }))
      .filter(d => d.accountStatus !== 'disabled');
    
    const activeJudgesCount = activeJudges.length;

    const submittedTeams = submissionsSnap.docs.map(doc => ({ teamId: doc.id, ...doc.data() as any }));
    const eligibleTeamsCount = submittedTeams.length;

    const expectedEvaluations = activeJudgesCount * eligibleTeamsCount;

    const allEvals = evalsSnap.docs.map(doc => doc.data() as any);
    const completedEvals = allEvals.filter(e => e.status === 'SUBMITTED');
    const completedEvaluationsCount = completedEvals.length;
    const pendingEvaluations = Math.max(0, expectedEvaluations - completedEvaluationsCount);
    const progress = expectedEvaluations > 0 ? Math.round((completedEvaluationsCount / expectedEvaluations) * 100) : 0;

    // Judge Progress
    const judgeProgress = activeJudges.map(judge => {
      const judgeEvals = completedEvals.filter(e => e.judgeUid === judge.uid);
      return {
        judgeUid: judge.uid,
        judgeName: judge.name,
        completed: judgeEvals.length,
        expected: eligibleTeamsCount
      };
    });

    // Team Progress
    const teamMap = new Map();
    teamsSnap.docs.forEach(doc => teamMap.set(doc.id, doc.data()));

    let completedJudgingTeams = 0;
    const teamProgress = submittedTeams.map(sub => {
      const teamEvals = completedEvals.filter(e => e.teamId === sub.teamId);
      const completed = teamEvals.length;
      if (completed >= activeJudgesCount && activeJudgesCount > 0) {
        completedJudgingTeams++;
      }
      return {
        teamId: sub.teamId,
        teamName: teamMap.get(sub.teamId)?.name || 'Unknown',
        completed,
        expected: activeJudgesCount
      };
    });

    res.json(successResponse({
      totalJudges: activeJudgesCount,
      eligibleTeams: eligibleTeamsCount,
      expectedEvaluations,
      completedEvaluations: completedEvaluationsCount,
      pendingEvaluations,
      progress,
      completedJudgingTeams,
      judgeProgress,
      teamProgress
    }));
  } catch (error: any) {
    res.status(500).json(errorResponse('INTERNAL_SERVER_ERROR', error.message));
  }
};
export const getAnalyticsOverview = async (req: Request, res: Response) => {
  try {
    if (!db) throw new Error('DB not initialized');
    
    const [usersSnap, teamsSnap, submissionsSnap, evalsSnap, resultsSnap] = await Promise.all([
      db.collection('users').get(),
      db.collection('teams').get(),
      db.collection('submissions').get(),
      db.collection('evaluations').get(),
      db.collection('results').doc('official_rankings').get()
    ]);

    const users = usersSnap.docs.map(d => d.data());
    const teams = teamsSnap.docs.map(d => d.data());
    const submissions = submissionsSnap.docs.map(d => d.data());
    const evals = evalsSnap.docs.map(d => d.data());
    const officialResults = resultsSnap.exists ? resultsSnap.data() : null;

    // User Analytics
    let participants = 0;
    let judges = 0;
    let admins = 0;
    let disabledUsers = 0;
    users.forEach(u => {
      if (u.role === 'participant') participants++;
      else if (u.role === 'judge') judges++;
      else if (u.role === 'admin') admins++;
      if (u.accountStatus === 'disabled') disabledUsers++;
    });
    const activeJudgesCount = users.filter(u => u.role === 'judge' && u.accountStatus !== 'disabled').length;

    // Team Analytics
    const totalTeams = teams.length;
    let teamsWithSubmissions = 0;

    // Submission Analytics
    const totalSubmissions = submissions.length;
    let submittedCount = 0;
    submissions.forEach(s => {
      if (s.status === 'SUBMITTED') {
        submittedCount++;
        teamsWithSubmissions++;
      }
    });

    const eligibleTeamsCount = submittedCount;

    // Evaluation Analytics
    const expectedEvaluations = activeJudgesCount * eligibleTeamsCount;
    let completedEvaluations = 0;
    evals.forEach(e => {
      if (e.status === 'SUBMITTED') completedEvaluations++;
    });
    
    const pendingEvaluations = Math.max(0, expectedEvaluations - completedEvaluations);
    const completionPercentage = expectedEvaluations > 0 ? Math.round((completedEvaluations / expectedEvaluations) * 100) : 0;

    // Results Analytics
    const isResultsPublished = officialResults?.status === 'PUBLISHED';
    const rankedTeams = isResultsPublished ? (officialResults.rankings?.length || 0) : 0;
    let highestScore = null;
    let lowestScore = null;
    let averageScore = null;

    if (isResultsPublished && officialResults.rankings && officialResults.rankings.length > 0) {
      const scores = officialResults.rankings.map((r: any) => r.finalScore);
      highestScore = Math.max(...scores);
      lowestScore = Math.min(...scores);
      averageScore = Number((scores.reduce((a: number, b: number) => a + b, 0) / scores.length).toFixed(2));
    }

    res.json(successResponse({
      users: {
        total: users.length,
        participants,
        judges,
        admins,
        disabledUsers
      },
      teams: {
        total: totalTeams,
        withSubmissions: teamsWithSubmissions,
        withoutSubmissions: totalTeams - teamsWithSubmissions
      },
      submissions: {
        total: totalSubmissions,
        submitted: submittedCount,
        draft: totalSubmissions - submittedCount
      },
      evaluations: {
        expected: expectedEvaluations,
        completed: completedEvaluations,
        pending: pendingEvaluations,
        completionPercentage
      },
      results: {
        rankedTeams,
        isPublished: isResultsPublished,
        publishedAt: officialResults?.publishedAt?.toDate ? officialResults.publishedAt.toDate().toISOString() : null,
        highestScore,
        lowestScore,
        averageTeamScore: averageScore
      }
    }));
  } catch (error: any) {
    res.status(500).json(errorResponse('INTERNAL_SERVER_ERROR', error.message));
  }
};

const escapeCSV = (field: any): string => {
  if (field === null || field === undefined) return '';
  let str = String(field);
  
  // Prevent spreadsheet formula injection
  if (/^[=+\-@]/.test(str)) {
    str = "'" + str;
  }
  
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    str = `"${str.replace(/"/g, '""')}"`;
  }
  return str;
};

export const exportAnalytics = async (req: Request, res: Response) => {
  try {
    const type = req.params.type;
    if (!db) throw new Error('DB not initialized');
    
    let csvString = '';
    
    if (type === 'users') {
      const usersSnap = await db.collection('users').get();
      csvString = 'UID,Name,Email,Role,Status,TeamID\n';
      usersSnap.docs.forEach(doc => {
        const d = doc.data();
        csvString += `${escapeCSV(doc.id)},${escapeCSV(d.name)},${escapeCSV(d.email)},${escapeCSV(d.role)},${escapeCSV(d.accountStatus)},${escapeCSV(d.teamId)}\n`;
      });
    } else if (type === 'teams') {
      const teamsSnap = await db.collection('teams').get();
      csvString = 'TeamID,Name,TeamCode,LeaderUID,CreatedAt\n';
      teamsSnap.docs.forEach(doc => {
        const d = doc.data();
        csvString += `${escapeCSV(doc.id)},${escapeCSV(d.name)},${escapeCSV(d.teamCode)},${escapeCSV(d.leader)},${escapeCSV(d.createdAt?.toDate ? d.createdAt.toDate().toISOString() : '')}\n`;
      });
    } else if (type === 'submissions') {
      const subsSnap = await db.collection('submissions').get();
      csvString = 'TeamID,ProjectTitle,Status,SubmittedAt\n';
      subsSnap.docs.forEach(doc => {
        const d = doc.data();
        csvString += `${escapeCSV(doc.id)},${escapeCSV(d.projectTitle)},${escapeCSV(d.status)},${escapeCSV(d.submittedAt?.toDate ? d.submittedAt.toDate().toISOString() : '')}\n`;
      });
    } else if (type === 'evaluations') {
      const evalsSnap = await db.collection('evaluations').get();
      csvString = 'EvaluationID,TeamID,JudgeUID,Status,TotalScore,SubmittedAt\n';
      evalsSnap.docs.forEach(doc => {
        const d = doc.data();
        csvString += `${escapeCSV(doc.id)},${escapeCSV(d.teamId)},${escapeCSV(d.judgeUid)},${escapeCSV(d.status)},${escapeCSV(d.totalScore)},${escapeCSV(d.submittedAt?.toDate ? d.submittedAt.toDate().toISOString() : '')}\n`;
      });
    } else if (type === 'results') {
      const resultsRef = await db.collection('results').doc('official_rankings').get();
      csvString = 'Rank,TeamID,TeamName,TeamCode,ProjectTitle,FinalScore\n';
      if (resultsRef.exists && resultsRef.data()?.rankings) {
        resultsRef.data()?.rankings.forEach((r: any) => {
          csvString += `${escapeCSV(r.rank)},${escapeCSV(r.teamId)},${escapeCSV(r.teamName)},${escapeCSV(r.teamCode)},${escapeCSV(r.projectTitle)},${escapeCSV(r.finalScore)}\n`;
        });
      }
    } else {
      return res.status(400).json(errorResponse('BAD_REQUEST', 'Invalid export type'));
    }

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${type}_export_${new Date().toISOString().split('T')[0]}.csv"`);
    res.send(csvString);
  } catch (error: any) {
    res.status(500).json(errorResponse('INTERNAL_SERVER_ERROR', error.message));
  }
};

export const unpublishResults = async (req: Request, res: Response) => {
  try {
    if (!db) throw new Error('DB not initialized');
    await db.collection('results').doc('official_rankings').delete();
    res.json(successResponse({ message: 'Results unpublished successfully' }));
  } catch (error: any) {
    res.status(500).json(errorResponse('INTERNAL_SERVER_ERROR', error.message));
  }
};
export const getAnnouncements = async (req: Request, res: Response) => {
  try {
    const snap = await db!.collection('announcements').orderBy('createdAt', 'desc').get();
    const announcements = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(successResponse({ announcements }));
  } catch (error: any) {
    res.status(500).json(errorResponse('INTERNAL_SERVER_ERROR', error.message));
  }
};

export const createAnnouncement = async (req: Request, res: Response) => {
  try {
    const { title, content, priority, status, expiresAt } = req.body;
    const newRef = db!.collection('announcements').doc();
    const data = {
      title,
      content,
      priority,
      status,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
      createdBy: req.user?.uid || 'system',
      expiresAt: expiresAt || null,
      publishedAt: status === 'PUBLISHED' ? FieldValue.serverTimestamp() : null
    };
    await newRef.set(data);
    res.status(201).json(successResponse({ id: newRef.id, ...data }));
  } catch (error: any) {
    res.status(500).json(errorResponse('INTERNAL_SERVER_ERROR', error.message));
  }
};

export const updateAnnouncement = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const updates = req.body;
    const ref = db!.collection('announcements').doc(id);
    const docSnap = await ref.get();
    if (!docSnap.exists) return res.status(404).json(errorResponse('NOT_FOUND', 'Announcement not found'));
    
    const dataToUpdate: any = { ...updates, updatedAt: FieldValue.serverTimestamp() };
    await ref.update(dataToUpdate);
    res.json(successResponse({ id, ...dataToUpdate }));
  } catch (error: any) {
    res.status(500).json(errorResponse('INTERNAL_SERVER_ERROR', error.message));
  }
};

export const publishAnnouncement = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const ref = db!.collection('announcements').doc(id);
    const docSnap = await ref.get();
    if (!docSnap.exists) return res.status(404).json(errorResponse('NOT_FOUND', 'Announcement not found'));
    
    await ref.update({
      status: 'PUBLISHED',
      publishedAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp()
    });
    res.json(successResponse({ id, status: 'PUBLISHED' }));
  } catch (error: any) {
    res.status(500).json(errorResponse('INTERNAL_SERVER_ERROR', error.message));
  }
};

export const unpublishAnnouncement = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const ref = db!.collection('announcements').doc(id);
    const docSnap = await ref.get();
    if (!docSnap.exists) return res.status(404).json(errorResponse('NOT_FOUND', 'Announcement not found'));
    
    await ref.update({
      status: 'DRAFT',
      updatedAt: FieldValue.serverTimestamp()
    });
    res.json(successResponse({ id, status: 'DRAFT' }));
  } catch (error: any) {
    res.status(500).json(errorResponse('INTERNAL_SERVER_ERROR', error.message));
  }
};

export const deleteAnnouncement = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    await db!.collection('announcements').doc(id).delete();
    res.json(successResponse({ id }));
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
    res.json(successResponse({ rules: { id: doc.id, ...doc.data() } }));
  } catch (error: any) {
    res.status(500).json(errorResponse('INTERNAL_SERVER_ERROR', error.message));
  }
};

export const updateRules = async (req: Request, res: Response) => {
  try {
    const { content, status } = req.body;
    const ref = db!.collection('hackathonRules').doc('official');
    
    const data: any = {
      content,
      status,
      updatedAt: FieldValue.serverTimestamp(),
      updatedBy: req.user?.uid || 'system'
    };
    
    if (status === 'PUBLISHED') {
      data.publishedAt = FieldValue.serverTimestamp();
    }
    
    await ref.set(data, { merge: true });
    res.json(successResponse({ message: 'Rules updated successfully' }));
  } catch (error: any) {
    res.status(500).json(errorResponse('INTERNAL_SERVER_ERROR', error.message));
  }
};
