"use client";
import { Thread } from "@/components/assistant-ui/thread";
import { ModelConfig } from "@/components/assistant-ui/model-config";

export default function Home() {
  return (
    <main className="h-dvh grid grid-cols-[320px_1fr] gap-x-4 px-4 py-4">
      <ModelConfig />
      <Thread />
    </main>
  );
}
