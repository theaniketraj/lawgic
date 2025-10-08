import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import ChatSection from "./components/ChatSection";
import ToastContainer from "./components/ToastContainer";
import WelcomeScreen from "./components/WelcomeScreen";
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
  const { showWelcomeScreen } = useChatContext();
  const { theme } = useTheme();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

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
        </>
      )}
    </div>
  );
}

export default App;
