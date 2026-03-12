import { useState, useEffect, useRef } from 'react';
import type { JobData } from '../types';

interface Props {
  data: JobData | null;
  onChange: (data: JobData) => void;
}

function JobInput({ data, onChange }: Props) {
  const [description, setDescription] = useState(data?.description || '');
  const [jobUrl, setJobUrl] = useState(data?.jobUrl || '');
  const [memo, setMemo] = useState(data?.memo || '');
  
  // onChangeの最新参照を保持
  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  // props変化時にstateを更新
  useEffect(() => {
    if (data) {
      setDescription(data.description);
      setJobUrl(data.jobUrl || '');
      setMemo(data.memo || '');
    } else {
      setDescription('');
      setJobUrl('');
      setMemo('');
    }
  }, [data]);

  useEffect(() => {
    onChangeRef.current({
      description,
      jobUrl,
      memo,
    });
  }, [description, jobUrl, memo]);

  return (
    <div style={{
      backgroundColor: '#FFFFFF',
      borderRadius: '8px',
      padding: '24px',
      marginBottom: '24px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    }}>
      <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>
        2. 案件情報入力
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* 案件説明 */}
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
            案件説明 <span style={{ color: '#EF4444' }}>*</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="クラウドソーシングサイトの案件詳細をコピー&ペーストしてください&#10;&#10;仕事内容、必須スキル、条件、報酬などすべての情報を含めてください"
            rows={10}
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #E5E7EB',
              borderRadius: '6px',
              fontSize: '14px',
              lineHeight: '1.6',
              resize: 'vertical',
            }}
          />
          <p style={{ fontSize: '12px', color: '#6B7280', marginTop: '4px' }}>
            💡 案件ページの内容をそのままコピー&ペーストしてください
          </p>
        </div>

        {/* 案件URL */}
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
            案件URL
          </label>
          <input
            type="url"
            value={jobUrl}
            onChange={(e) => setJobUrl(e.target.value)}
            placeholder="https://crowdworks.jp/public/jobs/12345"
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #E5E7EB',
              borderRadius: '6px',
              fontSize: '14px',
            }}
          />
        </div>

        {/* 案件メモ */}
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
            案件メモ
          </label>
          <textarea
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            placeholder="個人的なメモを入力してください"
            rows={3}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #E5E7EB',
              borderRadius: '6px',
              fontSize: '14px',
              resize: 'vertical',
            }}
          />
          <p style={{ fontSize: '12px', color: '#6B7280', marginTop: '4px' }}>
            このメモは分析には使用されません
          </p>
        </div>
      </div>
    </div>
  );
}

export default JobInput;
