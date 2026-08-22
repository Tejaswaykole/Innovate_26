const fs = require('fs');
const path = require('path');

const tailwindConfig = `/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "surface-container-high": "#e6e8ea",
        "secondary": "#475569",
        "surface-container": "#eceef0",
        "on-primary-fixed": "#00174b",
        "inverse-on-surface": "#eff1f3",
        "error": "#ba1a1a",
        "on-error-container": "#410002",
        "secondary-container": "#cde7ec",
        "on-secondary-container": "#051f23",
        "on-secondary": "#ffffff",
        "primary": "#2563EB",
        "on-surface-variant": "#43474e",
        "surface-container-highest": "#e0e2e5",
        "on-primary": "#ffffff",
        "error-container": "#ffdad6",
        "on-surface": "#0F172A",
        "primary-container": "#d7e3ff",
        "on-primary-container": "#001b3f",
        "surface": "#F8FAFC",
        "on-error": "#ffffff",
        "outline": "#73777f",
        "outline-variant": "#c3c6cf",
        "accent": "#C84800"
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/container-queries')
  ],
}`;

const indexCss = `@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-surface text-on-surface antialiased;
  }
}
`;

const mainWebRoutes = `import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AuthStatesFeedbackHackathonosPage from './pages/AuthStatesFeedbackHackathonosPage';
import BrowseTeamsHackathonosPage from './pages/BrowseTeamsHackathonosPage';
import CompleteProfileHackathonosPage from './pages/CompleteProfileHackathonosPage';
import ForgotPasswordHackathonosPage from './pages/ForgotPasswordHackathonosPage';
import MyProblemStatementHackathonosPage from './pages/MyProblemStatementHackathonosPage';
import MyProfileHackathonosPage from './pages/MyProfileHackathonosPage';
import MyTeamLeaderViewHackathonosPage from './pages/MyTeamLeaderViewHackathonosPage';
import ParticipantDashboardHackathonosPage from './pages/ParticipantDashboardHackathonosPage';
import ParticipantLoginHackathonosPage from './pages/ParticipantLoginHackathonosPage';
import ParticipantRegistrationHackathonosPage from './pages/ParticipantRegistrationHackathonosPage';
import ProjectSubmissionHackathonosPage from './pages/ProjectSubmissionHackathonosPage';
import SubmissionStatusHackathonosPage from './pages/SubmissionStatusHackathonosPage';
import VerifyYourEmailHackathonosPage from './pages/VerifyYourEmailHackathonosPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<LandingPage />} />
        <Route path="/theme" element={<LandingPage />} />
        <Route path="/how-it-works" element={<LandingPage />} />
        <Route path="/timeline" element={<LandingPage />} />
        <Route path="/rules" element={<LandingPage />} />
        <Route path="/faqs" element={<LandingPage />} />
        <Route path="/contact" element={<LandingPage />} />
        
        {/* Auth */}
        <Route path="/login" element={<ParticipantLoginHackathonosPage />} />
        <Route path="/register" element={<ParticipantRegistrationHackathonosPage />} />
        <Route path="/verify-email" element={<VerifyYourEmailHackathonosPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordHackathonosPage />} />
        <Route path="/reset-password" element={<AuthStatesFeedbackHackathonosPage />} />
        
        {/* Participant Portal */}
        <Route path="/participant/dashboard" element={<ParticipantDashboardHackathonosPage />} />
        <Route path="/participant/profile" element={<CompleteProfileHackathonosPage />} />
        <Route path="/participant/team" element={<MyTeamLeaderViewHackathonosPage />} />
        <Route path="/participant/team/create" element={<MyTeamLeaderViewHackathonosPage />} />
        <Route path="/participant/team/browse" element={<BrowseTeamsHackathonosPage />} />
        <Route path="/participant/team/join" element={<BrowseTeamsHackathonosPage />} />
        <Route path="/participant/team/requests" element={<BrowseTeamsHackathonosPage />} />
        <Route path="/participant/problem" element={<MyProblemStatementHackathonosPage />} />
        <Route path="/participant/submission" element={<ProjectSubmissionHackathonosPage />} />
        <Route path="/participant/announcements" element={<ParticipantDashboardHackathonosPage />} />
        <Route path="/participant/timeline" element={<ParticipantDashboardHackathonosPage />} />
        <Route path="/participant/rules" element={<ParticipantDashboardHackathonosPage />} />
        <Route path="/participant/evaluation" element={<SubmissionStatusHackathonosPage />} />
        <Route path="/participant/results" element={<SubmissionStatusHackathonosPage />} />
        <Route path="/participant/certificate" element={<SubmissionStatusHackathonosPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
`;

