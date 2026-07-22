import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText, Image, Table2, Layout, Upload, ZoomIn, ZoomOut,
  Download, ExternalLink, RefreshCw, Box, MapPin, User,
  Calendar, Hash, Building2, AlertTriangle, CheckCircle,
  ScanLine, FileCheck, BarChart2, PenTool, Clock, MessageSquare,
  Info, Cpu
} from 'lucide-react';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import { useToast } from '../context/ToastContext';
import { useGlobal } from '../context/GlobalContext';
import type { AppDocument } from '../context/GlobalContext';
import './documents.css';



const TYPE_ICONS: Record<string, React.ReactNode> = {
  'Report':     <FileText size={15} />,
  'SOP':        <FileCheck size={15} />,
  'Drawing':    <Layout size={15} />,
  'Work Order': <PenTool size={15} />,
  'Data':       <Table2 size={15} />,
  'RCA':        <AlertTriangle size={15} />,
};

const TYPE_COLORS: Record<string, string> = {
  'Report':     '#2F6BFF',
  'SOP':        '#14C38E',
  'Drawing':    '#F6B73C',
  'Work Order': '#12D3FF',
  'Data':       '#A9B4C5',
  'RCA':        '#F45B69',
};



const ENTITIES = [
  { icon: <Box size={13} />,      label: 'Equipment',  value: 'Pump-14 (PUMP-14-JR3)' },
  { icon: <Building2 size={13} />, label: 'Department', value: 'Mechanical – Unit C' },
  { icon: <User size={13} />,     label: 'Inspector',  value: 'Rahul Sharma (RE-0021)' },
  { icon: <Calendar size={13} />, label: 'Insp. Date', value: 'July 12, 2026' },
  { icon: <MapPin size={13} />,   label: 'Location',   value: 'Bay 4 – Hazira Plant' },
  { icon: <Hash size={13} />,     label: 'Asset ID',   value: 'PUMP-14-JR3-HZ' },
];

const RELATED = ['Pump-14', 'WO-4821', 'Seal Report', 'Bearing History', 'Inspection SOP', 'MTR-105'];

/* ─── Sub-components ────────────────────────── */

function KnowledgeGraphPreview() {
  const nodes = [
    { id: 'pump',   label: 'Pump-14',      x: '50%', y: '50%', size: 52, bg: 'rgba(47,107,255,0.15)',  border: '#2F6BFF',   tc: '#2F6BFF' },
    { id: 'seal',   label: 'Seal\nLeak',   x: '20%', y: '28%', size: 40, bg: 'rgba(244,91,105,0.12)', border: '#F45B69',   tc: '#F45B69' },
    { id: 'bear',   label: 'Bearing',      x: '78%', y: '24%', size: 40, bg: 'rgba(246,183,60,0.12)', border: '#F6B73C',   tc: '#F6B73C' },
    { id: 'rca',    label: 'RCA\n2026',    x: '18%', y: '70%', size: 38, bg: 'rgba(18,211,255,0.1)',  border: '#12D3FF',   tc: '#12D3FF' },
    { id: 'wo',     label: 'WO-4821',      x: '80%', y: '68%', size: 38, bg: 'rgba(20,195,142,0.1)',  border: '#14C38E',   tc: '#14C38E' },
  ];

  const edges = [
    { x1: '50%', y1: '50%', x2: '20%', y2: '28%' },
    { x1: '50%', y1: '50%', x2: '78%', y2: '24%' },
    { x1: '50%', y1: '50%', x2: '18%', y2: '70%' },
    { x1: '50%', y1: '50%', x2: '80%', y2: '68%' },
  ];

  return (
    <div className="doc-kg-preview">
      <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
        {edges.map((e, i) => (
          <line key={i} x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2}
            stroke="var(--border-color)" strokeWidth="1.5" strokeDasharray="5,4" />
        ))}
      </svg>
      {nodes.map(n => (
        <div key={n.id} className="doc-kg-node" style={{
          left: n.x, top: n.y,
          transform: 'translate(-50%, -50%)',
          width: n.size, height: n.size,
          background: n.bg, borderColor: n.border, color: n.tc,
          fontSize: n.size > 48 ? '11px' : '9px',
          lineHeight: '1.2', padding: '4px',
          whiteSpace: 'pre-line',
        }}>
          {n.label}
        </div>
      ))}
    </div>
  );
}

