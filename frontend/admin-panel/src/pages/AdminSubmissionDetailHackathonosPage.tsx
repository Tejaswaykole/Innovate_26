import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getSubmissionDetails } from '../services/adminSubmissionService';
import type { AdminSubmissionDetail } from '../services/adminSubmissionService';

export const AdminSubmissionDetailHackathonosPage: React.FC = () => {
  const { submissionId } = useParams<{ submissionId: string }>();
  const [submission, setSubmission] = useState<AdminSubmissionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      if (submissionId) {
        const data = await getSubmissionDetails(submissionId);
        setSubmission(data);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load submission details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [submissionId]);

  if (loading) {
    return (
      <div className="p-8 text-center animate-pulse text-on-surface-variant flex flex-col items-center gap-4 pt-20">
        <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
        <p className="font-label-lg">Loading Project Data...</p>
      </div>
    );
  }

  if (error || !submission) {
    return (
      <div className="p-8 max-w-2xl mx-auto mt-12 bg-surface-container-low border border-outline-variant rounded-xl text-center">
        <span className="material-symbols-outlined text-[48px] text-error mb-4">error</span>
        <h2 className="font-headline-sm mb-2">{error || 'Submission Not Found'}</h2>
        <Link to="/submissions" className="text-primary hover:underline mt-4 inline-block">Return to Submissions</Link>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto w-full pb-20">
      
      {/* Read Only Banner */}
      <div className="bg-primary/10 border border-primary/20 text-on-primary-container px-4 py-3 rounded-lg mb-6 flex items-center gap-3">
        <span className="material-symbols-outlined text-primary">visibility</span>
        <span className="font-label-md"><strong>Read-Only Mode:</strong> Submissions cannot be edited to preserve judging integrity.</span>
      </div>

      <div className="flex items-center justify-between mb-6">
        <Link to="/submissions" className="inline-flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors">
          <span className="material-symbols-outlined">arrow_back</span>
          Back to Submissions
        </Link>
        <button 
          onClick={fetchDetails} 
          className="p-2 rounded-full hover:bg-surface-container-high transition-colors text-on-surface-variant flex items-center justify-center"
          title="Refresh Data"
        >
          <span className="material-symbols-outlined">refresh</span>
        </button>
      </div>

      {/* Header */}
      <div className="bg-surface-container-low border border-outline-variant/30 rounded-2xl p-6 md:p-8 shadow-sm mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-4">
          <div>
            <h1 className="font-headline-md text-headline-md text-on-surface">{submission.projectTitle}</h1>
            <div className="flex items-center gap-3 mt-2 text-on-surface-variant">
              <span className="font-label-lg text-primary">{submission.teamName}</span>
              <span className="w-1 h-1 bg-outline rounded-full"></span>
              <span className="font-mono text-sm bg-surface-container px-2 py-0.5 rounded border border-outline-variant/50">Code: {submission.teamCode}</span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase ${
              submission.status === 'SUBMITTED' ? 'bg-primary/10 text-primary border border-primary/20' : 'bg-surface-container-high text-on-surface-variant'
            }`}>
              {submission.status}
            </span>
            {submission.submittedAt && (
              <span className="text-xs text-on-surface-variant flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">schedule</span>
                {new Date(submission.submittedAt).toLocaleString()}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Content Column */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Judging Summary Block (Only if submitted) */}
          {submission.status === 'SUBMITTED' && (
            <div className="bg-surface-container-lowest border border-outline-variant/50 rounded-xl p-6">
              <h2 className="font-title-md text-on-surface flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-primary">gavel</span>
                Global Judging Progress
              </h2>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-3 bg-surface-container-low rounded-lg border border-outline-variant/30">
                  <div className="text-xs text-on-surface-variant mb-1">Expected</div>
                  <div className="font-headline-sm text-on-surface">{submission.judgingSummary.totalJudges}</div>
                </div>
                <div className="p-3 bg-success/5 border border-success/30 rounded-lg">
                  <div className="text-xs text-on-surface-variant mb-1">Completed</div>
                  <div className="font-headline-sm text-success">{submission.judgingSummary.completedEvaluations}</div>
                </div>
                <div className="p-3 bg-error/5 border border-error/30 rounded-lg">
                  <div className="text-xs text-on-surface-variant mb-1">Pending</div>
                  <div className="font-headline-sm text-error">{submission.judgingSummary.pendingEvaluations}</div>
                </div>
                <div className="p-3 bg-primary/5 border border-primary/30 rounded-lg">
                  <div className="text-xs text-on-surface-variant mb-1">Avg Score</div>
                  <div className="font-headline-sm font-mono text-primary">
                    {submission.judgingSummary.completedEvaluations > 0 ? submission.judgingSummary.averageScore : '—'}
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2 text-sm font-label-md bg-surface-container p-2 rounded text-on-surface-variant">
                <span className="material-symbols-outlined text-[18px]">info</span>
                Status: {submission.judgingSummary.judgingStatus}
              </div>
            </div>
          )}

          {/* Project Details */}
          <div className="bg-surface-container-lowest border border-outline-variant/50 rounded-xl overflow-hidden">
            <div className="p-4 border-b border-outline-variant/30 bg-surface-container-low">
              <h2 className="font-title-md text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined">description</span>
                Project Information
              </h2>
            </div>
            
            <div className="p-6 space-y-6">
              <div>
                <h3 className="font-label-md text-on-surface-variant mb-2 uppercase tracking-wider text-xs">Problem Statement</h3>
                <div className="bg-surface-container-lowest border border-outline-variant/30 p-4 rounded-lg text-on-surface font-body-md whitespace-pre-wrap">
                  {submission.problemStatement || <span className="text-outline-variant italic">Not provided</span>}
                </div>
              </div>

              <div>
                <h3 className="font-label-md text-on-surface-variant mb-2 uppercase tracking-wider text-xs">Description</h3>
                <div className="text-on-surface font-body-md whitespace-pre-wrap">
                  {submission.description || <span className="text-outline-variant italic">Not provided</span>}
                </div>
              </div>

              <div>
                <h3 className="font-label-md text-on-surface-variant mb-2 uppercase tracking-wider text-xs">Proposed Solution</h3>
                <div className="text-on-surface font-body-md whitespace-pre-wrap">
                  {submission.proposedSolution || <span className="text-outline-variant italic">Not provided</span>}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Column */}
        <div className="space-y-6">
          
          {/* External Links */}
          <div className="bg-surface-container-lowest border border-outline-variant/50 rounded-xl overflow-hidden">
             <div className="p-4 border-b border-outline-variant/30 bg-surface-container-low">
              <h2 className="font-title-md text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined">link</span>
                Project Links
              </h2>
            </div>
            <div className="p-4 space-y-3">
              <a 
                href={submission.githubUrl || '#'} 
                target="_blank" 
                rel="noopener noreferrer"
                onClick={(e) => { if (!submission.githubUrl) e.preventDefault(); }}
                className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                  submission.githubUrl 
                    ? 'border-outline-variant/50 hover:bg-surface-container hover:border-primary text-on-surface' 
                    : 'border-outline-variant/20 bg-surface-container-lowest text-outline-variant cursor-not-allowed'
                }`}
              >
                <span className="material-symbols-outlined">code</span>
                <div className="flex-1 overflow-hidden">
                  <div className="font-label-md">GitHub Repository</div>
                  <div className="text-xs truncate">{submission.githubUrl || 'Not provided'}</div>
                </div>
                {submission.githubUrl && <span className="material-symbols-outlined text-[16px]">open_in_new</span>}
              </a>

              <a 
                href={submission.demoUrl || '#'} 
                target="_blank" 
                rel="noopener noreferrer"
                onClick={(e) => { if (!submission.demoUrl) e.preventDefault(); }}
                className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                  submission.demoUrl 
                    ? 'border-outline-variant/50 hover:bg-surface-container hover:border-primary text-on-surface' 
                    : 'border-outline-variant/20 bg-surface-container-lowest text-outline-variant cursor-not-allowed'
                }`}
              >
                <span className="material-symbols-outlined">laptop_mac</span>
                <div className="flex-1 overflow-hidden">
                  <div className="font-label-md">Live Demo</div>
                  <div className="text-xs truncate">{submission.demoUrl || 'Not provided'}</div>
                </div>
                {submission.demoUrl && <span className="material-symbols-outlined text-[16px]">open_in_new</span>}
              </a>
            </div>
          </div>

          {/* Files */}
          <div className="bg-surface-container-lowest border border-outline-variant/50 rounded-xl overflow-hidden">
            <div className="p-4 border-b border-outline-variant/30 bg-surface-container-low">
              <h2 className="font-title-md text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined">folder</span>
                Uploaded Files
              </h2>
            </div>
            <div className="p-4 space-y-3">
               <a 
                href={submission.pptUrl || '#'} 
                target="_blank" 
                rel="noopener noreferrer"
                onClick={(e) => { if (!submission.pptUrl) e.preventDefault(); }}
                className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                  submission.pptUrl 
                    ? 'border-outline-variant/50 hover:bg-surface-container hover:border-primary text-on-surface' 
                    : 'border-outline-variant/20 bg-surface-container-lowest text-outline-variant cursor-not-allowed'
                }`}
              >
                <span className="material-symbols-outlined">slideshow</span>
                <div className="flex-1 overflow-hidden">
                  <div className="font-label-md">Presentation (PPT)</div>
                  <div className="text-xs truncate">{submission.pptUrl ? 'Link Provided' : 'Not provided'}</div>
                </div>
                {submission.pptUrl && <span className="material-symbols-outlined text-[16px]">open_in_new</span>}
              </a>

                <a 
                  href={submission.videoUrl || '#'} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  onClick={(e) => { if (!submission.videoUrl) e.preventDefault(); }}
                  className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                    submission.videoUrl 
                      ? 'border-outline-variant/50 hover:bg-surface-container hover:border-primary text-on-surface' 
                      : 'border-outline-variant/20 bg-surface-container-lowest text-outline-variant cursor-not-allowed'
                  }`}
                >
                  <span className="material-symbols-outlined">movie</span>
                  <div className="flex-1 overflow-hidden">
                    <div className="font-label-md">Demo Video</div>
                    <div className="text-xs truncate">{submission.videoUrl ? 'Link Provided' : 'Not provided'}</div>
                  </div>
                  {submission.videoUrl && <span className="material-symbols-outlined text-[16px]">open_in_new</span>}
                </a>

                <a 
                  href={submission.screenshotsUrl || '#'} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  onClick={(e) => { if (!submission.screenshotsUrl) e.preventDefault(); }}
                  className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                    submission.screenshotsUrl 
                      ? 'border-outline-variant/50 hover:bg-surface-container hover:border-primary text-on-surface' 
                      : 'border-outline-variant/20 bg-surface-container-lowest text-outline-variant cursor-not-allowed'
                  }`}
                >
                  <span className="material-symbols-outlined">image</span>
                  <div className="flex-1 overflow-hidden">
                    <div className="font-label-md">Screenshots / Images</div>
                    <div className="text-xs truncate">{submission.screenshotsUrl ? 'Link Provided' : 'Not provided'}</div>
                  </div>
                  {submission.screenshotsUrl && <span className="material-symbols-outlined text-[16px]">open_in_new</span>}
                </a>
            </div>
          </div>

          {/* Team Members */}
          <div className="bg-surface-container-lowest border border-outline-variant/50 rounded-xl overflow-hidden">
            <div className="p-4 border-b border-outline-variant/30 bg-surface-container-low flex justify-between items-center">
              <h2 className="font-title-md text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined">group</span>
                Team Roster
              </h2>
              <span className="text-xs bg-surface-container px-2 py-0.5 rounded-full">{submission.members.length} Members</span>
            </div>
            <div className="p-0">
              {submission.members.length === 0 ? (
                <div className="p-4 text-center text-sm text-outline-variant">No members found.</div>
              ) : (
                <ul className="divide-y divide-outline-variant/20">
                  {submission.members.map(member => (
                    <li key={member.uid} className="p-3 pl-4 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-xs">
                        {(member.name || 'U').charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <div className="font-label-md text-on-surface flex items-center gap-2">
                          {member.name || 'Unknown Member'}
                          {submission.leader?.uid === member.uid && (
                            <span className="material-symbols-outlined text-[14px] text-primary" title="Team Leader">star</span>
                          )}
                        </div>
                        <div className="text-xs text-on-surface-variant truncate">{member.email}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
