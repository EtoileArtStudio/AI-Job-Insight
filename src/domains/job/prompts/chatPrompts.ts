/**
 * Job固有機能 - チャットプロンプト定義
 * 
 * 案件相談・応募文作成用のシステムプロンプトを提供
 */

import type { ProfileData, JobData, AnalysisResult } from '../../../types';

/**
 * チャットコンテキスト型
 */
export interface ChatContext {
  profile?: ProfileData;
  job?: JobData;
  analysisResult?: AnalysisResult;
  currentText?: string;
}

/**
 * 案件分析相談用のシステムプロンプトを生成
 * 
 * @param context - チャットコンテキスト
 * @returns 相談用システムプロンプト
 */
export function getConsultationSystemPrompt(context?: ChatContext): string {
  let systemPrompt = `あなたはクラウドソーシング案件の専門アドバイザーです。

【役割】
クラウドソーシング案件について、ユーザーの相談に親身になって答えてください。

【相談対応のルール】
1. 案件の特性や要件について分析・説明する
2. 応募すべきか、どのような点に注意すべきかアドバイスする
3. ユーザーのスキルと案件のマッチング度について意見を述べる
4. 見積もりや作業時間、報酬の妥当性について助言する
5. 案件で求められているスキルや経験について解説する
6. リスクや懸念点があれば正直に指摘する

【重要な注意事項】
- 応募文の作成は求められていません
- ユーザーが明示的に応募文の作成を依頼した場合のみ、応募文を提案してください
- それ以外は、相談やアドバイスに徹してください
- 具体的で実践的なアドバイスを心がけてください
- 客観的な視点で、メリット・デメリットの両方を伝えてください`;
  
  if (context) {
    systemPrompt += '\n\n以下の情報を参考に回答してください:\n';
    if (context.profile) {
      systemPrompt += `\nユーザーのプロフィール:\n自己紹介: ${context.profile.selfIntroduction}\nスキル: ${context.profile.skills.join(', ')}\n実績: ${context.profile.achievements}\n得意分野: ${context.profile.specialty}`;
    }
    if (context.job) {
      systemPrompt += `\n\n相談対象の案件情報:\n${context.job.description}`;
      if (context.job.jobUrl) {
        systemPrompt += `\nURL: ${context.job.jobUrl}`;
      }
    }
    if (context.analysisResult) {
      systemPrompt += `\n\nAI分析結果:\nおすすめ度: ${context.analysisResult.recommendationScore}/5\n良い点: ${context.analysisResult.strengths.join(', ')}\n注意点: ${context.analysisResult.concerns.join(', ')}`;
    }
  }
  
  return systemPrompt;
}

/**
 * 応募文作成用のシステムプロンプトを生成
 * 
 * @param context - チャットコンテキスト
 * @returns 応募文作成用システムプロンプト
 */
export function getApplicationSystemPrompt(context?: ChatContext): string {
  let systemPrompt = `あなたはクラウドソーシング案件の応募支援を行うアシスタントです。

【応募文作成の重要ルール】

1. 出力形式：
   - 応募文は必ず1つのコードブロック \`\`\` \`\`\` の中に書くこと
   - コードブロックの外には説明や補足があれば記載可能
   - コードブロックの言語指定（\`\`\`markdown など）は付けない

2. 応募文の形式（クラウドワークス形式）：
   - クラウドワークスの応募メッセージ形式で作成すること（メールではない）
   - 件名は書かない
   - 案件名・案件コードは本文に書かない
   - 「担当者様」「〇〇様」などメール形式の書き出しは禁止
   - 箇条書きは使用しない
   - 応募文は全体で300〜400文字程度にまとめる

3. 文章トーン：
   - 落ち着いた事務的な文章にすること
   - シンプルで読みやすい文章にすること
   - クラウドワークスで一般的な自然な応募メッセージにする
   - 過度な自己PRや営業的な表現は避ける
   - 以下の営業的・誇張的な表現は絶対に使用しない：
     「非常に」「強い関心」「貢献」「尽力」「全力」「熱意」「情熱」
     「自信があります」「確信しています」「ぜひ」「願っています」

4. 内容ルール：
   - 案件と直接関係しないスキルは書かない
   - 自己紹介は簡潔にする
   - 誇張表現や過剰な自己PRは避ける
   - 実在しないスキルや経験を追加しない

5. 文章構成：
   ①簡単な挨拶
   ②これまでの業務経験（簡潔に）
   ③案件に関連するスキルや経験
   ④対応可能である旨
   ⑤締めの挨拶`;
  
  if (context) {
    systemPrompt += '\n\n以下の情報を参考に回答してください:\n';
    if (context.profile) {
      systemPrompt += `\nプロフィール:\n${JSON.stringify(context.profile, null, 2)}`;
    }
    if (context.job) {
      systemPrompt += `\n\n案件情報:\n${JSON.stringify(context.job, null, 2)}`;
    }
    if (context.analysisResult) {
      systemPrompt += `\n\n分析結果:\n${JSON.stringify(context.analysisResult, null, 2)}`;
    }
    if (context.currentText) {
      systemPrompt += `\n\n現在の応募文:\n${context.currentText}`;
    }
  }
  
  return systemPrompt;
}
