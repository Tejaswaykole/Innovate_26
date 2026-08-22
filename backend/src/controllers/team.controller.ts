import { Request, Response } from 'express';
import { db } from '../lib/firebase/admin';
import { errorResponse, successResponse } from '../utils/response';
import { FieldValue } from 'firebase-admin/firestore';

// Helper to generate 6-character random code
const generateTeamCode = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

export const createTeam = async (req: Request, res: Response) => {
  try {
    const { teamName } = req.body;
    const uid = req.user?.uid;

    if (!teamName || teamName.trim() === '') {
      res.status(400).json(errorResponse('BAD_REQUEST', 'Team name is required'));
      return;
    }

    if (!db) {
       res.status(500).json(errorResponse('INTERNAL_SERVER_ERROR', 'Database not initialized'));
       return;
    }

    const userRef = db!.collection('users').doc(uid as string);

    // Run as a transaction to ensure atomicity
    await db!.runTransaction(async (t) => {
      const userDoc = await t.get(userRef);
      if (!userDoc.exists) throw new Error('User not found');

      const userData = userDoc.data();
      if (userData?.teamId) {
        throw new Error('User already belongs to a team');
      }

      // Generate a unique team code (simplistic check, in production might loop if collision exists)
      const teamCode = generateTeamCode();
      const teamRef = db!.collection('teams').doc();

      const newTeam = {
        teamId: teamRef.id,
        teamName,
        teamCode,
        leaderUid: uid,
        members: [{
          uid,
          fullName: userData?.fullName || 'Unknown',
          teamRole: 'leader',
          isFemale: userData?.gender?.toLowerCase() === 'female' // Assuming gender is stored, otherwise false
        }],
        memberCount: 1,
        femaleCount: (userData?.gender?.toLowerCase() === 'female') ? 1 : 0,
        eligibilityStatus: 'pending',
        status: 'active',
        createdTimestamp: FieldValue.serverTimestamp(),
        updatedTimestamp: FieldValue.serverTimestamp(),
      };

      t.set(teamRef, newTeam);
      t.update(userRef, {
        teamId: teamRef.id,
        teamRole: 'leader',
        updatedTimestamp: FieldValue.serverTimestamp()
      });
    });

    res.status(201).json(successResponse({ message: 'Team created successfully' }));
  } catch (error: any) {
    res.status(400).json(errorResponse('BAD_REQUEST', error.message));
  }
};

export const submitJoinRequest = async (req: Request, res: Response) => {
  try {
    const { teamCode } = req.body;
    const uid = req.user?.uid;

    if (!db) return res.status(500).json(errorResponse('INTERNAL_SERVER_ERROR', 'Database not initialized'));

    // 1. Find team by code
    const teamsSnapshot = await db!.collection('teams').where('teamCode', '==', teamCode).limit(1).get();
    if (teamsSnapshot.empty) {
      return res.status(404).json(errorResponse('NOT_FOUND', 'Invalid team code'));
    }
    const teamDoc = teamsSnapshot.docs[0];
    const teamId = teamDoc.id;

    const userRef = db.collection('users').doc(uid as string);
    const userDoc = await userRef.get();
    if (userDoc.data()?.teamId) {
      return res.status(400).json(errorResponse('BAD_REQUEST', 'You already belong to a team'));
    }

    // 2. Transactionally verify limits and create request
    await db!.runTransaction(async (t) => {
      // Check for duplicate request to the same team
      const existingRequestQuery = db!.collection('teamJoinRequests')
        .where('teamId', '==', teamId)
        .where('participantUid', '==', uid)
        .where('status', '==', 'pending');
      const existingRequestSnapshot = await t.get(existingRequestQuery);
      if (!existingRequestSnapshot.empty) {
        throw new Error('You already have a pending request for this team');
      }

      // Check max 5 pending requests limit
      const activeRequestsQuery = db!.collection('teamJoinRequests')
        .where('participantUid', '==', uid)
        .where('status', '==', 'pending');
      const activeRequestsSnapshot = await t.get(activeRequestsQuery);
      if (activeRequestsSnapshot.docs.length >= 5) {
        throw new Error('Maximum 5 team requests reached');
      }

      // Check team capacity
      const teamData = (await t.get(db!.collection('teams').doc(teamId))).data();
      if (teamData?.memberCount >= 6) {
        throw new Error('Team is full');
      }

      const requestRef = db!.collection('teamJoinRequests').doc();
      t.set(requestRef, {
        requestId: requestRef.id,
        teamId,
        participantUid: uid,
        participantName: userDoc.data()?.fullName || 'Unknown',
        status: 'pending',
        createdTimestamp: FieldValue.serverTimestamp(),
        updatedTimestamp: FieldValue.serverTimestamp(),
        decisionTimestamp: null
      });
    });

    res.status(201).json(successResponse({ message: 'Join request sent successfully' }));
  } catch (error: any) {
    res.status(400).json(errorResponse('BAD_REQUEST', error.message));
  }
};

