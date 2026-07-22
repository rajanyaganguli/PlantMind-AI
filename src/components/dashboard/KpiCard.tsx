import { TrendingUp, TrendingDown, MoreVertical } from 'lucide-react';
import { SparklineChart } from './MiniChart';
import type { ReactNode } from 'react';
import '../dashboard/dashboard.css';

interface KpiCardProps {
  label: string;
  value: string | number;
  trend?: number; // percentage, positive = good
  trendInverted?: boolean; // for metrics where down = bad
  color?: string;
  icon: ReactNode;
  sparkData?: number[];
  onClick?: () => void;
}

export function KpiCard({ label, value, trend, trendInverted, color, icon, sparkData, onClick }: KpiCardProps) {
  const isUp = (trend ?? 0) >= 0;
  const isGood = trendInverted ? !isUp : isUp;

  return (
    <div className="pm-card db-kpi clickable" onClick={onClick} style={{ padding: '14px 16px' }}>
      <div className="db-kpi-icon-row" style={{ marginBottom: '8px' }}>
        <span className="db-kpi-icon" style={{ color: color ?? 'var(--text-muted)' }}>{icon}</span>
        <button className="pm-btn-ghost" onClick={e => e.stopPropagation()} style={{ background:'none', border:'none', color:'var(--text-muted)', cursor:'pointer' }}>
          <MoreVertical size={14} />
        </button>
      </div>
      <div className="db-kpi-label" style={{ marginBottom: '2px', fontSize: '12px' }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
        <div className="db-kpi-value" style={{ color: color ?? 'var(--text-primary)' }}>{value}</div>
        {trend !== undefined && (
          <span className={`db-kpi-trend ${isGood ? 'up' : 'down'}`}>
            {isUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {Math.abs(trend)}%
          </span>
        )}
      </div>
      {sparkData && (
        <div className="db-kpi-sparkline animate-fade" style={{ marginTop: '8px', opacity: 0.8 }}>
          <SparklineChart data={sparkData} color={color ?? '#2F6BFF'} />
        </div>
      )}
    </div>
  );
}
