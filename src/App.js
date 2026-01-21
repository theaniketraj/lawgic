import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import ChatSection from "./components/ChatSection";
import ToastContainer from "./components/ToastContainer";
import WelcomeScreen from "./components/WelcomeScreen";
import DisclaimerModal from "./components/DisclaimerModal";

import { ChatProvider, useChatContext } from "./context/ChatContext";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import "./App.css";

function App() {
  return (
    <ThemeProvider>
      <ChatProvider>
        <AppContent />
      </ChatProvider>
    </ThemeProvider>
  );
}

function AppContent() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { showWelcomeScreen } = useChatContext();
  const { theme } = useTheme();

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

  return (
    <div className="app" style={{ background: theme.colors.primaryBg }}>
      {/* Welcome Screen */}
      {showWelcomeScreen && <WelcomeScreen show={showWelcomeScreen} />}

      {/* Main App Content - Only render when welcome screen is not showing */}
      {!showWelcomeScreen && (
        <>
          {/* Overlay */}
          <div
            className={`overlay ${sidebarOpen ? "active" : ""}`}
            onClick={closeSidebar}
          />

          {/* Sidebar Toggle Button */}
          <button
            className={`sidebar-toggle ${sidebarOpen ? "sidebar-open" : ""}`}
            onClick={toggleSidebar}
          >
            {sidebarOpen ? (
              <i className="fas fa-times"></i>
            ) : (
              <i className="fas fa-bars"></i>
            )}
          </button>

          {/* Sidebar */}
          <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />

          {/* Main Content */}
          <div className={`main-content ${sidebarOpen ? "sidebar-open" : ""}`}>
            <ChatSection />
          </div>


          {/* Toast Container */}
          <ToastContainer />

          {/* Legal Disclaimer Modal */}
          <DisclaimerModal />
        </>
      )}
    </div>
  );
}

export default App;
