import { useState, useEffect } from 'react';
import { doc, onSnapshot, collection, query, where } from 'firebase/firestore';
import { db } from '../lib/firebase/client';
import { useAuth } from '../contexts/AuthContext';

export interface TeamData {
  id?: string;
  name?: string;
  teamCode?: string;
  leaderId?: string;
  members?: any[];
  [key: string]: any;
}

export function useCurrentTeam() {
  const { currentUser, profile, loading: authLoading } = useAuth();
  const [team, setTeam] = useState<TeamData | null>(null);
  const [joinRequests, setJoinRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Wait until auth state is fully loaded
    if (authLoading) {
      return;
    }

    if (!currentUser || !profile?.teamId) {
      setTeam(null);
      setLoading(false);
      return;
    }

    // Set loading true when starting to fetch a new team
    setLoading(true);
    
    const unsubscribeTeam = onSnapshot(
      doc(db, 'teams', profile.teamId),
      (teamSnap) => {
        if (teamSnap.exists()) {
          setTeam({ id: teamSnap.id, ...teamSnap.data() } as TeamData);
          setError(null);
        } else {
          setTeam(null);
          // If a teamId exists on profile but no document is found in 'teams'
          setError('Team not found');
        }
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching team:', err);
        setError(err.message);
        setTeam(null);
        setLoading(false);
      }
    );

    // Listen to join requests for this team
    const requestsQuery = query(
      collection(db, 'teamJoinRequests'),
      where('teamId', '==', profile.teamId),
      where('status', '==', 'pending')
    );
    const unsubscribeRequests = onSnapshot(
      requestsQuery,
      (snapshot) => {
        const requests = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setJoinRequests(requests);
      },
      (err) => {
        console.error('Error fetching join requests:', err);
      }
    );

    return () => {
      unsubscribeTeam();
      unsubscribeRequests();
    };
  }, [currentUser?.uid, profile?.teamId, authLoading]);

  return { team, joinRequests, loading: authLoading || loading, error };
}
