import { useState } from 'react';
import { Search, Bell, MapPin, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import './layout.css';

interface TopNavbarProps { title: string; }

export function TopNavbar({ title }: TopNavbarProps) {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [notifOpen, setNotifOpen] = useState(false);

  return (
    <header className="pm-topbar">
      <span className="pm-page-title">{title}</span>
      <div className="pm-topbar-divider" />

      <div className="pm-topbar-search" style={{ maxWidth: '480px' }}>
        <Search size={14} className="pm-topbar-search-icon" />
        <input placeholder="Search assets, documents, P&IDs…" />
      </div>

      <div className="pm-topbar-right">
        <div className="pm-plant-selector animate-ripple" onClick={() => addToast('Plant selection modal opened', 'info')}>
          <MapPin size={12} />
          Hazira Manufacturing Plant
          <ChevronDown size={12} />
        </div>

        <div className="pm-status-chip">
          <span className="pm-status-dot animate-pulse" />
          AI Services Online
        </div>

        <div style={{ position: 'relative' }}>
          <button className="pm-notif-btn animate-ripple" onClick={() => setNotifOpen(!notifOpen)}>
            <Bell size={16} />
            <span className="pm-notif-badge">4</span>
          </button>
          
          {notifOpen && (
            <div className="animate-fade" style={{ position: 'absolute', top: '100%', right: 0, marginTop: '8px', width: '320px', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-modal)', zIndex: 100 }}>
              <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', fontWeight: 600 }}>Notifications</span>
                <button className="pm-btn pm-btn-ghost pm-btn-xs" onClick={() => { setNotifOpen(false); addToast('All notifications marked as read', 'success'); }}>Mark all read</button>
              </div>
              <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {[1,2,3,4].map(i => (
                  <div key={i} style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-subtle)', cursor: 'pointer', transition: 'var(--transition-fast)' }} className="db-list-item">
                    <div style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-primary)' }}>New RCA generated for Pump-14</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>2 hours ago</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="pm-user-chip animate-ripple" onClick={() => addToast('User profile menu opened', 'info')}>
          <div className="pm-avatar" style={{ width: '26px', height: '26px', fontSize: '10px' }}>
            {user?.initials ?? 'RS'}
          </div>
          <div className="pm-user-chip-info">
            <span className="pm-user-chip-name">{user?.name ?? 'Rahul Sharma'}</span>
            <span className="pm-user-chip-role">{user?.role ?? 'Reliability Engineer'}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
