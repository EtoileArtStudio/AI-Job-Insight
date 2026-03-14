/**
 * AI共通基盤機能 - 型定義
 * 
 * プロダクト固有の概念を含まない汎用的な型定義
 */

/**
 * AIサービス種別
 */
export type AIService = 'openai' | 'gemini';

/**
 * チャットメッセージの役割
 */
export type MessageRole = 'system' | 'user' | 'assistant';

/**
 * チャットメッセージ
 */
export interface ChatMessage {
  role: MessageRole;
  content: string;
}

/**
 * AI通信処理のリクエスト型
 */
export interface AIClientRequest {
  service: AIService;
  apiKey: string;
  prompt: string;
  modelName: string;
  temperature?: number;
  maxTokens?: number;
}

/**
 * AI通信処理のレスポンス型
 */
export interface AIClientResponse {
  rawResponse?: string;
  error?: Error;
}

/**
 * チャット通信処理のリクエスト型
 */
export interface AIChatRequest {
  service: AIService;
  apiKey: string;
  messages: ChatMessage[];
  modelName: string;
  temperature?: number;
  maxTokens?: number;
}

/**
 * AI応答整形処理のリクエスト型
 */
export interface AITransformRequest {
  rawResponse: string;
  responseFormat?: 'json' | 'text';
}

/**
 * AI応答整形処理のレスポンス型（汎用構造）
 */
export interface GenericAIResponse<T = unknown> {
  content: string;
  structuredData?: T;
  parseError?: string;
}
