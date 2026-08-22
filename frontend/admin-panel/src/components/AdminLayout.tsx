import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AdminLayout: React.FC = () => {
  const { profile, logout } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: 'dashboard' },
    { name: 'Users', path: '/users', icon: 'group', disabled: false },
    { name: 'Teams', path: '/teams', icon: 'groups', disabled: false },
    { name: 'Hackathon', path: '/hackathon', icon: 'event', disabled: false },
    { name: 'Problem Statements', path: '/problem-statements', icon: 'description', disabled: false },
    { name: 'Judges', path: '/judges', icon: 'gavel', disabled: false },
    { name: 'Submissions', path: '/submissions', icon: 'file_present', disabled: false },
    { name: 'Evaluations', path: '/evaluations', icon: 'fact_check', disabled: false },
    { name: 'Results', path: '/results', icon: 'emoji_events', disabled: false },
    { name: 'Analytics', path: '/analytics', icon: 'analytics', disabled: false },
    { name: 'Announcements', path: '/announcements', icon: 'campaign', disabled: false },
    { name: 'Rules', path: '/rules', icon: 'gavel', disabled: false },
  ];

  return (
    <div className="flex h-screen bg-surface-container-lowest overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 w-64 bg-surface-container-low border-r border-outline-variant/30 flex flex-col z-30 transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="h-16 flex items-center px-6 border-b border-outline-variant/30">
          <img src="/logo.png" alt="Innovate'26 Logo" className="h-8 mr-3 object-contain" />
          <h1 className="font-headline-sm text-headline-sm text-on-surface truncate">Admin Portal</h1>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navItems.map((item) => (
            <div key={item.name}>
              {item.disabled ? (
                <div className="flex items-center px-3 py-2.5 text-on-surface-variant/50 rounded-lg cursor-not-allowed">
                  <span className="material-symbols-outlined text-[20px] mr-3" data-icon={item.icon}>
                    {item.icon}
                  </span>
                  <span className="font-label-lg text-label-lg">{item.name}</span>
                </div>
              ) : (
                <NavLink
                  to={item.path}
                  onClick={() => setIsSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center px-3 py-2.5 rounded-lg transition-colors font-label-lg text-label-lg ${
                      isActive
                        ? 'bg-primary/10 text-primary'
                        : 'text-on-surface-variant hover:bg-surface-container-high'
                    }`
                  }
                >
                  <span className="material-symbols-outlined text-[20px] mr-3" data-icon={item.icon}>
                    {item.icon}
                  </span>
                  {item.name}
                </NavLink>
              )}
            </div>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 bg-surface-container-lowest border-b border-outline-variant/30 flex items-center justify-between px-4 lg:px-8 z-10">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="lg:hidden p-2 text-on-surface-variant hover:bg-surface-container-high rounded-full focus:outline-none"
          >
            <span className="material-symbols-outlined" data-icon="menu">menu</span>
          </button>
          
          <div className="flex-1 lg:hidden text-center truncate pr-10">
            <h2 className="font-headline-sm text-headline-sm text-on-surface">Admin Portal</h2>
          </div>

          <div className="hidden lg:flex flex-1"></div>

          <div className="flex items-center space-x-4">
            <div className="hidden sm:block text-right">
              <p className="font-label-md text-label-md text-on-surface truncate max-w-[150px]">
                {profile?.name || profile?.email || 'Admin User'}
              </p>
              <p className="font-caption text-caption text-primary uppercase tracking-wider">
                {profile?.role || 'ADMIN'}
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
              {(profile?.name || profile?.email || 'A')[0].toUpperCase()}
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-error hover:bg-error/10 rounded-full focus:outline-none transition-colors ml-2"
              title="Logout"
            >
              <span className="material-symbols-outlined" data-icon="logout">logout</span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto bg-surface-container-lowest">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
