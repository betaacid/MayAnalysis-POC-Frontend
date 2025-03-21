"use client";

import React from "react";
import { Label } from "@/components/ui/label";

interface ModelOption {
    label: string;
    value: string;
}

interface LLMConfigProps {
    title: string;
    explanation: string;
    defaultModel: string;
    defaultSystemPrompt: string;
    modelOptions: ModelOption[];
    onModelChange?: (model: string) => void;
    onSystemPromptChange?: (prompt: string) => void;
}

export const LLMConfig: React.FC<LLMConfigProps> = ({
    title,
    explanation,
    defaultModel,
    defaultSystemPrompt,
    modelOptions,
    onModelChange,
    onSystemPromptChange,
}) => {
    return (
        <div className="space-y-4">
            {title && (
                <div>
                    <h3 className="text-lg font-medium">{title}</h3>
                </div>
            )}
            <p className="text-sm text-muted-foreground">{explanation}</p>

            <div className="space-y-2">
                <Label htmlFor={`${title || "model"}-model`}>Model</Label>
                <select
                    id={`${title || "model"}-model`}
                    value={defaultModel}
                    onChange={(e) => onModelChange && onModelChange(e.target.value)}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                    {modelOptions.map((model) => (
                        <option key={model.value} value={model.value}>
                            {model.label}
                        </option>
                    ))}
                </select>
            </div>

            <div className="space-y-2">
                <Label htmlFor={`${title || "model"}-prompt`}>System Prompt</Label>
                <textarea
                    id={`${title || "model"}-prompt`}
                    value={defaultSystemPrompt}
                    onChange={(e) => onSystemPromptChange && onSystemPromptChange(e.target.value)}
                    rows={5}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
            </div>
        </div>
    );
}; 