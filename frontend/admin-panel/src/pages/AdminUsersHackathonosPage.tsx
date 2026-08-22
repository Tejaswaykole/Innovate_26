import React, { useState, useEffect, useMemo } from 'react';
import { getUsers, updateUserRole, updateUserStatus } from '../services/adminUserService';
import type { AdminUser } from '../services/adminUserService';
import { useAuth } from '../contexts/AuthContext';

export const AdminUsersHackathonosPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Modals
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  
  // Action state
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  
  // Pending actions for confirmation dialogs
  const [pendingRoleChange, setPendingRoleChange] = useState<{user: AdminUser, newRole: string} | null>(null);
  const [pendingStatusChange, setPendingStatusChange] = useState<{user: AdminUser, disable: boolean} | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (err: any) {
      setError(err.message || 'Unable to load users.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      const q = search.trim().toLowerCase();
      const matchesSearch = !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
      const matchesRole = roleFilter === 'All' || u.role.toLowerCase() === roleFilter.toLowerCase();
      
      let matchesStatus = true;
      if (statusFilter === 'Active') matchesStatus = u.accountStatus === 'active';
      if (statusFilter === 'Disabled') matchesStatus = u.accountStatus === 'disabled';

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, search, roleFilter, statusFilter]);

  const handleRoleChangeRequest = (user: AdminUser, newRole: string) => {
    if (user.uid === currentUser?.uid && newRole !== 'admin') {
      alert("Changing your own role may remove Admin access. Please use another admin account for safety.");
      return;
    }
    setPendingRoleChange({ user, newRole });
  };

  const confirmRoleChange = async () => {
    if (!pendingRoleChange) return;
    const { user, newRole } = pendingRoleChange;
    
    setActionLoading(true);
    setActionError(null);
    setActionSuccess(null);
    try {
      await updateUserRole(user.uid, newRole);
      setActionSuccess('Role updated successfully.');
      setPendingRoleChange(null);
      if (selectedUser?.uid === user.uid) {
        setSelectedUser({ ...selectedUser, role: newRole });
      }
      fetchUsers();
    } catch (err: any) {
      setActionError(err.message || 'Unable to update user role.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleStatusChangeRequest = (user: AdminUser, disable: boolean) => {
    if (user.uid === currentUser?.uid) {
      alert("You cannot disable your own account.");
      return;
    }
    setPendingStatusChange({ user, disable });
  };

  const confirmStatusChange = async () => {
    if (!pendingStatusChange) return;
    const { user, disable } = pendingStatusChange;
    
    setActionLoading(true);
    setActionError(null);
    setActionSuccess(null);
    try {
      await updateUserStatus(user.uid, disable);
      setActionSuccess(`Account ${disable ? 'disabled' : 'enabled'} successfully.`);
      setPendingStatusChange(null);
      if (selectedUser?.uid === user.uid) {
        setSelectedUser({ ...selectedUser, accountStatus: disable ? 'disabled' : 'active' });
      }
      fetchUsers();
    } catch (err: any) {
      setActionError(err.message || 'Unable to update account status.');
    } finally {
      setActionLoading(false);
    }
  };

  if (error && users.length === 0) {
    return (
      <div className="p-6 lg:p-8 max-w-7xl mx-auto w-full">
        <div className="bg-error/10 rounded-xl p-8 border border-error/20 text-center flex flex-col items-center justify-center min-h-[400px]">
          <span className="material-symbols-outlined text-[48px] text-error mb-4">error</span>
          <h2 className="font-headline-sm text-headline-sm text-error mb-2">{error}</h2>
          <button onClick={fetchUsers} className="mt-6 bg-error text-on-error font-label-lg py-2 px-6 rounded-lg hover:bg-error/90 transition-colors">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1400px] mx-auto w-full pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="font-headline-md text-headline-md text-on-surface">User Management</h1>
          <p className="font-body-md text-body-md text-on-surface-variant">Total Users: {users.length}</p>
        </div>
        <button
          onClick={fetchUsers}
          aria-label="Refresh Users"
          className="flex items-center justify-center py-2 px-4 bg-surface-container-high text-on-surface hover:bg-surface-container-highest rounded-lg font-label-md transition-colors self-start sm:self-auto border border-outline-variant/30"
        >
          <span className="material-symbols-outlined text-[20px] mr-2">refresh</span>
          Refresh
        </button>
      </div>

      <div className="bg-surface-container-low rounded-xl border border-outline-variant/30 shadow-sm overflow-hidden flex flex-col">
        {/* Filters */}
        <div className="p-4 border-b border-outline-variant/30 flex flex-col md:flex-row gap-4 bg-surface-container-lowest">
          <div className="flex-1 relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-surface-container text-on-surface border border-outline-variant/50 rounded-lg pl-10 pr-4 py-2 font-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            />
          </div>
          <div className="flex gap-4">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-surface-container text-on-surface border border-outline-variant/50 rounded-lg px-4 py-2 font-body-md focus:outline-none focus:border-primary appearance-none pr-10 relative bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M7%2010L12%2015L17%2010%22%20stroke%3D%22%23c4c7c5%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22/%3E%3C/svg%3E')] bg-no-repeat bg-[right_8px_center]"
            >
              <option value="All">All Roles</option>
              <option value="participant">Participant</option>
              <option value="judge">Judge</option>
              <option value="admin">Admin</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-surface-container text-on-surface border border-outline-variant/50 rounded-lg px-4 py-2 font-body-md focus:outline-none focus:border-primary appearance-none pr-10 relative bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M7%2010L12%2015L17%2010%22%20stroke%3D%22%23c4c7c5%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22/%3E%3C/svg%3E')] bg-no-repeat bg-[right_8px_center]"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Disabled">Disabled</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-8 text-center animate-pulse">Loading users...</div>
          ) : filteredUsers.length === 0 ? (
            <div className="p-12 text-center">
              <span className="material-symbols-outlined text-[48px] text-outline-variant mb-4">search_off</span>
              <p className="font-body-lg text-body-lg text-on-surface-variant">No users match your search.</p>
              {(search || roleFilter !== 'All' || statusFilter !== 'All') && (
                <button
                  onClick={() => { setSearch(''); setRoleFilter('All'); setStatusFilter('All'); }}
                  className="mt-4 text-primary font-label-md hover:underline"
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-high border-b border-outline-variant/30">
                  <th className="px-4 py-3 font-label-md text-on-surface-variant whitespace-nowrap">Name</th>
                  <th className="px-4 py-3 font-label-md text-on-surface-variant whitespace-nowrap">Email</th>
                  <th className="px-4 py-3 font-label-md text-on-surface-variant whitespace-nowrap">Role</th>
                  <th className="px-4 py-3 font-label-md text-on-surface-variant whitespace-nowrap">Status</th>
                  <th className="px-4 py-3 font-label-md text-on-surface-variant whitespace-nowrap">Team</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20">
                {filteredUsers.map(u => (
                  <tr 
                    key={u.uid} 
                    className="hover:bg-surface-container-lowest transition-colors cursor-pointer"
                    onClick={() => setSelectedUser(u)}
                  >
                    <td className="px-4 py-3 font-body-md text-on-surface">{u.name || '—'}</td>
                    <td className="px-4 py-3 font-body-sm text-on-surface-variant">{u.email || '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-2 py-1 rounded text-[11px] font-bold uppercase tracking-wider ${
                        u.role === 'admin' ? 'bg-primary/20 text-primary' : 
                        u.role === 'judge' ? 'bg-tertiary/20 text-tertiary' : 
                        'bg-surface-container-highest text-on-surface-variant'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${u.accountStatus === 'disabled' ? 'bg-error' : 'bg-success'}`}></span>
                        <span className="font-body-sm text-on-surface capitalize">{u.accountStatus}</span>
                      </span>
                    </td>
                    <td className="px-4 py-3 font-body-sm text-on-surface-variant">{u.teamName || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface-container-low rounded-2xl border border-outline-variant/30 shadow-xl max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-outline-variant/30 flex justify-between items-center bg-surface-container-lowest">
              <h2 className="font-title-lg text-title-lg text-on-surface">User Details</h2>
              <button 
                onClick={() => setSelectedUser(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-surface-container text-on-surface-variant transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              {actionError && (
                <div className="mb-4 bg-error/10 border border-error/20 text-error p-3 rounded-lg flex items-start gap-2">
                  <span className="material-symbols-outlined text-[20px]">error</span>
                  <div className="flex-1 text-sm">{actionError}</div>
                </div>
              )}
              {actionSuccess && (
                <div className="mb-4 bg-success/10 border border-success/20 text-success p-3 rounded-lg flex items-start gap-2">
                  <span className="material-symbols-outlined text-[20px]">check_circle</span>
                  <div className="flex-1 text-sm">{actionSuccess}</div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 mb-6">
                <div>
                  <p className="font-label-sm text-on-surface-variant mb-1">Name</p>
                  <p className="font-body-md text-on-surface">{selectedUser.name || '—'}</p>
                </div>
                <div>
                  <p className="font-label-sm text-on-surface-variant mb-1">Email</p>
                  <p className="font-body-md text-on-surface">{selectedUser.email || '—'}</p>
                </div>
                <div>
                  <p className="font-label-sm text-on-surface-variant mb-1">Created Date</p>
                  <p className="font-body-md text-on-surface">
                    {selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleDateString() : '—'}
                  </p>
                </div>
                <div>
                  <p className="font-label-sm text-on-surface-variant mb-1">Team</p>
                  <p className="font-body-md text-on-surface">{selectedUser.teamName || 'No Team'}</p>
                </div>
              </div>

              <div className="border-t border-outline-variant/30 pt-6">
                <h3 className="font-title-sm text-on-surface mb-4">Administration</h3>
                
                <div className="bg-surface-container rounded-xl p-4 mb-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <p className="font-label-md text-on-surface mb-1">User Role</p>
                      <p className="font-body-sm text-on-surface-variant">Current: <span className="capitalize">{selectedUser.role}</span></p>
                    </div>
                    <div className="flex gap-2">
                      <select 
                        value={selectedUser.role}
                        onChange={(e) => handleRoleChangeRequest(selectedUser, e.target.value)}
                        disabled={actionLoading}
                        className="bg-surface-container-highest text-on-surface border-none rounded-lg px-3 py-1.5 font-label-md focus:ring-1 focus:ring-primary appearance-none cursor-pointer"
                      >
                        <option value="participant">Participant</option>
                        <option value="judge">Judge</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="bg-surface-container rounded-xl p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <p className="font-label-md text-on-surface mb-1">Account Status</p>
                      <p className="font-body-sm text-on-surface-variant">Current: <span className="capitalize">{selectedUser.accountStatus}</span></p>
                    </div>
                    <button
                      onClick={() => handleStatusChangeRequest(selectedUser, selectedUser.accountStatus !== 'disabled')}
                      disabled={actionLoading}
                      className={`px-4 py-1.5 rounded-lg font-label-md transition-colors ${
                        selectedUser.accountStatus === 'disabled' 
                        ? 'bg-success/10 text-success hover:bg-success/20'
                        : 'bg-error/10 text-error hover:bg-error/20'
                      }`}
                    >
                      {selectedUser.accountStatus === 'disabled' ? 'Enable Account' : 'Disable Account'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Role Change Confirmation Dialog */}
      {pendingRoleChange && (
        <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4">
          <div className="bg-surface-container-low rounded-xl max-w-sm w-full p-6 shadow-2xl">
            <h3 className="font-title-lg text-on-surface mb-2">Change User Role?</h3>
            <div className="mb-4 text-on-surface-variant font-body-sm space-y-1">
              <p>User: <span className="font-bold text-on-surface">{pendingRoleChange.user.name || pendingRoleChange.user.email}</span></p>
              <p>Current: <span className="capitalize font-bold">{pendingRoleChange.user.role}</span></p>
              <p>New: <span className="capitalize font-bold text-primary">{pendingRoleChange.newRole}</span></p>
            </div>
            <p className="font-body-sm text-error bg-error/10 p-3 rounded-lg mb-6">
              Warning: This will change the user's access to the platform.
            </p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setPendingRoleChange(null)}
                disabled={actionLoading}
                className="px-4 py-2 text-on-surface-variant hover:bg-surface-container rounded-lg font-label-md transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={confirmRoleChange}
                disabled={actionLoading}
                className="px-4 py-2 bg-primary text-on-primary hover:bg-primary/90 rounded-lg font-label-md transition-colors flex items-center gap-2"
              >
                {actionLoading && <span className="material-symbols-outlined animate-spin text-[16px]">sync</span>}
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Status Change Confirmation Dialog */}
      {pendingStatusChange && (
        <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4">
          <div className="bg-surface-container-low rounded-xl max-w-sm w-full p-6 shadow-2xl">
            <h3 className="font-title-lg text-on-surface mb-2">
              {pendingStatusChange.disable ? 'Disable Account?' : 'Enable Account?'}
            </h3>
            <p className="font-body-md text-on-surface-variant mb-4">
              User: <span className="font-bold text-on-surface">{pendingStatusChange.user.name || pendingStatusChange.user.email}</span>
            </p>
            <p className={`font-body-sm p-3 rounded-lg mb-6 ${pendingStatusChange.disable ? 'text-error bg-error/10' : 'text-success bg-success/10'}`}>
              {pendingStatusChange.disable 
                ? 'This user will lose access to the platform immediately.' 
                : 'This user will regain access to the platform.'}
            </p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setPendingStatusChange(null)}
                disabled={actionLoading}
                className="px-4 py-2 text-on-surface-variant hover:bg-surface-container rounded-lg font-label-md transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={confirmStatusChange}
                disabled={actionLoading}
                className={`px-4 py-2 rounded-lg font-label-md transition-colors flex items-center gap-2 ${
                  pendingStatusChange.disable ? 'bg-error text-on-error hover:bg-error/90' : 'bg-success text-on-primary hover:bg-success/90'
                }`}
              >
                {actionLoading && <span className="material-symbols-outlined animate-spin text-[16px]">sync</span>}
                {pendingStatusChange.disable ? 'Disable Account' : 'Enable Account'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
