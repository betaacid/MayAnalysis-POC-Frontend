"use client";

import { FC, useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { KnowledgeSource, useKnowledgeSources } from "./knowledge-sources-context";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";

// Constants
const SOURCE_LABELS: Record<KnowledgeSource, string> = {
    all: "All Sources",
    property_info: "Property Info",
    zillow: "Zillow",
    corelogic: "CoreLogic",
    apartments: "Apartments.com",
    labs: "Labs Internal",
    rent_roll: "Rent Roll",
    offering_memo: "Offering Memorandum",
    financial_analysis: "Financial Analysis",
    web_search: "Web Search",
};

// Default set of knowledge sources (all except web_search)
export const DEFAULT_KNOWLEDGE_SOURCES: KnowledgeSource[] = [
    "zillow",
    "corelogic",
    "labs",
    "rent_roll",
    "offering_memo",
    "financial_analysis",
];

// All available sources (excluding web_search as requested)
const availableSources: KnowledgeSource[] = [
    "all",
    "property_info",
    "zillow",
    "corelogic",
    "apartments",
    "labs",
    "rent_roll",
    "offering_memo",
    "financial_analysis"
];

export const KnowledgeSourcesSelector: FC = () => {
    const { selectedSources, setSelectedSources } = useKnowledgeSources();
    const [open, setOpen] = useState(false);

    // Handler for toggling a source
    const handleToggleSource = (source: KnowledgeSource) => {
        if (source === "all") {
            setSelectedSources(["all"]);
            setOpen(false);
        } else {
            // If any other source is selected, remove "all" from selection
            const newSelection = selectedSources.includes(source)
                ? selectedSources.filter(s => s !== source)
                : [...selectedSources.filter(s => s !== "all"), source];

            // If nothing is selected, default back to "all"
            setSelectedSources(newSelection.length === 0 ? ["all"] : newSelection);
        }
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between text-sm"
                >
                    {selectedSources.includes("all")
                        ? "All Sources"
                        : selectedSources.length > 0
                            ? `${selectedSources.length} sources selected`
                            : "Select sources..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-2" align="start">
                <div className="max-h-[300px] overflow-y-auto">
                    <p className="text-xs text-muted-foreground pb-2">
                        Select knowledge sources
                    </p>
                    <div className="space-y-1">
                        {availableSources.map((source) => (
                            <div
                                key={source}
                                onClick={() => handleToggleSource(source)}
                                className="flex items-center space-x-2 rounded-md p-2 cursor-pointer hover:bg-accent hover:text-accent-foreground"
                            >
                                <div className="h-4 w-4 border rounded-sm flex items-center justify-center">
                                    {selectedSources.includes(source) && (
                                        <Check className="h-3 w-3" />
                                    )}
                                </div>
                                <span>{SOURCE_LABELS[source]}</span>
                            </div>
                        ))}
                    </div>
                </div>
                {!selectedSources.includes("all") && selectedSources.length > 0 && (
                    <div className="border-t mt-2 pt-2">
                        <Button
                            size="sm"
                            className="w-full"
                            onClick={() => setOpen(false)}
                        >
                            Done
                        </Button>
                    </div>
                )}
            </PopoverContent>
        </Popover>
    );
};

// Component to display selected sources as badges
export const SelectedSourcesBadges: FC = () => {
    const { selectedSources } = useKnowledgeSources();

    if (selectedSources.includes("all")) {
        return (
            <Badge variant="secondary" className="mr-1">
                All Sources
            </Badge>
        );
    }

    return (
        <div className="flex flex-wrap gap-1">
            {selectedSources.map(source => (
                <Badge key={source} variant="secondary" className="mr-1">
                    {SOURCE_LABELS[source]}
                </Badge>
            ))}
        </div>
    );
}; 