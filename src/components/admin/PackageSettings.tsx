import React, { useState } from 'react';
import { PackageConfig, PackageTier } from '../../types/index.ts';
import { Settings, Save, ShieldCheck, Check, DollarSign } from 'lucide-react';

interface Props {
  packages: Record<string, PackageConfig>;
  onSavePackages: (packages: Record<string, PackageConfig>) => void;
  isSuperAdmin: boolean;
}

export const PackageSettings: React.FC<Props> = ({ packages, onSavePackages, isSuperAdmin }) => {
  const [localPackages, setLocalPackages] = useState<Record<string, PackageConfig>>(packages);
  const [storeAddonPriceNgn, setStoreAddonPriceNgn] = useState(10000);
  const [customDomainYearlyNgn, setCustomDomainYearlyNgn] = useState(12000);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleUpdateField = (
    tier: PackageTier,
    field: keyof PackageConfig,
    value: string | number | boolean
  ) => {
    setLocalPackages((prev) => ({
      ...prev,
      [tier]: {
        ...prev[tier],
        [field]: value,
      },
    }));
  };

  const handleSave = () => {
    onSavePackages(localPackages);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Business Packages & Pricing Settings</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure monthly subscription rates (₦ NGN), storage limits, page allowances, and add-on pricing
          </p>
        </div>

        {isSuperAdmin && (
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs flex items-center gap-1.5 transition-colors shadow-2xs whitespace-nowrap shrink-0"
          >
            {savedSuccess ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
            <span>{savedSuccess ? 'Saved to Platform' : 'Save Package Rates'}</span>
          </button>
        )}
      </div>

      {!isSuperAdmin && (
        <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs">
          <strong>View Only:</strong> Only Super Admins and Platform Administrators are authorized to update package pricing and tier allocations.
        </div>
      )}

      {/* Package Tier Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {(['starter', 'pro', 'premium'] as PackageTier[]).map((tier) => {
          const pkg = localPackages[tier];
          if (!pkg) return null;

          return (
            <div
              key={tier}
              className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-5"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="font-extrabold text-base text-slate-900 uppercase tracking-wider">
                  {pkg.name}
                </span>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                  {tier}
                </span>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">
                    Monthly Price (₦ NGN)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-slate-400 font-mono">₦</span>
                    <input
                      type="number"
                      disabled={!isSuperAdmin}
                      value={pkg.priceNgn}
                      onChange={(e) =>
                        handleUpdateField(tier, 'priceNgn', parseInt(e.target.value, 10) || 0)
                      }
                      className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-300 font-mono font-bold text-slate-900 disabled:bg-slate-50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">Page Allowance</label>
                  <input
                    type="number"
                    disabled={!isSuperAdmin}
                    value={pkg.pageAllowance}
                    onChange={(e) =>
                      handleUpdateField(tier, 'pageAllowance', parseInt(e.target.value, 10) || 1)
                    }
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 font-mono text-slate-900 disabled:bg-slate-50"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">Cloud Storage Limit (GB)</label>
                  <input
                    type="number"
                    disabled={!isSuperAdmin}
                    value={pkg.storageLimitGb}
                    onChange={(e) =>
                      handleUpdateField(tier, 'storageLimitGb', parseInt(e.target.value, 10) || 1)
                    }
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 font-mono text-slate-900 disabled:bg-slate-50"
                  />
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-100 text-slate-700">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      disabled={!isSuperAdmin}
                      checked={pkg.customDomainSupport}
                      onChange={(e) =>
                        handleUpdateField(tier, 'customDomainSupport', e.target.checked)
                      }
                      className="rounded text-indigo-600"
                    />
                    <span>Custom Domain Mapping</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      disabled={!isSuperAdmin}
                      checked={pkg.googleDriveBackup}
                      onChange={(e) =>
                        handleUpdateField(tier, 'googleDriveBackup', e.target.checked)
                      }
                      className="rounded text-indigo-600"
                    />
                    <span>Google Drive Backup Sync</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      disabled={!isSuperAdmin}
                      checked={pkg.prioritySupport}
                      onChange={(e) =>
                        handleUpdateField(tier, 'prioritySupport', e.target.checked)
                      }
                      className="rounded text-indigo-600"
                    />
                    <span>Priority Operational Support</span>
                  </label>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add-ons & Domain Registration Pricing */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-4">
        <h3 className="font-bold text-slate-900 text-sm">Separately Paid Add-ons & External Transparency</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 space-y-2">
            <div className="font-semibold text-slate-900">"My Store" E-Commerce Add-on</div>
            <p className="text-slate-500">
              Optional separately billed digital storefront with product catalog and WhatsApp direct checkout.
            </p>
            <div className="pt-2 flex items-center gap-2 font-mono">
              <span className="font-bold text-slate-900">₦{storeAddonPriceNgn.toLocaleString()} / mo</span>
              <span className="text-slate-400 text-[11px]">(Configurable)</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 space-y-2">
            <div className="font-semibold text-slate-900">Custom Domain Registration & Renewal</div>
            <p className="text-slate-500">
              Clear cost breakdown for registrar registration (.com / .ng) and annual renewal.
            </p>
            <div className="pt-2 flex items-center gap-2 font-mono">
              <span className="font-bold text-slate-900">₦{customDomainYearlyNgn.toLocaleString()} / year</span>
              <span className="text-slate-400 text-[11px]">(Transparent pass-through)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
