/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions */
"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useChatContext } from "@/context/ChatContext";
import { useTheme } from "next-themes";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { SkeletonLoader } from "@/components/ui/skeleton-loader";
import { AvatarSection } from "@/components/generator/avatar-section";

export default function GeneratorSidebar() {
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
    trashChat,
    restoreChat,
    deleteChat,
    emptyTrash,
    chatHistory,
    setInputValue,
    isTyping,
  } = useChatContext();

  const { theme, setTheme } = useTheme();
  const [activeSection, setActiveSection] = useState("chats");
  const sidebarRef = useRef<HTMLElement>(null);

  // Format memory
  const getRecentMemory = () => {
    if (conversationMemory.length === 0) {
      return "No previous conversations";
    }
    return conversationMemory
      .slice(-3)
      .map((m: any) => `${m.role}: ${m.content.substring(0, 30)}...`)
      .join(" | ");
  };

  const emotionEmojis: Record<string, any> = {
    happy: <i className="fas fa-smile text-green-500"></i>,
    sad: <i className="fas fa-frown text-red-500"></i>,
    neutral: <i className="fas fa-meh text-gray-500"></i>,
  };

  const handleSettingChange = (setting: string, value: any) => {
    updateUserSettings({ [setting]: value });
  };

  const [isCollapsed, setIsCollapsed] = useState(false);

  // Auto-collapse when user sends a new prompt (isTyping becomes true)
  useEffect(() => {
    if (isTyping && !isCollapsed) {
      setIsCollapsed(true);
    }
  }, [isTyping, isCollapsed]);

  // Auto-collapse on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      // Don't close if they click the "open sidebar" pulse button (which is outside the aside)
      const target = e.target as HTMLElement;
      if (target.closest('.highlight-pulse-btn')) return;

      if (!isCollapsed && sidebarRef.current && !sidebarRef.current.contains(e.target as Node)) {
        setIsCollapsed(true);
      }
    };

    // Use mousedown to trigger immediately on press down
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isCollapsed]);

  // Keyboard Shortcuts Hook
  useEffect(() => {
    if (!userSettings.keyboardShortcutsEnabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle Sidebar: Ctrl + / or Ctrl + M
      if (e.ctrlKey && (e.key === "/" || e.key.toLowerCase() === "m")) {
        e.preventDefault();
        setIsCollapsed((prev) => !prev);
      }
      // Close Sidebar: Escape
      if (e.key === "Escape") {
        setIsCollapsed(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [userSettings.keyboardShortcutsEnabled]);

  return (
    <>
      <style>{`
        @keyframes highlight-pulse {
          0%, 85%, 100% {
            transform: scale(1) translateX(0);
            box-shadow: 4px 0 24px rgba(0,0,0,0.05);
          }
          92.5% {
            transform: scale(1.08) translateX(6px);
            box-shadow: 0 0 25px rgba(99, 102, 241, 0.6);
            border-color: rgba(99, 102, 241, 0.5);
          }
        }
        .highlight-pulse-btn {
          animation: highlight-pulse 5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
      `}</style>

      {isCollapsed && (
        <button
          onClick={() => setIsCollapsed(false)}
          className="highlight-pulse-btn fixed top-25 -left-2 hover:left-0 z-50 py-4 px-3 pr-4 bg-white/70 dark:bg-dark-primary/70 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 border-l-0 rounded-r-2xl text-gray-500 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 transition-all duration-300 group flex items-center justify-center"
          title="Open Sidebar"
        >
          <i className="fas fa-chevron-right text-sm group-hover:translate-x-1 transition-transform duration-300"></i>
        </button>
      )}

      <aside
        ref={sidebarRef}
        className={`bg-white dark:bg-dark-primary border-r border-gray-100 dark:border-gray-800 shrink-0 relative z-40 transition-all duration-300 overflow-hidden ${
          isCollapsed
            ? "w-0 min-w-0 max-w-0 border-r-0 opacity-0"
            : "w-100 max-w-100 opacity-100"
        }`}
      >
        <div className="flex flex-col h-full w-100">
          {/* Navigation Tabs */}
          <div className="flex border-b border-gray-100 dark:border-gray-800">
            {[
              { id: "chats", icon: "fa-comments" },
              { id: "templates", icon: "fa-layer-group" },
              { id: "trash", icon: "fa-trash" },
              { id: "stats", icon: "fa-chart-bar" },
              { id: "settings", icon: "fa-cog" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id)}
                className={`flex-1 py-5 flex items-center justify-center border-b-2 transition-colors ${
                  activeSection === tab.id
                    ? "border-primary-500 text-primary-500"
                    : "border-transparent text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                }`}
                title={tab.id.charAt(0).toUpperCase() + tab.id.slice(1)}
              >
                <i className={`fas ${tab.icon} text-xl`}></i>
              </button>
            ))}
            <button
              onClick={() => setIsCollapsed(true)}
              className="flex-1 py-5 flex items-center justify-center border-b-2 border-transparent text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              title="Close Sidebar (Esc)"
            >
              <i className="fas fa-chevron-left text-xl"></i>
            </button>
          </div>

          {/* Content Area */}
          <div className="flex-[1_1_0] overflow-y-auto custom-scrollbar p-4">
            {/* Chats Section */}
            {activeSection === "chats" && (
              <div className="space-y-6">
                {/* Removed New Chat Button - Migrated to right pane */}

                {/* Search */}
                <div className="relative">
                  <i className="fas fa-search absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"></i>
                  <input
                    type="text"
                    placeholder="Search chats..."
                    value={chatSearchQuery}
                    onChange={(e) => setChatSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-dark-secondary border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:border-primary-500 transition-all dark:text-white"
                  />
                </div>

                {/* Categories */}
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                  {chatCategories.map((category: any) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedChatCategory(category.id)}
                      className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1.5 ${
                        selectedChatCategory === category.id
                          ? "bg-primary-500/10 text-primary-500 border border-primary-500/20"
                          : "bg-gray-100 dark:bg-dark-secondary text-gray-600 dark:text-gray-400 border border-transparent hover:bg-gray-200 dark:hover:bg-gray-800"
                      }`}
                    >
                      <i className={`fas ${category.icon}`}></i>
                      {category.name}
                    </button>
                  ))}
                </div>

                {/* Chat List */}
                <div className="space-y-1">
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-1">
                    Recent Consultations
                  </h3>
                  {isLoadingChats ? (
                    <div className="py-2">
                      <SkeletonLoader type="chat" count={5} />
                    </div>
                  ) : getFilteredChats().length === 0 ? (
                    <div className="text-center py-4 text-sm text-gray-400">
                      No chats found
                    </div>
                  ) : (
                    getFilteredChats().map((chat: any) => (
                      <div
                        key={chat.id}
                        onClick={() => switchToChat(chat.id)}
                        className={`group flex items-center justify-between p-3 rounded-xl cursor-pointer transition ${
                          currentChatId === chat.id
                            ? "bg-primary-500/10 border border-primary-500/20"
                            : "hover:bg-gray-100 dark:hover:bg-dark-secondary border border-transparent"
                        }`}
                      >
                        <div className="overflow-hidden">
                          <div className="flex items-center gap-2 mb-1">
                            <span
                              className={`text-sm font-medium truncate ${currentChatId === chat.id ? "text-primary-500" : "text-gray-800 dark:text-gray-200"}`}
                            >
                              {chat.title}
                            </span>
                            {chat.category && chat.category !== "all" && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 capitalize">
                                {chat.category}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 truncate">
                            {chat.preview}
                          </p>
                        </div>
                        <div className="flex opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              chat.category === "archived"
                                ? unarchiveChat(chat.id)
                                : archiveChat(chat.id);
                            }}
                            className="p-2 text-gray-400 hover:text-primary-500 transition"
                            title={chat.category === "archived" ? "Unarchive" : "Archive"}
                          >
                            <i
                              className={`fas ${chat.category === "archived" ? "fa-undo" : "fa-archive"}`}
                            ></i>
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              trashChat(chat.id);
                            }}
                            className="p-2 text-gray-400 hover:text-red-500 transition"
                            title="Move to Recycle Bin"
                          >
                            <i className="fas fa-trash-alt"></i>
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Recycle Bin Section */}
            {activeSection === "trash" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-gray-800">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                    <i className="fas fa-trash text-gray-400"></i> Recycle Bin
                  </h2>
                  <button
                    onClick={emptyTrash}
                    disabled={chatHistory.filter((c: any) => c.category === "trashed").length === 0}
                    className="text-xs text-red-500 hover:text-red-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 font-medium transition-colors"
                  >
                    <i className="fas fa-times-circle"></i> Empty
                  </button>
                </div>

                <div className="space-y-1">
                  {chatHistory.filter((c: any) => c.category === "trashed").length === 0 ? (
                    <div className="text-center py-10">
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 dark:bg-dark-secondary mb-3">
                        <i className="fas fa-leaf text-gray-400 text-xl"></i>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Recycle Bin is empty</p>
                    </div>
                  ) : (
                    chatHistory
                      .filter((c: any) => c.category === "trashed")
                      .map((chat: any) => (
                        <div
                          key={chat.id}
                          className="group flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-dark-secondary border border-transparent hover:border-gray-200 dark:hover:border-gray-700 transition"
                        >
                          <div className="overflow-hidden opacity-60 group-hover:opacity-100 transition-opacity">
                            <span className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate block">
                              {chat.title}
                            </span>
                            <span className="text-xs text-gray-500 block mt-0.5">
                              {new Date(chat.lastActive).toLocaleDateString()}
                            </span>
                          </div>
                          
                          <div className="flex opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                restoreChat(chat.id);
                              }}
                              className="p-2 text-gray-400 hover:text-green-500 transition"
                              title="Restore Chat"
                            >
                              <i className="fas fa-trash-restore"></i>
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteChat(chat.id);
                              }}
                              className="p-2 text-gray-400 hover:text-red-500 transition"
                              title="Delete Forever"
                            >
                              <i className="fas fa-times"></i>
                            </button>
                          </div>
                        </div>
                      ))
                  )}
                </div>
              </div>
            )}

            {/* Templates Section */}
            {activeSection === "templates" && (
              <div className="space-y-4">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-1">
                  Legal Templates
                </h3>
                {conversationTemplates.map((template: any) => (
                  <div
                    key={template.id}
                    className="p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-dark-secondary hover:border-primary-500/50 transition cursor-pointer"
                    onClick={() => {
                      setInputValue(template.initialMessage);
                      if (window.innerWidth < 1024) {
                        setIsCollapsed(true);
                      }
                    }}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-sm text-gray-900 dark:text-white">
                        {template.title}
                      </h4>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary-500/10 text-primary-500 uppercase tracking-wide">
                        {template.category}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mb-4">
                      {template.description}
                    </p>
                    <button
                      onClick={() => {
                        setChatSearchQuery(template.initialMessage);
                        setActiveSection("chats");
                      }}
                      className="text-xs font-medium text-primary-500 flex items-center gap-1.5 hover:underline"
                    >
                      <i className="fas fa-edit"></i> Use Template
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Stats Section */}
            {activeSection === "stats" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-1">
                    Firm Analytics
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-4 rounded-xl bg-gray-50 dark:bg-dark-secondary border border-gray-200 dark:border-gray-800">
                      <i className="fas fa-comments text-primary-500 mb-2 block"></i>
                      <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                        {usageStats.totalChats}
                      </div>
                      <div className="text-xs text-gray-500">Total Chats</div>
                    </div>
                    <div className="p-4 rounded-xl bg-gray-50 dark:bg-dark-secondary border border-gray-200 dark:border-gray-800">
                      <i className="fas fa-comment-dots text-primary-500 mb-2 block"></i>
                      <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                        {usageStats.totalMessages}
                      </div>
                      <div className="text-xs text-gray-500">Messages</div>
                    </div>
                    <div className="p-4 rounded-xl bg-gray-50 dark:bg-dark-secondary border border-gray-200 dark:border-gray-800">
                      <i className="fas fa-robot text-primary-500 mb-2 block"></i>
                      <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1 capitalize flex items-center gap-1.5">
                        {emotionEmojis[currentEmotion] || (
                          <i className="fas fa-meh text-gray-500"></i>
                        )}
                        <span className="text-lg">{currentEmotion}</span>
                      </div>
                      <div className="text-xs text-gray-500">Current Mood</div>
                    </div>
                    <div
                      onClick={toggleTTS}
                      className="p-4 rounded-xl bg-gray-50 dark:bg-dark-secondary border border-gray-200 dark:border-gray-800 cursor-pointer hover:border-primary-500/30 transition-all group duration-300"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <i className="fas fa-volume-up text-primary-500 group-hover:scale-110 transition-transform"></i>
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${ttsEnabled ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"}`}
                        >
                          {ttsEnabled ? "ACTIVE" : "MUTED"}
                        </span>
                      </div>
                      <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                        {ttsEnabled ? "ON" : "OFF"}
                      </div>
                      <div className="text-xs text-gray-500">Voice Output</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-1 mt-6">
                    System Status
                  </h3>
                  <AvatarSection />
                </div>

                <div>
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-1 mt-6">
                    Case Context Memory
                  </h3>
                  <div className="p-4 rounded-xl bg-gray-50 dark:bg-dark-secondary border border-gray-200 dark:border-gray-800 space-y-3">
                    <div className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed max-h-32 overflow-y-auto custom-scrollbar">
                      {conversationMemory.length === 0 ? (
                        <span className="italic text-gray-400">
                          No active context memory. Memory builds up
                          automatically as you query.
                        </span>
                      ) : (
                        <div className="space-y-2">
                          {conversationMemory
                            .slice(-3)
                            .map((m: any, idx: number) => (
                              <div
                                key={idx}
                                className="flex gap-2 text-left text-[11px]"
                              >
                                <span className="font-semibold capitalize text-primary-500 shrink-0">
                                  {m.role === "user" ? "You:" : "AI:"}
                                </span>
                                <span className="truncate flex-1">
                                  {m.content}
                                </span>
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                    {conversationMemory.length > 0 && (
                      <button
                        onClick={clearMemory}
                        className="w-full py-2 px-3 rounded-lg border border-red-200/50 dark:border-red-900/30 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 text-xs font-semibold transition flex items-center justify-center gap-1.5"
                      >
                        <i className="fas fa-trash-alt"></i> Clear Context
                        Memory
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Settings Section */}
            {activeSection === "settings" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-1">
                    Appearance
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-dark-secondary border border-gray-200 dark:border-gray-800">
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        Dark Mode
                      </span>
                      <button
                        onClick={() =>
                          setTheme(theme === "dark" ? "light" : "dark")
                        }
                        className={`w-11 h-6 rounded-full transition-colors relative ${theme === "dark" ? "bg-primary-500" : "bg-gray-300 dark:bg-gray-600"}`}
                      >
                        <div
                          className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${theme === "dark" ? "left-6" : "left-1"}`}
                        ></div>
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-1">
                    Text Settings
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-dark-secondary border border-gray-200 dark:border-gray-800">
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        Font Size
                      </span>
                      <div className="flex bg-gray-200 dark:bg-gray-700 rounded-lg p-1">
                        {["small", "medium", "large"].map((size) => (
                          <button
                            key={size}
                            onClick={() =>
                              handleSettingChange("fontSize", size)
                            }
                            className={`px-3 py-1 text-xs rounded-md capitalize transition-colors ${
                              userSettings.fontSize === size
                                ? "bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm"
                                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-1">
                    Behavior
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-dark-secondary border border-gray-200 dark:border-gray-800">
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        Text-to-Speech
                      </span>
                      <button
                        onClick={toggleTTS}
                        className={`w-11 h-6 rounded-full transition-colors relative ${ttsEnabled ? "bg-primary-500" : "bg-gray-300 dark:bg-gray-600"}`}
                      >
                        <div
                          className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${ttsEnabled ? "left-6" : "left-1"}`}
                        ></div>
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-dark-secondary border border-gray-200 dark:border-gray-800">
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        Animations
                      </span>
                      <button
                        onClick={() =>
                          handleSettingChange(
                            "animationsEnabled",
                            !userSettings.animationsEnabled,
                          )
                        }
                        className={`w-11 h-6 rounded-full transition-colors relative ${userSettings.animationsEnabled ? "bg-primary-500" : "bg-gray-300 dark:bg-gray-600"}`}
                      >
                        <div
                          className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${userSettings.animationsEnabled ? "left-6" : "left-1"}`}
                        ></div>
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-dark-secondary border border-gray-200 dark:border-gray-800">
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        Auto Scroll
                      </span>
                      <button
                        onClick={() =>
                          handleSettingChange(
                            "autoScrollEnabled",
                            !userSettings.autoScrollEnabled,
                          )
                        }
                        className={`w-11 h-6 rounded-full transition-colors relative ${userSettings.autoScrollEnabled ? "bg-primary-500" : "bg-gray-300 dark:bg-gray-600"}`}
                      >
                        <div
                          className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${userSettings.autoScrollEnabled ? "left-6" : "left-1"}`}
                        ></div>
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-dark-secondary border border-gray-200 dark:border-gray-800">
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        Sound Effects
                      </span>
                      <button
                        onClick={() =>
                          handleSettingChange(
                            "soundEffectsEnabled",
                            !userSettings.soundEffectsEnabled,
                          )
                        }
                        className={`w-11 h-6 rounded-full transition-colors relative ${userSettings.soundEffectsEnabled ? "bg-primary-500" : "bg-gray-300 dark:bg-gray-600"}`}
                      >
                        <div
                          className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${userSettings.soundEffectsEnabled ? "left-6" : "left-1"}`}
                        ></div>
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-dark-secondary border border-gray-200 dark:border-gray-800">
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        Keyboard Shortcuts
                      </span>
                      <button
                        onClick={() =>
                          handleSettingChange(
                            "keyboardShortcutsEnabled",
                            !userSettings.keyboardShortcutsEnabled,
                          )
                        }
                        className={`w-11 h-6 rounded-full transition-colors relative ${userSettings.keyboardShortcutsEnabled ? "bg-primary-500" : "bg-gray-300 dark:bg-gray-600"}`}
                      >
                        <div
                          className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${userSettings.keyboardShortcutsEnabled ? "left-6" : "left-1"}`}
                        ></div>
                      </button>
                    </div>

                    <div className="space-y-2 mb-4">
                      <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                        Shortcuts
                      </h4>
                      <div className="grid grid-cols-2 gap-2 mb-4">
                        <div className="flex flex-col p-2 bg-gray-50 dark:bg-dark-secondary rounded border border-gray-200 dark:border-gray-800">
                          <span className="text-xs font-mono text-primary-500 mb-1">
                            Ctrl + /
                          </span>
                          <span className="text-[10px] text-gray-500">
                            Toggle Sidebar
                          </span>
                        </div>
                        <div className="flex flex-col p-2 bg-gray-50 dark:bg-dark-secondary rounded border border-gray-200 dark:border-gray-800">
                          <span className="text-xs font-mono text-primary-500 mb-1">
                            Esc
                          </span>
                          <span className="text-[10px] text-gray-500">
                            Close Sidebar
                          </span>
                        </div>
                        <div className="flex flex-col p-2 bg-gray-50 dark:bg-dark-secondary rounded border border-gray-200 dark:border-gray-800">
                          <span className="text-xs font-mono text-primary-500 mb-1">
                            Enter
                          </span>
                          <span className="text-[10px] text-gray-500">
                            Send Message
                          </span>
                        </div>
                        <div className="flex flex-col p-2 bg-gray-50 dark:bg-dark-secondary rounded border border-gray-200 dark:border-gray-800">
                          <span className="text-xs font-mono text-primary-500 mb-1">
                            Space
                          </span>
                          <span className="text-[10px] text-gray-500">
                            Push to Talk
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    onClick={clearChatHistory}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-500/10 dark:hover:bg-red-500/20 dark:text-red-400 rounded-xl font-medium transition"
                  >
                    <i className="fas fa-trash"></i>
                    Clear All History
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Global Action Footer */}
          <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-dark-primary">
            <button
              onClick={createNewChat}
              className="w-full flex items-center justify-center gap-2 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-full font-medium transition shadow-sm hover:shadow-md"
            >
              <i className="fas fa-plus"></i>
              New Chat
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
