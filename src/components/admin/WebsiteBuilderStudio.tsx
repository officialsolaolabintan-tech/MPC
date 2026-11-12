import React, { useState, useEffect } from 'react';
import { Customer, WebsiteContent, WebsiteProject } from '../../types/index.ts';
import { TemplateRenderer } from '../templates/TemplateRenderer.tsx';
import {
  Sparkles,
  Globe,
  Smartphone,
  Monitor,
  CheckCircle,
  Eye,
  RefreshCw,
  Plus,
  Trash2,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';

interface Props {
  customers: Customer[];
  selectedCustomerId?: string;
  projects: WebsiteProject[];
  contents: Record<string, WebsiteContent>;
  onSaveContent: (customerId: string, content: WebsiteContent) => void;
  onPublishWebsite: (projectId: string, subdomain: string) => void;
}

export const WebsiteBuilderStudio: React.FC<Props> = ({
  customers,
  selectedCustomerId,
  projects,
  contents,
  onSaveContent,
  onPublishWebsite,
}) => {
  const [activeCustomerId, setActiveCustomerId] = useState<string>(
    selectedCustomerId || (customers[0]?.customerId ?? '')
  );

  useEffect(() => {
    if (selectedCustomerId) {
      setActiveCustomerId(selectedCustomerId);
    }
  }, [selectedCustomerId]);

  const activeCustomer = customers.find((c) => c.customerId === activeCustomerId);
  const activeProject = projects.find((p) => p.customerId === activeCustomerId);

  // Form State
  const [templateId, setTemplateId] = useState<string>('starter');
  const [headline, setHeadline] = useState('');
  const [tagline, setTagline] = useState('');
  const [biography, setBiography] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [services, setServices] = useState<WebsiteContent['services']>([]);
  const [experience, setExperience] = useState<WebsiteContent['experience']>([]);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);

  // Preview Mode: 'desktop' | 'mobile'
  const [previewViewport, setPreviewViewport] = useState<'desktop' | 'mobile'>('desktop');
  const [isGenerated, setIsGenerated] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiNotice, setAiNotice] = useState<string | null>(null);

  // Sync state whenever active customer changes
  useEffect(() => {
    if (!activeCustomer) return;

    const existingContent = contents[activeCustomer.customerId];
    const initialTemplate =
      activeProject?.templateId ||
      (activeCustomer.packageId === 'premium'
        ? 'premium'
        : activeCustomer.packageId === 'pro'
        ? 'pro_portfolio'
        : 'starter');

    setTemplateId(initialTemplate);

    if (existingContent) {
      setHeadline(existingContent.headline || activeCustomer.name);
      setTagline(existingContent.tagline || '');
      setBiography(existingContent.biography || '');
      setAvatarUrl(existingContent.avatarUrl || '');
      setWhatsappNumber(existingContent.whatsappNumber || activeCustomer.phone || '');
      setContactEmail(existingContent.contactEmail || activeCustomer.email || '');
      setPhone(existingContent.phone || activeCustomer.phone || '');
      setLocation(existingContent.location || 'Lagos, Nigeria');
      setServices(existingContent.services || []);
      setExperience(existingContent.experience || []);
      setGalleryImages(existingContent.galleryImages || []);
      setIsGenerated(true);
    } else {
      // Default profile setup from customer account
      setHeadline(activeCustomer.name);
      setTagline(`Official ${activeCustomer.businessName || 'Consultant & Professional'} Profile`);
      setBiography(
        `${activeCustomer.name} is a results-driven professional specializing in leadership, operational excellence, and digital transformation.`
      );
      setAvatarUrl('');
      setWhatsappNumber(activeCustomer.phone || '+234 800 000 0000');
      setContactEmail(activeCustomer.email);
      setPhone(activeCustomer.phone || '');
      setLocation('Nigeria');
      setServices([
        {
          id: '1',
          title: 'Strategic Consultation',
          description: 'High-level advisory and roadmap planning for personal and corporate growth.',
        },
        {
          id: '2',
          title: 'Project Execution',
          description: 'Hands-on management and delivery of strategic business initiatives.',
        },
      ]);
      setExperience([
        {
          id: 'exp1',
          role: 'Principal Advisor',
          companyOrClient: activeCustomer.businessName || 'Enterprise Initiatives',
          period: '2023 — Present',
          description: 'Directing strategic programs and digital presence execution.',
        },
      ]);
      setGalleryImages([]);
      setIsGenerated(false);
    }
  }, [activeCustomerId, contents, customers, projects]);

  const handleGenerateWebsite = () => {
    if (!activeCustomer) return;

    const updatedContent: WebsiteContent = {
      customerId: activeCustomer.customerId,
      headline,
      tagline,
      biography,
      avatarUrl,
      whatsappNumber,
      contactEmail,
      phone,
      location,
      socialLinks: {},
      services,
      experience,
      galleryImages,
      updatedAt: new Date().toISOString(),
    };

    onSaveContent(activeCustomer.customerId, updatedContent);
    setIsGenerated(true);
  };

  const handleAiPolishBio = async () => {
    if (!biography) return;
    setIsAiLoading(true);
    setAiNotice(null);

    try {
      const response = await fetch('/api/ai/refine-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rawText: biography,
          contentType: 'Professional Executive Biography',
          customerName: activeCustomer?.name,
          businessName: activeCustomer?.businessName,
        }),
      });

      const data = await response.json();
      if (data.refined) {
        setBiography(data.refined);
        setAiNotice('Biography polished with AI (strict factual preservation enforced).');
      }
    } catch (err) {
      console.error(err);
      setAiNotice('Failed to connect to AI service. Reverting to original text.');
    } finally {
      setIsAiLoading(false);
    }
  };

  const currentPreviewContent: WebsiteContent = {
    customerId: activeCustomer?.customerId || 'preview',
    headline: headline || 'Your Name',
    tagline: tagline || 'Tagline description',
    biography,
    avatarUrl,
    whatsappNumber,
    contactEmail,
    phone,
    location,
    socialLinks: {},
    services,
    experience,
    galleryImages,
    updatedAt: new Date().toISOString(),
  };

  return (
    <div className="space-y-6">
      {/* Top Controller Bar */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Central Website Generation Studio
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Compile customer structured data into dynamic, responsive templates without individual code deployments
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Customer selector */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 font-medium">Customer:</span>
            <select
              value={activeCustomerId}
              onChange={(e) => setActiveCustomerId(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-slate-300 font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {customers.map((c) => (
                <option key={c.customerId} value={c.customerId}>
                  {c.name} ({c.packageId.toUpperCase()}) — {c.subdomain}.mpc.ng
                </option>
              ))}
            </select>
          </div>

          {/* Template Selector */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 font-medium">Template:</span>
            <select
              value={templateId}
              onChange={(e) => setTemplateId(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-slate-300 font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="starter">Starter — Minimal Personal (1 Page)</option>
              <option value="pro_portfolio">Professional — Portfolio & Showcase (5 Pages)</option>
              <option value="premium">Premium — Enterprise Hub (Full Suite)</option>
            </select>
          </div>

          <button
            onClick={handleGenerateWebsite}
            className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>GENERATE WEBSITE</span>
          </button>

          {activeProject && (
            <button
              onClick={() => onPublishWebsite(activeProject.projectId, activeCustomer?.subdomain || '')}
              className="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Approve & Publish</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Studio Split Layout: Left Editor, Right Live Preview */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        {/* Left Side: Structured Data Input (5 Columns) */}
        <div className="xl:col-span-5 bg-white rounded-xl border border-slate-200/80 p-6 shadow-2xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Structured Profile Content</h3>
              <p className="text-[11px] text-slate-500">
                Data entered by MPC staff from customer onboarding intake
              </p>
            </div>
            {activeProject?.status === 'published' ? (
              <span className="text-emerald-700 font-medium text-xs flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded">
                <Globe className="w-3.5 h-3.5" /> Live on Subdomain
              </span>
            ) : (
              <span className="text-amber-700 font-medium text-xs flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded">
                Pending Staff Approval
              </span>
            )}
          </div>

          {aiNotice && (
            <div className="p-3 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-900 text-xs flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <div>{aiNotice}</div>
            </div>
          )}

          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-700 font-medium mb-1">Headline / Name</label>
              <input
                type="text"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder="e.g. Dr. Amina Bello, Chief Medical Consultant"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1">Tagline / Mission</label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="e.g. Empowering community healthcare and strategic diagnostics."
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-medium mb-1">WhatsApp Direct</label>
                <input
                  type="text"
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  placeholder="+234 800 000 0000"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-medium mb-1">Public Email</label>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="contact@customer.com"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1">Avatar / Photo URL</label>
              <input
                type="text"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="https://... photo url"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <div className="text-[10px] text-slate-400 mt-0.5">
                Staff can paste customer uploaded headshot from the document/pictures vault.
              </div>
            </div>

            {/* Biography with AI Polish Button */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-slate-700 font-medium">Customer Biography</label>
                <button
                  type="button"
                  onClick={handleAiPolishBio}
                  disabled={isAiLoading || !biography}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-600 hover:text-indigo-700 disabled:opacity-50"
                >
                  <Sparkles className="w-3 h-3 text-indigo-500" />
                  {isAiLoading ? 'Polishing...' : 'Polish Flow (AI)'}
                </button>
              </div>
              <textarea
                rows={5}
                value={biography}
                onChange={(e) => setBiography(e.target.value)}
                placeholder="Customer credentials, professional background, achievements..."
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed font-sans"
              />
              <div className="text-[10px] text-slate-400 mt-0.5">
                AI assistance strictly refines grammar and flow without altering qualifications or facts.
              </div>
            </div>

            {/* Services Editor */}
            <div className="space-y-3 pt-3 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <label className="text-slate-700 font-semibold">Services & Offerings</label>
                <button
                  type="button"
                  onClick={() =>
                    setServices([
                      ...services,
                      {
                        id: String(Date.now()),
                        title: 'New Service',
                        description: 'Description of service.',
                      },
                    ])
                  }
                  className="text-[11px] font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" /> Add Service
                </button>
              </div>

              <div className="space-y-2">
                {services.map((srv, idx) => (
                  <div key={srv.id || idx} className="p-3 bg-slate-50 rounded-lg border border-slate-200/80 space-y-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={srv.title}
                        onChange={(e) => {
                          const updated = [...services];
                          updated[idx].title = e.target.value;
                          setServices(updated);
                        }}
                        placeholder="Service Title"
                        className="flex-1 px-2.5 py-1.5 rounded border border-slate-300 bg-white"
                      />
                      <button
                        type="button"
                        onClick={() => setServices(services.filter((_, i) => i !== idx))}
                        className="text-slate-400 hover:text-red-500 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <textarea
                      rows={2}
                      value={srv.description}
                      onChange={(e) => {
                        const updated = [...services];
                        updated[idx].description = e.target.value;
                        setServices(updated);
                      }}
                      placeholder="Brief description..."
                      className="w-full px-2.5 py-1.5 rounded border border-slate-300 bg-white"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Live Responsive Preview Engine (7 Columns) */}
        <div className="xl:col-span-7 space-y-4 sticky top-6">
          {/* Viewport Control Bar */}
          <div className="bg-slate-900 text-white rounded-xl p-3 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>
                {activeCustomer?.subdomain}.mpc.ng
              </span>
            </div>

            <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-lg">
              <button
                onClick={() => setPreviewViewport('desktop')}
                className={`px-3 py-1 text-xs font-medium rounded flex items-center gap-1.5 transition-colors ${
                  previewViewport === 'desktop'
                    ? 'bg-slate-700 text-white shadow-2xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>Desktop (1440px)</span>
              </button>
              <button
                onClick={() => setPreviewViewport('mobile')}
                className={`px-3 py-1 text-xs font-medium rounded flex items-center gap-1.5 transition-colors ${
                  previewViewport === 'mobile'
                    ? 'bg-slate-700 text-white shadow-2xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Mobile (375px)</span>
              </button>
            </div>
          </div>

          {/* Interactive Simulation Frame */}
          <div className="bg-slate-200/70 p-4 rounded-2xl border border-slate-300/80 flex justify-center overflow-x-auto min-h-[680px]">
            <div
              className={`transition-all duration-300 bg-white rounded-xl shadow-xl overflow-hidden border border-slate-300 ${
                previewViewport === 'mobile'
                  ? 'w-[375px] max-w-[375px] h-[780px] overflow-y-auto'
                  : 'w-full max-w-[940px] h-[780px] overflow-y-auto'
              }`}
            >
              <TemplateRenderer
                templateId={templateId}
                content={currentPreviewContent}
                isLive={false}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
