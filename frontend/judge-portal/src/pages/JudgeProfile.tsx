import { useAuth } from '../contexts/AuthContext';
import { auth } from '../lib/firebase/client';

export default function JudgeProfile() {
  const { currentUser, profile } = useAuth();

  return (
    <div className="min-h-screen bg-surface p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        <header className="flex justify-between items-end border-b border-outline-variant pb-6">
          <div>
            <h1 className="text-4xl font-black text-primary mb-2">Judge Profile</h1>
            <p className="text-secondary">Your judge identity and account details.</p>
          </div>
          <button onClick={() => auth.signOut()} className="px-4 py-2 border border-outline-variant rounded-lg text-secondary hover:bg-surface-container-high transition-colors font-medium text-sm">
            Sign Out
          </button>
        </header>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-outline-variant">
          <h2 className="text-xl font-bold text-on-surface mb-6">Profile Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <p className="text-sm text-secondary font-bold mb-1">Full Name</p>
              <p className="text-lg font-medium text-on-surface">
                {profile?.fullName || currentUser?.displayName || 'Not Provided'}
              </p>
            </div>
            
            <div>
              <p className="text-sm text-secondary font-bold mb-1">Email Address</p>
              <p className="text-lg font-medium text-on-surface">
                {currentUser?.email || 'N/A'}
              </p>
            </div>

            <div>
              <p className="text-sm text-secondary font-bold mb-1">Assigned Role</p>
              <span className="inline-block px-3 py-1 bg-primary-container text-on-primary-container text-sm font-bold rounded-full uppercase mt-1">
                {profile?.role || 'JUDGE'}
              </span>
            </div>

            <div>
              <p className="text-sm text-secondary font-bold mb-1">Judge ID (UID)</p>
              <p className="text-sm font-mono text-on-surface bg-surface-container p-2 rounded border border-outline-variant inline-block">
                {currentUser?.uid || 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
