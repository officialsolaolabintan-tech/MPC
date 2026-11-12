import React from 'react';
import { WebsiteContent } from '../../types/index.ts';
import { MessageSquare, Mail, Phone, MapPin, ShieldCheck, Award, ArrowRight, Star, ShoppingBag } from 'lucide-react';

interface Props {
  content: WebsiteContent;
  isLive?: boolean;
}

export const PremiumBusinessTemplate: React.FC<Props> = ({ content }) => {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans antialiased selection:bg-amber-500 selection:text-white">
      {/* Top Banner / Trust Bar */}
      <div className="bg-slate-950 text-slate-300 text-xs py-2 px-6 border-b border-slate-800">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-amber-400 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" /> Verified Enterprise Presence
            </span>
            <span className="text-slate-600">·</span>
            <span className="hidden sm:inline text-slate-400">Powered by My Personal Cloud Enterprise</span>
          </div>
          {content.contactEmail && (
            <span className="font-mono text-slate-400">{content.contactEmail}</span>
          )}
        </div>
      </div>

      {/* Main Navigation */}
      <header className="border-b border-slate-200 bg-white/95 backdrop-blur-md sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-6 h-18 flex items-center justify-between gap-8">
          <span className="font-extrabold text-xl tracking-tight text-slate-950 whitespace-nowrap shrink-0">
            {content.headline || 'Enterprise Hub'}
          </span>
          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold uppercase tracking-wider text-slate-600">
            <a href="#overview" className="hover:text-slate-950 transition-colors whitespace-nowrap shrink-0">Overview</a>
            <a href="#services" className="hover:text-slate-950 transition-colors whitespace-nowrap shrink-0">Capabilities</a>
            <a href="#about" className="hover:text-slate-950 transition-colors whitespace-nowrap shrink-0">Leadership</a>
            <a href="#contact" className="hover:text-slate-950 transition-colors whitespace-nowrap shrink-0">Inquiries</a>
          </nav>
          <div className="flex items-center gap-3 shrink-0">
            {content.whatsappNumber && (
              <a
                href={`https://wa.me/${content.whatsappNumber.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-lg bg-slate-950 hover:bg-slate-800 text-white font-medium text-xs flex items-center gap-2 transition-all whitespace-nowrap shrink-0"
              >
                <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
                <span>Executive Office</span>
              </a>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section with Enterprise Framing */}
      <section id="overview" className="py-20 md:py-28 px-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-amber-50 border border-amber-200/60 text-amber-900 text-xs font-medium">
              <Award className="w-3.5 h-3.5 text-amber-600" />
              <span>Premium Business & Executive Profile</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-950 leading-tight text-balance">
              {content.headline}
            </h1>

            <p className="text-base md:text-lg text-slate-600 font-normal leading-relaxed">
              {content.tagline || 'Leading strategic business initiatives, high-impact consulting, and institutional advisory.'}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              {content.whatsappNumber && (
                <a
                  href={`https://wa.me/${content.whatsappNumber.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-6 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center gap-2 transition-all shadow-md shadow-emerald-900/10"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Direct Priority Consultation</span>
                </a>
              )}
              {content.contactEmail && (
                <a
                  href={`mailto:${content.contactEmail}`}
                  className="px-5 py-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium text-xs flex items-center gap-2 transition-all border border-slate-300"
                >
                  <Mail className="w-4 h-4" />
                  <span>Send Official Brief</span>
                </a>
              )}
            </div>

            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-slate-200 font-mono text-xs">
              <div>
                <div className="text-slate-400">Response Cadence</div>
                <div className="font-bold text-slate-900 text-sm mt-0.5">Priority &lt; 2h</div>
              </div>
              <div>
                <div className="text-slate-400">Location</div>
                <div className="font-bold text-slate-900 text-sm mt-0.5 truncate">{content.location || 'Global'}</div>
              </div>
              <div>
                <div className="text-slate-400">Tier</div>
                <div className="font-bold text-amber-700 text-sm mt-0.5">MPC Premium</div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 flex justify-center">
            {content.avatarUrl ? (
              <div className="relative">
                <img
                  src={content.avatarUrl}
                  alt={content.headline}
                  referrerPolicy="no-referrer"
                  className="w-72 h-88 md:w-80 md:h-100 rounded-2xl object-cover border border-slate-200 shadow-xl"
                />
                <div className="absolute -bottom-4 -right-4 p-4 rounded-xl bg-slate-900 text-white text-xs border border-slate-800 shadow-lg">
                  <div className="font-bold">Verified MPC Identity</div>
                  <div className="text-slate-400 text-[10px]">Security Audited</div>
                </div>
              </div>
            ) : (
              <div className="w-72 h-88 md:w-80 md:h-100 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-5xl font-black text-slate-400">
                {content.headline ? content.headline.charAt(0) : 'E'}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Services & Capabilities */}
      {content.services && content.services.length > 0 && (
        <section id="services" className="py-20 bg-slate-50 border-y border-slate-200 px-6">
          <div className="max-w-6xl mx-auto space-y-12">
            <div>
              <span className="text-xs font-bold text-amber-600 uppercase tracking-widest">Capabilities</span>
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-950 mt-1">Core Competencies & Solutions</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {content.services.map((srv, idx) => (
                <div
                  key={srv.id || idx}
                  className="p-6 rounded-xl bg-white border border-slate-200 shadow-xs hover:border-slate-300 transition-all space-y-3"
                >
                  <div className="w-8 h-8 rounded-lg bg-amber-100/70 text-amber-800 flex items-center justify-center font-bold text-xs">
                    0{idx + 1}
                  </div>
                  <h3 className="font-bold text-slate-900 text-base">{srv.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">{srv.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Leadership Biography */}
      {content.biography && (
        <section id="about" className="py-20 px-6 max-w-6xl mx-auto">
          <div className="max-w-3xl space-y-4">
            <span className="text-xs font-bold text-amber-600 uppercase tracking-widest">Executive Statement</span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-950">Background & Vision</h2>
            <div className="text-sm md:text-base text-slate-700 leading-relaxed whitespace-pre-line pt-2">
              {content.biography}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer id="contact" className="py-12 border-t border-slate-200 bg-slate-950 text-white px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-400">
          <div>
            <div className="font-bold text-white text-sm">{content.headline}</div>
            <div className="text-xs mt-0.5">Managed Personal & Business Cloud · MPC Platform</div>
          </div>
          <div className="flex items-center gap-6">
            {content.contactEmail && <span>{content.contactEmail}</span>}
            {content.phone && <span>{content.phone}</span>}
          </div>
        </div>
      </footer>
    </div>
  );
};
