// @ts-nocheck
import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ParticipantSidebar from '../components/ParticipantSidebar';
import { useHackathon } from '../contexts/HackathonContext';
import { useAuth } from '../contexts/AuthContext';
import { useCurrentTeam } from '../hooks/useCurrentTeam';
import { motion } from 'framer-motion';
import PageTransitionWrapper from '../components/PageTransitionWrapper';
import { removeMember } from '../services/teamService';
import { useState } from 'react';

export default function Component() {
  const navigate = useNavigate();
  const { currentUser, profile, loading } = useAuth();
  const { hackathonName, config } = useHackathon();
  const { team, loading: teamLoading } = useCurrentTeam();
  const userName = profile?.fullName || currentUser?.displayName || 'Participant';
  const [removingId, setRemovingId] = useState<string | null>(null);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'TBA';
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { 
      month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  let currentStage = config?.currentTimelineStage || 1;
  let progressWidth = `${currentStage * 20}%`;

  const handleRemoveMember = async (memberId: string) => {
    if (!team?.id || !window.confirm('Are you sure you want to remove this member?')) return;
    try {
      setRemovingId(memberId);
      await removeMember(team.id, memberId);
    } catch (err: any) {
      alert(err.message || 'Failed to remove member');
    } finally {
      setRemovingId(null);
    }
  };

  useEffect(() => {
    if (!loading && !currentUser) {
      navigate('/login');
    }
  }, [currentUser, loading, navigate]);

  return (
    <>
      

<nav className="fixed top-0 w-full z-50 flex justify-between items-center px-6 h-16 bg-surface-container-lowest border-b border-outline-variant shadow-sm transition-all duration-300">
<div className="flex items-center gap-md">
<img src="/logo.png" alt="Innovative'26 Logo" className="h-8 object-contain" />
<span className="font-headline-md text-headline-md font-bold text-primary">{hackathonName} Portal</span>
</div>
<div className="flex items-center gap-lg">
<div className="hidden"></div> 
<div className="flex gap-sm">
<button className="p-2 rounded-full hover:bg-surface-container-low transition-colors cursor-pointer active:scale-95 text-on-surface-variant flex items-center justify-center">
<span className="material-symbols-outlined" data-icon="notifications">notifications</span>
</button>
<button className="p-2 rounded-full hover:bg-surface-container-low transition-colors cursor-pointer active:scale-95 text-on-surface-variant flex items-center justify-center">
<span className="material-symbols-outlined" data-icon="settings">settings</span>
</button>
</div>
<div className="w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-label-md text-label-md border-2 border-outline-variant cursor-pointer hover:border-primary transition-colors">
  {userName ? userName.charAt(0).toUpperCase() : 'U'}
</div>
</div>
</nav>

<div className="flex pt-16 min-h-screen">

<ParticipantSidebar activeTab="dashboard" />

<main className="flex-1 md:ml-64 p-lg max-w-container-max mx-auto overflow-x-hidden overflow-y-auto">
<PageTransitionWrapper>
<header className="mb-xl flex flex-col md:flex-row justify-between items-start md:items-end gap-md">
<div>
<h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-background mb-xs">Welcome back{userName ? `, ${userName}` : ''}</h1>
<p className="font-body-md text-body-md text-on-surface-variant">Here's your dashboard for {hackathonName}. Let's build something amazing.</p>
</div>
<div className="flex items-center gap-sm bg-surface-container p-sm rounded-full">
<div className="w-2 h-2 rounded-full bg-tertiary animate-pulse"></div>
<span className="font-caption text-caption text-on-surface-variant mr-xs">Event Status:</span>
<span className="font-label-md text-label-md text-tertiary">{config?.status || 'Unknown'}</span>
</div>
</header>

<div className="grid grid-cols-1 md:grid-cols-12 gap-lg auto-rows-min">
<motion.section 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay: 0.1 }}
    className="col-span-1 md:col-span-12 bg-surface-container-lowest rounded-xl border border-outline-variant p-lg shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-300 mb-lg"
>
<div className="flex justify-between items-center mb-md">
<h2 className="font-headline-md text-headline-md text-on-background flex items-center gap-sm">
<span className="material-symbols-outlined text-primary">route</span>
                            Hackathon Progress
                        </h2>
  <span className="font-caption text-caption bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full">
    Stage {currentStage} of 5
  </span>
  </div>
  <div className="relative pt-xl pb-16 px-sm mt-8">
  <div className="absolute top-1/2 left-sm right-sm h-1.5 bg-surface-container-highest -translate-y-1/2 z-0 rounded-full overflow-hidden">
      <motion.div 
          initial={{ width: 0 }}
          animate={{ width: progressWidth }}
          transition={{ duration: 1.5, ease: 'easeOut', delay: 0.2 }}
          className="h-full bg-gradient-to-r from-primary to-primary-fixed rounded-full"
      ></motion.div>
  </div>
  <div className="relative z-10 flex justify-between">
    {/* Stage 1 */}
    <motion.div 
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, type: 'spring' }}
        className="flex flex-col items-center gap-sm relative group cursor-pointer"
    >
      {currentStage === 1 && <div className="absolute -inset-2 bg-primary/20 rounded-full blur-md opacity-100 transition-opacity"></div>}
      <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 border-surface-container-lowest shadow-lg relative z-10 ${currentStage >= 1 ? 'bg-primary text-on-primary ring-4 ring-primary/30' : 'bg-surface-container-high text-on-surface-variant'}`}>
        <span className="material-symbols-outlined text-[20px]">groups</span>
      </div>
      <div className="absolute top-14 flex flex-col items-center w-32 text-center">
        <span className={`font-label-md text-label-md mt-1 ${currentStage >= 1 ? 'text-primary font-bold' : 'text-on-surface-variant'}`}>Registration</span>
        <span className="text-xs text-on-surface-variant mt-1 hidden sm:block">{formatDate(config?.registrationDeadline ?? null)}</span>
        {currentStage === 1 && <span className="text-[10px] uppercase tracking-wider text-primary font-bold mt-2">Current</span>}
      </div>
    </motion.div>

    {/* Stage 2 */}
    <motion.div 
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.4, type: 'spring' }}
        className="flex flex-col items-center gap-sm relative group cursor-pointer"
    >
      {currentStage === 2 && <div className="absolute -inset-2 bg-primary/20 rounded-full blur-md opacity-100 transition-opacity"></div>}
      <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 border-surface-container-lowest shadow-lg relative z-10 ${currentStage >= 2 ? 'bg-primary text-on-primary ring-4 ring-primary/30' : 'bg-surface-container-high text-on-surface-variant'}`}>
        <span className="material-symbols-outlined text-[20px]">person_add</span>
      </div>
      <div className="absolute top-14 flex flex-col items-center w-32 text-center">
        <span className={`font-label-md text-label-md mt-1 hidden sm:block ${currentStage >= 2 ? 'text-primary font-bold' : 'text-on-surface-variant'}`}>Team Formation</span>
        <span className="text-xs text-on-surface-variant mt-1 hidden sm:block">{formatDate(config?.teamFormationDate ?? null)}</span>
        {currentStage === 2 && <span className="text-[10px] uppercase tracking-wider text-primary font-bold mt-2">Current</span>}
      </div>
    </motion.div>

    {/* Stage 3 */}
    <motion.div 
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5, type: 'spring' }}
        className="flex flex-col items-center gap-sm relative group cursor-pointer"
    >
      {currentStage === 3 && <div className="absolute -inset-2 bg-primary/20 rounded-full blur-md opacity-100 transition-opacity"></div>}
      <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 border-surface-container-lowest shadow-lg relative z-10 ${currentStage >= 3 ? 'bg-primary text-on-primary ring-4 ring-primary/30' : 'bg-surface-container-high text-on-surface-variant'}`}>
        <span className="material-symbols-outlined text-[20px]">code</span>
      </div>
      <div className="absolute top-14 flex flex-col items-center w-32 text-center">
        <span className={`font-label-md text-label-md mt-1 hidden sm:block ${currentStage >= 3 ? 'text-primary font-bold' : 'text-on-surface-variant'}`}>Hacking Begins</span>
        <span className="text-xs text-on-surface-variant mt-1 hidden sm:block">{formatDate(config?.hackingBeginsDate ?? null)}</span>
        {currentStage === 3 && <span className="text-[10px] uppercase tracking-wider text-primary font-bold mt-2">Current</span>}
      </div>
    </motion.div>

    {/* Stage 4 */}
    <motion.div 
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.7, type: 'spring' }}
        className="flex flex-col items-center gap-sm relative group cursor-pointer"
    >
      {currentStage === 4 && <div className="absolute -inset-2 bg-primary/20 rounded-full blur-md opacity-100 transition-opacity"></div>}
      <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 border-surface-container-lowest shadow-lg relative z-10 ${currentStage >= 4 ? 'bg-primary text-on-primary ring-4 ring-primary/30' : 'bg-surface-container-high text-on-surface-variant'}`}>
        <span className="material-symbols-outlined text-[20px]">upload_file</span>
      </div>
      <div className="absolute top-14 flex flex-col items-center w-32 text-center">
        <span className={`font-label-md text-label-md mt-1 hidden sm:block ${currentStage >= 4 ? 'text-primary font-bold' : 'text-on-surface-variant'}`}>Submission</span>
        <span className="text-xs text-on-surface-variant mt-1 hidden sm:block">{formatDate(config?.submissionDeadline ?? null)}</span>
        {currentStage === 4 && <span className="text-[10px] uppercase tracking-wider text-primary font-bold mt-2">Current</span>}
      </div>
    </motion.div>

    {/* Stage 5 */}
    <motion.div 
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.9, type: 'spring' }}
        className="flex flex-col items-center gap-sm relative group cursor-pointer"
    >
      {currentStage === 5 && <div className="absolute -inset-2 bg-primary/20 rounded-full blur-md opacity-100 transition-opacity"></div>}
      <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 border-surface-container-lowest shadow-lg relative z-10 ${currentStage >= 5 ? 'bg-primary text-on-primary ring-4 ring-primary/30' : 'bg-surface-container-high text-on-surface-variant'}`}>
        <span className="material-symbols-outlined text-[20px]">emoji_events</span>
      </div>
      <div className="absolute top-14 flex flex-col items-center w-32 text-center">
        <span className={`font-label-md text-label-md mt-1 hidden sm:block ${currentStage >= 5 ? 'text-primary font-bold' : 'text-on-surface-variant'}`}>Ceremony</span>
        <span className="text-xs text-on-surface-variant mt-1 hidden sm:block">{formatDate(config?.ceremonyDate ?? null)}</span>
        {currentStage === 5 && <span className="text-[10px] uppercase tracking-wider text-primary font-bold mt-2">Current</span>}
      </div>
    </motion.div>
  </div>
  </div>
  </motion.section>

<motion.section 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay: 0.2 }}
    className="col-span-1 md:col-span-8 bg-surface-container-lowest rounded-xl border border-outline-variant p-lg shadow-sm flex flex-col justify-between relative overflow-hidden group hover:-translate-y-1 hover:shadow-md transition-all duration-300 mb-lg md:mb-0"
>

<div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary-fixed/30 to-transparent rounded-bl-full -z-0 opacity-50"></div>
<div className="relative z-10 flex-1">
<div className="flex justify-between items-start mb-md">
<h2 className="font-headline-md text-headline-md text-on-background flex items-center gap-sm">
<span className="material-symbols-outlined text-primary">engineering</span>
                                Team Status
                            </h2>
{teamLoading ? (
<span className="bg-surface-variant text-on-surface-variant font-label-md text-label-md px-3 py-1 rounded-full flex items-center gap-xs">
<span className="material-symbols-outlined text-[16px] animate-spin">sync</span>
                                Loading...
                            </span>
) : team ? (
<span className="bg-primary-container text-on-primary-container font-label-md text-label-md px-3 py-1 rounded-full flex items-center gap-xs">
<span className="material-symbols-outlined text-[16px]">check_circle</span>
                                {team.teamName || 'Active Team'}
                            </span>
) : (
<span className="bg-error-container text-on-error-container font-label-md text-label-md px-3 py-1 rounded-full flex items-center gap-xs">
<span className="material-symbols-outlined text-[16px]">warning</span>
                                No Team
                            </span>
)}
</div>

{teamLoading ? (
<div className="py-xl flex flex-col items-center justify-center text-center">
<div className="w-20 h-20 bg-surface-container-high rounded-full flex items-center justify-center mb-md text-outline animate-pulse">
<span className="material-symbols-outlined text-[40px]">hourglass_empty</span>
</div>
<h3 className="font-headline-md text-headline-md text-on-background mb-xs">Loading team data...</h3>
</div>
) : team ? (
<div className="py-md flex flex-col justify-center">
<div className="flex items-center gap-4 mb-lg">
<div className="w-16 h-16 bg-primary text-on-primary rounded-xl flex items-center justify-center text-2xl font-bold shadow-sm">
{team.teamName ? team.teamName.charAt(0).toUpperCase() : 'T'}
</div>
<div>
<h3 className="font-headline-md text-headline-md text-on-background">{team.teamName}</h3>
<p className="font-body-md text-body-md text-on-surface-variant flex items-center gap-2">
<span className="material-symbols-outlined text-[16px]">groups</span>
{team.members ? team.members.length : 1}/6 Members
</p>
</div>
</div>
<div className="bg-surface-container rounded-lg p-md mb-md border border-outline-variant/50 flex justify-between items-center">
<div>
<p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-1">Your Role</p>
<p className="font-body-lg text-body-lg text-on-surface font-medium capitalize">{team.leaderId === currentUser?.uid ? 'Leader' : 'Member'}</p>
</div>
<div className="text-right">
<p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-1">Team Code</p>
<p className="font-body-lg text-body-lg text-primary font-mono font-bold tracking-widest">{team.teamCode || '---'}</p>
</div>
</div>

<div className="mt-6">
  <h4 className="font-label-lg text-label-lg text-on-surface mb-3 flex items-center gap-2">
    <span className="material-symbols-outlined text-[18px]">group</span>
    Team Members
  </h4>
  <div className="flex flex-col gap-2">
    {team.members?.map((member: any) => {
      const isLeader = member.teamRole === 'leader' || member.uid === team.leaderId;
      const isCurrentUser = member.uid === currentUser?.uid;
      const amILeader = team.leaderId === currentUser?.uid;
      const canRemove = amILeader && !isLeader;

      return (
        <div key={member.uid} className="bg-white border border-outline-variant rounded-lg p-3 flex justify-between items-center hover:bg-surface-container-lowest transition-colors">
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${isLeader ? 'bg-secondary text-white' : 'bg-surface-variant text-on-surface-variant'}`}>
              {member.fullName?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div>
              <p className="font-label-md text-label-md text-on-surface">
                {member.fullName}
                {isCurrentUser && <span className="ml-2 text-xs text-secondary">(You)</span>}
              </p>
              <p className="font-caption text-caption text-on-surface-variant capitalize">{member.teamRole || 'Member'}</p>
            </div>
          </div>
          {canRemove && (
            <button
              onClick={() => handleRemoveMember(member.uid)}
              disabled={removingId === member.uid}
              className="text-error hover:bg-error-container hover:text-on-error-container p-2 rounded-full transition-colors flex items-center justify-center disabled:opacity-50"
              title="Remove Member"
            >
              <span className="material-symbols-outlined text-[18px]">
                {removingId === member.uid ? 'hourglass_empty' : 'person_remove'}
              </span>
            </button>
          )}
        </div>
      );
    })}
  </div>
