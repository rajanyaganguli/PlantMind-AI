import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../components/ui/Table';
import { Activity, MapPin, Wrench, Calendar, FileText, Download, AlertTriangle } from 'lucide-react';
import './pages.css';

export function AssetDetail() {
  return (
    <div>
      <div className="asset-header">
        <div>
          <div className="asset-title">Centrifugal Process Pump (Pump-14)</div>
          <div className="asset-meta">
            <div className="asset-meta-item"><MapPin size={14} /> Unit C Bay 4</div>
            <div className="asset-meta-item"><Wrench size={14} /> Flowserve</div>
            <div className="asset-meta-item"><Calendar size={14} /> Insp: 14 Jul 2026</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Button variant="secondary"><Activity size={16} /> Run Diagnostics</Button>
          <Button variant="primary">Create Work Order</Button>
        </div>
      </div>

      <div className="page-grid grid-cols-4" style={{ marginBottom: '24px' }}>
        <Card className="kpi-card">
          <div className="kpi-label">Health Score</div>
          <div className="kpi-value">74<span className="kpi-unit">%</span></div>
          <Badge variant="warning">Degrading</Badge>
        </Card>
        <Card className="kpi-card">
          <div className="kpi-label">Remaining Useful Life</div>
          <div className="kpi-value">118<span className="kpi-unit">Days</span></div>
          <Badge variant="default">Estimated</Badge>
        </Card>
        <Card className="kpi-card">
          <div className="kpi-label">Risk Level</div>
          <div className="kpi-value" style={{ color: 'var(--color-critical)' }}>High</div>
          <Badge variant="critical">Action Required</Badge>
        </Card>
        <Card className="kpi-card" style={{ border: '1px solid var(--color-critical)' }}>
          <div className="kpi-label" style={{ color: 'var(--color-critical)' }}><AlertTriangle size={14} style={{ display: 'inline', marginRight: '4px' }} /> Critical Alert</div>
          <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)', marginTop: '8px' }}>
            Mechanical Seal Leakage
          </div>
        </Card>
      </div>

      <div className="page-grid grid-cols-2">
        <Card>
          <div className="section-title">Live Telemetry</div>
          <div className="telemetry-grid">
            <div className="telemetry-card">
              <div className="kpi-label">Vibration</div>
              <div className="kpi-value" style={{ color: 'var(--color-critical)' }}>14.2</div>
              <div className="kpi-unit">mm/s</div>
            </div>
            <div className="telemetry-card">
              <div className="kpi-label">Temp</div>
              <div className="kpi-value" style={{ color: 'var(--color-warning)' }}>87</div>
              <div className="kpi-unit">°C</div>
            </div>
            <div className="telemetry-card">
              <div className="kpi-label">Pressure</div>
              <div className="kpi-value">8.4</div>
              <div className="kpi-unit">bar</div>
            </div>
            <div className="telemetry-card">
              <div className="kpi-label">Motor Load</div>
              <div className="kpi-value">78</div>
              <div className="kpi-unit">%</div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="section-title">Related Documents</div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Document</TableHead>
                <TableHead>Type</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell><FileText size={14} style={{ display: 'inline', marginRight: '8px', color: 'var(--color-primary-blue)' }} /> Pump_14_Inspection_Report_May_2026.pdf</TableCell>
                <TableCell>Report</TableCell>
                <TableCell><Button variant="ghost"><Download size={14} /></Button></TableCell>
              </TableRow>
              <TableRow>
                <TableCell><FileText size={14} style={{ display: 'inline', marginRight: '8px', color: 'var(--text-muted)' }} /> OEM_Manual_Flowserve_DVSH200HC.pdf</TableCell>
                <TableCell>Manual</TableCell>
                <TableCell><Button variant="ghost"><Download size={14} /></Button></TableCell>
              </TableRow>
              <TableRow>
                <TableCell><FileText size={14} style={{ display: 'inline', marginRight: '8px', color: 'var(--color-success)' }} /> Pump14_PandID_RevC.dwg</TableCell>
                <TableCell>P&ID</TableCell>
                <TableCell><Button variant="ghost"><Download size={14} /></Button></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  );
}
