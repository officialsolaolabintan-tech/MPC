import React, { useState, useEffect } from 'react';
import {
  Staff,
  StaffRole,
  Customer,
  Enquiry,
  PackageConfig,
  WebsiteProject,
  WebsiteContent,
  DocumentItem,
  PictureItem,
  TaskItem,
  ActivityItem,
  CalendarEventItem,
  NoteItem,
  GoalItem,
  ProductItem,
} from './types/index.ts';
import { DEFAULT_PACKAGES } from './lib/packages.ts';
import { db, auth, validateFirestoreConnection, handleFirestoreError, OperationType } from './lib/firebase.ts';
import { collection, doc, getDocs, setDoc, updateDoc } from 'firebase/firestore';

// Admin Views
import { DashboardOverview } from './components/admin/DashboardOverview.tsx';
import { EnquiriesManager } from './components/admin/EnquiriesManager.tsx';
import { CustomerManager } from './components/admin/CustomerManager.tsx';
import { WebsiteBuilderStudio } from './components/admin/WebsiteBuilderStudio.tsx';
import { PackageSettings } from './components/admin/PackageSettings.tsx';
import { StaffManager } from './components/admin/StaffManager.tsx';

// Customer Workspace
import { CustomerWorkspace } from './components/customer/CustomerWorkspace.tsx';

// Shared Dynamic Template Renderer
import { TemplateRenderer } from './components/templates/TemplateRenderer.tsx';

import {
  Shield,
  Users,
  CreditCard,
  Globe,
  Settings,
  Sparkles,
  ArrowLeft,
  ChevronDown,
  User,
  ExternalLink,
  Laptop,
} from 'lucide-react';

