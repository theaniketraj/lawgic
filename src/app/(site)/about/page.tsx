import type { Metadata } from 'next';
import { CtaCard } from '@/components/ui/cta-card';

export const metadata: Metadata = {
  title: 'About | LAWgic',
  description: 'Learn why we built LAWgic and our vision for the Indian Judiciary.',
};

export default function AboutPage() {
  return (
    <div className="pt-24 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block py-1.5 px-4 rounded-full bg-primary-500/10 text-primary-500 text-sm font-semibold mb-4 border border-primary-500/20">
            Our Vision
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight">
            Why We Built <span className="text-primary-500">LAWgic</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Revolutionizing legal accessibility and empowering professionals through Artificial Intelligence.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-6">
          {/* Card 1: The Problem */}
          <div className="lg:col-span-6">
            <div className="relative flex flex-col justify-between h-full bg-[#2D0B70] rounded-[20px] p-9 md:p-12 overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full blur-[100px] opacity-30 -mr-20 -mt-20 transition-opacity group-hover:opacity-50"></div>
              
              <div className="relative z-10">
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-6 backdrop-blur-md border border-white/20">
                  <i className="fas fa-exclamation-triangle text-2xl text-white"></i>
                </div>
                <h3 className="font-bold text-white text-2xl md:text-3xl mb-4">
                  The Problem
                </h3>
                <p className="text-base text-white/80 leading-relaxed mb-8">
                  The Indian Judiciary system is robust and vast, but navigating millions of case laws, understanding complex precedences, and manually drafting procedural documents is time-consuming and often overwhelming.
                </p>
                <div className="flex items-center gap-3 px-5 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-lg w-fit">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-400 animate-pulse"></span>
                  <span className="text-white text-sm font-medium">Inefficient Workflows</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Our Solution */}
          <div className="lg:col-span-6">
            <div className="relative flex flex-col justify-between h-full bg-primary-500 rounded-[20px] p-9 md:p-12 overflow-hidden group">
              <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-300 rounded-full blur-[100px] opacity-20 -mr-20 -mb-20 transition-opacity group-hover:opacity-40"></div>
              
              <div className="relative z-10">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-6 backdrop-blur-md border border-white/30">
                  <i className="fas fa-lightbulb text-2xl text-white"></i>
                </div>
                <h3 className="font-bold text-white text-2xl md:text-3xl mb-4">
                  Our Solution
                </h3>
                <p className="text-base text-white/90 leading-relaxed mb-8">
                  LAWgic employs state-of-the-art Natural Language Processing (NLP) designed explicitly around Indian legal terminology, penal codes (including the IPC to BNS transition), and standard procedures.
                </p>
                <div className="flex flex-wrap gap-3">
                  <div className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md border border-white/30 rounded-full text-white font-medium text-sm shadow-lg">
                    <i className="fas fa-search text-white/80"></i> Instant Research
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md border border-white/30 rounded-full text-white font-medium text-sm shadow-lg">
                    <i className="fas fa-file-contract text-white/80"></i> Auto-Drafting
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Core Ethics */}
          <div className="lg:col-span-12">
            <div className="relative flex flex-col justify-between h-full benefits-bg rounded-[20px] p-9 md:p-12 overflow-hidden group">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-linear-to-r from-white/10 to-white/5 blur-[120px] opacity-50 transition-opacity group-hover:opacity-70"></div>
              
              <div className="relative z-10 flex flex-col lg:flex-row gap-12 items-center">
                <div className="lg:w-1/3">
                  <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center mb-6 border border-white/30 shadow-xl backdrop-blur-md">
                    <i className="fas fa-shield-alt text-3xl text-white"></i>
                  </div>
                  <h3 className="font-bold text-white text-3xl md:text-4xl mb-4">
                    Our Core Ethics
                  </h3>
                  <p className="text-lg text-white/80">
                    We built LAWgic with strict ethical boundaries to ensure trust and reliability in the legal ecosystem.
                  </p>
                </div>
                
                <div className="lg:w-2/3 grid sm:grid-cols-2 gap-6 w-full">
                  <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl shadow-lg">
                    <h4 className="text-white font-bold text-lg mb-2 flex items-center gap-2">
                      <i className="fas fa-check-circle text-green-300"></i> Accuracy
                    </h4>
                    <p className="text-white/80 text-sm leading-relaxed">
                      Our models strictly reference established Supreme Court data to prevent AI hallucinations.
                    </p>
                  </div>
                  
                  <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl shadow-lg">
                    <h4 className="text-white font-bold text-lg mb-2 flex items-center gap-2">
                      <i className="fas fa-user-shield text-blue-300"></i> Privacy First
                    </h4>
                    <p className="text-white/80 text-sm leading-relaxed">
                      We believe in attorney-client privilege. Your inputs are encrypted and never persist beyond your session.
                    </p>
                  </div>
                  
                  <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl sm:col-span-2 shadow-lg">
                    <h4 className="text-white font-bold text-lg mb-2 flex items-center gap-2">
                      <i className="fas fa-handshake text-purple-300"></i> Empowerment, Not Replacement
                    </h4>
                    <p className="text-white/80 text-sm leading-relaxed">
                      LAWgic is built to assist, not replace, human legal expertise. The human lawyer maintains total command, enhanced by digital speed.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-20">
          <CtaCard 
            title="Join the Legal AI Revolution"
            description="Experience a new era of legal research where AI does the heavy lifting, and you do the strategizing."
            backgroundClass="bg-linear-to-br from-purple-600 to-indigo-600 shadow-purple-500/20"
          />
        </div>
      </div>
    </div>
  );
}
