/**
 * Types for message content in the chat interface
 */

// Text content with a plain text string
export interface TextContent {
  type: 'text';
  text: string;
}

// Thinking content for showing model's reasoning
export interface ThinkingContent {
  type: 'thinking';
  text: string;
}

// Generic content with any other type
export interface OtherContent {
  type: string;
  [key: string]: unknown;
}

// Union type for different content items
export type ContentItem = TextContent | OtherContent;

// Content value types
export type ContentValue =
  | string
  | TextContent
  | ThinkingContent
  | readonly unknown[]
  | (TextContent | ThinkingContent)[]
  | Record<string, unknown>;

/**
 * Extracts plain text from various message content formats
 */
export const extractTextContent = (content: ContentValue): string => {
  try {
    // If it's a string, return it directly
    if (typeof content === 'string') {
      return content;
    }

    // If it's an array, look for the first text part
    if (Array.isArray(content)) {
      for (const part of content) {
        if (
          part &&
          typeof part === 'object' &&
          'type' in part &&
          (part.type === 'text' || part.type === 'thinking') &&
          'text' in part
        ) {
          return part.text as string;
        }
      }
    }

    // If it's an object with text, return that
    if (
      content &&
      typeof content === 'object' &&
      !Array.isArray(content) &&
      'type' in content
    ) {
      if (
        (content.type === 'text' || content.type === 'thinking') &&
        'text' in content
      ) {
        return content.text as string;
      }
    }

    // Default: stringify the content
    return JSON.stringify(content);
  } catch (e) {
    console.error('Error extracting text content:', e);
    return String(content);
  }
};
