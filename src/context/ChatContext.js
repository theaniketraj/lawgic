import React, { createContext, useState, useContext, useEffect } from "react";

const ChatContext = createContext();

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChatContext must be used within a ChatProvider");
  }
  return context;
};

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [conversationMemory, setConversationMemory] = useState([]);
  const [currentEmotion, setCurrentEmotion] = useState("happy");
  const [status, setStatus] = useState("Ready");
  const [isListening, setIsListening] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [showWelcomeScreen, setShowWelcomeScreen] = useState(true); // Always start with welcome screen

  // Loading states for performance enhancement
  const [isLoadingChats, setIsLoadingChats] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  // Chat session management
  const [chatSessions, setChatSessions] = useState({});
  const [currentChatId, setCurrentChatId] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);

  // Enhanced sidebar features
  const [chatSearchQuery, setChatSearchQuery] = useState("");
  const [selectedChatCategory, setSelectedChatCategory] = useState("all");
  const [usageStats, setUsageStats] = useState({
    totalChats: 0,
    totalMessages: 0,
    averageResponseTime: 0,
    favoriteTopics: [],
    timeSpent: 0,
  });
  const [userSettings, setUserSettings] = useState({
    fontSize: "medium", // small, medium, large
    animationsEnabled: true,
    autoScrollEnabled: true,
    soundEffectsEnabled: false,
    keyboardShortcutsEnabled: true,
  });

  // Chat categories/tags
  const chatCategories = [
    { id: "all", name: "All Chats", icon: "fa-comments" },
    { id: "work", name: "Work", icon: "fa-briefcase" },
    { id: "personal", name: "Personal", icon: "fa-user" },
    { id: "learning", name: "Learning", icon: "fa-graduation-cap" },
    { id: "creative", name: "Creative", icon: "fa-lightbulb" },
    { id: "archived", name: "Archived", icon: "fa-archive" },
  ];

  // Legal Conversation templates
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
      initialMessage: "I need to draft a Rent Agreement for a property in Delhi",
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

  // Load chat sessions and history from localStorage on mount
  useEffect(() => {
    const initializeApp = async () => {
      setIsLoadingChats(true);
      setIsLoadingStats(true);

      // Simulate progressive loading with small delays for smoother UX
      const savedChatSessions = localStorage.getItem("chatSessions");
      const savedChatHistory = localStorage.getItem("chatHistoryList");
      const savedCurrentChatId = localStorage.getItem("currentChatId");
      const savedMemory = localStorage.getItem("conversationMemory");

      // Load recent chats first (progressive loading)
      if (savedChatHistory) {
        try {
          const parsedHistory = JSON.parse(savedChatHistory);
          // Load recent chats first (last 5)
          const recentChats = parsedHistory.slice(0, 5);
          setChatHistory(recentChats);

          // Load remaining chats after a short delay
          setTimeout(() => {
            setChatHistory(parsedHistory);
            setIsLoadingChats(false);
          }, 200);
        } catch (e) {
          console.error("Error loading chat history list:", e);
          setIsLoadingChats(false);
        }
      } else {
        setIsLoadingChats(false);
      }

      // Load chat sessions
      if (savedChatSessions) {
        try {
          const parsedSessions = JSON.parse(savedChatSessions);
          setChatSessions(parsedSessions);
        } catch (e) {
          console.error("Error loading chat sessions:", e);
        }
      }

      // Load current chat or create new one (but always show welcome screen first)
      if (savedCurrentChatId && savedChatSessions) {
        try {
          const parsedSessions = JSON.parse(savedChatSessions);
          const currentSession = parsedSessions[savedCurrentChatId];
          if (currentSession) {
            setCurrentChatId(savedCurrentChatId);
            setMessages(currentSession.messages || []);
            setConversationMemory(currentSession.memory || []);
            // Keep welcome screen showing initially - it will auto-dismiss
          } else {
            // Create new chat if saved session doesn't exist
            createNewChatInternal();
          }
        } catch (e) {
          console.error("Error loading current chat:", e);
          createNewChatInternal();
        }
      } else {
        // No previous chat - create new one
        createNewChatInternal();
      }

      if (savedMemory) {
        try {
          setConversationMemory(JSON.parse(savedMemory));
        } catch (e) {
          console.error("Error loading memory:", e);
        }
      }

      // Load user settings
      const savedSettings = localStorage.getItem("userSettings");
      if (savedSettings) {
        try {
          setUserSettings(JSON.parse(savedSettings));
        } catch (e) {
          console.error("Error loading user settings:", e);
        }
      }

      // Simulate stats calculation with delay for smooth loading
      setTimeout(() => {
        setIsLoadingStats(false);
      }, 500);
    };

    const createNewChatInternal = () => {
      const newChatId = `chat_${Date.now()}`;
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

      // Update sessions
      setChatSessions((prev) => ({ ...prev, [newChatId]: newSession }));

      // Update history list
      setChatHistory((prev) => [
        {
          id: newChatId,
          title: newSession.title,
          lastActive: newSession.lastActive,
          preview: "New chat started",
        },
        ...prev,
      ]);

      // Set as current chat
      setCurrentChatId(newChatId);
      setMessages([welcomeMessage]);
      setConversationMemory([]);

      // Welcome screen will already be showing from initial state
      // No need to set it here - it starts as true

      // Save to localStorage
      setTimeout(() => {
        localStorage.setItem(
          "chatSessions",
          JSON.stringify({ [newChatId]: newSession })
        );
        localStorage.setItem(
          "chatHistoryList",
          JSON.stringify([
            {
              id: newChatId,
              title: newSession.title,
              lastActive: newSession.lastActive,
              preview: "New chat started",
            },
          ])
        );
        localStorage.setItem("currentChatId", newChatId);
      }, 0);

      return newChatId;
    };

    initializeApp();
  }, []);

  // Auto-dismiss welcome screen after 4 seconds
  useEffect(() => {
    if (showWelcomeScreen) {
      const timer = setTimeout(() => {
        setShowWelcomeScreen(false);
      }, 4000); // 4 seconds to see the welcome screen

      return () => clearTimeout(timer);
    }
  }, [showWelcomeScreen]);

  // Save to localStorage whenever messages change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("chatHistory", JSON.stringify(messages));
    }
  }, [messages]);

  useEffect(() => {
    if (conversationMemory.length > 0) {
      localStorage.setItem(
        "conversationMemory",
        JSON.stringify(conversationMemory)
      );
    }
  }, [conversationMemory]);

  // Chat session management functions
  const createNewChat = () => {
    const newChatId = `chat_${Date.now()}`;
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

    // Update sessions
    setChatSessions((prev) => ({ ...prev, [newChatId]: newSession }));

    // Update history list
    setChatHistory((prev) => [
      {
        id: newChatId,
        title: newSession.title,
        lastActive: newSession.lastActive,
        preview: "New chat started",
      },
      ...prev,
    ]);

    // Set as current chat
    setCurrentChatId(newChatId);
    setMessages([welcomeMessage]);
    setConversationMemory([]);

    // Don't affect welcome screen for new chats - let user continue

    // Save to localStorage
    setTimeout(() => saveToLocalStorage(newChatId, newSession), 0);
  };

  const switchToChat = (chatId) => {
    const session = chatSessions[chatId];
    if (session) {
      setIsLoadingMessages(true);

      // Simulate loading delay for smooth transition
      setTimeout(() => {
        setCurrentChatId(chatId);
        setMessages(session.messages);
        setConversationMemory(session.memory);
        setShowWelcomeScreen(
          session.messages.length === 1 &&
          session.messages[0].id === "welcome-message"
        );
        setIsLoadingMessages(false);
      }, 150);

      // Update last active time
      const updatedSession = {
        ...session,
        lastActive: new Date().toISOString(),
      };
      setChatSessions((prev) => ({ ...prev, [chatId]: updatedSession }));
      localStorage.setItem("currentChatId", chatId);
    }
  };

  const saveToLocalStorage = (chatId, session) => {
    // Save session
    setChatSessions((prev) => {
      const updated = { ...prev, [chatId]: session };
      localStorage.setItem("chatSessions", JSON.stringify(updated));
      return updated;
    });

    // Update history list
    setChatHistory((prev) => {
      const updated = prev.map((item) =>
        item.id === chatId
          ? {
            ...item,
            lastActive: session.lastActive,
            preview: getPreviewText(session.messages),
          }
          : item
      );
      localStorage.setItem("chatHistoryList", JSON.stringify(updated));
      return updated;
    });

    localStorage.setItem("currentChatId", chatId);
  };

  const getPreviewText = (messages) => {
    const lastUserMessage = messages.filter((m) => m.sender === "user").pop();
    if (lastUserMessage) {
      return (
        lastUserMessage.text.substring(0, 50) +
        (lastUserMessage.text.length > 50 ? "..." : "")
      );
    }
    return "New chat started";
  };

  const generateChatTitle = (messages) => {
    const firstUserMessage = messages.find((m) => m.sender === "user");
    if (firstUserMessage) {
      return (
        firstUserMessage.text.substring(0, 30) +
        (firstUserMessage.text.length > 30 ? "..." : "")
      );
    }
    return "New Chat";
  };

  const addMessage = (text, sender) => {
    const newMessage = {
      id: Date.now(),
      text,
      sender,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => {
      const updatedMessages = [...prev, newMessage];

      // Check if this is the first user message and welcome message exists
      if (sender === "user") {
        const hasWelcomeMessage = prev.some(
          (msg) => msg.id === "welcome-message"
        );
        const hasUserMessages = prev.some((msg) => msg.sender === "user");

        // If welcome message exists and this is the first user message, remove the welcome message
        if (hasWelcomeMessage && !hasUserMessages) {
          setShowWelcomeScreen(false); // Hide welcome screen when user sends first message
          const messagesWithoutWelcome = [newMessage]; // Replace welcome message with user message

          // Update current session with new title
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

      // Save to current session
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
    // Clear all chat sessions and history
    setChatSessions({});
    setChatHistory([]);
    setCurrentChatId(null);

    // Clear localStorage
    localStorage.removeItem("chatSessions");
    localStorage.removeItem("chatHistoryList");
    localStorage.removeItem("currentChatId");
    localStorage.removeItem("chatHistory"); // Legacy cleanup
    localStorage.removeItem("conversationMemory"); // Legacy cleanup

    // Show welcome screen again and create new chat
    setShowWelcomeScreen(true);
    createNewChat();
  };

  const clearMemory = () => {
    setConversationMemory([]);
    localStorage.removeItem("conversationMemory");
    // Status update removed - handled by toast in Sidebar
  };

  const analyzeEmotion = (text) => {
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

  const generateResponse = (message) => {
    const lowerMessage = message.toLowerCase();

    // Mock Legal Knowledge Base Logic
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

    // Default responses
    const defaultResponses = [
      "That is a complex legal matter. According to Indian Law, this would typically fall under Civil/Criminal jurisdiction depending on the facts. Could you provide more specific details?",
      "I can help you search for relevant case laws on this topic. Please specify if you are looking for Supreme Court or High Court judgments.",
      "Please note that while I can provide information on Acts and Sections, you should consult a practicing Advocate for legal representation.",
      "Could you clarify which specific Act you are referring to? (e.g., Contract Act, IT Act, Companies Act).",
    ];

    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

  const processMessage = async (message) => {
    setIsTyping(true);
    setStatus("Thinking...");

    // Add to memory
    const userMemory = { role: "user", content: message };
    setConversationMemory((prev) => [...prev, userMemory]);

    // Simulate AI processing delay
    setTimeout(() => {
      const response = generateResponse(message);
      const emotion = analyzeEmotion(response);

      addMessage(response, "bot");
      setCurrentEmotion(emotion);
      setIsTyping(false);
      setStatus("Ready");

      // Add to memory
      const botMemory = { role: "assistant", content: response };
      setConversationMemory((prev) => [...prev, botMemory]);

      // Text-to-speech
      if (ttsEnabled) {
        speakText(response);
      }
    }, 1500);
  };

  const speakText = (text) => {
    if (!ttsEnabled || !window.speechSynthesis) return;

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.8;
    utterance.pitch = 1.1;
    utterance.volume = 0.7;

    window.speechSynthesis.speak(utterance);
  };

  const toggleTTS = () => {
    const newTtsState = !ttsEnabled;
    setTtsEnabled(newTtsState);

    // Status updates removed - handled by toast in Sidebar
    if (!newTtsState) {
      // Stop any currently playing speech
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    }
  };

  // Enhanced sidebar functions
  const filterChatsBySearch = () => {
    if (!chatSearchQuery) return chatHistory;
    return chatHistory.filter(
      (chat) =>
        chat.title.toLowerCase().includes(chatSearchQuery.toLowerCase()) ||
        chat.preview.toLowerCase().includes(chatSearchQuery.toLowerCase())
    );
  };

  const filterChatsByCategory = (chats) => {
    if (selectedChatCategory === "all") return chats;
    return chats.filter((chat) => chat.category === selectedChatCategory);
  };

  const getFilteredChats = () => {
    const searchFiltered = filterChatsBySearch();
    return filterChatsByCategory(searchFiltered);
  };

  const createChatFromTemplate = (template) => {
    const newChatId = `chat_${Date.now()}`;
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

    // Update sessions
    setChatSessions((prev) => ({ ...prev, [newChatId]: newSession }));

    // Update history list
    setChatHistory((prev) => [
      {
        id: newChatId,
        title: newSession.title,
        lastActive: newSession.lastActive,
        preview: template.description,
        category: template.category,
      },
      ...prev,
    ]);

    // Set as current chat
    setCurrentChatId(newChatId);
    setMessages([initialMessage]);
    setConversationMemory([]);

    // Save to localStorage
    setTimeout(() => saveToLocalStorage(newChatId, newSession), 0);

    // Process the template message
    processMessage(template.initialMessage);

    return newChatId;
  };

  const updateUsageStats = () => {
    setUsageStats((prev) => ({
      ...prev,
      totalChats: Object.keys(chatSessions).length,
      totalMessages: Object.values(chatSessions).reduce(
        (total, session) => total + session.messages.length,
        0
      ),
      // Add more complex stats calculations here
    }));
  };

  const updateUserSettings = (newSettings) => {
    setUserSettings((prev) => ({ ...prev, ...newSettings }));
    localStorage.setItem(
      "userSettings",
      JSON.stringify({ ...userSettings, ...newSettings })
    );
  };

  const archiveChat = (chatId) => {
    const chatToArchive = chatHistory.find((chat) => chat.id === chatId);
    if (chatToArchive) {
      setChatHistory((prev) =>
        prev.map((chat) =>
          chat.id === chatId ? { ...chat, category: "archived" } : chat
        )
      );
    }
  };

  const unarchiveChat = (chatId) => {
    const chatToUnarchive = chatHistory.find((chat) => chat.id === chatId);
    if (chatToUnarchive) {
      setChatHistory((prev) =>
        prev.map((chat) =>
          chat.id === chatId ? { ...chat, category: "personal" } : chat
        )
      );
    }
  };

  const setChatCategory = (chatId, category) => {
    setChatHistory((prev) =>
      prev.map((chat) => (chat.id === chatId ? { ...chat, category } : chat))
    );
  };

  const value = {
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
    // Loading states for performance
    isLoadingChats,
    isLoadingMessages,
    isLoadingStats,
    // Enhanced sidebar state
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
    // Original functions
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
    switchToChat,
    // Enhanced sidebar functions
    getFilteredChats,
    createChatFromTemplate,
    updateUsageStats,
    updateUserSettings,
    archiveChat,
    unarchiveChat,
    setChatCategory,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
