import React, { useState } from "react";
import PropTypes from "prop-types";
import { useChatContext } from "../context/ChatContext";
import { useTheme } from "../context/ThemeContext";
import SkeletonLoader from "./SkeletonLoader";
import "./Sidebar.css";

const Sidebar = ({ isOpen, onClose, onGoHome }) => {
  const {
    conversationMemory,
    status,
    currentEmotion,
    ttsEnabled,
    currentChatId,
    chatSearchQuery,
    setChatSearchQuery,
    selectedChatCategory,
    setSelectedChatCategory,
    usageStats,
    userSettings,
    chatCategories,
    conversationTemplates,
    isLoadingChats,
    isLoadingStats,
    clearMemory,
    clearChatHistory,
    toggleTTS,
    createNewChat,
    switchToChat,
    getFilteredChats,
    updateUserSettings,
    archiveChat,
    unarchiveChat,
  } = useChatContext();

  const { currentTheme, toggleTheme } = useTheme();

  // Sidebar navigation state
  const [activeSection, setActiveSection] = useState("chats");

  const getRecentMemory = () => {
    if (conversationMemory.length === 0) {
      return "No previous conversations";
    }
    return conversationMemory
      .slice(-3)
      .map((m) => `${m.role}: ${m.content.substring(0, 30)}...`)
      .join(" | ");
  };

  const emotionEmojis = {
    happy: <i className="fas fa-smile" style={{ color: "#22c55e" }}></i>,
    sad: <i className="fas fa-frown" style={{ color: "#ef4444" }}></i>,
    neutral: <i className="fas fa-meh" style={{ color: "#6b7280" }}></i>,
  };

  const handleSettingChange = (setting, value) => {
    updateUserSettings({ [setting]: value });
    window.showToast?.(`${setting} updated`, "success");
  };

  const getFontSize = () => {
    if (userSettings.fontSize === "small") return "12px";
    if (userSettings.fontSize === "large") return "16px";
    return "14px";
  };

  return (
    <div
      className={`sidebar ${isOpen ? "open" : ""}`}
      style={{ fontSize: getFontSize() }}
    >
      <div className="sidebar-header" 
           onClick={() => {
             if (onGoHome) {
               onGoHome();
             }
             onClose();
           }}
           style={{ cursor: "pointer" }}
           title="Return to Homepage"
      >
        <h2>
          <i className="fas fa-balance-scale" style={{ marginRight: '10px', fontSize: '0.8em' }}></i>
          LAWGic
        </h2>
        <p className="sidebar-subtitle">Daemon v1.0</p>
      </div>

      {/* Navigation Tabs */}
      <div className="sidebar-nav">
        <button
          className={`nav-tab ${activeSection === "chats" ? "active" : ""}`}
          onClick={() => setActiveSection("chats")}
        >
          <i className="fas fa-comments"></i>
          <span>Chats</span>
        </button>
        <button
          className={`nav-tab ${activeSection === "templates" ? "active" : ""}`}
          onClick={() => setActiveSection("templates")}
        >
          <i className="fas fa-layer-group"></i>
          <span>Templates</span>
        </button>
        <button
          className={`nav-tab ${activeSection === "stats" ? "active" : ""}`}
          onClick={() => setActiveSection("stats")}
        >
          <i className="fas fa-chart-bar"></i>
          <span>Stats</span>
        </button>
        <button
          className={`nav-tab ${activeSection === "settings" ? "active" : ""}`}
          onClick={() => setActiveSection("settings")}
        >
          <i className="fas fa-cog"></i>
          <span>Settings</span>
        </button>
      </div>

      {/* Chats Section */}
      {activeSection === "chats" && (
        <div className="sidebar-content">
          {/* Chat Search */}
          <div className="search-section">
            <div className="search-input-container">
              <i className="fas fa-search search-icon"></i>
              <input
                type="text"
                placeholder="Search chats..."
                value={chatSearchQuery}
                onChange={(e) => setChatSearchQuery(e.target.value)}
                className="search-input-field"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="category-filter">
            {chatCategories.map((category) => (
              <button
                key={category.id}
                className={`category-btn ${selectedChatCategory === category.id ? "active" : ""
                  }`}
                onClick={() => setSelectedChatCategory(category.id)}
              >
                <i className={`fas ${category.icon}`}></i>
                <span>{category.name}</span>
              </button>
            ))}
          </div>

          {/* New Chat Button */}
          <button
            className="btn new-chat-btn"
            onClick={() => {
              createNewChat();
              window.showToast?.("New chat created!", "success");
            }}
          >
            <span className="btn-icon">
              <i className="fas fa-plus"></i>
            </span>{" "}
            New Chat
          </button>

          {/* Chat History List */}
          <div className="chat-history-section">
            <h3 className="sidebar-section-title">
              <i className="fas fa-history"></i> Recent Consultations
            </h3>
            <div className="chat-history-list">
              {isLoadingChats ? (
                <SkeletonLoader type="chat" count={5} />
              ) : (
                getFilteredChats()
                  .slice(0, 15)
                  .map((chat, index) => (
                    <div
                      key={chat.id}
                      className={`chat-history-item ${currentChatId === chat.id ? "active" : ""
                        }`}
                      style={{
                        animationDelay: userSettings.animationsEnabled
                          ? `${index * 0.05}s`
                          : "0s",
                      }}
                    >
                      <div
                        className="chat-item-content"
                        onClick={() => {
                          switchToChat(chat.id);
                          window.showToast?.(
                            `Switched to: ${chat.title}`,
                            "info"
                          );
                        }}
                      >
                        <div className="chat-header">
                          <div className="chat-title">{chat.title}</div>
                          {chat.category && chat.category !== "all" && (
                            <span
                              className={`chat-category-badge ${chat.category}`}
                            >
                              {chat.category}
                            </span>
                          )}
                        </div>
                        <div className="chat-preview">{chat.preview}</div>
                        <div className="chat-time">
                          {new Date(chat.lastActive).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="chat-actions">
                        <button
                          className="chat-action-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (chat.category === "archived") {
                              unarchiveChat(chat.id);
                              window.showToast?.("Chat unarchived", "success");
                            } else {
                              archiveChat(chat.id);
                              window.showToast?.("Chat archived", "success");
                            }
                          }}
                          title={
                            chat.category === "archived"
                              ? "Unarchive"
                              : "Archive"
                          }
                        >
                          <i
                            className={`fas ${chat.category === "archived"
                              ? "fa-undo"
                              : "fa-archive"
                              }`}
                          ></i>
                        </button>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>

          <button
            className="btn danger-btn"
            onClick={() => {
              clearChatHistory();
              window.showToast?.("All chat history cleared", "success");
            }}
          >
            <span className="btn-icon">
              <i className="fas fa-trash"></i>
            </span>{" "}
            Clear All History
          </button>
        </div>
      )}

      {/* Templates Section */}
      {activeSection === "templates" && (
        <div className="sidebar-content">
          <div className="templates-section">
            <h3 className="sidebar-section-title">
              <i className="fas fa-file-contract"></i> Legal Templates
            </h3>
            <div className="templates-list">
              {conversationTemplates.map((template) => (
                <div key={template.id} className="template-item">
                  <div className="template-header">
                    <h4>{template.title}</h4>
                    <span className={`template-category ${template.category}`}>
                      {template.category}
                    </span>
                  </div>
                  <p className="template-description">{template.description}</p>
                  <button
                    className="btn template-btn"
                    onClick={() => {
                      setChatSearchQuery(template.initialMessage);
                      setActiveSection("chats");
                      window.showToast?.(
                        `Template loaded: "${template.title}"`,
                        "success"
                      );
                    }}
                  >
                    <i className="fas fa-edit"></i>
                    Use Template
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Stats Section */}
      {activeSection === "stats" && (
        <div className="sidebar-content">
          <div className="stats-section">
            <h3 className="sidebar-section-title">
              <i className="fas fa-chart-pie"></i> Firm Analytics
            </h3>
            {isLoadingStats ? (
              <SkeletonLoader type="stats" />
            ) : (
              <div className="stats-grid">
                <div
                  className="stat-item"
                  style={{
                    animationDelay: userSettings.animationsEnabled
                      ? "0s"
                      : "0s",
                  }}
                >
                  <div className="stat-icon">
                    <i className="fas fa-comments"></i>
                  </div>
                  <div className="stat-content">
                    <div className="stat-number">{usageStats.totalChats}</div>
                    <div className="stat-label">Total Chats</div>
                  </div>
                </div>
                <div
                  className="stat-item"
                  style={{
                    animationDelay: userSettings.animationsEnabled
                      ? "0.1s"
                      : "0s",
                  }}
                >
                  <div className="stat-icon">
                    <i className="fas fa-comment-dots"></i>
                  </div>
                  <div className="stat-content">
                    <div className="stat-number">
                      {usageStats.totalMessages}
                    </div>
                    <div className="stat-label">Total Messages</div>
                  </div>
                </div>
                <div
                  className="stat-item"
                  style={{
                    animationDelay: userSettings.animationsEnabled
                      ? "0.2s"
                      : "0s",
                  }}
                >
                  <div className="stat-icon">
                    <i className="fas fa-robot"></i>
                  </div>
                  <div className="stat-content">
                    <div className="stat-number">{currentEmotion}</div>
                    <div className="stat-label">Current Mood</div>
                  </div>
                </div>
                <div
                  className="stat-item"
                  style={{
                    animationDelay: userSettings.animationsEnabled
                      ? "0.3s"
                      : "0s",
                  }}
                >
                  <div className="stat-icon">
                    <i className="fas fa-volume-up"></i>
                  </div>
                  <div className="stat-content">
                    <div className="stat-number">
                      {ttsEnabled ? "ON" : "OFF"}
                    </div>
                    <div className="stat-label">Voice Output</div>
                  </div>
                </div>
              </div>
            )}

            {/* Bot Status */}
            <div className="bot-status-section">
              <h3 className="sidebar-section-title">
                <i className="fas fa-signal"></i> System Status
              </h3>
              <div className="status-panel">
                <div className="status-display">{status}</div>
                <div className="emotion-status">
                  Current Emotion:{" "}
                  <span>
                    {emotionEmojis[currentEmotion]} {currentEmotion}
                  </span>
                </div>
              </div>
            </div>

            {/* Memory Panel */}
            <div className="memory-section">
              <h3 className="sidebar-section-title">
                <i className="fas fa-brain"></i> Case Context Memory
              </h3>
              <div className="memory-panel">
                <div className="memory-content">{getRecentMemory()}</div>
              </div>
              <button
                className="btn"
                onClick={() => {
                  clearMemory();
                  window.showToast?.("Memory cleared successfully", "success");
                }}
              >
                <span className="btn-icon">
                  <i className="fas fa-undo"></i>
                </span>{" "}
                Clear Context
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Settings Section */}
      {activeSection === "settings" && (
        <div className="sidebar-content">
          <div className="settings-section">
            {/* Appearance Settings */}
            <div className="setting-group">
              <h3 className="sidebar-section-title">
                <i className="fas fa-sliders-h"></i> Preferences
              </h3>

              {/* Theme Toggle */}
              <div className="setting-item">
                <label>Theme</label>
                <button
                  className="setting-theme-btn"
                  onClick={() => {
                    toggleTheme();
                    window.showToast?.(
                      `Switched to ${currentTheme === "dark" ? "light" : "dark"
                      } mode`,
                      "info"
                    );
                  }}
                >
                  <span className="btn-icon">
                    <i
                      className={`fas ${currentTheme === "dark" ? "fa-sun" : "fa-moon"
                        }`}
                    ></i>
                  </span>{" "}
                  {currentTheme === "dark" ? "Light Mode" : "Dark Mode"}
                </button>
              </div>

              {/* Font Size */}
              <div className="setting-item">
                <label>Font Size</label>
                <div className="setting-buttons">
                  {["small", "medium", "large"].map((size) => (
                    <button
                      key={size}
                      className={`setting-btn ${userSettings.fontSize === size ? "active" : ""
                        }`}
                      onClick={() => handleSettingChange("fontSize", size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Behavior Settings */}
            <div className="setting-group">
              <h3 className="sidebar-section-title">
                <i className="fas fa-robot"></i> Assistant Behavior
              </h3>

              {/* Animations */}
              <div className="setting-item">
                <label>Animations</label>
                <button
                  className={`setting-toggle ${userSettings.animationsEnabled ? "active" : ""
                    }`}
                  onClick={() =>
                    handleSettingChange(
                      "animationsEnabled",
                      !userSettings.animationsEnabled
                    )
                  }
                >
                  <span className="toggle-slider"></span>
                  {userSettings.animationsEnabled ? "Enabled" : "Disabled"}
                </button>
              </div>

              {/* Auto Scroll */}
              <div className="setting-item">
                <label>Auto Scroll</label>
                <button
                  className={`setting-toggle ${userSettings.autoScrollEnabled ? "active" : ""
                    }`}
                  onClick={() =>
                    handleSettingChange(
                      "autoScrollEnabled",
                      !userSettings.autoScrollEnabled
                    )
                  }
                >
                  <span className="toggle-slider"></span>
                  {userSettings.autoScrollEnabled ? "Enabled" : "Disabled"}
                </button>
              </div>

              {/* Sound Effects */}
              <div className="setting-item">
                <label>Sound Effects</label>
                <button
                  className={`setting-toggle ${userSettings.soundEffectsEnabled ? "active" : ""
                    }`}
                  onClick={() =>
                    handleSettingChange(
                      "soundEffectsEnabled",
                      !userSettings.soundEffectsEnabled
                    )
                  }
                >
                  <span className="toggle-slider"></span>
                  {userSettings.soundEffectsEnabled ? "Enabled" : "Disabled"}
                </button>
              </div>

              {/* TTS Toggle */}
              <div className="setting-item">
                <label>Text-to-Speech</label>
                <button
                  className={`setting-toggle ${ttsEnabled ? "active" : ""}`}
                  onClick={() => {
                    toggleTTS();
                    window.showToast?.(
                      "Audio " + (!ttsEnabled ? "enabled" : "disabled"),
                      "info"
                    );
                  }}
                >
                  <span className="toggle-slider"></span>
                  {ttsEnabled ? "Enabled" : "Disabled"}
                </button>
              </div>
            </div>

            {/* Keyboard Shortcuts */}
            <div className="setting-group">
              <h3 className="sidebar-section-title">
                <i className="fas fa-keyboard"></i> Shortcuts
              </h3>
              <div className="shortcuts-list">
                <div className="shortcut-item">
                  <span className="shortcut-key">Ctrl + M</span>
                  <span className="shortcut-desc">Toggle Sidebar</span>
                </div>
                <div className="shortcut-item">
                  <span className="shortcut-key">Escape</span>
                  <span className="shortcut-desc">Close Sidebar</span>
                </div>
                <div className="shortcut-item">
                  <span className="shortcut-key">Enter</span>
                  <span className="shortcut-desc">Send Message</span>
                </div>
                <div className="shortcut-item">
                  <span className="shortcut-key">Space</span>
                  <span className="shortcut-desc">Push to Talk (Future)</span>
                </div>
              </div>

              <div className="setting-item">
                <label>Keyboard Shortcuts</label>
                <button
                  className={`setting-toggle ${userSettings.keyboardShortcutsEnabled ? "active" : ""
                    }`}
                  onClick={() =>
                    handleSettingChange(
                      "keyboardShortcutsEnabled",
                      !userSettings.keyboardShortcutsEnabled
                    )
                  }
                >
                  <span className="toggle-slider"></span>
                  {userSettings.keyboardShortcutsEnabled
                    ? "Enabled"
                    : "Disabled"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

Sidebar.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func,
};

export default Sidebar;
