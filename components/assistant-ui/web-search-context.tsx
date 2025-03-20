"use client";

import { FC, ReactNode, createContext, useContext, useState } from "react";

// Create a context for web search
interface WebSearchContextType {
    includeWebSearch: boolean;
    setIncludeWebSearch: (include: boolean) => void;
}

const WebSearchContext = createContext<WebSearchContextType | undefined>(undefined);

// Hook to use the web search context
export const useWebSearch = () => {
    const context = useContext(WebSearchContext);
    if (context === undefined) {
        throw new Error('useWebSearch must be used within a WebSearchProvider');
    }
    return context;
};

// Web Search Provider component
interface WebSearchProviderProps {
    children: ReactNode;
}

export const WebSearchProvider: FC<WebSearchProviderProps> = ({ children }) => {
    const [includeWebSearch, setIncludeWebSearch] = useState(false);

    return (
        <WebSearchContext.Provider
            value={{
                includeWebSearch,
                setIncludeWebSearch
            }}
        >
            {children}
        </WebSearchContext.Provider>
    );
}; 