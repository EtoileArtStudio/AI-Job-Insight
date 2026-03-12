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
        <div style={{ width: '100%', height: '400px' }}>
          <ResponsiveContainer width="100%" height="100%">
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

interface Props {
  result: AnalysisResultType;
}

function AnalysisResult({ result }: Props) {
  // 星評価の表示
  const renderStars = (score: number) => {
    return '★'.repeat(score) + '☆'.repeat(5 - score);
  };

  return (
    <div style={{
      backgroundColor: '#FFFFFF',
      borderRadius: '8px',
      padding: '24px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    }}>
      <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '24px' }}>
        分析結果
      </h2>

      {/* 応募おすすめ度 */}
      <div style={{ marginBottom: '24px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>
          応募おすすめ度
        </h3>
        <div style={{
          fontSize: '28px',
          color: '#F59E0B',
          letterSpacing: '4px',
        }}>
          {renderStars(result.recommendationScore)}
        </div>
      </div>

      {/* 案件評価理由 */}
      <div style={{
        backgroundColor: '#F9FAFB',
        borderRadius: '6px',
        padding: '16px',
        marginBottom: '24px',
      }}>
        <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>
          評価理由
        </h3>

        {/* 良い点 */}
        <div style={{ marginBottom: '16px' }}>
          <h4 style={{
            fontSize: '14px',
            fontWeight: '600',
            color: '#10B981',
            marginBottom: '8px',
          }}>
            ✓ 良い点
          </h4>
          <ul style={{ marginLeft: '20px', color: '#374151' }}>
            {result.strengths.map((strength, index) => (
              <li key={index} style={{ marginBottom: '4px' }}>{strength}</li>
            ))}
          </ul>
        </div>

        {/* 注意点 */}
        <div>
          <h4 style={{
            fontSize: '14px',
            fontWeight: '600',
            color: '#F59E0B',
            marginBottom: '8px',
          }}>
            ⚠ 注意点
          </h4>
          <ul style={{ marginLeft: '20px', color: '#374151' }}>
            {result.concerns.map((concern, index) => (
              <li key={index} style={{ marginBottom: '4px' }}>{concern}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* スキル適合度 */}
      <div style={{ marginBottom: '24px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>
          スキル適合度
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {result.skillMatch.labels.map((label, index) => {
            const score = result.skillMatch.scores[label] || 0;
            return (
              <div key={index}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '4px',
                  fontSize: '14px',
                }}>
                  <span>{label}</span>
                  <span style={{ fontWeight: '600' }}>{score}%</span>
                </div>
                <div style={{
                  height: '8px',
                  backgroundColor: '#E5E7EB',
                  borderRadius: '4px',
                  overflow: 'hidden',
                }}>
                  <div style={{
                    height: '100%',
                    width: `${score}%`,
                    backgroundColor: '#3B82F6',
                    transition: 'width 0.3s',
                  }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 応募戦略 */}
      <div style={{
        backgroundColor: '#EFF6FF',
        borderRadius: '6px',
        padding: '16px',
      }}>
        <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>
          応募戦略
        </h3>

        {/* 強調すべきスキル */}
        <div style={{ marginBottom: '16px' }}>
          <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
            強調すべきスキル
          </h4>
          <ul style={{ marginLeft: '20px', color: '#374151' }}>
            {result.highlightSkills.map((skill, index) => (
              <li key={index} style={{ marginBottom: '4px' }}>{skill}</li>
            ))}
          </ul>
        </div>

        {/* 提案ポイント */}
        <div>
          <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
            提案ポイント
          </h4>
          <ul style={{ marginLeft: '20px', color: '#374151' }}>
            {result.keyPoints.map((point, index) => (
              <li key={index} style={{ marginBottom: '4px' }}>{point}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* 応答促進メッセージ */}
      <p style={{
        marginTop: '16px',
        fontSize: '14px',
        color: '#6B7280',
        textAlign: 'center',
      }}>
        さらに詳しく知りたい場合は、右側のチャットで質問してください
      </p>
    </div>
  );
}

export default AnalysisResult;
