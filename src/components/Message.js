import React, { useState, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  vscDarkPlus,
  vs,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import { useTheme } from "../context/ThemeContext";
import { useChatContext } from "../context/ChatContext";
import PropTypes from "prop-types";
import "./Message.css";

const Message = ({
  message,
  index,
  animationDelay,
  onRegenerate,
  onCopy,
  onLike,
  onDislike,
}) => {
  const { currentTheme } = useTheme();
  const { processMessage } = useChatContext();
  const [showActions, setShowActions] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [isLiked, setIsLiked] = useState(message.liked || false);
  const [isDisliked, setIsDisliked] = useState(message.disliked || false);
  const messageRef = useRef(null);

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.text);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
      onCopy?.(message);
      window.showToast?.("Message copied to clipboard", "success");
    } catch (err) {
      console.error("Failed to copy message:", err);
      window.showToast?.("Failed to copy message", "error");
    }
  };

  const handleRegenerate = () => {
    if (message.sender === "bot") {
      // Find the user message that prompted this response
      const userMessage = findPreviousUserMessage();
      if (userMessage) {
        processMessage(userMessage.text);
        onRegenerate?.(message, userMessage);
        window.showToast?.("Regenerating response...", "info");
      }
    }
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    setIsDisliked(false);
    onLike?.(message, !isLiked);
  };

  const handleDislike = () => {
    setIsDisliked(!isDisliked);
    setIsLiked(false);
    onDislike?.(message, !isDisliked);
  };

  const findPreviousUserMessage = () => {
    // This would need to be passed from parent or accessed from context
    // For now, we'll use the message text as fallback
    return { text: "Please regenerate your previous response" };
  };

  const getMessageStatus = () => {
    if (message.isOptimistic) return "sending";
    if (message.sender === "user") return "sent";
    if (message.sender === "bot") return "delivered";
    return "unknown";
  };

  const renderStatusIcon = () => {
    const status = getMessageStatus();
    switch (status) {
      case "sending":
        return (
          <i
            className="fas fa-clock status-icon sending"
            title="Sending..."
          ></i>
        );
      case "sent":
        return <i className="fas fa-check status-icon sent" title="Sent"></i>;
      case "delivered":
        return (
          <i
            className="fas fa-check-double status-icon delivered"
            title="Delivered"
          ></i>
        );
      default:
        return null;
    }
  };

  // Custom renderer for markdown with syntax highlighting
  const components = {
    code({ node, inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || "");
      const language = match ? match[1] : "";

      if (!inline && language) {
        return (
          <div className="code-block-container">
            <div className="code-block-header">
              <span className="code-language">{language}</span>
              <button
                className="code-copy-btn"
                onClick={() =>
                  navigator.clipboard.writeText(
                    String(children).replace(/\n$/, "")
                  )
                }
                title="Copy code"
              >
                <i className="fas fa-copy"></i>
              </button>
            </div>
            <SyntaxHighlighter
              style={currentTheme === "dark" ? vscDarkPlus : vs}
              language={language}
              PreTag="div"
              className="syntax-highlighter"
              {...props}
            >
              {String(children).replace(/\n$/, "")}
            </SyntaxHighlighter>
          </div>
        );
      }

      return (
        <code className={`inline-code ${className || ""}`} {...props}>
          {children}
        </code>
      );
    },
    // Enhanced link rendering with security
    a({ href, children, ...props }) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="message-link"
          {...props}
        >
          {children}
          <i className="fas fa-external-link-alt link-icon"></i>
        </a>
      );
    },
    // Enhanced list rendering
    ul({ children, ...props }) {
      return (
        <ul className="message-list" {...props}>
          {children}
        </ul>
      );
    },
    ol({ children, ...props }) {
      return (
        <ol className="message-list ordered" {...props}>
          {children}
        </ol>
      );
    },
    // Enhanced blockquote
    blockquote({ children, ...props }) {
      return (
        <blockquote className="message-blockquote" {...props}>
          {children}
        </blockquote>
      );
    },
    // Enhanced table support
    table({ children, ...props }) {
      return (
        <table className="message-table" {...props}>
          {children}
        </table>
      );
    },
  };

  return (
    <div
      ref={messageRef}
      className={`message ${message.sender}-message ${
        message.isOptimistic ? "optimistic" : ""
      } ${isLiked ? "liked" : ""} ${isDisliked ? "disliked" : ""}`}
      style={{
        animationDelay: animationDelay,
        opacity: message.isOptimistic ? 0.7 : 1,
      }}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Message Content */}
      <div className="message-content">
        <div className="message-text">
          {message.sender === "bot" ? (
            <ReactMarkdown components={components}>
              {message.text}
            </ReactMarkdown>
          ) : (
            message.text
          )}
        </div>

        {/* Message Actions */}
        <div className={`message-actions ${showActions ? "visible" : ""}`}>
          <button
            className="action-btn copy-btn"
            onClick={handleCopy}
            title="Copy message"
          >
            <i className={`fas ${copySuccess ? "fa-check" : "fa-copy"}`}></i>
          </button>

          {message.sender === "bot" && (
            <button
              className="action-btn regenerate-btn"
              onClick={handleRegenerate}
              title="Regenerate response"
            >
              <i className="fas fa-redo"></i>
            </button>
          )}

          {message.sender === "bot" && (
            <>
              <button
                className={`action-btn like-btn ${isLiked ? "active" : ""}`}
                onClick={handleLike}
                title="Like response"
              >
                <i className="fas fa-thumbs-up"></i>
              </button>

              <button
                className={`action-btn dislike-btn ${
                  isDisliked ? "active" : ""
                }`}
                onClick={handleDislike}
                title="Dislike response"
              >
                <i className="fas fa-thumbs-down"></i>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Message Footer */}
      <div className="message-footer">
        <div className="message-timestamp">
          {formatTimestamp(message.timestamp)}
        </div>
        <div className="message-status">{renderStatusIcon()}</div>
      </div>
    </div>
  );
};

Message.propTypes = {
  message: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    text: PropTypes.string.isRequired,
    sender: PropTypes.oneOf(["user", "bot"]).isRequired,
    timestamp: PropTypes.string.isRequired,
    isOptimistic: PropTypes.bool,
    liked: PropTypes.bool,
    disliked: PropTypes.bool,
  }).isRequired,
  index: PropTypes.number.isRequired,
  animationDelay: PropTypes.string,
  onRegenerate: PropTypes.func,
  onCopy: PropTypes.func,
  onLike: PropTypes.func,
  onDislike: PropTypes.func,
};

export default Message;
