import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/firebase/client';
import { doc, onSnapshot, collection, query, where } from 'firebase/firestore';
import { createTeam, submitJoinRequest, acceptJoinRequest, rejectJoinRequest } from '../services/teamService';

export const Dashboard: React.FC = () => {
  const { profile } = useAuth();
  const [team, setTeam] = useState<any>(null);
  const [requests, setRequests] = useState<any[]>([]);
  const [teamNameInput, setTeamNameInput] = useState('');
  const [teamCodeInput, setTeamCodeInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Real-time listener for Team Data
  useEffect(() => {
    if (!profile?.teamId) return;
    
    const unsubscribe = onSnapshot(doc(db, 'teams', profile.teamId), (docSnap) => {
      if (docSnap.exists()) {
        setTeam(docSnap.data());
      }
    });
    return () => unsubscribe();
  }, [profile?.teamId]);

  // Real-time listener for Requests (Either incoming for leaders, or outgoing for members)
  useEffect(() => {
    if (!profile) return;
    
    let q;
    if (profile.teamId && profile.teamRole === 'leader') {
      // Leader sees incoming requests to their team
      q = query(collection(db, 'teamJoinRequests'), where('teamId', '==', profile.teamId), where('status', '==', 'pending'));
    } else if (!profile.teamId) {
      // Solo participant sees their outgoing pending requests
      q = query(collection(db, 'teamJoinRequests'), where('participantUid', '==', profile.uid), where('status', '==', 'pending'));
    }

    if (q) {
      const unsubscribe = onSnapshot(q, (snapshot) => {
        setRequests(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      });
      return () => unsubscribe();
    }
  }, [profile]);

  const handleCreateTeam = async () => {
    setLoading(true); setError('');
    try {
      await createTeam(teamNameInput);
      setTeamNameInput('');
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleJoinTeam = async () => {
    setLoading(true); setError('');
    try {
      await submitJoinRequest(teamCodeInput);
      setTeamCodeInput('');
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleAccept = async (reqId: string) => {
    try { await acceptJoinRequest(reqId); } catch (err: any) { alert(err.message); }
  };

  const handleReject = async (reqId: string) => {
    try { await rejectJoinRequest(reqId); } catch (err: any) { alert(err.message); }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Participant Dashboard</h1>
      {error && <div className="bg-red-100 text-red-700 p-4 rounded mb-6">{error}</div>}

      {!profile?.teamId ? (
        <div className="grid grid-cols-2 gap-8">
          <div className="p-6 border rounded shadow">
            <h2 className="text-xl font-semibold mb-4">Create Team</h2>
            <input 
              className="border p-2 w-full mb-4" 
              placeholder="Team Name" 
              value={teamNameInput} 
              onChange={e => setTeamNameInput(e.target.value)} 
            />
            <button onClick={handleCreateTeam} disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded">
              Create
            </button>
          </div>
          <div className="p-6 border rounded shadow">
            <h2 className="text-xl font-semibold mb-4">Join by Code</h2>
            <input 
              className="border p-2 w-full mb-4" 
              placeholder="6-Character Code" 
              value={teamCodeInput} 
              onChange={e => setTeamCodeInput(e.target.value)} 
            />
            <button onClick={handleJoinTeam} disabled={loading} className="bg-green-600 text-white px-4 py-2 rounded">
              Request to Join
            </button>
            {requests.length > 0 && (
              <div className="mt-4 text-sm text-gray-600">
                You have {requests.length} pending requests.
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="p-6 border rounded shadow">
          <h2 className="text-2xl font-bold mb-2">{team?.teamName}</h2>
          <p className="text-gray-600 mb-4">Code: <strong className="text-black">{team?.teamCode}</strong></p>
          <div className="mb-4">
            <span className={`px-3 py-1 rounded text-sm ${team?.eligibilityStatus === 'eligible' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
              {team?.eligibilityStatus === 'eligible' ? 'Eligible' : 'Not Eligible (Needs 2+ members and 1+ female)'}
            </span>
          </div>
          
          <h3 className="font-semibold mt-6 mb-2">Members ({team?.memberCount}/6)</h3>
          <ul className="list-disc pl-5 mb-6">
            {team?.members?.map((m: any) => (
              <li key={m.uid}>{m.fullName} - {m.teamRole} {m.isFemale ? '(F)' : ''}</li>
            ))}
          </ul>

          {profile.teamRole === 'leader' && requests.length > 0 && (
            <div className="mt-8 border-t pt-6">
              <h3 className="font-semibold mb-4">Pending Requests</h3>
              {requests.map(req => (
                <div key={req.id} className="flex justify-between items-center bg-gray-50 p-3 rounded mb-2">
                  <span>{req.participantName}</span>
                  <div>
                    <button onClick={() => handleAccept(req.id)} className="text-green-600 font-medium mr-4">Accept</button>
                    <button onClick={() => handleReject(req.id)} className="text-red-600 font-medium">Reject</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
