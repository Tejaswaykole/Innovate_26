import React, { useState, useEffect } from 'react';
import { getHackathonConfig, updateHackathonConfig } from '../services/adminHackathonService';
import type { HackathonConfig } from '../services/adminHackathonService';

export const AdminHackathonHackathonosPage: React.FC = () => {
  const [config, setConfig] = useState<HackathonConfig>({
    name: '',
    description: '',
    status: 'DRAFT',
    currentTimelineStage: 1,
    registrationDeadline: null,
    teamFormationDate: null,
    hackingBeginsDate: null,
    submissionOpensDate: null,
    submissionDeadline: null,
    ceremonyDate: null,
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const fetchConfig = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getHackathonConfig();
      setConfig(data);
    } catch (err: any) {
      setError(err.message || 'Unable to load hackathon configuration.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setConfig(prev => ({ ...prev, [name]: value }));
  };

  const formatDatetimeLocal = (dateValue: string | Date | null | undefined): string => {
    if (!dateValue) return '';
    try {
      const date = new Date(dateValue);
      if (isNaN(date.getTime())) return '';
      const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
      if (isNaN(localDate.getTime())) return '';
      return localDate.toISOString().slice(0, 16);
    } catch {
      return '';
    }
  };

  const validateDates = () => {
    if (config.registrationDeadline && config.submissionDeadline) {
      if (new Date(config.registrationDeadline) > new Date(config.submissionDeadline)) {
        return 'Registration deadline cannot be after submission deadline.';
      }
    }
    return null;
  };

  const handleSave = async () => {
    setError(null);
    setSuccessMsg(null);
    
    if (!config.name.trim()) {
      setError('Hackathon Name is required.');
      setShowConfirm(false);
      return;
    }

    const dateError = validateDates();
    if (dateError) {
      setError(dateError);
      setShowConfirm(false);
      return;
    }

    setSaving(true);
    try {
      await updateHackathonConfig(config);
      setSuccessMsg('Hackathon configuration updated successfully.');
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Unable to save configuration.');
    } finally {
      setSaving(false);
      setShowConfirm(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center animate-pulse text-on-surface-variant">Loading configuration...</div>;
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto w-full pb-20">
      <div className="mb-8">
        <h1 className="font-headline-md text-headline-md text-on-surface">Hackathon Configuration</h1>
        <p className="font-body-md text-body-md text-on-surface-variant mt-2">
          Manage core hackathon details, deadlines, and global status.
        </p>
      </div>

      {error && (
        <div className="bg-error/10 border border-error/20 text-error p-4 rounded-lg mb-6 font-body-md flex items-center gap-3">
          <span className="material-symbols-outlined">error</span>
          {error}
        </div>
      )}

      {successMsg && (
        <div className="bg-success/10 border border-success/20 text-success p-4 rounded-lg mb-6 font-body-md flex items-center gap-3">
          <span className="material-symbols-outlined">check_circle</span>
          {successMsg}
        </div>
      )}

      <div className="bg-surface-container-low rounded-xl border border-outline-variant/30 shadow-sm overflow-hidden p-6 space-y-6">
        
        <div>
          <label className="block font-label-lg text-on-surface mb-2" htmlFor="name">
            Hackathon Name <span className="text-error">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={config.name}
            onChange={handleChange}
            placeholder="e.g. Innovative26"
            className="w-full bg-surface-container text-on-surface border border-outline-variant/50 rounded-lg px-4 py-3 font-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
          />
        </div>

        <div>
          <label className="block font-label-lg text-on-surface mb-2" htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={config.description}
            onChange={handleChange}
            rows={4}
            placeholder="Provide a brief overview of the event..."
            className="w-full bg-surface-container text-on-surface border border-outline-variant/50 rounded-lg px-4 py-3 font-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-y"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block font-label-lg text-on-surface mb-2" htmlFor="registrationDeadline">
              Registration Deadline (Local Time)
            </label>
            <input
              type="datetime-local"
              id="registrationDeadline"
              name="registrationDeadline"
              value={formatDatetimeLocal(config.registrationDeadline)}
              onChange={(e) => handleChange({ target: { name: 'registrationDeadline', value: e.target.value ? new Date(e.target.value).toISOString() : '' } } as any)}
              className="w-full bg-surface-container text-on-surface border border-outline-variant/50 rounded-lg px-4 py-3 font-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            />
          </div>

          <div>
            <label className="block font-label-lg text-on-surface mb-2" htmlFor="teamFormationDate">
              Team Formation Deadline (Local Time)
            </label>
            <input
              type="datetime-local"
              id="teamFormationDate"
              name="teamFormationDate"
              value={formatDatetimeLocal(config.teamFormationDate)}
              onChange={(e) => handleChange({ target: { name: 'teamFormationDate', value: e.target.value ? new Date(e.target.value).toISOString() : '' } } as any)}
              className="w-full bg-surface-container text-on-surface border border-outline-variant/50 rounded-lg px-4 py-3 font-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            />
          </div>
          
          <div>
            <label className="block font-label-lg text-on-surface mb-2" htmlFor="hackingBeginsDate">
              Hacking Begins (Local Time)
            </label>
            <input
              type="datetime-local"
              id="hackingBeginsDate"
              name="hackingBeginsDate"
              value={formatDatetimeLocal(config.hackingBeginsDate)}
              onChange={(e) => handleChange({ target: { name: 'hackingBeginsDate', value: e.target.value ? new Date(e.target.value).toISOString() : '' } } as any)}
              className="w-full bg-surface-container text-on-surface border border-outline-variant/50 rounded-lg px-4 py-3 font-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            />
          </div>

          <div>
            <label className="block font-label-lg text-on-surface mb-2" htmlFor="submissionOpensDate">
              Submission Opens (Local Time)
            </label>
            <input
              type="datetime-local"
              id="submissionOpensDate"
              name="submissionOpensDate"
              value={formatDatetimeLocal(config.submissionOpensDate)}
              onChange={(e) => handleChange({ target: { name: 'submissionOpensDate', value: e.target.value ? new Date(e.target.value).toISOString() : '' } } as any)}
              className="w-full bg-surface-container text-on-surface border border-outline-variant/50 rounded-lg px-4 py-3 font-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            />
          </div>

          <div>
            <label className="block font-label-lg text-on-surface mb-2" htmlFor="submissionDeadline">
              Submission Deadline (Local Time)
            </label>
            <input
              type="datetime-local"
              id="submissionDeadline"
              name="submissionDeadline"
              value={formatDatetimeLocal(config.submissionDeadline)}
              onChange={(e) => handleChange({ target: { name: 'submissionDeadline', value: e.target.value ? new Date(e.target.value).toISOString() : '' } } as any)}
              className="w-full bg-surface-container text-on-surface border border-outline-variant/50 rounded-lg px-4 py-3 font-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            />
          </div>

          <div>
            <label className="block font-label-lg text-on-surface mb-2" htmlFor="ceremonyDate">
              Ceremony Date (Local Time)
            </label>
            <input
              type="datetime-local"
              id="ceremonyDate"
              name="ceremonyDate"
              value={formatDatetimeLocal(config.ceremonyDate)}
              onChange={(e) => handleChange({ target: { name: 'ceremonyDate', value: e.target.value ? new Date(e.target.value).toISOString() : '' } } as any)}
              className="w-full bg-surface-container text-on-surface border border-outline-variant/50 rounded-lg px-4 py-3 font-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block font-label-lg text-on-surface mb-2" htmlFor="status">
            Event Status
          </label>
          <select
            id="status"
            name="status"
            value={config.status}
            onChange={handleChange}
            className="w-full bg-surface-container text-on-surface border border-outline-variant/50 rounded-lg px-4 py-3 font-body-md focus:outline-none focus:border-primary appearance-none pr-10 relative bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M7%2010L12%2015L17%2010%22%20stroke%3D%22%23c4c7c5%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22/%3E%3C/svg%3E')] bg-no-repeat bg-[right_12px_center]"
          >
            <option value="DRAFT">Draft</option>
            <option value="REGISTRATION_OPEN">Registration Open</option>
            <option value="REGISTRATION_CLOSED">Registration Closed</option>
            <option value="SUBMISSION_OPEN">Submission Open</option>
            <option value="SUBMISSION_CLOSED">Submission Closed</option>
            <option value="JUDGING_OPEN">Judging Open</option>
            <option value="JUDGING_CLOSED">Judging Closed</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>

        <div>
          <label className="block font-label-lg text-on-surface mb-2" htmlFor="currentTimelineStage">
            Current Timeline Stage
          </label>
          <select
            id="currentTimelineStage"
            name="currentTimelineStage"
            value={config.currentTimelineStage}
            onChange={(e) => handleChange({ target: { name: 'currentTimelineStage', value: Number(e.target.value) } } as any)}
            className="w-full bg-surface-container text-on-surface border border-outline-variant/50 rounded-lg px-4 py-3 font-body-md focus:outline-none focus:border-primary appearance-none pr-10 relative bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M7%2010L12%2015L17%2010%22%20stroke%3D%22%23c4c7c5%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22/%3E%3C/svg%3E')] bg-no-repeat bg-[right_12px_center]"
          >
            <option value={1}>Stage 1: Registration</option>
            <option value={2}>Stage 2: Team Formation</option>
            <option value={3}>Stage 3: Hacking Begins</option>
            <option value={4}>Stage 4: Submission</option>
            <option value={5}>Stage 5: Ceremony</option>
          </select>
        </div>

        <div className="pt-6 border-t border-outline-variant/30 flex justify-end">
          <button
            onClick={() => setShowConfirm(true)}
            disabled={saving}
            className="bg-primary text-on-primary px-6 py-2.5 rounded-full font-label-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {saving ? <span className="material-symbols-outlined animate-spin text-[20px]">refresh</span> : <span className="material-symbols-outlined text-[20px]">save</span>}
            Save Changes
          </button>
        </div>
      </div>

      {/* Confirmation Dialog */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface-container-low rounded-2xl p-6 max-w-sm w-full shadow-xl border border-outline-variant/20">
            <h3 className="font-title-lg text-on-surface mb-2">Save Hackathon Configuration?</h3>
            <p className="font-body-md text-on-surface-variant mb-6">
              This will update the global configuration for the hackathon. Are you sure you want to proceed?
            </p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 font-label-md text-primary hover:bg-primary/10 rounded-full transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave}
                className="px-4 py-2 font-label-md bg-primary text-on-primary hover:bg-primary/90 rounded-full transition-colors"
              >
                Confirm Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
