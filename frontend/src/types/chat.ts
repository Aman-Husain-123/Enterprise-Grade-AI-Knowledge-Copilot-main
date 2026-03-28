export type MessageRole = 'user' | 'assistant' | 'system';

export interface MessageOut {
  id: string;
  conversationId: string;
  role: MessageRole;
  content: string;
  model?: string;
  sources?: SourceCitation[];
  feedback?: {
    rating: 'up' | 'down';
    comment?: string;
  };
  tokenCount?: number;
  processingTimeMs?: number;
  createdAt: string;
}

export interface ConversationOut {
  id: string;
  title: string;
  userId: string;
  model: string;
  isPinned: boolean;
  isShared: boolean;
  shareUrl?: string;
  messageCount: number;
  lastMessage?: string;
  lastMessageAt?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface SourceCitation {
  id: string;
  documentId: string;
  documentName: string;
  documentType: string;
  pageNumber?: number;
  chunkText: string;
  relevanceScore: number;
  url?: string;
  connectorType?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
