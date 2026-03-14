/**
 * Job固有機能 - プロフィール生成プロンプト定義
 * 
 * プロフィール文生成用のプロンプトを提供
 */

import type { ProfileData } from '../../../types';

/**
 * 新規プロフィール文生成用のプロンプトを生成
 * 
 * @param profile - プロフィールデータ
 * @param limit - 文字数上限
 * @returns 新規プロフィール文生成用プロンプト
 */
export function getNewProfilePrompt(profile: ProfileData, limit: number): string {
  return `以下のプロフィール情報をもとに、クラウドソーシングサイトのプロフィール欄に掲載可能なプロフィール文を${limit}文字以内で生成してください。

【プロフィール情報】
自己紹介：${profile.selfIntroduction}
スキル：${profile.skills.join(', ')}
実績：${profile.achievements}
得意分野：${profile.specialty}

【生成条件】
- 文字数上限：${limit}文字以内
- クライアントに好印象を与える内容にする
- 具体的な実績を含める
- 読みやすい構成にする

プロフィール文のみを出力してください。`;
}

/**
 * 既存プロフィール文改善用のプロンプトを生成
 * 
 * @param profile - プロフィールデータ
 * @param existingText - 既存のプロフィール文
 * @param limit - 文字数上限
 * @returns プロフィール文改善用プロンプト
 */
export function getImproveProfilePrompt(
  profile: ProfileData,
  existingText: string,
  limit: number
): string {
  return `以下の既存プロフィール文を改善してください。

【現在のプロフィール文】
${existingText}

【プロフィール情報】
自己紹介：${profile.selfIntroduction}
スキル：${profile.skills.join(', ')}
実績：${profile.achievements}
得意分野：${profile.specialty}

【改善条件】
- 文字数上限：${limit}文字以内
- より魅力的な表現にする
- 具体性を高める
- 読みやすさを向上させる

改善後のプロフィール文のみを出力してください。`;
}