export const acceptJoinRequest = async (req: Request, res: Response) => {
  try {
    const { requestId } = req.params;
    const uid = req.user?.uid;

    if (!db) return res.status(500).json(errorResponse('INTERNAL_SERVER_ERROR', 'Database not initialized'));

    await db!.runTransaction(async (t) => {
      const requestRef = db!.collection('teamJoinRequests').doc(requestId as string);
      const requestDoc = await t.get(requestRef);
      if (!requestDoc.exists) throw new Error('Request not found');
      
      const requestData = requestDoc.data();
      if (requestData?.status !== 'pending') throw new Error('Request is no longer pending');

      const teamId = requestData.teamId;
      const teamRef = db!.collection('teams').doc(teamId);
      const teamDoc = await t.get(teamRef);
      const teamData = teamDoc.data();

      // Verify leader permission
      if (teamData?.leaderUid !== uid) throw new Error('Only the Team Leader can accept requests');

      // Verify team capacity
      if (teamData?.memberCount >= 6) throw new Error('Team is full');

      // Verify participant doesn't already have a team
      const participantRef = db!.collection('users').doc(requestData.participantUid);
      const participantDoc = await t.get(participantRef);
      if (participantDoc.data()?.teamId) throw new Error('Participant already belongs to a team');

      // Add to team
      const isFemale = participantDoc.data()?.gender?.toLowerCase() === 'female';
      const updatedMembers = [...(teamData?.members || []), {
        uid: requestData.participantUid,
        fullName: participantDoc.data()?.fullName || 'Unknown',
        teamRole: 'member',
        isFemale
      }];

      // Fetch participant's other pending requests BEFORE any writes
      const otherRequestsQuery = db!.collection('teamJoinRequests')
        .where('participantUid', '==', requestData.participantUid)
        .where('status', '==', 'pending');
      const otherRequestsSnapshot = await t.get(otherRequestsQuery);

      const newMemberCount = (teamData?.memberCount || 0) + 1;
      const newFemaleCount = (teamData?.femaleCount || 0) + (isFemale ? 1 : 0);
      const eligibilityStatus = (newMemberCount >= 2 && newFemaleCount >= 1) ? 'eligible' : 'pending';

      t.update(teamRef, {
        members: updatedMembers,
        memberCount: newMemberCount,
        femaleCount: newFemaleCount,
        eligibilityStatus,
        updatedTimestamp: FieldValue.serverTimestamp()
      });

      // Update participant's user document
      t.update(participantRef, {
        teamId: teamId,
        teamRole: 'member',
        updatedTimestamp: FieldValue.serverTimestamp()
      });

      // Update request to accepted
      t.update(requestRef, {
        status: 'accepted',
        decisionTimestamp: FieldValue.serverTimestamp(),
        updatedTimestamp: FieldValue.serverTimestamp()
      });

      // Cancel participant's other pending requests
      otherRequestsSnapshot.docs.forEach(doc => {
        if (doc.id !== requestId) {
           t.update(doc.ref, {
             status: 'cancelled',
             updatedTimestamp: FieldValue.serverTimestamp()
           });
        }
      });
    });

    res.status(200).json(successResponse({ message: 'Join request accepted' }));
  } catch (error: any) {
    res.status(400).json(errorResponse('BAD_REQUEST', error.message));
  }
};

export const rejectJoinRequest = async (req: Request, res: Response) => {
  try {
    const { requestId } = req.params;
    const uid = req.user?.uid;

    if (!db) return res.status(500).json(errorResponse('INTERNAL_SERVER_ERROR', 'Database not initialized'));

    await db!.runTransaction(async (t) => {
      const requestRef = db!.collection('teamJoinRequests').doc(requestId as string);
      const requestDoc = await t.get(requestRef);
      if (!requestDoc.exists) throw new Error('Request not found');
      
      const requestData = requestDoc.data();
      if (requestData?.status !== 'pending') throw new Error('Request is no longer pending');

      const teamRef = db!.collection('teams').doc(requestData.teamId);
      const teamDoc = await t.get(teamRef);
      
      // Verify leader permission
      if (teamDoc.data()?.leaderUid !== uid) throw new Error('Only the Team Leader can reject requests');

      // Update request to rejected
      t.update(requestRef, {
        status: 'rejected',
        decisionTimestamp: FieldValue.serverTimestamp(),
        updatedTimestamp: FieldValue.serverTimestamp()
      });
    });

    res.status(200).json(successResponse({ message: 'Join request rejected' }));
  } catch (error: any) {
    res.status(400).json(errorResponse('BAD_REQUEST', error.message));
  }
};

