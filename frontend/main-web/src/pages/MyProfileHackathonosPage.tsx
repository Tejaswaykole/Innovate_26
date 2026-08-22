import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ParticipantSidebar from '../components/ParticipantSidebar';
import { useAuth } from '../contexts/AuthContext';
import { useCurrentTeam } from '../hooks/useCurrentTeam';
import PageTransitionWrapper from '../components/PageTransitionWrapper';
import { motion } from 'framer-motion';

export default function Component() {
  const navigate = useNavigate();
  const { currentUser, profile: userData, loading } = useAuth();
  const { team, loading: teamLoading } = useCurrentTeam();

  useEffect(() => {
    if (!loading && !currentUser) {
      navigate('/login');
    }
  }, [currentUser, loading, navigate]);

  return (
    <>
      

<nav className="fixed top-0 w-full z-50 flex justify-between items-center px-6 h-16 bg-surface-container-lowest dark:bg-surface-container-lowest border-b border-outline-variant shadow-sm hidden md:flex">
<div className="flex items-center gap-4">
<span className="font-headline-md text-headline-md font-bold text-primary dark:text-primary-fixed-dim">INNOVATIVE'26 Portal</span>
</div>
<div className="flex items-center gap-4">
<span className="material-symbols-outlined text-on-surface-variant cursor-pointer active:scale-95 hover:bg-surface-container-low transition-colors p-2 rounded-full" data-icon="notifications">notifications</span>
<span className="material-symbols-outlined text-on-surface-variant cursor-pointer active:scale-95 hover:bg-surface-container-low transition-colors p-2 rounded-full" data-icon="settings">settings</span>
<div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container font-label-md text-label-md cursor-pointer ml-2">
  {userData?.fullName ? userData.fullName.charAt(0).toUpperCase() : 'U'}
</div>
</div>
</nav>

<ParticipantSidebar activeTab="profile" />

<main className="flex-1 md:ml-64 px-6 pb-6 pt-24 lg:px-8 lg:pb-8 lg:pt-28 overflow-x-hidden overflow-y-auto">
<PageTransitionWrapper>
<div className="max-w-container-max mx-auto w-full">

<header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
<div>
<h1 className="font-headline-lg text-headline-lg md:text-headline-lg text-on-surface">My Profile</h1>
<p className="font-body-md text-body-md text-on-surface-variant mt-1">Manage your personal and academic information for the hackathon.</p>
</div>
<button className="bg-primary-container text-on-primary-container hover:bg-primary-container/90 px-6 py-2.5 rounded-lg font-label-md text-label-md flex items-center gap-2 transition-colors shadow-sm self-start sm:self-auto">
<span className="material-symbols-outlined text-[18px]">edit</span> Edit Profile
                </button>
</header>

<div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

<div className="lg:col-span-4 flex flex-col gap-6">
<motion.div 
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.4, type: 'spring' }}
    className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm p-6 flex flex-col items-center text-center hover:shadow-md transition-shadow"
>
<div className="relative w-32 h-32 rounded-full bg-primary-container border-4 border-surface-container-lowest shadow-md flex items-center justify-center mb-4">
  <span className="font-headline-lg text-[48px] text-on-primary-container">
    {userData?.fullName ? userData.fullName.charAt(0).toUpperCase() : 'U'}
  </span>
<button className="absolute bottom-0 right-0 bg-primary-container text-on-primary-container rounded-full p-1.5 shadow-sm transform translate-x-1/4 translate-y-1/4 hover:bg-primary transition-colors">
<span className="material-symbols-outlined text-[16px]">photo_camera</span>
</button>
</div>
<h2 className="font-headline-md text-headline-md text-on-surface">{userData?.fullName || 'Participant Name'}</h2>
<p className="font-label-md text-label-md text-primary mt-1">{userData?.collegeDetails?.branch || 'Major'} Major</p>
<div className="flex flex-wrap justify-center gap-2 mt-4">
<span className="px-3 py-1 bg-secondary-container text-on-secondary-container rounded-full font-caption text-caption">Frontend</span>
<span className="px-3 py-1 bg-secondary-container text-on-secondary-container rounded-full font-caption text-caption">UI/UX</span>
<span className="px-3 py-1 bg-secondary-container text-on-secondary-container rounded-full font-caption text-caption">React</span>
</div>
</motion.div>

