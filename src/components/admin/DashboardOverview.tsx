import React from 'react';
import { Customer, Enquiry, PackageConfig, WebsiteProject } from '../../types/index.ts';
import { Users, CreditCard, Globe, Clock, ArrowUpRight, CheckCircle2, Shield, Sparkles } from 'lucide-react';

interface Props {
  customers: Customer[];
  enquiries: Enquiry[];
  projects: WebsiteProject[];
  packages: Record<string, PackageConfig>;
  onNavigate: (tab: string) => void;
  onSelectCustomerForStudio: (customerId: string) => void;
}

export const DashboardOverview: React.FC<Props> = ({
  customers,
  enquiries,
  projects,
  packages,
  onNavigate,
  onSelectCustomerForStudio,
}) => {
  // Compute real metrics
  const activeCustomers = customers.length;
  const newEnquiries = enquiries.filter((e) => e.status === 'new').length;
  const pendingWebsites = projects.filter(
    (p) => p.status === 'in_review' || p.status === 'generating' || p.status === 'draft'
  ).length;

  const totalMonthlyRevenueNgn = customers.reduce((acc, c) => {
    const pkg = packages[c.packageId];
    const base = pkg ? pkg.priceNgn : 10000;
    const addon = c.storeAddonActive ? 10000 : 0;
    return acc + base + addon;
  }, 0);

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 md:p-8 border border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-400 uppercase tracking-wider">
            <Shield className="w-3.5 h-3.5" /> Central Operations Console
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            My Personal Cloud Infrastructure
          </h2>
          <p className="text-sm text-slate-400 max-w-xl">
            Centrally managing customer identities, multi-tenant websites, structured onboarding, and private cloud workspaces.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => onNavigate('studio')}
            className="px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs flex items-center gap-2 transition-colors shadow-sm"
          >
            <Sparkles className="w-4 h-4 text-indigo-200" />
            <span>Website Generation Studio</span>
          </button>
          <button
            onClick={() => onNavigate('enquiries')}
            className="px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs flex items-center gap-2 transition-colors border border-slate-700"
          >
            <Users className="w-4 h-4 text-slate-400" />
            <span>Sales Queue ({newEnquiries})</span>
          </button>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl bg-white border border-slate-200/80 shadow-2xs space-y-3">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500">
            <span>Active Customers</span>
            <Users className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
            {activeCustomers}
          </div>
          <div className="text-xs text-slate-500 flex items-center gap-1">
            <span>Onboarded accounts</span>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-white border border-slate-200/80 shadow-2xs space-y-3">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500">
            <span>Estimated MRR (NGN)</span>
            <CreditCard className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
            ₦{totalMonthlyRevenueNgn.toLocaleString()}
          </div>
          <div className="text-xs text-slate-500">
            Across {customers.length} subscriptions
          </div>
        </div>

        <div className="p-5 rounded-xl bg-white border border-slate-200/80 shadow-2xs space-y-3">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500">
            <span>Websites In Pipeline</span>
            <Globe className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
            {pendingWebsites}
          </div>
          <div className="text-xs text-slate-500">
            Generating or awaiting approval
          </div>
        </div>

        <div className="p-5 rounded-xl bg-white border border-slate-200/80 shadow-2xs space-y-3">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500">
            <span>New Inbound Enquiries</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-amber-600 font-mono tabular-nums">
            {newEnquiries}
          </div>
          <div className="text-xs text-slate-500">
            Requires sales agent response
          </div>
        </div>
      </div>

      {/* Main Grid: Onboarding Pipeline & Pending Reviews */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Customer Accounts & Website Status Table */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Customer Fulfillment Pipeline</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Managed onboarding, template binding, and publishing state
              </p>
            </div>
            <button
              onClick={() => onNavigate('customers')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
            >
              View All <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/70 border-b border-slate-100 text-slate-500 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Package</th>
                  <th className="py-3 px-4">Domain / Slug</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {customers.slice(0, 5).map((c) => {
                  const project = projects.find((p) => p.customerId === c.customerId);
                  return (
                    <tr key={c.customerId} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900">{c.name}</div>
                        <div className="text-[11px] text-slate-500">{c.email}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-medium text-slate-800 capitalize">{c.packageId}</span>
                        {c.storeAddonActive && (
                          <span className="ml-1 text-[10px] text-indigo-600 font-semibold">+ Store</span>
                        )}
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-600">
                        {c.subdomain}.mpc.ng
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-slate-600 text-xs capitalize">
                          {c.onboardingStatus.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => onSelectCustomerForStudio(c.customerId)}
                          className="px-2.5 py-1 rounded-md bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-medium text-xs transition-colors"
                        >
                          Manage Site
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Operational Guide */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-5 rounded-xl bg-white border border-slate-200/80 shadow-2xs space-y-4">
            <h3 className="font-bold text-slate-900 text-sm">Fulfillment Standard Operating Procedure</h3>
            <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
              <div className="flex gap-2">
                <span className="font-bold text-indigo-600 shrink-0">1.</span>
                <span>Sales reviews inbound lead in the <strong>Sales Queue</strong> and contacts client via phone/WhatsApp.</span>
              </div>
              <div className="flex gap-2">
                <span className="font-bold text-indigo-600 shrink-0">2.</span>
                <span>Customer confirms tier (₦10k Starter, ₦15k Pro, ₦30k Premium) and submits payment.</span>
              </div>
              <div className="flex gap-2">
                <span className="font-bold text-indigo-600 shrink-0">3.</span>
                <span>Content Manager enters photos, credentials & bios into the <strong>Website Studio</strong>.</span>
              </div>
              <div className="flex gap-2">
                <span className="font-bold text-indigo-600 shrink-0">4.</span>
                <span>Staff clicks <strong>Generate Website</strong> and validates desktop/mobile preview before publishing.</span>
              </div>
              <div className="flex gap-2">
                <span className="font-bold text-indigo-600 shrink-0">5.</span>
                <span>Customer gets private dashboard credentials for documents, cloud storage & task management.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
