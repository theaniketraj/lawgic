'use client';

import GeneratorInput from '@/components/generator/generator-input';
import { RenderMessage } from '@/components/generator/render-message';
import { GradientBlob } from '@/components/gradient-blob';
import { useChat } from '@ai-sdk/react';
import { createIdGenerator } from 'ai';
import { useState } from 'react';

export default function ClientPage() {
  const [isThinking, setIsThinking] = useState(false);

  const [input, setInput] = useState('');

  const chatHandler = useChat({
    generateId: createIdGenerator({ prefix: 'msgc' }),
    onFinish: () => setIsThinking(false),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input) return;
    setIsThinking(true);
    chatHandler.sendMessage({ text: input });
    setInput('');
  }

  return (
    <div className="contents">
      <RenderMessage messages={chatHandler.messages} isThinking={isThinking} />

      <div className="px-5 md:px-12">
        <form onSubmit={handleSubmit}>
          <GeneratorInput
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </form>

        <GradientBlob />
      </div>
    </div>
  );
}
