"use client";

import { useEffect, useState } from "react";

export function DisclaimerModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if user has already accepted the disclaimer
    const hasAccepted = localStorage.getItem("disclaimerAccepted");
    if (!hasAccepted) {
      setIsOpen(true);
      document.body.style.overflow = "hidden";
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("disclaimerAccepted", "true");
    setIsOpen(false);
    document.body.style.overflow = "auto";
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-100 overflow-y-auto"
      role="<dialog>"
      aria-modal="true"
    >
      <div className="flex items-center justify-center min-h-screen p-4 text-center sm:p-0">
        <div
          className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm transition-opacity"
          aria-hidden="true"
        />

        <div className="relative bg-white dark:bg-dark-secondary rounded-3xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:max-w-2xl w-full border border-gray-100 dark:border-white/5">
          <div className="p-8 sm:p-10">
            <div className="flex items-center gap-4 mb-6 border-b border-gray-100 dark:border-white/5 pb-6">
              <div className="w-12 h-12 rounded-2xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center shrink-0">
                <i className="fas fa-gavel text-primary-600 dark:text-primary-400 text-xl"></i>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Legal Disclaimer
              </h2>
            </div>

            <div className="space-y-5 text-gray-600 dark:text-gray-300">
              <p className="font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wide text-sm">
                Important: Please Read Carefully
              </p>
              <p>
                This AI-powered Judiciary Consultancy Chatbot is designed for
                informational and educational purposes only.
              </p>
              <ul className="space-y-4 my-6 list-disc pl-5">
                <li>
                  <strong className="text-gray-900 dark:text-gray-100 font-semibold">
                    Not Legal Advice:
                  </strong>{" "}
                  The information provided by this chatbot does not constitute
                  professional legal advice, and it should not be treated as
                  such.
                </li>
                <li>
                  <strong className="text-gray-900 dark:text-gray-100 font-semibold">
                    No Attorney-Client Relationship:
                  </strong>{" "}
                  Interacting with this chatbot does not create an
                  attorney-client relationship.
                </li>
                <li>
                  <strong className="text-gray-900 dark:text-gray-100 font-semibold">
                    Accuracy:
                  </strong>{" "}
                  While we strive for accuracy, laws and regulations change
                  frequently. Always verify details with a qualified legal
                  professional.
                </li>
                <li>
                  <strong className="text-gray-900 dark:text-gray-100 font-semibold">
                    Limitation of Liability:
                  </strong>{" "}
                  We are not liable for any actions taken based on the
                  information provided by this system.
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-black/20 px-8 py-6 sm:flex sm:flex-row-reverse sm:items-center sm:justify-between border-t border-gray-100 dark:border-white/5">
            <button
              type="button"
              onClick={handleAccept}
              className="w-full inline-flex justify-center items-center rounded-xl border border-transparent bg-primary-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 sm:w-auto sm:text-sm transition-colors"
            >
              I Agree & Enter
              <i className="fas fa-arrow-right ml-2 text-xs"></i>
            </button>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 sm:mt-0 text-center sm:text-left">
              By clicking "I Agree & Enter", you acknowledge that you{" "}
              <br className="hidden sm:block" /> have read and understood this
              disclaimer.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
