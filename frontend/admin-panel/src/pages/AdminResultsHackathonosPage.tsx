import React, { useState, useEffect, useMemo } from 'react';
import { getResults, publishResults, unpublishResults } from '../services/adminResultService';
import type { AdminResultsData } from '../services/adminResultService';

export const AdminResultsHackathonosPage: React.FC = () => {
  const [data, setData] = useState<AdminResultsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isPublishing, setIsPublishing] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const resultData = await getResults();
      setData(resultData);
    } catch (err: any) {
      setError(err.message || 'Failed to load results.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handlePublish = async () => {
    setIsPublishing(true);
    setError(null);
    try {
      await publishResults();
      await fetchData();
      setShowConfirm(false);
    } catch (err: any) {
      setError(err.message || 'Failed to publish results.');
    } finally {
      setIsPublishing(false);
    }
  };

  const handleUnpublish = async () => {
    setIsPublishing(true);
    setError(null);
    try {
      await unpublishResults();
      await fetchData();
    } catch (err: any) {
      setError(err.message || 'Failed to unpublish results.');
    } finally {
      setIsPublishing(false);
    }
  };

  const filteredRankings = useMemo(() => {
    if (!data?.rankings) return [];
    return data.rankings.filter(r => {
      const searchLower = searchTerm.toLowerCase();
      return r.teamName.toLowerCase().includes(searchLower) ||
             r.teamCode.toLowerCase().includes(searchLower) ||
             r.projectTitle.toLowerCase().includes(searchLower);
    });
  }, [data, searchTerm]);

  if (loading && !data) {
    return (
      <div className="p-8 text-center animate-pulse text-on-surface-variant flex flex-col items-center gap-4 pt-20">
        <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
        <p className="font-label-lg">Loading Official Results...</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1400px] mx-auto w-full pb-20">
      
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="font-headline-md text-headline-md text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[32px]">emoji_events</span>
            Results & Rankings
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-2 max-w-2xl">
            Authoritative backend-calculated scores and competition rankings.
          </p>
        </div>
        <button 
          onClick={fetchData} 
          disabled={isPublishing}
          className="p-2 rounded-full hover:bg-surface-container-high transition-colors text-on-surface-variant flex items-center gap-2 disabled:opacity-50"
          title="Refresh Data"
        >
          <span className="material-symbols-outlined">refresh</span>
          <span className="sr-only">Refresh</span>
        </button>
      </div>

      {error && (
        <div className="bg-error/10 border border-error/20 text-error p-4 rounded-lg mb-8 font-body-md flex items-center gap-3">
          <span className="material-symbols-outlined">error</span>
          <div>
            <p>{error}</p>
            <button onClick={fetchData} className="text-sm underline mt-1">Retry</button>
          </div>
        </div>
      )}

      {/* Status Banner */}
      {data && (
        <div className={`p-6 rounded-2xl mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border ${
          data.status === 'PUBLISHED' 
            ? 'bg-success/10 border-success/30 text-on-surface' 
            : data.status === 'PREVIEW'
              ? 'bg-primary/10 border-primary/30 text-on-surface'
              : 'bg-surface-container-low border-outline-variant/50 text-on-surface'
        }`}>
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              data.status === 'PUBLISHED' 
                ? 'bg-success text-on-success' 
                : data.status === 'PREVIEW'
                  ? 'bg-primary text-on-primary'
                  : 'bg-surface-container-highest text-on-surface-variant'
            }`}>
              <span className="material-symbols-outlined text-[24px]">
                {data.status === 'PUBLISHED' ? 'verified' : data.status === 'PREVIEW' ? 'visibility' : 'pending'}
              </span>
            </div>
            <div>
              <h2 className="font-title-lg mb-1">
                {data.status === 'PUBLISHED' ? 'RESULTS PUBLISHED' : data.status === 'PREVIEW' ? 'RESULT PREVIEW — NOT PUBLISHED' : 'RESULTS NOT READY'}
              </h2>
              <p className="text-sm opacity-80">
                {data.status === 'PUBLISHED' 
                  ? `These are the official final rankings. Published at: ${data.publishedAt ? new Date(data.publishedAt).toLocaleString() : 'Unknown'}`
                  : data.status === 'PREVIEW'
                    ? 'Judging is complete. Review the final rankings before publishing.'
                    : data.message || 'Complete all expected evaluations to generate results.'
                }
              </p>
            </div>
          </div>
          
          {(data.status === 'PREVIEW' || data.status === 'PUBLISHED') && (
            <div className="flex items-center gap-3">
              {data.status === 'PUBLISHED' && (
                <button 
                  onClick={handleUnpublish}
                  disabled={isPublishing}
                  className="px-6 py-2.5 bg-surface-container-highest text-on-surface rounded-full font-label-lg hover:bg-surface-container-highest/80 transition-colors shadow-sm flex items-center gap-2 flex-shrink-0 disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-[20px]">undo</span>
                  Unpublish
                </button>
              )}
              <button 
                onClick={() => setShowConfirm(true)}
                disabled={isPublishing}
                className="px-6 py-2.5 bg-primary text-on-primary rounded-full font-label-lg hover:bg-primary/90 transition-colors shadow-sm flex items-center gap-2 flex-shrink-0 disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-[20px]">{data.status === 'PUBLISHED' ? 'refresh' : 'publish'}</span>
                {data.status === 'PUBLISHED' ? 'Republish Results' : 'Publish Results'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Confirm Dialog */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 w-full max-w-md shadow-lg">
            <h3 className="font-title-lg text-on-surface mb-2 flex items-center gap-2 text-error">
              <span className="material-symbols-outlined">warning</span>
              Publish Final Results?
            </h3>
            <p className="text-on-surface-variant mb-6 font-body-md">
              This action will make the results official and immutable. You cannot unpublish or modify scores after this action.
            </p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setShowConfirm(false)}
                disabled={isPublishing}
                className="px-4 py-2 rounded-full font-label-md text-on-surface-variant hover:bg-surface-container-high transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handlePublish}
                disabled={isPublishing}
                className="px-6 py-2 rounded-full font-label-md bg-error text-on-error hover:bg-error/90 transition-colors flex items-center gap-2"
              >
                {isPublishing ? (
                  <>
                    <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                    Publishing...
                  </>
                ) : 'Yes, Publish Results'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Data Table */}
      {data && data.rankings && data.rankings.length > 0 && (
        <>
          <div className="relative w-full lg:w-96 mb-6">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
            <input 
              type="text" 
              placeholder="Search Team or Project..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-surface-container-lowest border border-outline-variant/50 rounded-full font-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            />
          </div>

          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/50 shadow-sm overflow-hidden overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-surface-container-low border-b border-outline-variant/50 text-on-surface-variant font-label-md">
                  <th className="p-4 pl-6 w-24">Rank</th>
                  <th className="p-4">Team</th>
                  <th className="p-4">Project</th>
                  <th className="p-4 w-32 text-right pr-6">Final Score</th>
                </tr>
              </thead>
              <tbody className="font-body-md text-on-surface divide-y divide-outline-variant/20">
                {filteredRankings.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-on-surface-variant italic">
                      No teams match your search.
                    </td>
                  </tr>
                ) : (
                  filteredRankings.map((r, i) => {
                    const isTie = i > 0 && r.rank === filteredRankings[i - 1].rank;
                    const isWinner = r.rank <= 3;
                    return (
                      <tr key={r.teamId} className={`transition-colors ${isWinner ? 'bg-primary/5 hover:bg-primary/10' : 'hover:bg-surface-container-lowest/50'}`}>
                        <td className="p-4 pl-6">
                          <div className="flex items-center gap-2">
                            {isWinner && <span className="material-symbols-outlined text-primary text-[18px]">workspace_premium</span>}
                            <span className={`font-headline-sm font-mono ${isWinner ? 'text-primary' : 'text-on-surface-variant'}`}>
                              #{r.rank}
                            </span>
                            {isTie && <span className="text-[10px] bg-surface-container-high px-1.5 py-0.5 rounded text-on-surface-variant uppercase tracking-wider">Tie</span>}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="font-label-lg">{r.teamName}</div>
                          <div className="text-on-surface-variant text-sm mt-1">{r.teamCode}</div>
                        </td>
                        <td className="p-4">
                          <div className="font-body-md text-on-surface">{r.projectTitle}</div>
                        </td>
                        <td className="p-4 text-right pr-6">
                          <span className={`font-bold font-mono px-3 py-1 rounded-lg border text-lg ${
                            isWinner ? 'bg-primary/10 text-primary border-primary/20' : 'bg-surface-container text-on-surface border-outline-variant/30'
                          }`}>
                            {r.finalScore.toFixed(2)}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

    </div>
  );
};