</div>
</div>
) : (
<div className="py-xl flex flex-col items-center justify-center text-center">
<div className="w-20 h-20 bg-surface-container-high rounded-full flex items-center justify-center mb-md text-outline">
<span className="material-symbols-outlined text-[40px]">group_add</span>
</div>
<h3 className="font-headline-md text-headline-md text-on-background mb-xs">You are flying solo</h3>
<p className="font-body-md text-body-md text-on-surface-variant max-w-md mx-auto">{hackathonName} requires teams of 2-4 members to compete. Join an existing team or create your own to unlock the Problem Statement phase.</p>
</div>
)}
</div>

<div className="pt-md border-t border-outline-variant flex flex-wrap gap-sm">
{team ? (
<Link to="/participant/team" className="flex items-center gap-xs px-lg py-sm bg-primary text-on-primary font-label-md text-label-md rounded-lg hover:bg-primary-fixed-variant transition-colors shadow-sm w-full md:w-auto justify-center">
<span className="material-symbols-outlined text-[18px]">manage_accounts</span>
                                    Manage Team
                                </Link>
) : (
<>
<Link to="/participant/team/create" className="flex items-center gap-xs px-lg py-sm bg-primary text-on-primary font-label-md text-label-md rounded-lg hover:bg-primary-fixed-variant transition-colors shadow-sm">
<span className="material-symbols-outlined text-[18px]">add_circle</span>
                                        Create Team
                                    </Link>
<Link to="/participant/team/join" className="flex items-center gap-xs px-lg py-sm bg-surface-container-lowest border border-outline text-on-surface font-label-md text-label-md rounded-lg hover:bg-surface-container-low transition-colors">
<span className="material-symbols-outlined text-[18px]">person_add</span>
                                        Join Team
                                    </Link>
<Link to="/participant/team/browse" className="flex items-center gap-xs px-lg py-sm text-primary font-label-md text-label-md rounded-lg hover:bg-primary-container/50 transition-colors ml-auto">
<span className="material-symbols-outlined text-[18px]">search</span>
                                        Browse Teams
                                    </Link>
</>
)}
</div>
</motion.section>

