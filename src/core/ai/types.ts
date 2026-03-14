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
  /** AIサービス種別 (openai | gemini) */
  service: AIService;
  /** APIキー */
  apiKey: string;
  /** 送信するプロンプト */
  prompt: string;
  /** 使用するモデル名 */
  modelName: string;
  /** 温度パラメータ (0.0-1.0) デフォルト: 0.7 */
  temperature?: number;
  /** 最大トークン数 */
  maxTokens?: number;
}

/**
 * AI通信処理のレスポンス型
 */
export interface AIClientResponse {
  /** AI APIからの生レスポンス */
  rawResponse?: string;
  /** エラーが発生した場合のエラーオブジェクト */
  error?: Error;
}

/**
 * チャット通信処理のリクエスト型
 */
export interface AIChatRequest {
  /** AIサービス種別 (openai | gemini) */
  service: AIService;
  /** APIキー */
  apiKey: string;
  /** チャットメッセージ配列 */
  messages: ChatMessage[];
  /** 使用するモデル名 */
  modelName: string;
  /** 温度パラメータ (0.0-1.0) デフォルト: 0.7 */
  temperature?: number;
  /** 最大トークン数 */
  maxTokens?: number;
}

/**
 * AI応答整形処理のリクエスト型
 */
export interface AITransformRequest {
  /** AI APIからの生レスポンス */
  rawResponse: string;
  /** レスポンス形式 (json | text) デフォルト: text */
  responseFormat?: 'json' | 'text';
}

/**
 * AI応答整形処理のレスポンス型（汎用構造）
 */
export interface GenericAIResponse<T = unknown> {
  /** レスポンス文字列 */
  content: string;
  /** パース済みの構造化データ (responseFormat='json'の場合) */
  structuredData?: T;
  /** パースエラーメッセージ */
  parseError?: string;
}
