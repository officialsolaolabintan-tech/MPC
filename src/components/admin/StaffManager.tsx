import React, { useState } from 'react';
import { Staff, StaffRole } from '../../types/index.ts';
import { Shield, Plus, Check, UserCheck, ShieldAlert } from 'lucide-react';

interface Props {
  staffList: Staff[];
  currentStaffRole: StaffRole;
  onAddStaff: (newStaff: Omit<Staff, 'uid' | 'createdAt'>) => void;
  onUpdateRole: (uid: string, role: StaffRole) => void;
  onToggleStatus: (uid: string) => void;
}

export const StaffManager: React.FC<Props> = ({
  staffList,
  currentStaffRole,
  onAddStaff,
  onUpdateRole,
  onToggleStatus,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<StaffRole>('sales_agent');

  const isSuperAdmin = currentStaffRole === 'super_admin';

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    onAddStaff({
      name,
      email,
      role,
      status: 'active',
    });

    setName('');
    setEmail('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Staff Accounts & Role-Based Access Control</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage operational personnel, staff permissions, and role designations across MPC departments
          </p>
        </div>

        {isSuperAdmin && (
          <button
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs flex items-center gap-1.5 transition-colors shadow-2xs whitespace-nowrap shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Staff Member</span>
          </button>
        )}
      </div>

      {!isSuperAdmin && (
        <div className="p-3.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 text-xs flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-slate-500 shrink-0" />
          <span>
            You are signed in as <strong>{currentStaffRole.replace('_', ' ').toUpperCase()}</strong>. Only a <strong>Super Admin</strong> can create new staff or modify departmental roles.
          </span>
        </div>
      )}

      {/* Staff Directory Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/70 border-b border-slate-100 text-slate-500 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4">Staff Member</th>
                <th className="py-3 px-4">Assigned Role</th>
                <th className="py-3 px-4">Permissions Scope</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {staffList.map((s) => (
                <tr key={s.uid} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-900">{s.name}</div>
                    <div className="text-[11px] text-slate-500 font-mono">{s.email}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    {isSuperAdmin ? (
                      <select
                        value={s.role}
                        onChange={(e) => onUpdateRole(s.uid, e.target.value as StaffRole)}
                        className="px-2 py-1 rounded border border-slate-200 bg-white text-xs font-semibold text-slate-800"
                      >
                        <option value="super_admin">Super Admin</option>
                        <option value="admin">Administrator</option>
                        <option value="sales_agent">Sales Agent</option>
                        <option value="content_manager">Content Manager</option>
                        <option value="developer">Developer</option>
                      </select>
                    ) : (
                      <span className="font-semibold text-slate-800 capitalize">
                        {s.role.replace('_', ' ')}
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">
                    {s.role === 'super_admin' && 'Complete platform control, pricing & staff management'}
                    {s.role === 'admin' && 'Customer onboarding, operations & packages'}
                    {s.role === 'sales_agent' && 'Inbound leads, sales queue & customer conversion'}
                    {s.role === 'content_manager' && 'Customer biographies, photos & website studio'}
                    {s.role === 'developer' && 'Templates, domains, technical configuration & publishing'}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`font-medium ${
                        s.status === 'active' ? 'text-emerald-600' : 'text-red-500'
                      }`}
                    >
                      ● {s.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {isSuperAdmin && s.role !== 'super_admin' && (
                      <button
                        onClick={() => onToggleStatus(s.uid)}
                        className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs transition-colors"
                      >
                        {s.status === 'active' ? 'Suspend' : 'Reactivate'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Staff Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <h3 className="font-bold text-slate-900 text-base">Add Staff Member</h3>

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Babatunde Raji"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Work Email</label>
                <input
                  type="email"
                  required
                  placeholder="babatunde@mypersonalcloud.ng"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Department Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as StaffRole)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="sales_agent">Sales Agent (Leads & Follow-ups)</option>
                  <option value="content_manager">Content Manager (Bios, Photos & Studio)</option>
                  <option value="developer">Developer (Templates, Domains & Publishing)</option>
                  <option value="admin">Administrator (Operations & Accounts)</option>
                  <option value="super_admin">Super Admin (Complete Access)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg text-slate-600 hover:text-slate-800 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium shadow-2xs"
                >
                  Authorize Staff Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
