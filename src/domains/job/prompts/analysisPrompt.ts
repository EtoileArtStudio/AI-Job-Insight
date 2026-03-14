/**
 * Job固有機能 - 案件分析プロンプト定義
 * 
 * 案件分析用のプロンプトテンプレートを提供
 */

import type { ProfileData, JobData } from '../../../types';

/**
 * 案件分析用のプロンプトを生成
 * 
 * @param profile - ユーザーのプロフィール情報
 * @param job - 案件情報
 * @returns 案件分析用プロンプト
 */
export function getAnalysisPrompt(profile: ProfileData, job: JobData): string {
  return `
あなたはクラウドソーシング案件分析の専門家です。以下のプロフィールと案件情報を分析してください。

# プロフィール
自己紹介: ${profile.selfIntroduction}
スキル: ${profile.skills.join(', ')}
実績: ${profile.achievements}
得意分野: ${profile.specialty}

# 案件情報
${job.description}


# 分析指示
以下の形式でJSON形式で回答してください:
{
  "recommendationScore": 1から5の整数,
  "strengths": ["良い点1", "良い点2", ...],
  "concerns": ["注意点1", "注意点2", ...],
  "skillMatch": {
    "labels": ${JSON.stringify(profile.skills)},
    "scores": {各スキルごとに0-100の数値で適合度を評価}
  },
  "highlightSkills": ["強調すべきスキル1", "強調すべきスキル2", ...],
  "keyPoints": ["提案ポイント1", "提案ポイント2", ...]
}

skillMatchのscoresは、プロフィールのスキルリストの各項目について、この案件での適合度を0-100で評価してください。
`;
}
