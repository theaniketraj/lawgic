import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function BenefitsGrid() {
  return (
    <section className="bg-gray-900 py-14 md:py-28">
      <div className="wrapper">
        <div className="max-w-2xl mx-auto mb-12 text-center">
          <h2 className="max-w-lg mx-auto mb-3 font-bold text-center text-white dark:text-white/90 text-3xl md:text-title-lg">
            The key benefits of using LAWgic.
          </h2>
          <p className="max-w-2xl mx-auto text-base dark: font-normal leading-6 text-white/50">
            Streamline your legal workflow. Experience the power of AI to research faster, draft smarter, and stay compliant with ever-changing regulations.
          </p>
        </div>
        <div className="max-w-252 mx-auto">
          <div className="grid lg:grid-cols-12 gap-8">
            <div className="lg:col-span-6">
              <div className="relative flex flex-col justify-between h-full bg-primary-500 rounded-[20px] p-9 md:p-13">
                <div className="max-w-sm mb-32">
                  <h3 className="font-bold text-white text-2xl md:text-3xl mb-4">
                    Draft Professional-Grade Legal Documents
                  </h3>
                  <p className="text-base text-white/70">
                    Don&apos;t spend hours sifting through heavy law books. Retrieve relevant case precedents, rules, and notices with advanced AI.
                  </p>
                </div>
                <div>
                  <div className="absolute left-8 top-[61%] floating-1 flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md border border-white/30 rounded-full text-white font-medium text-sm shadow-lg">
                    <span className="w-2 h-2 rounded-full bg-blue-300"></span>
                    Legal Research
                  </div>
                  <div className="absolute right-28 top-[55%] floating-2 flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md border border-white/30 rounded-full text-white font-medium text-sm shadow-lg">
                    <span className="w-2 h-2 rounded-full bg-red-300"></span>
                    Document Drafting
                  </div>
                  <div className="right-8 absolute bottom-[15%] floating-3 flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md border border-white/30 rounded-full text-white font-medium text-sm shadow-lg">
                    <span className="w-2 h-2 rounded-full bg-yellow-300"></span>
                    Case Summaries
                  </div>

                  <Image
                    src="/images/benefits/bn-1.svg"
                    className="-mb-8 md:-mb-13 w-full"
                    alt=""
                    width={488}
                    height={288}
                    sizes="100vw"
                  />
                </div>
              </div>
            </div>
            <div className="lg:col-span-6">
              <div className="benefits-bg h-full rounded-[20px] p-12 overflow-hidden flex flex-col justify-between">
                <div>
                  <Image
                    src="/images/benefits/bn-2.svg"
                    alt=""
                    width={306}
                    height={279}
                  />
                </div>
                <div>
                  <h3 className="font-bold max-w-xs text-white text-2xl md:text-3xl mb-4">
                    Enhance Your Firm&apos;s Productivity with AI.
                  </h3>
                  <p className="text-base max-w-sm text-white/70">
                    Automate routine legal work, from case discovery to initial document drafting.
                    
                  </p>
                </div>
              </div>
            </div>
            <div className="lg:col-span-12">
              <div className="lg:px-12 p-8 bg-[#2D0B70] lg:pb-0 lg:p-12 relative rounded-[20px] h-full lg:flex lg:flex-row justify-between bg-cover flex-col gap-5">
                <div className="max-w-sm relative z-10">
                  <h3 className="font-bold text-white text-2xl md:text-3xl mb-4">
                    Expedite Legal Discovery
                  </h3>
                  <p className="text-base text-white/70 mb-8">
                    Utilize our AI interface to pinpoint crucial past verdicts
                    and procedural updates instantly.
                  </p>
                  <Link
                    href="/docs"
                    className="font-medium inline-block text-sm text-white rounded-full bg-primary-500 hover:bg-primary-600 transition py-3 px-6"
                  >
                    Learn More
                  </Link>
                </div>
                <div>
                  <Image
                    src="/images/benefits/bn-3.svg"
                    className="hidden lg:block relative z-10"
                    alt=""
                    width={359}
                    height={318}
                  />
                </div>
                <Image
                  src="/images/benefits/blur-shape.png"
                  alt=""
                  className="h-full w-full -z-0 absolute top-0 right-0"
                  width={399}
                  height={399}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
