import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { X, Check, ArrowRight, Sparkles, MessageCircle, ShieldCheck, CheckCircle2, Mail, Send } from 'lucide-react';
import { Logo } from './Logo';
import { AGENCY_EMAIL, AGENCY_WHATSAPP } from '../data/agencyData';

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialService?: string;
  initialBlueprint?: {
    budget: number;
    industry: string;
    services: string[];
    projectedLeads: number;
  } | null;
}

export const ConsultationModal: React.FC<ConsultationModalProps> = ({
  isOpen,
  onClose,
  initialService,
  initialBlueprint
}) => {
  const [step, setStep] = useState(1);
  const [services, setServices] = useState<string[]>(
    initialBlueprint?.services || (initialService ? [initialService] : ['Branding & Creative Design', 'Content Creation'])
  );
  const [budget, setBudget] = useState(
    initialBlueprint ? `₹${initialBlueprint.budget.toLocaleString()}/mo` : '₹10,000 - ₹30,000 / month (Starter)'
  );
  const [timeline, setTimeline] = useState('Immediately (Within 1-2 weeks)');

  // Form Details
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    website: '',
    goals: ''
  });

  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const toggleService = (srv: string) => {
    setServices((prev) =>
      prev.includes(srv) ? prev.filter((s) => s !== srv) : [...prev, srv]
    );
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleEmailDispatch = () => {
    const subject = encodeURIComponent(`[Project Consultation Request] ${formData.company || 'New Client'} - ${formData.name}`);
    const body = encodeURIComponent(
      `Project Consultation Request for EDIT AURA\n\n` +
      `CLIENT & BRAND DETAILS:\n` +
      `• Name: ${formData.name}\n` +
      `• Company / Brand: ${formData.company}\n` +
      `• Work Email: ${formData.email}\n` +
      `• Phone / WhatsApp: ${formData.phone}\n` +
      `• Website / Instagram: ${formData.website || 'N/A'}\n\n` +
      `PROJECT SCOPE:\n` +
      `• Budget: ${budget}\n` +
      `• Timeline: ${timeline}\n` +
      `• Selected Services: ${services.join(', ')}\n` +
      `• Primary Goals & Notes: ${formData.goals || 'Scale brand presence and customer acquisition.'}\n\n` +
      `---\nSubmitted via EDIT AURA Website (Destination: ${AGENCY_EMAIL})`
    );
    window.open(`mailto:${AGENCY_EMAIL}?subject=${subject}&body=${body}`, '_self');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }

    // Also trigger email client in background
    setTimeout(() => {
      handleEmailDispatch();
    }, 400);
  };

  const handleWhatsAppForward = () => {
    const summary = encodeURIComponent(
      `*New Project Consultation Request - EDIT AURA*\n\n` +
      `*Name:* ${formData.name}\n` +
      `*Company:* ${formData.company}\n` +
      `*Email:* ${formData.email}\n` +
      `*Phone:* ${formData.phone}\n` +
      `*Website:* ${formData.website || 'N/A'}\n` +
      `*Budget:* ${budget}\n` +
      `*Timeline:* ${timeline}\n` +
      `*Services:* ${services.join(', ')}\n` +
      `*Goals:* ${formData.goals || 'Looking to scale brand and leads.'}`
    );
    window.open(`https://wa.me/${AGENCY_WHATSAPP}?text=${summary}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-xl animate-fadeIn">
      <div
        className="bg-[#0c0c14]/90 border border-white/20 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl backdrop-blur-2xl relative max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-400 hover:text-white transition-colors backdrop-blur-md"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="flex items-center gap-3 mb-6">
          <Logo variant="mark" size="sm" />
          <span className="text-xs font-mono uppercase tracking-widest text-[#c084fc] font-bold">
            Growth Consultation
          </span>
        </div>

        {!submitted ? (
          <div>
            {/* Step Progress Bar */}
            <div className="flex items-center justify-between gap-2 mb-6">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`h-1.5 flex-1 rounded-full transition-colors ${
                    step >= s ? 'bg-gradient-to-r from-[#818cf8] to-[#c084fc]' : 'bg-white/10'
                  }`}
                />
              ))}
            </div>

            {/* STEP 1: Services Selection */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-black text-white font-display">
                    What are you looking to build or scale?
                  </h3>
                  <p className="text-[#a1a1aa] text-xs sm:text-sm mt-1">
                    Select all areas where your brand needs growth acceleration.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {[
                    'Social Media Management',
                    'Content Creation & Video',
                    'Branding & Visual Identity',
                    'Online Book Publishing (Amazon Kindle & Marketplace)',
                    'AI Marketing & Workflows',
                    'Custom Website Development',
                    'Search Engine Optimization (SEO)',
                    'Performance Marketing (Meta/Google)',
                    'WhatsApp Automation',
                    'Full Growth Retainer'
                  ].map((srv) => {
                    const isChecked = services.includes(srv);
                    return (
                      <button
                        key={srv}
                        type="button"
                        onClick={() => toggleService(srv)}
                        className={`p-4 rounded-2xl border text-left text-xs font-semibold transition-all flex items-center justify-between backdrop-blur-md ${
                          isChecked
                            ? 'bg-white/15 border-white/30 text-white shadow-lg shadow-purple-500/20'
                            : 'bg-white/5 border-white/10 text-zinc-300 hover:text-white hover:bg-white/10 hover:border-white/20'
                        }`}
                      >
                        <span className="truncate pr-2">{srv}</span>
                        <div className={`w-4 h-4 rounded flex items-center justify-center text-[10px] ${
                          isChecked ? 'bg-[#8b5cf6] text-white font-bold' : 'border border-white/20'
                        }`}>
                          {isChecked ? '✓' : ''}
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    disabled={services.length === 0}
                    onClick={() => setStep(2)}
                    className="px-7 py-3.5 rounded-full bg-[#8b5cf6] hover:bg-[#7c3aed] text-white font-bold text-sm transition-all flex items-center gap-2 disabled:opacity-40 disabled:pointer-events-none shadow-lg shadow-purple-500/25 active:scale-95"
                  >
                    <span>Next: Budget & Timeline</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: Budget & Timeline */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-black text-white font-display">
                    Budget & Timeline Preferences
                  </h3>
                  <p className="text-[#a1a1aa] text-xs sm:text-sm mt-1">
                    This helps us structure the right team and media allocation.
                  </p>
                </div>

                {/* Budget */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-mono uppercase tracking-wider text-zinc-300 font-bold block">
                      Estimated Monthly Marketing / Media Budget
                    </label>
                    <span className="text-[10px] text-purple-400 font-mono">Min. budget: Rs. 10,000</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {[
                      '₹10,000 - ₹30,000 / month (Starter)',
                      '₹30,000 - ₹1,00,000 / month (Growth)',
                      '₹1,00,000 - ₹3,00,000 / month (Scale)',
                      '₹3,00,000+ / month (Enterprise & Multi-channel)'
                    ].map((b) => (
                      <button
                        key={b}
                        type="button"
                        onClick={() => setBudget(b)}
                        className={`p-3.5 rounded-2xl border text-left text-xs font-semibold transition-all backdrop-blur-md ${
                          budget === b
                            ? 'bg-white/15 border-white/30 text-white shadow-lg shadow-purple-500/20'
                            : 'bg-white/5 border-white/10 text-zinc-300 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Timeline */}
                <div className="space-y-2">
                  <label className="text-xs font-mono uppercase tracking-wider text-zinc-300 font-bold block">
                    Target Start Date
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {[
                      'Immediately (1-2 weeks)',
                      'Within 30 Days',
                      'Just exploring / Q2-Q3'
                    ].map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setTimeline(t)}
                        className={`p-3.5 rounded-2xl border text-left text-xs font-semibold transition-all backdrop-blur-md ${
                          timeline === t
                            ? 'bg-white/15 border-white/30 text-white shadow-lg shadow-purple-500/20'
                            : 'bg-white/5 border-white/10 text-zinc-300 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4 flex justify-between">
                  <button
                    onClick={() => setStep(1)}
                    className="px-5 py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 text-xs font-semibold"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    className="px-7 py-3.5 rounded-full bg-[#8b5cf6] hover:bg-[#7c3aed] text-white font-bold text-sm transition-all flex items-center gap-2 shadow-lg shadow-purple-500/25 active:scale-95"
                  >
                    <span>Next: Contact Details</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Contact & Business Details */}
            {step === 3 && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <h3 className="text-2xl font-black text-white font-display">
                    Tell us about your brand
                  </h3>
                  <p className="text-[#a1a1aa] text-xs sm:text-sm mt-1">
                    We will review your channels and prepare a bespoke roadmap before our call.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-mono uppercase text-zinc-300 font-bold block mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g. Alex Morgan"
                      className="w-full p-3.5 rounded-2xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-purple-400 backdrop-blur-md"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-mono uppercase text-zinc-300 font-bold block mb-1">
                      Company / Brand Name *
                    </label>
                    <input
                      type="text"
                      name="company"
                      required
                      value={formData.company}
                      onChange={handleInputChange}
                      placeholder="e.g. Lumina Apparel"
                      className="w-full p-3.5 rounded-2xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-purple-400 backdrop-blur-md"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-mono uppercase text-zinc-300 font-bold block mb-1">
                      Work Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="alex@company.com"
                      className="w-full p-3.5 rounded-2xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-purple-400 backdrop-blur-md"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-mono uppercase text-zinc-300 font-bold block mb-1">
                      WhatsApp / Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+91 98765 43210 or +1..."
                      className="w-full p-3.5 rounded-2xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-purple-400 backdrop-blur-md"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-mono uppercase text-zinc-300 font-bold block mb-1">
                    Website or Instagram URL
                  </label>
                  <input
                    type="text"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    placeholder="https://instagram.com/yourbrand or website.com"
                    className="w-full p-3.5 rounded-2xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-purple-400 backdrop-blur-md"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-mono uppercase text-zinc-300 font-bold block mb-1">
                    Primary Goal or Growth Bottleneck
                  </label>
                  <textarea
                    name="goals"
                    rows={2}
                    value={formData.goals}
                    onChange={handleInputChange}
                    placeholder="e.g. Scaling revenue from $30k to $100k/mo with video reels, Meta ads, and automated WhatsApp follow-ups."
                    className="w-full p-3.5 rounded-2xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-purple-400 backdrop-blur-md"
                  />
                </div>

                <div className="pt-3 flex flex-col sm:flex-row justify-between items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 text-xs font-semibold"
                  >
                    Back
                  </button>
                  <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                    <span className="text-[11px] text-zinc-400 font-mono hidden sm:inline">
                      Routes directly to <span className="text-purple-300 font-bold">{AGENCY_EMAIL}</span>
                    </span>
                    <button
                      type="submit"
                      className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-[#8b5cf6] hover:bg-[#7c3aed] text-white font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-purple-500/25 active:scale-95 cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4 text-white" />
                      <span>Submit & Book Strategy Call</span>
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        ) : (
          /* Confirmation State */
          <div className="text-center py-6 space-y-6 animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs font-mono uppercase text-[#c084fc] tracking-widest font-bold">
                Proposal Request Received · {AGENCY_EMAIL}
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-white font-display mt-1">
                Your Brand Aura Blueprint is in Motion!
              </h3>
              <p className="text-[#a1a1aa] text-sm max-w-md mx-auto mt-2">
                Thank you, <strong>{formData.name}</strong>! Your inquiry has been routed to <strong>{AGENCY_EMAIL}</strong>. Our strategy team will reach out within 2 hours.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 text-left text-xs text-zinc-300 space-y-1.5 max-w-md mx-auto font-mono backdrop-blur-md">
              <div>• <strong>Brand:</strong> {formData.company}</div>
              <div>• <strong>Target Services:</strong> {services.slice(0, 3).join(', ')}{services.length > 3 ? '...' : ''}</div>
              <div>• <strong>Timeline:</strong> {timeline}</div>
              <div>• <strong>Recipient:</strong> {AGENCY_EMAIL}</div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={handleEmailDispatch}
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors shadow-lg shadow-purple-950/50"
              >
                <Mail className="w-4 h-4" />
                <span>Send Direct to {AGENCY_EMAIL}</span>
              </button>

              <button
                onClick={handleWhatsAppForward}
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-emerald-500 text-black font-bold text-xs sm:text-sm flex items-center justify-center gap-2 hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-950/50"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Fast-Track on WhatsApp</span>
              </button>

              <button
                onClick={onClose}
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 text-xs sm:text-sm font-semibold transition-colors"
              >
                Close Window
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
