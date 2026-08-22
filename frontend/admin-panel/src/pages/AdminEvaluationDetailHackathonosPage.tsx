import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getEvaluationDetails } from '../services/adminEvaluationService';
import type { AdminEvaluationDetail } from '../services/adminEvaluationService';

export const AdminEvaluationDetailHackathonosPage: React.FC = () => {
  const { evaluationId } = useParams<{ evaluationId: string }>();
  const [evaluation, setEvaluation] = useState<AdminEvaluationDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      if (evaluationId) {
        const data = await getEvaluationDetails(evaluationId);
        setEvaluation(data);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load evaluation details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [evaluationId]);

  if (loading) {
    return (
      <div className="p-8 text-center animate-pulse text-on-surface-variant flex flex-col items-center gap-4 pt-20">
        <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
        <p className="font-label-lg">Loading Evaluation Data...</p>
      </div>
    );
  }

  if (error || !evaluation) {
    return (
      <div className="p-8 max-w-2xl mx-auto mt-12 bg-surface-container-low border border-outline-variant rounded-xl text-center">
        <span className="material-symbols-outlined text-[48px] text-error mb-4">error</span>
        <h2 className="font-headline-sm mb-2">{error || 'Evaluation Not Found'}</h2>
        <Link to="/evaluations" className="text-primary hover:underline mt-4 inline-block">Return to Evaluations</Link>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto w-full pb-20">
      
      {/* Read Only Banner */}
      <div className="bg-primary/10 border border-primary/20 text-on-primary-container px-4 py-3 rounded-lg mb-6 flex items-center gap-3">
        <span className="material-symbols-outlined text-primary">gavel</span>
        <span className="font-label-md"><strong>Read-Only Mode:</strong> Evaluations cannot be modified. They are immutable independent records.</span>
      </div>

      <div className="flex items-center justify-between mb-6">
        <Link to="/evaluations" className="inline-flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors">
          <span className="material-symbols-outlined">arrow_back</span>
          Back to Evaluations
        </Link>
        <button 
          onClick={fetchDetails} 
          className="p-2 rounded-full hover:bg-surface-container-high transition-colors text-on-surface-variant flex items-center justify-center"
          title="Refresh Data"
        >
          <span className="material-symbols-outlined">refresh</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        
        {/* Judge Info */}
        <div className="bg-surface-container-low border border-outline-variant/30 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center">
              <span className="material-symbols-outlined">person</span>
            </div>
            <div>
              <h2 className="font-title-md text-on-surface">Judge</h2>
              <p className="text-xs text-on-surface-variant">Assigned Evaluator</p>
            </div>
          </div>
          <div className="space-y-1">
            <div className="font-label-lg text-on-surface">{evaluation.judgeName}</div>
            <div className="text-sm text-on-surface-variant">{evaluation.judgeEmail}</div>
          </div>
        </div>

        {/* Team Info */}
        <div className="bg-surface-container-low border border-outline-variant/30 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-tertiary-container text-on-tertiary-container flex items-center justify-center">
              <span className="material-symbols-outlined">groups</span>
            </div>
            <div>
              <h2 className="font-title-md text-on-surface">Team</h2>
              <p className="text-xs text-on-surface-variant">Project Being Evaluated</p>
            </div>
          </div>
          <div className="space-y-1">
            <div className="font-label-lg text-on-surface">{evaluation.teamName} <span className="text-xs bg-surface-container px-2 py-0.5 rounded ml-2">{evaluation.teamCode}</span></div>
            <div className="text-sm text-on-surface-variant truncate">{evaluation.projectTitle}</div>
          </div>
        </div>
      </div>

      {/* Evaluation Score Details */}
      <div className="bg-surface-container-lowest border border-outline-variant/50 rounded-xl overflow-hidden mb-6 shadow-sm">
        <div className="p-4 border-b border-outline-variant/30 bg-surface-container-low flex justify-between items-center">
          <h2 className="font-title-md text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined">fact_check</span>
            Evaluation Results
          </h2>
          <div className="flex items-center gap-4">
            {evaluation.submittedAt && (
              <span className="text-xs text-on-surface-variant flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">schedule</span>
                {new Date(evaluation.submittedAt).toLocaleString()}
              </span>
            )}
            <span className={`px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase ${
              evaluation.status === 'SUBMITTED' ? 'bg-success/10 text-success' : 'bg-surface-container-high text-on-surface-variant'
            }`}>
              {evaluation.status}
            </span>
          </div>
        </div>
        
        <div className="p-6">
          <div className="flex justify-between items-center bg-surface-container p-4 rounded-xl mb-6">
            <span className="font-title-lg text-on-surface">Total Score</span>
            <span className="font-headline-lg font-mono text-primary bg-primary/10 px-4 py-2 rounded-lg border border-primary/20">
              {evaluation.totalScore}
            </span>
          </div>

          <h3 className="font-label-lg text-on-surface-variant mb-4 uppercase tracking-wider text-xs">Criteria Breakdown</h3>
          
          {evaluation.criteriaScores && evaluation.criteriaScores.length > 0 ? (
            <div className="space-y-4">
              {evaluation.criteriaScores.map((c, i) => (
                <div key={c.id || i} className="bg-surface-container-lowest border border-outline-variant/30 p-4 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-label-lg text-on-surface">{c.title}</span>
                    <span className="font-mono text-primary font-bold bg-primary/5 px-2 py-1 rounded">{c.score} / {c.maxScore}</span>
                  </div>
                  {c.comments && (
                    <p className="text-sm text-on-surface-variant bg-surface-container/50 p-2 rounded italic">
                      "{c.comments}"
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-outline-variant text-sm italic p-4 bg-surface-container-lowest rounded-lg border border-outline-variant/30">
              No detailed criteria breakdown available.
            </p>
          )}

          {evaluation.overallFeedback && (
            <div className="mt-6">
              <h3 className="font-label-lg text-on-surface-variant mb-2 uppercase tracking-wider text-xs">Overall Feedback</h3>
              <div className="bg-surface-container-lowest border border-outline-variant/30 p-4 rounded-lg text-on-surface text-sm whitespace-pre-wrap">
                {evaluation.overallFeedback}
              </div>
            </div>
          )}

        </div>
      </div>

    </div>
  );
};
