import React, { useState } from 'react';
import { Customer, PackageConfig, PackageTier, OnboardingStatus } from '../../types/index.ts';
import { Users, Plus, Globe, Search, ArrowRight, ShieldCheck, CheckCircle2, MoreVertical, CreditCard } from 'lucide-react';

interface Props {
  customers: Customer[];
  packages: Record<string, PackageConfig>;
  onAddCustomer: (customerData: Omit<Customer, 'customerId' | 'createdAt'>) => void;
  onUpdateStatus: (customerId: string, status: OnboardingStatus) => void;
  onSelectCustomerForStudio: (customerId: string) => void;
  onImpersonateCustomer: (customerId: string) => void;
}

export const CustomerManager: React.FC<Props> = ({
  customers,
  packages,
  onAddCustomer,
  onUpdateStatus,
  onSelectCustomerForStudio,
  onImpersonateCustomer,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [tierFilter, setTierFilter] = useState<'all' | PackageTier>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // New customer form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [subdomain, setSubdomain] = useState('');
  const [packageId, setPackageId] = useState<PackageTier>('starter');
  const [storeAddonActive, setStoreAddonActive] = useState(false);

  const filteredCustomers = customers.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.subdomain.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTier = tierFilter === 'all' || c.packageId === tierFilter;
    return matchesSearch && matchesTier;
  });

  const handleNameChange = (val: string) => {
    setName(val);
    if (!subdomain) {
      setSubdomain(val.toLowerCase().replace(/[^a-z0-9]/g, ''));
    }
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !subdomain) return;

    onAddCustomer({
      name,
      email,
      phone,
      businessName,
      subdomain: subdomain.toLowerCase().replace(/[^a-z0-9]/g, ''),
      packageId,
      storeAddonActive,
      onboardingStatus: 'info_collection',
      storageUsedMb: 120,
    });

    setName('');
    setEmail('');
    setPhone('');
    setBusinessName('');
    setSubdomain('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Customer Directory & Cloud Accounts</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Central repository of all onboarded individuals, professionals, and managed multi-tenant workspaces
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, email, or subdomain..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-3 py-1.5 rounded-lg border border-slate-300 text-xs w-64 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs flex items-center gap-1.5 transition-colors shadow-2xs whitespace-nowrap shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Onboard Customer</span>
          </button>
        </div>
      </div>

      {/* Tier Filter Tabs */}
      <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs w-fit">
        {(['all', 'starter', 'pro', 'premium'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTierFilter(t)}
            className={`px-3 py-1.5 font-medium rounded-md capitalize transition-colors ${
              tierFilter === t ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t} ({t === 'all' ? customers.length : customers.filter((c) => c.packageId === t).length})
          </button>
        ))}
      </div>

      {/* Customer Accounts Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/70 border-b border-slate-100 text-slate-500 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4">Customer Identity</th>
                <th className="py-3 px-4">Package Tier</th>
                <th className="py-3 px-4">Platform Subdomain</th>
                <th className="py-3 px-4">Cloud Storage</th>
                <th className="py-3 px-4">Fulfillment State</th>
                <th className="py-3 px-4 text-right">Fulfillment Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No customers match the current search or tier filter.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((c) => {
                  const pkg = packages[c.packageId];
                  const storageCapMb = (pkg ? pkg.storageLimitGb : 1) * 1024;
                  const storageUsed = c.storageUsedMb || 150;
                  const percentUsed = Math.min(100, Math.round((storageUsed / storageCapMb) * 100));

                  return (
                    <tr key={c.customerId} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-900">{c.name}</div>
                        <div className="text-[11px] text-slate-500 font-mono">{c.email}</div>
                        {c.businessName && (
                          <div className="text-[10px] text-indigo-600 font-medium mt-0.5">
                            {c.businessName}
                          </div>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-900 capitalize">{c.packageId}</div>
                        <div className="text-[11px] text-slate-500 font-mono tabular-nums">
                          ₦{pkg ? pkg.priceNgn.toLocaleString() : '10,000'} / mo
                        </div>
                        {c.storeAddonActive && (
                          <div className="text-[10px] text-emerald-600 font-medium">
                            + My Store Active
                          </div>
                        )}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-600">
                        <span className="text-indigo-600 font-semibold">{c.subdomain}</span>.mpc.ng
                      </td>
                      <td className="py-3.5 px-4 w-44">
                        <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1 font-mono tabular-nums">
                          <span>{storageUsed} MB</span>
                          <span>{pkg ? pkg.storageLimitGb : 1} GB</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-indigo-600 h-1.5 rounded-full"
                            style={{ width: `${percentUsed}%` }}
                          />
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <select
                          value={c.onboardingStatus}
                          onChange={(e) => onUpdateStatus(c.customerId, e.target.value as any)}
                          className="px-2 py-1 rounded border border-slate-200 bg-white text-xs font-medium text-slate-800"
                        >
                          <option value="payment_pending">Payment Pending</option>
                          <option value="info_collection">Info Collection</option>
                          <option value="generating">Generating</option>
                          <option value="in_review">In Review</option>
                          <option value="approved">Approved</option>
                          <option value="published">Published</option>
                        </select>
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-2">
                        <button
                          onClick={() => onSelectCustomerForStudio(c.customerId)}
                          className="px-2.5 py-1 rounded-md bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-medium text-xs transition-colors"
                        >
                          Website Studio
                        </button>
                        <button
                          onClick={() => onImpersonateCustomer(c.customerId)}
                          className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs transition-colors"
                        >
                          Open Workspace
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Onboard Customer Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">Onboard Customer Account</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xs font-semibold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Customer Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Olabisi Adeleke"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Customer Email</label>
                  <input
                    type="email"
                    required
                    placeholder="olabisi@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">WhatsApp / Phone</label>
                  <input
                    type="text"
                    placeholder="+234 803 000 0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Business Name (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Adeleke Legal & Advisory"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Assigned Subdomain</label>
                  <div className="flex items-center">
                    <input
                      type="text"
                      required
                      placeholder="olabisi"
                      value={subdomain}
                      onChange={(e) => setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ''))}
                      className="w-full px-3 py-2 rounded-l-lg border border-r-0 border-slate-300 font-mono text-indigo-700 focus:outline-none"
                    />
                    <span className="px-2.5 py-2 rounded-r-lg border border-slate-300 bg-slate-100 text-slate-500 font-mono text-xs">
                      .mpc.ng
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Confirmed Package Tier</label>
                  <select
                    value={packageId}
                    onChange={(e) => setPackageId(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                  >
                    <option value="starter">Starter — ₦10,000</option>
                    <option value="pro">Professional — ₦15,000</option>
                    <option value="premium">Premium — ₦30,000</option>
                  </select>
                </div>
                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={storeAddonActive}
                      onChange={(e) => setStoreAddonActive(e.target.checked)}
                      className="rounded text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-slate-700 font-medium">Activate "My Store" (+₦10,000)</span>
                  </label>
                </div>
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
                  Create Customer Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
