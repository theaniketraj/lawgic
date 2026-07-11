"use client";

import { MinusIcon, PlusIcon } from "@/icons/icons";
import { useState } from "react";

// Define the FAQ item type
interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

export default function FaqAccordion() {
  const [activeItem, setActiveItem] = useState<number | null>(1);

  // FAQ data
  const faqItems: FAQItem[] = [
    {
      id: 1,
      question: "Is the legal advice provided by LAWgic legally binding?",
      answer:
        "No, LAWgic is an AI tool designed to assist with legal research and document drafting. It should not replace professional legal counsel. Always consult a qualified lawyer for binding advice.",
    },
    {
      id: 2,
      question: 'Which courts and case laws are covered?',
      answer:
        'LAWgic accesses a comprehensive database of judgements from the Supreme Court of India, all state High Courts, and major tribunals. The database is updated regularly to include recent rulings.',
    },
    {
      id: 3,
      question: "Does the AI support the new Bharatiya Nyaya Sanhita (BNS)?",
      answer:
        "Yes, LAWgic fully supports the new BNS, BNSS, and BSA. It can instantly map old Indian Penal Code (IPC) sections to their corresponding BNS sections to aid in the transition.",
    },
    {
      id: 4,
      question: 'Is my data secure?',
      answer:
        'Absolutely. We employ bank-grade encryption to ensure that your queries, uploaded documents, and generated drafts remain entirely confidential and are never used to train external public models.',
    },
    {
      id: 5,
      question: "Can I upload my own case files for summarization?",
      answer:
        'Yes, you can upload lengthy PDFs or text documents. LAWgic will analyze the document, extract key facts, identify the ratio decidendi, and provide a concise, readable summary.',
    },
  ];

  const toggleItem = (itemId: number) => {
    setActiveItem(activeItem === itemId ? null : itemId);
  };

  return (
    <section id="faq" className="py-14 md:py-28 dark:bg-dark-primary">
      <div className="wrapper">
        <div className="max-w-2xl mx-auto mb-12 text-center">
          <h2 className="mb-3 font-bold text-center text-gray-800 text-3xl dark:text-white/90 md:text-title-lg">
            Frequently Asked Questions
          </h2>
          <p className="max-w-md mx-auto leading-6 text-gray-500 dark:text-gray-400">
            Answered all frequently asked questions, Still confused? feel free
            contact with us
          </p>
        </div>
        <div className="max-w-150 mx-auto">
          <div className="space-y-4">
            {faqItems.map((item) => (
              <FAQItem
                key={item.id}
                item={item}
                isActive={activeItem === item.id}
                onToggle={() => toggleItem(item.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// FAQ Item Component
function FAQItem({
  item,
  isActive,
  onToggle,
}: Readonly<{
  item: FAQItem;
  isActive: boolean;
  onToggle: () => void;
}>) {
  return (
    <div className="pb-5 border-b border-gray-200 dark:border-gray-800">
      <button
        type="button"
        className="flex items-center justify-between w-full text-left"
        onClick={onToggle}
        aria-expanded={isActive}
      >
        <span className="text-lg font-medium text-gray-800 dark:text-white/90">
          {item.question}
        </span>
        <span className="shrink-0 ml-6">
          {isActive ? <MinusIcon /> : <PlusIcon />}
        </span>
      </button>
      {isActive && (
        <div className="mt-5">
          <p className="text-base leading-7 text-gray-500 dark:text-gray-400">
            {item.answer}
          </p>
        </div>
      )}
    </div>
  );
}
