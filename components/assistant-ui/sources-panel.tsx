"use client";

import React, { FC, createContext, useContext, useState } from "react";
import { BookOpen, FileText, XIcon, Globe, Database, Home, Building, ChevronDown, ChevronUp, BrainIcon, AlertTriangle, CheckCircle, XCircle, Shield } from "lucide-react";
import { TooltipIconButton } from "@/components/assistant-ui/tooltip-icon-button";
import { useKnowledgeSourceDetails } from "@/app/MyRuntimeProvider";
import { KnowledgeSourceDetail } from "@/lib/types/knowledge-source";
import { KnowledgeSource } from "./knowledge-sources-context";
import MarkdownContent from "@/components/ui/markdown-content";

// Create a context for the sources panel
interface SourcesPanelContextType {
    showSourcesPanel: boolean;
    setShowSourcesPanel: (show: boolean) => void;
}

const SupportingInfoPanelContext = createContext<SourcesPanelContextType | undefined>(undefined);

// Hook to use the sources panel context
export const useSourcesPanel = () => {
    const context = useContext(SupportingInfoPanelContext);
    if (context === undefined) {
        throw new Error('useSourcesPanel must be used within a SourcesPanelProvider');
    }
    return context;
};

// Export the context provider for use in the Thread component
export const SourcesPanelProvider = SupportingInfoPanelContext.Provider;

// Map of source types to icons
const sourceIconMap: Record<string, React.ReactNode> = {
    zillow: <Home size={16} />,
    corelogic: <Database size={16} />,
    apartments: <Building size={16} />,
    labs: <Database size={16} />,
    rent_roll: <FileText size={16} />,
    offering_memo: <BookOpen size={16} />,
    financial_analysis: <FileText size={16} />,
    web_search: <Globe size={16} />,
    property_info: <Home size={16} />,
    // Default icon for any unmapped source
    default: <FileText size={16} />
};

// Component for displaying the bias evaluation results
interface BiasEvaluationPanelProps {
    biasEvaluation: {
        bias_likelihood: "low" | "medium" | "high" | "unknown";
        explanation: string;
        biases_detected?: Array<{
            bias_type: string;
            severity: "low" | "medium" | "high";
            description: string;
            location: string;
        }>;
    };
}

