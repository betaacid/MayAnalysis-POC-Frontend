"use client";

import React, { FC, createContext, useContext, useState } from "react";
import { BookOpen, FileText, XIcon, Globe, Database, Home, Building, ChevronDown, ChevronUp, BrainIcon } from "lucide-react";
import { TooltipIconButton } from "@/components/assistant-ui/tooltip-icon-button";
import { useKnowledgeSourceDetails } from "@/app/MyRuntimeProvider";
import { KnowledgeSourceDetail } from "@/lib/types/knowledge-source";

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
    offering_memorandum: <BookOpen size={16} />,
    financial_analysis: <FileText size={16} />,
    web_search: <Globe size={16} />,
    property_info: <Home size={16} />,
    // Default icon for any unmapped source
    default: <FileText size={16} />
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
                    <h3 className="font-medium text-sm text-indigo-700">Thinking Process</h3>
                </div>
                <button className="text-indigo-500 hover:text-indigo-700">
                    {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
            </div>

            {/* Content area - collapsible */}
            {expanded && (
                <div className="p-3 text-sm border-t bg-white">
                    <div className="prose prose-sm max-w-none text-slate-700 whitespace-pre-wrap">
                        {content}
                    </div>
                </div>
            )}
        </div>
    );
};

// Component for displaying a single source
interface SourceItemProps {
    source: KnowledgeSourceDetail;
}

const SourceItem: FC<SourceItemProps> = ({ source }) => {
    const [expanded, setExpanded] = useState(true);

    // Get the appropriate icon or use default
    const icon = sourceIconMap[source.source_enum] || sourceIconMap.default;

    return (
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
                    <div className="prose prose-sm max-w-none text-slate-700 whitespace-pre-wrap">
                        {source.text}
                    </div>
                </div>
            )}
        </div>
    );
};

// The Sources Panel component
export const SourcesPanel: FC = () => {
    const { showSourcesPanel, setShowSourcesPanel } = useSourcesPanel();
    // Access knowledge source details and thinking through the context hook
    const { details, thinking } = useKnowledgeSourceDetails();

    if (!showSourcesPanel) return null;

    const hasContent = (thinking != null) || (details && details.length > 0);

    return (
        <div className="fixed right-0 top-0 bottom-0 w-80 border-l bg-white shadow-md z-20 flex flex-col">
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
                        {/* Thinking section */}
                        {thinking && (
                            <div className="mb-6">
                                <h3 className="text-sm font-semibold text-slate-700 mb-2">Thinking Process</h3>
                                <p className="text-xs text-slate-500 mb-3">
                                    This shows the AI&apos;s reasoning process and how it arrived at its response.
                                </p>
                                <ThinkingPanel content={thinking} />
                            </div>
                        )}

                        {/* Knowledge sources section */}
                        {details && details.length > 0 && (
                            <div>
                                <h3 className="text-sm font-semibold text-slate-700 mb-2">Sources</h3>
                                <p className="text-xs text-slate-500 mb-3">
                                    Information from these sources was used to generate the response.
                                </p>
                                <div className="space-y-2">
                                    {details.map((source, index) => (
                                        <SourceItem key={`${source.source_enum}-${index}`} source={source} />
                                    ))}
                                </div>
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