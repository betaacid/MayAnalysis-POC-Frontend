"use client";

import React, { useState, createContext, useContext, type ReactNode } from "react";
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
    guardrailsModel: string;
    guardrailsSystemPrompt: string;
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
    setGuardrailsModel: (model: string) => void;
    setGuardrailsSystemPrompt: (prompt: string) => void;
}

// Default values for system prompts
const defaultChatSystemPrompt = `You are an AI assistant for real estate investment analysis.

Provide accurate, helpful information based on property data and market knowledge. 

When referencing information from an offering memorandum, treat this data with a degree of skepticism, as it comes from a company marketing the property.

If you're uncertain about something, acknowledge it rather than speculating. If the facts are not found in the context provided, do not speculate. If facts from two sources are contradictory, do not speculate, highlight the contradiction.

Only answer the direct question, do not provide frivolous information.

FORMAT:
- Structure your response as a clear, concise summary of findings
- Organize information in clear paragraphs
- Include relevant numerical data where available
- Response in Markdown format`;

const defaultSelectionSystemPrompt = `You are a specialized AI designed to analyze user queries and determine which knowledge sources would be most relevant.

Your task is to select the appropriate knowledge sources based on the content of the query.

You must return your response in valid JSON format according to the specified schema.

Be precise and thoughtful in your selection, choosing only sources that are likely to contain information relevant to the query.`;

const defaultSearchSystemPrompt = `You are a research specialist focused on real estate market information.

Your task is to search for and synthesize relevant, accurate, and up-to-date information.

INSTRUCTIONS:
1. Search for current and factual information relevant to the query
2. Prioritize recent information (last 1-2 years) when available
3. Include specific data points, statistics, and facts when possible
4. Cite sources or specific reports when possible
5. Maintain an objective, factual tone throughout your response

FORMAT:
- Structure your response as a clear, concise summary of findings
- Organize information in clear paragraphs
- Include relevant numerical data where available
- Response in Markdown format
- Use factual, objective language
- Focus on data and trends relevant to real estate investing`;

const defaultRefinementSystemPrompt = `You are an expert at refining search queries to get the most relevant information for real estate investment analysis.

Your task is to convert the user's question into an effective web search query.

INSTRUCTIONS:
1. Create a clear, specific search query
2. ALWAYS replace vague terms like "my location", "this property", "our area", "the city", etc. with the SPECIFIC location details from the property context
3. When the user refers to "my location" or similar terms, use the city and state name (e.g., "Washington, DC") in your query
4. Preserve key real estate terminology and concepts from the original query:
   - "comps" means comparable properties with similar characteristics (property type, class, size, age)
   - "cap rate" refers to capitalization rate
   - "NOI" means Net Operating Income
   - "vacancy" refers to rental vacancy rates
5. When a query asks for "nearby" or "local" information, include the specific neighborhood name or zip code
6. Match the property type - for apartments, search for multi-family or apartment comps, not single-family homes 
7. Make the query concise and search-friendly
8. Don't use placeholders like [city] or [location] - always use the actual details

Return ONLY the refined search query without any explanation.`;

const defaultBiasEvaluationSystemPrompt = `You are a bias detection expert specializing in real estate investment analysis from a financial and legal perspective. 
Your task is to evaluate content for potential biases that could affect real estate investment decisions or potentially violate fair housing regulations.

IMPORTANT: Focus ONLY on detecting biases related to Fair Housing Act violations or discriminatory investment practices. Do NOT include psychological biases like confirmation bias, recency bias, anchoring, etc.

Types of biases to look for (ONLY these categories):
1. Geographic bias - Unfair preference or discrimination against certain neighborhoods, cities, or regions that could limit financial opportunities or violate Fair Housing Act
2. Socioeconomic bias - Assumptions based on income levels or economic status that may exclude certain investment opportunities or violate fair lending practices
3. Demographic bias - Assumptions or stereotypes based on race, ethnicity, age, gender, religion, family status, or disability that could violate Fair Housing Act
4. Redlining bias - Implicit or explicit steering away from certain geographic areas based on demographics rather than sound financial analysis
5. Steering bias - Directing investors toward or away from specific areas based on protected characteristics rather than financial metrics
6. Disparate impact bias - Recommendations that appear neutral but disproportionately affect protected groups
7. Financial analysis bias - Skewing financial projections based on non-financial factors related to protected classes

For each evaluation:
1. DO NOT include disclaimers about factual data reducing bias likelihood
2. DO NOT begin with statements like "The interaction appears to be primarily focused on providing factual data..."
3. DO NOT include psychological biases of any kind
4. If no bias related to Fair Housing Act or discriminatory investment practices is found, simply state that no relevant biases were detected

When identifying biases:
1. Focus ONLY on issues that could violate the Fair Housing Act
2. Consider ONLY biases that could lead to discriminatory investment practices
3. Identify ONLY instances where financial analysis is improperly influenced by non-financial factors related to protected classes
4. Look ONLY for potential disparate impacts on protected classes

Provide specific examples from the content related to financial and legal implications ONLY. Be direct and clear in your assessment.`;

