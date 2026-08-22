import { useEffect, useState } from 'react';
import { getAnnouncements, createAnnouncement, updateAnnouncement, deleteAnnouncement, publishAnnouncement, unpublishAnnouncement } from '../services/rulesService';
import { formatDistanceToNow } from 'date-fns';

export default function AdminAnnouncementsHackathonosPage() {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<any | null>(null);
  const [formData, setFormData] = useState({ title: '', content: '', priority: 'Normal', status: 'DRAFT' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const res = await getAnnouncements();
      setAnnouncements(res.data?.announcements || []);
    } catch (err) {
      console.error('Error fetching announcements:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleOpenModal = (announcement: any | null = null) => {
    if (announcement) {
      setEditingAnnouncement(announcement);
      setFormData({ title: announcement.title, content: announcement.content, priority: announcement.priority, status: announcement.status });
    } else {
      setEditingAnnouncement(null);
      setFormData({ title: '', content: '', priority: 'Normal', status: 'DRAFT' });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingAnnouncement(null);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingAnnouncement) {
        await updateAnnouncement(editingAnnouncement.id, formData);
      } else {
        await createAnnouncement(formData);
      }
      await fetchAnnouncements();
      handleCloseModal();
    } catch (err) {
      console.error('Error saving announcement:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePublish = async (id: string) => {
    if (confirm('Are you sure you want to publish this announcement?')) {
      try {
        await publishAnnouncement(id);
        await fetchAnnouncements();
      } catch (err) {
        console.error('Error publishing:', err);
      }
    }
  };

  const handleUnpublish = async (id: string) => {
    if (confirm('Are you sure you want to unpublish this announcement?')) {
      try {
        await unpublishAnnouncement(id);
        await fetchAnnouncements();
      } catch (err) {
        console.error('Error unpublishing:', err);
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this announcement? This action cannot be undone.')) {
      try {
        await deleteAnnouncement(id);
        await fetchAnnouncements();
      } catch (err) {
        console.error('Error deleting:', err);
      }
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Announcements</h1>
        <button onClick={() => handleOpenModal()} className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700">
          Create Announcement
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><span className="material-symbols-outlined animate-spin text-4xl">autorenew</span></div>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Updated</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {announcements.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={"px-2 inline-flex text-xs leading-5 font-semibold rounded-full " + (item.priority === 'Urgent' ? 'bg-red-100 text-red-800' : item.priority === 'Important' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800')}>
                      {item.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={"px-2 inline-flex text-xs leading-5 font-semibold rounded-full " + (item.status === 'PUBLISHED' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800')}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.updatedAt ? formatDistanceToNow(new Date(item.updatedAt._seconds ? item.updatedAt._seconds * 1000 : item.updatedAt), { addSuffix: true }) : ''}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                    <button onClick={() => handleOpenModal(item)} className="text-indigo-600 hover:text-indigo-900">Edit</button>
                    {item.status === 'PUBLISHED' ? (
                      <button onClick={() => handleUnpublish(item.id)} className="text-yellow-600 hover:text-yellow-900">Unpublish</button>
                    ) : (
                      <button onClick={() => handlePublish(item.id)} className="text-green-600 hover:text-green-900">Publish</button>
                    )}
                    <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-900">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
            <form onSubmit={handleSubmit}>
              <div className="p-6 border-b">
                <h3 className="text-lg font-medium">{editingAnnouncement ? 'Edit Announcement' : 'Create Announcement'}</h3>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Title</label>
                  <input type="text" required value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Content</label>
                  <textarea required rows={5} value={formData.content} onChange={(e) => setFormData({...formData, content: e.target.value})} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Priority</label>
                  <select value={formData.priority} onChange={(e) => setFormData({...formData, priority: e.target.value})} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                    <option value="Normal">Normal</option>
                    <option value="Important">Important</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
              </div>
              <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3 rounded-b-lg">
                <button type="button" onClick={handleCloseModal} className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50">
                  {editingAnnouncement ? 'Save Changes' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
