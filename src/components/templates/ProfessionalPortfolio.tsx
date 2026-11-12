import React from 'react';
import { WebsiteContent } from '../../types/index.ts';
import { MessageSquare, Mail, Phone, MapPin, Briefcase, ChevronRight, CheckCircle2, ArrowUpRight } from 'lucide-react';

interface Props {
  content: WebsiteContent;
  isLive?: boolean;
}

export const ProfessionalPortfolioTemplate: React.FC<Props> = ({ content }) => {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans antialiased selection:bg-indigo-500 selection:text-white">
      {/* Top Bar Contract: 3 zones */}
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between gap-8">
          <a href="#top" className="font-bold text-base tracking-tight text-white whitespace-nowrap shrink-0">
            {content.headline || 'Portfolio'}
          </a>
          <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-400">
            <a href="#about" className="hover:text-white transition-colors whitespace-nowrap shrink-0">About</a>
            <a href="#services" className="hover:text-white transition-colors whitespace-nowrap shrink-0">Services</a>
            {content.galleryImages && content.galleryImages.length > 0 && (
              <a href="#gallery" className="hover:text-white transition-colors whitespace-nowrap shrink-0">Portfolio</a>
            )}
            <a href="#contact" className="hover:text-white transition-colors whitespace-nowrap shrink-0">Contact</a>
          </nav>
          <div className="flex items-center gap-3 shrink-0">
            {content.whatsappNumber && (
              <a
                href={`https://wa.me/${content.whatsappNumber.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-medium text-xs flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Let's Talk</span>
              </a>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="top" className="py-20 md:py-28 px-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-400 tracking-wider uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
              Professional Identity & Portfolio
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight text-balance">
              {content.headline}
            </h1>
            <p className="text-base md:text-lg text-slate-300 font-normal leading-relaxed">
              {content.tagline || 'Delivering measurable impact and verified consulting expertise.'}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              {content.whatsappNumber && (
                <a
                  href={`https://wa.me/${content.whatsappNumber.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs flex items-center gap-2 transition-all shadow-md shadow-indigo-600/20"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Start Conversation</span>
                </a>
              )}
              {content.contactEmail && (
                <a
                  href={`mailto:${content.contactEmail}`}
                  className="px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs flex items-center gap-2 transition-all border border-slate-700"
                >
                  <Mail className="w-4 h-4" />
                  <span>{content.contactEmail}</span>
                </a>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-6 pt-4 text-xs text-slate-400 font-mono">
              {content.location && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                  {content.location}
                </span>
              )}
              {content.phone && (
                <span className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-indigo-400" />
                  {content.phone}
                </span>
              )}
            </div>
          </div>

          <div className="lg:col-span-5 flex justify-center">
            {content.avatarUrl ? (
              <img
                src={content.avatarUrl}
                alt={content.headline}
                referrerPolicy="no-referrer"
                className="w-72 h-80 md:w-80 md:h-96 rounded-2xl object-cover border border-slate-800 shadow-2xl shadow-indigo-950/40"
              />
            ) : (
              <div className="w-72 h-80 md:w-80 md:h-96 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-4xl font-bold text-indigo-400">
                {content.headline ? content.headline.charAt(0) : 'P'}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Services Section */}
      {content.services && content.services.length > 0 && (
        <section id="services" className="py-20 bg-slate-950/60 border-t border-slate-800/80 px-6">
          <div className="max-w-6xl mx-auto space-y-12">
            <div className="max-w-2xl">
              <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">Offerings</span>
              <h2 className="text-2xl md:text-3xl font-bold text-white mt-1">Specialized Services</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {content.services.map((srv, idx) => (
                <div
                  key={srv.id || idx}
                  className="p-6 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors space-y-3"
                >
                  <div className="w-9 h-9 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <h3 className="font-semibold text-white text-base">{srv.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed font-normal">{srv.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Biography Section */}
      {content.biography && (
        <section id="about" className="py-20 px-6 max-w-6xl mx-auto border-t border-slate-800">
          <div className="max-w-3xl space-y-4">
            <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">About Me</span>
            <h2 className="text-2xl md:text-3xl font-bold text-white">Background & Philosophy</h2>
            <div className="text-sm md:text-base text-slate-300 leading-relaxed whitespace-pre-line pt-2">
              {content.biography}
            </div>
          </div>
        </section>
      )}

      {/* Gallery / Portfolio Section */}
      {content.galleryImages && content.galleryImages.length > 0 && (
        <section id="gallery" className="py-20 bg-slate-950 px-6 border-t border-slate-800">
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">Showcase</span>
                <h2 className="text-2xl md:text-3xl font-bold text-white mt-1">Portfolio & Project Gallery</h2>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {content.galleryImages.map((imgUrl, i) => (
                <div key={i} className="group relative rounded-xl overflow-hidden border border-slate-800 bg-slate-900 aspect-4/3">
                  <img
                    src={imgUrl}
                    alt={`Portfolio showcase ${i + 1}`}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <span className="text-xs font-medium text-white flex items-center gap-1">
                      View Asset <ArrowUpRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer id="contact" className="py-12 border-t border-slate-800 bg-slate-950 px-6 text-center text-xs text-slate-500">
        <p className="max-w-md mx-auto">
          Official Professional Presence powered by <span className="font-semibold text-slate-300">My Personal Cloud (MPC)</span>.
        </p>
      </footer>
    </div>
  );
};
