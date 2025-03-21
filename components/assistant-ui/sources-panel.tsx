"use client";

import { FC, createContext, useContext } from "react";
import { XIcon } from "lucide-react";
import { TooltipIconButton } from "@/components/assistant-ui/tooltip-icon-button";
import { useKnowledgeSourceDetails } from "@/app/MyRuntimeProvider";

// Create a context for the sources panel
interface SourcesPanelContextType {
    showSourcesPanel: boolean;
    setShowSourcesPanel: (show: boolean) => void;
}

const SourcesPanelContext = createContext<SourcesPanelContextType | undefined>(undefined);

// Hook to use the sources panel context
export const useSourcesPanel = () => {
    const context = useContext(SourcesPanelContext);
    if (context === undefined) {
        throw new Error('useSourcesPanel must be used within a SourcesPanelProvider');
    }
    return context;
};

// Export the context provider for use in the Thread component
export const SourcesPanelProvider = SourcesPanelContext.Provider;

// The Sources Panel component
export const SourcesPanel: FC = () => {
    const { showSourcesPanel, setShowSourcesPanel } = useSourcesPanel();
    // Access knowledge source details through the context hook
    const { details } = useKnowledgeSourceDetails();

    if (!showSourcesPanel) return null;

    return (
        <div className="fixed right-0 top-0 bottom-0 w-72 border-l bg-white shadow-md z-20 flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-lg font-semibold">Sources</h2>
                <TooltipIconButton
                    tooltip="Close"
                    onClick={() => setShowSourcesPanel(false)}
                >
                    <XIcon size={18} />
                </TooltipIconButton>
            </div>
            <div className="p-4 overflow-y-auto flex-grow">
                {details && details.length > 0 ? (
                    <div className="space-y-4">
                        {/* We'll implement the full UI later */}
                        <div className="text-sm text-gray-600">
                            {details.length} sources available
                        </div>
                    </div>
                ) : (
                    <div className="text-sm text-gray-600">
                        No sources available for this message.
                    </div>
                )}
            </div>
        </div>
    );
}; 