const judgePortalRoutes = `import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AssignedTeamsJudgePortalPage from './pages/AssignedTeamsJudgePortalPage';
import EvaluationReviewJudgePortalPage from './pages/EvaluationReviewJudgePortalPage';
import JudgeDashboardHackathonosPage from './pages/JudgeDashboardHackathonosPage';
import TeamReviewEvaluateHackathonosPage from './pages/TeamReviewEvaluateHackathonosPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<JudgeDashboardHackathonosPage />} />
        <Route path="/" element={<JudgeDashboardHackathonosPage />} />
        <Route path="/dashboard" element={<JudgeDashboardHackathonosPage />} />
        <Route path="/teams" element={<AssignedTeamsJudgePortalPage />} />
        <Route path="/teams/:teamId" element={<TeamReviewEvaluateHackathonosPage />} />
        <Route path="/evaluations" element={<EvaluationReviewJudgePortalPage />} />
        <Route path="/evaluations/:evaluationId" element={<EvaluationReviewJudgePortalPage />} />
        <Route path="/announcements" element={<JudgeDashboardHackathonosPage />} />
        <Route path="/profile" element={<JudgeDashboardHackathonosPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
`;

const adminPanelRoutes = `import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AdminDashboardHackathonosPage from './pages/AdminDashboardHackathonosPage';
import AdminLoginHackathonosPage from './pages/AdminLoginHackathonosPage';
import JudgeAssignmentAdminPanelPage from './pages/JudgeAssignmentAdminPanelPage';
import ParticipantManagementAdminPanelPage from './pages/ParticipantManagementAdminPanelPage';
import ResultsManagementAdminPanelPage from './pages/ResultsManagementAdminPanelPage';
import TeamManagementAdminPanelPage from './pages/TeamManagementAdminPanelPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<AdminLoginHackathonosPage />} />
        <Route path="/" element={<AdminDashboardHackathonosPage />} />
        <Route path="/dashboard" element={<AdminDashboardHackathonosPage />} />
        <Route path="/participants" element={<ParticipantManagementAdminPanelPage />} />
        <Route path="/participants/:id" element={<ParticipantManagementAdminPanelPage />} />
        <Route path="/teams" element={<TeamManagementAdminPanelPage />} />
        <Route path="/teams/:id" element={<TeamManagementAdminPanelPage />} />
        <Route path="/judges" element={<JudgeAssignmentAdminPanelPage />} />
        <Route path="/judges/assignments" element={<JudgeAssignmentAdminPanelPage />} />
        <Route path="/submissions" element={<AdminDashboardHackathonosPage />} />
        <Route path="/submissions/:id" element={<AdminDashboardHackathonosPage />} />
        <Route path="/evaluations" element={<ResultsManagementAdminPanelPage />} />
        <Route path="/evaluations/:id" element={<ResultsManagementAdminPanelPage />} />
        <Route path="/announcements" element={<AdminDashboardHackathonosPage />} />
        <Route path="/timeline" element={<AdminDashboardHackathonosPage />} />
        <Route path="/results" element={<ResultsManagementAdminPanelPage />} />
        <Route path="/certificates" element={<ResultsManagementAdminPanelPage />} />
        <Route path="/analytics" element={<AdminDashboardHackathonosPage />} />
        <Route path="/settings" element={<AdminDashboardHackathonosPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
`;

function setupProject(dir, appRoutesCode) {
    fs.writeFileSync(path.join(dir, 'tailwind.config.js'), tailwindConfig);
    fs.writeFileSync(path.join(dir, 'src', 'index.css'), indexCss);
    fs.writeFileSync(path.join(dir, 'src', 'App.tsx'), appRoutesCode);
    console.log('Setup ' + dir);
}

setupProject(path.join(__dirname, '../frontend/main-web'), mainWebRoutes);
setupProject(path.join(__dirname, '../frontend/judge-portal'), judgePortalRoutes);
setupProject(path.join(__dirname, '../frontend/admin-panel'), adminPanelRoutes);
