/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any */
"use client";
import React, { createContext, useState, useContext, useEffect, useMemo } from "react";
import { toast } from "sonner";

const ChatContext = createContext<any>(null);

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChatContext must be used within a ChatProvider");
  }
  return context;
};

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [conversationMemory, setConversationMemory] = useState<any[]>([]);
  const [currentEmotion, setCurrentEmotion] = useState("happy");
  const [status, setStatus] = useState("Ready");
  const [isListening, setIsListening] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [showWelcomeScreen, setShowWelcomeScreen] = useState(true);
  const [inputValue, setInputValue] = useState("");

  // Loading states
  const [isLoadingChats, setIsLoadingChats] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  // Chat session management
  const [chatSessions, setChatSessions] = useState<any>({});
  const [currentChatId, setCurrentChatId] = useState<any>(null);
  const [chatHistory, setChatHistory] = useState<any[]>([]);

  // Sidebar features
  const [chatSearchQuery, setChatSearchQuery] = useState("");
  const [selectedChatCategory, setSelectedChatCategory] = useState("all");
  const [usageStats, setUsageStats] = useState<any>({
    totalChats: 0,
    totalMessages: 0,
    averageResponseTime: 0,
    favoriteTopics: [],
    timeSpent: 0,
  });
  const [userSettings, setUserSettings] = useState({
    fontSize: "medium",
    animationsEnabled: true,
    autoScrollEnabled: true,
    soundEffectsEnabled: false,
    keyboardShortcutsEnabled: true,
  });

  const chatCategories = [
    { id: "all", name: "All Chats", icon: "fa-comments" },
    { id: "work", name: "Work", icon: "fa-briefcase" },
    { id: "personal", name: "Personal", icon: "fa-user" },
    { id: "learning", name: "Learning", icon: "fa-graduation-cap" },
    { id: "creative", name: "Creative", icon: "fa-lightbulb" },
    { id: "archived", name: "Archived", icon: "fa-archive" },
  ];

  const conversationTemplates = [
    {
      id: "case-search",
      title: "Case Law Search",
      description: "Find relevant Supreme Court judgments",
      initialMessage: "find judgments related to Section 138 NI Act",
      category: "work",
    },
    {
      id: "legal-drafting",
      title: "Draft Legal Document",
      description: "Create affidavits, notices, or agreements",
      initialMessage:
        "I need to draft a Rent Agreement for a property in Delhi",
      category: "work",
    },
    {
      id: "bns-query",
      title: "New Criminal Laws (BNS)",
      description: "Understand the transition from IPC to BNS",
      initialMessage: "What is the new section for Cheating under BNS?",
      category: "learning",
    },
    {
      id: "procedural",
      title: "Procedural Guidance",
      description: "Steps for filing FIR, RTI, or Complaints",
      initialMessage: "What is the procedure to file an FIR online?",
      category: "learning",
    },
    {
      id: "general-consult",
      title: "General Consultation",
      description: "Ask any legal question",
      initialMessage: "I have a legal query regarding...",
      category: "personal",
    },
  ];

  useEffect(() => {
    const initializeApp = async () => {
      setIsLoadingChats(true);
      setIsLoadingStats(true);

      const { db } = await import("@/lib/storage");

      try {
        const savedChatSessions = await db.chats.getItem("chatSessions");
        const savedChatHistory = await db.history.getItem("chatHistoryList");
        const savedCurrentChatId = await db.chats.getItem("currentChatId");
        const savedMemory = await db.chats.getItem("conversationMemory");

        if (savedChatHistory) {
          try {
            const parsedHistory =
              typeof savedChatHistory === "string"
                ? JSON.parse(savedChatHistory)
                : savedChatHistory;
            const recentChats = parsedHistory.slice(0, 5);
            setChatHistory(recentChats);

            setTimeout(() => {
              setChatHistory(parsedHistory);
              setIsLoadingChats(false);
            }, 200);
          } catch (e) {
            console.error("Error loading chat history:", e);
            setIsLoadingChats(false);
          }
        } else {
          setIsLoadingChats(false);
        }

        if (savedChatSessions) {
          try {
            const parsedSessions =
              typeof savedChatSessions === "string"
                ? JSON.parse(savedChatSessions)
                : savedChatSessions;
            setChatSessions(parsedSessions);
          } catch (e) {
            console.error("Error loading chat sessions:", e);
          }
        }

        if (savedCurrentChatId && savedChatSessions) {
          try {
            const parsedSessions =
              typeof savedChatSessions === "string"
                ? JSON.parse(savedChatSessions)
                : savedChatSessions;
            const currentSession = parsedSessions[savedCurrentChatId as string];
            if (currentSession) {
              setCurrentChatId(savedCurrentChatId);
              setMessages(currentSession.messages || []);
              setConversationMemory(currentSession.memory || []);
            } else {
              createNewChatInternal();
            }
          } catch (e) {
            console.error("Error loading current chat:", e);
            createNewChatInternal();
          }
        } else {
          createNewChatInternal();
        }

        if (savedMemory) {
          try {
            setConversationMemory(
              typeof savedMemory === "string"
                ? JSON.parse(savedMemory)
                : savedMemory,
            );
          } catch (e) {
            console.error("Error loading memory:", e);
          }
        }

        const savedSettings = await db.settings.getItem("userSettings");
        if (savedSettings) {
          try {
            setUserSettings(
              typeof savedSettings === "string"
                ? JSON.parse(savedSettings)
                : savedSettings,
            );
          } catch (e) {
            console.error("Error loading user settings:", e);
          }
        }

        const savedStats = await db.stats.getItem("usageStats");
        if (savedStats) {
          try {
            setUsageStats(
              typeof savedStats === "string"
                ? JSON.parse(savedStats)
                : savedStats,
            );
          } catch (e) {}
        }
      } catch (error) {
        console.error("Storage error:", error);
        createNewChatInternal();
        setIsLoadingChats(false);
      }

      setTimeout(() => {
        setIsLoadingStats(false);
      }, 500);
    };

    const createNewChatInternal = () => {
      const newChatId = "chat_" + Date.now();
      const welcomeMessage = {
        id: "welcome-message",
        text: "Hello! I am LAWGic, your AI Legal Consultant. I can assist you with Indian laws (BNS, BNSS, BSA), case precedents, and legal drafting. Please note: I am an AI, not a lawyer. \n\nHow can I assist you today?",
        sender: "bot",
        timestamp: new Date().toISOString(),
      };

      const newSession = {
        id: newChatId,
        title: "New Chat",
        messages: [welcomeMessage],
        memory: [],
        createdAt: new Date().toISOString(),
        lastActive: new Date().toISOString(),
      };

      setChatSessions((prev: any) => ({ ...prev, [newChatId]: newSession }));
      setChatHistory((prev: any) => [
        {
          id: newChatId,
          title: newSession.title,
          lastActive: newSession.lastActive,
          preview: "New chat started",
        },
        ...prev,
      ]);

      setCurrentChatId(newChatId);
      setMessages([welcomeMessage]);
      setConversationMemory([]);

      setTimeout(async () => {
        const { db } = await import("@/lib/storage");
        await db.chats.setItem("chatSessions", { [newChatId]: newSession });
        await db.history.setItem("chatHistoryList", [
          {
            id: newChatId,
            title: newSession.title,
            lastActive: newSession.lastActive,
            preview: "New chat started",
          },
        ]);
        await db.chats.setItem("currentChatId", newChatId);
      }, 0);

      return newChatId;
    };

    initializeApp();
  }, []);

  useEffect(() => {
    if (showWelcomeScreen) {
      const timer = setTimeout(() => {
        setShowWelcomeScreen(false);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [showWelcomeScreen]);

  useEffect(() => {
    if (messages.length > 0) {
      import("@/lib/storage").then(({ db }) => {
        db.chats.setItem("chatHistory", messages);
      });
    }
  }, [messages]);

  useEffect(() => {
    if (conversationMemory.length > 0) {
      import("@/lib/storage").then(({ db }) => {
        db.chats.setItem("conversationMemory", conversationMemory);
      });
    }
  }, [conversationMemory]);

  const createNewChat = () => {
    const newChatId = "chat_" + Date.now();
    const welcomeMessage = {
      id: "welcome-message",
      text: "Hello! I am LAWGic, your AI Legal Consultant. I can assist you with Indian laws (BNS, BNSS, BSA), case precedents, and legal drafting. Please note: I am an AI, not a lawyer. \n\nHow can I assist you today?",
      sender: "bot",
      timestamp: new Date().toISOString(),
    };

    const newSession = {
      id: newChatId,
      title: "New Chat",
      messages: [welcomeMessage],
      memory: [],
      createdAt: new Date().toISOString(),
      lastActive: new Date().toISOString(),
    };

    setChatSessions((prev: any) => ({ ...prev, [newChatId]: newSession }));
    setChatHistory((prev: any) => [
      {
        id: newChatId,
        title: newSession.title,
        lastActive: newSession.lastActive,
        preview: "New chat started",
      },
      ...prev,
    ]);

    setCurrentChatId(newChatId);
    setMessages([welcomeMessage]);
    setConversationMemory([]);

    setTimeout(() => saveToLocalStorage(newChatId, newSession), 0);
    toast.success("New chat created!");
  };

  const switchToChat = (chatId: string) => {
    const session = chatSessions[chatId];
    if (session) {
      setIsLoadingMessages(true);

      setTimeout(() => {
        setCurrentChatId(chatId);
        setMessages(session.messages);
        setConversationMemory(session.memory);
        setShowWelcomeScreen(
          session.messages.length === 1 &&
            session.messages[0].id === "welcome-message",
        );
        setIsLoadingMessages(false);
      }, 150);

      const updatedSession = {
        ...session,
        lastActive: new Date().toISOString(),
      };
      setChatSessions((prev: any) => ({ ...prev, [chatId]: updatedSession }));
      import("@/lib/storage").then(({ db }) =>
        db.chats.setItem("currentChatId", chatId),
      );
    }
  };

  const saveToLocalStorage = async (chatId: string, session: any) => {
    const { db } = await import("@/lib/storage");
    setChatSessions((prev: any) => {
      const updated = { ...prev, [chatId]: session };
      db.chats.setItem("chatSessions", updated);
      return updated;
    });

    setChatHistory((prev: any) => {
      const updated = prev.map((item: any) =>
        item.id === chatId
          ? {
              ...item,
              lastActive: session.lastActive,
              preview: getPreviewText(session.messages),
            }
          : item,
      );
      db.history.setItem("chatHistoryList", updated);
      return updated;
    });

    await db.chats.setItem("currentChatId", chatId);
    updateUsageStats();
  };

  const getPreviewText = (messages: any[]) => {
    const lastUserMessage = messages.findLast((m) => m.sender === "user");
    if (lastUserMessage) {
      return (
        lastUserMessage.text.substring(0, 50) +
        (lastUserMessage.text.length > 50 ? "..." : "")
      );
    }
    return "New chat started";
  };

  const generateChatTitle = (messages: any[]) => {
    const firstUserMessage = messages.find((m) => m.sender === "user");
    if (firstUserMessage) {
      return (
        firstUserMessage.text.substring(0, 30) +
        (firstUserMessage.text.length > 30 ? "..." : "")
      );
    }
    return "New Chat";
  };

  const addMessage = (text: string, sender: string) => {
    const newMessage = {
      id: Date.now(),
      text,
      sender,
      timestamp: new Date().toISOString(),
    };

    if (userSettings.soundEffectsEnabled) {
      try {
        const audio = new Audio(
          sender === "user" ? "/sounds/send.mp3" : "/sounds/receive.mp3",
        );
        audio.play().catch((e) => console.log("Audio play prevented:", e));
      } catch (e) {
        console.error("Audio error", e);
      }
    }

    setMessages((prev: any[]) => {
      const updatedMessages = [...prev, newMessage];

      if (sender === "user") {
        const hasWelcomeMessage = prev.some(
          (msg) => msg.id === "welcome-message",
        );
        const hasUserMessages = prev.some((msg) => msg.sender === "user");

        if (hasWelcomeMessage && !hasUserMessages) {
          setShowWelcomeScreen(false);
          const messagesWithoutWelcome = [newMessage];

          if (currentChatId) {
            const newTitle = generateChatTitle([newMessage]);
            const updatedSession = {
              ...chatSessions[currentChatId],
              title: newTitle,
              messages: messagesWithoutWelcome,
              lastActive: new Date().toISOString(),
            };
            saveToLocalStorage(currentChatId, updatedSession);
          }

          return messagesWithoutWelcome;
        }
      }

      if (currentChatId) {
        const updatedSession = {
          ...chatSessions[currentChatId],
          messages: updatedMessages,
          lastActive: new Date().toISOString(),
        };
        saveToLocalStorage(currentChatId, updatedSession);
      }

      return updatedMessages;
    });
  };

  const clearChatHistory = () => {
    setChatSessions({});
    setChatHistory([]);
    setCurrentChatId(null);

    import("@/lib/storage").then(({ db }) => {
      db.chats.removeItem("chatSessions");
      db.history.removeItem("chatHistoryList");
      db.chats.removeItem("currentChatId");
      db.chats.removeItem("chatHistory");
      db.chats.removeItem("conversationMemory");
      db.stats.removeItem("usageStats");
    });

    setShowWelcomeScreen(true);
    createNewChat();
    toast.success("All chat history cleared");
  };

  const clearMemory = () => {
    setConversationMemory([]);
    import("@/lib/storage").then(({ db }) =>
      db.chats.removeItem("conversationMemory"),
    );
    toast.success("Memory cleared successfully");
  };

  const analyzeEmotion = (text: string) => {
    const positiveWords = [
      "happy",
      "great",
      "awesome",
      "wonderful",
      "fantastic",
      "love",
      "excited",
    ];
    const negativeWords = [
      "sad",
      "sorry",
      "bad",
      "terrible",
      "hate",
      "angry",
      "frustrated",
    ];

    const lowerText = text.toLowerCase();
    const hasPositive = positiveWords.some((word) => lowerText.includes(word));
    const hasNegative = negativeWords.some((word) => lowerText.includes(word));

    if (hasPositive && !hasNegative) return "happy";
    if (hasNegative && !hasPositive) return "sad";
    return "neutral";
  };

  const generateResponse = (message: string) => {
    const lowerMessage = message.toLowerCase();

    // Identity & Greetings
    if (
      new RegExp(/\b(hi|hii|hello|hey|greetings|namaste)\b/).exec(lowerMessage)
    ) {
      return "Hello! I am LAWGic, your AI Legal Consultant. How can I assist you with Indian laws, case precedents, or legal drafting today?";
    }
    if (
      lowerMessage.includes("who are you") ||
      lowerMessage.includes("what is lawgic")
    ) {
      return "I am **LAWGic**, an advanced AI Legal Consultant specializing in Indian Law (including BNS, BNSS, and BSA). I provide legal information, draft templates, and analyze case precedents. *Please note: I am an AI, not a substitute for a practicing advocate.*";
    }
    if (
      lowerMessage.includes("what can you do") ||
      lowerMessage.includes("capabilities")
    ) {
      return "**My Capabilities:**\n\n1. **Legal Research:** Instant references for IPC, CrPC, BNS, BNSS, etc.\n2. **Case Precedents:** Finding relevant Supreme Court and High Court judgments.\n3. **Legal Drafting:** Generating templates for Rent Agreements, Notices, FIR drafts, etc.\n4. **General Advice:** Clarifying your legal rights and procedures in India.\n\nWhat would you like to explore?";
    }
    if (lowerMessage.includes("thank") || lowerMessage.includes("thanks")) {
      return "You're very welcome! Let me know if you need help with anything else.";
    }

    // Features
    if (lowerMessage.includes("legal research")) {
      return "For **Legal Research**, you can ask me to find specific Sections of the BNS, BNSS, or BSA, search for case laws on specific subjects, or explain complex legal doctrines under Indian Law.";
    }
    if (
      lowerMessage.includes("document drafting") ||
      lowerMessage.includes("legal drafting") ||
      lowerMessage.includes("draft")
    ) {
      return "**Document Drafting:** I can generate templates for common legal documents such as Rent Agreements, NDAs, Legal Notices, Affidavits, and Wills. Just tell me what kind of document you need!";
    }
    if (
      lowerMessage.includes("case summary") ||
      lowerMessage.includes("case summaries") ||
      lowerMessage.includes("precedent")
    ) {
      return "**Case Summaries:** I can provide summaries of landmark Supreme Court and High Court judgments, including the facts, issues, and the ratio decidendi (the court's reasoning).";
    }
    if (
      lowerMessage.includes("ipc to bns") ||
      lowerMessage.includes("new criminal laws")
    ) {
      return "**IPC to BNS Conversion:**\nThe Indian Penal Code (IPC) has been replaced by the **Bharatiya Nyaya Sanhita (BNS)**. For example:\n- Section 302 IPC (Murder) is now **Section 103 BNS**.\n- Section 420 IPC (Cheating) is now **Section 318 BNS**.\n- Section 378 IPC (Theft) is now **Section 303 BNS**.\n\nYou can ask me about any specific IPC section, and I'll give you the new BNS equivalent!";
    }

    // Specific Offenses
    if (lowerMessage.includes("murder") || lowerMessage.includes("302")) {
      return "Under the **Bharatiya Nyaya Sanhita (BNS)**, Murder is covered under **Section 103** (previously Section 302 of IPC). \n\n**Punishment:** Death or imprisonment for life, and shall also be liable to fine.\n\n*Source: Section 103, Bharatiya Nyaya Sanhita, 2023*";
    }
    if (lowerMessage.includes("cheating") || lowerMessage.includes("420")) {
      return "Cheating is now covered under **Section 318** of the **Bharatiya Nyaya Sanhita (BNS)** (previously Section 420 of IPC). \n\n**Punishment:** Imprisonment up to 3 years, or with fine, or both.\n\n*Source: Section 318, Bharatiya Nyaya Sanhita, 2023*";
    }
    if (lowerMessage.includes("theft") || lowerMessage.includes("378")) {
      return "Theft is defined under **Section 303** of the **Bharatiya Nyaya Sanhita (BNS)** (previously Section 378 of IPC). \n\n**Definition:** Whoever, intending to take dishonestly any movable property out of the possession of any person without that person's consent, moves that property in order to such taking, is said to commit theft.\n\n*Source: Section 303, Bharatiya Nyaya Sanhita, 2023*";
    }
    if (lowerMessage.includes("divorce")) {
      return "Divorce in India is governed by personal laws based on religion:\n\n1. **Hindu Marriage Act, 1955:** Section 13B (Mutual Consent), Section 13 (Contested).\n2. **Special Marriage Act, 1954:** For inter-faith marriages.\n3. **Muslim Law:** Talaq, Khula, etc.\n\nPlease specify your religion or the Act under which the marriage was registered for more specific advice.";
    }
    if (lowerMessage.includes("rent") || lowerMessage.includes("agreement")) {
      return "For a **Rent Agreement**, the following clauses are essential:\n\n1. **Parties:** Names and addresses of Landlord and Tenant.\n2. **Property Details:** Address and description.\n3. **Tenure:** Start and end date (usually 11 months to avoid registration).\n4. **Rent & Deposit:** Monthly rent amount and security deposit.\n5. **Notice Period:** Usually 1 month.\n\nWould you like me to draft a template for you?";
    }
    if (lowerMessage.includes("fir") || lowerMessage.includes("police")) {
      return "To file an **FIR (First Information Report)** under **BNSS (Bharatiya Nagarik Suraksha Sanhita)**:\n\n1. Visit the nearest Police Station containing the jurisdiction.\n2. You can also file an **e-FIR** for certain cognizable offences (like theft) via the state police portal (Section 173 BNSS).\n3. If police refuse, you can send the substance of information to the Superintendent of Police (SP).\n\n*Source: Section 173, Bharatiya Nagarik Suraksha Sanhita, 2023*";
    }

    const defaultResponses = [
      "That is a complex legal matter. According to Indian Law, this would typically fall under Civil/Criminal jurisdiction depending on the facts. Could you provide more specific details?",
      "I can help you search for relevant case laws on this topic. Please specify if you are looking for Supreme Court or High Court judgments.",
      "Please note that while I can provide information on Acts and Sections, you should consult a practicing Advocate for legal representation.",
      "Could you clarify which specific Act you are referring to? (e.g., Contract Act, IT Act, Companies Act).",
    ];

    return defaultResponses[
      Math.floor(Math.random() * defaultResponses.length)
    ];
  };

  const processMessage = async (message: string) => {
    // Render user message instantly
    addMessage(message, "user");

    setIsTyping(true);
    setStatus("Thinking...");

    const userMemory = { role: "user", content: message };
    setConversationMemory((prev: any) => [...prev, userMemory]);

    try {
      const history: any[] = [];
      let currentQuery = null;

      for (const msg of conversationMemory) {
        if (msg.role === "user") {
          currentQuery = msg.content;
        } else if (msg.role === "assistant" && currentQuery) {
          history.push({ query: currentQuery, answer: msg.content });
          currentQuery = null;
        }
      }

      const res = await fetch("http://localhost:5000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: message, history }),
      });

      if (!res.ok) throw new Error("Error " + res.status);

      const data = await res.json();
      const response = data.response;
      const emotion = data.emotion || analyzeEmotion(response);

      addMessage(response, "bot");
      setCurrentEmotion(emotion);

      const botMemory = { role: "assistant", content: response };
      setConversationMemory((prev: any) => [...prev, botMemory]);

      if (ttsEnabled) {
        speakText(response);
      }
    } catch (error) {
      console.error("Backend error:", error);

      // Fallback to local keyword-based response if backend fails
      const fallbackResponse = generateResponse(message);
      const emotion = analyzeEmotion(fallbackResponse);

      addMessage(fallbackResponse, "bot");
      setCurrentEmotion(emotion);
      setConversationMemory((prev: any) => [
        ...prev,
        { role: "assistant", content: fallbackResponse },
      ]);

      if (ttsEnabled) {
        speakText(fallbackResponse);
      }
    } finally {
      setIsTyping(false);
      setStatus("Ready");
      updateUsageStats();
    }
  };

  const speakText = (text: string) => {
    if (!ttsEnabled || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.8;
    utterance.pitch = 1.1;
    utterance.volume = 0.7;
    window.speechSynthesis.speak(utterance);
  };

  const rateMessage = (messageId: string | number, rating: 'like' | 'dislike') => {
    setMessages((prev: any[]) => {
      const updatedMessages = prev.map((msg) =>
        msg.id === messageId ? { ...msg, reaction: rating } : msg
      );

      if (currentChatId) {
        const updatedSession = {
          ...chatSessions[currentChatId],
          messages: updatedMessages,
        };
        saveToLocalStorage(currentChatId, updatedSession);
      }
      return updatedMessages;
    });
  };

  const redoMessage = (messageId: string | number) => {
    const msgIndex = messages.findIndex((m) => m.id === messageId);
    if (msgIndex === -1) return;

    // Find the closest user message before this bot message
    let lastUserMessage: any = null;
    for (let i = msgIndex - 1; i >= 0; i--) {
      if (messages[i].sender === "user") {
        lastUserMessage = messages[i];
        break;
      }
    }

    if (lastUserMessage) {
      processMessage(lastUserMessage.text);
    }
  };

  const toggleTTS = () => {
    const newTtsState = !ttsEnabled;
    setTtsEnabled(newTtsState);
    toast.info(
      newTtsState ? "Voice response enabled" : "Voice response disabled",
    );

    if (!newTtsState && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  };

  const filterChatsBySearch = () => {
    if (!chatSearchQuery) return chatHistory;
    return chatHistory.filter(
      (chat: any) =>
        chat.title.toLowerCase().includes(chatSearchQuery.toLowerCase()) ||
        chat.preview.toLowerCase().includes(chatSearchQuery.toLowerCase()),
    );
  };

  const filterChatsByCategory = (chats: any[]) => {
    if (selectedChatCategory === "all") {
      return chats.filter(
        (chat) => chat.category !== "archived" && chat.category !== "trashed",
      );
    }
    return chats.filter((chat) => chat.category === selectedChatCategory);
  };

  const getFilteredChats = () => {
    return filterChatsByCategory(filterChatsBySearch());
  };

  const createChatFromTemplate = (template: any) => {
    const newChatId = "chat_" + Date.now();
    const initialMessage = {
      id: "template-message",
      text: template.initialMessage,
      sender: "user",
      timestamp: new Date().toISOString(),
    };

    const newSession = {
      id: newChatId,
      title: template.title,
      messages: [initialMessage],
      memory: [],
      category: template.category,
      createdAt: new Date().toISOString(),
      lastActive: new Date().toISOString(),
    };

    setChatSessions((prev: any) => ({ ...prev, [newChatId]: newSession }));
    setChatHistory((prev: any) => [
      {
        id: newChatId,
        title: newSession.title,
        lastActive: newSession.lastActive,
        preview: template.description,
        category: template.category,
      },
      ...prev,
    ]);

    setCurrentChatId(newChatId);
    setMessages([initialMessage]);
    setConversationMemory([]);

    setTimeout(() => saveToLocalStorage(newChatId, newSession), 0);
    processMessage(template.initialMessage);

    return newChatId;
  };

  const updateUsageStats = () => {
    setUsageStats((prev: any) => {
      const updated = {
        ...prev,
        totalChats: Object.keys(chatSessions).length,
        totalMessages: Object.values(chatSessions).reduce(
          (total: any, session: any) => total + (session.messages?.length || 0),
          0,
        ),
      };
      import("@/lib/storage").then(({ db }) =>
        db.stats.setItem("usageStats", updated),
      );
      return updated;
    });
  };

  const updateUserSettings = (newSettings: any) => {
    const updated = { ...userSettings, ...newSettings };
    setUserSettings(updated);
    import("@/lib/storage").then(({ db }) =>
      db.settings.setItem("userSettings", updated),
    );
    toast.success("Settings updated");
  };

  const archiveChat = (chatId: string) => {
    const chatToArchive = chatHistory.find((chat) => chat.id === chatId);
    if (chatToArchive) {
      setChatHistory((prev: any) => {
        const updated = prev.map((chat: any) =>
          chat.id === chatId ? { ...chat, category: "archived" } : chat,
        );
        import("@/lib/storage").then(({ db }) =>
          db.history.setItem("chatHistoryList", updated),
        );
        return updated;
      });
      if (currentChatId === chatId) {
        createNewChat();
      }
      toast.success("Chat archived");
    }
  };

  const unarchiveChat = (chatId: string) => {
    const chatToUnarchive = chatHistory.some((chat) => chat.id === chatId);
    if (chatToUnarchive) {
      setChatHistory((prev: any) => {
        const updated = prev.map((chat: any) =>
          chat.id === chatId ? { ...chat, category: "personal" } : chat,
        );
        import("@/lib/storage").then(({ db }) =>
          db.history.setItem("chatHistoryList", updated),
        );
        return updated;
      });
      toast.success("Chat unarchived");
    }
  };

  const trashChat = (chatId: string) => {
    const chatToTrash = chatHistory.some((chat) => chat.id === chatId);
    if (chatToTrash) {
      setChatHistory((prev: any) => {
        const updated = prev.map((chat: any) =>
          chat.id === chatId ? { ...chat, category: "trashed" } : chat,
        );
        import("@/lib/storage").then(({ db }) =>
          db.history.setItem("chatHistoryList", updated),
        );
        return updated;
      });
      if (currentChatId === chatId) {
        createNewChat();
      }
      toast.success("Chat moved to Recycle Bin");
    }
  };

  const restoreChat = (chatId: string) => {
    const chatToRestore = chatHistory.some((chat) => chat.id === chatId);
    if (chatToRestore) {
      setChatHistory((prev: any) => {
        const updated = prev.map((chat: any) =>
          chat.id === chatId ? { ...chat, category: "personal" } : chat,
        );
        import("@/lib/storage").then(({ db }) =>
          db.history.setItem("chatHistoryList", updated),
        );
        return updated;
      });
      toast.success("Chat restored");
    }
  };

  const emptyTrash = async () => {
    const trashedChats = chatHistory.filter(
      (chat) => chat.category === "trashed",
    );
    if (trashedChats.length === 0) return;

    setChatSessions((prev: any) => {
      const updated = { ...prev };
      trashedChats.forEach((chat) => {
        delete updated[chat.id];
      });
      import("@/lib/storage").then(({ db }) =>
        db.chats.setItem("chatSessions", updated),
      );
      return updated;
    });

    setChatHistory((prev: any) => {
      const updated = prev.filter((chat: any) => chat.category !== "trashed");
      import("@/lib/storage").then(({ db }) =>
        db.history.setItem("chatHistoryList", updated),
      );
      return updated;
    });

    toast.success("Recycle Bin emptied");
    updateUsageStats();
  };

  const deleteChat = async (chatId: string) => {
    setChatSessions((prev: any) => {
      const updated = { ...prev };
      delete updated[chatId];
      import("@/lib/storage").then(({ db }) =>
        db.chats.setItem("chatSessions", updated),
      );
      return updated;
    });

    setChatHistory((prev: any) => {
      const updated = prev.filter((chat: any) => chat.id !== chatId);
      import("@/lib/storage").then(({ db }) =>
        db.history.setItem("chatHistoryList", updated),
      );
      return updated;
    });

    if (currentChatId === chatId) {
      setCurrentChatId(null);
      setMessages([]);
      setConversationMemory([]);
      import("@/lib/storage").then(({ db }) => {
        db.chats.removeItem("currentChatId");
        db.chats.removeItem("conversationMemory");
      });
      setShowWelcomeScreen(true);
      createNewChat();
    }
    toast.success("Chat deleted");
    updateUsageStats();
  };

  const setChatCategory = (chatId: string, category: string) => {
    setChatHistory((prev: any) =>
      prev.map((chat: any) =>
        chat.id === chatId ? { ...chat, category } : chat,
      ),
    );
  };

  const value = useMemo(
    () => ({
      messages,
      conversationMemory,
      currentEmotion,
      status,
      isListening,
      ttsEnabled,
      isTyping,
      showWelcomeScreen,
      chatHistory,
      currentChatId,
      inputValue,
      setInputValue,
      isLoadingChats,
      isLoadingMessages,
      isLoadingStats,
      chatSearchQuery,
      setChatSearchQuery,
      selectedChatCategory,
      setSelectedChatCategory,
      usageStats,
      setUsageStats,
      userSettings,
      setUserSettings,
      chatCategories,
      conversationTemplates,
      setStatus,
      setIsListening,
      setCurrentEmotion,
      addMessage,
      clearChatHistory,
      clearMemory,
      processMessage,
      toggleTTS,
      analyzeEmotion,
      createNewChat,
      createChatFromTemplate,
      switchToChat,
      archiveChat,
      unarchiveChat,
      trashChat,
      restoreChat,
      deleteChat,
      emptyTrash,
      setChatCategory,
      rateMessage,
      redoMessage,
      speakText,
      updateUserSettings,
      updateUsageStats,
      getFilteredChats,
    }),
    [
      messages,
      conversationMemory,
      currentEmotion,
      status,
      isListening,
      ttsEnabled,
      isTyping,
      showWelcomeScreen,
      chatHistory,
      currentChatId,
      inputValue,
      setInputValue,
      isLoadingChats,
      isLoadingMessages,
      isLoadingStats,
      chatSearchQuery,
      setChatSearchQuery,
      selectedChatCategory,
      setSelectedChatCategory,
      usageStats,
      setUsageStats,
      userSettings,
      setUserSettings,
      chatCategories,
      conversationTemplates,
      setStatus,
      setIsListening,
      setCurrentEmotion,
      addMessage,
      clearChatHistory,
      clearMemory,
      processMessage,
      toggleTTS,
      analyzeEmotion,
      createNewChat,
      createChatFromTemplate,
      switchToChat,
      archiveChat,
      unarchiveChat,
      trashChat,
      restoreChat,
      deleteChat,
      emptyTrash,
      setChatCategory,
      rateMessage,
      redoMessage,
      speakText,
      updateUserSettings,
      updateUsageStats,
      getFilteredChats,
    ],
  );

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
