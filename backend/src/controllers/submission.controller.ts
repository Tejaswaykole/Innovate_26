import { Request, Response } from 'express';
import { db } from '../lib/firebase/admin';
import { errorResponse, successResponse } from '../utils/response';
import { FieldValue } from 'firebase-admin/firestore';

const isValidUrl = (urlString: string) => {
  try {
    new URL(urlString);
    return true;
  } catch (e) {
    return false;
  }
};

export const saveDraft = async (req: Request, res: Response) => {
  try {
    const uid = req.user?.uid;
    if (!uid || !db) return res.status(500).json(errorResponse('INTERNAL_SERVER_ERROR', 'Initialization error'));

    const { projectTitle, problemStatement, description, proposedSolution, githubUrl, demoUrl, pptUrl, videoUrl, screenshotsUrl } = req.body;

    await db.runTransaction(async (t) => {
      const userDoc = await t.get(db!.collection('users').doc(uid));
      const userData = userDoc.data();

      if (!userData?.teamId || userData?.teamRole !== 'leader') {
        throw new Error('Only the Team Leader can save submission drafts');
      }

      const submissionRef = db!.collection('submissions').doc(userData.teamId);
      const submissionDoc = await t.get(submissionRef);

      if (submissionDoc.exists && submissionDoc.data()?.status === 'SUBMITTED') {
        throw new Error('Submission is already locked and cannot be edited');
      }

      if (githubUrl && !isValidUrl(githubUrl)) throw new Error('Invalid GitHub URL');
      if (demoUrl && !isValidUrl(demoUrl)) throw new Error('Invalid Demo URL');

      const draftData = {
        teamId: userData.teamId,
        projectTitle: projectTitle || null,
        problemStatement: problemStatement || null,
        description: description || null,
        proposedSolution: proposedSolution || null,
        githubUrl: githubUrl || null,
        demoUrl: demoUrl || null,
        pptUrl: pptUrl || null,
        videoUrl: videoUrl || null,
        screenshotsUrl: screenshotsUrl || null,
        status: 'DRAFT',
        updatedTimestamp: FieldValue.serverTimestamp()
      };

      if (!submissionDoc.exists) {
        Object.assign(draftData, { createdTimestamp: FieldValue.serverTimestamp() });
        t.set(submissionRef, draftData);
      } else {
        t.update(submissionRef, draftData);
      }
    });

    res.status(200).json(successResponse({ message: 'Draft saved successfully' }));
  } catch (error: any) {
    res.status(400).json(errorResponse('BAD_REQUEST', error.message));
  }
};

export const finalSubmit = async (req: Request, res: Response) => {
  try {
    const uid = req.user?.uid;
    if (!uid || !db) return res.status(500).json(errorResponse('INTERNAL_SERVER_ERROR', 'Initialization error'));

    await db.runTransaction(async (t) => {
      const userDoc = await t.get(db!.collection('users').doc(uid));
      const userData = userDoc.data();

      if (!userData?.teamId || userData?.teamRole !== 'leader') {
        throw new Error('Only the Team Leader can finalize the submission');
      }

      const teamDoc = await t.get(db!.collection('teams').doc(userData.teamId));
      if (!teamDoc.exists) throw new Error('Team does not exist');

      const submissionRef = db!.collection('submissions').doc(userData.teamId);
      const submissionDoc = await t.get(submissionRef);

      if (!submissionDoc.exists) {
         throw new Error('No draft found to submit');
      }

      const submissionData = submissionDoc.data()!;

      if (submissionData.status === 'SUBMITTED' || submissionData.status === 'LOCKED') {
        throw new Error('Project is already submitted and locked');
      }

      // Strict validation of required fields
      if (!submissionData.projectTitle) throw new Error('Project title is required');
      if (!submissionData.problemStatement) throw new Error('Problem statement is required');
      if (!submissionData.description) throw new Error('Project description is required');
      if (!submissionData.proposedSolution) throw new Error('Proposed solution is required');
      if (!submissionData.pptUrl || !isValidUrl(submissionData.pptUrl)) throw new Error('Valid PPT GDrive link is required');
      if (!submissionData.videoUrl || !isValidUrl(submissionData.videoUrl)) throw new Error('Valid demo video GDrive link is required');
      if (!submissionData.githubUrl || !isValidUrl(submissionData.githubUrl)) throw new Error('Valid GitHub repository link is required');
      if (submissionData.demoUrl && !isValidUrl(submissionData.demoUrl)) throw new Error('Valid project demo link is required');

      if (submissionData.screenshotsUrl && !isValidUrl(submissionData.screenshotsUrl)) {
        throw new Error('Screenshots URL must be a valid link');
      }

      // Update status to locked
      t.update(submissionRef, {
        status: 'SUBMITTED',
        submittedAt: FieldValue.serverTimestamp(),
        updatedTimestamp: FieldValue.serverTimestamp()
      });
    });

    res.status(200).json(successResponse({ message: 'Your project has been submitted successfully' }));
  } catch (error: any) {
    res.status(400).json(errorResponse('BAD_REQUEST', error.message));
  }
};
