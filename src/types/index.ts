/**
 * プロフィール情報の型定義
 */
export interface ProfileData {
  /** 自己紹介 */
  selfIntroduction: string;
  /** スキル */
  skills: string;
  /** 実績 */
  achievements: string;
  /** 得意分野 */
  specialty: string;
  /** スキル項目ラベル（カンマ区切り） */
  skillLabels?: string;
  /** プロフィール文文字数上限 */
  profileTextLimit?: number;
}

/**
 * 案件情報の型定義
 */
export interface JobData {
  /** 案件説明 */
  description: string;
  /** 仕事内容 */
  workDetails: string;
  /** 条件 */
  requirements: string;
  /** 報酬 */
  payment: string;
  /** 案件URL（任意） */
  jobUrl?: string;
  /** 案件メモ（任意） */
  memo?: string;
}

/**
 * 分析結果の型定義
 */
export interface AnalysisResult {
  /** 応募おすすめ度（1-5） */
  recommendationScore: number;
  /** 良い点 */
  strengths: string[];
  /** 注意点 */
  concerns: string[];
  /** スキル適合度データ */
  skillMatch: SkillMatchData;
  /** 強調すべきスキル */
  highlightSkills: string[];
  /** 提案ポイント */
  keyPoints: string[];
}

/**
 * スキル適合度データの型定義
 */
export interface SkillMatchData {
  /** 各スキルカテゴリのスコア（0-100） */
  scores: { [category: string]: number };
  /** カテゴリラベル */
  labels: string[];
}

/**
 * APIキー設定の型定義
 */
export interface ApiKeyConfig {
  /** AIサービス種別 */
  service: 'openai' | 'gemini';
  /** APIキー */
  apiKey: string;
  /** モデル名 */
  modelName: string;
}

/**
 * チャットメッセージの型定義
 */
export interface ChatMessage {
  /** メッセージID */
  id: string;
  /** 送信者（user | ai） */
  role: 'user' | 'ai';
  /** メッセージ内容 */
  content: string;
  /** タイムスタンプ */
  timestamp: number;
}

/**
 * 履歴データの型定義
 */
export interface HistoryItem {
  /** 履歴ID */
  id: string;
  /** 分析日時 */
  analyzedAt: number;
  /** プロフィール情報 */
  profile: ProfileData;
  /** 案件情報 */
  job: JobData;
  /** 分析結果 */
  result: AnalysisResult;
}

/**
 * テンプレートの型定義
 */
export interface Template {
  /** テンプレートID */
  id: string;
  /** テンプレート名 */
  name: string;
  /** テンプレート内容 */
  content: string;
  /** 作成日時 */
  createdAt: number;
}

/**
 * 応募予定案件の型定義
 */
export interface PlannedApplication {
  /** 案件ID */
  id: string;
  /** 案件情報 */
  job: JobData;
  /** 分析結果 */
  result: AnalysisResult;
  /** 追加日時 */
  addedAt: number;
}
