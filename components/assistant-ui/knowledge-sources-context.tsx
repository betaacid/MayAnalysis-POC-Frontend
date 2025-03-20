"use client";

import { FC, ReactNode, createContext, useContext, useState } from "react";

// Define the knowledge source types (matches backend enum)
export type KnowledgeSource =
    | "all"
    | "property_info"
    | "zillow"
    | "corelogic"
    | "apartments"
    | "labs"
    | "rent_roll"
    | "offering_memorandum"
    | "financial_analysis";

// Create a context for knowledge sources
interface KnowledgeSourcesContextType {
    selectedSources: KnowledgeSource[];
    setSelectedSources: (sources: KnowledgeSource[]) => void;
}

const KnowledgeSourcesContext = createContext<KnowledgeSourcesContextType | undefined>(undefined);

// Hook to use the knowledge sources context
export const useKnowledgeSources = () => {
    const context = useContext(KnowledgeSourcesContext);
    if (context === undefined) {
        throw new Error('useKnowledgeSources must be used within a KnowledgeSourcesProvider');
    }
    return context;
};

// Knowledge Sources Provider component
interface KnowledgeSourcesProviderProps {
    children: ReactNode;
}

export const KnowledgeSourcesProvider: FC<KnowledgeSourcesProviderProps> = ({ children }) => {
    // Default to "all" selected
    const [selectedSources, setSelectedSources] = useState<KnowledgeSource[]>(["all"]);

    return (
        <KnowledgeSourcesContext.Provider
            value={{
                selectedSources,
                setSelectedSources
            }}
        >
            {children}
        </KnowledgeSourcesContext.Provider>
    );
}; 