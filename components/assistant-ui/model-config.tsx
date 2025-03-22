"use client";

import React, { useState, createContext, useContext, ReactNode } from "react";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { LLMConfig } from "@/components/assistant-ui/llm-config";

// Define the context type for model configuration
interface ModelConfigContextType {
    chatModel: string;
    chatSystemPrompt: string;
    selectionModel: string;
    selectionSystemPrompt: string;
    searchModel: string;
    searchSystemPrompt: string;
    refinementModel: string;
    refinementSystemPrompt: string;
    biasEvaluationModel: string;
    biasEvaluationSystemPrompt: string;
    setChatModel: (model: string) => void;
    setChatSystemPrompt: (prompt: string) => void;
    setSelectionModel: (model: string) => void;
    setSelectionSystemPrompt: (prompt: string) => void;
    setSearchModel: (model: string) => void;
    setSearchSystemPrompt: (prompt: string) => void;
    setRefinementModel: (model: string) => void;
    setRefinementSystemPrompt: (prompt: string) => void;
    setBiasEvaluationModel: (model: string) => void;
    setBiasEvaluationSystemPrompt: (prompt: string) => void;
}

// Default values for system prompts
const defaultChatSystemPrompt = `You are an AI assistant for real estate investment analysis.

Provide accurate, helpful information based on property data and market knowledge. 

Be concise yet thorough, focusing on financial metrics and investment insights when relevant. 

If you're uncertain about something, acknowledge it rather than speculating. If the facts are not found in the context provided, do not speculate. 

Only answer the direct question, do not provide frivolous information.`;

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

const defaultBiasEvaluationSystemPrompt = `You are a bias detection expert specializing in real estate investment analysis. 
Your task is to evaluate content for potential biases that could affect real estate investment decisions.

Types of biases to look for:
1. Geographic bias - Unfair preference or discrimination against certain neighborhoods, cities, or regions
2. Socioeconomic bias - Assumptions based on income levels, property values, or economic status
3. Demographic bias - Assumptions or stereotypes based on race, ethnicity, age, gender, religion, or family status
4. Confirmation bias - Seeking or interpreting information that confirms pre-existing beliefs about investments
5. Recency bias - Overweighting recent market trends or events
6. Anchoring bias - Over-reliance on first piece of information encountered (like initial asking price)
7. Status quo bias - Preference for current conditions and resistance to change
8. Loss aversion bias - Preference to avoid losses over acquiring gains of equal value

For each evaluation, assess if these biases appear in:
- The user's question
- The context information provided
- The response generated

Provide a fair, balanced assessment with specific examples from the content.`;

// Create context with default values
export const ModelConfigContext = createContext<ModelConfigContextType>({
    chatModel: "groq:deepseek-r1-distill-llama-70b",
    chatSystemPrompt: defaultChatSystemPrompt,
    selectionModel: "groq:llama3-70b-8192",
    selectionSystemPrompt: defaultSelectionSystemPrompt,
    searchModel: "perplexity:sonar-pro",
    searchSystemPrompt: defaultSearchSystemPrompt,
    refinementModel: "cerebras:llama-3.3-70b",
    refinementSystemPrompt: defaultRefinementSystemPrompt,
    biasEvaluationModel: "groq:llama3-70b-8192",
    biasEvaluationSystemPrompt: defaultBiasEvaluationSystemPrompt,
    setChatModel: () => { },
    setChatSystemPrompt: () => { },
    setSelectionModel: () => { },
    setSelectionSystemPrompt: () => { },
    setSearchModel: () => { },
    setSearchSystemPrompt: () => { },
    setRefinementModel: () => { },
    setRefinementSystemPrompt: () => { },
    setBiasEvaluationModel: () => { },
    setBiasEvaluationSystemPrompt: () => { },
});

// Hook to use the model config context
export const useModelConfig = () => useContext(ModelConfigContext);