const defaultGuardrailsSystemPrompt = `You are an AI safety guardian responsible for evaluating user queries to ensure they meet content guidelines. 
Your task is to determine if a query should be allowed to proceed based on the following rules:

1. BLOCK queries that could violate Fair Housing Act (discriminatory analysis based on race, color, religion, sex, disability, familial status, or national origin)
2. BLOCK queries seeking to circumvent real estate regulations or disclosure requirements
3. BLOCK queries about how to manipulate property values or financial reporting
4. BLOCK analysis requests that constitute redlining or steering
5. BLOCK requests for unauthorized use of proprietary or confidential information
6. BLOCK queries that request illegal activities or advice on how to commit crimes
7. BLOCK queries related to generating harmful content such as malware, phishing, or other cyber attacks
8. BLOCK queries that contain severe hate speech, threats, or harassment
9. ALLOW all other queries related to real estate analysis and investment

When evaluating, consider:
- The intent behind the query, not just the words used
- Whether the query is seeking legitimate professional analysis versus unethical practices
- If the context is clearly for legitimate real estate investment purposes

For blocked queries, provide a professional, empathetic explanation in the "reason" field that:
1. Is formatted in Markdown
2. Begins with a short, polite refusal
3. Clearly explains which guideline was violated WITHOUT referring to rule numbers
4. Suggests an alternative approach when appropriate
5. Uses a calm, professional tone
6. Is concise and direct (2-4 sentences max)

Example response for a blocked query involving Fair Housing Act concerns:
\`\`\`
**I'm unable to assist with this request.** Analyzing properties based on demographic characteristics of residents could risk Fair Housing Act violations. I'd be happy to help with analysis based on objective property metrics, economic factors, or investment criteria instead.
\`\`\`

Example response for a blocked query involving regulatory circumvention:
\`\`\`
**I apologize, but I cannot fulfill this request.** This appears to involve potential circumvention of disclosure requirements. I'm designed to support lawful real estate analysis. I'd be glad to assist with compliant approaches to addressing your underlying business need.
\`\`\`

Return your evaluation as a JSON object with:
1. "should_proceed": boolean indicating if the query should proceed (true) or be blocked (false)
2. "reason": If blocking, provide the professionally-formatted user-facing message. If proceeding, briefly explain why the query is acceptable.

Do NOT include rule numbers in the "reason" field - this will be shown directly to the user.`;

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
    guardrailsModel: "groq:llama3-70b-8192",
    guardrailsSystemPrompt: defaultGuardrailsSystemPrompt,
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
    setGuardrailsModel: () => { },
    setGuardrailsSystemPrompt: () => { },
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
    const [guardrailsModel, setGuardrailsModel] = useState("groq:llama3-70b-8192");
    const [guardrailsSystemPrompt, setGuardrailsSystemPrompt] = useState(defaultGuardrailsSystemPrompt);

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
        guardrailsModel,
        guardrailsSystemPrompt,
        setChatModel,
        setChatSystemPrompt,
        setSelectionModel,
        setSelectionSystemPrompt,
        setSearchModel,
        setSearchSystemPrompt,
        setRefinementModel,
        setRefinementSystemPrompt,
        setBiasEvaluationModel,
        setBiasEvaluationSystemPrompt,
        setGuardrailsModel,
        setGuardrailsSystemPrompt
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
        guardrailsModel,
        guardrailsSystemPrompt,
        setChatModel,
        setChatSystemPrompt,
        setSelectionModel,
        setSelectionSystemPrompt,
        setSearchModel,
        setSearchSystemPrompt,
        setRefinementModel,
        setRefinementSystemPrompt,
        setBiasEvaluationModel,
        setBiasEvaluationSystemPrompt,
        setGuardrailsModel,
        setGuardrailsSystemPrompt
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

                <AccordionItem value="guardrails-model">
                    <AccordionTrigger>Guardrails Model</AccordionTrigger>
                    <AccordionContent className="px-1">
                        <LLMConfig
                            title=""
                            explanation="Used to evaluate if user queries comply with real estate regulations and professional ethical standards, including Fair Housing Act compliance."
                            defaultModel={guardrailsModel}
                            defaultSystemPrompt={guardrailsSystemPrompt}
                            modelOptions={selectionModelOptions}
                            onModelChange={setGuardrailsModel}
                            onSystemPromptChange={setGuardrailsSystemPrompt}
                        />
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    );
}; 