<motion.section 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay: 0.3 }}
    className="col-span-1 md:col-span-4 bg-surface-container-lowest rounded-xl border border-outline-variant p-lg shadow-sm flex flex-col hover:-translate-y-1 hover:shadow-md transition-all duration-300"
>
<div className="flex justify-between items-center mb-md pb-sm border-b border-outline-variant">
<h2 className="font-headline-md text-headline-md text-on-background flex items-center gap-sm">
<span className="material-symbols-outlined text-tertiary">campaign</span>
                            Announcements
                        </h2>
<button className="text-primary hover:text-primary-container transition-colors p-1 rounded-full hover:bg-primary-fixed">
<span className="material-symbols-outlined text-[20px]">more_horiz</span>
</button>
</div>
<div className="flex flex-col gap-md flex-1 overflow-y-auto">

<div className="flex gap-sm p-sm rounded-lg hover:bg-surface-container-low transition-colors cursor-pointer border border-transparent hover:border-outline-variant">
<div className="w-2 h-2 rounded-full bg-tertiary mt-2 flex-shrink-0"></div>
<div>
<h4 className="font-label-md text-label-md text-on-surface mb-xs">Welcome to {hackathonName}!</h4>
<p className="font-caption text-caption text-on-surface-variant line-clamp-2">The portal is now open. Please finalize your teams by Friday 5:00 PM PST. The problem statements will be revealed shortly after.</p>
<span className="font-caption text-caption text-outline mt-1 block">2 hours ago</span>
</div>
</div>

