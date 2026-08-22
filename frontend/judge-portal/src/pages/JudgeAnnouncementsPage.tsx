import { useEffect, useState } from 'react';
import { getPublishedAnnouncements } from '../services/apiService'; // Adjust import if needed, you might need a new service call
import { formatDistanceToNow } from 'date-fns';

export default function JudgeAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const res = await getPublishedAnnouncements();
        setAnnouncements(res.data?.announcements || []);
      } catch (err) {
        console.error('Error fetching announcements:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnnouncements();
  }, []);

  return (
    <div className="p-lg max-w-container-max mx-auto w-full">
      <div className="space-y-6">
        <h1 className="font-headline-lg text-headline-lg text-on-surface">Announcements</h1>
        
        {loading ? (
          <div className="flex justify-center py-10">
            <span className="material-symbols-outlined animate-spin text-primary text-4xl">autorenew</span>
          </div>
        ) : announcements.length === 0 ? (
          <div className="text-center py-12 bg-surface-container-lowest rounded-xl border border-outline-variant">
            <span className="material-symbols-outlined text-[48px] text-outline mb-2">campaign</span>
            <p className="font-body-lg text-on-surface-variant">No announcements available.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {announcements.map((announcement) => (
              <div key={announcement.id} className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant relative overflow-hidden">
                {announcement.priority === 'Urgent' && (
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-error"></div>
                )}
                {announcement.priority === 'Important' && (
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-secondary"></div>
                )}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2">
                    {announcement.priority === 'Urgent' && <span className="px-2 py-1 bg-error-container text-on-error-container text-xs font-bold rounded-md">URGENT</span>}
                    {announcement.priority === 'Important' && <span className="px-2 py-1 bg-secondary-container text-on-secondary-container text-xs font-bold rounded-md">IMPORTANT</span>}
                    <h2 className="font-headline-md text-on-surface">{announcement.title}</h2>
                  </div>
                  <span className="text-sm text-on-surface-variant">
                    {announcement.publishedAt ? formatDistanceToNow(new Date(announcement.publishedAt._seconds ? announcement.publishedAt._seconds * 1000 : announcement.publishedAt), { addSuffix: true }) : ''}
                  </span>
                </div>
                <div className="whitespace-pre-wrap text-on-surface-variant font-body-md">
                  {announcement.content}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}