import { Request, Response } from 'express';
import { db } from '../lib/firebase/admin';
import { errorResponse, successResponse } from '../utils/response';
import { FieldValue } from 'firebase-admin/firestore';

// Define the authoritative criteria on the backend
const EVALUATION_CRITERIA = [
  { id: 'c1', name: 'Innovation & Creativity', maxScore: 25 },
  { id: 'c2', name: 'Technical Implementation', maxScore: 25 },
  { id: 'c3', name: 'UI/UX Design', maxScore: 25 },
  { id: 'c4', name: 'Presentation & Demo', maxScore: 25 }
];
const MAX_TOTAL_SCORE = 100;

// Reusable Helper for Aggregation
const getTeamJudgingSummary = async (teamId: string) => {
  if (!db) throw new Error('DB not initialized');
  
  // Get active judges count dynamically
  const judgesSnap = await db.collection('users').where('role', '==', 'judge').get();
  const totalJudges = judgesSnap.size;

  // Get all evaluations for this team
  const evalsSnap = await db.collection('evaluations').where('teamId', '==', teamId).get();
  
  const evaluations = evalsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
  
  // Calculate aggregate from SUBMITTED evaluations only
  const submittedEvals = evaluations.filter((e: any) => e.status === 'SUBMITTED');
  const completedJudges = submittedEvals.length;
  const pendingJudges = totalJudges - completedJudges;
  
  let sumScores = 0;
  for (const ev of submittedEvals) {
    sumScores += (ev as any).totalScore || 0;
  }
  
  const rawAverage = completedJudges > 0 ? sumScores / completedJudges : 0;
  const averageScore = parseFloat(rawAverage.toFixed(2));
  
  const isComplete = completedJudges > 0 && completedJudges >= totalJudges;
  const status = isComplete ? 'COMPLETE' : 'AWAITING_JUDGES';
  const finalScore = isComplete ? averageScore : null;

  return {
    totalJudges,
    completedJudges,
    pendingJudges,
    averageScore,
    finalScore,
    status,
    evaluations: submittedEvals // Return submitted evaluations for individual score display if policy allows
  };
};

export const getAssignments = async (req: Request, res: Response) => {
  try {
    const judgeUid = req.user?.uid;
    if (!judgeUid || !db) return res.status(500).json(errorResponse('INTERNAL_SERVER_ERROR', 'Initialization error'));

    // Global Judging: find all teams that have a SUBMITTED submission
    const submissionsSnap = await db.collection('submissions').where('status', '==', 'SUBMITTED').get();
    const teamIds = submissionsSnap.docs.map(doc => doc.id);
    
    if (teamIds.length === 0) {
      return res.status(200).json(successResponse({ teams: [] }));
    }

    const assignedTeams = await Promise.all(teamIds.map(async (teamId) => {
      const teamDoc = await db!.collection('teams').doc(teamId).get();
      const teamData = teamDoc.data() || {};
      const submissionData = submissionsSnap.docs.find(d => d.id === teamId)?.data() || {};

      const summary = await getTeamJudgingSummary(teamId);
      
      const myEvalDoc = await db!.collection('evaluations').doc(`${judgeUid}_${teamId}`).get();
      const myEvalData = myEvalDoc.data() || { status: 'NOT_STARTED', totalScore: 0 };

      return {
        teamId: teamId,
        teamName: teamData.teamName,
        leaderUid: teamData.leaderUid,
        memberCount: teamData.memberCount,
        projectTitle: submissionData.projectTitle || null,
        submissionStatus: submissionData.status,
        myEvaluation: {
          exists: myEvalDoc.exists,
          status: myEvalData.status,
          totalScore: myEvalData.totalScore
        },
        judgingSummary: {
          totalJudges: summary.totalJudges,
          completedJudges: summary.completedJudges,
          pendingJudges: summary.pendingJudges,
          averageScore: summary.averageScore,
          finalScore: summary.finalScore,
          status: summary.status
        }
      };
    }));

    res.status(200).json(successResponse({ teams: assignedTeams }));
  } catch (error: any) {
    res.status(400).json(errorResponse('BAD_REQUEST', error.message));
  }
};

