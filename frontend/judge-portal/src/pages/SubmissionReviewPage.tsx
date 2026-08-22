import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { fetchTeamSubmission } from '../services/evaluationService';

export default function SubmissionReviewPage() {
  const { teamId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [submission, setSubmission] = useState<any>(null);
  const [team, setTeam] = useState<any>(null);
  const [evaluation, setEvaluation] = useState<any>(null);
  const [judgingSummary, setJudgingSummary] = useState<any>(null);

  const loadSubmissionData = async () => {
    if (!teamId) return;
    setLoading(true);
    setError('');
    
    try {
      const res = await fetchTeamSubmission(teamId);
      setSubmission(res.data?.submission || null);
      setTeam(res.data?.team || null);
      setEvaluation(res.data?.evaluation || null);
      setJudgingSummary(res.data?.judgingSummary || null);
    } catch (err: any) {
      if (err.message.includes('FORBIDDEN') || err.message.includes('not eligible')) {
        setError('ACCESS_DENIED');
      } else {
        setError(err.message || 'Unable to load submission.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSubmissionData();
  }, [teamId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-surface p-8 animate-pulse flex flex-col gap-6">
        <div className="h-20 bg-surface-container rounded-xl w-full max-w-4xl mx-auto"></div>
        <div className="h-64 bg-surface-container rounded-xl w-full max-w-4xl mx-auto"></div>
        <div className="h-48 bg-surface-container rounded-xl w-full max-w-4xl mx-auto"></div>
      </div>
    );
  }

  if (error === 'ACCESS_DENIED') {
    return (
      <div className="min-h-screen bg-surface p-8 flex items-center justify-center">
        <div className="bg-error-container text-on-error-container p-8 rounded-2xl max-w-lg text-center shadow-md">
          <span className="material-symbols-outlined text-6xl mb-4">gpp_bad</span>
          <h1 className="text-2xl font-black mb-2">Access Denied</h1>
          <p className="font-medium mb-6">This team does not have an eligible submission to review.</p>
          <button onClick={() => navigate('/judge/assignments')} className="px-6 py-3 bg-on-error-container text-error-container font-bold rounded-xl transition-opacity hover:opacity-90">
            Back to Queue
          </button>
        </div>
      </div>
    );
  }

  if (error || !submission || !team) {
    return (
      <div className="min-h-screen bg-surface p-8 flex items-center justify-center">
        <div className="bg-surface-container p-8 rounded-2xl max-w-lg text-center border border-outline-variant">
          <span className="material-symbols-outlined text-6xl text-outline mb-4">error</span>
          <h1 className="text-2xl font-black text-on-surface mb-2">{error ? 'Error Loading Submission' : 'Submission Not Found'}</h1>
          <p className="text-secondary font-medium mb-6">{error || 'The submission for this team could not be found or has not been created yet.'}</p>
          <div className="flex gap-4 justify-center">
            <button onClick={() => navigate('/judge/assignments')} className="px-6 py-2 border border-outline-variant text-on-surface font-bold rounded-lg hover:bg-surface-container-high transition-colors">
              Go Back
            </button>
            {error && (
              <button onClick={loadSubmissionData} className="px-6 py-2 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-colors">
                Retry
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  const submittedDate = submission.submittedAt ? new Date(submission.submittedAt._seconds * 1000).toLocaleString('en-US', {
    day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit'
  }) : null;

  return (
    <div className="min-h-screen bg-surface pb-12">
      {/* Header */}
      <header className="bg-white border-b border-outline-variant sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/judge/assignments')} 
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container transition-colors"
              aria-label="Back to Assignments"
            >
              <span className="material-symbols-outlined text-on-surface">arrow_back</span>
            </button>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl font-black text-on-surface">{team.teamName}</h1>
                <span className="px-3 py-1 bg-surface-container-highest text-xs font-bold uppercase tracking-wider rounded-md border border-outline-variant">
                  Code: {team.joinCode || 'N/A'}
                </span>
              </div>
              <p className="text-sm text-secondary font-medium flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${submission.status === 'SUBMITTED' ? 'bg-green-500' : 'bg-amber-500'}`}></span>
                {submission.status || 'DRAFT'} {submittedDate && `• Submitted on ${submittedDate}`}
              </p>
            </div>
          </div>

          <div>
             <Link 
                to={`/judge/evaluate/${teamId}`} 
                className={`px-6 py-3 font-bold rounded-xl border shadow-sm flex items-center gap-2 transition-colors ${
                  evaluation?.status === 'SUBMITTED' || evaluation?.status === 'LOCKED'
                    ? 'bg-surface-container-high text-on-surface hover:bg-surface-container-highest border-outline-variant'
                    : 'bg-primary text-white hover:bg-primary/90 border-transparent'
                }`}
             >
               <span className="material-symbols-outlined text-lg">
                 {evaluation?.status === 'SUBMITTED' || evaluation?.status === 'LOCKED' ? 'visibility' : 'edit_document'}
               </span>
               {evaluation?.status === 'SUBMITTED' || evaluation?.status === 'LOCKED' ? 'View Evaluation' : 'Start Evaluation'}
             </Link>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Main Content Column */}
        <div className="md:col-span-2 space-y-8">
          
          <section className="bg-white p-8 rounded-2xl border border-outline-variant shadow-sm">
            <h2 className="text-sm font-bold text-secondary uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">lightbulb</span>
              Project Details
            </h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-black text-on-surface mb-2">Project Title</h3>
                <p className="text-on-surface-variant font-medium text-lg">{submission.projectTitle || 'No title provided.'}</p>
              </div>

              <div>
                <h3 className="font-bold text-on-surface mb-2">Problem Statement</h3>
                <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant prose max-w-none text-on-surface-variant text-sm">
                  {submission.problemStatement || 'Problem statement not available.'}
                </div>
              </div>

              <div>
                <h3 className="font-bold text-on-surface mb-2">Proposed Solution / Description</h3>
                <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant prose max-w-none text-on-surface-variant text-sm whitespace-pre-wrap leading-relaxed">
                  {submission.proposedSolution || 'No solution description submitted.'}
                </div>
              </div>
            </div>
          </section>

          {/* Links & Repository */}
          <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white p-6 rounded-2xl border border-outline-variant shadow-sm flex flex-col gap-4">
              <div className="flex items-center gap-3 text-on-surface">
                <span className="material-symbols-outlined text-3xl">code</span>
                <h3 className="font-bold text-lg">GitHub Repository</h3>
              </div>
              {submission.githubUrl ? (
                <a 
                  href={submission.githubUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="mt-auto block text-center px-4 py-2 bg-surface-container text-on-surface hover:bg-surface-container-highest transition-colors rounded-lg font-bold text-sm border border-outline-variant"
                >
                  Open Repository
                </a>
              ) : (
                <p className="mt-auto text-sm text-secondary font-medium bg-surface-container-lowest p-3 rounded-lg text-center border border-dashed border-outline-variant">
                  No repository submitted.
                </p>
              )}
            </div>

            <div className="bg-white p-6 rounded-2xl border border-outline-variant shadow-sm flex flex-col gap-4">
              <div className="flex items-center gap-3 text-on-surface">
                <span className="material-symbols-outlined text-3xl">open_in_new</span>
                <h3 className="font-bold text-lg">Live Demo</h3>
              </div>
              {submission.demoUrl ? (
                <a 
                  href={submission.demoUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="mt-auto block text-center px-4 py-2 bg-primary text-white hover:bg-primary/90 transition-colors rounded-lg font-bold text-sm shadow-sm"
                >
                  Open Live Demo
                </a>
              ) : (
                <p className="mt-auto text-sm text-secondary font-medium bg-surface-container-lowest p-3 rounded-lg text-center border border-dashed border-outline-variant">
                  No live demo submitted.
                </p>
              )}
            </div>
          </section>

          {/* Media Attachments */}
          <section className="bg-white p-8 rounded-2xl border border-outline-variant shadow-sm space-y-8">
            <h2 className="text-sm font-bold text-secondary uppercase tracking-widest flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">movie</span>
              Media Attachments
            </h2>
            
            {/* Video */}
            <div>
              <h3 className="font-bold text-on-surface mb-4">Demo Video</h3>
              {submission.videoUrl ? (
                <div className="flex items-center justify-between p-4 rounded-xl border border-outline-variant bg-surface-container-lowest">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-4xl text-primary">play_circle</span>
                    <div>
                      <p className="font-bold text-on-surface text-sm">Demo Video</p>
                      <p className="text-xs text-secondary">Available for review</p>
                    </div>
                  </div>
                  <a 
                    href={submission.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer" 
                    className="px-4 py-2 bg-surface-container text-on-surface font-bold text-sm rounded-lg hover:bg-surface-container-highest transition-colors border border-outline-variant"
                  >
                    View Video
                  </a>
                </div>
              ) : (
                <p className="text-sm text-secondary font-medium bg-surface-container-lowest p-4 rounded-xl text-center border border-dashed border-outline-variant">
                  No demo video submitted.
                </p>
              )}
            </div>

            {/* Presentation */}
            <div>
              <h3 className="font-bold text-on-surface mb-4">Project Presentation</h3>
              {submission.pptUrl ? (
                <div className="flex items-center justify-between p-4 rounded-xl border border-outline-variant bg-surface-container-lowest">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-4xl text-primary">slideshow</span>
                    <div>
                      <p className="font-bold text-on-surface text-sm">Presentation File</p>
                      <p className="text-xs text-secondary">Available for review</p>
                    </div>
                  </div>
                  <a 
                    href={submission.pptUrl}
                    target="_blank"
                    rel="noopener noreferrer" 
                    className="px-4 py-2 bg-surface-container text-on-surface font-bold text-sm rounded-lg hover:bg-surface-container-highest transition-colors border border-outline-variant"
                  >
                    View / Download
                  </a>
                </div>
              ) : (
                <p className="text-sm text-secondary font-medium bg-surface-container-lowest p-4 rounded-xl text-center border border-dashed border-outline-variant">
                  No presentation file submitted.
                </p>
              )}
            </div>

            {/* Screenshots */}
            <div>
              <h3 className="font-bold text-on-surface mb-4">Screenshots / Images</h3>
              {submission.screenshotsUrl ? (
                <div className="flex items-center justify-between p-4 rounded-xl border border-outline-variant bg-surface-container-lowest">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-4xl text-primary">image</span>
                    <div>
                      <p className="font-bold text-on-surface text-sm">Screenshots / Images</p>
                      <p className="text-xs text-secondary">Available for review</p>
                    </div>
                  </div>
                  <a 
                    href={submission.screenshotsUrl}
                    target="_blank"
                    rel="noopener noreferrer" 
                    className="px-4 py-2 bg-surface-container text-on-surface font-bold text-sm rounded-lg hover:bg-surface-container-highest transition-colors border border-outline-variant"
                  >
                    View Images
                  </a>
                </div>
              ) : (
                <p className="text-sm text-secondary font-medium bg-surface-container-lowest p-4 rounded-xl text-center border border-dashed border-outline-variant">
                  No screenshots submitted.
                </p>
              )}
            </div>
          </section>

        </div>

        {/* Sidebar Column */}
        <aside className="space-y-6">
          {judgingSummary && (
            <section className="bg-white p-6 rounded-2xl border border-outline-variant shadow-sm">
              <h2 className="text-sm font-bold text-secondary uppercase tracking-widest mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">analytics</span>
                Judging Summary
              </h2>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-outline-variant pb-2">
                  <span className="text-secondary font-medium text-sm">Judges Completed</span>
                  <span className="font-black text-on-surface">
                    {judgingSummary.completedJudges} / {judgingSummary.totalJudges}
                  </span>
                </div>
                
                <div className="flex justify-between items-center border-b border-outline-variant pb-2">
                  <span className="text-secondary font-medium text-sm">
                    {judgingSummary.status === 'COMPLETE' ? 'Final Score' : 'Provisional Average'}
                  </span>
                  <span className={`font-black text-lg ${judgingSummary.status === 'COMPLETE' ? 'text-primary' : 'text-amber-600'}`}>
                    {judgingSummary.averageScore ? judgingSummary.averageScore.toFixed(2) : '0.00'} <span className="text-xs text-secondary font-medium">/ 100</span>
                  </span>
                </div>
                
                <div className="flex justify-between items-center pb-2">
                  <span className="text-secondary font-medium text-sm">Status</span>
                  <span className={`font-bold text-xs px-2 py-1 rounded-md uppercase ${judgingSummary.status === 'COMPLETE' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                    {judgingSummary.status === 'COMPLETE' ? 'Judging Complete' : 'Awaiting Judges'}
                  </span>
                </div>
              </div>
            </section>
          )}

          <section className="bg-white p-6 rounded-2xl border border-outline-variant shadow-sm">
            <h2 className="text-sm font-bold text-secondary uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">group</span>
              Team Members
            </h2>
            
            <div className="space-y-3">
              {team.members && team.members.length > 0 ? (
                team.members.map((member: any, idx: number) => (
                  <div key={idx} className="flex items-center gap-3 p-3 rounded-xl border border-outline-variant bg-surface-container-lowest">
                    <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold">
                      {member.name?.[0]?.toUpperCase() || 'M'}
                    </div>
                    <div>
                      <p className="font-bold text-on-surface text-sm">{member.fullName || member.name || 'Unknown Member'}</p>
                      <p className="text-xs text-secondary">{member.uid === team.leaderUid ? 'Team Leader' : 'Member'}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-secondary text-center p-4 border border-dashed border-outline-variant rounded-xl bg-surface-container-lowest">
                  Member information unavailable.
                </p>
              )}
            </div>
          </section>
        </aside>

      </main>
    </div>
  );
}
