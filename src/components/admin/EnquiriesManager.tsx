import React, { useState } from 'react';
import { Enquiry, PackageTier } from '../../types/index.ts';
import { Mail, Phone, MessageSquare, CheckCircle, Clock, Plus, Filter, UserCheck, AlertCircle } from 'lucide-react';

interface Props {
  enquiries: Enquiry[];
  onAddEnquiry: (enquiry: Omit<Enquiry, 'enquiryId' | 'createdAt'>) => void;
  onUpdateStatus: (enquiryId: string, status: Enquiry['status'], notes?: string) => void;
  onConvertToCustomer: (enquiry: Enquiry) => void;
}

export const EnquiriesManager: React.FC<Props> = ({
  enquiries,
  onAddEnquiry,
  onUpdateStatus,
  onConvertToCustomer,
}) => {
  const [filter, setFilter] = useState<'all' | 'new' | 'contacted' | 'converted' | 'closed'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [statusNote, setStatusNote] = useState('');

  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [interestedPackage, setInterestedPackage] = useState<PackageTier | 'undecided'>('starter');
  const [includeStoreAddon, setIncludeStoreAddon] = useState(false);
  const [message, setMessage] = useState('');

  const filteredEnquiries = enquiries.filter((e) => {
    if (filter === 'all') return true;
    return e.status === filter;
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    onAddEnquiry({
      name,
      email,
      phone,
      interestedPackage,
      includeStoreAddon,
      message,
      status: 'new',
    });

    setName('');
    setEmail('');
    setPhone('');
    setMessage('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Sales Pipeline & Inbound Enquiries</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage incoming prospects, assign sales follow-ups, and convert paid leads into active accounts
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Filter Bar */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs">
            {(['all', 'new', 'contacted', 'converted'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setFilter(st)}
                className={`px-3 py-1.5 font-medium rounded-md capitalize transition-colors whitespace-nowrap shrink-0 ${
                  filter === st
                    ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Lead</span>
          </button>
        </div>
      </div>

      {/* Enquiries Data Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/70 border-b border-slate-100 text-slate-500 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4">Prospect</th>
                <th className="py-3 px-4">Contact</th>
                <th className="py-3 px-4">Requested Tier</th>
                <th className="py-3 px-4">Store Add-on</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Submitted Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredEnquiries.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No enquiries found under status "{filter}".
                  </td>
                </tr>
              ) : (
                filteredEnquiries.map((enq) => (
                  <tr key={enq.enquiryId} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900">{enq.name}</div>
                      {enq.message && (
                        <div className="text-[11px] text-slate-500 max-w-xs truncate mt-0.5">
                          "{enq.message}"
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-4 space-y-0.5">
                      <div className="text-slate-800 font-mono text-[11px]">{enq.email}</div>
                      {enq.phone && (
                        <div className="text-slate-500 text-[11px] flex items-center gap-1">
                          <Phone className="w-3 h-3 text-slate-400" /> {enq.phone}
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-medium text-slate-800 capitalize">
                        {enq.interestedPackage}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      {enq.includeStoreAddon ? (
                        <span className="text-indigo-600 font-medium">Requested (+₦10k)</span>
                      ) : (
                        <span className="text-slate-400">None</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`capitalize font-medium ${
                          enq.status === 'new'
                            ? 'text-amber-600'
                            : enq.status === 'contacted'
                            ? 'text-indigo-600'
                            : enq.status === 'converted'
                            ? 'text-emerald-600'
                            : 'text-slate-500'
                        }`}
                      >
                        {enq.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">
                      {new Date(enq.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      {enq.status !== 'converted' && (
                        <button
                          onClick={() => {
                            setSelectedEnquiry(enq);
                            setStatusNote(enq.notes || '');
                          }}
                          className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs transition-colors"
                        >
                          Update Status
                        </button>
                      )}

                      {enq.status !== 'converted' && (
                        <button
                          onClick={() => onConvertToCustomer(enq)}
                          className="px-2.5 py-1 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs transition-colors"
                        >
                          Convert to Customer
                        </button>
                      )}

                      {enq.status === 'converted' && (
                        <span className="text-emerald-700 font-medium text-xs inline-flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5" /> Customer Active
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add New Lead Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">Record Inbound Lead</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xs font-semibold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Prospect Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sola Olabintan"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="sola@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Phone / WhatsApp</label>
                  <input
                    type="text"
                    placeholder="+234 801 234 5678"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Selected Package</label>
                  <select
                    value={interestedPackage}
                    onChange={(e) => setInterestedPackage(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="starter">Starter — ₦10,000</option>
                    <option value="pro">Professional — ₦15,000</option>
                    <option value="premium">Premium — ₦30,000</option>
                    <option value="undecided">Undecided</option>
                  </select>
                </div>
                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeStoreAddon}
                      onChange={(e) => setIncludeStoreAddon(e.target.checked)}
                      className="rounded text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-slate-700 font-medium">Include My Store Add-on</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Notes / Enquiry Message</label>
                <textarea
                  rows={3}
                  placeholder="Customer requirements or enquiry message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
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
                  Save Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Update Status Modal */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <h3 className="font-bold text-slate-900 text-base">Update Status: {selectedEnquiry.name}</h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Pipeline State</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['new', 'contacted', 'closed'] as const).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => {
                        onUpdateStatus(selectedEnquiry.enquiryId, st, statusNote);
                        setSelectedEnquiry(null);
                      }}
                      className="px-3 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 capitalize font-medium text-slate-800 text-center"
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Follow-up Notes</label>
                <textarea
                  rows={3}
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                  placeholder="Record call outcome, customer interest, or payment follow-up..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedEnquiry(null)}
                className="px-3 py-1.5 rounded-lg text-slate-600 hover:text-slate-800 text-xs font-medium"
              >
                Close
              </button>
              <button
                onClick={() => {
                  onUpdateStatus(selectedEnquiry.enquiryId, selectedEnquiry.status, statusNote);
                  setSelectedEnquiry(null);
                }}
                className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium"
              >
                Save Notes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