<motion.div 
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.4, type: 'spring', delay: 0.1 }}
    className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm p-6 hover:shadow-md transition-shadow"
>
<h3 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-4 flex items-center gap-2">
<span className="material-symbols-outlined text-[18px]">group</span> Team Status
                        </h3>
{teamLoading ? (
<div className="flex items-center justify-center py-4">
<span className="material-symbols-outlined animate-spin text-primary">sync</span>
<span className="ml-2 font-label-md text-on-surface-variant">Loading...</span>
</div>
) : team ? (
<div className="flex items-center gap-4">
<div className="w-12 h-12 rounded-lg bg-tertiary-container text-on-tertiary-container flex items-center justify-center font-bold text-lg">
{team.teamName ? team.teamName.charAt(0).toUpperCase() : 'T'}
</div>
<div>
<p className="font-label-md text-label-md text-on-surface">{team.teamName}</p>
<p className="font-caption text-caption text-on-surface-variant">{team.members ? team.members.length : 1}/6 Members</p>
</div>
<span className="ml-auto px-2 py-1 bg-primary-fixed text-on-primary-fixed rounded text-[10px] font-bold uppercase tracking-wide">
{team.leaderId === currentUser?.uid ? 'Leader' : 'Member'}
</span>
</div>
) : (
<div className="flex flex-col items-center justify-center py-4 text-center">
<span className="material-symbols-outlined text-outline mb-2 text-[32px]">group_off</span>
<p className="font-label-md text-label-md text-on-surface">No Team</p>
</div>
)}
</motion.div>
</div>

<motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.2 }}
    className="lg:col-span-8 flex flex-col gap-6"
>

<section className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm overflow-hidden">
<div className="border-b border-outline-variant px-6 py-4 bg-surface-bright/50">
<h2 className="font-headline-md text-headline-md text-on-surface text-[20px] flex items-center gap-2">
<span className="material-symbols-outlined text-primary">person_check</span> Personal Details
                            </h2>
</div>
<div className="p-6">
<div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">

<div>
<label className="block font-label-md text-label-md text-on-surface-variant mb-2">Full Name</label>
<div className="w-full px-4 py-2.5 bg-surface-container-low border border-outline-variant rounded-lg font-body-md text-body-md text-on-surface flex items-center gap-2">
                                        {userData?.fullName || 'N/A'}
                                    </div>
</div>

<div>
<label className="block font-label-md text-label-md text-on-surface-variant mb-2">Mobile Number</label>
<div className="w-full px-4 py-2.5 bg-surface-container-low border border-outline-variant rounded-lg font-body-md text-body-md text-on-surface flex items-center justify-between">
<span>{userData?.mobile || 'N/A'}</span>
{userData?.mobile && <span className="material-symbols-outlined text-primary text-[18px]">verified</span>}
</div>
</div>

<div>
<label className="block font-label-md text-label-md text-on-surface-variant mb-2">Gender</label>
<div className="w-full px-4 py-2.5 bg-surface-container-low border border-outline-variant rounded-lg font-body-md text-body-md text-on-surface flex items-center justify-between">
<span>{userData?.gender || 'N/A'}</span>
</div>
</div>

<div className="md:col-span-2">
<label className="block font-label-md text-label-md text-on-surface-variant mb-2">Primary Email</label>
<div className="w-full px-4 py-2.5 bg-primary-container/10 border border-primary/30 rounded-lg font-body-md text-body-md text-primary font-medium flex items-center gap-3 shadow-inner">
<span className="material-symbols-outlined text-primary">mail</span>
                                        {userData?.email || 'N/A'}
                                        <span className="ml-auto text-xs bg-primary text-on-primary px-2 py-0.5 rounded-full uppercase tracking-wider">Primary</span>
