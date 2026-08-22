import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AdminDashboardHackathonosPage } from './pages/AdminDashboardHackathonosPage';
import { AdminUsersHackathonosPage } from './pages/AdminUsersHackathonosPage';
import { AdminTeamsHackathonosPage } from './pages/AdminTeamsHackathonosPage';
import { AdminHackathonHackathonosPage } from './pages/AdminHackathonHackathonosPage';
import { AdminProblemStatementsHackathonosPage } from './pages/AdminProblemStatementsHackathonosPage';
import { AdminJudgesHackathonosPage } from './pages/AdminJudgesHackathonosPage';
import { AdminJudgeDetailHackathonosPage } from './pages/AdminJudgeDetailHackathonosPage';
import { AdminSubmissionsHackathonosPage } from './pages/AdminSubmissionsHackathonosPage';
import { AdminSubmissionDetailHackathonosPage } from './pages/AdminSubmissionDetailHackathonosPage';
import { AdminEvaluationsHackathonosPage } from './pages/AdminEvaluationsHackathonosPage';
import { AdminEvaluationDetailHackathonosPage } from './pages/AdminEvaluationDetailHackathonosPage';
import { AdminResultsHackathonosPage } from './pages/AdminResultsHackathonosPage';
import { AdminAnalyticsHackathonosPage } from './pages/AdminAnalyticsHackathonosPage';
import AdminAnnouncementsHackathonosPage from './pages/AdminAnnouncementsHackathonosPage';
import AdminRulesHackathonosPage from './pages/AdminRulesHackathonosPage';
import AdminLoginHackathonosPage from './pages/AdminLoginHackathonosPage';
import NotFoundPage from './pages/NotFoundPage';
import AdminProtectedRoute from './components/AdminProtectedRoute';
import AdminLayout from './components/AdminLayout';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<AdminLoginHackathonosPage />} />
        
        {/* Protected Admin Routes */}
        <Route element={<AdminProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<AdminDashboardHackathonosPage />} />
            <Route path="/users" element={<AdminUsersHackathonosPage />} />
            <Route path="/teams" element={<AdminTeamsHackathonosPage />} />
            <Route path="/hackathon" element={<AdminHackathonHackathonosPage />} />
            <Route path="/problem-statements" element={<AdminProblemStatementsHackathonosPage />} />
            <Route path="/judges" element={<AdminJudgesHackathonosPage />} />
            <Route path="/judges/:uid" element={<AdminJudgeDetailHackathonosPage />} />
            <Route path="/submissions" element={<AdminSubmissionsHackathonosPage />} />
            <Route path="/submissions/:submissionId" element={<AdminSubmissionDetailHackathonosPage />} />
            <Route path="/evaluations" element={<AdminEvaluationsHackathonosPage />} />
            <Route path="/evaluations/:evaluationId" element={<AdminEvaluationDetailHackathonosPage />} />
            <Route path="/results" element={<AdminResultsHackathonosPage />} />
            <Route path="/analytics" element={<AdminAnalyticsHackathonosPage />} />
            <Route path="/announcements" element={<AdminAnnouncementsHackathonosPage />} />
            <Route path="/rules" element={<AdminRulesHackathonosPage />} />
            
            {/* Future routes will go here, currently disabled/unimplemented */}
          </Route>
        </Route>

        {/* 404 Catch-All */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
