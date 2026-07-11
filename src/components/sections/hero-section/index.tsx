import Image from "next/image";
import Link from "next/link";
import { Subheading } from "./subheading";

export default function HeroSection() {
  return (
    <section className="pt-16 relative overflow-hidden dark:bg-[#101828]">
      <div className="max-w-480 mx-auto relative">
        <div className="wrapper">
          <div className="max-w-200 mx-auto">
            <div className="text-center pb-16">
              <Subheading text="Indian Judiciary AI Consultant" />

              <h1 className="text-gray-700 mx-auto font-bold mb-4 text-4xl sm:text-[50px] dark:text-white/90 sm:leading-16 max-w-175">
                AI Powered Legal Advisory & Drafting
              </h1>
              <p className="max-w-134.25 text-center mx-auto dark:text-gray-400 text-gray-500 text-base">
                Empower yourself with instant case law research, IPC-to-BNS
                procedural transitions, and accurate legal document drafting.
              </p>

              <div className="mt-9 flex sm:flex-row flex-col gap-3 relative z-30 items-center justify-center">
                <Link
                  href="/chat"
                  className="bg-primary-500 transition h-12 inline-flex items-center justify-center hover:bg-primary-600 px-6 py-3 rounded-full text-white text-sm"
                >
                  Get Started
                </Link>

                <Link
                  href="/docs"
                  className="rounded-full flex h-12 gap-3 items-center text-sm border bg-white dark:bg-white/10 dark:border-white/5 dark:text-white border-gray-100 p-1.5 pr-6 hover:bg-gray-50 dark:hover:bg-white/20 transition"
                >
                  <span className="size-9 rounded-full gradient-bg-two inline-flex items-center justify-center text-sm font-medium text-white shadow-md">
                    <i className="fas fa-book"></i>
                  </span>
                  Learn More
                </Link>
              </div>
            </div>
          </div>
          <div className="max-w-250 mx-auto relative">
            <div className="p-3 sm:p-4.5 relative z-30 rounded-4xl border border-white/30 dark:border-white/10 bg-white/20">
              <Image
                src="/images/hero/hero-img.jpg"
                alt=""
                className="w-full rounded-2xl block dark:hidden"
                width={966}
                height={552}
              />
              <Image
                src="/images/hero/hero-img-dark.png"
                alt=""
                className="w-full rounded-2xl hidden dark:block"
                width={966}
                height={552}
              />
            </div>
            <div className="absolute hidden lg:block z-10 -top-20 -translate-y-20 left-1/2 -translate-x-1/2">
              <svg
                width="1300"
                height="1001"
                viewBox="0 0 1300 1001"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g opacity="0.7" filter="url(#filter0_f_9279_7148)">
                  <circle cx="800" cy="500.03" r="300" fill="#4E6EFF" />
                </g>
                <g opacity="0.3" filter="url(#filter1_f_9279_7148)">
                  <circle cx="500" cy="500.03" r="300" fill="#FF58D5" />
                </g>
                <defs>
                  <filter
                    id="filter0_f_9279_7148"
                    x="300"
                    y="0.029541"
                    width="1000"
                    height="1000"
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
                      result="effect1_foregroundBlur_9279_7148"
                    />
                  </filter>
                  <filter
                    id="filter1_f_9279_7148"
                    x="0"
                    y="0.029541"
                    width="1000"
                    height="1000"
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
                      result="effect1_foregroundBlur_9279_7148"
                    />
                  </filter>
                </defs>
              </svg>
            </div>
          </div>
        </div>

        <div className="max-[1100px]:hidden">
          <div className="absolute top-14 left-16 floating-1 flex items-center gap-2 px-4 py-2 bg-white/50 dark:bg-white/10 backdrop-blur-md border border-gray-200 dark:border-white/20 rounded-full text-gray-800 dark:text-white font-medium text-sm shadow-lg">
            <span className="w-2 h-2 rounded-full bg-primary-500"></span>
            Legal Research
          </div>
          <div className="absolute left-36.25 top-74.5 floating-2 max-[1240px]:left-20 flex items-center gap-2 px-4 py-2 bg-white/50 dark:bg-white/10 backdrop-blur-md border border-gray-200 dark:border-white/20 rounded-full text-gray-800 dark:text-white font-medium text-sm shadow-lg">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            Document Drafting
          </div>
          <div className="absolute right-16 top-27 floating-3 flex items-center gap-2 px-4 py-2 bg-white/50 dark:bg-white/10 backdrop-blur-md border border-gray-200 dark:border-white/20 rounded-full text-gray-800 dark:text-white font-medium text-sm shadow-lg">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            Case Summaries
          </div>
          <div className="absolute top-79 right-50 floating-4 max-[1240px]:right-20 max-[1350px]:right-37.5 max-[1500px]:right-50 flex items-center gap-2 px-4 py-2 bg-white/50 dark:bg-white/10 backdrop-blur-md border border-gray-200 dark:border-white/20 rounded-full text-gray-800 dark:text-white font-medium text-sm shadow-lg">
            <span className="w-2 h-2 rounded-full bg-purple-500"></span>
            IPC to BNS
          </div>
        </div>
      </div>
      <div className="hero-glow-bg pointer-events-none w-full h-167.5 absolute z-10 bottom-0"></div>
    </section>
  );
}
