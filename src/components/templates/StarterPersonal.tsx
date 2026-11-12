import React from 'react';
import { WebsiteContent } from '../../types/index.ts';
import { MessageSquare, Mail, Phone, MapPin, Globe, ExternalLink, ArrowRight } from 'lucide-react';

interface Props {
  content: WebsiteContent;
  isLive?: boolean;
}

export const StarterPersonalTemplate: React.FC<Props> = ({ content }) => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased selection:bg-indigo-500 selection:text-white">
      {/* Top Header */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between gap-8">
          <span className="font-bold text-lg tracking-tight text-slate-900 whitespace-nowrap shrink-0">
            {content.headline || 'Personal Profile'}
          </span>
          <div className="flex items-center gap-4 text-xs font-medium text-slate-600">
            {content.whatsappNumber && (
              <a
                href={`https://wa.me/${content.whatsappNumber.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-colors whitespace-nowrap shrink-0"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </a>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 md:py-24 px-6 max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12">
          {content.avatarUrl ? (
            <img
              src={content.avatarUrl}
              alt={content.headline}
              referrerPolicy="no-referrer"
              className="w-36 h-36 md:w-44 md:h-44 rounded-2xl object-cover border border-slate-200 shadow-sm shrink-0"
            />
          ) : (
            <div className="w-36 h-36 md:w-44 md:h-44 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-3xl shrink-0">
              {content.headline ? content.headline.charAt(0).toUpperCase() : 'M'}
            </div>
          )}

          <div className="flex-1 text-center md:text-left space-y-4">
            <div className="text-xs font-semibold text-indigo-600 tracking-wider uppercase">
              Official Personal Profile
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 text-balance">
              {content.headline}
            </h1>
            <p className="text-base text-slate-600 leading-relaxed font-normal">
              {content.tagline || 'Digital Identity hosted on My Personal Cloud.'}
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2 text-xs text-slate-500">
              {content.location && (
                <span className="inline-flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {content.location}
                </span>
              )}
              {content.contactEmail && (
                <span className="inline-flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  {content.contactEmail}
                </span>
              )}
              {content.phone && (
                <span className="inline-flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  {content.phone}
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Biography Section */}
      {content.biography && (
        <section className="py-12 bg-white border-y border-slate-200 px-6">
          <div className="max-w-4xl mx-auto space-y-4">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Biography & Background
            </h2>
            <div className="text-sm md:text-base text-slate-700 leading-relaxed whitespace-pre-line">
              {content.biography}
            </div>
          </div>
        </section>
      )}

      {/* Experience / Career Highlights */}
      {content.experience && content.experience.length > 0 && (
        <section className="py-12 px-6 max-w-4xl mx-auto">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-6">
            Career & Experience
          </h2>
          <div className="space-y-4">
            {content.experience.map((item, idx) => (
              <div
                key={item.id || idx}
                className="p-5 bg-white rounded-xl border border-slate-200/80 shadow-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                  <h3 className="font-semibold text-slate-900 text-sm md:text-base">{item.role}</h3>
                  <span className="text-xs text-slate-500 font-mono">{item.period}</span>
                </div>
                <div className="text-xs font-medium text-indigo-600 mb-2">{item.companyOrClient}</div>
                <p className="text-xs md:text-sm text-slate-600 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Social Links & Direct WhatsApp CTA */}
      <section className="py-12 bg-slate-900 text-white px-6">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-lg font-bold">Connect Directly</h3>
            <p className="text-xs text-slate-400 mt-1">
              Reach out for consultations, inquiries, or professional collaborations.
            </p>
          </div>
          <div className="flex items-center gap-3">
            {content.whatsappNumber && (
              <a
                href={`https://wa.me/${content.whatsappNumber.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="px-5 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-medium text-xs flex items-center gap-2 transition-all"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Message on WhatsApp</span>
              </a>
            )}
            {content.contactEmail && (
              <a
                href={`mailto:${content.contactEmail}`}
                className="px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs flex items-center gap-2 transition-all border border-slate-700"
              >
                <Mail className="w-4 h-4" />
                <span>Email</span>
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 border-t border-slate-200 text-center text-xs text-slate-500 bg-white">
        <p>
          Powered by <span className="font-semibold text-slate-800">My Personal Cloud (MPC)</span> · Managed Digital Identity
        </p>
      </footer>
    </div>
  );
};
