import React from "react";
import { useChatContext } from "../context/ChatContext";
import "./Sidebar.css";

const Sidebar = ({ isOpen, onClose }) => {
  const {
    conversationMemory,
    status,
    currentEmotion,
    ttsEnabled,
    chatHistory,
    currentChatId,
    clearMemory,
    clearChatHistory,
    toggleTTS,
    createNewChat,
    switchToChat,
  } = useChatContext();

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

  return (
    <div className={`sidebar ${isOpen ? "open" : ""}`}>
      <div className="sidebar-header">
        <h2>RIZZ.ie</h2>
        <p
          style={{
            margin: "5px 0 0 0",
            fontSize: "14px",
            color: "rgba(255,255,255,0.6)",
          }}
        >
          Daemon v1.0
        </p>
      </div>

      {/* Chat History */}
      <div className="sidebar-section">
        <h3>Chat Management</h3>
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
        {chatHistory && chatHistory.length > 0 && (
          <div className="chat-history-section">
            <h4>Recent Chats</h4>
            <div className="chat-history-list">
              {chatHistory.slice(0, 10).map((chat) => (
                <div
                  key={chat.id}
                  className={`chat-history-item ${
                    currentChatId === chat.id ? "active" : ""
                  }`}
                  onClick={() => {
                    switchToChat(chat.id);
                    window.showToast?.(`Switched to: ${chat.title}`, "info");
                  }}
                >
                  <div className="chat-title">{chat.title}</div>
                  <div className="chat-preview">{chat.preview}</div>
                  <div className="chat-time">
                    {new Date(chat.lastActive).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

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

      {/* Chatbot Status */}
      <div className="sidebar-section">
        <h3>Chatbot Status</h3>
        <div className="status-panel">
          <div className="status-display">{status}</div>
          <div className="emotion-status">
            Current Emotion:{" "}
            <span>
              {emotionEmojis[currentEmotion]} {currentEmotion}
            </span>
          </div>
          <div className="status-indicators">
            <div className={`indicator ${ttsEnabled ? "active" : ""}`}>
              <span className="status-icon">
                <i className="fas fa-volume-up"></i>
              </span>{" "}
              Audio: {ttsEnabled ? "ON" : "OFF"}
            </div>
          </div>
        </div>
      </div>

      {/* User Profile */}
      <div className="sidebar-section">
        <h3>User Profile</h3>
        <div className="profile-panel">
          <div className="profile-avatar">
            <i className="fas fa-user"></i>
          </div>
          <div className="profile-info">
            <div className="profile-name">Guest User</div>
            <div className="profile-email">guest@example.com</div>
          </div>
        </div>
        <button
          className="btn"
          onClick={() =>
            window.showToast?.("Profile settings coming soon!", "info")
          }
        >
          <span className="btn-icon">
            <i className="fas fa-cog"></i>
          </span>{" "}
          Profile Settings
        </button>
      </div>

      {/* Memory & Advanced */}
      <div className="sidebar-section">
        <h3>Advanced</h3>
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
          Clear Memory
        </button>
        <button
          className={`btn ${!ttsEnabled ? "disabled" : ""}`}
          onClick={() => {
            toggleTTS();
            window.showToast?.(
              "Audio " + (!ttsEnabled ? "enabled" : "disabled"),
              "info"
            );
          }}
        >
          <span className="btn-icon">
            <i
              className={`fas ${
                ttsEnabled ? "fa-volume-up" : "fa-volume-mute"
              }`}
            ></i>
          </span>{" "}
          {ttsEnabled ? "Audio ON" : "Audio OFF"}
        </button>
        <div className="memory-panel">
          <h4>Recent Context</h4>
          <div className="memory-content">{getRecentMemory()}</div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
