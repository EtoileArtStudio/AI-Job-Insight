/**
 * Job固有機能 - 案件分析サービス
 * 
 * 共通AI基盤機能を使用して案件分析を実行
 */

import type { ApiKeyConfig, ProfileData, JobData, AnalysisResult } from '../../../types';
import { isDemoMode } from '../../../utils/storage';
import { demoAnalysisResult } from '../../../data/demoData';
import { callAI, transformAIResponse } from '../../../core/ai';
import { getAnalysisPrompt } from '../prompts';

/**
 * 案件分析リクエストの型定義
 */
export interface AnalyzeJobRequest {
  profile: ProfileData;
  job: JobData;
  config: ApiKeyConfig;
}

/**
 * 案件分析を実行
 * 
 * デモモードの場合は固定データを返し、通常モードの場合は実際のAI APIを呼び出す
 * 
 * @param request - 案件分析リクエスト
 * @returns 案件分析結果
 */
export async function analyzeJob(request: AnalyzeJobRequest): Promise<AnalysisResult> {
  // デモモード判定
  if (isDemoMode()) {
    // デモモードでは固定のデモデータを返す
    // 少し待機してAI通信の雰囲気を再現
    await new Promise(resolve => setTimeout(resolve, 1500));
    return demoAnalysisResult;
  }

  // 通常モード: 実際のAI通信
  const { profile, job, config } = request;
  
  // プロンプト生成
  const prompt = getAnalysisPrompt(profile, job);
  
  // AI通信実行
  const response = await callAI({
    service: config.service,
    apiKey: config.apiKey,
    modelName: config.modelName,
    prompt,
    temperature: 0.7,
  });
  
  // エラーチェック
  if (response.error) {
    throw response.error;
  }
  
  if (!response.rawResponse) {
    throw new Error('No response from AI');
  }
  
  // レスポンス整形
  const result = transformAIResponse<AnalysisResult>({
    rawResponse: response.rawResponse,
    responseFormat: 'json',
  });
  
  // Parse エラーチェック
  if (result.parseError) {
    throw new Error(`Failed to parse AI response: ${result.parseError}`);
  }
  
  if (!result.structuredData) {
    throw new Error('No structured data in AI response');
  }
  
  return result.structuredData;
}
