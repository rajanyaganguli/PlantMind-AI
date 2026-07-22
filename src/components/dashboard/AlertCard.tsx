import { AlertTriangle, Info, Zap } from 'lucide-react';
import '../dashboard/dashboard.css';

interface AlertCardProps {
  type: 'critical' | 'warning' | 'info';
  title: string;
  equipment: string;
  detail?: string;
  time: string;
  onView?: () => void;
  onDetails?: () => void;
}

const icons = {
  critical: <AlertTriangle size={14} color="var(--color-critical)" />,
  warning: <Zap size={14} color="var(--color-warning)" />,
  info: <Info size={14} color="var(--color-primary-blue)" />,
};

const badgeClasses = {
  critical: 'pm-badge pm-badge-critical',
  warning: 'pm-badge pm-badge-warning',
  info: 'pm-badge pm-badge-default',
};

const badgeLabels = { critical: 'Critical', warning: 'Warning', info: 'Info' };

export function AlertCard({ type, title, equipment, detail, time, onView, onDetails }: AlertCardProps) {
  return (
    <div className={`db-alert ${type}`} onClick={onView}>
      <div className="db-alert-head">
        <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
          <div style={{ padding: '6px', borderRadius: '8px', background: `var(--bg-secondary)`, display: 'flex', border: '1px solid var(--border-color)' }}>
            {icons[type]}
          </div>
          <div>
            <div className="db-alert-title">{title}</div>
            <div className="db-alert-equip">{equipment}</div>
          </div>
        </div>
        <span className={badgeClasses[type]}>{badgeLabels[type]}</span>
      </div>
      {detail && <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px', paddingLeft: '34px' }}>{detail}</div>}
      <div className="db-alert-meta" style={{ marginTop: '12px', paddingLeft: '34px' }}>
        <span className="db-alert-time">{time}</span>
        <div className="db-alert-actions">
          <button className="pm-btn pm-btn-ghost pm-btn-xs" onClick={e => { e.stopPropagation(); onView?.(); }}>Quick View</button>
          <button className="pm-btn pm-btn-secondary pm-btn-xs" onClick={e => { e.stopPropagation(); onDetails?.(); }}>Details →</button>
        </div>
      </div>
    </div>
  );
}