function WorkOrderModal({ onClose }: { onClose: () => void }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)',
      zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center'
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} className="animate-fade" style={{
        background: 'var(--bg-card)', border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-lg)', padding: '28px 32px', width: '440px',
        boxShadow: 'var(--shadow-modal)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(47,107,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <PenTool size={20} color="var(--color-primary-blue)" />
          </div>
          <div>
            <div style={{ fontSize: '16px', fontWeight: 700 }}>Generate Work Order</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Pump_14_Inspection_Report_Q2_2026.pdf</div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
          {[
            { label: 'Asset', value: 'Pump-14 (PUMP-14-JR3)' },
            { label: 'Issue', value: 'Mechanical Seal Leakage' },
            { label: 'Priority', value: 'P1 – Critical' },
            { label: 'Assigned To', value: 'Rahul Sharma' },
            { label: 'Estimated Date', value: 'July 18, 2026' },
          ].map(r => (
            <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)', fontSize: '13px' }}>
              <span style={{ color: 'var(--text-muted)' }}>{r.label}</span>
              <span style={{ fontWeight: 500 }}>{r.value}</span>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={onClose} className="pm-btn pm-btn-secondary" style={{ flex: 1 }}>Cancel</button>
          <button onClick={onClose} className="pm-btn pm-btn-primary animate-ripple" style={{ flex: 1 }}>
            <CheckCircle size={15} /> Confirm & Create
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Page ─────────────────────────────── */
export function Documents() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { documents } = useGlobal();
  const [activeDoc, setActiveDoc] = useState<AppDocument>(documents[0]);
  const [showWoModal, setShowWoModal] = useState(false);
  const [zoom, setZoom] = useState(100);

  return (
    <div className="doc-page">
      {showWoModal && <WorkOrderModal onClose={() => { setShowWoModal(false); addToast('Work Order WO-4823 created successfully', 'success'); }} />}

      <div className="doc-columns">

        {/* ─── LEFT PANEL ─── */}
        <div className="doc-panel">

          {/* Upload Card */}
          <Card style={{ padding: '0' }}>
            <div className="doc-upload-zone" onClick={() => addToast('Upload dialog opened', 'info')}>
              <div className="doc-upload-zone-icon"><Upload size={22} /></div>
              <div className="doc-upload-title">Drag & Drop Documents</div>
              <div className="doc-upload-sub">
                Supports PDF · Images · Excel · P&ID Drawings<br />
                Max file size: 250 MB · Encrypted at rest
              </div>
              <div className="doc-upload-btns">
                <button className="doc-upload-btn" onClick={e => { e.stopPropagation(); addToast('PDF upload dialog opened', 'info'); }}>
                  <FileText size={13} /> PDF
                </button>
                <button className="doc-upload-btn" onClick={e => { e.stopPropagation(); addToast('Image upload dialog opened', 'info'); }}>
                  <Image size={13} /> Image
                </button>
                <button className="doc-upload-btn" onClick={e => { e.stopPropagation(); addToast('Excel upload dialog opened', 'info'); }}>
                  <Table2 size={13} /> Excel
                </button>
                <button className="doc-upload-btn" onClick={e => { e.stopPropagation(); addToast('P&ID upload dialog opened', 'info'); }}>
                  <Layout size={13} /> P&ID
                </button>
              </div>
            </div>
          </Card>

          {/* Recent Documents */}
          <Card style={{ padding: '16px' }}>
            <div className="db-section-header">
              <span className="db-section-title"><FileText size={14} /> Recent Documents</span>
              <Badge variant="default">{documents.length}</Badge>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginTop: '4px' }}>
              {documents.map(doc => (
                <div
                  key={doc.id}
                  className={`doc-list-item${activeDoc?.id === doc.id ? ' active' : ''}`}
                  onClick={() => setActiveDoc(doc)}
                >
                  <div className="doc-list-icon" style={{ background: `${TYPE_COLORS[doc.type]}18`, color: TYPE_COLORS[doc.type] }}>
                    {TYPE_ICONS[doc.type] ?? <FileText size={15} />}
                  </div>
                  <div className="doc-list-body">
                    <div className="doc-list-name" title={doc.name}>{doc.short}</div>
                    <div className="doc-list-meta">
                      <span className="doc-status-dot" style={{ background: doc.color }} />
                      <span>{doc.type}</span>
                      <span>·</span>
                      <span>{doc.date}</span>
                      <span>·</span>
                      <span style={{ color: doc.confidence >= 95 ? 'var(--color-success)' : 'var(--color-warning)', fontWeight: 600 }}>{doc.confidence}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button className="db-section-action" style={{ marginTop: '12px', display: 'block', width: '100%', textAlign: 'center', padding: '8px', borderTop: '1px solid var(--border-subtle)' }}
              onClick={() => addToast('Opening full document library…', 'info')}>
              View All Documents →
            </button>
          </Card>
        </div>

        {/* ─── CENTER PANEL ─── */}
        <div className="doc-panel" style={{ minWidth: 0 }}>
          {activeDoc ? (
            <>
              {/* Document Header */}
              <div className="doc-viewer-header">
                <span className="doc-viewer-title" title={activeDoc.name}>{activeDoc.short}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                  <Badge variant={activeDoc.type === 'RCA' ? 'critical' : activeDoc.type === 'Work Order' ? 'warning' : 'success'}>
                    {activeDoc.type}
                  </Badge>
                  <button className="doc-icon-btn" title="Zoom out" onClick={() => setZoom(z => Math.max(50, z - 10))}><ZoomOut size={14} /></button>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)', minWidth: '38px', textAlign: 'center' }}>{zoom}%</span>
                  <button className="doc-icon-btn" title="Zoom in" onClick={() => setZoom(z => Math.min(200, z + 10))}><ZoomIn size={14} /></button>
                  <button className="doc-icon-btn" title="Download" onClick={() => addToast(`Downloading ${activeDoc.short}…`, 'info')}><Download size={14} /></button>
                  <button className="doc-icon-btn" title="Open full" onClick={() => addToast(`Opening ${activeDoc.short} in full screen…`, 'info')}><ExternalLink size={14} /></button>
                  <button className="doc-icon-btn" title="Refresh" onClick={() => addToast('Re-indexing document…', 'info')}><RefreshCw size={14} /></button>
                </div>
              </div>

          {/* PDF Viewer */}
          <div className="doc-viewer-frame" style={{ height: '460px', flexDirection: 'column', padding: '24px', gap: '0' }}>
            <div style={{ width: '100%', maxWidth: `${zoom}%`, flex: 1, background: '#fff', borderRadius: '8px', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.4)', transition: 'max-width 0.3s ease' }}>
              {/* Mock PDF header */}
              <div style={{ background: '#1e3a5f', padding: '16px 24px' }}>
                <div style={{ fontSize: '13px', color: '#aac4e0', marginBottom: '4px' }}>APEX STEEL INDUSTRIES PVT. LTD. — HAZIRA MANUFACTURING PLANT</div>
                <div style={{ fontSize: '16px', fontWeight: 700, color: '#fff' }}>ROTATING EQUIPMENT INSPECTION REPORT</div>
                <div style={{ fontSize: '12px', color: '#90b4d0', marginTop: '4px' }}>Document No: APXS-INS-PUMP14-Q2-2026 | Rev: 01 | Date: 12-Jul-2026</div>
              </div>
              {/* Mock document body */}
              <div style={{ flex: 1, padding: '20px 24px', background: '#f8f9fa', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  { h: '1. Executive Summary', lines: ['This report documents the findings of the Q2 2026 inspection of Pump-14 (PUMP-14-JR3), a centrifugal process pump located in Unit C, Bay 4 of the Hazira Manufacturing Plant.', 'The inspection identified a critical mechanical seal leakage condition and elevated bearing temperatures requiring immediate corrective action.'] },
                  { h: '2. Equipment Details', lines: ['Asset ID: PUMP-14-JR3-HZ | OEM: Flowserve | Model: DVSH200HC | Fluid: Process Oil | Capacity: 250 m³/hr'] },
                  { h: '3. Key Findings', lines: ['● Mechanical seal: Stage-2 leakage detected, rate ~0.8 L/hr', '● Bearing temperature: 87°C (alarm set at 80°C)', '● Vibration (NDE): 14.2 mm/s RMS (ISO 10816 Zone D)'] },
                ].map((section, i) => (
                  <div key={i}>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: '#1e3a5f', marginBottom: '6px', paddingBottom: '4px', borderBottom: '1px solid #dde4ee' }}>{section.h}</div>
                    {section.lines.map((l, j) => <div key={j} style={{ fontSize: '11px', color: '#344054', lineHeight: '1.7' }}>{l}</div>)}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Related Assets */}
          <Card style={{ padding: '16px' }}>
            <div className="db-section-header">
              <span className="db-section-title">Related Assets & References</span>
            </div>
            <div className="doc-asset-chips" style={{ marginTop: '8px' }}>
              {RELATED.map(r => (
                <div key={r} className="doc-asset-chip" onClick={() => { addToast(`Opening: ${r}`, 'info'); navigate('/assets'); }}>
                  <Box size={12} />{r}
                </div>
              ))}
            </div>
          </Card>

          {/* Knowledge Graph */}
          <Card style={{ padding: '16px' }}>
            <div className="db-section-header">
              <span className="db-section-title">Knowledge Graph Preview</span>
              <button className="db-section-action" onClick={() => navigate('/knowledge')}>Open Full Graph →</button>
            </div>
            <KnowledgeGraphPreview />
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', textAlign: 'center', marginTop: '10px' }}>
              5 entities · 4 relationships extracted from this document
            </div>
          </Card>
          </>
          ) : (
            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
              Select a document to view
            </div>
          )}
        </div>

        {/* ─── RIGHT PANEL ─── */}
        <div className="doc-panel doc-ai-panel" style={{ minWidth: 0 }}>

          {/* OCR Extraction */}
          <Card style={{ padding: '16px' }}>
            <div className="db-section-header">
              <span className="db-section-title"><Cpu size={13} /> OCR Extraction</span>
              <Badge variant="success">Completed</Badge>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', marginTop: '8px' }}>
              <div style={{ fontSize: '28px', fontWeight: 700, color: 'var(--color-success)' }}>97%</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: '1.4' }}>Confidence<br/>Score</div>
            </div>
            <div className="doc-ocr-stat-row">
              <div className="doc-ocr-stat">
                <div className="doc-ocr-stat-val">3,842</div>
                <div className="doc-ocr-stat-label">Words</div>
              </div>
              <div className="doc-ocr-stat">
                <div className="doc-ocr-stat-val">24</div>
                <div className="doc-ocr-stat-label">Entities</div>
              </div>
              <div className="doc-ocr-stat">
                <div className="doc-ocr-stat-val">6</div>
                <div className="doc-ocr-stat-label">Tables</div>
              </div>
              <div className="doc-ocr-stat">
                <div className="doc-ocr-stat-val">4</div>
                <div className="doc-ocr-stat-label">Images</div>
              </div>
            </div>
          </Card>

          {/* Extracted Entities */}
          <Card style={{ padding: '16px' }}>
            <div className="db-section-header">
              <span className="db-section-title">Extracted Entities</span>
            </div>
            <div style={{ marginTop: '8px' }}>
              {ENTITIES.map((e, i) => (
                <div key={i} className="doc-entity-row">
                  <span className="doc-entity-icon">{e.icon}</span>
                  <span className="doc-entity-label">{e.label}</span>
                  <span className="doc-entity-value">{e.value}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Safety Insights */}
          <Card style={{ padding: '16px', borderLeft: '3px solid var(--color-critical)' }}>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <div style={{ padding: '6px', borderRadius: '8px', background: 'rgba(244,91,105,0.1)', display: 'flex', flexShrink: 0 }}>
                <AlertTriangle size={16} color="var(--color-critical)" />
              </div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-critical)', marginBottom: '6px' }}>Safety Hazards Detected</div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                  Process fluid exposure risk at seal face. Mandatory use of face shield and chemical-resistant gloves during maintenance.
                </div>
                <div style={{ marginTop: '8px' }}>
                  <Badge variant="critical">COSHH Notice</Badge>
                </div>
              </div>
            </div>
          </Card>

          {/* AI Summary */}
          <Card style={{ padding: '16px' }}>
            <div className="db-section-header">
              <span className="db-section-title"><Info size={13} /> AI Summary</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '8px', fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.7' }}>
              <div>
                <span style={{ fontWeight: 600, color: 'var(--color-critical)' }}>Failure Detected: </span>
                Stage-2 mechanical seal leakage on Pump-14 (PUMP-14-JR3) with process fluid detected at seal face. Bearing temp at 87°C exceeds 80°C alarm threshold.
              </div>
              <div>
                <span style={{ fontWeight: 600, color: 'var(--color-warning)' }}>Risk Level: </span>
                <Badge variant="critical" style={{ marginRight: '4px' }}>Critical</Badge>
                Seal failure escalation within 7–10 days if unaddressed. Unplanned downtime risk estimated at 48 hours.
              </div>
              <div>
                <span style={{ fontWeight: 600, color: 'var(--color-success)' }}>Recommendation: </span>
                Issue P1 work order for seal replacement. Schedule bearing inspection concurrently. Expected MTTR: 8 hours. Parts available in plant store (Part No. FS-7832-HZ).
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '16px' }}>
              <button className="pm-btn pm-btn-primary animate-ripple" style={{ width: '100%', justifyContent: 'center' }} onClick={() => setShowWoModal(true)}>
                <PenTool size={15} /> Generate Work Order
              </button>
              <button className="pm-btn pm-btn-secondary animate-ripple" style={{ width: '100%', justifyContent: 'center' }} onClick={() => navigate('/copilot')}>
                <MessageSquare size={15} /> Open AI Copilot
              </button>
            </div>
          </Card>
        </div>
      </div>

      {/* ─── BOTTOM ACTION BAR ─── */}
      <div className="doc-action-bar">
        <button className="doc-action-btn" onClick={() => addToast('Camera: Scan QR to identify asset', 'info')}><ScanLine size={14} /> Scan QR</button>
        <button className="doc-action-btn" onClick={() => navigate('/assets')}><Box size={14} /> Open Asset</button>
        {activeDoc && <button className="doc-action-btn" onClick={() => addToast(`Opening ${activeDoc.short}…`, 'info')}><ExternalLink size={14} /> Open Document</button>}
        <div className="doc-action-divider" />
        <button className="doc-action-btn" onClick={() => { addToast('Generating report from document…', 'info'); navigate('/reports'); }}><BarChart2 size={14} /> Generate Report</button>
        <button className="doc-action-btn primary" onClick={() => setShowWoModal(true)}><PenTool size={14} /> Create Work Order</button>
        <div className="doc-action-divider" />
        <button className="doc-action-btn" onClick={() => addToast('Opening document timeline…', 'info')}><Clock size={14} /> View Timeline</button>
        <button className="doc-action-btn" onClick={() => navigate('/copilot')}><MessageSquare size={14} /> Open AI Copilot</button>
      </div>
    </div>
  );
}
