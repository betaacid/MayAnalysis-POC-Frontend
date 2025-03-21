import React from "react";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { LLMConfig } from "@/components/assistant-ui/llm-config";

export const ModelConfig: React.FC = () => {
    // Hardcoded values for now
    const models = ["gpt-3.5-turbo", "gpt-4", "gpt-4-turbo", "claude-3-opus", "claude-3-sonnet", "anthropic.claude-3-haiku"];

    // Default values based on the chat.py implementation
    const defaultChatSystemPrompt = "You are a helpful AI assistant answering questions about real estate properties.";
    const defaultSelectionSystemPrompt = "You are a helpful AI assistant that selects relevant information for a query.";
    const defaultSearchSystemPrompt = "You are a helpful AI assistant that constructs effective search queries.";
    const defaultRefinementSystemPrompt = "You are a helpful AI assistant that refines information for a clear and concise response.";

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
                            defaultModel="gpt-4"
                            defaultSystemPrompt={defaultChatSystemPrompt}
                            models={models}
                        />
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="selection-model">
                    <AccordionTrigger>Selection Model</AccordionTrigger>
                    <AccordionContent className="px-1">
                        <LLMConfig
                            title=""
                            explanation="Used to select relevant information from knowledge sources."
                            defaultModel="gpt-3.5-turbo"
                            defaultSystemPrompt={defaultSelectionSystemPrompt}
                            models={models}
                        />
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="search-model">
                    <AccordionTrigger>Search Model</AccordionTrigger>
                    <AccordionContent className="px-1">
                        <LLMConfig
                            title=""
                            explanation="Used to formulate effective search queries."
                            defaultModel="gpt-3.5-turbo"
                            defaultSystemPrompt={defaultSearchSystemPrompt}
                            models={models}
                        />
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="refinement-model">
                    <AccordionTrigger>Refinement Model</AccordionTrigger>
                    <AccordionContent className="px-1">
                        <LLMConfig
                            title=""
                            explanation="Used to refine and improve the final response."
                            defaultModel="gpt-3.5-turbo"
                            defaultSystemPrompt={defaultRefinementSystemPrompt}
                            models={models}
                        />
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    );
}; 