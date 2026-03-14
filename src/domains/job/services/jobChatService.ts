/**
 * Job固有機能 - チャットサービス
 * 
 * 共通AI基盤機能を使用してチャット機能を実行
 */

import type { ApiKeyConfig, ChatMessage as AppChatMessage } from '../../../types';
import type { ChatContext } from '../prompts';
import { isDemoMode } from '../../../utils/storage';
import { demoAIResponses, demoApplicationSuggestions } from '../../../data/demoData';
import { callAIChat, type ChatMessage } from '../../../core/ai';
import { getConsultationSystemPrompt, getApplicationSystemPrompt } from '../prompts';

/**
 * チャットリクエストの型定義
 */
export interface ChatRequest {
  messages: AppChatMessage[];
  context?: ChatContext;
  config: ApiKeyConfig;
  mode?: 'application' | 'consultation';
}

/**
 * AIチャットを実行
 * 
 * デモモードの場合は固定応答を返し、通常モードの場合は実際のAI APIを呼び出す
 * 
 * @param request - チャットリクエスト
 * @returns AIのチャット応答
 */
export async function chatWithAI(request: ChatRequest): Promise<string> {
  // デモモード判定
  if (isDemoMode()) {
    // デモモードでは固定応答を返す
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // ユーザーの最後のメッセージを取得
    const lastUserMessage = request.messages
      .filter(msg => msg.role === 'user')
      .pop();
    
    if (!lastUserMessage) {
      return demoAIResponses.general;
    }

    const userMessage = lastUserMessage.content.toLowerCase();
    
    // 応募文作成・改善の判定
    if (userMessage.includes('応募文章を作成') || 
        userMessage.includes('プロフィールに基づいて') ||
        (userMessage.includes('応募') && userMessage.includes('作成'))) {
      return demoApplicationSuggestions.initial;
    } else if (userMessage.includes('応募文章を改善') || 
               userMessage.includes('現在の文章') ||
               (userMessage.includes('応募') && userMessage.includes('改善'))) {
      return demoApplicationSuggestions.improve;
    }
    
    // キーワードに応じて適切な応答を返す
    if (userMessage.includes('戦略') || userMessage.includes('アピール')) {
      return demoAIResponses.strategy;
    } else if (userMessage.includes('報酬') || userMessage.includes('単価') || userMessage.includes('値段')) {
      return demoAIResponses.compensation;
    } else if (userMessage.includes('注意') || userMessage.includes('リスク') || userMessage.includes('気をつける')) {
      return demoAIResponses.concerns;
    } else if (userMessage.includes('応募文') || userMessage.includes('提案文')) {
      return demoAIResponses.application;
    } else {
      return demoAIResponses.general;
    }
  }

  // 通常モード: 実際のAI通信
  const { messages, context, config, mode = 'application' } = request;
  
  // システムプロンプト生成
  const systemPrompt = mode === 'consultation'
    ? getConsultationSystemPrompt(context)
    : getApplicationSystemPrompt(context);
  
  // ChatMessage配列を作成
  const chatMessages: ChatMessage[] = [
    { role: 'system', content: systemPrompt },
    ...messages.map(msg => ({
      role: msg.role === 'user' ? 'user' as const : 'assistant' as const,
      content: msg.content,
    })),
  ];
  
  // AI通信実行
  const response = await callAIChat({
    service: config.service,
    apiKey: config.apiKey,
    modelName: config.modelName,
    messages: chatMessages,
    temperature: 0.7,
  });
  
  // エラーチェック
  if (response.error) {
    throw response.error;
  }
  
  if (!response.rawResponse) {
    throw new Error('No response from AI');
  }
  
  return response.rawResponse;
}