<div className="flex gap-sm p-sm rounded-lg hover:bg-surface-container-low transition-colors cursor-pointer border border-transparent hover:border-outline-variant">
<div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
<div>
<h4 className="font-label-md text-label-md text-on-surface mb-xs">API Keys Distributed</h4>
<p className="font-caption text-caption text-on-surface-variant line-clamp-2">Sponsor API keys have been generated. Once your team is formed, the team leader can access them in the Team settings.</p>
<span className="font-caption text-caption text-outline mt-1 block">5 hours ago</span>
</div>
</div>

<div className="flex gap-sm p-sm rounded-lg hover:bg-surface-container-low transition-colors cursor-pointer border border-transparent hover:border-outline-variant">
<div className="w-2 h-2 rounded-full bg-outline mt-2 flex-shrink-0"></div>
<div>
<h4 className="font-label-md text-label-md text-on-surface mb-xs">Discord Server Live</h4>
<p className="font-caption text-caption text-on-surface-variant line-clamp-2">Join our official Discord server for real-time support, networking, and memes.</p>
<span className="font-caption text-caption text-outline mt-1 block">1 day ago</span>
</div>
</div>
</div>
<button className="mt-auto pt-md text-primary font-label-md text-label-md text-center w-full hover:underline decoration-2 underline-offset-4">
                        View All Announcements
                    </button>
</motion.section>
</div>
</PageTransitionWrapper>
</main>
</div>


    </>
  );
}
