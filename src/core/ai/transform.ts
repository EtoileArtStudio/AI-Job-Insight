/**
 * AI共通基盤機能 - AI応答整形処理
 * 
 * AI APIからの生レスポンスを構造化データに変換する汎用的な関数
 * プロダクト固有の概念を含まない
 */

import type { AITransformRequest, GenericAIResponse } from './types';

/**
 * AI応答を整形・構造化
 * 
 * @param params - 整形パラメータ
 * @returns 整形済みデータ
 */
export function transformAIResponse<T = unknown>(params: AITransformRequest): GenericAIResponse<T> {
  const { rawResponse, responseFormat = 'text' } = params;

  if (!rawResponse || rawResponse.trim() === '') {
    return {
      content: '',
      structuredData: undefined,
      parseError: 'Empty response',
    };
  }

  const content = rawResponse.trim();

  if (responseFormat === 'json') {
    try {
      // JSONブロックから抽出（```json ... ``` の場合に対応）
      const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/) 
        || content.match(/```\s*([\s\S]*?)\s*```/);
      const jsonString = jsonMatch ? jsonMatch[1] : content;
      
      const parsed = JSON.parse(jsonString.trim());
      
      return {
        content,
        structuredData: parsed as T,
      };
    } catch (error) {
      console.error('Failed to parse AI response as JSON:', content);
      return {
        content,
        structuredData: undefined,
        parseError: error instanceof Error ? error.message : 'JSON parse error',
      };
    }
  }

  // responseFormat === 'text' の場合
  return {
    content,
    structuredData: undefined,
  };
}