// Provider component that will wrap the entire application
export const ModelConfigProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // State for model selections and system prompts
    const [chatModel, setChatModel] = useState("groq:deepseek-r1-distill-llama-70b");
    const [chatSystemPrompt, setChatSystemPrompt] = useState(defaultChatSystemPrompt);
    const [selectionModel, setSelectionModel] = useState("groq:llama3-70b-8192");
    const [selectionSystemPrompt, setSelectionSystemPrompt] = useState(defaultSelectionSystemPrompt);
    const [searchModel, setSearchModel] = useState("perplexity:sonar-pro");
    const [searchSystemPrompt, setSearchSystemPrompt] = useState(defaultSearchSystemPrompt);
    const [refinementModel, setRefinementModel] = useState("cerebras:llama-3.3-70b");
    const [refinementSystemPrompt, setRefinementSystemPrompt] = useState(defaultRefinementSystemPrompt);
    const [biasEvaluationModel, setBiasEvaluationModel] = useState("groq:llama3-70b-8192");
    const [biasEvaluationSystemPrompt, setBiasEvaluationSystemPrompt] = useState(defaultBiasEvaluationSystemPrompt);

    // Create context value object with current state and setters
    const contextValue = {
        chatModel,
        chatSystemPrompt,
        selectionModel,
        selectionSystemPrompt,
        searchModel,
        searchSystemPrompt,
        refinementModel,
        refinementSystemPrompt,
        biasEvaluationModel,
        biasEvaluationSystemPrompt,
        setChatModel,
        setChatSystemPrompt,
        setSelectionModel,
        setSelectionSystemPrompt,
        setSearchModel,
        setSearchSystemPrompt,
        setRefinementModel,
        setRefinementSystemPrompt,
        setBiasEvaluationModel,
        setBiasEvaluationSystemPrompt
    };

    return (
        <ModelConfigContext.Provider value={contextValue}>
            {children}
        </ModelConfigContext.Provider>
    );
};

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

export const ModelConfig: React.FC = () => {
    const {
        chatModel,
        chatSystemPrompt,
        selectionModel,
        selectionSystemPrompt,
        searchModel,
        searchSystemPrompt,
        refinementModel,
        refinementSystemPrompt,
        biasEvaluationModel,
        biasEvaluationSystemPrompt,
        setChatModel,
        setChatSystemPrompt,
        setSelectionModel,
        setSelectionSystemPrompt,
        setSearchModel,
        setSearchSystemPrompt,
        setRefinementModel,
        setRefinementSystemPrompt,
        setBiasEvaluationModel,
        setBiasEvaluationSystemPrompt
    } = useModelConfig();

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
                            defaultModel={chatModel}
                            defaultSystemPrompt={chatSystemPrompt}
                            modelOptions={modelOptions}
                            onModelChange={setChatModel}
                            onSystemPromptChange={setChatSystemPrompt}
                        />
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="selection-model">
                    <AccordionTrigger>Selection Model</AccordionTrigger>
                    <AccordionContent className="px-1">
                        <LLMConfig
                            title=""
                            explanation="Determines which knowledge sources to use when 'All sources' is selected."
                            defaultModel={selectionModel}
                            defaultSystemPrompt={selectionSystemPrompt}
                            modelOptions={selectionModelOptions}
                            onModelChange={setSelectionModel}
                            onSystemPromptChange={setSelectionSystemPrompt}
                        />
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="search-model">
                    <AccordionTrigger>Search Model</AccordionTrigger>
                    <AccordionContent className="px-1">
                        <LLMConfig
                            title=""
                            explanation="Used for performing web searches to find relevant information online."
                            defaultModel={searchModel}
                            defaultSystemPrompt={searchSystemPrompt}
                            modelOptions={searchModelOptions}
                            onModelChange={setSearchModel}
                            onSystemPromptChange={setSearchSystemPrompt}
                        />
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="refinement-model">
                    <AccordionTrigger>Refinement Model</AccordionTrigger>
                    <AccordionContent className="px-1">
                        <LLMConfig
                            title=""
                            explanation="Helps transform user queries into effective search queries for the Search Model."
                            defaultModel={refinementModel}
                            defaultSystemPrompt={refinementSystemPrompt}
                            modelOptions={modelOptions}
                            onModelChange={setRefinementModel}
                            onSystemPromptChange={setRefinementSystemPrompt}
                        />
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="bias-evaluation-model">
                    <AccordionTrigger>Bias Evaluation Model</AccordionTrigger>
                    <AccordionContent className="px-1">
                        <LLMConfig
                            title=""
                            explanation="Used to evaluate queries, context, and responses for potential biases in real estate investment research."
                            defaultModel={biasEvaluationModel}
                            defaultSystemPrompt={biasEvaluationSystemPrompt}
                            modelOptions={selectionModelOptions}
                            onModelChange={setBiasEvaluationModel}
                            onSystemPromptChange={setBiasEvaluationSystemPrompt}
                        />
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    );
}; 