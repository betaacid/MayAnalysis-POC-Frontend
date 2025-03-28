"use client";
import { Thread } from "@/components/assistant-ui/thread";
import { ModelConfig } from "@/components/assistant-ui/model-config";
import { LoginForm } from "@/components/auth/login-form";
import { useAuth } from "@/hooks/use-auth";

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading state
  if (isLoading) {
    return (
      <div className="h-dvh flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  // Show login if not authenticated
  if (!isAuthenticated) {
    return <LoginForm />;
  }

  // Show main application if authenticated
  return (
    <main className="h-dvh grid grid-cols-[320px_1fr] gap-x-4 px-4 py-4">
      <ModelConfig />
      <Thread />
    </main>
  );
}
