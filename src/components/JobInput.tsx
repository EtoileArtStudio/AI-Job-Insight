import { useState, useEffect, useRef } from 'react';
import type { JobData } from '../types';
import { isDemoMode } from '../utils/storage';
import { demoJob } from '../data/demoData';

interface Props {
  data: JobData | null;
  onChange: (data: JobData) => void;
}

function JobInput({ data, onChange }: Props) {
  // デモモード時の初期値を設定（遅延初期化）
  const [description, setDescription] = useState(() => {
    if (data?.description) return data.description;
    if (isDemoMode()) return demoJob.description;
    return '';
  });
  
  const [jobUrl, setJobUrl] = useState(() => {
    if (data?.jobUrl) return data.jobUrl;
    if (isDemoMode()) return demoJob.jobUrl || '';
    return '';
  });
  
  const [memo, setMemo] = useState(() => {
    if (data?.memo) return data.memo;
    if (isDemoMode()) return demoJob.memo || '';
    return '';
  });
  
  // onChangeの最新参照を保持
  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  // 初回マウント時に一度だけonChangeを呼び出す
  const hasMounted = useRef(false);
  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      // 初回マウント時に現在の値を親に伝える
      onChangeRef.current({
        description,
        jobUrl,
        memo,
      });
    }
  }, []); // 空の依存配列で初回のみ実行

  // props変化時にstateを更新（値が実際に変わった時のみ）
  useEffect(() => {
    if (data) {
      setDescription(prev => {
        if (data.description !== prev) return data.description;
        return prev;
      });
      setJobUrl(prev => {
        if ((data.jobUrl || '') !== prev) return data.jobUrl || '';
        return prev;
      });
      setMemo(prev => {
        if ((data.memo || '') !== prev) return data.memo || '';
        return prev;
      });
    } else if (data === null && !isDemoMode()) {
      // データが明示的にnullで、デモモードでない場合はクリア
      setDescription('');
      setJobUrl('');
      setMemo('');
    }
  }, [data]);

  // 状態変化時にonChangeを呼び出す（初回マウント後のみ）
  useEffect(() => {
    if (hasMounted.current) {
      onChangeRef.current({
        description,
        jobUrl,
        memo,
      });
    }
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
