'use client';

import React, { Suspense, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import GeneratorWrapper from '@/components/generator/generator-wrapper';
import GeneratorInput from '@/components/generator/generator-input';
import { RenderMessage } from '@/components/generator/render-message';
import { GradientBlob } from '@/components/gradient-blob';
import { useChatContext } from '@/context/ChatContext';

function ChatInterface() {
  const { 
    inputValue, 
    setInputValue, 
    processMessage, 
    isTyping, 
    userSettings,
    messages
  } = useChatContext();

  const searchParams = useSearchParams();
  const router = useRouter();
  const hasTriggeredRef = React.useRef(false);

  useEffect(() => {
    // Lock body and html scroll to prevent mobile browser bounce and layout shift
    const originalHtmlOverflow = document.documentElement.style.overflow;
    const originalHtmlHeight = document.documentElement.style.height;
    const originalBodyOverflow = document.body.style.overflow;
    const originalBodyHeight = document.body.style.height;

    document.documentElement.style.overflow = 'hidden';
    document.documentElement.style.height = '100%';
    document.body.style.overflow = 'hidden';
    document.body.style.height = '100%';

    return () => {
      document.documentElement.style.overflow = originalHtmlOverflow;
      document.documentElement.style.height = originalHtmlHeight;
      document.body.style.overflow = originalBodyOverflow;
      document.body.style.height = originalBodyHeight;
    };
  }, []);

  useEffect(() => {
    // Wait until ChatContext has finished loading history/welcome message
    if (messages.length === 0) return;

    const prompt = searchParams.get('prompt');
    if (prompt && !hasTriggeredRef.current && !isTyping) {
      hasTriggeredRef.current = true;
      processMessage(prompt);
      // Remove prompt from URL to prevent re-triggering on refresh
      router.replace('/chat');
    }
  }, [searchParams, messages.length, isTyping, processMessage, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isTyping) return;
    
    // Send message using custom backend process
    processMessage(inputValue);
    setInputValue("");
  };

  return (
    <GeneratorWrapper>
      <div className={`flex flex-col flex-1 w-full h-full min-h-0 ${userSettings?.fontSize === 'large' ? 'text-xl' : userSettings?.fontSize === 'small' ? 'text-sm' : 'text-base'}`}>
        <RenderMessage messages={messages} isThinking={isTyping} />

        <div className="w-full relative mt-auto">
          {/* Background Glow - Now completely unconstrained by max-w */}
          <div className="absolute bottom-0 w-full flex justify-center pointer-events-none">
            {userSettings?.animationsEnabled ? (
              <GradientBlob className="transition-all duration-700 ease-in-out hover:scale-105" />
            ) : (
              <GradientBlob />
            )}
          </div>

          <div className="px-5 md:px-12 w-full max-w-4xl mx-auto relative z-20 pb-4">
            <form onSubmit={handleSubmit} className="mb-2">
              <GeneratorInput
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
            </form>
            <p className="text-[11px] text-center text-gray-400 dark:text-gray-500 max-w-2xl mx-auto leading-relaxed px-2">
              Disclaimer: LAWgic is an AI tool and not professional legal advice. Consult a qualified legal practitioner before making decisions.
            </p>
          </div>
        </div>
      </div>
    </GeneratorWrapper>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}>
      <ChatInterface />
    </Suspense>
  );
}