export default function App() {
  // Navigation State
  // Mode: 'admin' | 'customer' | 'live_site'
  const [appMode, setAppMode] = useState<'admin' | 'customer' | 'live_site'>('admin');
  const [adminTab, setAdminTab] = useState<string>('overview');

  // Active Staff Persona for RBAC demonstration
  const [currentStaffRole, setCurrentStaffRole] = useState<StaffRole>('super_admin');

  // Active Selected Customer (for Studio or Customer Workspace)
  const [activeCustomerId, setActiveCustomerId] = useState<string>('cust_01');

  // Core Data States
  const [packages, setPackages] = useState<Record<string, PackageConfig>>(DEFAULT_PACKAGES);

  const [staffList, setStaffList] = useState<Staff[]>([
    {
      uid: 'staff_01',
      name: 'Oluwaseun Balogun',
      email: 'oluwaseun@mypersonalcloud.ng',
      role: 'super_admin',
      status: 'active',
      createdAt: '2026-01-10T10:00:00Z',
    },
    {
      uid: 'staff_02',
      name: 'Chidinma Okafor',
      email: 'chidinma@mypersonalcloud.ng',
      role: 'sales_agent',
      status: 'active',
      createdAt: '2026-02-14T09:00:00Z',
    },
    {
      uid: 'staff_03',
      name: 'Tunde Adeleke',
      email: 'tunde@mypersonalcloud.ng',
      role: 'content_manager',
      status: 'active',
      createdAt: '2026-02-20T11:00:00Z',
    },
    {
      uid: 'staff_04',
      name: 'Ibrahim Musa',
      email: 'ibrahim@mypersonalcloud.ng',
      role: 'developer',
      status: 'active',
      createdAt: '2026-03-01T08:30:00Z',
    },
  ]);

  const [enquiries, setEnquiries] = useState<Enquiry[]>([
    {
      enquiryId: 'enq_01',
      name: 'Dr. Amina Bello',
      email: 'amina.bello@healthcorp.ng',
      phone: '+234 802 345 6789',
      interestedPackage: 'pro',
      includeStoreAddon: false,
      message: 'Need a 5-page personal website for medical advisory and public health consulting.',
      status: 'new',
      createdAt: '2026-11-10T08:00:00Z',
    },
    {
      enquiryId: 'enq_02',
      name: 'Kayode Fashola',
      email: 'kayode@urbanrealty.com',
      phone: '+234 803 987 6543',
      interestedPackage: 'premium',
      includeStoreAddon: true,
      message: 'Looking for an executive identity with online listing catalog for real estate consulting.',
      status: 'contacted',
      createdAt: '2026-11-08T14:30:00Z',
    },
  ]);

  const [customers, setCustomers] = useState<Customer[]>([
    {
      customerId: 'cust_01',
      name: 'Sola Olabintan',
      email: 'sola@olabintan.com',
      phone: '+234 801 112 2334',
      businessName: 'Olabintan Strategic Advisory',
      packageId: 'premium',
      storeAddonActive: true,
      onboardingStatus: 'published',
      subdomain: 'sola',
      customDomain: 'solaolabintan.com',
      storageUsedMb: 680,
      createdAt: '2026-10-15T12:00:00Z',
    },
    {
      customerId: 'cust_02',
      name: 'Folake Adeyemi',
      email: 'folake@brandcraft.ng',
      phone: '+234 809 555 4433',
      businessName: 'Adeyemi Brand Atelier',
      packageId: 'pro',
      storeAddonActive: false,
      onboardingStatus: 'generating',
      subdomain: 'folake',
      storageUsedMb: 240,
      createdAt: '2026-11-01T09:15:00Z',
    },
    {
      customerId: 'cust_03',
      name: 'Emeka Nwosu',
      email: 'emeka@fintechlegal.com',
      phone: '+234 818 777 8899',
      packageId: 'starter',
      storeAddonActive: false,
      onboardingStatus: 'in_review',
      subdomain: 'emeka',
      storageUsedMb: 95,
      createdAt: '2026-11-05T16:20:00Z',
    },
  ]);

  const [projects, setProjects] = useState<WebsiteProject[]>([
    {
      projectId: 'proj_01',
      customerId: 'cust_01',
      templateId: 'premium',
      subdomain: 'sola',
      customDomain: 'solaolabintan.com',
      status: 'published',
      publishedAt: '2026-10-20T14:00:00Z',
      updatedAt: '2026-11-09T18:00:00Z',
    },
    {
      projectId: 'proj_02',
      customerId: 'cust_02',
      templateId: 'pro_portfolio',
      subdomain: 'folake',
      status: 'generating',
      updatedAt: '2026-11-08T11:00:00Z',
    },
    {
      projectId: 'proj_03',
      customerId: 'cust_03',
      templateId: 'starter',
      subdomain: 'emeka',
      status: 'in_review',
      updatedAt: '2026-11-07T15:30:00Z',
    },
  ]);

  const [contents, setContents] = useState<Record<string, WebsiteContent>>({
    cust_01: {
      customerId: 'cust_01',
      headline: 'Sola Olabintan',
      tagline: 'Lead Software Architect & Strategic Technology Advisor',
      biography:
        'Sola Olabintan is a senior engineering executive and technology architect with extensive experience leading mission-critical cloud platforms, enterprise SaaS architecture, and digital identity systems.\n\nWith over 12 years directing technical teams and driving scalable software systems, he partners with high-growth organizations and executive teams to build resilient digital infrastructure.',
      avatarUrl:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
      whatsappNumber: '+234 801 112 2334',
      contactEmail: 'officialsolaolabintan@gmail.com',
      phone: '+234 801 112 2334',
      location: 'Lagos, Nigeria',
      socialLinks: {},
      services: [
        {
          id: 'srv_1',
          title: 'Cloud & SaaS Architecture',
          description:
            'Designing secure multi-tenant architectures, database schemas, and microservice topologies.',
        },
        {
          id: 'srv_2',
          title: 'Executive Advisory',
          description:
            'Advising founders and enterprise leadership on engineering roadmaps and security posture.',
        },
        {
          id: 'srv_3',
          title: 'Digital Identity Systems',
          description:
            'Implementing centralized identity verification, RBAC rules, and Zero-Trust access control.',
        },
      ],
      experience: [
        {
          id: 'exp_1',
          role: 'Lead Architect',
          companyOrClient: 'My Personal Cloud (MPC)',
          period: '2024 — Present',
          description: 'Orchestrating multi-tenant SaaS architecture and managed website generation engine.',
        },
        {
          id: 'exp_2',
          role: 'Principal Consultant',
          companyOrClient: 'Olabintan Strategic Advisory',
          period: '2019 — 2024',
          description: 'Advised financial services and tech startups across West Africa on cloud scalability.',
        },
      ],
      galleryImages: [],
      updatedAt: '2026-11-10T12:00:00Z',
    },
  });

  // Customer private data states
  const [documents, setDocuments] = useState<DocumentItem[]>([
    {
      documentId: 'doc_01',
      customerId: 'cust_01',
      title: 'Chartered Institute Certificate 2026.pdf',
      category: 'credentials',
      fileUrl: '#',
      fileSizeKb: 640,
      mimeType: 'application/pdf',
      createdAt: '2026-10-22T08:00:00Z',
    },
    {
      documentId: 'doc_02',
      customerId: 'cust_01',
      title: 'MPC Master Service Agreement.pdf',
      category: 'contracts',
      fileUrl: '#',
      fileSizeKb: 1240,
      mimeType: 'application/pdf',
      createdAt: '2026-10-25T14:30:00Z',
    },
  ]);

  const [pictures, setPictures] = useState<PictureItem[]>([
    {
      pictureId: 'pic_01',
      customerId: 'cust_01',
      title: 'Executive Portrait 2026',
      photoUrl:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
      album: 'Portraits',
      isWebsiteAsset: true,
      createdAt: '2026-10-20T10:00:00Z',
    },
  ]);

  const [tasks, setTasks] = useState<TaskItem[]>([
    {
      taskId: 'task_01',
      customerId: 'cust_01',
      title: 'Review Q4 Board Architecture Brief',
      description: 'Review final slides before presentation.',
      priority: 'high',
      status: 'in_progress',
      dueDate: '2026-11-15T10:00:00Z',
      createdAt: '2026-11-09T09:00:00Z',
    },
    {
      taskId: 'task_02',
      customerId: 'cust_01',
      title: 'Renew Custom Domain SSL Certificate',
      priority: 'medium',
      status: 'completed',
      dueDate: '2026-11-10T12:00:00Z',
      createdAt: '2026-11-02T10:00:00Z',
    },
  ]);

  const [activities, setActivities] = useState<ActivityItem[]>([
    {
      activityId: 'act_01',
      customerId: 'cust_01',
      title: 'Morning Executive Review & Mail triage',
      category: 'Routine',
      date: '2026-11-11',
      completed: true,
      createdAt: '2026-11-11T07:00:00Z',
    },
    {
      activityId: 'act_02',
      customerId: 'cust_01',
      title: 'Cloud Architecture Sync with Developers',
      category: 'Engineering',
      date: '2026-11-11',
      completed: false,
      createdAt: '2026-11-11T11:00:00Z',
    },
  ]);

  const [calendarEvents, setCalendarEvents] = useState<CalendarEventItem[]>([
    {
      eventId: 'evt_01',
      customerId: 'cust_01',
      title: 'MPC Platform Strategy Session',
      startDate: 'Thursday, Nov 12 · 2:00 PM',
      endDate: '3:30 PM',
      location: 'Virtual Conference',
    },
  ]);

  const [notes, setNotes] = useState<NoteItem[]>([
    {
      noteId: 'note_01',
      customerId: 'cust_01',
      title: 'MPC Architecture Tenets',
      content:
        '1. Never DIY website builders.\n2. Managed fulfillment pipeline.\n3. Shared dynamic rendering engine.\n4. Zero-Trust multi-tenant data isolation.',
      category: 'Engineering',
      updatedAt: '2026-11-10T18:00:00Z',
    },
  ]);

  const [goals, setGoals] = useState<GoalItem[]>([
    {
      goalId: 'goal_01',
      customerId: 'cust_01',
      title: 'Onboard 500 Enterprise Customers to MPC',
      targetDate: 'Dec 2026',
      progressPercentage: 68,
      category: 'Business Growth',
      status: 'active',
    },
  ]);

  const [products, setProducts] = useState<ProductItem[]>([
    {
      productId: 'prod_01',
      storeId: 'store_01',
      customerId: 'cust_01',
      name: 'Executive Advisory Retainer (Quarterly)',
      priceNgn: 450000,
      inventory: 3,
      description: 'Comprehensive technical and strategic advisory sessions with executive roadmap reviews.',
      isActive: true,
    },
    {
      productId: 'prod_02',
      storeId: 'store_01',
      customerId: 'cust_01',
      name: 'Cloud Security Audit & Review',
      priceNgn: 250000,
      inventory: 5,
      description: 'End-to-end audit of Firestore rules, multi-tenant isolation, and OAuth permissions.',
      isActive: true,
    },
  ]);

  // Test Firestore Connection on boot
  useEffect(() => {
    validateFirestoreConnection();
  }, []);

  // Handlers for Admin
  const handleAddEnquiry = (enquiryData: Omit<Enquiry, 'enquiryId' | 'createdAt'>) => {
    const newEnq: Enquiry = {
      ...enquiryData,
      enquiryId: `enq_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setEnquiries([newEnq, ...enquiries]);
  };

  const handleUpdateEnquiryStatus = (
    enquiryId: string,
    status: Enquiry['status'],
    notesText?: string
  ) => {
    setEnquiries(
      enquiries.map((e) =>
        e.enquiryId === enquiryId ? { ...e, status, notes: notesText || e.notes } : e
      )
    );
  };

  const handleConvertToCustomer = (enq: Enquiry) => {
    const newCustId = `cust_${Date.now()}`;
    const cleanSubdomain = enq.name.toLowerCase().replace(/[^a-z0-9]/g, '');

    const newCustomer: Customer = {
      customerId: newCustId,
      name: enq.name,
      email: enq.email,
      phone: enq.phone,
      packageId: enq.interestedPackage === 'undecided' ? 'starter' : enq.interestedPackage,
      storeAddonActive: enq.includeStoreAddon,
      onboardingStatus: 'info_collection',
      subdomain: cleanSubdomain,
      storageUsedMb: 50,
      createdAt: new Date().toISOString(),
    };

    setCustomers([newCustomer, ...customers]);
    handleUpdateEnquiryStatus(enq.enquiryId, 'converted');
    setActiveCustomerId(newCustId);
    setAdminTab('customers');
  };

  const handleAddCustomer = (customerData: Omit<Customer, 'customerId' | 'createdAt'>) => {
    const newCustomer: Customer = {
      ...customerData,
      customerId: `cust_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setCustomers([newCustomer, ...customers]);

    // Create matching website project
    const newProject: WebsiteProject = {
      projectId: `proj_${Date.now()}`,
      customerId: newCustomer.customerId,
      templateId:
        newCustomer.packageId === 'premium'
          ? 'premium'
          : newCustomer.packageId === 'pro'
          ? 'pro_portfolio'
          : 'starter',
      subdomain: newCustomer.subdomain,
      status: 'draft',
      updatedAt: new Date().toISOString(),
    };
    setProjects([newProject, ...projects]);
  };

  const handleUpdateCustomerStatus = (customerId: string, status: Customer['onboardingStatus']) => {
    setCustomers(customers.map((c) => (c.customerId === customerId ? { ...c, onboardingStatus: status } : c)));
  };

  const handleSaveContent = (customerId: string, newContent: WebsiteContent) => {
    setContents((prev) => ({
      ...prev,
      [customerId]: newContent,
    }));
  };

  const handlePublishWebsite = (projectId: string, subdomain: string) => {
    setProjects(
      projects.map((p) =>
        p.projectId === projectId
          ? { ...p, status: 'published', publishedAt: new Date().toISOString() }
          : p
      )
    );
    // Also update customer status to published
    const project = projects.find((p) => p.projectId === projectId);
    if (project) {
      handleUpdateCustomerStatus(project.customerId, 'published');
    }
  };

  const handleAddStaff = (newStaffData: Omit<Staff, 'uid' | 'createdAt'>) => {
    const newStaff: Staff = {
      ...newStaffData,
      uid: `staff_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setStaffList([...staffList, newStaff]);
  };

  const handleUpdateStaffRole = (uid: string, role: StaffRole) => {
    setStaffList(staffList.map((s) => (s.uid === uid ? { ...s, role } : s)));
  };

  const handleToggleStaffStatus = (uid: string) => {
    setStaffList(
      staffList.map((s) =>
        s.uid === uid ? { ...s, status: s.status === 'active' ? 'suspended' : 'active' } : s
      )
    );
  };

  // Handlers for Customer Workspace
  const activeCustomer = customers.find((c) => c.customerId === activeCustomerId) || customers[0];
  const activeProject = projects.find((p) => p.customerId === activeCustomer?.customerId);
  const activeContent = contents[activeCustomer?.customerId] || {
    customerId: activeCustomer?.customerId,
    headline: activeCustomer?.name,
    tagline: 'Personal Digital Identity',
    biography: `${activeCustomer?.name} is a verified client of My Personal Cloud.`,
    whatsappNumber: activeCustomer?.phone,
    contactEmail: activeCustomer?.email,
    phone: activeCustomer?.phone,
    location: 'Nigeria',
    socialLinks: {},
    services: [],
    experience: [],
    galleryImages: [],
    updatedAt: new Date().toISOString(),
  };

  const currentCustomerDocs = documents.filter((d) => d.customerId === activeCustomer?.customerId);
  const currentCustomerPics = pictures.filter((p) => p.customerId === activeCustomer?.customerId);
  const currentCustomerTasks = tasks.filter((t) => t.customerId === activeCustomer?.customerId);
  const currentCustomerActivities = activities.filter((a) => a.customerId === activeCustomer?.customerId);
  const currentCustomerEvents = calendarEvents.filter((e) => e.customerId === activeCustomer?.customerId);
  const currentCustomerNotes = notes.filter((n) => n.customerId === activeCustomer?.customerId);
  const currentCustomerGoals = goals.filter((g) => g.customerId === activeCustomer?.customerId);
  const currentCustomerProducts = products.filter((p) => p.customerId === activeCustomer?.customerId);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased flex flex-col">
      {/* Universal MPC Top Environment Bar */}
      <header className="bg-slate-950 text-white border-b border-slate-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Brand Mark */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white shadow-xs">
              M
            </div>
            <div>
              <span className="font-extrabold text-sm tracking-tight text-white">
                MY PERSONAL CLOUD
              </span>
              <span className="hidden sm:inline text-[11px] text-slate-400 font-mono ml-2">
                v2.0 Managed Engine
              </span>
            </div>
          </div>

          {/* Environment Mode Switcher */}
          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs font-medium">
            <button
              onClick={() => setAppMode('admin')}
              className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-colors ${
                appMode === 'admin'
                  ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Central Admin Portal</span>
            </button>

            <button
              onClick={() => setAppMode('customer')}
              className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-colors ${
                appMode === 'customer'
                  ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Customer Workspace</span>
            </button>

            <button
              onClick={() => setAppMode('live_site')}
              className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-colors ${
                appMode === 'live_site'
                  ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Live Website View</span>
            </button>
          </div>

          {/* Quick Persona / Role Switcher for Admin testing */}
          <div className="flex items-center gap-2 text-xs">
            {appMode === 'admin' && (
              <div className="flex items-center gap-1.5 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
                <span className="text-slate-400 text-[10px] uppercase font-mono">Role:</span>
                <select
                  value={currentStaffRole}
                  onChange={(e) => setCurrentStaffRole(e.target.value as StaffRole)}
                  className="bg-transparent text-indigo-400 font-semibold focus:outline-none cursor-pointer"
                >
                  <option value="super_admin" className="bg-slate-900 text-white">Super Admin</option>
                  <option value="admin" className="bg-slate-900 text-white">Administrator</option>
                  <option value="sales_agent" className="bg-slate-900 text-white">Sales Agent</option>
                  <option value="content_manager" className="bg-slate-900 text-white">Content Manager</option>
                  <option value="developer" className="bg-slate-900 text-white">Developer</option>
                </select>
              </div>
            )}

            {appMode !== 'admin' && (
              <div className="flex items-center gap-1.5 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
                <span className="text-slate-400 text-[10px] uppercase font-mono">Customer:</span>
                <select
                  value={activeCustomerId}
                  onChange={(e) => setActiveCustomerId(e.target.value)}
                  className="bg-transparent text-white font-semibold focus:outline-none cursor-pointer"
                >
                  {customers.map((c) => (
                    <option key={c.customerId} value={c.customerId} className="bg-slate-900 text-white">
                      {c.name} ({c.subdomain})
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1">
        {/* MODE 1: CENTRAL MPC ADMINISTRATION SYSTEM */}
        {appMode === 'admin' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
            {/* Admin Secondary Navigation Tabs */}
            <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto text-xs font-semibold">
              {[
                { id: 'overview', label: 'Operations Overview' },
                { id: 'enquiries', label: `Sales Queue (${enquiries.filter((e) => e.status === 'new').length})` },
                { id: 'customers', label: `Customer Accounts (${customers.length})` },
                { id: 'studio', label: 'Website Generation Studio' },
                { id: 'packages', label: 'Packages & Pricing (₦)' },
                { id: 'staff', label: `Staff & RBAC (${staffList.length})` },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setAdminTab(tab.id)}
                  className={`px-3 py-2 border-b-2 transition-all whitespace-nowrap shrink-0 ${
                    adminTab === tab.id
                      ? 'border-indigo-600 text-indigo-700 font-bold'
                      : 'border-transparent text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Admin Active Tab Content */}
            {adminTab === 'overview' && (
              <DashboardOverview
                customers={customers}
                enquiries={enquiries}
                projects={projects}
                packages={packages}
                onNavigate={(t) => setAdminTab(t)}
                onSelectCustomerForStudio={(cid) => {
                  setActiveCustomerId(cid);
                  setAdminTab('studio');
                }}
              />
            )}

            {adminTab === 'enquiries' && (
              <EnquiriesManager
                enquiries={enquiries}
                onAddEnquiry={handleAddEnquiry}
                onUpdateStatus={handleUpdateEnquiryStatus}
                onConvertToCustomer={handleConvertToCustomer}
              />
            )}

            {adminTab === 'customers' && (
              <CustomerManager
                customers={customers}
                packages={packages}
                onAddCustomer={handleAddCustomer}
                onUpdateStatus={handleUpdateCustomerStatus}
                onSelectCustomerForStudio={(cid) => {
                  setActiveCustomerId(cid);
                  setAdminTab('studio');
                }}
                onImpersonateCustomer={(cid) => {
                  setActiveCustomerId(cid);
                  setAppMode('customer');
                }}
              />
            )}

            {adminTab === 'studio' && (
              <WebsiteBuilderStudio
                customers={customers}
                selectedCustomerId={activeCustomerId}
                projects={projects}
                contents={contents}
                onSaveContent={handleSaveContent}
                onPublishWebsite={handlePublishWebsite}
              />
            )}

            {adminTab === 'packages' && (
              <PackageSettings
                packages={packages}
                onSavePackages={(pkgs) => setPackages(pkgs)}
                isSuperAdmin={currentStaffRole === 'super_admin' || currentStaffRole === 'admin'}
              />
            )}

            {adminTab === 'staff' && (
              <StaffManager
                staffList={staffList}
                currentStaffRole={currentStaffRole}
                onAddStaff={handleAddStaff}
                onUpdateRole={handleUpdateStaffRole}
                onToggleStatus={handleToggleStaffStatus}
              />
            )}
          </div>
        )}

        {/* MODE 2: CUSTOMER MY PERSONAL CLOUD WORKSPACE */}
        {appMode === 'customer' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
            <CustomerWorkspace
              customer={activeCustomer}
              project={activeProject}
              content={activeContent}
              pkg={packages[activeCustomer.packageId]}
              documents={currentCustomerDocs}
              pictures={currentCustomerPics}
              tasks={currentCustomerTasks}
              activities={currentCustomerActivities}
              calendarEvents={currentCustomerEvents}
              notes={currentCustomerNotes}
              goals={currentCustomerGoals}
              products={currentCustomerProducts}
              onAddDocument={(d) =>
                setDocuments([
                  { ...d, documentId: `doc_${Date.now()}`, createdAt: new Date().toISOString() },
                  ...documents,
                ])
              }
              onAddPicture={(p) =>
                setPictures([
                  { ...p, pictureId: `pic_${Date.now()}`, createdAt: new Date().toISOString() },
                  ...pictures,
                ])
              }
              onAddTask={(t) =>
                setTasks([
                  { ...t, taskId: `task_${Date.now()}`, createdAt: new Date().toISOString() },
                  ...tasks,
                ])
              }
              onToggleTaskStatus={(tid) =>
                setTasks(
                  tasks.map((t) =>
                    t.taskId === tid
                      ? {
                          ...t,
                          status:
                            t.status === 'todo'
                              ? 'in_progress'
                              : t.status === 'in_progress'
                              ? 'completed'
                              : 'todo',
                        }
                      : t
                  )
                )
              }
              onAddActivity={(a) =>
                setActivities([
                  { ...a, activityId: `act_${Date.now()}`, createdAt: new Date().toISOString() },
                  ...activities,
                ])
              }
              onToggleActivity={(aid) =>
                setActivities(
                  activities.map((a) => (a.activityId === aid ? { ...a, completed: !a.completed } : a))
                )
              }
              onAddCalendarEvent={(e) =>
                setCalendarEvents([{ ...e, eventId: `evt_${Date.now()}` }, ...calendarEvents])
              }
              onAddNote={(n) =>
                setNotes([
                  { ...n, noteId: `note_${Date.now()}`, updatedAt: new Date().toISOString() },
                  ...notes,
                ])
              }
              onAddGoal={(g) =>
                setGoals([{ ...g, goalId: `goal_${Date.now()}` }, ...goals])
              }
              onAddProduct={(p) =>
                setProducts([{ ...p, productId: `prod_${Date.now()}` }, ...products])
              }
              onActivateStoreRequest={() => {
                setCustomers(
                  customers.map((c) =>
                    c.customerId === activeCustomer.customerId
                      ? { ...c, storeAddonActive: true }
                      : c
                  )
                );
                alert('My Store add-on activated for customer!');
              }}
              onOpenLivePreview={() => setAppMode('live_site')}
            />
          </div>
        )}

        {/* MODE 3: FULL SCREEN LIVE DYNAMIC WEBSITE VIEW */}
        {appMode === 'live_site' && (
          <div>
            {/* Top Return Strip */}
            <div className="bg-slate-950 text-white text-xs px-6 py-2.5 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setAppMode('admin')}
                  className="inline-flex items-center gap-1.5 text-indigo-400 hover:text-white font-medium"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Return to Admin Portal
                </button>
                <span className="text-slate-600">·</span>
                <span className="text-slate-400">
                  Simulating Dynamic Host: <strong className="text-white font-mono">{activeCustomer.subdomain}.mpc.ng</strong>
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setAppMode('customer')}
                  className="text-xs text-slate-300 hover:text-white"
                >
                  Open {activeCustomer.name}'s Cloud Workspace
                </button>
              </div>
            </div>

            {/* Live Shared Website Template Rendering */}
            <TemplateRenderer
              templateId={activeProject?.templateId || activeCustomer.packageId}
              content={activeContent}
              isLive={true}
            />
          </div>
        )}
      </div>
    </div>
  );
}
