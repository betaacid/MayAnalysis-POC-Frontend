"use client";

import { FC } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

// Custom Markdown component that accepts content as a prop
const MarkdownContent: FC<{ content: string; className?: string }> = ({ content, className }) => {
    return (
        <div className={cn("prose prose-sm max-w-none text-slate-700", className)}>
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                className="break-words"
                components={{
                    h1: ({ className, ...props }) => (
                        <h1 className={cn("font-bold text-2xl mt-4 mb-2", className)} {...props} />
                    ),
                    h2: ({ className, ...props }) => (
                        <h2 className={cn("font-semibold text-xl mt-3 mb-2", className)} {...props} />
                    ),
                    h3: ({ className, ...props }) => (
                        <h3 className={cn("font-semibold text-lg mt-3 mb-1", className)} {...props} />
                    ),
                    a: ({ className, ...props }) => (
                        <a className={cn("text-blue-600 underline hover:text-blue-800", className)} {...props} />
                    ),
                    p: ({ className, ...props }) => (
                        <p className={cn("mb-3", className)} {...props} />
                    ),
                    ul: ({ className, ...props }) => (
                        <ul className={cn("list-disc mb-3 pl-6", className)} {...props} />
                    ),
                    ol: ({ className, ...props }) => (
                        <ol className={cn("list-decimal mb-3 pl-6", className)} {...props} />
                    ),
                    li: ({ className, ...props }) => (
                        <li className={cn("mb-1", className)} {...props} />
                    ),
                    pre: ({ className, ...props }) => (
                        <pre className={cn("bg-gray-100 p-2 rounded mb-3 overflow-x-auto", className)} {...props} />
                    ),
                    code: ({ className, ...props }) => (
                        <code className={cn("bg-gray-100 px-1 py-0.5 rounded text-sm font-mono", className)} {...props} />
                    ),
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
};

export default MarkdownContent; 