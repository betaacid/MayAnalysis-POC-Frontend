"use client";

import { FC, ReactNode, useState } from "react";
import { SourcesPanelProvider } from "@/components/assistant-ui/sources-panel";

interface SourcesPanelWrapperProps {
    children: ReactNode;
}

export const SourcesPanelWrapper: FC<SourcesPanelWrapperProps> = ({ children }) => {
    const [showSourcesPanel, setShowSourcesPanel] = useState(false);

    return (
        <SourcesPanelProvider
            value={{
                showSourcesPanel,
                setShowSourcesPanel
            }}
        >
            {children}
        </SourcesPanelProvider>
    );
}; 