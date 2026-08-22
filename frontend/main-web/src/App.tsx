import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AuthStatesFeedbackHackathonosPage from './pages/AuthStatesFeedbackHackathonosPage';
import BrowseTeamsHackathonosPage from './pages/BrowseTeamsHackathonosPage';
import CompleteProfileHackathonosPage from './pages/CompleteProfileHackathonosPage';
import MyProfileHackathonosPage from './pages/MyProfileHackathonosPage';
import ForgotPasswordHackathonosPage from './pages/ForgotPasswordHackathonosPage';
import MyProblemStatementHackathonosPage from './pages/MyProblemStatementHackathonosPage';

import MyTeamLeaderViewHackathonosPage from './pages/MyTeamLeaderViewHackathonosPage';
import ParticipantDashboardHackathonosPage from './pages/ParticipantDashboardHackathonosPage';
import ParticipantLoginHackathonosPage from './pages/ParticipantLoginHackathonosPage';
import ParticipantRegistrationHackathonosPage from './pages/ParticipantRegistrationHackathonosPage';
import { ProjectSubmissionHackathonosPage } from './pages/ProjectSubmissionHackathonosPage';
import SubmissionStatusHackathonosPage from './pages/SubmissionStatusHackathonosPage';
import VerifyYourEmailHackathonosPage from './pages/VerifyYourEmailHackathonosPage';
import ParticipantAnnouncementsPage from './pages/ParticipantAnnouncementsPage';
import ParticipantTimelinePage from './pages/ParticipantTimelinePage';
import ParticipantRulesPage from './pages/ParticipantRulesPage';
import ParticipantResultsHackathonosPage from './pages/ParticipantResultsHackathonosPage';

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
        <Route path="/participant/complete-profile" element={<CompleteProfileHackathonosPage />} />
        <Route path="/participant/profile" element={<MyProfileHackathonosPage />} />
        <Route path="/participant/team" element={<MyTeamLeaderViewHackathonosPage />} />
        <Route path="/participant/team/create" element={<MyTeamLeaderViewHackathonosPage />} />
        <Route path="/participant/team/browse" element={<BrowseTeamsHackathonosPage />} />
        <Route path="/participant/team/join" element={<BrowseTeamsHackathonosPage />} />
        <Route path="/participant/team/requests" element={<BrowseTeamsHackathonosPage />} />
        <Route path="/participant/problem" element={<MyProblemStatementHackathonosPage />} />
        <Route path="/participant/submission" element={<ProjectSubmissionHackathonosPage />} />
        <Route path="/participant/announcements" element={<ParticipantAnnouncementsPage />} />
        <Route path="/participant/timeline" element={<ParticipantTimelinePage />} />
        <Route path="/participant/rules" element={<ParticipantRulesPage />} />
        <Route path="/participant/evaluation" element={<SubmissionStatusHackathonosPage />} />
        <Route path="/participant/results" element={<ParticipantResultsHackathonosPage />} />
        <Route path="/participant/certificate" element={<SubmissionStatusHackathonosPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
