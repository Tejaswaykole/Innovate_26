import { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { fetchTeamSubmission, saveEvaluationDraft, submitFinalEvaluation } from '../services/evaluationService';

export default function EvaluationFormPage() {
  const { teamId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [team, setTeam] = useState<any>(null);
  const [submission, setSubmission] = useState<any>(null);
  const [evaluation, setEvaluation] = useState<any>(null);
  const [criteria, setCriteria] = useState<any[]>([]);
  const [judgingSummary, setJudgingSummary] = useState<any>(null);

  // Form State
  const [scores, setScores] = useState<Record<string, number>>({});
  const [feedback, setFeedback] = useState('');

  const loadData = async () => {
    if (!teamId) return;
    setLoading(true);
    setError('');
    
    try {
      const res = await fetchTeamSubmission(teamId);
      setTeam(res.data?.team || null);
      setSubmission(res.data?.submission || null);
      setJudgingSummary(res.data?.judgingSummary || null);
      
      const evalData = res.data?.evaluation || null;
      setEvaluation(evalData);
      setCriteria(res.data?.criteriaTemplate || []);

      // Populate existing scores if present
      if (evalData && evalData.criteriaScores) {
        const initialScores: Record<string, number> = {};
        evalData.criteriaScores.forEach((c: any) => {
          initialScores[c.id] = c.score;
        });
        setScores(initialScores);
        setFeedback(evalData.overallFeedback || '');
      }

    } catch (err: any) {
      if (err.message.includes('FORBIDDEN') || err.message.includes('not eligible')) {
        setError('ACCESS_DENIED');
      } else {
        setError(err.message || 'Unable to load evaluation data.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [teamId]);

  const handleScoreChange = (id: string, value: string, maxScore: number) => {
    let num = parseFloat(value);
    if (isNaN(num)) num = 0;
    if (num < 0) num = 0;
    if (num > maxScore) num = maxScore;
    
    setScores(prev => ({
      ...prev,
      [id]: num
    }));
  };

  const calculatedTotal = useMemo(() => {
    return Object.values(scores).reduce((sum, val) => sum + val, 0);
  }, [scores]);

  const maxTotalScore = useMemo(() => {
    return criteria.reduce((sum, c) => sum + c.maxScore, 0);
  }, [criteria]);

  const preparePayload = () => {
    const formattedScores = Object.entries(scores).map(([id, score]) => ({
      id,
      score
    }));
    return {
      criteriaScores: formattedScores,
      overallFeedback: feedback
    };
  };

  const validateForm = () => {
    setError('');
    const missingScores = criteria.some(c => scores[c.id] === undefined || scores[c.id] === null);
    if (missingScores) {
      setError('Please provide a score for all criteria before submitting.');
      return false;
    }
    if (!feedback.trim()) {
      setError('Please provide overall feedback before submitting.');
      return false;
    }
    return true;
  };

  const handleSaveDraft = async () => {
    if (!teamId) return;
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const payload = preparePayload();
      await saveEvaluationDraft(teamId, payload.criteriaScores, payload.overallFeedback);
      setSuccess('Draft saved successfully.');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to save draft.');
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async () => {
    if (!teamId) return;
    if (!validateForm()) return;

    if (!window.confirm('Are you sure you want to submit this evaluation? This action cannot be undone and you will not be able to edit it later.')) {
      return;
    }

    setSubmitting(true);
    setError('');
    setSuccess('');
    try {
      const payload = preparePayload();
      await submitFinalEvaluation(teamId, payload.criteriaScores, payload.overallFeedback);
      setSuccess('Evaluation submitted successfully.');
      
      // Reload to reflect locked state
      await loadData();
      
    } catch (err: any) {
      setError(err.message || 'Failed to submit evaluation.');
      setSubmitting(false); // only stop submitting if error, success leaves it locked anyway
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface p-8 animate-pulse flex flex-col gap-6 max-w-4xl mx-auto">
        <div className="h-16 bg-surface-container rounded-xl w-full"></div>
        <div className="h-48 bg-surface-container rounded-xl w-full"></div>
        <div className="h-48 bg-surface-container rounded-xl w-full"></div>
      </div>
    );
  }

  if (error === 'ACCESS_DENIED') {
    return (
      <div className="min-h-screen bg-surface p-8 flex items-center justify-center">
        <div className="bg-error-container text-on-error-container p-8 rounded-2xl max-w-lg text-center shadow-md">
          <span className="material-symbols-outlined text-6xl mb-4">gpp_bad</span>
          <h1 className="text-2xl font-black mb-2">Access Denied</h1>
          <p className="font-medium mb-6">This team does not have an eligible submission.</p>
          <button onClick={() => navigate('/judge/assignments')} className="px-6 py-3 bg-on-error-container text-error-container font-bold rounded-xl transition-opacity hover:opacity-90">
            Back to Queue
          </button>
        </div>
      </div>
    );
  }

  if (!team || !submission || !evaluation) {
    return (
      <div className="min-h-screen bg-surface p-8 flex items-center justify-center">
        <div className="bg-surface-container p-8 rounded-2xl max-w-lg text-center border border-outline-variant">
          <span className="material-symbols-outlined text-6xl text-outline mb-4">error</span>
          <h1 className="text-2xl font-black text-on-surface mb-2">Unable to load evaluation.</h1>
          <div className="flex gap-4 justify-center mt-6">
            <button onClick={() => navigate('/judge/assignments')} className="px-6 py-2 border border-outline-variant font-bold rounded-lg hover:bg-surface-container-high transition-colors">
              Go Back
            </button>
            <button onClick={loadData} className="px-6 py-2 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-colors">
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isLocked = evaluation.status === 'SUBMITTED' || evaluation.status === 'LOCKED';

  return (
    <div className="min-h-screen bg-surface pb-24">
      {/* Context Header */}
      <header className="bg-white border-b border-outline-variant sticky top-0 z-10 p-4 shadow-sm">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(`/judge/submissions/${teamId}`)} 
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container transition-colors"
            >
              <span className="material-symbols-outlined text-on-surface">arrow_back</span>
            </button>
            <div>
              <h1 className="text-xl font-black text-on-surface flex items-center gap-3">
                {team.teamName}
                {isLocked && (
                  <span className="bg-green-100 text-green-800 border border-green-200 text-xs px-2 py-1 rounded-md flex items-center gap-1 font-bold">
                    <span className="material-symbols-outlined text-sm">lock</span>
                    SUBMITTED
                  </span>
                )}
              </h1>
              <p className="text-sm text-secondary font-medium">Evaluation Form</p>
            </div>
          </div>
          <Link 
            to={`/judge/submissions/${teamId}`}
            className="px-4 py-2 border border-outline-variant font-bold text-sm rounded-lg hover:bg-surface-container transition-colors text-center"
          >
            View Submission
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 mt-8 space-y-8">
        
        {/* Global Notifications */}
        {error && error !== 'ACCESS_DENIED' && (
          <div className="bg-error-container text-on-error-container p-4 rounded-xl flex items-center gap-3">
            <span className="material-symbols-outlined">error</span>
            <p className="font-medium text-sm">{error}</p>
          </div>
        )}

        {success && (
          <div className="bg-green-100 text-green-900 border border-green-200 p-4 rounded-xl flex items-center gap-3">
            <span className="material-symbols-outlined">check_circle</span>
            <p className="font-medium text-sm">{success}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Main Scoring Column */}
          <div className="md:col-span-2 space-y-8">
            <section className="bg-white p-6 rounded-2xl border border-outline-variant shadow-sm">
              <h2 className="text-lg font-black text-on-surface mb-6 border-b border-outline-variant pb-4 flex items-center gap-2">
                <span className="material-symbols-outlined">list_alt</span>
                Scoring Criteria
              </h2>
              
              <div className="space-y-8">
                {criteria.map((c) => (
                  <div key={c.id} className="group">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <label className="font-bold text-on-surface text-base block mb-1">{c.name}</label>
                        <p className="text-xs text-secondary mb-2">Maximum Score: {c.maxScore}</p>
                      </div>
                      <div className="shrink-0 flex items-center gap-2">
                         <input 
                           type="number" 
                           min="0" 
                           max={c.maxScore}
                           value={scores[c.id] !== undefined ? scores[c.id] : ''}
                           onChange={(e) => handleScoreChange(c.id, e.target.value, c.maxScore)}
                           disabled={isLocked || submitting}
                           placeholder="0"
                           className="w-20 px-3 py-2 text-lg border border-outline-variant rounded-xl text-center font-bold font-mono focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none disabled:bg-surface-container disabled:text-outline"
                         />
                         <span className="text-on-surface-variant font-bold font-mono text-lg">/ {c.maxScore}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-white p-6 rounded-2xl border border-outline-variant shadow-sm">
              <h2 className="text-lg font-black text-on-surface mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined">rate_review</span>
                Overall Feedback
              </h2>
              <p className="text-sm text-secondary mb-4">Provide constructive feedback for the team. This feedback is required and will be reviewed by the organizers.</p>
              
              <textarea 
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                disabled={isLocked || submitting}
                placeholder="Enter detailed feedback here..."
                className="w-full h-40 p-4 bg-surface border border-outline-variant rounded-xl focus:border-primary focus:ring-1 focus:ring-primary transition-colors resize-y disabled:bg-surface-container disabled:text-secondary disabled:cursor-not-allowed"
              ></textarea>
            </section>
          </div>

          {/* Sticky Total & Actions Sidebar */}
          <div className="md:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-outline-variant shadow-sm sticky top-24">
              <h2 className="text-sm font-bold text-secondary uppercase tracking-widest mb-4">My Evaluation</h2>
              
              <div className="mb-6 flex flex-col items-center justify-center p-6 bg-surface-container-lowest border border-outline-variant rounded-xl">
                <p className="text-xs font-bold text-secondary uppercase mb-1">My Total Score</p>
                <div className="flex items-baseline gap-1 font-mono">
                  <span className={`text-5xl font-black ${calculatedTotal > 0 ? 'text-primary' : 'text-on-surface-variant'}`}>
                    {calculatedTotal}
                  </span>
                  <span className="text-xl text-on-surface-variant font-bold">/ {maxTotalScore}</span>
                </div>
              </div>

              {!isLocked ? (
                <div className="space-y-3">
                  <button 
                    onClick={handleSaveDraft}
                    disabled={saving || submitting}
                    className="w-full py-3 px-4 bg-surface-container text-on-surface font-bold rounded-xl border border-outline-variant hover:bg-surface-container-high transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {saving ? <span className="animate-spin material-symbols-outlined text-sm">refresh</span> : <span className="material-symbols-outlined text-sm">save</span>}
                    {saving ? 'Saving...' : 'Save Draft'}
                  </button>
                  
                  <button 
                    onClick={handleSubmit}
                    disabled={saving || submitting}
                    className="w-full py-3 px-4 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors shadow-sm active:scale-95 duration-150 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {submitting ? <span className="animate-spin material-symbols-outlined text-sm">refresh</span> : <span className="material-symbols-outlined text-sm">check_circle</span>}
                    {submitting ? 'Submitting...' : 'Submit Evaluation'}
                  </button>
                  <p className="text-[10px] text-center text-secondary mt-2 px-2">Submitting will lock this evaluation permanently.</p>
                </div>
              ) : (
                <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-center">
                  <span className="material-symbols-outlined text-green-600 text-3xl mb-2">task_alt</span>
                  <h3 className="font-bold text-green-900 mb-1">Evaluation Complete</h3>
                  <p className="text-xs text-green-700">This evaluation has been submitted and is now locked for review.</p>
                </div>
              )}
            </div>

            {judgingSummary && (
              <div className="bg-white p-6 rounded-2xl border border-outline-variant shadow-sm sticky top-[400px]">
                <h2 className="text-sm font-bold text-secondary uppercase tracking-widest mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">analytics</span>
                  Overall Judging
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
                      {judgingSummary.status === 'COMPLETE' ? 'Judging Complete' : `Awaiting ${judgingSummary.pendingJudges} Judge(s)`}
                    </span>
                  </div>

                  {judgingSummary.individualScores && judgingSummary.individualScores.length > 0 && (
                    <div className="pt-2">
                      <p className="text-xs font-bold text-secondary uppercase tracking-widest mb-2">Submitted Scores</p>
                      <div className="flex flex-wrap gap-2">
                        {judgingSummary.individualScores.map((scoreObj: any, idx: number) => (
                          <span key={idx} className="bg-surface-container text-on-surface text-xs font-bold px-2 py-1 rounded-md border border-outline-variant">
                            Judge {idx + 1}: {scoreObj.totalScore}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}
