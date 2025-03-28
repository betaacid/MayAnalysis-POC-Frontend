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
    chat_thinking: string | null;
    setChatThinking: (thinking: string | null) => void;
    search_thinking: string | null;
    setSearchThinking: (thinking: string | null) => void;
    biasEvaluation: ChatApiResponse['bias_evaluation'] | null;
    setBiasEvaluation: (biasEvaluation: ChatApiResponse['bias_evaluation'] | null) => void;
    refinedSearchQuery: string | null;
    setRefinedSearchQuery: (refinedSearchQuery: string | null) => void;
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
    const [chat_thinking, setChatThinking] = useState<string | null>(null);
    const [search_thinking, setSearchThinking] = useState<string | null>(null);
    const [biasEvaluation, setBiasEvaluation] = useState<ChatApiResponse['bias_evaluation'] | null>(null);
    const [refinedSearchQuery, setRefinedSearchQuery] = useState<string | null>(null);
    const [searchPrompt, setSearchPrompt] = useState<string | null>(null);


    const myModelAdapter: ChatModelAdapter = {
        async run({ messages, abortSignal }) {


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

            if (!result.ok) {
                const errorText = await result.text().catch(() => "Unknown error");
                console.error("API request failed:", errorText);
                throw new Error(`API request failed with status: ${result.status} - ${errorText}`);
            }

            // Process the response
            const data = await result.json() as ChatApiResponse;

            // Variables to store the processed knowledge source details and thinking content
            let processedDetails = data.knowledge_source_details || null;
            const chatThinkingContent = data.chat_thinking || null;
            let searchThinkingContent = data.search_thinking || null;

            // Process web search sources to extract thinking if needed
            if (processedDetails) {
                // Create a new array to avoid mutating the original data
                processedDetails = processedDetails.map(source => {
                    // Only process web search sources
                    if (source.source_enum === 'web_search' && source.text) {
                        // Check for <think> tags
                        const thinkMatch = source.text.match(/<think>([\s\S]*?)<\/think>/);
                        if (thinkMatch && thinkMatch[1]) {
                            // Extract thinking content if not already provided
                            if (!searchThinkingContent) {
                                searchThinkingContent = thinkMatch[1].trim();
                                console.log('Extracted search thinking from web_search:', searchThinkingContent);
                            }

                            // Remove the <think> tags from the displayed text
                            const cleanedText = source.text.replace(/<think>[\s\S]*?<\/think>/, '').trim();
                            return { ...source, text: cleanedText };
                        }
                    }
                    return source;
                });
            }

            // Store the processed data
            setDetails(processedDetails);
            setChatThinking(chatThinkingContent);
            setSearchThinking(searchThinkingContent);

            // Log search thinking for now
            if (searchThinkingContent) {
                console.log('Search thinking:', searchThinkingContent);
            }

            // Store the bias evaluation results
            setBiasEvaluation(data.bias_evaluation || null);

            // Store the refined search query
            setRefinedSearchQuery(data.refined_search_query || null);

            // Store the search prompt
            setSearchPrompt(data.search_prompt || null);

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
        <KnowledgeSourceDetailsContext.Provider value={{
            details,
            setDetails,
            chat_thinking,
            setChatThinking,
            search_thinking,
            setSearchThinking,
            biasEvaluation,
            setBiasEvaluation,
            refinedSearchQuery,
            setRefinedSearchQuery,
            searchPrompt,
            setSearchPrompt
        }}>
            <AssistantRuntimeProvider runtime={runtime}>
                {children}
            </AssistantRuntimeProvider>
        </KnowledgeSourceDetailsContext.Provider>
    );
} 