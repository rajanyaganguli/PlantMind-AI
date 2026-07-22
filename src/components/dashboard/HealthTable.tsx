import { useNavigate } from 'react-router-dom';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../ui/Table';
import { Badge } from '../ui/Badge';
import '../dashboard/dashboard.css';

interface Asset {
  id: string;
  name: string;
  health: number;
  risk: 'Low' | 'Medium' | 'High';
  rul: string;
  engineer: string;
  status: string;
}

const riskVariant: Record<string, 'success'|'warning'|'critical'> = {
  Low: 'success', Medium: 'warning', High: 'critical'
};

const healthColor = (h: number) => h >= 90 ? 'var(--color-success)' : h >= 75 ? 'var(--color-warning)' : 'var(--color-critical)';

export function HealthTable({ assets }: { assets: Asset[] }) {
  const navigate = useNavigate();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Asset</TableHead>
          <TableHead>Health</TableHead>
          <TableHead>Risk</TableHead>
          <TableHead>RUL</TableHead>
          <TableHead>Engineer</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {assets.map(a => (
          <TableRow key={a.id} className="clickable" onClick={() => navigate('/assets')}>
            <TableCell>
              <div style={{ fontWeight: 600, color: 'var(--color-primary-blue)', fontSize: '13px' }}>{a.name}</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{a.id}</div>
            </TableCell>
            <TableCell>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div className="db-health-bar-bg">
                  <div className="db-health-bar" style={{ width: `${a.health}%`, background: healthColor(a.health) }} />
                </div>
                <span style={{ fontSize: '12px', fontWeight: 600, color: healthColor(a.health) }}>{a.health}%</span>
              </div>
            </TableCell>
            <TableCell><Badge variant={riskVariant[a.risk]}>{a.risk}</Badge></TableCell>
            <TableCell className="muted">{a.rul}</TableCell>
            <TableCell className="muted">{a.engineer}</TableCell>
            <TableCell>
              <span style={{ 
                fontSize: '12px', fontWeight: 500,
                color: a.status === 'Healthy' ? 'var(--color-success)' : a.status === 'Monitor' ? 'var(--color-warning)' : 'var(--color-critical)'
              }}>{a.status}</span>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
