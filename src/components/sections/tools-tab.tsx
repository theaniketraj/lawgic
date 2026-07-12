"use client";

import type React from "react";
import { Fragment, useState } from "react";

import {
  CodeGeneratorIcon,
  EmailGeneratorIcon,
  TextGeneratorIcon,
} from "@/icons/icons";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

// Define the tab type
interface Tab {
  id: string;
  label: string;
  icon: React.ReactNode;
  lightImage: string;
  darkImage: string;
  title: string;
  description: string;
}

export default function AIToolsTabs() {
  const [activeTab, setActiveTab] = useState("text");

  // Tab data
  const tabs: Tab[] = [
    {
      id: "text",
      label: "Legal Research",
      icon: <TextGeneratorIcon className="w-8 h-8" />,
      lightImage: "/images/tab-image/legal-research-light.png",
      darkImage: "/images/tab-image/legal-research-dark.png",
      title: "Find Case Laws Instantly",
      description:
        "Ask plain-language questions and get accurate citations from Supreme Court and High Court judgements.",
    },
    {
      id: "draft",
      label: "Document Drafting",
      icon: <EmailGeneratorIcon className="w-8 h-8" />,
      lightImage: "/images/tab-image/document-drafting-light.png",
      darkImage: "/images/tab-image/document-drafting-dark.png",
      title: "Automate Legal Drafting",
      description:
        "Generate legal notices, NDAs, and petitions with formatting tailored to Indian courts.",
    },
    {
      id: "summary",
      label: "Case Summaries",
      icon: <TextGeneratorIcon className="w-8 h-8" />,
      lightImage: "/images/tab-image/case-summaries-light.png",
      darkImage: "/images/tab-image/case-summaries-dark.png",
      title: "Condense Lengthy Judgements",
      description:
        "Get concise summaries highlighting the ratio decidendi and obiter dicta.",
    },
    {
      id: "bns",
      label: "IPC to BNS",
      icon: <CodeGeneratorIcon className="w-8 h-8" />,
      lightImage: "/images/tab-image/ipc-to-bns-light.png",
      darkImage: "/images/tab-image/ipc-to-bns-dark.png",
      title: "Seamlessly Transition Procedural Codes",
      description:
        "Easily look up Bharatiya Nyaya Sanhita equivalents for old Indian Penal Code sections.",
    },
  ];

  // Find the active tab
  const currentTab = tabs.find((tab) => tab.id === activeTab) || tabs[0];

  return (
    <section className="py-14 md:py-28 dark:bg-dark-primary">
      <div className="wrapper">
        <div className="max-w-2xl mx-auto mb-12 text-center">
          <h2 className="mb-3 font-bold text-center text-gray-800 dark:text-white/90 text-3xl md:text-title-lg">
            All the Legal Intelligence you need, at your Fingertips.
          </h2>
          <p className="max-w-2xl mx-auto leading-6 text-gray-500 dark:text-gray-400">
            Unlock the Potential of Innovation. Discover the Advanced AI Tools
            Transforming Your Legal Practice with Unmatched Precision and
            Intelligence.
          </p>
        </div>

        <div className="max-w-252 mx-auto">
          <div>
            {/* Tab Navigation */}
            <div className="overflow-x-auto custom-scrollbar mx-auto max-w-fit relative">
              <div className="flex gap-2 min-w-max rounded-full bg-gray-100 dark:bg-white/5 p-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center h-12 gap-2 px-4 py-3 text-sm font-medium transition-colors duration-200 rounded-full ${
                      activeTab === tab.id
                        ? "bg-white dark:text-white/90 dark:bg-white/10 text-gray-800"
                        : "text-gray-500 dark:text-gray-400 bg-transparent"
                    }`}
                  >
                    {tab.icon}
                    <span className="truncate">{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}

            <div className="p-6 tab-img-bg overflow-hidden rounded-4xl mt-8">
              <div className="p-3 tab-img-overlay">
                {tabs.map((tab) => (
                  <Fragment key={tab.id}>
                    <div className={cn("overflow-hidden rounded-2xl w-full h-full", currentTab.id !== tab.id && "hidden!")}>
                      <Image
                        src={tab.lightImage || "/placeholder.svg"}
                        alt={tab.label}
                        width={930}
                        height={530}
                        className="w-full h-full object-cover scale-[1.02] block dark:hidden transform origin-center"
                        quality={100}
                        priority
                      />

                      <Image
                        src={tab.darkImage || "/placeholder.svg"}
                        alt={tab.label}
                        width={930}
                        height={530}
                        className="w-full h-full object-cover scale-[1.02] hidden dark:block transform origin-center"
                        quality={100}
                        priority
                      />
                    </div>
                  </Fragment>
                ))}
              </div>
            </div>

            {/* Bottom Section */}
            <div className="mt-6 text-center">
              <h2 className="mb-2 text-xl font-bold text-gray-800 dark:text-white/90">
                {currentTab.title}
              </h2>
              <p className="max-w-xl mx-auto mb-6 text-sm text-gray-500 dark:text-gray-400">
                {currentTab.description}
              </p>
              <Link
                href="/chat"
                className="px-6 py-3 text-sm font-medium text-white transition-colors rounded-full bg-primary-500 hover:bg-primary-600 inline-block"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
