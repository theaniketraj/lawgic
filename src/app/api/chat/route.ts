import { getMostRecentUserMessage } from '@/lib/utils';

export async function POST(req: Request) {
  try {
    const { messages }: { messages: any[] } = await req.json();

    const userMessage = getMostRecentUserMessage(messages);

    if (!userMessage) {
      return new Response('No user message found', {
        status: 404,
      });
    }

    const history: { query: string; answer: string }[] = [];
    let currentQuery = null;

    for (const msg of messages) {
      if (msg.role === 'user') {
        currentQuery = msg.content;
      } else if (msg.role === 'assistant' && currentQuery) {
        history.push({ query: currentQuery, answer: msg.content });
        currentQuery = null;
      }
    }
    history.pop();

    const res = await fetch("http://localhost:5000/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userMessage.content, history }),
    });

    if (!res.ok) {
      throw new Error(`Backend error ${res.status}`);
    }

    const data = await res.json();
    const chunk = JSON.stringify(data.response);
    
    return new Response(`0:${chunk}\n`, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'x-vercel-ai-data-stream': 'v1'
      }
    });
  } catch (error) {
    console.error(error);
    return new Response('Error communicating with backend', { status: 500 });
  }
}
