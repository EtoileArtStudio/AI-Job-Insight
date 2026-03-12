import { useState, useEffect } from 'react';
import type { JobData } from '../types';

interface Props {
  data: JobData | null;
  onChange: (data: JobData) => void;
}

function JobInput({ data, onChange }: Props) {
  const [description, setDescription] = useState(data?.description || '');
  const [workDetails, setWorkDetails] = useState(data?.workDetails || '');
  const [requirements, setRequirements] = useState(data?.requirements || '');
  const [payment, setPayment] = useState(data?.payment || '');
  const [jobUrl, setJobUrl] = useState(data?.jobUrl || '');
  const [memo, setMemo] = useState(data?.memo || '');

  useEffect(() => {
    onChange({
      description,
      workDetails,
      requirements,
      payment,
      jobUrl,
      memo,
    });
  }, [description, workDetails, requirements, payment, jobUrl, memo]);

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
            placeholder="クラウドソーシングサイトに掲載されている案件説明文をコピー&ペーストしてください"
            rows={5}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #E5E7EB',
              borderRadius: '6px',
              fontSize: '14px',
              resize: 'vertical',
            }}
          />
        </div>

        {/* 仕事内容 */}
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
            仕事内容 <span style={{ color: '#EF4444' }}>*</span>
          </label>
          <textarea
            value={workDetails}
            onChange={(e) => setWorkDetails(e.target.value)}
            placeholder="具体的な作業内容、成果物などを入力してください"
            rows={5}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #E5E7EB',
              borderRadius: '6px',
              fontSize: '14px',
              resize: 'vertical',
            }}
          />
        </div>

        {/* 条件 */}
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
            条件 <span style={{ color: '#EF4444' }}>*</span>
          </label>
          <textarea
            value={requirements}
            onChange={(e) => setRequirements(e.target.value)}
            placeholder="必要なスキル、経験、納期などの条件を入力してください"
            rows={4}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #E5E7EB',
              borderRadius: '6px',
              fontSize: '14px',
              resize: 'vertical',
            }}
          />
        </div>

        {/* 報酬 */}
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
            報酬 <span style={{ color: '#EF4444' }}>*</span>
          </label>
          <input
            type="text"
            value={payment}
            onChange={(e) => setPayment(e.target.value)}
            placeholder="80,000円"
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #E5E7EB',
              borderRadius: '6px',
              fontSize: '14px',
            }}
          />
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
            placeholder="https://example.com/job/12345"
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #E5E7EB',
              borderRadius: '6px',
              fontSize: '14px',
            }}
          />
          <p style={{ fontSize: '12px', color: '#6B7280', marginTop: '4px' }}>
            後で閲覧・編集するためのメモ用途
          </p>
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
            分析には使用しない、ユーザーのメモ用途
          </p>
        </div>
      </div>
    </div>
  );
}

export default JobInput;
