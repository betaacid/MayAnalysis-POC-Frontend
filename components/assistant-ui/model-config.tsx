import React from "react";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { LLMConfig } from "@/components/assistant-ui/llm-config";

export const ModelConfig: React.FC = () => {
    // Model options with friendly names and their API values
    const modelOptions = [
        // OpenAI models
        { label: "OpenAI GPT-4o", value: "openai:gpt-4o" },
        { label: "OpenAI GPT-4o Mini", value: "openai:gpt-4o-mini" },
        { label: "OpenAI GPT-4 Turbo", value: "openai:gpt-4-turbo" },

        // Groq models
        { label: "Groq Deepseek", value: "groq:deepseek-r1-distill-llama-70b" },
        { label: "Groq Llama 3 (70B)", value: "groq:llama3-70b-8192" },
        { label: "Groq Mixtral 8x7B", value: "groq:mixtral-8x7b" },

        // Cerebras models
        { label: "Cerebras Llama 3.3 (70B)", value: "cerebras:llama-3.3-70b" }
    ];

    // Limited model options for the Selection Model
    const selectionModelOptions = [
        // OpenAI models
        { label: "OpenAI GPT-4o", value: "openai:gpt-4o" },
        { label: "OpenAI GPT-4o Mini", value: "openai:gpt-4o-mini" },
        { label: "OpenAI GPT-4 Turbo", value: "openai:gpt-4-turbo" },

        // Only Llama 3 from Groq
        { label: "Groq Llama 3 (70B)", value: "groq:llama3-70b-8192" }
    ];

    // Specialized options for the Search Model
    const searchModelOptions = [
        // OpenAI search-specific model
        { label: "OpenAI GPT-4o Search Preview", value: "openai:gpt-4o-search-preview" },

        // Perplexity models specialized for search/research
        { label: "Perplexity Sonar", value: "perplexity:sonar" },
        { label: "Perplexity Sonar Pro", value: "perplexity:sonar-pro" },
        { label: "Perplexity Sonar Reasoning", value: "perplexity:sonar-reasoning" },
        { label: "Perplexity Sonar Reasoning Pro", value: "perplexity:sonar-reasoning-pro" },
        { label: "Perplexity Sonar Deep Research", value: "perplexity:sonar-deep-research" }
    ];

    // Default values taken directly from system_prompts.py, with added linebreaks for readability
    const defaultChatSystemPrompt = `You are an AI assistant for real estate investment analysis.

Provide accurate, helpful information based on property data and market knowledge. 

Be concise yet thorough, focusing on financial metrics and investment insights when relevant. 

If you're uncertain about something, acknowledge it rather than speculating.`;

    const defaultSelectionSystemPrompt = `You are a specialized AI designed to analyze user queries and determine which knowledge sources would be most relevant.

Your task is to select the appropriate knowledge sources based on the content of the query.

You must return your response in valid JSON format according to the specified schema.

Be precise and thoughtful in your selection, choosing only sources that are likely to contain information relevant to the query.`;

    const defaultSearchSystemPrompt = `You are a research specialist focused on real estate market information. 

Your task is to search for and synthesize the most relevant, accurate, and up-to-date information.

Focus on facts and data related to real estate markets, investment trends, property metrics, and economic factors.

Organize information clearly, prioritize recent information, and include specific data points when available.

Cite sources when possible and maintain an objective, factual tone throughout your response.`;

    const defaultRefinementSystemPrompt = `You are an expert at refining search queries to get the most relevant real estate information.

Your task is to convert user questions into effective search queries that will yield the most useful results.

Focus on extracting key concepts, adding relevant real estate terminology, and including specific location details when available.

Make queries precise, clear, and search-engine friendly. Remove unnecessary words and conversational elements.

Return ONLY the refined query without any explanation or additional text.`;

    return (
        <div className="flex flex-col space-y-2 w-full px-4 overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Model Configuration</h2>

            <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="chat-model">
                    <AccordionTrigger>Chat Model</AccordionTrigger>
                    <AccordionContent className="px-1">
                        <LLMConfig
                            title=""
                            explanation="The primary model used for generating responses to user messages."
                            defaultModel="groq:deepseek-r1-distill-llama-70b"
                            defaultSystemPrompt={defaultChatSystemPrompt}
                            modelOptions={modelOptions}
                        />
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="selection-model">
                    <AccordionTrigger>Selection Model</AccordionTrigger>
                    <AccordionContent className="px-1">
                        <LLMConfig
                            title=""
                            explanation="Determines which knowledge sources to use when 'All sources' is selected."
                            defaultModel="groq:llama3-70b-8192"
                            defaultSystemPrompt={defaultSelectionSystemPrompt}
                            modelOptions={selectionModelOptions}
                        />
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="search-model">
                    <AccordionTrigger>Search Model</AccordionTrigger>
                    <AccordionContent className="px-1">
                        <LLMConfig
                            title=""
                            explanation="Used for performing web searches to find relevant information online."
                            defaultModel="perplexity:sonar-pro"
                            defaultSystemPrompt={defaultSearchSystemPrompt}
                            modelOptions={searchModelOptions}
                        />
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="refinement-model">
                    <AccordionTrigger>Refinement Model</AccordionTrigger>
                    <AccordionContent className="px-1">
                        <LLMConfig
                            title=""
                            explanation="Helps transform user queries into effective search queries for the Search Model."
                            defaultModel="cerebras:llama-3.3-70b"
                            defaultSystemPrompt={defaultRefinementSystemPrompt}
                            modelOptions={modelOptions}
                        />
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    );
}; 