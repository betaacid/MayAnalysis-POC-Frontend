"use client";

import type { ReactNode } from "react";
import {
    AssistantRuntimeProvider,
    useLocalRuntime,
    type ChatModelAdapter,
} from "@assistant-ui/react";
import { extractTextContent } from "@/lib/types/message";
import { useWebSearch } from "@/components/assistant-ui/web-search-context";
import { useKnowledgeSources } from "@/components/assistant-ui/knowledge-sources-context";
import { useModelConfig } from "@/components/assistant-ui/model-config";
import { KnowledgeSourceDetail, ChatApiResponse } from "@/lib/types/knowledge-source";
import { createContext, useContext, useState } from "react";

// Get API base URL from environment variables
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
// Construct the full endpoint URL
const BACKEND_API_URL = `${API_BASE_URL}/chat/property/default/message`;

// Create a context for knowledge source details
interface KnowledgeSourceDetailsContextType {
    details: KnowledgeSourceDetail[] | null;
    setDetails: (details: KnowledgeSourceDetail[] | null) => void;
}

const KnowledgeSourceDetailsContext = createContext<KnowledgeSourceDetailsContextType | undefined>(undefined);

// Hook to use the knowledge source details context
export const useKnowledgeSourceDetails = () => {
    const context = useContext(KnowledgeSourceDetailsContext);
    if (context === undefined) {
        throw new Error('useKnowledgeSourceDetails must be used within a KnowledgeSourceDetailsProvider');
    }
    return context;
};

// Create a custom runtime adapter that integrates with our sources panel
export function MyRuntimeProvider({ children }: { children: ReactNode }) {
    const { includeWebSearch } = useWebSearch();
    const { selectedSources } = useKnowledgeSources();
    const modelConfig = useModelConfig();
    const [details, setDetails] = useState<KnowledgeSourceDetail[] | null>(null);

    console.log("[MyRuntimeProvider] Initialized with model config:", modelConfig);

    const myModelAdapter: ChatModelAdapter = {
        async run({ messages, abortSignal }) {
            console.log("Sending request to backend:", messages);
            console.log("Using model configurations:", JSON.stringify(modelConfig, null, 2));

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

            // Prepare knowledge sources for the request
            const knowledgeSources = selectedSources.includes("all")
                ? ["all"]
                : [...selectedSources];

            // Create request body with all model configurations
            const requestBody = {
                message: messageContent,
                history: history,
                // Use configured chat model instead of hardcoded value
                chat_model: modelConfig.chatModel || "openai:gpt-4o",
                // Include system prompts
                chat_system_prompt: modelConfig.chatSystemPrompt,
                selection_model: modelConfig.selectionModel,
                selection_system_prompt: modelConfig.selectionSystemPrompt,
                search_model: modelConfig.searchModel,
                search_system_prompt: modelConfig.searchSystemPrompt,
                refinement_model: modelConfig.refinementModel,
                refinement_system_prompt: modelConfig.refinementSystemPrompt,
                // Other required fields
                knowledge_sources: knowledgeSources,
                exclude_web: !includeWebSearch,
            };

            console.log("Full API request body:", JSON.stringify(requestBody, null, 2));

            // Console.log specific fields to help with debugging
            console.log("Chat model:", requestBody.chat_model);
            console.log("Chat system prompt:", requestBody.chat_system_prompt);
            console.log("Selection model:", requestBody.selection_model);
            console.log("Selection system prompt:", requestBody.selection_system_prompt);
            console.log("Search model:", requestBody.search_model);
            console.log("Search system prompt:", requestBody.search_system_prompt);
            console.log("Refinement model:", requestBody.refinement_model);
            console.log("Refinement system prompt:", requestBody.refinement_system_prompt);

            // Call the actual backend endpoint
            const result = await fetch(BACKEND_API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                // Format the request according to our FastAPI endpoint
                body: JSON.stringify(requestBody),
                signal: abortSignal,
            });

            console.log("API response status:", result.status);

            if (!result.ok) {
                const errorText = await result.text().catch(() => "Unknown error");
                console.error("API request failed:", errorText);
                throw new Error(`API request failed with status: ${result.status} - ${errorText}`);
            }

            // Process the response
            const data = await result.json() as ChatApiResponse;
            console.log("API response data:", data);

            // Store the knowledge source details for later use in the Sources panel
            setDetails(data.knowledge_source_details);
            console.log("Knowledge source details:", data.knowledge_source_details);

            // Format the response, combining regular message with thinking content if available
            let formattedContent = data.message || "Sorry, there was no response from the API.";

            // Add thinking content with pure markdown formatting (no HTML tags)
            if (data.thinking) {
                // Use blockquote (>) to make text appear smaller, and keep it italic with asterisks
                const thinkingLines = data.thinking.replace(/\*/g, '\\*').split('\n');
                const formattedThinking = thinkingLines.map((line: string) => `> *${line}*`).join('\n');

                formattedContent += `\n\n---\n\n#### 💭 Thinking Process\n\n${formattedThinking}`;
            }

            return {
                content: [
                    {
                        type: "text",
                        text: formattedContent
                    }
                ],
            };
        },
    };

    const runtime = useLocalRuntime(myModelAdapter);

    return (
        <KnowledgeSourceDetailsContext.Provider value={{ details, setDetails }}>
            <AssistantRuntimeProvider runtime={runtime}>
                {children}
            </AssistantRuntimeProvider>
        </KnowledgeSourceDetailsContext.Provider>
    );
} 