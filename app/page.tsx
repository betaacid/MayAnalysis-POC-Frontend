"use client";
import { Thread } from "@/components/assistant-ui/thread";
import { ThreadList } from "@/components/assistant-ui/thread-list";

export default function Home() {
  return (
    <main className="h-dvh grid grid-cols-[200px_1fr] gap-x-2 px-4 py-4">
      <ThreadList />
      <Thread />
    </main>
  );
}
