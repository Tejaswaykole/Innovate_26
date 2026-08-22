import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { signInWithPopup, signInWithRedirect, getRedirectResult } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, googleProvider, db } from '../lib/firebase/client';

export default function Component() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const successMessage = location.state?.message;

  useEffect(() => {
    const handleRedirectResult = async () => {
      setLoading(true);
      try {
        const result = await getRedirectResult(auth);
        if (result) {
          const user = result.user;
          const userDocRef = doc(db, 'users', user.uid);
          const userDocSnap = await getDoc(userDocRef);
          
          if (userDocSnap.exists()) {
            navigate('/participant/dashboard');
          } else {
            navigate('/participant/complete-profile');
          }
        }
      } catch (err: any) {
        if (err.code !== 'auth/popup-closed-by-user') {
          setError(err.message || 'Failed to login with Google');
        }
      } finally {
        setLoading(false);
      }
    };
    handleRedirectResult();
  }, [navigate]);

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      const userDocRef = doc(db, 'users', user.uid);
      const userDocSnap = await getDoc(userDocRef);
      
      if (userDocSnap.exists()) {
        navigate('/participant/dashboard');
      } else {
        navigate('/participant/complete-profile');
      }
    } catch (err: any) {
      if (err.code === 'auth/popup-blocked') {
        try {
          await signInWithRedirect(auth, googleProvider);
        } catch (redirectErr: any) {
          setError('Could not sign in with Google.');
          setLoading(false);
        }
      } else if (err.code !== 'auth/popup-closed-by-user') {
        setError(err.message || 'Failed to login with Google');
        setLoading(false);
      } else {
        setLoading(false);
      }
    }
  };

  return (
    <>
<main className="flex-grow flex items-center justify-center p-md md:p-gutter">
<div className="w-full max-w-md bg-surface-container-lowest rounded-xl border border-surface-variant elevation-1 p-xl">

<div className="text-center mb-xl flex flex-col items-center">
<img src="/logo.png" alt="Innovate'26 Logo" className="h-16 object-contain mb-4" />
<h1 className="font-headline-lg text-headline-lg text-on-surface mb-xs">Welcome Back</h1>
<p className="font-body-md text-body-md text-on-surface-variant">Sign in to continue to the INNOVATE'26 portal.</p>
</div>

{successMessage && <div className="mb-md bg-success/10 text-success p-3 rounded-lg border border-success/30 text-sm text-center">{successMessage}</div>}

{error && (
  <div className="mb-4 p-3 bg-error/10 text-error rounded-md text-sm">
    {error}
  </div>
)}



<button 
  onClick={handleGoogleLogin} 
  disabled={loading}
  type="button" 
  className="w-full mb-lg bg-surface-container-low text-on-surface border border-outline-variant py-[10px] px-lg rounded-lg font-label-md text-label-md flex justify-center items-center gap-sm transition-all hover:bg-surface-container disabled:opacity-50"
>
  <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google Logo" className="w-5 h-5" />
  <span>Sign in with Google</span>
</button>

<div className="space-y-sm flex flex-col items-center">
<p className="font-body-md text-body-md text-secondary">
                    Don't have an account? <Link className="text-primary font-semibold hover:underline transition-all" to="/register">Create Account</Link>
</p>
<Link className="font-caption text-caption text-secondary hover:text-on-surface flex items-center gap-xs mt-sm transition-colors" to="/">
<span className="material-symbols-outlined" style={{ "fontSize": "16px" }}>arrow_back</span>
                    Back to Website
                </Link>
</div>
</div>
</main>

<footer className="w-full py-8 mt-auto bg-surface-container-low border-t border-outline-variant flex flex-col md:flex-row justify-between items-center px-gutter gap-4 text-secondary font-caption text-caption">
<div className="font-label-md text-label-md uppercase tracking-widest text-on-surface-variant">
            INNOVATE'26 Auth
        </div>
<div>
            © 2024 INNOVATE'26 Department of Computer Engineering, T.M.E's J.T.M. College of Engineering, Faizpur. Built for innovators.
        </div>
<div className="flex gap-lg">
<a className="text-on-surface-variant hover:text-primary transition-all" href="#">Privacy Policy</a>
<a className="text-on-surface-variant hover:text-primary transition-all" href="#">Terms of Service</a>
<a className="text-on-surface-variant hover:text-primary transition-all" href="#">Contact Organizer</a>
</div>
</footer>


    </>
  );
}