export const deleteTeam = async (req: Request, res: Response) => {
  try {
    const { teamId } = req.params;
    const uid = req.user?.uid;

    if (!db) return res.status(500).json(errorResponse('INTERNAL_SERVER_ERROR', 'Database not initialized'));

    await db.runTransaction(async (t) => {
      const teamRef = db!.collection('teams').doc(teamId as string);
      const teamDoc = await t.get(teamRef);

      if (!teamDoc.exists) {
        throw new Error('Team not found');
      }

      const teamData = teamDoc.data() || {};
      
      if (teamData.leaderUid !== uid) {
        throw new Error('Only the Team Leader can delete the team');
      }

      // Clear teamId from all members' profiles
      if (teamData.members && Array.isArray(teamData.members)) {
        for (const member of teamData.members) {
          const userRef = db!.collection('users').doc(member.uid);
          t.update(userRef, {
            teamId: FieldValue.delete(),
            teamRole: FieldValue.delete(),
            updatedTimestamp: FieldValue.serverTimestamp()
          });
        }
      }

      // Delete the team document
      t.delete(teamRef);
    });

    // Clean up join requests outside of transaction due to querying limits
    const requestsQuery = db.collection('teamJoinRequests').where('teamId', '==', teamId as string);
    const requestsSnapshot = await requestsQuery.get();
    
    const batch = db.batch();
    requestsSnapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });
    
    if (!requestsSnapshot.empty) {
      await batch.commit();
    }

    res.status(200).json(successResponse({ message: 'Team successfully deleted' }));
  } catch (error: any) {
    res.status(400).json(errorResponse('BAD_REQUEST', error.message));
  }
};

export const removeMember = async (req: Request, res: Response) => {
  try {
    const { teamId, memberId } = req.params;
    const uid = req.user?.uid;

    if (!db) return res.status(500).json(errorResponse('INTERNAL_SERVER_ERROR', 'Database not initialized'));

    await db.runTransaction(async (t) => {
      const teamRef = db!.collection('teams').doc(teamId as string);
      const teamDoc = await t.get(teamRef);

      if (!teamDoc.exists) {
        throw new Error('Team not found');
      }

      const teamData = teamDoc.data() || {};
      
      if (teamData.leaderUid !== uid) {
        throw new Error('Only the Team Leader can remove members');
      }

      if (uid === memberId) {
        throw new Error('Team Leader cannot remove themselves. Use Delete Team instead.');
      }

      const memberIndex = (teamData.members || []).findIndex((m: any) => m.uid === memberId);
      if (memberIndex === -1) {
        throw new Error('Member not found in team');
      }

      const memberToRemove = teamData.members[memberIndex];
      const updatedMembers = [...teamData.members];
      updatedMembers.splice(memberIndex, 1);

      const newMemberCount = Math.max(0, (teamData.memberCount || 0) - 1);
      const newFemaleCount = Math.max(0, (teamData.femaleCount || 0) - (memberToRemove.isFemale ? 1 : 0));
      const eligibilityStatus = (newMemberCount >= 2 && newFemaleCount >= 1) ? 'eligible' : 'pending';

      // Update team document
      t.update(teamRef, {
        members: updatedMembers,
        memberCount: newMemberCount,
        femaleCount: newFemaleCount,
        eligibilityStatus,
        updatedTimestamp: FieldValue.serverTimestamp()
      });

      // Clear team fields from user profile
      const userRef = db!.collection('users').doc(memberId as string);
      t.update(userRef, {
        teamId: FieldValue.delete(),
        teamRole: FieldValue.delete(),
        updatedTimestamp: FieldValue.serverTimestamp()
      });
    });

    res.status(200).json(successResponse({ message: 'Member removed successfully' }));
  } catch (error: any) {
    res.status(400).json(errorResponse('BAD_REQUEST', error.message));
  }
};
