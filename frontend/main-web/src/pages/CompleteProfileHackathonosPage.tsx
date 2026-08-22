import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../lib/firebase/client';
import { doc, setDoc } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';

export default function Component() {
  const navigate = useNavigate();
  const { currentUser, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    gender: 'Male',
    college: '',
    major: '',
    gradYear: '2025',
    track: 'ai'
  });

  const [userEmail, setUserEmail] = useState('');

  const isFormValid = formData.firstName.trim() !== '' && 
                      formData.lastName.trim() !== '' && 
                      formData.college.trim() !== '' && 
                      formData.major.trim() !== '';

  useEffect(() => {
    if (!authLoading) {
      if (!currentUser) {
        navigate('/login');
      } else {
        setUserEmail(currentUser.email || '');
        if (currentUser.displayName) {
          const names = currentUser.displayName.split(' ');
          setFormData(prev => ({
            ...prev,
            firstName: names[0] || '',
            lastName: names.slice(1).join(' ') || ''
          }));
        }
      }
    }
  }, [currentUser, authLoading, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.id || e.target.name]: e.target.value });
  };

  const handleTrackChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, track: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!auth.currentUser) {
      setError('You must be logged in.');
      setLoading(false);
      return;
    }

    try {
      await setDoc(doc(db, 'users', auth.currentUser.uid), {
        uid: auth.currentUser.uid,
        role: 'participant',
        accountStatus: 'active',
        fullName: `${formData.firstName} ${formData.lastName}`.trim(),
        gender: formData.gender,
        email: userEmail,
        collegeDetails: {
          name: formData.college,
          branch: formData.major,
          year: formData.gradYear,
        },
        track: formData.track,
        createdAt: new Date().toISOString()
      });

      navigate('/participant/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to save profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      

<header className="bg-surface/80 dark:bg-surface-dim/80 backdrop-blur-md fixed top-0 w-full border-b border-outline-variant shadow-sm z-50">
<div className="flex justify-between items-center px-gutter py-4 max-w-container-max mx-auto">
<div className="font-headline-md text-headline-md font-bold text-primary flex items-center gap-2">
<span className="material-symbols-outlined text-primary-container" style={{ "fontVariationSettings": "'FILL' 1" }}>terminal</span>
                INNOVATE'26 Auth
            </div>
<div className="hidden md:flex">
<button className="text-secondary hover:text-primary-container transition-colors font-label-md text-label-md px-4 py-2 cursor-pointer active:scale-95 duration-200">
                    Support
                 </button>
</div>
</div>
</header>

<main className="flex-grow pt-[100px] pb-xl px-md md:px-gutter relative overflow-hidden">

<div className="absolute inset-0 bg-pattern opacity-50 z-0 pointer-events-none"></div>
<div className="absolute top-0 right-0 w-1/2 h-[500px] bg-primary-fixed/20 blur-[100px] rounded-full z-0 pointer-events-none"></div>
<div className="max-w-3xl mx-auto relative z-10 w-full">

<div className="mb-lg flex flex-col items-center text-center">
<div className="inline-flex items-center gap-2 bg-primary-fixed text-on-primary-fixed px-4 py-2 rounded-full font-label-md text-label-md mb-md shadow-sm border border-primary-fixed-dim/30">
<span className="material-symbols-outlined text-lg" style={{ "fontVariationSettings": "'FILL' 1" }}>check_circle</span>
                    Step 1 of 1: Profile Confirmation
                </div>
<h1 className="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg mb-sm">Welcome to INNOVATE'26</h1>
<p className="font-body-md text-body-md text-secondary max-w-lg">Please verify your registration details below before accessing the participant dashboard.</p>
</div>

<div className="bg-surface-container-lowest rounded-xl shadow-[0_1px_3px_0_rgba(0,0,0,0.1),0_1px_2px_-1px_rgba(0,0,0,0.1)] border border-surface-variant p-md md:p-xl mb-xl">
<form className="space-y-lg" onSubmit={handleSubmit}>

{error && <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm">{error}</div>}

<div className="space-y-md">
<div className="flex items-center gap-2 mb-md border-b border-surface-variant pb-2">
<span className="material-symbols-outlined text-primary-container" style={{ "fontVariationSettings": "'FILL' 1" }}>person</span>
<h2 className="font-headline-md text-headline-md text-on-surface">Personal Information</h2>
</div>
<div className="grid grid-cols-1 md:grid-cols-2 gap-md">
<div>
<label className="block font-label-md text-label-md text-on-surface-variant mb-xs" htmlFor="firstName">First Name</label>
<input onChange={handleChange} value={formData.firstName} className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-4 py-2 font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 transition-all placeholder:text-outline" id="firstName" name="firstName" required={true} type="text"/>
</div>
<div>
<label className="block font-label-md text-label-md text-on-surface-variant mb-xs" htmlFor="lastName">Last Name</label>
<input onChange={handleChange} value={formData.lastName} className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-4 py-2 font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 transition-all placeholder:text-outline" id="lastName" name="lastName" required={true} type="text"/>
</div>
</div>
<div>
<label className="block font-label-md text-label-md text-on-surface-variant mb-xs" htmlFor="gender">Gender</label>
<select onChange={handleChange} value={formData.gender} className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-4 py-2 font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 transition-all" id="gender" name="gender" required={true}>
<option value="Male">Male</option>
<option value="Female">Female</option>
<option value="Other">Other / Prefer not to say</option>
</select>
</div>
<div>
<label className="block font-label-md text-label-md text-on-surface-variant mb-xs" htmlFor="email">Email Address</label>
<input className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-4 py-2 font-body-md text-body-md text-on-surface-variant focus:outline-none focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 transition-all cursor-not-allowed" disabled={true} id="email" name="email" type="email" value={userEmail}/>
<p className="font-caption text-caption text-secondary mt-1 flex items-center gap-1">
<span className="material-symbols-outlined text-[14px]">info</span>
                                Email address is tied to your registration and cannot be changed here.
                            </p>
</div>
</div>

<div className="space-y-md pt-md">
<div className="flex items-center gap-2 mb-md border-b border-surface-variant pb-2">
<span className="material-symbols-outlined text-primary-container" style={{ "fontVariationSettings": "'FILL' 1" }}>school</span>
<h2 className="font-headline-md text-headline-md text-on-surface">Academic Details</h2>
</div>
<div>
<label className="block font-label-md text-label-md text-on-surface-variant mb-xs" htmlFor="college">University / College</label>
<input onChange={handleChange} value={formData.college} className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-4 py-2 font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 transition-all placeholder:text-outline" id="college" name="college" required={true} type="text"/>
</div>
<div className="grid grid-cols-1 md:grid-cols-2 gap-md">
<div>
<label className="block font-label-md text-label-md text-on-surface-variant mb-xs" htmlFor="major">Major / Field of Study</label>
<input onChange={handleChange} value={formData.major} className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-4 py-2 font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 transition-all placeholder:text-outline" id="major" name="major" type="text" required={true}/>
</div>
<div>
<label className="block font-label-md text-label-md text-on-surface-variant mb-xs" htmlFor="gradYear">Expected Graduation Year</label>
<select onChange={handleChange} value={formData.gradYear} className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-4 py-2 font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 transition-all" id="gradYear" name="gradYear">
<option value="2024">2024</option>
<option value="2025">2025</option>
<option value="2026">2026</option>
<option value="2027">2027</option>
<option value="2028+">2028+</option>
</select>
</div>
</div>
</div>

<div className="space-y-md pt-md">
<div className="flex items-center gap-2 mb-md border-b border-surface-variant pb-2">
<span className="material-symbols-outlined text-primary-container" style={{ "fontVariationSettings": "'FILL' 1" }}>code</span>
<h2 className="font-headline-md text-headline-md text-on-surface">Hackathon Preferences</h2>
</div>
<div>
<label className="block font-label-md text-label-md text-on-surface-variant mb-xs">Primary Track Interest (Optional)</label>
<div className="flex flex-wrap gap-2 mt-2">
<label className="cursor-pointer relative">
<input checked={formData.track === 'ai'} onChange={handleTrackChange} className="peer sr-only" name="track" type="radio" value="ai"/>
<div className="px-4 py-2 rounded-full border border-outline-variant bg-surface-container-lowest text-on-surface-variant font-label-md text-label-md peer-checked:bg-primary peer-checked:text-white peer-checked:border-primary hover:bg-surface-container-low transition-colors">
                                         AI / Machine Learning
                                     </div>
</label>
<label className="cursor-pointer relative">
<input checked={formData.track === 'web3'} onChange={handleTrackChange} className="peer sr-only" name="track" type="radio" value="web3"/>
<div className="px-4 py-2 rounded-full border border-outline-variant bg-surface-container-lowest text-on-surface-variant font-label-md text-label-md peer-checked:bg-primary peer-checked:text-white peer-checked:border-primary hover:bg-surface-container-low transition-colors">
                                         Web3 &amp; Blockchain
                                     </div>
</label>
<label className="cursor-pointer relative">
<input checked={formData.track === 'health'} onChange={handleTrackChange} className="peer sr-only" name="track" type="radio" value="health"/>
<div className="px-4 py-2 rounded-full border border-outline-variant bg-surface-container-lowest text-on-surface-variant font-label-md text-label-md peer-checked:bg-primary peer-checked:text-white peer-checked:border-primary hover:bg-surface-container-low transition-colors">
                                         HealthTech
                                     </div>
</label>
</div>
</div>
</div>

<div className="pt-lg flex flex-col sm:flex-row gap-4 items-center justify-between border-t border-surface-variant mt-lg">
<p className="font-caption text-caption text-secondary">
                            By continuing, you agree to our <a className="text-primary hover:underline" href="#">Terms</a> and <a className="text-primary hover:underline" href="#">Privacy Policy</a>.
                        </p>
<button 
  disabled={loading || !isFormValid} 
  className={`w-full sm:w-auto font-label-md text-label-md px-8 py-3 rounded-lg shadow-[0_1px_3px_0_rgba(0,0,0,0.1)] transition-all flex items-center justify-center gap-2 group ${isFormValid ? 'bg-primary text-white hover:bg-primary/90 active:scale-95 hover:shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1)]' : 'bg-surface-variant text-on-surface-variant opacity-50 cursor-not-allowed'}`} 
  type="submit"
>
                            {loading ? 'Saving Profile...' : 'Continue to Participant Dashboard'}
                            <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
</button>
</div>
</form>
</div>
</div>
</main>

<footer className="bg-surface-container-low dark:bg-surface-container-lowest w-full py-8 mt-auto border-t border-outline-variant">
<div className="flex flex-col md:flex-row justify-between items-center px-gutter gap-4 max-w-container-max mx-auto">
<div className="font-label-md text-label-md uppercase tracking-widest text-on-surface-variant">
                INNOVATE'26 Auth
            </div>
<div className="flex gap-4 items-center">
<a className="font-caption text-caption text-on-surface-variant hover:text-primary dark:hover:text-primary-fixed transition-all" href="#">Privacy Policy</a>
<a className="font-caption text-caption text-on-surface-variant hover:text-primary dark:hover:text-primary-fixed transition-all" href="#">Terms of Service</a>
<a className="font-caption text-caption text-on-surface-variant hover:text-primary dark:hover:text-primary-fixed transition-all" href="#">Contact Organizer</a>
</div>
<div className="font-caption text-caption text-secondary dark:text-secondary-fixed-dim">
                © 2024 INNOVATE'26 Department of Computer Engineering, T.M.E's J.T.M. College of Engineering, Faizpur. Built for innovators.
            </div>
</div>
</footer>

    </>
  );
}
