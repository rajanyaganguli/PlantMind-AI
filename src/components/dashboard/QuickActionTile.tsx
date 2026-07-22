import type { ReactNode } from 'react';
import '../dashboard/dashboard.css';

interface QATileProps {
  icon: ReactNode;
  label: string;
  description: string;
  color?: string;
  onClick?: () => void;
}

export function QuickActionTile({ icon, label, description, color = 'var(--color-primary-blue)', onClick }: QATileProps) {
  return (
    <div className="db-qa-tile animate-ripple" onClick={onClick} style={{ flexDirection: 'row', alignItems: 'flex-start', padding: '14px', gap: '12px', textAlign: 'left' }}>
      <div className="db-qa-tile-icon" style={{ background: `${color}18`, color, flexShrink: 0, width: '36px', height: '36px', borderRadius: '8px' }}>
        {icon}
      </div>
      <div>
        <div className="db-qa-tile-label" style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '2px' }}>{label}</div>
        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{description}</div>
      </div>
    </div>
  );
}
