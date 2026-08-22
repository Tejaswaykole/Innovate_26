import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/auth.middleware';
import { getDashboardStats, createJudge, assignJudge, publishResults, unpublishResults, getUsers, updateUserRole, updateUserStatus, getTeams, getHackathonConfig, updateHackathonConfig, getProblemStatements, createProblemStatement, updateProblemStatement, reorderProblemStatements, getJudges, getJudgingSummary, getSubmissions, getSubmissionDetails, getEvaluations, getEvaluationDetails, getEvaluationSummary, getResults, getAnalyticsOverview, exportAnalytics, getAnnouncements, createAnnouncement, updateAnnouncement, deleteAnnouncement, publishAnnouncement, unpublishAnnouncement, getRules, updateRules } from '../controllers/admin.controller';

const router = Router();

// All admin routes require an authenticated admin
router.use(requireAuth);
router.use(requireRole('admin'));

router.get('/dashboard', getDashboardStats);
router.post('/judges', createJudge);
router.post('/assignments', assignJudge);
router.get('/results', getResults);
router.post('/results/publish', publishResults);
router.post('/results/unpublish', unpublishResults);

router.get('/analytics/overview', getAnalyticsOverview);
router.get('/analytics/export/:type', exportAnalytics);

router.get('/users', getUsers);
router.patch('/users/:uid/role', updateUserRole);
router.patch('/users/:uid/status', updateUserStatus);

router.get('/teams', getTeams);

router.get('/hackathon', getHackathonConfig);
router.patch('/hackathon', updateHackathonConfig);

router.get('/problem-statements', getProblemStatements);
router.post('/problem-statements', createProblemStatement);
router.patch('/problem-statements/reorder', reorderProblemStatements);
router.patch('/problem-statements/:id', updateProblemStatement);

router.get('/judges', getJudges);
router.get('/judging-summary', getJudgingSummary);

router.get('/submissions', getSubmissions);
router.get('/submissions/:submissionId', getSubmissionDetails);

router.get('/evaluations/summary', getEvaluationSummary);
router.get('/evaluations', getEvaluations);
router.get('/evaluations/:evaluationId', getEvaluationDetails);

router.get('/announcements', getAnnouncements);
router.post('/announcements', createAnnouncement);
router.patch('/announcements/:id', updateAnnouncement);
router.delete('/announcements/:id', deleteAnnouncement);
router.post('/announcements/:id/publish', publishAnnouncement);
router.post('/announcements/:id/unpublish', unpublishAnnouncement);

router.get('/rules', getRules);
router.post('/rules', updateRules);

export default router;
