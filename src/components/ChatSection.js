import React, { useState, useRef, useEffect } from "react";
import { useChatContext } from "../context/ChatContext";
import SkeletonLoader from "./SkeletonLoader";
import Message from "./Message";
import TypingIndicator from "./TypingIndicator";
import "./ChatSection.css";

const ChatSection = () => {
  const [inputValue, setInputValue] = useState("");
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const photoUploadRef = useRef(null);
  const documentUploadRef = useRef(null);

  const {
    messages,
    isTyping,
    addMessage,
    processMessage,
    setStatus,
    isLoadingMessages,
    userSettings,
  } = useChatContext();

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    // Listen for voice input events
    const handleVoiceInput = (e) => {
      setInputValue(e.detail);
      setTimeout(() => {
        const message = e.detail.trim();
        if (message) {
          addMessage(message, "user");
          processMessage(message);
        }
        setIsVoiceModalOpen(false);
        setIsListening(false);
      }, 100);
    };

    window.addEventListener("voiceInput", handleVoiceInput);
    return () => window.removeEventListener("voiceInput", handleVoiceInput);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = (messageText = null) => {
    const message = messageText || inputValue.trim();

    if (message) {
      // Simply add the message once - no duplicates
      addMessage(message, "user");
      setInputValue("");
      processMessage(message);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const toggleVoiceModal = () => {
    setIsVoiceModalOpen(!isVoiceModalOpen);
    if (!isVoiceModalOpen) {
      startVoiceInput();
    } else {
      stopVoiceInput();
    }
  };

  const startVoiceInput = () => {
    if (!window.webkitSpeechRecognition && !window.SpeechRecognition) {
      window.showToast?.(
        "Speech recognition not supported in this browser",
        "error"
      );
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setStatus("Listening...");
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      window.dispatchEvent(
        new CustomEvent("voiceInput", { detail: transcript })
      );
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
      setIsVoiceModalOpen(false);
      window.showToast?.("Voice input error: " + event.error, "error");
    };

    recognition.onend = () => {
      setStatus("Ready");
      setIsListening(false);
      setIsVoiceModalOpen(false);
    };

    recognition.start();
    window.currentRecognition = recognition;
  };

  const stopVoiceInput = () => {
    if (window.currentRecognition) {
      window.currentRecognition.stop();
    }
    setIsListening(false);
    setIsVoiceModalOpen(false);
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        addMessage("I've received your photo!", "bot");
        window.showToast?.("Photo uploaded successfully!", "success");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDocumentUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      window.showToast?.(`Processing ${file.name}...`, "info");
      setTimeout(() => {
        addMessage(
          `I've received your document: ${file.name}. I can help you analyze it!`,
          "bot"
        );
        window.showToast?.("Document uploaded successfully!", "success");
      }, 1000);
    }
  };

  const handleAttachmentClick = () => {
    // Create a hidden file input that accepts both images and documents
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*,.pdf,.doc,.docx,.txt";
    input.style.display = "none";

    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        if (file.type.startsWith("image/")) {
          handlePhotoUpload(e);
        } else {
          handleDocumentUpload(e);
        }
      }
    };

    input.click();
  };

  // Message action handlers
  const handleRegenerate = (message) => {
    // Remove the message and regenerate
    const messageIndex = messages.findIndex((msg) => msg.id === message.id);
    if (messageIndex > 0) {
      const previousMessage = messages[messageIndex - 1];
      if (previousMessage.sender === "user") {
        processMessage(previousMessage.text);
      }
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    window.showToast?.("Message copied!", "success");
  };

  const handleLike = (message, isLiked) => {
    // Update message in context or send feedback
    console.log(`Message ${message.id} ${isLiked ? "liked" : "unliked"}`);
    window.showToast?.(
      isLiked ? "👍 Feedback sent!" : "Feedback removed",
      "info"
    );
  };

  const handleDislike = (message, isDisliked) => {
    // Update message in context or send feedback
    console.log(
      `Message ${message.id} ${isDisliked ? "disliked" : "undisliked"}`
    );
    window.showToast?.(
      isDisliked ? "👎 Feedback sent!" : "Feedback removed",
      "info"
    );
  };

  return (
    <div className="chat-section">
      {/* Chat Messages Area */}
      <div className="chat-messages">
        {isLoadingMessages ? (
          <SkeletonLoader type="message" count={3} />
        ) : (
          messages.map((message, index) => (
            <Message
              key={message.id}
              message={message}
              index={index}
              animationDelay={
                userSettings?.animationsEnabled ? `${index * 0.1}s` : "0s"
              }
              onRegenerate={handleRegenerate}
              onCopy={handleCopy}
              onLike={handleLike}
              onDislike={handleDislike}
            />
          ))
        )}
        {isTyping && (
          <TypingIndicator
            showAvatar={true}
            animationType="dots"
            size="medium"
          />
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Search Bar */}
      <div className="search-bar-container">
        <div className="search-bar">
          {/* Hidden file inputs */}
          <input
            type="file"
            ref={photoUploadRef}
            accept="image/*"
            onChange={handlePhotoUpload}
            style={{ display: "none" }}
          />
          <input
            type="file"
            ref={documentUploadRef}
            accept=".pdf,.doc,.docx,.txt"
            onChange={handleDocumentUpload}
            style={{ display: "none" }}
          />

          {/* Attachment icon */}
          <div className="attachment-icons">
            <button
              className="attachment-btn"
              onClick={handleAttachmentClick}
              title="Upload File"
            >
              <i className="fas fa-paperclip"></i>
            </button>
          </div>

          {/* Input field */}
          <input
            ref={inputRef}
            type="text"
            className="search-input"
            placeholder="Type your message..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
          />

          {/* Voice and send buttons */}
          <div className="control-buttons">
            <button
              className={`voice-btn ${isVoiceModalOpen ? "active" : ""}`}
              onClick={toggleVoiceModal}
              title="Voice Input"
            >
              <i className="fas fa-microphone"></i>
            </button>
            <button
              className="send-btn"
              onClick={() => handleSendMessage()}
              title="Send Message"
            >
              <i className="fas fa-paper-plane"></i>
            </button>
          </div>
        </div>
      </div>

      {/* Voice Modal */}
      {isVoiceModalOpen && (
        <div
          className="voice-modal-overlay"
          onClick={() => setIsVoiceModalOpen(false)}
        >
          <div className="voice-modal" onClick={(e) => e.stopPropagation()}>
            <div className="voice-modal-header">
              <h3>Voice Input</h3>
              <button onClick={() => setIsVoiceModalOpen(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="voice-modal-content">
              <div
                className={`voice-indicator ${isListening ? "listening" : ""}`}
              >
                <i
                  className="fas fa-microphone"
                  style={{ fontSize: "60px" }}
                ></i>
              </div>
              <p>
                {isListening
                  ? "Listening... Speak now!"
                  : "Click to start speaking"}
              </p>
              {!isListening && (
                <button className="voice-start-btn" onClick={startVoiceInput}>
                  Start Recording
                </button>
              )}
              {isListening && (
                <button className="voice-stop-btn" onClick={stopVoiceInput}>
                  Stop Recording
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatSection;
