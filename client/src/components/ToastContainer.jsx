import React from 'react';
import { useToast } from '../context/ToastContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const ToastContainer = () => {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        maxWidth: '380px',
      }}
    >
      {toasts.map((toast) => {
        let bg = '#ffffff';
        let border = '#d5d9d9';
        let icon = <Info size={20} color="#007185" />;

        if (toast.type === 'success') {
          border = '#067d62';
          icon = <CheckCircle2 size={20} color="#067d62" />;
        } else if (toast.type === 'error') {
          border = '#cc0c39';
          icon = <AlertCircle size={20} color="#cc0c39" />;
        }

        return (
          <div
            key={toast.id}
            style={{
              backgroundColor: bg,
              color: '#0f1111',
              padding: '12px 16px',
              borderRadius: '8px',
              boxShadow: '0 4px 14px rgba(0,0,0,0.18)',
              borderLeft: `5px solid ${border}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              animation: 'slideIn 0.3s ease-out',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {icon}
              <span style={{ fontSize: '13px', fontWeight: '500' }}>
                {toast.message}
              </span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              style={{
                background: 'none',
                color: '#565959',
                padding: '4px',
                cursor: 'pointer',
                display: 'flex',
              }}
              title="Close"
            >
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default ToastContainer;

