// @ts-nocheck
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ParticipantSidebar from '../components/ParticipantSidebar';
import PageTransitionWrapper from '../components/PageTransitionWrapper';
import { saveSubmissionDraft } from '../services/submissionService';
import { useAuth } from '../contexts/AuthContext';
import { useCurrentTeam } from '../hooks/useCurrentTeam';

export default function Component() {
  const navigate = useNavigate();
  const { currentUser, profile } = useAuth();
  const { team, loading: teamLoading } = useCurrentTeam();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    projectTitle: 'Team Alpha - Automated Code Reviewer',
    problemStatement: '',
    description: '',
    proposedSolution: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await saveSubmissionDraft({
        projectTitle: formData.projectTitle,
        problemStatement: formData.problemStatement,
        description: formData.description,
        proposedSolution: formData.proposedSolution
      });
      alert('Problem Statement saved successfully!');
      navigate('/participant/submission');
    } catch (err) {
      console.error(err);
      alert('Failed to save problem statement');
    } finally {
      setLoading(false);
    }
  };

  const isLeader = profile?.teamRole === 'leader';

  if (teamLoading) {
    return (
      <div className="bg-surface min-h-screen text-on-surface font-sans">
        <div className="flex pt-16 min-h-screen">
          <ParticipantSidebar activeTab="problem" />
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
          <ParticipantSidebar activeTab="problem" />
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

  return (
    <div className="bg-surface min-h-screen text-on-surface font-sans selection:bg-primary/20 overflow-x-hidden">
      <div className="flex pt-16 min-h-screen">
        <ParticipantSidebar activeTab="problem" />

        <main className="flex-1 md:ml-64 p-6 lg:p-8 overflow-y-auto w-full overflow-x-hidden">
          <PageTransitionWrapper>
          <div className="max-w-container-max mx-auto w-full">
            <header className="mb-lg md:mb-xl flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-sm">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-surface-variant text-on-surface-variant">
                    Status: Draft
                  </span>
                </div>
                <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">My Problem Statement</h2>
                <p className="font-body-md text-body-md text-on-surface-variant mt-sm max-w-2xl">Define the core challenge your team is tackling. A clear, well-structured problem statement sets the foundation for a strong solution.</p>
              </div>
            </header>
            <div className="bg-surface-container-lowest rounded-xl custom-shadow border border-outline-variant overflow-hidden">
              <form 
                className="p-lg md:p-xl space-y-xl" 
                onSubmit={handleSubmit}
              >
                <section>
                  <h3 className="font-headline-md text-headline-md text-on-surface mb-md pb-sm border-b border-outline-variant flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-container text-on-primary-container text-xs font-bold">1</span>
                    Project Basics
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
                    <div className="col-span-1 md:col-span-2">
                      <label className="block font-label-md text-label-md text-on-surface mb-xs" htmlFor="projectTitle">Project Title <span className="text-error">*</span></label>
                      <input className="block w-full rounded-lg border-outline-variant shadow-sm focus:border-primary focus:ring-primary font-body-md text-body-md bg-surface-bright" id="projectTitle" name="projectTitle" placeholder="e.g., Neuro-Symbolic AI Optimizer" type="text" value={formData.projectTitle} onChange={handleChange} required/>
                      <p className="mt-sm font-caption text-caption text-on-surface-variant">A catchy, concise name for your project.</p>
                    </div>
                  </div>
                </section>

                <section>
                  <h3 className="font-headline-md text-headline-md text-on-surface mb-md pb-sm border-b border-outline-variant flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-surface-variant text-on-surface-variant text-xs font-bold">2</span>
                    Defining the Problem
                  </h3>
                  <div className="space-y-lg">
                    <div>
                      <label className="block font-label-md text-label-md text-on-surface mb-xs" htmlFor="problemStatement">Problem Statement (Short) <span className="text-error">*</span></label>
                      <textarea className="block w-full rounded-lg border-outline-variant shadow-sm focus:border-primary focus:ring-primary font-body-md text-body-md bg-surface-bright resize-none" id="problemStatement" name="problemStatement" placeholder="In one or two sentences, what is the core issue?" rows="2" value={formData.problemStatement} onChange={handleChange} required></textarea>
                      <p className="mt-sm font-caption text-caption text-on-surface-variant">The "elevator pitch" of the problem you are solving. Keep it under 280 characters.</p>
                    </div>
                    <div>
                      <label className="block font-label-md text-label-md text-on-surface mb-xs" htmlFor="description">Detailed Problem Description <span className="text-error">*</span></label>
                      <textarea className="block w-full rounded-lg border-outline-variant shadow-sm focus:border-primary focus:ring-primary font-body-md text-body-md bg-surface-bright resize-y" id="description" name="description" placeholder="Elaborate on the problem. Who does it affect? Why does it matter now?" rows="5" value={formData.description} onChange={handleChange} required></textarea>
                      <p className="mt-sm font-caption text-caption text-on-surface-variant">Provide context, statistics, and detail the pain points of the affected stakeholders. Why is current technology insufficient?</p>
                    </div>
                  </div>
                </section>

                <section>
                  <h3 className="font-headline-md text-headline-md text-on-surface mb-md pb-sm border-b border-outline-variant flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-surface-variant text-on-surface-variant text-xs font-bold">3</span>
                    Proposed Solution
                  </h3>
                  <div>
                    <label className="block font-label-md text-label-md text-on-surface mb-xs" htmlFor="proposedSolution">How will you solve this? <span className="text-error">*</span></label>
                    <textarea className="block w-full rounded-lg border-outline-variant shadow-sm focus:border-primary focus:ring-primary font-body-md text-body-md bg-surface-bright resize-y" id="proposedSolution" name="proposedSolution" placeholder="Describe your technical approach and expected impact." rows="6" value={formData.proposedSolution} onChange={handleChange} required></textarea>
                    <p className="mt-sm font-caption text-caption text-on-surface-variant">Outline your architecture, key technologies (e.g., React, TensorFlow, specific APIs), and how your solution directly addresses the detailed problem description.</p>
                  </div>
                </section>
                <div className="pt-lg border-t border-outline-variant flex justify-end gap-4">
                  <button className="inline-flex items-center justify-center rounded-lg bg-primary-container px-6 py-2.5 font-label-md text-label-md text-on-primary-container hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 custom-shadow disabled:opacity-50" type="submit" disabled={loading}>
                    {loading ? 'Saving...' : 'Save & Continue'}
                  </button>
                </div>
              </form>
            </div>
          </div>
          </PageTransitionWrapper>
        </main>
      </div>
    </div>
  );
}
