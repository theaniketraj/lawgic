import React from "react";
import "./SkeletonLoader.css";

const SkeletonLoader = ({ type = "chat", count = 3 }) => {
  const renderChatSkeleton = () => (
    <div className="skeleton-chat-item">
      <div className="skeleton-chat-avatar"></div>
      <div className="skeleton-chat-content">
        <div className="skeleton-chat-title"></div>
        <div className="skeleton-chat-preview"></div>
        <div className="skeleton-chat-time"></div>
      </div>
    </div>
  );

  const renderMessageSkeleton = () => (
    <div className="skeleton-message">
      <div className="skeleton-message-content">
        <div className="skeleton-text-line long"></div>
        <div className="skeleton-text-line medium"></div>
        <div className="skeleton-text-line short"></div>
      </div>
    </div>
  );

  const renderStatsSkeleton = () => (
    <div className="skeleton-stats-grid">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="skeleton-stat-item">
          <div className="skeleton-stat-icon"></div>
          <div className="skeleton-stat-content">
            <div className="skeleton-stat-number"></div>
            <div className="skeleton-stat-label"></div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderTemplateSkeleton = () => (
    <div className="skeleton-template-item">
      <div className="skeleton-template-header">
        <div className="skeleton-template-title"></div>
        <div className="skeleton-template-category"></div>
      </div>
      <div className="skeleton-template-description"></div>
      <div className="skeleton-template-button"></div>
    </div>
  );

  const skeletonComponents = {
    chat: renderChatSkeleton,
    message: renderMessageSkeleton,
    stats: renderStatsSkeleton,
    template: renderTemplateSkeleton,
  };

  const SkeletonComponent = skeletonComponents[type] || renderChatSkeleton;

  return (
    <div className="skeleton-container" aria-label="Loading...">
      {type === "stats" ? (
        <SkeletonComponent />
      ) : (
        [...Array(count)].map((_, i) => (
          <div
            key={i}
            className="skeleton-item"
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            <SkeletonComponent />
          </div>
        ))
      )}
    </div>
  );
};

export default SkeletonLoader;
