"use client";

import { CopyToClipboard } from "@/components/copy-to-clipboard";
import { useChatContext } from "@/context/ChatContext";

type PropsType = {
  message: any;
};

export default function AiResponse({ message }: Readonly<PropsType>) {
  const { rateMessage, redoMessage, speakText } = useChatContext();

  return (
    <div className="max-w-3xl whitespace-pre-wrap group">
      <div className="bg-white dark:bg-white/5 shadow-theme-xs rounded-2xl rounded-bl-sm py-3 px-4 max-w-3xl leading-relaxed">
        {message.text}
      </div>

      <div className="mt-2 flex items-center gap-3 text-gray-400 dark:text-gray-500 md:opacity-0 md:group-hover:opacity-100 opacity-100 transition-opacity px-2">
        {/* Listen Button */}
        <button
          onClick={() => speakText(message.text)}
          className="hover:text-primary-500 transition-colors p-1"
          title="Listen to response"
        >
          <i className="fas fa-volume-up"></i>
        </button>

        {/* Copy Button */}
        <CopyToClipboard text={message.text} />

        <div className="w-px h-3 bg-gray-200 dark:bg-gray-700 mx-1"></div>

        {/* Like Button */}
        <button
          onClick={() => rateMessage(message.id, "like")}
          className={`hover:text-green-500 transition-colors p-1 ${message.reaction === "like" ? "text-green-500" : ""}`}
          title="Helpful"
        >
          <i
            className={`${message.reaction === "like" ? "fas" : "far"} fa-thumbs-up`}
          ></i>
        </button>

        {/* Dislike Button */}
        <button
          onClick={() => rateMessage(message.id, "dislike")}
          className={`hover:text-red-500 transition-colors p-1 ${message.reaction === "dislike" ? "text-red-500" : ""}`}
          title="Not helpful"
        >
          <i
            className={`${message.reaction === "dislike" ? "fas" : "far"} fa-thumbs-down`}
          ></i>
        </button>

        <div className="w-px h-3 bg-gray-200 dark:bg-gray-700 mx-1"></div>

        {/* Redo Button */}
        <button
          onClick={() => redoMessage(message.id)}
          className="hover:text-primary-500 transition-colors p-1"
          title="Regenerate response"
        >
          <i className="fas fa-sync-alt"></i>
        </button>
      </div>
    </div>
  );
}
