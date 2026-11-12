import { PackageConfig, PackageTier } from '../types/index.ts';

export const DEFAULT_PACKAGES: Record<PackageTier, PackageConfig> = {
  starter: {
    packageId: 'starter',
    name: 'Starter',
    priceNgn: 10000,
    pageAllowance: 1,
    storageLimitGb: 1,
    customDomainSupport: false,
    googleDriveBackup: false,
    prioritySupport: false,
    description: 'One-page personal website, MPC platform subdomain, profile, career info, social links, WhatsApp contact, and basic customer cloud dashboard.',
    isActive: true,
  },
  pro: {
    packageId: 'pro',
    name: 'Professional',
    priceNgn: 15000,
    pageAllowance: 5,
    storageLimitGb: 5,
    customDomainSupport: true,
    googleDriveBackup: true,
    prioritySupport: false,
    description: 'Everything in Starter plus custom domain support, up to 5 website pages, professional portfolio, expanded gallery, and Google Drive backup.',
    isActive: true,
  },
  premium: {
    packageId: 'premium',
    name: 'Premium',
    priceNgn: 30000,
    pageAllowance: 15,
    storageLimitGb: 25,
    customDomainSupport: true,
    googleDriveBackup: true,
    prioritySupport: true,
    description: 'Everything in Professional plus premium templates, advanced customization, 25 GB storage, advanced productivity tools, and priority support.',
    isActive: true,
  },
};

export const MY_STORE_ADDON_PRICE_NGN = 10000;
