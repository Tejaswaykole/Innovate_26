import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/firebase/client';
import { doc, onSnapshot } from 'firebase/firestore';
import { saveSubmissionDraft, submitFinalProject } from '../services/submissionService';
import { useCurrentTeam } from '../hooks/useCurrentTeam';
import ParticipantSidebar from '../components/ParticipantSidebar';

export const ProjectSubmissionHackathonosPage: React.FC = () => {
  const { profile } = useAuth();
  const { loading: teamLoading } = useCurrentTeam();
  const [submission, setSubmission] = useState<any>(null);
  
  const [title, setTitle] = useState('');
  const [problem, setProblem] = useState('');
  const [description, setDescription] = useState('');
  const [solution, setSolution] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [demoUrl, setDemoUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [pptUrl, setPptUrl] = useState('');
  const [screenshotsUrl, setScreenshotsUrl] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!profile?.teamId) return;
    
    const unsubscribe = onSnapshot(doc(db, 'submissions', profile.teamId), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setSubmission(data);
        setTitle(data.projectTitle || '');
        setProblem(data.problemStatement || '');
        setDescription(data.description || '');
        setSolution(data.proposedSolution || '');
        setGithubUrl(data.githubUrl || '');
        setDemoUrl(data.demoUrl || '');
        setVideoUrl(data.videoUrl || '');
        setPptUrl(data.pptUrl || '');
        setScreenshotsUrl(data.screenshotsUrl || '');
      }
    });
    return () => unsubscribe();
  }, [profile?.teamId]);

  const handleSaveDraft = async () => {
    setLoading(true); setError('');
    try {
      await saveSubmissionDraft({
        projectTitle: title,
        problemStatement: problem,
        description,
        proposedSolution: solution,
        githubUrl,
        demoUrl,
        pptUrl: pptUrl,
        videoUrl: videoUrl,
        screenshotsUrl: screenshotsUrl,
      });
      alert('Draft saved successfully!');
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleFinalSubmit = async () => {
    if (!window.confirm('Submit your project? After final submission, the project will be locked according to hackathon rules.')) return;
    
    setLoading(true); setError('');
    try {
      await saveSubmissionDraft({
        projectTitle: title,
        problemStatement: problem,
        description,
        proposedSolution: solution,
        githubUrl,
        demoUrl,
        pptUrl: pptUrl,
        videoUrl: videoUrl,
        screenshotsUrl: screenshotsUrl,
      });

      await submitFinalProject();
      alert('Project submitted successfully!');
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false);
  };

  const isLeader = profile?.teamRole === 'leader';
  const isLocked = submission?.status === 'SUBMITTED' || submission?.status === 'LOCKED';

  if (teamLoading) {
    return (
      <div className="bg-surface min-h-screen text-on-surface font-sans">
        <div className="flex pt-16 min-h-screen">
          <ParticipantSidebar activeTab="submission" />
          <main className="flex-1 md:ml-64 p-lg max-w-container-max mx-auto w-full flex items-center justify-center">
            <span className="material-symbols-outlined animate-spin text-4xl text-primary">sync</span>
          </main>
        </div>
      </div>
    );
  }

  if (!isLeader) {
    return (
      <div className="bg-surface min-h-screen text-on-surface font-sans">
        <div className="flex pt-16 min-h-screen">
          <ParticipantSidebar activeTab="submission" />
          <main className="flex-1 md:ml-64 p-lg max-w-container-max mx-auto w-full flex items-center justify-center">
            <div className="text-center bg-surface-container-low p-xl rounded-2xl border border-outline-variant max-w-md w-full">
              <span className="material-symbols-outlined text-6xl text-error mb-4 block">lock</span>
              <h2 className="font-headline-sm text-on-surface mb-2">Access Denied</h2>
              <p className="text-on-surface-variant font-body-md">
                Only the Team Leader is allowed to manage problem statements and project submissions.
              </p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (!profile?.teamId) {
    return (
      <div className="bg-surface min-h-screen text-on-surface font-sans">
        <div className="flex pt-16 min-h-screen">
          <ParticipantSidebar activeTab="submission" />
          <main className="flex-1 md:ml-64 p-lg max-w-container-max mx-auto w-full flex items-center justify-center">
            <div className="text-center bg-surface-container-low p-xl rounded-2xl border border-outline-variant max-w-md w-full text-error">
              You must be in a team to submit a project.
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface min-h-screen text-on-surface font-sans selection:bg-primary/20 overflow-x-hidden">
      <div className="flex pt-16 min-h-screen">
        <ParticipantSidebar activeTab="submission" />
        <main className="flex-1 md:ml-64 p-lg max-w-container-max mx-auto w-full">
          <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-2">Project Submission</h1>
            <p className="text-gray-600 mb-6">Status: <span className="font-bold uppercase">{submission?.status || 'NOT STARTED'}</span></p>

            {error && <div className="bg-red-100 text-red-700 p-4 rounded mb-6">{error}</div>}
            {isLocked && <div className="bg-yellow-100 text-yellow-800 p-4 rounded mb-6">You are viewing this project in read-only mode. The project is locked.</div>}

            <div className="space-y-4 border p-6 rounded shadow mb-8">
              <h2 className="text-xl font-semibold">1. Problem Statement & Description</h2>
              <div className="mb-4">
                <label className="block text-sm font-medium">Project Title</label>
                <input disabled={isLocked} className="border p-2 w-full" value={title} onChange={e => setTitle(e.target.value)} />
              </div>
        <div>
          <label className="block text-sm font-medium">Problem Statement (Open Ended)</label>
          <textarea disabled={isLocked} className="border p-2 w-full" rows={2} value={problem} onChange={e => setProblem(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium">Problem Description</label>
          <textarea disabled={isLocked} className="border p-2 w-full" rows={3} value={description} onChange={e => setDescription(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium">Proposed Solution</label>
          <textarea disabled={isLocked} className="border p-2 w-full" rows={3} value={solution} onChange={e => setSolution(e.target.value)} />
        </div>
      </div>

      <div className="space-y-4 border p-6 rounded shadow mb-8">
        <h2 className="text-xl font-semibold">2. Links & Media</h2>
        <div>
          <label className="block text-sm font-medium">GitHub Repository URL</label>
          <input disabled={isLocked} className="border p-2 w-full" value={githubUrl} onChange={e => setGithubUrl(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium">Demo URL (Optional, e.g. deployed site)</label>
          <input disabled={isLocked} className="border p-2 w-full" value={demoUrl} onChange={e => setDemoUrl(e.target.value)} />
        </div>
          <div>
            <label className="block text-sm font-medium">Demo Video (GDrive Link, Mandatory)</label>
            <input disabled={isLocked} className="border p-2 w-full" value={videoUrl} onChange={e => setVideoUrl(e.target.value)} placeholder="https://drive.google.com/..." />
          </div>
          <div>
            <label className="block text-sm font-medium">PPT Presentation (GDrive Link, Mandatory)</label>
            <input disabled={isLocked} className="border p-2 w-full" value={pptUrl} onChange={e => setPptUrl(e.target.value)} placeholder="https://drive.google.com/..." />
          </div>
          <div>
            <label className="block text-sm font-medium">Screenshots / Images (GDrive Link, Optional)</label>
            <input disabled={isLocked} className="border p-2 w-full" value={screenshotsUrl} onChange={e => setScreenshotsUrl(e.target.value)} placeholder="https://drive.google.com/..." />
          </div>
      </div>

      {!isLocked && (
        <div className="flex justify-end space-x-4">
          <button onClick={handleSaveDraft} disabled={loading} className="bg-gray-600 text-white px-6 py-2 rounded disabled:opacity-50">
            Save Draft
          </button>
          <button onClick={handleFinalSubmit} disabled={loading} className="bg-red-600 text-white px-6 py-2 rounded font-bold disabled:opacity-50">
            FINAL SUBMIT
          </button>
        </div>
      )}
          </div>
        </main>
      </div>
    </div>
  );
};
