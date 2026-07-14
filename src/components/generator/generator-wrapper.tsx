"use client";

import GeneratorSidebar from "./sidebar/generator-sidebar";

export default function GeneratorWrapper({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="fixed inset-0 flex flex-col overflow-hidden">
      <div className="isolate relative flex flex-1 w-full bg-gray-50 dark:bg-dark-secondary">
        <GeneratorSidebar />

        <div className="relative flex flex-col flex-1 min-w-0 h-full">
          {children}
        </div>
      </div>
    </div>
  );
}
