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
const BACKEND_API_URL = `${API_BASE_URL}/chat/property/123/message`;

// Create a context for knowledge source details
interface KnowledgeSourceDetailsContextType {
    details: KnowledgeSourceDetail[] | null;
    setDetails: (details: KnowledgeSourceDetail[] | null) => void;
    thinking: string | null;
    setThinking: (thinking: string | null) => void;
    biasEvaluation: ChatApiResponse['bias_evaluation'];
    setBiasEvaluation: (biasEvaluation: ChatApiResponse['bias_evaluation']) => void;
    refinedSearchQuery: string | null;
    setRefinedSearchQuery: (refinedSearchQuery: string | null) => void;
    originalSearchQuery: string | null;
    setOriginalSearchQuery: (originalSearchQuery: string | null) => void;
    searchPrompt: string | null;
    setSearchPrompt: (searchPrompt: string | null) => void;
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
    // Hard-code useFullText to false instead of getting it from modelConfig
    const useFullText = false;
    const [details, setDetails] = useState<KnowledgeSourceDetail[] | null>(null);
    const [thinking, setThinking] = useState<string | null>(null);
    const [biasEvaluation, setBiasEvaluation] = useState<ChatApiResponse['bias_evaluation']>(null);
    const [refinedSearchQuery, setRefinedSearchQuery] = useState<string | null>(null);
    const [originalSearchQuery, setOriginalSearchQuery] = useState<string | null>(null);
    const [searchPrompt, setSearchPrompt] = useState<string | null>(null);

    console.log("[MyRuntimeProvider] Initialized with model config:", modelConfig);

    const myModelAdapter: ChatModelAdapter = {
        async run({ messages, abortSignal }) {
            console.log("Sending request to backend:", messages);
            console.log("Using model configurations:", JSON.stringify(modelConfig, null, 2));
            console.log("Using full text:", useFullText);

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
                bias_evaluation_model: modelConfig.biasEvaluationModel,
                bias_evaluation_system_prompt: modelConfig.biasEvaluationSystemPrompt,
                // Other required fields
                knowledge_sources: knowledgeSources,
                exclude_web: !includeWebSearch,
                // Add the use_full_text parameter
                use_full_text: useFullText,
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
            console.log("Bias evaluation model:", requestBody.bias_evaluation_model);
            console.log("Bias evaluation system prompt:", requestBody.bias_evaluation_system_prompt);

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

            // Store the thinking content
            setThinking(data.thinking || null);
            console.log("Thinking content:", data.thinking);

            // Store the bias evaluation results
            setBiasEvaluation(data.bias_evaluation || null);
            console.log("Bias evaluation:", data.bias_evaluation);

            // Store the refined search query
            setRefinedSearchQuery(data.refined_search_query || null);
            console.log("Refined search query:", data.refined_search_query);

            // Store the original search query
            setOriginalSearchQuery(data.original_search_query || null);
            console.log("Original search query:", data.original_search_query);

            // Store the search prompt
            setSearchPrompt(data.search_prompt || null);
            console.log("Search prompt:", data.search_prompt);

            // Format the response - only use the regular message
            const formattedContent = data.message || "Sorry, there was no response from the API.";

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
        <KnowledgeSourceDetailsContext.Provider value={{ details, setDetails, thinking, setThinking, biasEvaluation, setBiasEvaluation, refinedSearchQuery, setRefinedSearchQuery, originalSearchQuery, setOriginalSearchQuery, searchPrompt, setSearchPrompt }}>
            <AssistantRuntimeProvider runtime={runtime}>
                {children}
            </AssistantRuntimeProvider>
        </KnowledgeSourceDetailsContext.Provider>
    );
} 