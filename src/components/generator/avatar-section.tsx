'use client';

import { useChatContext } from "@/context/ChatContext";

export function AvatarSection() {
  const { currentEmotion, isTyping, status } = useChatContext();

  const getEmotionStyles = () => {
    switch (currentEmotion) {
      case 'happy':
        return {
          glow: 'bg-green-500/20',
          border: 'border-green-500/30',
          dot: 'bg-green-500',
          text: 'text-green-500'
        };
      case 'sad':
        return {
          glow: 'bg-blue-500/20',
          border: 'border-blue-500/30',
          dot: 'bg-blue-500',
          text: 'text-blue-500'
        };
      case 'confused':
        return {
          glow: 'bg-amber-500/20',
          border: 'border-amber-500/30',
          dot: 'bg-amber-500',
          text: 'text-amber-500'
        };
      default: // neutral
        return {
          glow: 'bg-primary-500/20',
          border: 'border-primary-500/30',
          dot: 'bg-primary-500',
          text: 'text-primary-500'
        };
    }
  };

  const styles = getEmotionStyles();
  const isAnimating = isTyping || status === "Thinking...";
  const isSpeaking = status === "Speaking..."; // from TTS

  return (
    <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-dark-secondary rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm transition-all duration-500">
      
      {/* Sleek Avatar Node */}
      <div className="relative shrink-0">
        {/* Ambient Glow */}
        <div className={`absolute inset-0 rounded-full ${styles.dot} blur-sm opacity-25 z-0`}></div>
        
        <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${styles.border} bg-white dark:bg-dark-primary shadow-inner z-10 relative overflow-hidden`}>
          {/* Subtle gradient background inside */}
          <div className={`absolute inset-0 ${styles.glow} opacity-40`}></div>
          
          {/* Inner Icon */}
          <div className="flex items-center justify-center">
            <i className={`fas fa-balance-scale text-base ${styles.text} z-10 transition-transform duration-500 ${isAnimating ? 'scale-110' : 'scale-100'}`}></i>
          </div>
          
          {/* Scanning/Thinking effect overlay */}
          {(isAnimating || isSpeaking) && (
            <div className="absolute inset-0 bg-linear-to-t from-transparent via-white/40 dark:via-white/10 to-transparent animate-[scan_2s_ease-in-out_infinite]"></div>
          )}
        </div>
        
        {/* Outer Ring Pulse */}
        <div className={`absolute -inset-1.5 rounded-full border border-dashed ${styles.border} opacity-40 ${isAnimating ? 'animate-[spin_6s_linear_infinite]' : ''}`}></div>
        
        {/* Orbiting Status Dot */}
        <div className="absolute -inset-0.5 z-20 animate-[spin_6s_linear_infinite]">
          <div className={`absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 border-gray-50 dark:border-dark-secondary ${styles.dot} ${isAnimating ? 'animate-pulse' : ''}`}></div>
        </div>
      </div>

      {/* Info & Status Text */}
      <div className="flex flex-col justify-center overflow-hidden">
        <h3 className="text-xs font-bold text-gray-900 dark:text-gray-100 tracking-wide mb-0.5">
          LAWGic Core
        </h3>
        <div className="flex items-center gap-1.5">
           <span className="text-[11px] font-medium text-gray-500 dark:text-gray-400 capitalize truncate">
             {status}
           </span>
           {isSpeaking && (
             <div className="flex items-end gap-0.5 h-2.5 ml-1">
               <div className={`w-0.5 h-full ${styles.dot} animate-[bounce_1s_infinite_0ms]`}></div>
               <div className={`w-0.5 h-[60%] ${styles.dot} animate-[bounce_1s_infinite_200ms]`}></div>
               <div className={`w-0.5 h-[80%] ${styles.dot} animate-[bounce_1s_infinite_400ms]`}></div>
             </div>
           )}
        </div>
      </div>
      
      <style>{`
        @keyframes scan {
          0% { transform: translateY(-100%); }
          50% { transform: translateY(100%); }
          100% { transform: translateY(-100%); }
        }
      `}</style>
    </div>
  );
}
