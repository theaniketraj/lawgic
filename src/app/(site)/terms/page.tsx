import type { Metadata } from 'next';
import { CtaCard } from '@/components/ui/cta-card';

export const metadata: Metadata = {
  title: 'Terms of Service | LAWgic',
  description: 'Please read these terms carefully before accessing the LAWgic platform and services.',
};

export default function TermsPage() {
  return (
    <div className="pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block py-1 px-3 rounded-full bg-primary-500/10 text-primary-500 text-sm font-semibold mb-4">
            Legal Agreements
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Terms of <span className="text-primary-500">Service</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Please read these terms carefully before accessing the LAWgic platform and services.
          </p>
        </div>

        <div className="space-y-8 text-gray-700 dark:text-gray-300">
          <section className="bg-white dark:bg-dark-primary p-8 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">1. Acceptance of Terms</h2>
            <p className="leading-relaxed">
              By creating an account, accessing, or utilizing the LAWgic services, you agree to comply with and be bound by these Terms of Service. If you do not agree with any part of these terms, you may not access or use our services.
            </p>
          </section>

          <section className="bg-white dark:bg-dark-primary p-8 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">2. No Legal Advice Disclaimer</h2>
            <p className="leading-relaxed">
              LAWgic is an Artificial Intelligence software application, not a law firm or a substitute for an attorney or law firm. All forms, documents, guidance, reasoning, and information provided are for informational and preparatory purposes. Our communications and the generations by LAWgic do not constitute professional legal advice and you should not rely on them as such. Use of the service does not create an attorney-client relationship. You must consult a qualified legal practitioner before acting on any generated drafts or legal reasoning.
            </p>
          </section>

          <section className="bg-white dark:bg-dark-primary p-8 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">3. User Responsibilities</h2>
            <p className="leading-relaxed">
              You bear the sole responsibility for evaluating the accuracy, completeness, legality, and usefulness of all responses, guidance, and documents generated. You agree that you will not use LAWgic for any unlawful purpose, to harass any person, to violate the legal rights of any third party, or to misuse the Indian Judiciary systems.
            </p>
          </section>

          <section className="bg-white dark:bg-dark-primary p-8 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">4. Intellectual Property</h2>
            <p className="leading-relaxed">
              The LAWgic platform, its proprietary AI models, its underlying codebase, UI/UX architecture, domain structures, and software are the exclusive intellectual property of its creators. The generated legal drafts and text output triggered by your specific prompts hold shared contextual rights dictated by applicable copyright laws, provided the usage remains strictly lawful.
            </p>
          </section>

          <section className="bg-white dark:bg-dark-primary p-8 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">5. Limitation of Liability</h2>
            <p className="leading-relaxed">
              To the maximum extent permitted by applicable law, LAWgic and its affiliates shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits, revenues, or data, resulting from the use or inability to use the platform, or the reliance on AI-generated procedural or case law data.
            </p>
          </section>
        </div>

        <div className="mt-20">
          <CtaCard 
            title="Ready to get started?"
            description="Embrace the future of law and begin your journey with LAWgic."
            backgroundClass="bg-linear-to-br from-gray-700 to-indigo-900 shadow-indigo-500/20"
          />
        </div>
      </div>
    </div>
  );
}
