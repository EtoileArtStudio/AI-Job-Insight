/**
 * 星評価表示コンポーネント
 *
 * 数値スコアを星（満星・半星・空星）で視覚化する汎用コンポーネント。
 * Job固有の概念を含まず、任意のスコア表示に再利用可能。
 */

/** StarRating に渡すプロパティ */
interface StarRatingProps {
  /** スコア値（0〜maxStars の範囲） */
  score: number;
  /** 最大星数 */
  maxStars?: number;
  /** 表示サイズ */
  size?: 'small' | 'medium' | 'large';
  /** 読み取り専用フラグ（現時点では常に true） */
  readonly?: boolean;
  /** アクセシビリティ用ラベル */
  ariaLabel?: string;
}

/** サイズ別のフォントサイズ（px） */
const SIZE_MAP: Record<NonNullable<StarRatingProps['size']>, number> = {
  small: 16,
  medium: 24,
  large: 32,
};

/**
 * 星評価表示コンポーネント
 *
 * @example
 * ```tsx
 * <StarRating score={3.5} maxStars={5} size="medium" />
 * ```
 */
function StarRating({
  score,
  maxStars = 5,
  size = 'medium',
  ariaLabel,
}: StarRatingProps) {
  // スコアを 0〜maxStars にクリップ
  const clipped = Math.max(0, Math.min(score, maxStars));

  const fullStars = Math.floor(clipped);
  const hasHalf = clipped % 1 >= 0.5;
  const emptyStars = maxStars - fullStars - (hasHalf ? 1 : 0);

  const fontSize = SIZE_MAP[size];
  const label = ariaLabel ?? `${clipped} out of ${maxStars} stars`;

  return (
    <span role="img" aria-label={label} style={{ display: 'inline-flex', gap: '2px' }}>
      {Array.from({ length: fullStars }, (_, i) => (
        <span key={`full-${i}`} style={{ fontSize, color: '#FFD700' }}>★</span>
      ))}
      {hasHalf && (
        <span key="half" style={{ fontSize, color: '#FFD700' }}>⯨</span>
      )}
      {Array.from({ length: emptyStars }, (_, i) => (
        <span key={`empty-${i}`} style={{ fontSize, color: '#D3D3D3' }}>★</span>
      ))}
    </span>
  );
}

export default StarRating;
export type { StarRatingProps };
