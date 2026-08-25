import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { TrustProof } from './components/TrustProof';
import { ServicesSection } from './components/ServicesSection';
import { WhyEditAura } from './components/WhyEditAura';
import { PortfolioSection } from './components/PortfolioSection';
import { ProcessSection } from './components/ProcessSection';
import { AiAutomationSection } from './components/AiAutomationSection';
import { GrowthCalculator } from './components/GrowthCalculator';
import { TestimonialsSection } from './components/TestimonialsSection';
import { FaqSection } from './components/FaqSection';
import { FinalCta } from './components/FinalCta';
import { Footer } from './components/Footer';
import { ConsultationModal } from './components/ConsultationModal';
import { CareersModal } from './components/CareersModal';
import { MessageCircle } from 'lucide-react';

export function App() {
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<string | undefined>(undefined);
  const [selectedBlueprint, setSelectedBlueprint] = useState<{
    budget: number;
    industry: string;
    services: string[];
    projectedLeads: number;
  } | null>(null);

  // Careers state
  const [isCareersOpen, setIsCareersOpen] = useState(false);
  const [careersCategory, setCareersCategory] = useState<string | undefined>(undefined);

  const handleOpenConsultation = () => {
    setSelectedService(undefined);
    setSelectedBlueprint(null);
    setIsConsultationOpen(true);
  };

  const handleOpenWithService = (serviceName: string) => {
    setSelectedService(serviceName);
    setSelectedBlueprint(null);
    setIsConsultationOpen(true);
  };

  const handleApplyBlueprint = (blueprint: {
    budget: number;
    industry: string;
    services: string[];
    projectedLeads: number;
  }) => {
    setSelectedBlueprint(blueprint);
    setSelectedService(undefined);
    setIsConsultationOpen(true);
  };

  const handleOpenCareers = (category?: string) => {
    setCareersCategory(category || 'all');
    setIsCareersOpen(true);
  };

  const handleFloatingWhatsApp = () => {
    const msg = encodeURIComponent("Hi EDIT AURA! I'm on your website and would love to discuss growing my brand.");
    window.open(`https://wa.me/918308442092?text=${msg}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#f5f5f5] flex flex-col selection:bg-purple-600 selection:text-white font-sans">
      {/* 1. Sticky Navigation Bar with 3-Dots Careers Menu */}
      <Navbar
        onOpenConsultation={handleOpenConsultation}
        onOpenCareers={handleOpenCareers}
      />

      {/* Main Content Sections */}
      <main className="flex-grow">
        {/* 2. Hero Section */}
        <Hero onOpenConsultation={handleOpenConsultation} />

        {/* 3. Trust & Social Proof */}
        <TrustProof />

        {/* 4. Services 3x3 Grid */}
        <ServicesSection onOpenConsultationWithService={handleOpenWithService} />

        {/* 5. Why EDIT AURA */}
        <WhyEditAura />

        {/* 6. Featured Work / Portfolio */}
        <PortfolioSection onOpenConsultation={handleOpenConsultation} />

        {/* 7. Process Timeline */}
        <ProcessSection />

        {/* 8. AI + Automation */}
        <AiAutomationSection onOpenConsultation={handleOpenConsultation} />

        {/* 9. Interactive Growth & ROI Calculator */}
        <GrowthCalculator onApplyBlueprint={handleApplyBlueprint} />

        {/* 10. Client Testimonials */}
        <TestimonialsSection />

        {/* 11. FAQ Accordion */}
        <FaqSection />

        {/* 12. Final Dramatic CTA */}
        <FinalCta onOpenConsultation={handleOpenConsultation} />
      </main>

      {/* 13. Footer */}
      <Footer
        onOpenConsultation={handleOpenConsultation}
        onOpenCareers={handleOpenCareers}
      />

      {/* Floating Instant WhatsApp Button */}
      <button
        onClick={handleFloatingWhatsApp}
        className="fixed bottom-6 right-6 z-40 p-3.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black shadow-2xl shadow-emerald-950/60 hover:scale-110 active:scale-95 transition-all duration-200 flex items-center justify-center group"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="w-6 h-6 fill-black text-emerald-500" />
        <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs group-hover:ml-2 font-bold text-xs transition-all duration-300">
          Chat With Us
        </span>
      </button>

      {/* Global Consultation & Project Proposal Modal */}
      <ConsultationModal
        isOpen={isConsultationOpen}
        onClose={() => setIsConsultationOpen(false)}
        initialService={selectedService}
        initialBlueprint={selectedBlueprint}
      />

      {/* Freelancer Careers & Talent Roster Modal */}
      <CareersModal
        isOpen={isCareersOpen}
        onClose={() => setIsCareersOpen(false)}
        initialRoleCategory={careersCategory}
      />
    </div>
  );
}

export default App;
