/**
 * 結果カード表示コンポーネント
 *
 * タイトル・説明・スコア・追加コンテンツを汎用的に表示するカードコンポーネント。
 * Job固有の概念を含まず、任意の結果表示に再利用可能。
 */

import type { ReactNode } from 'react';

/** カードの表示バリエーション */
type CardVariant = 'default' | 'success' | 'warning' | 'info';

/** ResultCard に渡すプロパティ */
interface ResultCardProps {
  /** カードタイトル */
  title: string;
  /** 説明文 */
  description?: string;
  /** スコア（表示する場合） */
  score?: number;
  /** スコアラベル */
  scoreLabel?: string;
  /** カード内に表示する追加コンテンツ */
  children?: ReactNode;
  /** 表示バリエーション */
  variant?: CardVariant;
}

/** バリエーション別スタイル定義 */
const VARIANT_STYLES: Record<CardVariant, { bg: string; border: string; titleColor: string }> = {
  default: { bg: '#FFFFFF', border: '#E5E7EB', titleColor: '#111827' },
  success: { bg: '#F0FDF4', border: '#86EFAC', titleColor: '#166534' },
  warning: { bg: '#FEF3C7', border: '#FCD34D', titleColor: '#92400E' },
  info:    { bg: '#EFF6FF', border: '#93C5FD', titleColor: '#1E40AF' },
};

/**
 * 結果カード表示コンポーネント
 *
 * @example
 * ```tsx
 * <ResultCard title="良い点" variant="success">
 *   <ul>...</ul>
 * </ResultCard>
 * ```
 */
function ResultCard({
  title,
  description,
  score,
  scoreLabel = 'Score',
  children,
  variant = 'default',
}: ResultCardProps) {
  const { bg, border, titleColor } = VARIANT_STYLES[variant];

  return (
    <div
      style={{
        backgroundColor: bg,
        border: `1px solid ${border}`,
        borderRadius: '8px',
        padding: '24px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        marginBottom: '16px',
      }}
    >
      {/* タイトル */}
      <h3
        style={{
          fontSize: '18px',
          fontWeight: 600,
          color: titleColor,
          marginBottom: score !== undefined || description || children ? '12px' : 0,
        }}
      >
        {title}
      </h3>

      {/* スコア */}
      {score !== undefined && (
        <p
          style={{
            fontSize: '20px',
            fontWeight: 700,
            color: titleColor,
            marginBottom: description || children ? '8px' : 0,
          }}
        >
          {scoreLabel}: {score}
        </p>
      )}

      {/* 説明文 */}
      {description && (
        <p
          style={{
            fontSize: '14px',
            lineHeight: '1.6',
            color: titleColor,
            marginBottom: children ? '12px' : 0,
          }}
        >
          {description}
        </p>
      )}

      {/* 追加コンテンツ */}
      {children}
    </div>
  );
}

export default ResultCard;
export type { ResultCardProps, CardVariant };
