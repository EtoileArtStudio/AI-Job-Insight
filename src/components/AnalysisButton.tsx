interface Props {
  onClick: () => void;
  isLoading: boolean;
  disabled: boolean;
}

function AnalysisButton({ onClick, isLoading, disabled }: Props) {
  return (
    <div style={{ textAlign: 'center', marginBottom: '24px' }}>
      <button
        onClick={onClick}
        disabled={disabled || isLoading}
        className={isLoading ? 'btn-loading' : ''}
        style={{
          padding: '12px 32px',
          fontSize: '16px',
          fontWeight: '600',
          backgroundColor: disabled || isLoading ? '#9CA3AF' : '#3B82F6',
          color: '#FFFFFF',
          border: 'none',
          borderRadius: '8px',
          cursor: disabled || isLoading ? 'not-allowed' : 'pointer',
          transition: 'background-color 0.2s',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minWidth: '200px',
          margin: '0 auto'
        }}
        onMouseEnter={(e) => {
          if (!disabled && !isLoading) {
            e.currentTarget.style.backgroundColor = '#2563EB';
          }
        }}
        onMouseLeave={(e) => {
          if (!disabled && !isLoading) {
            e.currentTarget.style.backgroundColor = '#3B82F6';
          }
        }}
      >
        {isLoading && <span className="loading-spinner"></span>}
        {isLoading ? '分析中...' : 'AIで分析する'}
      </button>
    </div>
  );
}

export default AnalysisButton;