export const getTeamSubmission = async (req: Request, res: Response) => {
  try {
    const judgeUid = req.user?.uid;
    const { teamId } = req.params;
    if (!judgeUid || !db) return res.status(500).json(errorResponse('INTERNAL_SERVER_ERROR', 'Initialization error'));

    // Check if team is eligible
    const submissionDoc = await db.collection('submissions').doc(teamId as string).get();
    if (!submissionDoc.exists || submissionDoc.data()?.status !== 'SUBMITTED') {
      return res.status(403).json(errorResponse('FORBIDDEN', 'This team does not have an eligible submission'));
    }

    const teamDoc = await db.collection('teams').doc(teamId as string).get();
    const myEvalDoc = await db.collection('evaluations').doc(`${judgeUid}_${teamId as string}`).get();
    const summary = await getTeamJudgingSummary(teamId as string);
    
    // Privacy policy: Judges can only see other judges' scores (without feedback) AFTER they submit their own.
    let individualScores: any[] = [];
    const myStatus = myEvalDoc.data()?.status;
    if (myStatus === 'SUBMITTED') {
      individualScores = summary.evaluations.map((ev: any) => ({
        judgeUid: ev.judgeUid,
        totalScore: ev.totalScore
      }));
    }

    res.status(200).json(successResponse({ 
      submission: submissionDoc.data(),
      team: teamDoc.data(),
      evaluation: myEvalDoc.data() || { criteriaScores: [], status: 'NOT_STARTED', overallFeedback: '' },
      criteriaTemplate: EVALUATION_CRITERIA,
      judgingSummary: {
        totalJudges: summary.totalJudges,
        completedJudges: summary.completedJudges,
        pendingJudges: summary.pendingJudges,
        averageScore: summary.averageScore,
        finalScore: summary.finalScore,
        status: summary.status,
        individualScores
      }
    }));
  } catch (error: any) {
    res.status(400).json(errorResponse('BAD_REQUEST', error.message));
  }
};

export const saveEvaluation = async (req: Request, res: Response) => {
  try {
    const judgeUid = req.user?.uid;
    const { teamId } = req.params;
    const { isFinalSubmit, criteriaScores, overallFeedback } = req.body;
    
    if (!judgeUid || !db) return res.status(500).json(errorResponse('INTERNAL_SERVER_ERROR', 'Initialization error'));

    await db.runTransaction(async (t) => {
      // 1. Verify Team Eligibility
      const submissionRef = db!.collection('submissions').doc(teamId as string);
      const submissionDoc = await t.get(submissionRef);
      if (!submissionDoc.exists || submissionDoc.data()?.status !== 'SUBMITTED') {
        throw new Error('This team is not eligible for judging');
      }

      // 2. Fetch current Judge's evaluation
      const evalRef = db!.collection('evaluations').doc(`${judgeUid}_${teamId as string}`);
      const evalDoc = await t.get(evalRef);
      if (evalDoc.exists && evalDoc.data()?.status === 'SUBMITTED') {
        throw new Error('Evaluation is locked and cannot be modified');
      }

      // 3. Validate Scores Server-Side
      let calculatedTotal = 0;
      const validatedScores = criteriaScores.map((c: any) => {
        const template = EVALUATION_CRITERIA.find(tmpl => tmpl.id === c.id);
        if (!template) throw new Error(`Invalid criterion ID: ${c.id}`);
        
        const score = parseFloat(c.score);
        if (isNaN(score) || score < 0 || score > template.maxScore) {
          throw new Error(`Invalid score for ${template.name}. Must be between 0 and ${template.maxScore}`);
        }
        
        calculatedTotal += score;
        return {
          id: c.id,
          name: template.name,
          score: score,
          maxScore: template.maxScore,
          feedback: c.feedback || ''
        };
      });

      // 4. If Final Submit, verify all criteria present
      if (isFinalSubmit) {
        if (validatedScores.length !== EVALUATION_CRITERIA.length) {
          throw new Error('All criteria must be scored for final submission');
        }
      }

      const evalData: any = {
        judgeUid,
        teamId,
        criteriaScores: validatedScores,
        totalScore: calculatedTotal,
        maxScore: MAX_TOTAL_SCORE,
        overallFeedback: overallFeedback || '',
        status: isFinalSubmit ? 'SUBMITTED' : 'IN_PROGRESS',
        updatedTimestamp: FieldValue.serverTimestamp()
      };

      if (isFinalSubmit) {
        evalData.submittedAt = FieldValue.serverTimestamp();
      }

      if (!evalDoc.exists) {
        evalData.createdTimestamp = FieldValue.serverTimestamp();
      }

      t.set(evalRef, evalData, { merge: true });
    });

    res.status(200).json(successResponse({ message: isFinalSubmit ? 'Evaluation locked' : 'Evaluation saved' }));
  } catch (error: any) {
    res.status(400).json(errorResponse('BAD_REQUEST', error.message));
  }
};
