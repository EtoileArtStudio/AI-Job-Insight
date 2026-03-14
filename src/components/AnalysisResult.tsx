import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import type { AnalysisResult as AnalysisResultType } from '../types';

interface Props {
  result: AnalysisResultType;
}

function AnalysisResult({ result }: Props) {
  // レーダーチャート用のデータを準備
  const radarData = result.skillMatch.labels.map(label => ({
    skill: label,
    score: result.skillMatch.scores[label] || 0,
  }));

  // 星の描画
  const renderStars = (score: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        style={{
          fontSize: '24px',
          color: i < score ? '#F59E0B' : '#E5E7EB',
        }}
      >
        ★
      </span>
    ));
  };

  return (
    <div style={{
      backgroundColor: '#FFFFFF',
      borderRadius: '8px',
      padding: '24px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    }}>
      <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px' }}>
        分析結果
      </h2>

      {/* 応募おすすめ度 */}
      <div style={{ marginBottom: '24px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>
          応募おすすめ度
        </h3>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {renderStars(result.recommendationScore)}
        </div>
      </div>

      {/* 評価理由 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
        {/* 良い点 */}
        <div style={{
          padding: '16px',
          backgroundColor: '#F0FDF4',
          borderRadius: '8px',
          border: '1px solid #BBF7D0',
        }}>
          <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#166534', marginBottom: '12px' }}>
            ✓ 良い点
          </h4>
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
                <span style={{ position: 'absolute', left: '-20px', color: '#10B981', fontWeight: 'bold' }}>✓</span>
                {strength}
              </li>
            ))}
          </ul>
        </div>

        {/* 注意点 */}
        <div style={{
          padding: '16px',
          backgroundColor: '#FEF3C7',
          borderRadius: '8px',
          border: '1px solid #FDE68A',
        }}>
          <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#92400E', marginBottom: '12px' }}>
            ⚠ 注意点
          </h4>
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
                <span style={{ position: 'absolute', left: '-20px', color: '#F59E0B', fontWeight: 'bold' }}>⚠</span>
                {concern}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* スキル適合度（レーダーチャート） */}
      <div style={{ marginBottom: '24px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>
          スキル適合度
        </h3>
        <div style={{ width: '100%', height: '400px', minHeight: '400px' }}>
          <ResponsiveContainer width="100%" height={400} minHeight={400}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#E5E7EB" />
              <PolarAngleAxis
                dataKey="skill"
                tick={{ fill: '#6B7280', fontSize: 12 }}
              />
              <PolarRadiusAxis
                angle={90}
                domain={[0, 100]}
                tick={{ fill: '#6B7280', fontSize: 10 }}
              />
              <Radar
                name="適合度"
                dataKey="score"
                stroke="#3B82F6"
                fill="#3B82F6"
                fillOpacity={0.6}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 応募戦略 */}
      <div style={{
        padding: '20px',
        backgroundColor: '#EFF6FF',
        borderRadius: '8px',
        border: '1px solid #BFDBFE',
      }}>
        <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1E40AF', marginBottom: '16px' }}>
          💡 応募戦略
        </h3>

        {/* 強調すべきスキル */}
        <div style={{ marginBottom: '16px' }}>
          <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#1E40AF', marginBottom: '8px' }}>
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
          <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#1E40AF', marginBottom: '8px' }}>
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
      </div>
    </div>
  );
}

export default AnalysisResult;
