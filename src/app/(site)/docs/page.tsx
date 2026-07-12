import type { Metadata } from "next";
import Link from "next/link";
import { CtaCard } from "@/components/ui/cta-card";

export const metadata: Metadata = {
  title: "Docs | LAWgic",
  description:
    "Learn how to use LAWgic for legal research, drafting, and analysis.",
};

export default function DocsPage() {
  return (
    <div className="pt-24 pb-20 relative overflow-hidden">
      {/* Background Decorators */}
      <div className="absolute top-0 right-0 w-150 h-150 bg-primary-500/10 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-125 h-125 bg-cyan-500/10 rounded-full blur-[150px] -z-10 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center mb-20 relative z-10">
          <span className="inline-block py-1.5 px-4 rounded-full bg-primary-500/10 text-primary-500 text-sm font-semibold mb-4 border border-primary-500/20">
            Getting Started Guide
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight">
            How to use <span className="text-primary-500">LAWgic</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Your intelligent assistant for the Indian Judiciary. Follow this
            guide to master legal research and document drafting in minutes.
          </p>
        </div>

        {/* 3-Step Workflow Infographic */}
        <div className="mb-24 relative z-10">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              The 3-Step Workflow
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 relative">
            {/* Glowing Connection Nodes (Desktop only) */}
            <div className="hidden md:block absolute top-[64px] left-[16%] right-[16%] h-[2px] bg-linear-to-r from-primary-500/0 via-primary-500/30 to-primary-500/0 -z-10">
              {/* Glowing Pulse Effect */}
              <div className="absolute inset-0 bg-linear-to-r from-transparent via-primary-500 to-transparent blur-[4px] opacity-50 animate-pulse"></div>
              
              {/* Node 1 */}
              <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-primary-500 rounded-full shadow-[0_0_15px_rgba(99,102,241,1)] animate-pulse">
                <div className="absolute inset-0 rounded-full bg-primary-500 animate-ping opacity-75"></div>
              </div>
              
              {/* Node 2 */}
              <div className="absolute top-1/2 left-2/3 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-cyan-500 rounded-full shadow-[0_0_15px_rgba(6,182,212,1)] animate-pulse" style={{ animationDelay: '0.5s' }}>
                <div className="absolute inset-0 rounded-full bg-cyan-500 animate-ping opacity-75" style={{ animationDelay: '0.5s' }}></div>
              </div>
            </div>

            {/* Step 1 */}
            <div className="relative group">
              <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 h-full border border-gray-100 dark:border-gray-800 shadow-xl transition-transform duration-300 hover:-translate-y-2">
                <div className="w-16 h-16 bg-primary-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mb-6 mx-auto shadow-lg shadow-primary-500/30">
                  1
                </div>
                <h3 className="text-xl font-bold text-center text-gray-900 dark:text-white mb-3">
                  Ask a Legal Question
                </h3>
                <p className="text-center text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  Type your query in plain English. Describe your legal
                  scenario, ask for specific acts, or request precedences.
                </p>
                <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700">
                  <p className="text-xs text-gray-500 dark:text-gray-400 italic">
                    &quot;What are the grounds for divorce under the Hindu
                    Marriage Act?&quot;
                  </p>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative group">
              <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 h-full border border-gray-100 dark:border-gray-800 shadow-xl transition-transform duration-300 hover:-translate-y-2">
                <div className="w-16 h-16 benefits-bg rounded-2xl flex items-center justify-center text-white text-2xl font-bold mb-6 mx-auto shadow-lg shadow-cyan-500/30">
                  2
                </div>
                <h3 className="text-xl font-bold text-center text-gray-900 dark:text-white mb-3">
                  AI Analysis & Research
                </h3>
                <p className="text-center text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  LAWgic instantly cross-references thousands of Indian laws and
                  Supreme Court judgments to provide a verified answer.
                </p>
                <div className="mt-6 flex justify-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse"></span>
                  <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse delay-75"></span>
                  <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse delay-150"></span>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative group">
              <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 h-full border border-gray-100 dark:border-gray-800 shadow-xl transition-transform duration-300 hover:-translate-y-2">
                <div className="w-16 h-16 bg-[#2D0B70] rounded-2xl flex items-center justify-center text-white text-2xl font-bold mb-6 mx-auto shadow-lg shadow-purple-900/30">
                  3
                </div>
                <h3 className="text-xl font-bold text-center text-gray-900 dark:text-white mb-3">
                  Draft & Export
                </h3>
                <p className="text-center text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  Ask the AI to convert the research into a formal document,
                  notice, or email. Copy or export the results instantly.
                </p>
                <div className="mt-6 flex justify-center">
                  <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full">
                    <i className="fas fa-check-circle"></i> Ready to use
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Deep Dive Grid */}
        <div className="mb-20">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Feature Mastery
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-3">
              Learn how to unlock the full potential of LAWgic.
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-6 relative z-10">
            {/* Feature 1 */}
            <div className="lg:col-span-8">
              <div className="relative flex flex-col justify-between h-full bg-[#2D0B70] rounded-3xl p-8 md:p-10 overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500 rounded-full blur-[100px] opacity-20 transition-opacity group-hover:opacity-40"></div>

                <div className="relative z-10">
                  <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-6 backdrop-blur-md border border-white/20">
                    <i className="fas fa-file-contract text-2xl text-white"></i>
                  </div>
                  <h3 className="font-bold text-white text-2xl md:text-3xl mb-4">
                    Automated Document Drafting
                  </h3>
                  <p className="text-base text-white/80 leading-relaxed mb-6 max-w-2xl">
                    Don&apos;t just research—create. You can ask the chatbot to
                    draft Legal Notices, Affidavits, Rent Agreements, and more.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <i className="fas fa-arrow-right text-primary-400 mt-1"></i>
                      <p className="text-white/90 text-sm">
                        <strong className="text-white">Pro Tip:</strong> Be
                        specific about parties involved (e.g., &quot;Draft a
                        legal notice for recovery of Rs 50,000 from John on
                        behalf of Smith&quot;).
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="lg:col-span-4">
              <div className="relative flex flex-col justify-between h-full bg-primary-500 rounded-3xl p-8 md:p-10 overflow-hidden group">
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full blur-[80px] opacity-10 transition-opacity group-hover:opacity-20"></div>

                <div className="relative z-10">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-6 backdrop-blur-md border border-white/30">
                    <i className="fas fa-exchange-alt text-2xl text-white"></i>
                  </div>
                  <h3 className="font-bold text-white text-2xl mb-4">
                    IPC to BNS Transition
                  </h3>
                  <p className="text-sm text-white/90 leading-relaxed">
                    Unsure about the new Bharatiya Nyaya Sanhita (BNS)? Simply
                    ask: <br />
                    <br />
                    <span className="italic bg-black/20 p-2 rounded-lg block">
                      &quot;What is the BNS equivalent of IPC Section 420?&quot;
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="lg:col-span-12">
              <div className="relative flex flex-col justify-between h-full benefits-bg rounded-3xl p-8 md:p-10 overflow-hidden group">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-linear-to-r from-white/10 to-white/5 blur-[120px] opacity-50 transition-opacity group-hover:opacity-70"></div>

                <div className="relative z-10 flex flex-col lg:flex-row gap-8 items-center">
                  <div className="lg:w-1/2">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-6 border border-white/30 backdrop-blur-md">
                      <i className="fas fa-gavel text-2xl text-white"></i>
                    </div>
                    <h3 className="font-bold text-white text-2xl md:text-3xl mb-4">
                      Case Law Summaries & Precedences
                    </h3>
                    <p className="text-white/90 leading-relaxed mb-6">
                      Reading 100-page judgments is a thing of the past. Ask
                      LAWgic to summarize landmark Supreme Court or High Court
                      judgments in bullet points.
                    </p>
                  </div>
                  <div className="lg:w-1/2 w-full">
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl shadow-lg">
                      <h4 className="text-white font-bold mb-3 border-b border-white/20 pb-2">
                        Try these prompts:
                      </h4>
                      <ul className="space-y-3">
                        <li className="flex items-center gap-3 text-white/90 text-sm">
                          <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                            <i className="fas fa-terminal text-[10px]"></i>
                          </span>
                          &quot;Summarize the Kesavananda Bharati case.&quot;
                        </li>
                        <li className="flex items-center gap-3 text-white/90 text-sm">
                          <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                            <i className="fas fa-terminal text-[10px]"></i>
                          </span>
                          &quot;What are the latest SC guidelines on
                          anticipatory bail?&quot;
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-20">
          <CtaCard
            title="Ready to automate your legal research?"
            description="Join thousands of advocates and law students who use LAWgic to draft documents and research case laws instantly."
            backgroundClass="bg-linear-to-br from-cyan-600 to-blue-600 shadow-cyan-500/20"
          />
        </div>
      </div>
    </div>
  );
}
