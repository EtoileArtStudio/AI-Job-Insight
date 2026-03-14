import { useState } from 'react';
import type { ProfileData, JobData, AnalysisResult, ChatMessage, ApiKeyConfig } from '../types';
import { chatWithAI } from '../domains/job/services';

interface Props {
  profile: ProfileData | null;
  job: JobData | null;
  analysisResult: AnalysisResult | null;
  apiConfig: ApiKeyConfig | null;
}

function ChatInterface({ profile, job, analysisResult, apiConfig }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || !apiConfig) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await chatWithAI({
        messages: [...messages, userMessage],
        context: {
          profile: profile || undefined,
          job: job || undefined,
          analysisResult: analysisResult || undefined,
        },
        config: apiConfig,
      });

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: response,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: 'エラーが発生しました。もう一度お試しください。',
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      backgroundColor: '#FFFFFF',
      borderRadius: '8px',
      padding: '24px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      display: 'flex',
      flexDirection: 'column',
      height: '600px',
    }}>
      <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>
        AI相談チャット
      </h2>

      {/* メッセージ表示エリア */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        backgroundColor: '#F9FAFB',
        borderRadius: '6px',
        padding: '16px',
        marginBottom: '16px',
      }}>
        {messages.length === 0 ? (
          <p style={{ color: '#6B7280', textAlign: 'center' }}>
            分析結果について質問してください
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {messages.map((message) => (
              <div
                key={message.id}
                style={{
                  display: 'flex',
                  justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start',
                }}
              >
                <div
                  style={{
                    maxWidth: '80%',
                    padding: '12px 16px',
                    borderRadius: '16px',
                    backgroundColor: message.role === 'user' ? '#3B82F6' : '#FFFFFF',
                    color: message.role === 'user' ? '#FFFFFF' : '#1E293B',
                    boxShadow: message.role === 'ai' ? '0 1px 2px rgba(0,0,0,0.1)' : 'none',
                  }}
                >
                  {message.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div style={{
                  padding: '12px 16px',
                  borderRadius: '16px',
                  backgroundColor: '#FFFFFF',
                  color: '#6B7280',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                }}>
                  考え中...
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* メッセージ入力エリア */}
      <div style={{ display: 'flex', gap: '8px' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="メッセージを入力..."
          disabled={isLoading}
          style={{
            flex: 1,
            padding: '12px 16px',
            border: '1px solid #E5E7EB',
            borderRadius: '24px',
            fontSize: '14px',
            outline: 'none',
          }}
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || isLoading}
          style={{
            width: '36px',
            height: '36px',
            backgroundColor: input.trim() && !isLoading ? '#3B82F6' : '#9CA3AF',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '50%',
            cursor: input.trim() && !isLoading ? 'pointer' : 'not-allowed',
            fontSize: '18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            alignSelf: 'flex-end',
          }}
        >
          ➤
        </button>
      </div>
    </div>
  );
}

export default ChatInterface;
