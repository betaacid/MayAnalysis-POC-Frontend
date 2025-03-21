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

/**
 * Response from the chat API including knowledge source details
 */
export interface ChatApiResponse {
  message: string;
  history: Array<{
    content: string;
    is_user: boolean;
  }>;
  knowledge_source_details: KnowledgeSourceDetail[] | null;
  thinking?: string;
}
