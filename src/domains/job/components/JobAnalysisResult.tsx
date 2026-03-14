/**
 * Job固有の分析結果表示コンポーネント
 *
 * 共通UIコンポーネント（StarRating / RadarChart / ResultCard）を利用して
 * 案件分析結果を表示する。Job固有の文言・評価軸ラベルはこのコンポーネントが保持する。
 */

import StarRating from '../../../ui/components/StarRating';
import RadarChart from '../../../ui/components/RadarChart';
import ResultCard from '../../../ui/components/ResultCard';
import type { AnalysisResult } from '../../../types';

interface Props {
  result: AnalysisResult;
}

/**
 * Job分析結果表示コンポーネント
 *
 * AnalysisPage から利用される。
 * - 応募おすすめ度（StarRating）
 * - 良い点 / 注意点（ResultCard）
 * - スキル適合度（RadarChart）
 * - 応募戦略（ResultCard）
 */
function JobAnalysisResult({ result }: Props) {
  // RadarChart 用データ変換（SkillMatchData → RadarChartData）
  const radarData = {
    labels: result.skillMatch.labels,
    values: result.skillMatch.labels.map(label => result.skillMatch.scores[label] ?? 0),
    maxValue: 100,
  };

  return (
    <div
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '8px',
        padding: '24px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      }}
    >
      <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px' }}>
        分析結果
      </h2>

      {/* 応募おすすめ度 */}
      <div style={{ marginBottom: '24px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>
          応募おすすめ度
        </h3>
        <StarRating
          score={result.recommendationScore}
          maxStars={5}
          size="large"
          ariaLabel={`応募おすすめ度 ${result.recommendationScore} / 5`}
        />
      </div>

      {/* 評価理由 */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '16px',
          marginBottom: '24px',
        }}
      >
        {/* 良い点 */}
        <ResultCard title="✓ 良い点" variant="success">
          <ul style={{ margin: 0, paddingLeft: '20px', listStyle: 'none' }}>
            {result.strengths.map((strength, index) => (
              <li
                key={index}
                style={{
                  fontSize: '14px',
                  lineHeight: '1.6',
                  color: '#166534',
                  marginBottom: '8px',
                  position: 'relative',
                }}
              >
                <span
                  style={{
                    position: 'absolute',
                    left: '-20px',
                    color: '#10B981',
                    fontWeight: 'bold',
                  }}
                >
                  ✓
                </span>
                {strength}
              </li>
            ))}
          </ul>
        </ResultCard>

        {/* 注意点 */}
        <ResultCard title="⚠ 注意点" variant="warning">
          <ul style={{ margin: 0, paddingLeft: '20px', listStyle: 'none' }}>
            {result.concerns.map((concern, index) => (
              <li
                key={index}
                style={{
                  fontSize: '14px',
                  lineHeight: '1.6',
                  color: '#92400E',
                  marginBottom: '8px',
                  position: 'relative',
                }}
              >
                <span
                  style={{
                    position: 'absolute',
                    left: '-20px',
                    color: '#F59E0B',
                    fontWeight: 'bold',
                  }}
                >
                  ⚠
                </span>
                {concern}
              </li>
            ))}
          </ul>
        </ResultCard>
      </div>

      {/* スキル適合度（レーダーチャート） */}
      <div style={{ marginBottom: '24px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>
          スキル適合度
        </h3>
        <RadarChart
          data={radarData}
          height={400}
          ariaLabel="案件とのスキル適合度チャート"
        />
      </div>

      {/* 応募戦略 */}
      <ResultCard title="💡 応募戦略" variant="info">
        {/* 強調すべきスキル */}
        <div style={{ marginBottom: '16px' }}>
          <h4
            style={{
              fontSize: '14px',
              fontWeight: '600',
              color: '#1E40AF',
              marginBottom: '8px',
            }}
          >
            強調すべきスキル
          </h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {result.highlightSkills.map((skill, index) => (
              <span
                key={index}
                style={{
                  padding: '6px 12px',
                  backgroundColor: '#3B82F6',
                  color: '#FFFFFF',
                  borderRadius: '16px',
                  fontSize: '13px',
                  fontWeight: '500',
                }}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* 提案ポイント */}
        <div>
          <h4
            style={{
              fontSize: '14px',
              fontWeight: '600',
              color: '#1E40AF',
              marginBottom: '8px',
            }}
          >
            提案ポイント
          </h4>
          <ul style={{ margin: 0, paddingLeft: '20px' }}>
            {result.keyPoints.map((point, index) => (
              <li
                key={index}
                style={{
                  fontSize: '14px',
                  lineHeight: '1.6',
                  color: '#1E40AF',
                  marginBottom: '8px',
                }}
              >
                {point}
              </li>
            ))}
          </ul>
        </div>
      </ResultCard>
    </div>
  );
}

export default JobAnalysisResult;