</div>
</div>
</div>
</div>
</section>

<section className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm overflow-hidden">
<div className="border-b border-outline-variant px-6 py-4 bg-surface-bright/50">
<h2 className="font-headline-md text-headline-md text-on-surface text-[20px] flex items-center gap-2">
<span className="material-symbols-outlined text-primary">school</span> College Details
                            </h2>
</div>
<div className="p-6">
<div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">

<div className="md:col-span-2">
<label className="block font-label-md text-label-md text-on-surface-variant mb-2">Institution / College</label>
<div className="w-full px-4 py-2.5 bg-surface-container-low border border-outline-variant rounded-lg font-body-md text-body-md text-on-surface">
                                        {userData?.collegeDetails?.name || 'N/A'}
                                    </div>
</div>

<div>
<label className="block font-label-md text-label-md text-on-surface-variant mb-2">Branch / Major</label>
<div className="w-full px-4 py-2.5 bg-surface-container-low border border-outline-variant rounded-lg font-body-md text-body-md text-on-surface">
                                        {userData?.collegeDetails?.branch || 'N/A'}
                                    </div>
</div>

<div>
<label className="block font-label-md text-label-md text-on-surface-variant mb-2">Student ID</label>
<div className="w-full px-4 py-2.5 bg-surface-container-low border border-outline-variant rounded-lg font-body-md text-body-md text-on-surface font-mono text-sm flex justify-between items-center">
                                        {userData?.collegeDetails?.rollNumber || 'N/A'}
                                        <span className="material-symbols-outlined text-on-surface-variant text-[16px] cursor-pointer hover:text-primary">content_copy</span>
</div>
</div>

<div>
<label className="block font-label-md text-label-md text-on-surface-variant mb-2">Academic Year</label>
<div className="w-full px-4 py-2.5 bg-surface-container-low border border-outline-variant rounded-lg font-body-md text-body-md text-on-surface">
                                        {userData?.collegeDetails?.year || 'N/A'}
                                    </div>
</div>

<div>
<label className="block font-label-md text-label-md text-on-surface-variant mb-2">Current Semester</label>
<div className="w-full px-4 py-2.5 bg-surface-container-low border border-outline-variant rounded-lg font-body-md text-body-md text-on-surface">
                                        {userData?.collegeDetails?.semester || 'N/A'}
                                    </div>
</div>
</div>
</div>
</section>
</motion.div>
</div>
</div>
</PageTransitionWrapper>
</main>

<nav className="fixed bottom-0 w-full md:hidden bg-surface-container-lowest border-t border-outline-variant shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-50 flex justify-around items-center h-16 pb-safe">
<a className="flex flex-col items-center gap-1 text-on-surface-variant p-2" href="#">
<span className="material-symbols-outlined text-[24px]" data-icon="dashboard">dashboard</span>
<span className="font-caption text-[10px]">Dashboard</span>
</a>
<a className="flex flex-col items-center gap-1 text-primary p-2" href="#">
<div className="bg-primary-container/20 px-4 py-0.5 rounded-full">
<span className="material-symbols-outlined text-[24px]" data-icon="person" data-weight="fill">person</span>
</div>
<span className="font-caption text-[10px] font-bold">Profile</span>
</a>
<a className="flex flex-col items-center gap-1 text-on-surface-variant p-2" href="#">
<span className="material-symbols-outlined text-[24px]" data-icon="groups">groups</span>
<span className="font-caption text-[10px]">Team</span>
</a>
<a className="flex flex-col items-center gap-1 text-on-surface-variant p-2" href="#">
<span className="material-symbols-outlined text-[24px]" data-icon="lock">lock</span>
<span className="font-caption text-[10px]">Submit</span>
</a>
</nav>

    </>
  );
}
