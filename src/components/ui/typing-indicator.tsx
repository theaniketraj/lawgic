import React from 'react';

export function TypingIndicator() {
  return (
    <div className="flex items-center gap-3 max-w-fit">
      <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center shrink-0">
        <i className="fas fa-robot text-primary-500 text-sm"></i>
      </div>
      <div className="flex items-center gap-1.5 px-4 py-3 bg-white border border-gray-100 dark:border-white/10 dark:bg-white/5 rounded-2xl rounded-tl-sm shadow-sm">
        <div 
          className="w-1.5 h-1.5 rounded-full bg-primary-400 dark:bg-primary-500 animate-bounce" 
          style={{ animationDelay: '0ms', animationDuration: '1s' }} 
        />
        <div 
          className="w-1.5 h-1.5 rounded-full bg-primary-400 dark:bg-primary-500 animate-bounce" 
          style={{ animationDelay: '150ms', animationDuration: '1s' }} 
        />
        <div 
          className="w-1.5 h-1.5 rounded-full bg-primary-400 dark:bg-primary-500 animate-bounce" 
          style={{ animationDelay: '300ms', animationDuration: '1s' }} 
        />
        <span className="ml-2 text-xs font-medium text-gray-500 dark:text-gray-400 tracking-wide">
          Thinking...
        </span>
      </div>
    </div>
  );
}
