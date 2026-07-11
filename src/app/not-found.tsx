import Image from "next/image";
import Link from "next/link";
import React from "react";
import Header from "@/components/layout/header/header";
import Footer from "@/components/layout/footer";
import { CtaCard } from "@/components/ui/cta-card";

export default function NotFoundPage() {
  return (
    <div className="dark:bg-[#101828] flex flex-col min-h-screen">
      <Header />
      
      <main className="isolate flex-1 flex flex-col">
        <section className="pt-24 pb-20 relative overflow-hidden">
          {/* Glowing Orbs Background */}
          <span className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none">
            <svg
              width="1222"
              height="283"
              viewBox="0 0 1222 283"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g opacity="0.7" filter="url(#filter0_f_9289_13491)">
                <circle cx="772" cy="-167.171" r="250" fill="#4E6EFF" />
              </g>
              <g opacity="0.3" filter="url(#filter1_f_9289_13491)">
                <circle cx="450" cy="-167.171" r="250" fill="#FF58D5" />
              </g>
              <defs>
                <filter
                  id="filter0_f_9289_13491"
                  x="322"
                  y="-617.171"
                  width="900"
                  height="900"
                  filterUnits="userSpaceOnUse"
                  colorInterpolationFilters="sRGB"
                >
                  <feFlood floodOpacity="0" result="BackgroundImageFix" />
                  <feBlend
                    mode="normal"
                    in="SourceGraphic"
                    in2="BackgroundImageFix"
                    result="shape"
                  />
                  <feGaussianBlur
                    stdDeviation="100"
                    result="effect1_foregroundBlur_9289_13491"
                  />
                </filter>
                <filter
                  id="filter1_f_9289_13491"
                  x="0"
                  y="-617.171"
                  width="900"
                  height="900"
                  filterUnits="userSpaceOnUse"
                  colorInterpolationFilters="sRGB"
                >
                  <feFlood floodOpacity="0" result="BackgroundImageFix" />
                  <feBlend
                    mode="normal"
                    in="SourceGraphic"
                    in2="BackgroundImageFix"
                    result="shape"
                  />
                  <feGaussianBlur
                    stdDeviation="100"
                    result="effect1_foregroundBlur_9289_13491"
                  />
                </filter>
              </defs>
            </svg>
          </span>

          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <Image
                width={350}
                height={180}
                src="/images/404.svg"
                className="mx-auto mb-8 block dark:hidden"
                alt="404 Not Found"
              />
              <Image
                width={350}
                height={180}
                src="/images/404-white.svg"
                className="mx-auto mb-8 hidden dark:block"
                alt="404 Not Found"
              />
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">
                Oops! You've strayed from the path.
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                We can't seem to find the page you're looking for. Let's get you back on track with these helpful destinations.
              </p>
            </div>

            {/* Infographic Cards */}
            <div className="grid md:grid-cols-3 gap-6 mb-20">
              <Link href="/chat" className="group flex flex-col p-8 rounded-2xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 hover:shadow-xl dark:hover:bg-white/10 transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <i className="fas fa-robot text-primary-500 text-xl"></i>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">AI Legal Chat</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-8 flex-1">
                  Draft documents, research case laws, and get instant answers from our advanced legal AI model.
                </p>
                <div className="text-primary-500 text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                  Start Chatting <i className="fas fa-arrow-right"></i>
                </div>
              </Link>

              <Link href="/docs" className="group flex flex-col p-8 rounded-2xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 hover:shadow-xl dark:hover:bg-white/10 transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <i className="fas fa-book text-blue-500 text-xl"></i>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Documentation</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-8 flex-1">
                  Learn how to maximize your productivity using LAWgic's comprehensive suite of tools.
                </p>
                <div className="text-blue-500 text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                  Read the Docs <i className="fas fa-arrow-right"></i>
                </div>
              </Link>

              <Link href="/about" className="group flex flex-col p-8 rounded-2xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 hover:shadow-xl dark:hover:bg-white/10 transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <i className="fas fa-building text-purple-500 text-xl"></i>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">About Us</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-8 flex-1">
                  Discover our mission to revolutionize the Indian Judiciary through ethical AI technology.
                </p>
                <div className="text-purple-500 text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                  Our Vision <i className="fas fa-arrow-right"></i>
                </div>
              </Link>
            </div>

            {/* CTA */}
            <CtaCard 
              title="Ready to dive back in?"
              description="Get instant insights and professional legal drafting right at your fingertips."
              backgroundClass="bg-linear-to-br from-indigo-600 to-purple-700 shadow-indigo-500/20"
            />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
