import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { auth } from '../lib/firebase/client';

export default function JudgeLayout() {
  const { currentUser, profile } = useAuth();
  const location = useLocation();

  const handleLogout = () => {
    auth.signOut();
  };

  const navItems = [
    { name: 'Dashboard', path: '/judge/dashboard', icon: 'dashboard' },
    { name: 'Assignments', path: '/judge/assignments', icon: 'assignment' },
    { name: 'Announcements', path: '/judge/announcements', icon: 'campaign' },
    { name: 'Rules', path: '/judge/rules', icon: 'gavel' },
    { name: 'Profile', path: '/judge/profile', icon: 'person' },
  ];

  return (
    <div className="min-h-screen bg-surface flex flex-col md:flex-row">
      {/* Mobile Header (visible only on small screens) */}
      <header className="md:hidden bg-white border-b border-outline-variant p-4 flex justify-between items-center sticky top-0 z-10">
        <img src="/logo.png" alt="Innovate'26 Logo" className="h-8 object-contain" />
        <button onClick={handleLogout} className="text-sm font-bold text-secondary">Logout</button>
      </header>

      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-outline-variant sticky top-0 h-screen overflow-y-auto">
        <div className="p-6 border-b border-outline-variant">
          <img src="/logo.png" alt="Innovate'26 Logo" className="h-10 mb-4 object-contain" />
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-lg">
              {(profile?.fullName || currentUser?.email || 'J')[0].toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="font-bold text-on-surface truncate text-sm">
                {profile?.fullName || 'Judge'}
              </p>
              <p className="text-xs text-secondary truncate">{currentUser?.email}</p>
            </div>
          </div>
        </div>

        <nav className="flex-grow p-4 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={'flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-colors ' + (isActive ? 'bg-primary text-white shadow-md shadow-primary/20' : 'text-secondary hover:bg-surface-container-low hover:text-on-surface')}
              >
                <span className="material-symbols-outlined">{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-outline-variant">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 text-error font-bold rounded-xl hover:bg-error-container hover:text-on-error-container transition-colors"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile Nav (bottom) */}
      <nav className="md:hidden fixed bottom-0 w-full bg-white border-t border-outline-variant flex justify-around p-2 z-10 pb-safe">
        {navItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={'flex flex-col items-center p-2 rounded-lg ' + (isActive ? 'text-primary' : 'text-secondary')}
            >
              <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
              <span className="text-[10px] font-bold mt-1">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Main Content */}
      <main className="flex-grow overflow-x-hidden pb-20 md:pb-0">
        <Outlet />
      </main>
    </div>
  );
}
