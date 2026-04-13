import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import ChatSection from "./components/ChatSection";
import ToastContainer from "./components/ToastContainer";
import WelcomeScreen from "./components/WelcomeScreen";
import DisclaimerModal from "./components/DisclaimerModal";
import Navbar from "./components/Navbar";

import LandingPage from "./components/LandingPage";
import FAQPage from "./components/FAQPage";
import TeamPage from "./components/TeamPage";
import AboutPage from "./components/AboutPage";
import PrivacyPage from "./components/PrivacyPage";
import TermsPage from "./components/TermsPage";
import CookieConsent from "./components/CookieConsent";

import { ChatProvider, useChatContext } from "./context/ChatContext";
import { ThemeProvider } from "./context/ThemeContext";
import { HelmetProvider, Helmet } from "react-helmet-async";
import "./App.css";

function App() {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <ChatProvider>
          <AppContent />
        </ChatProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
}

function AppContent() {
  const [currentView, setCurrentView] = useState("landing"); // 'landing', 'chat', 'faq'
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { showWelcomeScreen } = useChatContext();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  // Mobile detection and orientation handling
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    const handleResize = () => {
      checkMobile();
      // Close sidebar on desktop if opened on mobile
      if (window.innerWidth > 768 && sidebarOpen) {
        setSidebarOpen(false);
      }
    };

    const handleOrientationChange = () => {
      // Close sidebar on orientation change for better UX
      if (isMobile) {
        setSidebarOpen(false);
      }
    };

    checkMobile();
    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleOrientationChange);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleOrientationChange);
    };
  }, [sidebarOpen, isMobile]);

  // Touch handling for mobile sidebar
  useEffect(() => {
    let touchStartX = 0;
    let touchEndX = 0;

    const handleTouchStart = (e) => {
      touchStartX = e.changedTouches[0].screenX;
    };

    const handleTouchEnd = (e) => {
      touchEndX = e.changedTouches[0].screenX;

      if (isMobile) {
        // Swipe right to open sidebar (from left edge)
        if (touchStartX < 50 && touchEndX - touchStartX > 100) {
          setSidebarOpen(true);
        }
        // Swipe left to close sidebar
        else if (sidebarOpen && touchStartX - touchEndX > 100) {
          setSidebarOpen(false);
        }
      }
    };

    if (isMobile) {
      document.addEventListener("touchstart", handleTouchStart);
      document.addEventListener("touchend", handleTouchEnd);
    }

    return () => {
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isMobile, sidebarOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && sidebarOpen) {
        closeSidebar();
      }
      if (e.ctrlKey && e.key === "m") {
        e.preventDefault();
        toggleSidebar();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sidebarOpen]);

  // Comprehensive SEO Configuration
  const seoConfig = {
    title: "LAWgic | AI-Powered Legal Advisory & Drafting for Indian Judiciary",
    description: "LAWgic empowers professionals and individuals with instant case law research, IPC-to-BNS procedural transitions, and accurate legal document drafting.",
    keywords: "LAWgic, AI Lawyer India, BNS, Indian Judiciary AI, Legal Tech, Case Law Search, AI drafting, Legal AI Chatbot",
    canonical: "https://lawgicchat.netlify.app/",
    ogImage: "https://lawgicchat.netlify.app/og-image.jpg",
  };

  return (
    <div className="app" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <Helmet>
        <title>{seoConfig.title}</title>
        <meta name="description" content={seoConfig.description} />
        <meta name="keywords" content={seoConfig.keywords} />
        <link rel="canonical" href={seoConfig.canonical} />
        {/* Open Graph Tags for Social Media */}
        <meta property="og:title" content={seoConfig.title} />
        <meta property="og:description" content={seoConfig.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={seoConfig.canonical} />
        <meta property="og:image" content={seoConfig.ogImage} />
        {/* Twitter Card Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoConfig.title} />
        <meta name="twitter:description" content={seoConfig.description} />
        <meta name="twitter:image" content={seoConfig.ogImage} />
      </Helmet>

      <CookieConsent />

      {currentView === "landing" && (
        <LandingPage 
          onGoHome={() => setCurrentView("landing")}
          onStartChat={() => setCurrentView("chat")} 
          onGoFAQ={() => setCurrentView("faq")} 
          onGoTeam={() => setCurrentView("team")} 
          onGoAbout={() => setCurrentView("about")} 
          onGoPrivacy={() => setCurrentView("privacy")}
          onGoTerms={() => setCurrentView("terms")}
        />
      )}

      {currentView === "faq" && (
        <FAQPage 
          onGoHome={() => setCurrentView("landing")} 
          onStartChat={() => setCurrentView("chat")} 
          onGoPrivacy={() => setCurrentView("privacy")}
          onGoTerms={() => setCurrentView("terms")}
        />
      )}

      {currentView === "team" && (
        <TeamPage 
          onGoHome={() => setCurrentView("landing")} 
          onGoPrivacy={() => setCurrentView("privacy")}
          onGoTerms={() => setCurrentView("terms")}
        />
      )}

      {currentView === "about" && (
        <AboutPage 
          onGoHome={() => setCurrentView("landing")} 
          onStartChat={() => setCurrentView("chat")} 
          onGoPrivacy={() => setCurrentView("privacy")}
          onGoTerms={() => setCurrentView("terms")}
        />
      )}

      {currentView === "privacy" && (
        <PrivacyPage 
          onGoHome={() => setCurrentView("landing")}
          onGoPrivacy={() => setCurrentView("privacy")}
          onGoTerms={() => setCurrentView("terms")}
        />
      )}

      {currentView === "terms" && (
        <TermsPage 
          onGoHome={() => setCurrentView("landing")}
          onGoPrivacy={() => setCurrentView("privacy")}
          onGoTerms={() => setCurrentView("terms")}
        />
      )}

      {/* Main App Content - Only render when landing page and faq are not showing */}
      {currentView === "chat" && (
        <>
          {/* Welcome Screen */}
          {showWelcomeScreen && <WelcomeScreen show={showWelcomeScreen} />}

          {!showWelcomeScreen && (
            <>
              {/* Overlay */}
              <div
                className={`overlay ${sidebarOpen ? "active" : ""}`}
                onClick={closeSidebar}
              />

              {/* Sidebar */}
              <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} onGoHome={() => setCurrentView("landing")} />

              {/* Main Content */}
              <div className={`main-content ${sidebarOpen ? "sidebar-open" : ""}`}>
                <Navbar 
                  onMenuClick={toggleSidebar} 
                  isOpen={sidebarOpen} 
                />
                <ChatSection />
              </div>

              {/* Toast Container */}
              <ToastContainer />

              {/* Legal Disclaimer Modal */}
              <DisclaimerModal />
            </>
          )}
        </>
      )}
    </div>
  );
}

export default App;
