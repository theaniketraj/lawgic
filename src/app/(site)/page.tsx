import BenefitsGrid from '@/components/sections/benefits-grid';
import FaqAccordion from '@/components/sections/faq-accordion';
import HeroSection from '@/components/sections/hero-section';
import ToolsTab from '@/components/sections/tools-tab';
import { CoreFeatures } from '@/components/sections/core-features';
import { CtaCard } from '@/components/ui/cta-card';

export default async function Home() {
  return (
    <>
      <HeroSection />
      <CoreFeatures />
      <ToolsTab />
      <BenefitsGrid />
      <FaqAccordion />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 md:mt-20 pb-20">
        <CtaCard 
          title="Empower Your Legal Practice Today"
          description="Get instant access to BNS conversions, case laws, and AI document drafting."
          backgroundClass="bg-linear-to-br from-primary-600 to-purple-600 shadow-primary-500/20"
        />
      </div>
    </>
  );
}
