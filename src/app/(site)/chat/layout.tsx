import type { Metadata } from "next";
import type { PropsWithChildren } from "react";
import { ChatProvider } from "@/context/ChatContext";

export const metadata: Metadata = {
  title: "LAWGic Assistant",
};

export default function Layout({ children }: Readonly<PropsWithChildren>) {
  return (
    <main className="flex flex-col flex-1 w-full bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col flex-1 w-full">
        <div className="relative flex flex-col flex-1 w-full isolate h-[calc(100vh-73px)]">
          <ChatProvider>{children}</ChatProvider>
        </div>
      </div>
      <style>{`
        footer { display: none !important; }
      `}</style>
    </main>
  );
}
