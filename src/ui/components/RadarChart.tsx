/**
 * レーダーチャートコンポーネント
 *
 * 多軸データをレーダーチャートで可視化する汎用コンポーネント。
 * Job固有の軸ラベルや概念を含まず、ラベル・値は外部から注入する。
 */

import {
  Radar,
  RadarChart as RechartsRadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts';

/** レーダーチャートに渡すデータ形式 */
export interface RadarChartData {
  /** 軸ラベル（例：['文書作成', 'Web構築', 'プログラミング']） */
  labels: string[];
  /** 各軸の値（0〜maxValue の範囲） */
  values: number[];
  /** 最大値（デフォルト：100） */
  maxValue?: number;
}

/** RadarChart に渡すプロパティ */
interface RadarChartProps {
  /** チャート表示用データ */
  data: RadarChartData;
  /** チャート幅（px）。未指定時は親要素に追従 */
  width?: number;
  /** チャート高さ（px） */
  height?: number;
  /** アクセシビリティ用ラベル */
  ariaLabel?: string;
}

/**
 * レーダーチャートコンポーネント
 *
 * @example
 * ```tsx
 * <RadarChart
 *   data={{ labels: ['A', 'B', 'C'], values: [80, 60, 90] }}
 *   height={400}
 *   ariaLabel="スキル適合度チャート"
 * />
 * ```
 */
function RadarChart({ data, height = 400, ariaLabel = 'Radar chart' }: RadarChartProps) {
  const { labels, values, maxValue = 100 } = data;

  // ラベルと値の長さを短い方に揃える
  const length = Math.min(labels.length, values.length);
  if (labels.length !== values.length) {
    console.warn(
      `[RadarChart] labels.length (${labels.length}) !== values.length (${values.length}). Truncating to ${length}.`
    );
  }

  // Recharts 用のデータ形式に変換
  const chartData = Array.from({ length }, (_, i) => ({
    subject: labels[i],
    value: values[i],
  }));

  return (
    <div role="img" aria-label={ariaLabel} style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height={height}>
        <RechartsRadarChart data={chartData}>
          <PolarGrid stroke="#E5E7EB" />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fill: '#6B7280', fontSize: 12 }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, maxValue]}
            tick={{ fill: '#6B7280', fontSize: 10 }}
          />
          <Radar
            name="value"
            dataKey="value"
            stroke="#3B82F6"
            fill="#3B82F6"
            fillOpacity={0.6}
          />
        </RechartsRadarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default RadarChart;
export type { RadarChartProps };
