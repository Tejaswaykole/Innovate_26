import React, { useState, useEffect } from 'react';
import { getProblemStatements, createProblemStatement, updateProblemStatement, reorderProblemStatements } from '../services/adminHackathonService';
import type { ProblemStatement } from '../services/adminHackathonService';

export const AdminProblemStatementsHackathonosPage: React.FC = () => {
  const [statements, setStatements] = useState<ProblemStatement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ title: '', description: '', status: 'Draft' });
  const [saving, setSaving] = useState(false);

  // Confirm State
  const [confirmAction, setConfirmAction] = useState<{ type: 'publish' | 'unpublish' | 'edit_published', id?: string } | null>(null);

  const fetchStatements = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProblemStatements();
      setStatements(data);
    } catch (err: any) {
      setError(err.message || 'Unable to load problem statements.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatements();
  }, []);

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData({ title: '', description: '', status: 'Draft' });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (stmt: ProblemStatement) => {
    if (stmt.status === 'Published') {
      setConfirmAction({ type: 'edit_published', id: stmt.id });
      setFormData({ title: stmt.title, description: stmt.description, status: stmt.status });
    } else {
      setEditingId(stmt.id);
      setFormData({ title: stmt.title, description: stmt.description, status: stmt.status });
      setIsModalOpen(true);
    }
  };

  const handleConfirmEditPublished = () => {
    setEditingId(confirmAction!.id!);
    setConfirmAction(null);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim()) {
      alert('Title and description are required.');
      return;
    }
    
    setSaving(true);
    try {
      if (editingId) {
        await updateProblemStatement(editingId, formData);
      } else {
        await createProblemStatement(formData);
      }
      setIsModalOpen(false);
      fetchStatements();
    } catch (err: any) {
      alert(err.message || 'Failed to save problem statement.');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = (stmt: ProblemStatement) => {
    setConfirmAction({
      type: stmt.status === 'Draft' ? 'publish' : 'unpublish',
      id: stmt.id
    });
  };

  const executeStatusChange = async () => {
    if (!confirmAction || !confirmAction.id) return;
    const stmt = statements.find(s => s.id === confirmAction.id);
    if (!stmt) return;

    try {
      const newStatus = confirmAction.type === 'publish' ? 'Published' : 'Draft';
      await updateProblemStatement(stmt.id, {
        title: stmt.title,
        description: stmt.description,
        status: newStatus
      });
      setConfirmAction(null);
      fetchStatements();
    } catch (err: any) {
      alert(err.message || 'Failed to update status.');
    }
  };

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === statements.length - 1) return;

    const newArr = [...statements];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    // Swap
    [newArr[index], newArr[targetIndex]] = [newArr[targetIndex], newArr[index]];
    
    // Reorder based on array position
    const updates = newArr.map((s, i) => ({ id: s.id, order: i }));
    
    // Optimistic UI update
    setStatements(newArr);

    try {
      await reorderProblemStatements(updates);
    } catch (err: any) {
      alert(err.message || 'Failed to reorder problem statements.');
      fetchStatements(); // Revert on failure
    }
  };

  if (loading) {
    return <div className="p-8 text-center animate-pulse text-on-surface-variant">Loading problem statements...</div>;
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1200px] mx-auto w-full pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="font-headline-md text-headline-md text-on-surface">Problem Statements</h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">
            Manage admin-defined problem statements, visibility, and ordering.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="bg-primary text-on-primary px-6 py-2.5 rounded-full font-label-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-[20px]">add</span>
          Create Problem Statement
        </button>
      </div>

      {error && (
        <div className="bg-error/10 border border-error/20 text-error p-4 rounded-lg mb-6 font-body-md">
          {error}
        </div>
      )}

      {statements.length === 0 ? (
        <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-12 text-center">
          <span className="material-symbols-outlined text-[48px] text-outline-variant mb-4">description</span>
          <h3 className="font-title-lg text-title-lg text-on-surface mb-2">No problem statements yet.</h3>
          <p className="font-body-md text-body-md text-on-surface-variant mb-6 max-w-md mx-auto">
            You haven't defined any problem statements. Participants will still be able to submit their own custom problem statements based on the hackathon format.
          </p>
          <button
            onClick={handleOpenCreate}
            className="text-primary font-label-lg hover:underline"
          >
            Create Problem Statement
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {statements.map((stmt, index) => (
            <div key={stmt.id} className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-5 shadow-sm flex flex-col sm:flex-row gap-6">
              
              {/* Order Controls */}
              <div className="flex sm:flex-col justify-center items-center gap-2">
                <button 
                  onClick={() => handleMove(index, 'up')}
                  disabled={index === 0}
                  className="p-1 rounded text-on-surface-variant hover:bg-surface-container disabled:opacity-30 transition-colors"
                  aria-label="Move Up"
                >
                  <span className="material-symbols-outlined">expand_less</span>
                </button>
                <span className="font-mono text-on-surface-variant text-sm font-bold w-6 text-center">{index + 1}</span>
                <button 
                  onClick={() => handleMove(index, 'down')}
                  disabled={index === statements.length - 1}
                  className="p-1 rounded text-on-surface-variant hover:bg-surface-container disabled:opacity-30 transition-colors"
                  aria-label="Move Down"
                >
                  <span className="material-symbols-outlined">expand_more</span>
                </button>
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-title-lg text-title-lg text-on-surface font-semibold">{stmt.title}</h3>
                  <span className={`px-2 py-1 rounded text-[11px] font-bold uppercase tracking-wider whitespace-nowrap ml-4 ${
                    stmt.status === 'Published' ? 'bg-success/20 text-success' : 'bg-surface-container-highest text-on-surface-variant'
                  }`}>
                    {stmt.status}
                  </span>
                </div>
                <p className="font-body-md text-body-md text-on-surface-variant line-clamp-3 mb-4">
                  {stmt.description}
                </p>
                
                <div className="flex items-center gap-4 text-sm">
                  <button 
                    onClick={() => handleOpenEdit(stmt)}
                    className="text-primary font-label-md hover:underline flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[16px]">edit</span>
                    Edit
                  </button>
                  <button 
                    onClick={() => handleToggleStatus(stmt)}
                    className="text-on-surface-variant font-label-md hover:text-on-surface transition-colors flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      {stmt.status === 'Draft' ? 'publish' : 'visibility_off'}
                    </span>
                    {stmt.status === 'Draft' ? 'Publish' : 'Unpublish'}
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface-container-low rounded-2xl border border-outline-variant/30 shadow-xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-outline-variant/30 flex justify-between items-center bg-surface-container-lowest">
              <h2 className="font-title-lg text-title-lg text-on-surface">
                {editingId ? 'Edit Problem Statement' : 'Create Problem Statement'}
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-surface-container text-on-surface-variant transition-colors"
                aria-label="Close"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <form id="ps-form" onSubmit={handleSave} className="space-y-6">
                <div>
                  <label className="block font-label-md text-on-surface mb-2" htmlFor="title">
                    Title <span className="text-error">*</span>
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full bg-surface-container text-on-surface border border-outline-variant/50 rounded-lg px-4 py-2 font-body-md focus:outline-none focus:border-primary transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block font-label-md text-on-surface mb-2" htmlFor="description">
                    Description <span className="text-error">*</span>
                  </label>
                  <textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows={6}
                    className="w-full bg-surface-container text-on-surface border border-outline-variant/50 rounded-lg px-4 py-2 font-body-md focus:outline-none focus:border-primary transition-all resize-y"
                    required
                  />
                </div>
              </form>
            </div>

            <div className="px-6 py-4 border-t border-outline-variant/30 bg-surface-container-lowest flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2 font-label-md text-primary hover:bg-primary/10 rounded-full transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="ps-form"
                disabled={saving}
                className="px-6 py-2 font-label-md bg-primary text-on-primary hover:bg-primary/90 rounded-full transition-colors disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modals */}
      {confirmAction && confirmAction.type === 'edit_published' && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-surface-container-low rounded-2xl p-6 max-w-sm w-full shadow-xl border border-outline-variant/20">
            <h3 className="font-title-lg text-on-surface mb-2 flex items-center gap-2">
              <span className="material-symbols-outlined text-error">warning</span>
              Warning
            </h3>
            <p className="font-body-md text-on-surface-variant mb-6">
              This problem statement is currently published and may already be visible to participants. Are you sure you want to edit it?
            </p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setConfirmAction(null)} className="px-4 py-2 font-label-md text-primary hover:bg-primary/10 rounded-full">Cancel</button>
              <button onClick={handleConfirmEditPublished} className="px-4 py-2 font-label-md bg-error text-on-error hover:bg-error/90 rounded-full">Proceed to Edit</button>
            </div>
          </div>
        </div>
      )}

      {confirmAction && (confirmAction.type === 'publish' || confirmAction.type === 'unpublish') && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-surface-container-low rounded-2xl p-6 max-w-sm w-full shadow-xl border border-outline-variant/20">
            <h3 className="font-title-lg text-on-surface mb-2">
              {confirmAction.type === 'publish' ? 'Publish Problem Statement?' : 'Unpublish Problem Statement?'}
            </h3>
            <p className="font-body-md text-on-surface-variant mb-6">
              {confirmAction.type === 'publish' 
                ? 'This will make the problem statement visible to participants (if the portal reads it).' 
                : 'This will hide the problem statement from new participants. Existing submissions referencing it will remain valid.'}
            </p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setConfirmAction(null)} className="px-4 py-2 font-label-md text-primary hover:bg-primary/10 rounded-full">Cancel</button>
              <button onClick={executeStatusChange} className="px-4 py-2 font-label-md bg-primary text-on-primary hover:bg-primary/90 rounded-full">
                {confirmAction.type === 'publish' ? 'Publish' : 'Unpublish'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
