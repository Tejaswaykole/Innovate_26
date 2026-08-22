import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ParticipantSidebar from '../components/ParticipantSidebar';
import { useAuth } from '../contexts/AuthContext';
import { useCurrentTeam } from '../hooks/useCurrentTeam';
import { createTeam, submitJoinRequest, deleteTeam, acceptJoinRequest, rejectJoinRequest, removeMember } from '../services/teamService';
import PageTransitionWrapper from '../components/PageTransitionWrapper';
import { motion, AnimatePresence } from 'framer-motion';

const NoTeamView = () => {
    const [teamName, setTeamName] = useState('');
    const [teamCode, setTeamCode] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const [isJoining, setIsJoining] = useState(false);
    const [error, setError] = useState('');

    const handleCreateTeam = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!teamName.trim()) {
            setError('Team name cannot be empty.');
            return;
        }
        setIsCreating(true);
        setError('');
        try {
            await createTeam(teamName);
        } catch (err: any) {
            setError(err.message || 'Failed to create team. Please try again.');
        } finally {
            setIsCreating(false);
        }
    };

    const handleJoinTeam = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!teamCode.trim()) {
            setError('Team code cannot be empty.');
            return;
        }
        setIsJoining(true);
        setError('');
        try {
            await submitJoinRequest(teamCode);
            // On success, backend adds a join request. The UI should show success.
            // Since we aren't automatically joined, we might need a success message.
            setError('');
            alert('Join request sent successfully! Waiting for leader approval.');
            setTeamCode('');
        } catch (err: any) {
            let msg = err.message || 'Failed to join team.';
            if (msg.includes('already belong to a team')) msg = 'You already belong to a team.';
            if (msg.includes('Invalid team code')) msg = 'Invalid team code. Please check and try again.';
            if (msg.includes('Already requested to join')) msg = 'You have already requested to join this team.';
            setError(msg);
        } finally {
            setIsJoining(false);
        }
    };

    return (
        <div className="max-w-container-max mx-auto space-y-lg">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-md pb-md border-b border-outline-variant">
                <div>
                    <h1 className="font-display-lg text-display-lg text-on-surface mb-xs">Team Selection</h1>
                    <p className="font-body-lg text-body-lg text-on-surface-variant">Create a new team or join an existing one to participate.</p>
                </div>
            </div>

            {error && (
                <div className="p-sm bg-error-container/30 border border-error-container rounded-lg">
                    <p className="font-label-md text-label-md text-error flex items-center gap-xs">
                        <span className="material-symbols-outlined text-[16px]">error</span>
                        {error}
                    </p>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
                {/* Create Team Card */}
                <section className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm p-lg">
                    <div className="flex items-center gap-sm mb-md pb-sm border-b border-outline-variant">
                        <div className="w-10 h-10 rounded-lg bg-primary-container text-on-primary-container flex items-center justify-center shrink-0">
                            <span className="material-symbols-outlined">add_circle</span>
                        </div>
                        <h2 className="font-headline-md text-headline-md text-on-surface">Create Team</h2>
                    </div>
                    <form onSubmit={handleCreateTeam} className="space-y-md">
                        <div>
                            <label className="block font-label-md text-label-md text-on-surface mb-xs" htmlFor="teamName">Team Name</label>
                            <input 
                                id="teamName"
                                type="text"
                                value={teamName}
                                onChange={(e) => setTeamName(e.target.value)}
                                placeholder="Enter a unique team name"
                                className="w-full px-sm py-sm rounded-lg border border-outline-variant bg-surface text-on-surface focus:border-primary focus:ring-1 focus:ring-primary transition-all font-body-md"
                                disabled={isCreating}
                            />
                        </div>
                        <button 
                            type="submit"
                            disabled={isCreating}
                            className="w-full py-sm bg-primary text-on-primary font-label-md text-label-md rounded-lg hover:opacity-90 transition-opacity shadow-sm flex items-center justify-center gap-sm disabled:opacity-50"
                        >
                            {isCreating ? 'Creating Team...' : 'Create Team'}
                        </button>
                    </form>
                </section>

                {/* Join Team Card */}
                <section className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm p-lg">
                    <div className="flex items-center gap-sm mb-md pb-sm border-b border-outline-variant">
                        <div className="w-10 h-10 rounded-lg bg-secondary-container text-on-secondary-container flex items-center justify-center shrink-0">
                            <span className="material-symbols-outlined">group_add</span>
                        </div>
                        <h2 className="font-headline-md text-headline-md text-on-surface">Join via Code</h2>
                    </div>
                    <form onSubmit={handleJoinTeam} className="space-y-md">
                        <div>
                            <label className="block font-label-md text-label-md text-on-surface mb-xs" htmlFor="teamCode">6-Character Team Code</label>
                            <input 
                                id="teamCode"
                                type="text"
                                value={teamCode}
                                onChange={(e) => setTeamCode(e.target.value.toUpperCase())}
                                placeholder="e.g. KNT42X"
                                maxLength={6}
                                className="w-full px-sm py-sm rounded-lg border border-outline-variant bg-surface text-on-surface focus:border-primary focus:ring-1 focus:ring-primary transition-all font-body-md uppercase tracking-widest"
                                disabled={isJoining}
                            />
                        </div>
                        <button 
                            type="submit"
                            disabled={isJoining}
                            className="w-full py-sm bg-surface-container-high text-on-surface font-label-md text-label-md rounded-lg hover:bg-surface-variant transition-colors border border-outline-variant flex items-center justify-center gap-sm disabled:opacity-50"
                        >
                            {isJoining ? 'Sending Request...' : 'Join Team'}
                        </button>
                    </form>
                </section>
            </div>

            <div className="pt-md text-center">
                <p className="font-body-md text-on-surface-variant mb-sm">Looking for teammates?</p>
                <Link to="/participant/team/browse" className="inline-flex items-center gap-2 px-md py-sm bg-surface-container text-primary font-label-md text-label-md rounded-lg hover:bg-surface-variant transition-colors border border-outline-variant">
                    <span className="material-symbols-outlined text-[18px]">search</span>
                    Browse Available Teams
                </Link>
            </div>
        </div>
    );
};

const LeaderView = ({ team, members, currentUserUid, joinRequests }: { team: any, members: any[], currentUserUid: string, joinRequests: any[] }) => {
    const [isDeleting, setIsDeleting] = useState(false);
    const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

    const handleCopy = () => {
        if (team?.teamCode) {
            navigator.clipboard.writeText(team.teamCode)
                .then(() => alert('Team code copied.'))
                .catch(() => alert('Failed to copy team code.'));
        }
    };

    const handleDeleteTeam = async () => {
        if (window.confirm("Are you sure you want to delete this team? This action cannot be undone and all members will be removed.")) {
            setIsDeleting(true);
            try {
                await deleteTeam(team.id);
            } catch (e: any) {
                alert(e.message || "Failed to delete team");
                setIsDeleting(false);
            }
        }
    };

    const handleAcceptRequest = async (requestId: string) => {
        try {
            await acceptJoinRequest(requestId);
            alert('Request accepted successfully');
        } catch (e: any) {
            alert(e.message || "Failed to accept request");
        }
    };

    const handleRejectRequest = async (requestId: string) => {
        try {
            await rejectJoinRequest(requestId);
            alert('Request rejected successfully');
        } catch (e: any) {
            alert(e.message || "Failed to reject request");
        }
    };

    const handleRemoveMember = async (memberId: string) => {
        if (window.confirm("Are you sure you want to remove this member?")) {
            try {
                await removeMember(team.id, memberId);
                setOpenDropdownId(null);
            } catch (e: any) {
                alert(e.message || "Failed to remove member");
            }
        }
    };

    return (
        <div className="max-w-container-max mx-auto space-y-lg">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-md pb-md border-b border-outline-variant">
                <div>
                <div className="flex items-center gap-md mb-xs">
                    <h1 className="font-display-lg text-display-lg text-on-surface">{team?.teamName || 'Your Team'}</h1>
                    {members.length >= 2 ? (
                        <span className="inline-flex items-center gap-xs px-sm py-xs bg-primary-container text-on-primary-container font-label-md text-label-md rounded-full">
                            <span className="material-symbols-outlined text-[16px]">check_circle</span>
                            ELIGIBLE
                        </span>
                    ) : (
                        <span className="inline-flex items-center gap-xs px-sm py-xs bg-error-container text-on-error-container font-label-md text-label-md rounded-full">
                            <span className="material-symbols-outlined text-[16px]">error</span>
                            NOT ELIGIBLE
                        </span>
                    )}
                </div>
                <p className="font-body-lg text-body-lg text-on-surface-variant">Team Management • Leader View</p>
                </div>
                <button 
                    onClick={handleDeleteTeam}
                    disabled={isDeleting}
                    className="px-md py-sm bg-error text-white font-label-md text-label-md rounded-lg hover:bg-error/90 transition-colors shadow-sm flex items-center gap-sm disabled:opacity-50"
                >
                    <span className="material-symbols-outlined text-[18px]">delete_forever</span>
                    {isDeleting ? 'Deleting...' : 'Delete Team'}
                </button>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-lg">
                <div className="xl:col-span-8 space-y-lg">
                    <section className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm p-lg">
                        <div className="flex justify-between items-center mb-md">
                            <div>
                                <h2 className="font-headline-md text-headline-md text-on-surface">Team Members</h2>
                                <p className="font-body-md text-body-md text-on-surface-variant mt-xs">{members.length}/6 Members</p>
                            </div>
                        </div>
                        <div className="divide-y divide-outline-variant">
                            {members.map((m: any, i: number) => (
                                <motion.div 
                                    key={i} 
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="py-md flex items-center justify-between"
                                >
                                    <div className="flex items-center gap-md">
                                        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary-container bg-surface-container flex items-center justify-center font-bold text-lg text-on-surface">
                                            {m.fullName?.charAt(0) || 'U'}
                                        </div>
                                        <div>
                                            <p className="font-label-md text-label-md text-on-surface">
                                                {m.fullName || 'Unknown'} {m.uid === currentUserUid && <span className="text-primary">(You)</span>}
                                            </p>
                                            {m.teamRole === 'leader' && (
                                                <span className="inline-flex items-center px-2 py-1 mt-1 bg-primary-container text-on-primary-container font-caption text-caption rounded-full">Team Leader</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="relative">
                                        <button 
                                            onClick={() => setOpenDropdownId(openDropdownId === m.uid ? null : m.uid)}
                                            className="p-sm text-on-surface-variant hover:text-primary transition-colors"
                                        >
                                            <span className="material-symbols-outlined">more_vert</span>
                                        </button>
                                        
                                        <AnimatePresence>
                                        {openDropdownId === m.uid && (
                                            <motion.div 
                                                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                                transition={{ duration: 0.2 }}
                                                className="absolute right-0 top-full mt-1 w-48 bg-surface-container-lowest border border-outline-variant rounded-lg shadow-lg overflow-hidden z-10"
                                            >
                                                {m.uid !== currentUserUid ? (
                                                    <button 
                                                        onClick={() => handleRemoveMember(m.uid)}
                                                        className="w-full text-left px-4 py-3 flex items-center gap-3 text-error hover:bg-error-container/30 transition-colors font-label-md"
                                                    >
                                                        <span className="material-symbols-outlined text-[18px]">person_remove</span>
                                                        Remove Member
                                                    </button>
                                                ) : (
                                                    <div className="px-4 py-3 text-on-surface-variant font-body-sm text-sm">
                                                        You are the team leader
                                                    </div>
                                                )}
                                            </motion.div>
                                        )}
                                        </AnimatePresence>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </section>

                    <section className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm p-lg">
                        <div className="flex items-center gap-sm mb-md">
                            <h2 className="font-headline-md text-headline-md text-on-surface">Join Requests</h2>
                            <span className="px-2 py-0.5 bg-tertiary-container text-on-tertiary-container font-caption text-caption rounded-full">{joinRequests.length} Pending</span>
                        </div>
                        
                        {joinRequests.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-8 text-center">
                                <span className="material-symbols-outlined text-[48px] text-outline mb-2">inbox</span>
                                <p className="font-label-md text-label-md text-on-surface-variant">No pending join requests.</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-outline-variant">
                                {joinRequests.map((req) => (
                                    <div key={req.id} className="py-md flex flex-col sm:flex-row sm:items-center justify-between gap-md">
                                        <div className="flex items-center gap-md">
                                            <div className="w-10 h-10 rounded-full bg-surface-container border border-outline-variant flex items-center justify-center font-bold text-on-surface">
                                                {req.participantName?.charAt(0) || 'U'}
                                            </div>
                                            <div>
                                                <p className="font-label-md text-label-md text-on-surface">{req.participantName || 'Unknown'}</p>
                                                <p className="font-caption text-caption text-on-surface-variant">Requested to join</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-sm">
                                            <button onClick={() => handleRejectRequest(req.id)} className="px-sm py-xs text-error hover:bg-error-container/50 font-label-md rounded-lg transition-colors border border-transparent">
                                                Decline
                                            </button>
                                            <button onClick={() => handleAcceptRequest(req.id)} className="px-md py-xs bg-primary text-on-primary font-label-md rounded-lg hover:bg-surface-tint transition-colors shadow-sm">
                                                Accept
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                </div>

                <div className="xl:col-span-4 space-y-lg">
                    <section className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm p-lg text-center relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-container opacity-5 rounded-bl-full pointer-events-none"></div>
                        <h3 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest mb-sm">Team Invite Code</h3>
                        <div className="flex items-center justify-center gap-sm mb-md">
                            <code className="font-display-lg text-[40px] font-bold text-on-surface tracking-widest bg-surface px-md py-sm rounded-lg border border-outline-variant">
                                {team?.teamCode || '------'}
                            </code>
                        </div>
                        <p className="font-caption text-caption text-on-surface-variant mb-md">Share this code with members so they can request to join your team.</p>
                        <button onClick={handleCopy} className="w-full py-sm bg-surface-container text-on-surface font-label-md text-label-md rounded-lg hover:bg-surface-variant transition-colors border border-outline-variant flex items-center justify-center gap-sm">
                            <span className="material-symbols-outlined text-[18px]">content_copy</span>
                            Copy Code
                        </button>
                    </section>

                    <section className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm p-lg">
                        <div className="flex items-center gap-sm mb-md">
                            <span className="material-symbols-outlined text-tertiary-container">fact_check</span>
                            <h2 className="font-headline-md text-headline-md text-on-surface">Eligibility Checklist</h2>
                        </div>
                        {members.length < 2 ? (
                            <div className="p-sm bg-error-container/30 border border-error-container rounded-lg mb-md">
                                <p className="font-label-md text-label-md text-error flex items-center gap-xs">
                                    <span className="material-symbols-outlined text-[16px]">warning</span>
                                    Action Required: Add members
                                </p>
                            </div>
                        ) : (
                            <div className="p-sm bg-primary-container/30 border border-primary-container rounded-lg mb-md">
                                <p className="font-label-md text-label-md text-primary flex items-center gap-xs">
                                    <span className="material-symbols-outlined text-[16px]">check_circle</span>
                                    Team is eligible to participate!
                                </p>
                            </div>
                        )}
                        <ul className="space-y-sm">
                            <li className="flex items-start gap-sm">
                                <span className={`material-symbols-outlined mt-0.5 text-[20px] ${members.length >= 2 ? 'text-primary' : 'text-outline'}`}>
                                    {members.length >= 2 ? 'check_circle' : 'radio_button_unchecked'}
                                </span>
                                <div>
                                    <p className={`font-body-md text-body-md ${members.length >= 2 ? 'text-on-surface line-through text-on-surface-variant' : 'text-on-surface'}`}>Minimum 2 Members</p>
                                    {members.length < 2 && (
                                        <p className="font-caption text-caption text-on-surface-variant">Currently {members.length}. Need {Math.max(0, 2 - members.length)} more to qualify.</p>
                                    )}
                                </div>
                            </li>
                            <li className="flex items-start gap-sm">
                                <span className="material-symbols-outlined text-primary mt-0.5 text-[20px]">check_circle</span>
                                <div>
                                    <p className="font-body-md text-body-md text-on-surface line-through text-on-surface-variant">Maximum 6 Members</p>
                                </div>
                            </li>
                        </ul>
                    </section>
                </div>
            </div>
        </div>
    );
};

const MemberView = ({ team, members, currentUserUid }: { team: any, members: any[], currentUserUid: string }) => {
    return (
        <div className="max-w-container-max mx-auto space-y-lg">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-md pb-md border-b border-outline-variant">
                <div>
                <div className="flex items-center gap-md mb-xs">
                    <h1 className="font-display-lg text-display-lg text-on-surface">{team?.teamName || 'Your Team'}</h1>
                </div>
                <p className="font-body-lg text-body-lg text-on-surface-variant">Team Management • Member View</p>
                </div>
            </div>

            <section className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm p-lg">
                <div className="flex justify-between items-center mb-md">
                    <div>
                        <h2 className="font-headline-md text-headline-md text-on-surface">Team Members</h2>
                        <p className="font-body-md text-body-md text-on-surface-variant mt-xs">{members.length}/6 Members</p>
                    </div>
                </div>
                <div className="divide-y divide-outline-variant">
                    {members.map((m: any, i: number) => (
                        <div key={i} className="py-md flex items-center justify-between">
                            <div className="flex items-center gap-md">
                                <div className="w-12 h-12 rounded-full overflow-hidden border border-outline-variant bg-surface-container flex items-center justify-center font-bold text-lg text-on-surface">
                                    {m.fullName?.charAt(0) || 'U'}
                                </div>
                                <div>
                                    <p className="font-label-md text-label-md text-on-surface">
                                        {m.fullName || 'Unknown'} {m.uid === currentUserUid && <span className="text-primary">(You)</span>}
                                    </p>
                                    {m.teamRole === 'leader' && (
                                        <span className="inline-flex items-center px-2 py-1 mt-1 bg-primary-container text-on-primary-container font-caption text-caption rounded-full">Team Leader</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default function MyTeamLeaderViewHackathonosPage() {
    const { currentUser, profile: userDoc } = useAuth();
    const { team: teamDoc, joinRequests, loading } = useCurrentTeam();

    return (
        <div className="bg-surface min-h-screen text-on-surface font-sans selection:bg-primary/20">
            <header className="fixed top-0 w-full z-50 flex justify-between items-center px-6 h-16 bg-surface-container-lowest border-b border-outline-variant shadow-sm">
            <div className="flex items-center gap-md">
                <span className="font-headline-md text-headline-md font-bold text-primary">HackSprint Portal</span>
            </div>
            <div className="flex items-center gap-md">
                <button className="p-xs text-on-surface-variant hover:bg-surface-container-low transition-colors cursor-pointer active:scale-95 rounded-full flex items-center justify-center">
                    <span className="material-symbols-outlined" data-icon="notifications">notifications</span>
                </button>
                <button className="p-xs text-on-surface-variant hover:bg-surface-container-low transition-colors cursor-pointer active:scale-95 rounded-full flex items-center justify-center">
                    <span className="material-symbols-outlined" data-icon="settings">settings</span>
                </button>
                <div className="w-8 h-8 rounded-full bg-secondary-container overflow-hidden ml-sm border border-outline-variant flex items-center justify-center text-on-secondary-container font-bold text-sm">
                    {userDoc?.fullName ? userDoc.fullName.charAt(0).toUpperCase() : 'U'}
                </div>
            </div>
            </header>

            <div className="flex pt-16 h-screen">
                <ParticipantSidebar activeTab="team" />

                <main className="flex-1 md:ml-64 p-lg overflow-y-auto">
                    {loading ? (
                        <div className="flex items-center justify-center h-full">
                            <span className="material-symbols-outlined animate-spin text-primary text-4xl">autorenew</span>
                        </div>
                    ) : (
                        <PageTransitionWrapper>
                            {!userDoc ? (
                                <div className="text-center p-8">
                                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-error-container text-error mb-4">
                                        <span className="material-symbols-outlined text-3xl">error</span>
                                    </div>
                                    <h2 className="font-headline-md text-on-surface mb-2">Profile Error</h2>
                                    <p className="text-on-surface-variant mb-4">Your participant profile could not be loaded.</p>
                                    <button onClick={() => window.location.reload()} className="px-4 py-2 bg-primary text-on-primary rounded-lg font-label-md">Retry</button>
                                </div>
                            ) : !userDoc.teamId ? (
                                <NoTeamView />
                            ) : !teamDoc ? (
                                <div className="text-center p-8">
                                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-error-container text-error mb-4">
                                        <span className="material-symbols-outlined text-3xl">error</span>
                                    </div>
                                    <h2 className="font-headline-md text-on-surface mb-2">Team Error</h2>
                                    <p className="text-on-surface-variant mb-4">Your team information could not be found.</p>
                                    <button onClick={() => window.location.reload()} className="px-4 py-2 bg-primary text-on-primary rounded-lg font-label-md">Retry</button>
                                </div>
                            ) : userDoc.teamRole === 'leader' ? (
                                <LeaderView team={teamDoc} members={teamDoc?.members || []} currentUserUid={currentUser?.uid || ''} joinRequests={joinRequests} />
                            ) : (
                                <MemberView team={teamDoc} members={teamDoc?.members || []} currentUserUid={currentUser?.uid || ''} />
                            )}
                        </PageTransitionWrapper>
                    )}
                </main>
            </div>
        </div>
    );
}
