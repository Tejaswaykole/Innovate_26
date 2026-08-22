import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useHackathon } from '../contexts/HackathonContext';
import { useAuth } from '../contexts/AuthContext';

interface SidebarProps {
    activeTab: string;
}

export default function ParticipantSidebar({ activeTab }: SidebarProps) {
    const { hackathonName } = useHackathon();
    const { profile } = useAuth();

    const isLeader = profile?.teamRole === 'leader';

    const allNavItems = [
        { id: 'dashboard', icon: 'dashboard', label: 'Dashboard', path: '/participant/dashboard' },
        { id: 'profile', icon: 'person', label: 'Profile', path: '/participant/profile' },
        { id: 'team', icon: 'groups', label: 'Team', path: '/participant/team' },
        { id: 'problem', icon: 'lightbulb', label: 'Problem Statement', path: '/participant/problem' },
        { id: 'submission', icon: 'upload_file', label: 'Submission', path: '/participant/submission' },
        { id: 'announcements', icon: 'campaign', label: 'Announcements', path: '/participant/announcements' },
        { id: 'timeline', icon: 'schedule', label: 'Timeline', path: '/participant/timeline' },
        { id: 'rules', icon: 'gavel', label: 'Rules', path: '/participant/rules' },
        { id: 'results', icon: 'emoji_events', label: 'Results', path: '/participant/results' },
    ];

    const navItems = allNavItems.filter(item => isLeader || !['problem', 'submission'].includes(item.id));
    const lockedItems = allNavItems.filter(item => !isLeader && ['problem', 'submission'].includes(item.id)).map(item => ({...item, path: '#', icon: 'lock'}));

    return (
        <aside className="fixed left-0 top-16 bottom-0 w-64 flex flex-col py-4 bg-surface-container-low border-r border-outline-variant z-40 hidden md:flex transition-all duration-300">
            <div className="px-lg pb-md mb-md border-b border-outline-variant">
                <div className="flex items-center gap-sm mb-sm">
                    <img src="/logo.png" alt="Innovate'26 Logo" className="w-12 h-12 object-contain bg-white rounded-lg p-1" />
                    <div>
                        <h2 className="font-label-md text-label-md text-primary font-bold flex items-center gap-1">
                            {hackathonName}
                            {isLeader && (
                                <span className="material-symbols-outlined text-[16px] text-primary" title="Team Leader">
                                    verified_user
                                </span>
                            )}
                        </h2>
                        <p className="font-caption text-caption text-on-surface-variant">Technical Excellence</p>
                        {isLeader && (
                            <div className="mt-1 bg-primary/10 text-primary text-[10px] uppercase font-bold px-2 py-0.5 rounded-full inline-block">
                                Team Leader
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <nav className="flex-1 overflow-y-auto px-sm flex flex-col gap-xs">
                {navItems.map((item) => (
                    <Link 
                        key={item.id}
                        className={`relative flex items-center gap-md px-md py-3 rounded-r-full transition-colors duration-200 ${activeTab === item.id ? 'text-primary font-bold' : 'text-on-secondary-fixed-variant hover:bg-surface-container-high hover:text-primary'}`} 
                        to={item.path}
                    >
                        {activeTab === item.id && (
                            <motion.div
                                layoutId="sidebarActiveTab"
                                className="absolute inset-0 bg-primary-container/10 border-l-4 border-primary rounded-r-full"
                                initial={false}
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            />
                        )}
                        <span className="material-symbols-outlined relative z-10" data-icon={item.icon}>{item.icon}</span>
                        <span className="font-label-md text-label-md relative z-10">{item.label}</span>
                    </Link>
                ))}

                {lockedItems.length > 0 && (
                    <>
                        <div className="mt-md pt-md border-t border-outline-variant px-md">
                            <span className="font-caption text-caption text-outline uppercase tracking-wider mb-xs block">Locked Stages</span>
                        </div>

                        {lockedItems.map((item) => (
                            <Link 
                                key={item.id}
                                className={`relative flex items-center gap-md px-md py-3 rounded-r-full transition-colors duration-200 ${activeTab === item.id ? 'text-primary font-bold' : 'text-outline/60 cursor-not-allowed'}`} 
                                to={item.path}
                            >
                                {activeTab === item.id && (
                                    <motion.div
                                        layoutId="sidebarActiveTab"
                                        className="absolute inset-0 bg-primary-container/10 border-l-4 border-primary rounded-r-full"
                                        initial={false}
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    />
                                )}
                                <span className="material-symbols-outlined relative z-10" data-icon={item.icon}>{item.icon}</span>
                                <span className="font-label-md text-label-md relative z-10">{item.label}</span>
                            </Link>
                        ))}
                    </>
                )}
            </nav>
            <div className="px-sm pt-md border-t border-outline-variant mt-auto">
                <Link className="flex items-center gap-md px-md py-3 rounded-r-full text-on-secondary-fixed-variant hover:bg-surface-container-high hover:text-primary transition-all duration-200" to="#">
                    <span className="material-symbols-outlined" data-icon="support_agent">support_agent</span>
                    <span className="font-label-md text-label-md">Help & Support</span>
                </Link>
                <Link className="flex items-center gap-md px-md py-3 rounded-r-full text-on-secondary-fixed-variant hover:bg-surface-container-high hover:text-error transition-all duration-200" to="/login">
                    <span className="material-symbols-outlined" data-icon="logout">logout</span>
                    <span className="font-label-md text-label-md">Logout</span>
                </Link>
            </div>
        </aside>
    );
}

