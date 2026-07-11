import type { Metadata } from 'next';
import { CtaCard } from '@/components/ui/cta-card';

export const metadata: Metadata = {
  title: 'Privacy Policy | LAWgic',
  description: 'Your data security and confidentiality are our highest priorities.',
};

export default function PrivacyPage() {
  return (
    <div className="pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block py-1 px-3 rounded-full bg-primary-500/10 text-primary-500 text-sm font-semibold mb-4">
            Legal Information
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Privacy <span className="text-primary-500">Policy</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Your data security and confidentiality are our highest priorities.
          </p>
        </div>

        <div className="space-y-8 text-gray-700 dark:text-gray-300">
          <section className="bg-white dark:bg-dark-primary p-8 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">1. Information We Collect</h2>
            <p className="leading-relaxed">
              When you use LAWgic, we may collect information regarding your usage of the platform, including input queries, documents analyzed, and interaction metadata. We collect the minimum amount of information necessary to provide you with accurate legal reasoning and drafting services.
            </p>
          </section>

          <section className="bg-white dark:bg-dark-primary p-8 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">2. How We Use Your Information</h2>
            <p className="leading-relaxed">
              Your information is used solely to generate responses, legal drafts, and provide procedural guidance. We do not use your confidential case data or queries to train generalized language models without your explicit consent. Your data remains yours.
            </p>
          </section>

          <section className="bg-white dark:bg-dark-primary p-8 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">3. Data Security &amp; Encryption</h2>
            <p className="leading-relaxed">
              We employ enterprise-grade encryption (TLS 1.3 in transit, AES-256 at rest) to secure all interactions. All data processing occurs in secure, isolated environments ensuring that attorney-client privilege and sensitive case details are rigorously protected.
            </p>
          </section>

          <section className="bg-white dark:bg-dark-primary p-8 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">4. Third-Party Sharing</h2>
            <p className="leading-relaxed">
              We do not sell, rent, or share your personal information or case data with third parties for marketing purposes. Data may be processed by trusted infrastructure providers strictly under confidentiality agreements that comply with applicable data protection laws.
            </p>
          </section>
        </div>

        <div className="mt-20">
          <CtaCard 
            title="Secure, Private, Intelligent"
            description="Your data is safe with us. Start researching with complete peace of mind."
            backgroundClass="bg-linear-to-br from-emerald-600 to-teal-700 shadow-teal-500/20"
          />
        </div>
      </div>
    </div>
  );
}
