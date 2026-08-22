import { useEffect, useState } from 'react';
import { getRules, updateRules } from '../services/rulesService';
import ReactMarkdown from 'react-markdown';

export default function AdminRulesHackathonosPage() {
  const [rules, setRules] = useState<any | null>(null);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPreview, setIsPreview] = useState(false);

  const fetchRules = async () => {
    try {
      setLoading(true);
      const res = await getRules();
      if (res.data?.rules) {
        setRules(res.data.rules);
        setContent(res.data.rules.content || '');
      }
    } catch (err) {
      console.error('Error fetching rules:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRules();
  }, []);

  const handleSave = async (status: 'DRAFT' | 'PUBLISHED') => {
    setIsSubmitting(true);
    try {
      await updateRules({ content, status });
      await fetchRules();
      alert('Rules ' + (status === 'PUBLISHED' ? 'published' : 'saved as draft') + ' successfully.');
    } catch (err) {
      console.error('Error saving rules:', err);
      alert('Failed to save rules.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Hackathon Rules</h1>
          {rules && (
            <p className="text-sm text-gray-500 mt-1">
              Current Status: <span className="font-medium">{rules.status}</span>
            </p>
          )}
        </div>
        <div className="space-x-3">
          <button onClick={() => setIsPreview(!isPreview)} className="px-4 py-2 border border-gray-300 rounded text-sm font-medium hover:bg-gray-50">
            {isPreview ? 'Edit Mode' : 'Preview Mode'}
          </button>
          <button onClick={() => handleSave('DRAFT')} disabled={isSubmitting} className="px-4 py-2 bg-gray-100 text-gray-700 rounded text-sm font-medium hover:bg-gray-200 disabled:opacity-50">
            Save Draft
          </button>
          <button onClick={() => handleSave('PUBLISHED')} disabled={isSubmitting} className="px-4 py-2 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 disabled:opacity-50">
            Publish
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><span className="material-symbols-outlined animate-spin text-4xl">autorenew</span></div>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-hidden flex flex-col h-[700px]">
          {isPreview ? (
            <div className="p-8 overflow-y-auto prose prose-blue max-w-none">
              <ReactMarkdown>{content}</ReactMarkdown>
            </div>
          ) : (
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full h-full p-6 border-0 focus:ring-0 resize-none font-mono text-sm bg-gray-50"
              placeholder="Write your hackathon rules here using Markdown syntax..."
            />
          )}
        </div>
      )}
    </div>
  );
}
