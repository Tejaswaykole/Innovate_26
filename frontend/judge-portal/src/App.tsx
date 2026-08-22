import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AssignedTeamsJudgePortalPage from './pages/AssignedTeamsJudgePortalPage';
import EvaluationReviewJudgePortalPage from './pages/EvaluationReviewJudgePortalPage';
import { JudgeDashboardHackathonosPage } from './pages/JudgeDashboardHackathonosPage';
import SubmissionReviewPage from './pages/SubmissionReviewPage';
import EvaluationFormPage from './pages/EvaluationFormPage';
import JudgeLogin from './pages/JudgeLogin';
import JudgeProfile from './pages/JudgeProfile';
import JudgeAnnouncementsPage from './pages/JudgeAnnouncementsPage';
import JudgeRulesPage from './pages/JudgeRulesPage';
import NotFoundPage from './pages/NotFoundPage';
import { ProtectedRoute } from './components/ProtectedRoute';
import JudgeLayout from './components/JudgeLayout';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<JudgeLogin />} />
        
        {/* Redirect root to /judge/dashboard */}
        <Route path="/" element={<Navigate to="/judge/dashboard" replace />} />
        <Route path="/judge" element={<Navigate to="/judge/dashboard" replace />} />
        
        {/* Protected Judge Routes */}
        <Route element={<ProtectedRoute allowedRoles={['judge']} />}>
          <Route element={<JudgeLayout />}>
            <Route path="/judge/dashboard" element={<JudgeDashboardHackathonosPage />} />
            <Route path="/judge/assignments" element={<AssignedTeamsJudgePortalPage />} />
            <Route path="/judge/submissions/:teamId" element={<SubmissionReviewPage />} />
            <Route path="/judge/evaluate/:teamId" element={<EvaluationFormPage />} />
            <Route path="/judge/announcements" element={<JudgeAnnouncementsPage />} />
            <Route path="/judge/rules" element={<JudgeRulesPage />} />
            <Route path="/judge/profile" element={<JudgeProfile />} />
            
            {/* Keep evaluations if needed for later, mapped properly */}
            <Route path="/judge/evaluations" element={<EvaluationReviewJudgePortalPage />} />
            <Route path="/judge/evaluations/:evaluationId" element={<EvaluationReviewJudgePortalPage />} />
            
            {/* 404 Catch All */}
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Route>
        
        {/* Unprotected 404 Catch All */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
