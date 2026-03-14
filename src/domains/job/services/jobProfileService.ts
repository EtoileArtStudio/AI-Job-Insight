/**
 * Job固有機能 - プロフィール生成サービス
 * 
 * 共通AI基盤機能を使用してプロフィール文を生成
 */

import type { ApiKeyConfig, ProfileData } from '../../../types';
import { isDemoMode } from '../../../utils/storage';
import { demoGeneratedProfileText } from '../../../data/demoData';
import { callAI } from '../../../core/ai';
import { getNewProfilePrompt, getImproveProfilePrompt } from '../prompts';

/**
 * プロフィール文生成リクエストの型定義
 */
export interface GenerateProfileTextRequest {
  profile: ProfileData;
  config: ApiKeyConfig;
  existingText?: string;
}

/**
 * プロフィール文を生成
 * 
 * デモモードの場合は固定のプロフィール文を返し、通常モードの場合は実際のAI APIを呼び出す
 * 
 * @param request - プロフィール文生成リクエスト
 * @returns 生成されたプロフィール文
 */
export async function generateProfileText(request: GenerateProfileTextRequest): Promise<string> {
  // デモモード判定
  if (isDemoMode()) {
    // デモモードでは固定のプロフィール文を返す
    await new Promise(resolve => setTimeout(resolve, 1500));
    return demoGeneratedProfileText;
  }

  // 通常モード: 実際のAI通信
  const { profile, config, existingText } = request;
  const limit = profile.profileTextLimit || 1000;

  // プロンプト生成
  const prompt = existingText
    ? getImproveProfilePrompt(profile, existingText, limit)
    : getNewProfilePrompt(profile, limit);
  
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
  
  return response.rawResponse;
}
