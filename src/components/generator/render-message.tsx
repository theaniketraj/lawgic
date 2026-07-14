"use client";

import { useEffect, useRef } from "react";
import { useStickToBottom } from "use-stick-to-bottom";
import AiResponse from "./text/ai-response";
import UserMessage from "./text/user-message";
import { TypingIndicator } from "../ui/typing-indicator";
import { useChatContext } from "@/context/ChatContext";

type PropsType = {
  messages: any[];
  isThinking: boolean;
};

export function RenderMessage({ messages, isThinking }: Readonly<PropsType>) {
  const { userSettings } = useChatContext();
  const { contentRef, scrollRef } = useStickToBottom();

  // Custom scroll ref for when useStickToBottom isn't used
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (userSettings?.autoScrollEnabled && containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages, isThinking, userSettings?.autoScrollEnabled]);

  return (
    <div
      className="flex-[1_1_0] overflow-y-auto custom-scrollbar px-5 pt-12 pb-6 md:px-12 scroll-smooth"
      ref={userSettings?.autoScrollEnabled ? scrollRef : containerRef}
    >
      <div
        className={`text-gray-800 dark:text-white/90 space-y-4 w-full max-w-4xl mx-auto prose ${userSettings?.fontSize === 'large' ? 'prose-lg text-xl' : userSettings?.fontSize === 'small' ? 'prose-sm text-sm' : 'prose-base text-base'} dark:prose-invert ${userSettings?.animationsEnabled ? "animate-fade-in" : ""}`}
        ref={contentRef}
      >
        {messages.map((message, messageIdx) => {
          if (message.sender === "user") {
            return (
              <div
                key={message.id}
                className={
                  userSettings?.animationsEnabled ? "animate-slide-up" : ""
                }
              >
                <UserMessage
                  message={message.text}
                  showActions={false} // Editing could be added back later with ChatContext
                  onEdit={async (newMessage) => {}}
                />
              </div>
            );
          }

          return (
            <div
              key={message.id}
              className={
                userSettings?.animationsEnabled ? "animate-slide-up" : ""
              }
            >
              <AiResponse message={message} />
            </div>
          );
        })}

        {isThinking && (
          <div
            className={`mt-4 ${userSettings?.animationsEnabled ? "animate-pulse" : ""}`}
          >
            <TypingIndicator />
          </div>
        )}
      </div>
    </div>
  );
}
