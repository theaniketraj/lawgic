import React from "react";

export function SkeletonLoader({
  type = "chat",
  count = 3,
}: Readonly<{
  type?: "chat" | "message" | "stats" | "template";
  count?: number;
}>) {
  if (type === "chat") {
    return (
      <div className="space-y-2">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-3 p-3 rounded-xl bg-gray-50/80 dark:bg-white/5 animate-pulse"
          >
            <div className="w-9 h-9 rounded-full bg-gray-200 dark:bg-white/10 shrink-0" />
            <div className="space-y-2.5 flex-1">
              <div className="h-2.5 bg-gray-200 dark:bg-white/10 rounded-full w-2/3" />
              <div className="h-2 bg-gray-200 dark:bg-white/10 rounded-full w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === "message") {
    return (
      <div className="space-y-4">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col gap-2 p-4 rounded-2xl bg-gray-50 dark:bg-white/5 animate-pulse"
          >
            <div className="h-3 bg-gray-200 dark:bg-white/10 rounded-full w-3/4" />
            <div className="h-3 bg-gray-200 dark:bg-white/10 rounded-full w-full" />
            <div className="h-3 bg-gray-200 dark:bg-white/10 rounded-full w-5/6" />
          </div>
        ))}
      </div>
    );
  }

  return null;
}
