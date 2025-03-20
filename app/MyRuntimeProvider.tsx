"use client";

import type { ReactNode } from "react";
import {
    AssistantRuntimeProvider,
    useLocalRuntime,
    type ChatModelAdapter,
} from "@assistant-ui/react";

// The FastAPI backend endpoint URL
const BACKEND_API_URL = "http://localhost:8000/chat/property/default/message";

// Helper function to extract text content from any message format
const extractTextContent = (content: any): string => {
    try {
        // If it's a string, return it directly
        if (typeof content === "string") {
            return content;
        }

        // If it's an array, look for the first text part
        if (Array.isArray(content)) {
            for (const part of content) {
                if (part && typeof part === "object" && part.type === "text" && typeof part.text === "string") {
                    return part.text;
                }
            }
        }

        // If it's an object with text, return that
        if (content && typeof content === "object") {
            if (content.type === "text" && typeof content.text === "string") {
                return content.text;
            }
        }

        // Default: stringify the content
        return JSON.stringify(content);
    } catch (e) {
        console.error("Error extracting text content:", e);
        return String(content);
    }
};

const MyModelAdapter: ChatModelAdapter = {
    async run({ messages, abortSignal }) {
        console.log("Sending request to backend:", messages);

        // Get the latest message from the user
        const latestMessage = messages[messages.length - 1];
        if (!latestMessage || latestMessage.role !== "user") {
            throw new Error("No user message found");
        }

        // Extract message content as string
        const messageContent = extractTextContent(latestMessage.content);

        // Format the history for the backend
        const history = messages.slice(0, -1).map(msg => ({
            content: extractTextContent(msg.content),
            is_user: msg.role === "user"
        }));

        // Call the actual backend endpoint
        const result = await fetch(BACKEND_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            // Format the request according to our FastAPI endpoint
            body: JSON.stringify({
                message: messageContent,
                history: history,
                // Minimal required fields for the backend
                chat_model: "openai:gpt-4o",
                knowledge_sources: ["all"],
            }),
            signal: abortSignal,
        });

        console.log("API response status:", result.status);

        if (!result.ok) {
            const errorText = await result.text().catch(() => "Unknown error");
            console.error("API request failed:", errorText);
            throw new Error(`API request failed with status: ${result.status} - ${errorText}`);
        }

        // Process the response
        const data = await result.json();
        console.log("API response data:", data);

        // Extract just the message from the response
        return {
            content: [
                {
                    type: "text",
                    text: data.message || "Sorry, there was no response from the API.",
                },
            ],
        };
    },
};

export function MyRuntimeProvider({
    children,
}: Readonly<{
    children: ReactNode;
}>) {
    const runtime = useLocalRuntime(MyModelAdapter);

    return (
        <AssistantRuntimeProvider runtime={runtime}>
            {children}
        </AssistantRuntimeProvider>
    );
} 