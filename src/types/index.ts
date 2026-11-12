export type StaffRole = 'super_admin' | 'admin' | 'sales_agent' | 'content_manager' | 'developer';

export interface Staff {
  uid: string;
  email: string;
  name: string;
  role: StaffRole;
  status: 'active' | 'suspended';
  createdAt: string;
}

export type PackageTier = 'starter' | 'pro' | 'premium';

export interface PackageConfig {
  packageId: PackageTier;
  name: string;
  priceNgn: number;
  pageAllowance: number;
  storageLimitGb: number;
  customDomainSupport: boolean;
  googleDriveBackup: boolean;
  prioritySupport: boolean;
  description: string;
  isActive: boolean;
}

export type OnboardingStatus =
  | 'enquiry'
  | 'payment_pending'
  | 'info_collection'
  | 'generating'
  | 'in_review'
  | 'approved'
  | 'published';

export interface Customer {
  customerId: string;
  email: string;
  name: string;
  phone: string;
  businessName?: string;
  packageId: PackageTier;
  storeAddonActive: boolean;
  onboardingStatus: OnboardingStatus;
  subdomain: string;
  customDomain?: string;
  storageUsedMb?: number;
  createdAt: string;
}

export interface Enquiry {
  enquiryId: string;
  name: string;
  email: string;
  phone: string;
  interestedPackage: PackageTier | 'undecided';
  includeStoreAddon: boolean;
  message: string;
  status: 'new' | 'contacted' | 'converted' | 'closed';
  assignedAgentId?: string;
  notes?: string;
  createdAt: string;
}

export interface WebsiteProject {
  projectId: string;
  customerId: string;
  templateId: string;
  subdomain: string;
  customDomain?: string;
  status: 'draft' | 'generating' | 'in_review' | 'approved' | 'published';
  reviewerNotes?: string;
  publishedAt?: string;
  updatedAt: string;
}

export interface ServiceOffering {
  id: string;
  title: string;
  description: string;
  iconCategory?: string;
}

export interface ExperienceItem {
  id: string;
  role: string;
  companyOrClient: string;
  period: string;
  description: string;
}

export interface WebsiteContent {
  customerId: string;
  headline: string;
  tagline: string;
  biography: string;
  avatarUrl?: string;
  bannerUrl?: string;
  whatsappNumber: string;
  contactEmail: string;
  phone: string;
  location: string;
  socialLinks: {
    linkedin?: string;
    twitter?: string;
    instagram?: string;
    facebook?: string;
    github?: string;
    youtube?: string;
  };
  services: ServiceOffering[];
  galleryImages: string[];
  experience: ExperienceItem[];
  themeColor?: string;
  updatedAt: string;
}

export interface DocumentItem {
  documentId: string;
  customerId: string;
  title: string;
  category: 'contracts' | 'credentials' | 'business' | 'personal' | 'financial';
  fileUrl: string;
  fileSizeKb: number;
  mimeType: string;
  createdAt: string;
}

export interface PictureItem {
  pictureId: string;
  customerId: string;
  title: string;
  photoUrl: string;
  album: string;
  isWebsiteAsset: boolean;
  createdAt: string;
}

export interface TaskItem {
  taskId: string;
  customerId: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'in_progress' | 'completed';
  dueDate?: string;
  createdAt: string;
}

export interface ActivityItem {
  activityId: string;
  customerId: string;
  title: string;
  category: string;
  date: string;
  completed: boolean;
  notes?: string;
  createdAt: string;
}

export interface CalendarEventItem {
  eventId: string;
  customerId: string;
  title: string;
  startDate: string;
  endDate: string;
  location?: string;
  description?: string;
  color?: string;
}

export interface NoteItem {
  noteId: string;
  customerId: string;
  title: string;
  content: string;
  category: string;
  updatedAt: string;
}

export interface GoalItem {
  goalId: string;
  customerId: string;
  title: string;
  targetDate: string;
  progressPercentage: number;
  category: string;
  status: 'active' | 'achieved' | 'paused';
}

export interface StoreConfig {
  storeId: string;
  customerId: string;
  storeName: string;
  description?: string;
  currency: string;
  whatsappOrdering: boolean;
  isActive: boolean;
}

export interface ProductItem {
  productId: string;
  storeId: string;
  customerId: string;
  name: string;
  priceNgn: number;
  inventory: number;
  description?: string;
  imageUrl?: string;
  isActive: boolean;
}

export interface ActivityLogItem {
  logId: string;
  actorId: string;
  actorName: string;
  actorRole: string;
  action: string;
  targetEntity: string;
  targetId: string;
  details: string;
  timestamp: string;
}