const BiasEvaluationPanel: React.FC<BiasEvaluationPanelProps> = ({ biasEvaluation }) => {
    const [expanded, setExpanded] = useState(true);

    // Get appropriate color based on bias likelihood
    const getBiasLikelihoodColor = (likelihood: string) => {
        switch (likelihood.toLowerCase()) {
            case 'high':
                return 'bg-red-100 text-red-800 border-red-200';
            case 'medium':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'low':
                return 'bg-green-100 text-green-800 border-green-200';
            default:
                return 'bg-blue-100 text-blue-800 border-blue-200';
        }
    };

    // Get icon color based on bias likelihood
    const getBiasLikelihoodIconColor = (likelihood: string) => {
        switch (likelihood.toLowerCase()) {
            case 'high':
                return 'text-red-500';
            case 'medium':
                return 'text-yellow-500';
            case 'low':
                return 'text-green-500';
            default:
                return 'text-blue-500';
        }
    };

    const likelihoodColor = getBiasLikelihoodColor(biasEvaluation.bias_likelihood);
    const iconColor = getBiasLikelihoodIconColor(biasEvaluation.bias_likelihood);

    return (
        <div className="border rounded-lg overflow-hidden mb-4 shadow-sm">
            {/* Header with icon, name, and expand/collapse button */}
            <div
                className={`flex items-center justify-between p-3 ${getBiasLikelihoodColor(biasEvaluation.bias_likelihood)} cursor-pointer`}
                onClick={() => setExpanded(!expanded)}
            >
                <div className="flex items-center gap-2">
                    <AlertTriangle className={`h-5 w-5 ${iconColor}`} />
                    <h3 className="font-medium text-sm">Bias Assessment</h3>
                </div>
                <div className="flex items-center">
                    <span className={`text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full ${likelihoodColor}`}>
                        {biasEvaluation.bias_likelihood.charAt(0).toUpperCase() + biasEvaluation.bias_likelihood.slice(1)}
                    </span>
                    <button className={iconColor}>
                        {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                </div>
            </div>

            {/* Content area - collapsible */}
            {expanded && (
                <div className="p-3 text-sm border-t bg-white">
                    <div className="prose prose-sm max-w-none text-slate-700">
                        <MarkdownContent content={biasEvaluation.explanation} />

                        {biasEvaluation.biases_detected && biasEvaluation.biases_detected.length > 0 && (
                            <div className="mt-3">
                                <p className="font-medium mb-1">Detected Biases:</p>
                                <ul className="list-disc pl-5 space-y-1">
                                    {biasEvaluation.biases_detected.map((bias, index) => (
                                        <li key={index}>
                                            <span className="font-medium">{bias.bias_type}:</span> {bias.description}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

// Component for displaying the thinking content
interface ThinkingPanelProps {
    content: string;
}

const ThinkingPanel: FC<ThinkingPanelProps> = ({ content }) => {
    const [expanded, setExpanded] = useState(true);

    return (
        <div className="border rounded-lg overflow-hidden mb-4 shadow-sm">
            {/* Header with icon, name, and expand/collapse button */}
            <div
                className="flex items-center justify-between p-3 bg-indigo-50 cursor-pointer"
                onClick={() => setExpanded(!expanded)}
            >
                <div className="flex items-center gap-2">
                    <span className="text-indigo-600"><BrainIcon size={16} /></span>
                    <h3 className="font-medium text-sm text-indigo-700">Chat Thinking Process</h3>
                </div>
                <button className="text-indigo-500 hover:text-indigo-700">
                    {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
            </div>

            {/* Content area - collapsible */}
            {expanded && (
                <div className="p-3 text-sm border-t bg-white">
                    <MarkdownContent content={content} />
                </div>
            )}
        </div>
    );
};

// Component for displaying a single source
interface SourceItemProps {
    source: KnowledgeSourceDetail;
    searchPrompt?: string;
    searchThinking?: string | null;
}

const SourceItem: FC<SourceItemProps> = ({ source, searchPrompt, searchThinking }) => {
    const [expanded, setExpanded] = useState(true);
    const [showFullTextModal, setShowFullTextModal] = useState(false);

    // Get the appropriate icon or use default
    const icon = sourceIconMap[source.source_enum] || sourceIconMap.default;

    // Check if this is an offering memorandum
    const isOfferingMemorandum = source.source_enum === 'offering_memo' as KnowledgeSource;

    // Check if this is web search result
    const isWebSearch = source.source_enum === 'web_search' as KnowledgeSource;

    // Get display content - truncate offering memorandum to 200 chars
    const displayContent = () => {
        if (isOfferingMemorandum) {
            return source.text.length > 200
                ? source.text.substring(0, 200) + '...'
                : source.text;
        }
        return source.text;
    };

    return (
        <>
            <div className="border rounded-lg overflow-hidden mb-4 shadow-sm">
                {/* Header with icon, name, and expand/collapse button */}
                <div
                    className="flex items-center justify-between p-3 bg-slate-50 cursor-pointer"
                    onClick={() => setExpanded(!expanded)}
                >
                    <div className="flex items-center gap-2">
                        <span className="text-slate-600">{icon}</span>
                        <h3 className="font-medium text-sm">{source.display_name}</h3>
                    </div>
                    <button className="text-slate-500 hover:text-slate-700">
                        {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                </div>

                {/* Content area - collapsible */}
                {expanded && (
                    <div className="p-3 text-sm border-t bg-white">
                        {/* Show query information for web search */}
                        {isWebSearch && searchPrompt && (
                            <div className="mb-3 p-2 bg-blue-50 rounded-md border border-blue-100">
                                <div className="flex items-center gap-1.5 text-blue-700 font-medium mb-1">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-blue-500">
                                        <path d="M12 3L14.0357 8.16153L19.5 8.86227L15.75 12.9498L16.5714 18.4378L12 15.8462L7.42857 18.4378L8.25 12.9498L4.5 8.86227L9.96429 8.16153L12 3Z" fill="currentColor" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    <span>Search Prompt</span>
                                </div>

                                <div className="rounded bg-white p-2 mt-1">
                                    <pre className="text-xs text-blue-800 whitespace-pre-wrap font-mono">{searchPrompt}</pre>
                                </div>

                                <p className="text-xs text-blue-600 mt-2 italic">This is the full prompt sent to the search service</p>
                            </div>
                        )}

                        {/* Add header for search results section */}
                        {isWebSearch && (
                            <div className="mb-3 p-2 bg-emerald-50 rounded-md border border-emerald-100">
                                <div className="flex items-center gap-1.5 text-emerald-700 font-medium mb-1">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-emerald-500">
                                        <path d="M21 11.5C21 16.1944 17.1944 20 12.5 20C7.80558 20 4 16.1944 4 11.5C4 6.80558 7.80558 3 12.5 3C17.1944 3 21 6.80558 21 11.5Z" stroke="currentColor" strokeWidth="2" />
                                        <path d="M15.5 11.5L19 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                    </svg>
                                    <span>Search Results</span>
                                </div>
                                <div className="bg-white rounded p-3 border border-emerald-100">
                                    <MarkdownContent content={displayContent()} />
                                </div>
                            </div>
                        )}

                        {/* Show search thinking for web search if available - moved below search results */}
                        {isWebSearch && searchThinking && (
                            <div className="mb-4">
                                <div className="border rounded-lg overflow-hidden mb-3 shadow-sm">
                                    <div className="flex items-center justify-between p-3 bg-indigo-50">
                                        <div className="flex items-center gap-2">
                                            <span className="text-indigo-600"><BrainIcon size={16} /></span>
                                            <h3 className="font-medium text-sm text-indigo-700">Search Thinking Process</h3>
                                        </div>
                                    </div>
                                    <div className="p-3 text-sm border-t bg-white">
                                        <MarkdownContent content={searchThinking} />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Show content for non-web search sources */}
                        {!isWebSearch && (
                            <MarkdownContent content={displayContent()} />
                        )}

                        {/* Show Full Text button for offering memorandum */}
                        {isOfferingMemorandum && source.text.length > 200 && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowFullTextModal(true);
                                }}
                                className="mt-2 px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors font-medium flex items-center"
                            >
                                <BookOpen size={14} className="mr-1" />
                                View All Snippets
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Full text modal */}
            {showFullTextModal && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-75 z-50 flex justify-center items-start overflow-y-auto p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl mx-auto my-8 max-h-[90vh] flex flex-col">
                        {/* Modal header */}
                        <div className="flex justify-between items-center p-4 border-b">
                            <div className="flex items-center">
                                <BookOpen size={20} className="text-slate-600 mr-2" />
                                <h2 className="text-xl font-semibold">{source.display_name}</h2>
                            </div>
                            <button
                                onClick={() => setShowFullTextModal(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <XIcon size={20} />
                            </button>
                        </div>

                        {/* Modal content */}
                        <div className="p-6 overflow-y-auto flex-grow">
                            <MarkdownContent content={source.text} />
                        </div>

                        {/* Modal footer */}
                        <div className="p-4 border-t flex justify-end">
                            <button
                                onClick={() => setShowFullTextModal(false)}
                                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-md hover:bg-slate-200 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

// Component for displaying the guardrails evaluation results
interface GuardrailsPanelProps {
    guardrailsEvaluation: {
        should_proceed: boolean;
        reason: string;
    };
}

const GuardrailsPanel: React.FC<GuardrailsPanelProps> = ({ guardrailsEvaluation }) => {
    const [expanded, setExpanded] = useState(true);
    const { should_proceed, reason } = guardrailsEvaluation;

    return (
        <div className="border rounded-lg overflow-hidden mb-4 shadow-sm">
            {/* Header with icon, name, and expand/collapse button */}
            <div
                className={`flex items-center justify-between p-3 ${should_proceed ? 'bg-green-50' : 'bg-red-50'} cursor-pointer`}
                onClick={() => setExpanded(!expanded)}
            >
                <div className="flex items-center gap-2">
                    <Shield className={`h-5 w-5 ${should_proceed ? 'text-green-500' : 'text-red-500'}`} />
                    <h3 className="font-medium text-sm">Guardrails Check</h3>
                </div>
                <div className="flex items-center">
                    <span className={`flex items-center text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full 
                        ${should_proceed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {should_proceed ?
                            <><CheckCircle size={14} className="mr-1" /> Allowed</> :
                            <><XCircle size={14} className="mr-1" /> Blocked</>
                        }
                    </span>
                    <button className={should_proceed ? 'text-green-500' : 'text-red-500'}>
                        {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                </div>
            </div>

            {/* Content area - collapsible */}
            {expanded && (
                <div className="p-3 text-sm border-t bg-white">
                    <div className="prose prose-sm max-w-none text-slate-700">
                        <MarkdownContent content={reason} />
                    </div>
                </div>
            )}
        </div>
    );
};

// The Sources Panel component
export const SourcesPanel: FC = () => {
    const { showSourcesPanel, setShowSourcesPanel } = useSourcesPanel();
    const {
        details,
        chat_thinking,
        search_thinking,
        biasEvaluation,
        searchPrompt,
        guardrailsEvaluation
    } = useKnowledgeSourceDetails();

    if (!showSourcesPanel) return null;

    // Debug logs to check what we're receiving
    console.log('Sources Panel State:', {
        chat_thinking,
        search_thinking,
        details,
        biasEvaluation,
        guardrailsEvaluation
    });

    // Check if we have any content to display
    const hasContent = Boolean(chat_thinking) ||
        Boolean(search_thinking) ||
        (details && details.length > 0) ||
        biasEvaluation ||
        guardrailsEvaluation;

    return (
        <div className="fixed right-0 top-0 bottom-0 w-[28rem] border-l bg-white shadow-md z-20 flex flex-col">
            {/* Panel Header */}
            <div className="flex items-center justify-between p-4 border-b bg-white sticky top-0 z-10">
                <div className="flex items-center gap-2">
                    <BookOpen size={18} className="text-slate-600" />
                    <h2 className="text-lg font-semibold">Supporting Info</h2>
                </div>
                <TooltipIconButton
                    tooltip="Close"
                    onClick={() => setShowSourcesPanel(false)}
                >
                    <XIcon size={18} />
                </TooltipIconButton>
            </div>

            {/* Panel Content */}
            <div className="p-4 overflow-y-auto flex-grow">
                {hasContent ? (
                    <div>
                        {/* Thinking section first */}
                        {chat_thinking && (
                            <div className="mb-6">
                                <p className="text-xs text-slate-500 mb-3">
                                    This shows the AI&apos;s reasoning process and how it arrived at its response.
                                </p>
                                <ThinkingPanel content={chat_thinking} />
                            </div>
                        )}

                        {/* Knowledge sources section */}
                        {details && details.length > 0 && (
                            <div className="mb-6">
                                <h3 className="text-sm font-semibold text-slate-700 mb-2">Sources</h3>
                                <p className="text-xs text-slate-500 mb-3">
                                    Information from these sources was used to generate the response.
                                </p>
                                <div className="space-y-2">
                                    {details.map((source, index) => (
                                        <SourceItem
                                            key={`${source.source_enum}-${index}`}
                                            source={source}
                                            searchPrompt={source.source_enum === 'web_search' && searchPrompt ? searchPrompt : undefined}
                                            searchThinking={source.source_enum === 'web_search' ? search_thinking : null}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Bias Evaluation section last */}
                        {biasEvaluation && (
                            <div>
                                <h3 className="text-sm font-semibold text-slate-700 mb-2">Bias Evaluation</h3>
                                <p className="text-xs text-slate-500 mb-3">
                                    This shows the AI&apos;s bias evaluation and detected biases.
                                </p>
                                <BiasEvaluationPanel biasEvaluation={biasEvaluation} />
                            </div>
                        )}

                        {/* Guardrails Evaluation section */}
                        {guardrailsEvaluation && (
                            <div>
                                <h3 className="text-sm font-semibold text-slate-700 mb-2">Guardrails Check</h3>
                                <p className="text-xs text-slate-500 mb-3">
                                    This shows the AI&apos;s guardrails evaluation and the reason for the decision.
                                </p>
                                <GuardrailsPanel guardrailsEvaluation={guardrailsEvaluation} />
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="text-sm text-slate-500 flex items-center justify-center h-full">
                        <p>No supporting information available for this message.</p>
                    </div>
                )}
            </div>
        </div>
    );
}; 