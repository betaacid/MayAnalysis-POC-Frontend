import { KnowledgeSource } from '@/components/assistant-ui/knowledge-sources-context';

/**
 * Represents detailed information about a knowledge source used in a response
 */
export interface KnowledgeSourceDetail {
  /**
   * Enum value of the knowledge source
   */
  source_enum: KnowledgeSource;

  /**
   * Human-readable display name for the knowledge source
   */
  display_name: string;

  /**
   * Polished text content from this knowledge source used in the response
   */
  text: string;
}

export interface ChatMessageHistory {
  content: string;
  is_user: boolean;
}

/**
 * Response from the chat API including knowledge source details
 */
export interface ChatApiResponse {
  message: string;
  history: ChatMessageHistory[];
  knowledge_source_details?: KnowledgeSourceDetail[];
  chat_thinking?: string;
  search_thinking?: string;
  bias_evaluation?: {
    bias_likelihood: 'low' | 'medium' | 'high' | 'unknown';
    explanation: string;
    biases_detected?: Array<{
      bias_type: string;
      severity: 'low' | 'medium' | 'high';
      description: string;
      location: string;
    }>;
  };
  guardrails_evaluation?: {
    should_proceed: boolean;
    reason: string;
  };
  refined_search_query?: string;
  search_prompt?: string;
}
