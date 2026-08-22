import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-8 text-center">
      <span className="material-symbols-outlined text-8xl text-outline mb-6">explore_off</span>
      <h1 className="text-4xl font-black text-on-surface mb-2">404 - Page Not Found</h1>
      <p className="text-lg text-secondary font-medium mb-8 max-w-md mx-auto">
        The page you are looking for does not exist, has been removed, or is temporarily unavailable.
      </p>
      <Link 
        to="/judge/dashboard" 
        className="px-8 py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors shadow-sm"
      >
        Back to Dashboard
      </Link>
    </div>
  );
}
