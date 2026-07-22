import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { useGlobal } from '../context/GlobalContext';
import { Activity, FileText, Settings2, ShieldAlert } from 'lucide-react';
import '../components/dashboard/dashboard.css';

export function Timeline() {
  const navigate = useNavigate();
  const { activities } = useGlobal();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', height: '100%' }}>
      <div className="db-section-header" style={{ marginBottom: 0 }}>
        <div>
          <div className="kh-title" style={{ fontSize: '24px', fontWeight: 600, color: 'var(--text-primary)' }}>Asset Timeline</div>
          <div className="kh-subtitle" style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Chronological history of operations, AI events, and document updates.</div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="pm-btn pm-btn-secondary" onClick={() => navigate('/knowledge')}>View in Graph</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '20px', flex: 1, minHeight: 0 }}>
        {/* Left Panel: Filters */}
        <Card style={{ display: 'flex', flexDirection: 'column', gap: '16px', overflowY: 'auto' }}>
          <div className="db-section-title">Timeline Filters</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>Event Type</div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-primary)', marginBottom: '6px' }}>
                <input type="checkbox" defaultChecked /> <Activity size={14} color="var(--color-primary-blue)"/> Operations
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-primary)', marginBottom: '6px' }}>
                <input type="checkbox" defaultChecked /> <ShieldAlert size={14} color="var(--color-critical)"/> Alerts & Failures
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-primary)', marginBottom: '6px' }}>
                <input type="checkbox" defaultChecked /> <Settings2 size={14} color="var(--color-warning)"/> Maintenance
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-primary)' }}>
                <input type="checkbox" defaultChecked /> <FileText size={14} color="var(--color-success)"/> Documents
              </label>
            </div>
            
            <div style={{ height: '1px', background: 'var(--border-subtle)' }} />

            <div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>Time Range</div>
              <select className="kh-search-input" style={{ width: '100%', padding: '8px', fontSize: '13px', borderRadius: '6px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}>
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
                <option>Last 6 Months</option>
                <option>All Time</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Right Panel: Feed */}
        <Card style={{ overflowY: 'auto', padding: '24px' }}>
          <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Vertical Line */}
            <div style={{ position: 'absolute', left: '15px', top: '0', bottom: '0', width: '2px', background: 'var(--border-subtle)' }} />
            
            {activities.map((a, i) => (
              <div key={i} style={{ display: 'flex', gap: '20px', position: 'relative' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--bg-card)', border: `2px solid ${a.color}`, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1 }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: a.color }} />
                </div>
                
                <div style={{ flex: 1, background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '16px' }}
                     className="animate-fade">
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <div style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text-primary)' }}>{a.text}</div>
                    <Badge variant="default" style={{ background: 'var(--bg-card)' }}>{a.time}</Badge>
                  </div>
                  
                  <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '12px' }}>
                    System generated event based on operational telemetry and document indexing. 
                    This event is strongly correlated with Pump-14 and Mechanical Seal components.
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="pm-btn pm-btn-ghost pm-btn-sm" onClick={() => navigate('/knowledge', { state: { query: a.text } })}>
                      Highlight in Graph
                    </button>
                    {a.text.includes('.pdf') && (
                      <button className="pm-btn pm-btn-ghost pm-btn-sm" onClick={() => navigate('/documents')}>
                        Open Document
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
