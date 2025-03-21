import React from "react";
import { Label } from "@/components/ui/label";

interface LLMConfigProps {
    title: string;
    explanation: string;
    defaultModel: string;
    defaultSystemPrompt: string;
    models: string[];
}

export const LLMConfig: React.FC<LLMConfigProps> = ({
    title,
    explanation,
    defaultModel,
    defaultSystemPrompt,
    models,
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
                    defaultValue={defaultModel}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                    {models.map((model) => (
                        <option key={model} value={model}>
                            {model}
                        </option>
                    ))}
                </select>
            </div>

            <div className="space-y-2">
                <Label htmlFor={`${title || "model"}-prompt`}>System Prompt</Label>
                <textarea
                    id={`${title || "model"}-prompt`}
                    defaultValue={defaultSystemPrompt}
                    rows={5}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
            </div>
        </div>
    );
}; 