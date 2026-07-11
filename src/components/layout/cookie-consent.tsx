"use client";

import { useState, useEffect } from "react";
import { XIcon } from "lucide-react";

export function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Check if user has already consented
    const consent = localStorage.getItem("lawgic_cookie_consent");
    if (!consent) {
      // Delay showing it slightly for better UX
      const timer = setTimeout(() => setShow(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleConsent = (type: "all" | "essential") => {
    localStorage.setItem("lawgic_cookie_consent", type);
    setShow(false);
    
    // In a real app, you would trigger your analytics init here if type === "all"
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-100 p-4 sm:p-6 md:p-8 animate-in slide-in-from-bottom-10 fade-in duration-500 pointer-events-none">
      <div className="mx-auto max-w-4xl bg-white dark:bg-dark-secondary shadow-theme-xl border border-gray-200 dark:border-gray-800 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pointer-events-auto relative overflow-hidden">
        
        {/* Background Accents */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 rounded-full bg-primary-100 dark:bg-primary-900/20 blur-3xl opacity-50"></div>

        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center">
              <i className="fa-solid fa-cookie-bite text-primary-500"></i>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">We Value Your Privacy</h3>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-2xl">
            LAWgic strictly uses local browser storage for essential functions, like remembering your active chat session. 
            We do not share your private legal queries. Please accept all cookies for the best experience, or customize your preferences.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row w-full md:w-auto items-center gap-3">
          <button 
            onClick={() => handleConsent("essential")}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
          >
            Essential Only
          </button>
          <button 
            onClick={() => handleConsent("all")}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-primary-500 hover:bg-primary-600 shadow-md shadow-primary-500/20 transition-all hover:-translate-y-0.5"
          >
            Accept All
          </button>
        </div>

        <button 
          onClick={() => setShow(false)}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <XIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
