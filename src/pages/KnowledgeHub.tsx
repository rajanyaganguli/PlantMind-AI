import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Search, Filter, ZoomIn, ZoomOut, Maximize2, RefreshCw, Download,
  ChevronRight, FileText, Star, Pin, Eye, Share2, Pencil,
  Box, Building2, Calendar, Hash, MapPin, Activity,
  Cpu, AlertTriangle, BarChart2, PenTool, MessageSquare,
  Upload, X, Layers, Settings2, ExternalLink,
  Thermometer, Zap, TrendingUp, Clock, CheckCircle, FileCheck,
  LayoutGrid, Minimize2, Move, Tag, BookOpen
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { useToast } from '../context/ToastContext';
import { useGlobal } from '../context/GlobalContext';
import type { AppDocument, AppActivity } from '../context/GlobalContext';
import { ResponsiveContainer, LineChart, Line, Tooltip } from 'recharts';
import './knowledge.css';

// ─── Types ────────────────────────────────────────────
interface GraphNode {
  id: string; label: string; type: string;
  x: number; y: number; size: number;
  bg: string; border: string; textColor: string;
  detail: string; docs: number; status: string;
}

interface GraphEdge { from: string; to: string; animated?: boolean; }

// ─── Graph Data ───────────────────────────────────────
const NODES: GraphNode[] = [
  { id: 'pump14',    label: 'Pump-14',         type: 'Asset',      x: 50, y: 50, size: 68, bg: 'rgba(47,107,255,0.18)',   border: '#2F6BFF', textColor: '#2F6BFF', detail: 'Centrifugal pump · Unit C Bay 4', docs: 14, status: 'Critical' },
  { id: 'insp',      label: 'Inspection\nReports', type: 'Document', x: 25, y: 22, size: 48, bg: 'rgba(20,195,142,0.14)', border: '#14C38E', textColor: '#14C38E', detail: 'Q1–Q2 2026 Inspection Docs', docs: 6, status: 'Indexed' },
  { id: 'maint',     label: 'Maintenance\nLogs',   type: 'Document', x: 75, y: 22, size: 48, bg: 'rgba(246,183,60,0.14)', border: '#F6B73C', textColor: '#F6B73C', detail: 'CMMS Maintenance History', docs: 9, status: 'Indexed' },
  { id: 'oem',       label: 'OEM\nManual',     type: 'Document',  x: 14, y: 45, size: 42, bg: 'rgba(18,211,255,0.12)',  border: '#12D3FF', textColor: '#12D3FF', detail: 'Flowserve DVSH200HC Manual', docs: 2, status: 'Indexed' },
  { id: 'sop',       label: 'Safety\nSOPs',    type: 'Document',  x: 14, y: 66, size: 42, bg: 'rgba(18,211,255,0.12)',  border: '#12D3FF', textColor: '#12D3FF', detail: 'OISD & Internal SOPs', docs: 5, status: 'Indexed' },
  { id: 'engineer',  label: 'Rahul\nSharma',   type: 'Engineer',  x: 30, y: 80, size: 40, bg: 'rgba(244,91,105,0.12)',  border: '#F45B69', textColor: '#F45B69', detail: 'Reliability Engineer', docs: 0, status: 'Active' },
  { id: 'dept',      label: 'Mech.\nUnit C',   type: 'Dept',      x: 55, y: 80, size: 40, bg: 'rgba(169,180,197,0.12)', border: '#A9B4C5', textColor: '#A9B4C5', detail: 'Mechanical Dept · Unit C', docs: 0, status: 'Active' },
  { id: 'sensor',    label: 'Sensors\n& IoT',  type: 'Sensor',    x: 80, y: 55, size: 42, bg: 'rgba(246,183,60,0.12)',  border: '#F6B73C', textColor: '#F6B73C', detail: '12 Live Sensors · 87°C Alert', docs: 0, status: 'Alert' },
  { id: 'bearing',   label: 'Bearings\n& Seals', type: 'Part',    x: 82, y: 76, size: 40, bg: 'rgba(244,91,105,0.12)', border: '#F45B69', textColor: '#F45B69', detail: 'SKF 6314 · Seal P/N FS-7832', docs: 3, status: 'Critical' },
  { id: 'wo',        label: 'Work\nOrders',    type: 'WorkOrder', x: 65, y: 36, size: 44, bg: 'rgba(47,107,255,0.12)',  border: '#2F6BFF', textColor: '#2F6BFF', detail: 'WO-4821 · WO-4823 Open', docs: 4, status: 'Open' },
  { id: 'failure',   label: 'Past\nFailures',  type: 'Failure',   x: 38, y: 32, size: 40, bg: 'rgba(244,91,105,0.12)', border: '#F45B69', textColor: '#F45B69', detail: 'RCA 2024 · Seal Failure 2026', docs: 2, status: 'RCA' },
  { id: 'rca',       label: 'RCA\n2026',       type: 'Analysis',  x: 22, y: 58, size: 38, bg: 'rgba(244,91,105,0.1)',  border: '#F45B69', textColor: '#F45B69', detail: 'Root Cause Analysis Report', docs: 1, status: 'Complete' },
  { id: 'motor',     label: 'MTR-105\nMotor',  type: 'Asset',     x: 70, y: 72, size: 40, bg: 'rgba(47,107,255,0.12)', border: '#2F6BFF', textColor: '#2F6BFF', detail: 'Connected Motor Unit', docs: 3, status: 'Warning' },
];

const EDGES: GraphEdge[] = [
  { from: 'pump14', to: 'insp',     animated: true },
  { from: 'pump14', to: 'maint',    animated: false },
  { from: 'pump14', to: 'oem',      animated: false },
  { from: 'pump14', to: 'sop',      animated: false },
  { from: 'pump14', to: 'engineer', animated: false },
  { from: 'pump14', to: 'dept',     animated: false },
  { from: 'pump14', to: 'sensor',   animated: true },
  { from: 'pump14', to: 'bearing',  animated: true },
  { from: 'pump14', to: 'wo',       animated: true },
  { from: 'pump14', to: 'failure',  animated: false },
  { from: 'pump14', to: 'motor',    animated: false },
  { from: 'failure', to: 'rca',     animated: false },
  { from: 'insp',   to: 'engineer', animated: false },
  { from: 'wo',     to: 'bearing',  animated: false },
];

// ─── Folder Data ─────────────────────────────────────
const FOLDERS = [
  { id: 'reports',    label: 'Inspection Reports', count: 6,  updated: 'Today',      color: '#14C38E', icon: <FileCheck size={14} />, files: ['Pump-14 Q2 Inspection.pdf', 'CT-02 Q1 Report.pdf', 'Boiler-03 Annual.pdf'] },
  { id: 'oem',        label: 'OEM Manuals',         count: 4,  updated: '2 weeks ago', color: '#12D3FF', icon: <BookOpen size={14} />,  files: ['Flowserve DVSH200HC.pdf', 'ABB Motor Manual.pdf'] },
  { id: 'sop',        label: 'SOPs',                count: 5,  updated: 'Yesterday',  color: '#2F6BFF', icon: <FileText size={14} />,  files: ['Lubrication SOP Rev4.pdf', 'Isolation SOP Rev2.pdf'] },
  { id: 'drawings',   label: 'P&ID Drawings',       count: 8,  updated: '3 days ago', color: '#F6B73C', icon: <Layers size={14} />,    files: ['Pump14_PandID_RevC.dwg', 'Unit-C Layout.dwg'] },
  { id: 'maint',      label: 'Maintenance Logs',    count: 12, updated: 'Today',      color: '#F6B73C', icon: <Settings2 size={14} />, files: ['WO-4821 Log.pdf', 'WO-4819 Bearing Repl.pdf'] },
  { id: 'wo',         label: 'Work Orders',         count: 9,  updated: 'Today',      color: '#2F6BFF', icon: <PenTool size={14} />,   files: ['WO-4821 Seal Replacement.pdf', 'WO-4823 Bearing.pdf'] },
  { id: 'compliance', label: 'Compliance Reports',  count: 3,  updated: 'Jun 30',     color: '#A9B4C5', icon: <CheckCircle size={14} />, files: ['OISD-116 Audit 2026.pdf'] },
  { id: 'rca',        label: 'Failure Analysis',    count: 2,  updated: 'Jul 16',     color: '#F45B69', icon: <AlertTriangle size={14} />, files: ['RCA_SealFailure_2026.pdf'] },
];

const PINNED = [
  { label: 'Pump-14', icon: <Box size={13} />, color: '#2F6BFF' },
  { label: 'WO-4821', icon: <PenTool size={13} />, color: '#F6B73C' },
  { label: 'Seal Failure RCA', icon: <AlertTriangle size={13} />, color: '#F45B69' },
];



const AUTOCOMPLETE = [
  { group: 'Assets',     items: ['Pump-14 (PUMP-14-JR3)', 'Compressor-08', 'Boiler-03', 'Motor MTR-105'] },
  { group: 'Documents',  items: ['Pump-14 Inspection Q2 2026', 'Lubrication SOP Rev4', 'RCA Seal Failure'] },
  { group: 'Failures',   items: ['Mechanical Seal Leakage – Pump-14', 'Bearing Overheat – 2024'] },
  { group: 'Engineers',  items: ['Rahul Sharma', 'Priya Nair', 'Ankit Verma'] },
];

const MOCK_SENSOR_DATA = [
  [{ v: 82 }, { v: 83 }, { v: 84 }, { v: 85 }, { v: 87 }, { v: 87 }, { v: 87 }],
  [{ v: 12 }, { v: 13 }, { v: 13 }, { v: 14 }, { v: 14 }, { v: 15 }, { v: 14 }],
  [{ v: 11 }, { v: 11 }, { v: 12 }, { v: 13 }, { v: 14 }, { v: 14 }, { v: 14 }],
  [{ v: 45 }, { v: 46 }, { v: 46 }, { v: 47 }, { v: 47 }, { v: 47 }, { v: 48 }],
];

// ─── Helpers ─────────────────────────────────────────
function MiniSpark({ data, color }: { data: { v: number }[], color: string }) {
  return (
    <ResponsiveContainer width="100%" height={40}>
      <LineChart data={data} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
        <Line type="monotone" dataKey="v" stroke={color} strokeWidth={1.5} dot={false} />
        <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '11px' }} itemStyle={{ color }} />
      </LineChart>
    </ResponsiveContainer>
  );
}

// ─── Document Slide-Over ─────────────────────────────
function DocSlideover({ doc, onClose }: { doc: string; onClose: () => void }) {
  const { addToast } = useToast();
  return (
    <>
      <div className="kh-slideover-bg" onClick={onClose} />
      <div className="kh-slideover">
        <div className="kh-slideover-header">
          <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(47,107,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <FileText size={16} color="var(--color-primary-blue)" />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{doc}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Indexed · 97% Confidence · 3,842 words</div>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <button className="doc-icon-btn" onClick={() => addToast(`Downloading ${doc}`, 'info')}><Download size={14} /></button>
            <button className="doc-icon-btn" onClick={() => addToast(`Sharing ${doc}`, 'info')}><Share2 size={14} /></button>
            <button className="doc-icon-btn" onClick={() => addToast('Annotation mode enabled', 'info')}><Pencil size={14} /></button>
            <button className="doc-icon-btn" onClick={() => addToast('Fullscreen viewer opened', 'info')}><Maximize2 size={14} /></button>
            <button className="doc-icon-btn" onClick={onClose}><X size={14} /></button>
          </div>
        </div>
        <div className="kh-slideover-body">
          {/* Mock PDF preview */}
          <div style={{ background: '#f8f9fa', borderRadius: 8, padding: '20px 24px', marginBottom: 16, minHeight: 280 }}>
            <div style={{ background: '#1e3a5f', padding: '12px 20px', borderRadius: '6px 6px 0 0', marginBottom: 12 }}>
              <div style={{ fontSize: 11, color: '#aac4e0' }}>APEX STEEL INDUSTRIES PVT. LTD. — HAZIRA PLANT</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginTop: 2 }}>ROTATING EQUIPMENT INSPECTION REPORT</div>
            </div>
            {['1. Executive Summary', '2. Equipment Details', '3. Inspection Findings', '4. Recommendations'].map((s, i) => (
              <div key={i} style={{ marginBottom: 10 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#1e3a5f', borderBottom: '1px solid #dde4ee', paddingBottom: 3, marginBottom: 5 }}>{s}</div>
                <div style={{ fontSize: 10, color: '#444', lineHeight: 1.7 }}>{'Industrial plant inspection data pertaining to Pump-14 rotating equipment and associated systems. Detailed technical assessment findings.'}</div>
              </div>
            ))}
          </div>
          {/* Entities */}
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 10 }}>Extracted Entities</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
            {['Pump-14', 'Rahul Sharma', 'Mechanical Seal', 'Bay 4', 'WO-4821', '87°C', 'SKF 6314'].map(e => (
              <div key={e} style={{ padding: '3px 10px', background: 'rgba(47,107,255,0.08)', border: '1px solid rgba(47,107,255,0.2)', borderRadius: 12, fontSize: 11, color: 'var(--color-primary-blue)', cursor: 'pointer' }}>{e}</div>
            ))}
          </div>
          {/* Safety notes */}
          <div style={{ padding: '12px 14px', background: 'rgba(244,91,105,0.06)', border: '1px solid rgba(244,91,105,0.2)', borderRadius: 8, marginBottom: 16, display: 'flex', gap: 10 }}>
            <AlertTriangle size={16} color="var(--color-critical)" style={{ flexShrink: 0, marginTop: 1 }} />
            <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Process fluid exposure risk at seal face. Use face shield and chemical-resistant gloves during maintenance.</div>
          </div>
          {/* Related */}
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Related Documents</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {['OEM Manual – Flowserve DVSH200HC', 'Lubrication SOP Rev4', 'WO-4821 Work Order'].map(r => (
              <div key={r} className="db-list-item" style={{ padding: '8px 10px', borderRadius: 6, border: '1px solid var(--border-subtle)', background: 'var(--bg-secondary)', cursor: 'pointer' }}>
                <FileText size={13} color="var(--text-muted)" />
                <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{r}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Main Page ────────────────────────────────────────
export function KnowledgeHub() {
  const navigate = useNavigate();
  const location = useLocation();
  const { addToast } = useToast();
  const { addDocument, addActivity, activities } = useGlobal();
  const graphRef = useRef<HTMLDivElement>(null);

  // State
  const [search, setSearch] = useState('');
  const [showAC, setShowAC] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>(['Pump-14', 'Seal Failure']);
  const [activePopover, setActivePopover] = useState<string | null>(null);
  const [acIndex, setAcIndex] = useState(-1);
  const [selectedNode, setSelectedNode] = useState<GraphNode>(NODES[0]);
  const [openFolders, setOpenFolders] = useState<Set<string>>(new Set(['reports']));
  const [showLabels, setShowLabels] = useState(true);
  const [slideDoc, setSlideDoc] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [fullscreen, setFullscreen] = useState(false);
  const [favoritedFiles, setFavoritedFiles] = useState<Set<string>>(new Set());

  // Graph Pan & Zoom State
  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (e.deltaY < 0) setScale(s => Math.min(3, s + 0.1));
    else setScale(s => Math.max(0.3, s - 0.1));
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (isDragging) {
      setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
  };

  const resetGraph = () => {
    setScale(1);
    setPan({ x: 0, y: 0 });
    setSelectedNode(NODES[0]);
    addToast('Graph reset', 'info');
  };


  // Node interaction
  const connectedIds = useMemo(() => {
    if (!selectedNode) return new Set<string>();
    const s = new Set<string>([selectedNode.id]);
    EDGES.forEach(e => { if (e.from === selectedNode.id) s.add(e.to); if (e.to === selectedNode.id) s.add(e.from); });
    return s;
  }, [selectedNode]);

  const handleNodeClick = useCallback((node: GraphNode) => {
    setSelectedNode(node);
    addToast(`Selected: ${node.label.replace('\n', ' ')}`, 'info');
  }, [addToast]);

  const toggleFolder = (id: string) => setOpenFolders(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const toggleFavorite = (file: string) => {
    setFavoritedFiles(prev => {
      const n = new Set(prev);
      if (n.has(file)) { n.delete(file); addToast(`Removed from favorites: ${file}`, 'info'); }
      else { n.add(file); addToast(`Added to favorites: ${file}`, 'success'); }
      return n;
    });
  };

  const handleExportPNG = () => {
    // Use html-to-canvas style approach: serialize graph as SVG blob
    const graphEl = graphRef.current;
    if (!graphEl) return;
    const svgEl = graphEl.querySelector('svg');
    if (!svgEl) { addToast('Exporting graph snapshot...', 'info'); return; }
    const serializer = new XMLSerializer();
    const svgStr = serializer.serializeToString(svgEl);
    const blob = new Blob([svgStr], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `knowledge-graph-${Date.now()}.svg`;
    a.click();
    URL.revokeObjectURL(url);
    addToast('Knowledge Graph exported as SVG', 'success');
  };

  const executeSearch = (query: string) => {
    setSearch(query);
    setShowAC(false);
    setSearchHistory(prev => [query, ...prev.filter(q => q !== query)].slice(0, 5));
    
    // Check if it matches an asset/node
    const nodeMatch = NODES.find(n => query.toLowerCase().includes(n.label.replace('\n', ' ').toLowerCase()) || query.toLowerCase().includes(n.id.toLowerCase()));
    if (nodeMatch) {
      setSelectedNode(nodeMatch);
      // Center the graph on this node
      setScale(1.2);
      setPan({ x: -((nodeMatch.x / 100) * (graphRef.current?.clientWidth || 700)) + (graphRef.current?.clientWidth || 700)/2, 
               y: -((nodeMatch.y / 100) * (graphRef.current?.clientHeight || 450)) + (graphRef.current?.clientHeight || 450)/2 });
      addToast(`Centered graph on ${nodeMatch.label.replace('\n', ' ')}`, 'success');
      return;
    }

    // Check if it matches a document or work order
    const isDoc = query.toLowerCase().includes('pdf') || 
                  query.toLowerCase().includes('report') || 
                  query.toLowerCase().includes('sop') ||
                  query.toLowerCase().includes('wo-') ||
                  query.toLowerCase().includes('rca');
                  
    if (isDoc) {
      setSlideDoc(query);
      addToast(`Opened document: ${query}`, 'success');
      return;
    }

    // Default
    addToast(`Searching Knowledge Graph for: "${query}"`, 'info');
  };

  const handleUpload = () => {
    if (uploadProgress !== null) return;
    setUploadProgress(0);
    let p = 0;
    const interval = setInterval(() => {
      p += Math.random() * 25;
      if (p >= 100) {
        p = 100;
        clearInterval(interval);
        setTimeout(() => {
          setUploadProgress(null);
          addToast('Document indexed · 94% confidence · 28 entities extracted', 'success');
          
          const newDoc: AppDocument = {
            id: 'doc_' + Date.now(),
            name: 'New_Uploaded_Document.pdf',
            short: 'New Uploaded Document.pdf',
            type: 'Report',
            date: 'Just now',
            confidence: 94,
            status: 'indexed',
            color: '#14C38E'
          };
          addDocument(newDoc);
          
          const newAct: AppActivity = {
            id: 'act_' + Date.now(),
            text: 'New_Uploaded_Document.pdf processed and added to Knowledge Graph',
            color: 'var(--color-success)',
            time: 'Just now'
          };
          addActivity(newAct);
        }, 600);
      }
      setUploadProgress(Math.min(100, p));
    }, 300);
  };

  // Keyboard shortcuts & Search Nav
  const allAcItems = AUTOCOMPLETE.flatMap(g => g.items);
  
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') { 
        e.preventDefault(); 
        document.querySelector<HTMLInputElement>('.kh-search-input')?.focus(); 
      }
      if (e.key === 'Escape') { 
        setShowAC(false); setSlideDoc(null); setAcIndex(-1);
      }
      if (showAC) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          setAcIndex(i => (i < allAcItems.length - 1 ? i + 1 : 0));
        }
        if (e.key === 'ArrowUp') {
          e.preventDefault();
          setAcIndex(i => (i > 0 ? i - 1 : allAcItems.length - 1));
        }
        if (e.key === 'Enter' && acIndex >= 0) {
          e.preventDefault();
          const items = search ? allAcItems : searchHistory;
          executeSearch(items[acIndex]);
          setAcIndex(-1);
        } else if (e.key === 'Enter' && search) {
          e.preventDefault();
          executeSearch(search);
        }
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [showAC, acIndex, allAcItems, search, searchHistory]);

  // Handle router state query
  useEffect(() => {
    if (location.state && location.state.query) {
      setTimeout(() => {
        executeSearch(location.state.query);
        // Clear state so it doesn't trigger again on re-renders
        navigate(location.pathname, { replace: true, state: {} });
      }, 300);
    }
  }, [location.state, location.pathname, navigate]);

  // ─── Render SVG graph edges ───────────────────────
  const renderEdges = () => {
    const graphW = graphRef.current?.clientWidth || 700;
    const graphH = graphRef.current?.clientHeight || 450;
    return EDGES.map((e, i) => {
      const from = NODES.find(n => n.id === e.from);
      const to = NODES.find(n => n.id === e.to);
      if (!from || !to) return null;
      const x1 = (from.x / 100) * graphW;
      const y1 = (from.y / 100) * graphH;
      const x2 = (to.x / 100) * graphW;
      const y2 = (to.y / 100) * graphH;
      const isHighlighted = connectedIds.has(from.id) && connectedIds.has(to.id);
      return (
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
          stroke={isHighlighted ? 'var(--color-primary-blue)' : 'var(--border-color)'}
          strokeWidth={isHighlighted ? 1.5 : 1}
          strokeDasharray={e.animated ? '6,4' : undefined}
          strokeOpacity={isHighlighted ? 0.8 : 0.4}
          style={{ transition: 'all 0.2s ease' }}
        />
      );
    });
  };

  return (
    <div className="kh-page">
      {slideDoc && <DocSlideover doc={slideDoc} onClose={() => setSlideDoc(null)} />}

      {/* ── HEADER ── */}
      <div className="kh-header">
        <div className="kh-title">Knowledge Hub</div>
        <div className="kh-subtitle">Unified Industrial Knowledge Graph powering every AI feature</div>

        {/* Search row */}
        <div className="kh-search-wrap">
          <div className="kh-search-box">
            <Search size={16} className="kh-search-icon" />
            <input
              className="kh-search-input"
              placeholder="Search assets, documents, engineers, work orders, failures, SOPs… (Ctrl+K)"
              value={search}
              onChange={e => { setSearch(e.target.value); setShowAC(true); setAcIndex(-1); }}
              onFocus={() => setShowAC(true)}
              onBlur={() => setTimeout(() => setShowAC(false), 150)}
            />
            {showAC && search && (
              <div className="kh-autocomplete">
                {AUTOCOMPLETE.map(g => (
                  <div className="kh-ac-group" key={g.group}>
                    <div className="kh-ac-label">{g.group}</div>
                    {g.items.filter(i => i.toLowerCase().includes(search.toLowerCase())).map((item) => {
                      const idx = allAcItems.indexOf(item);
                      return (
                        <div key={item} className={`kh-ac-item${idx === acIndex ? ' active' : ''}`}
                          style={idx === acIndex ? { background: 'var(--bg-hover)' } : {}}
                          onMouseEnter={() => setAcIndex(idx)}
                          onMouseDown={() => executeSearch(item)}>
                          <Search size={12} color="var(--text-muted)" />
                          {item}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            )}
            {showAC && !search && (
              <div className="kh-autocomplete">
                <div className="kh-ac-group">
                  <div className="kh-ac-label">Recent Searches</div>
                  {searchHistory.map((item, idx) => (
                    <div key={item} className={`kh-ac-item${idx === acIndex ? ' active' : ''}`}
                      style={idx === acIndex ? { background: 'var(--bg-hover)' } : {}}
                      onMouseEnter={() => setAcIndex(idx)}
                      onMouseDown={() => executeSearch(item)}>
                      <Clock size={12} color="var(--text-muted)" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div style={{ position: 'relative' }}>
            <div className="kh-search-badge" onClick={() => setActivePopover(activePopover === 'filter' ? null : 'filter')}><Filter size={11} /> Filter</div>
            {activePopover === 'filter' && (
              <div style={{ position: 'absolute', top: '100%', left: 0, marginTop: '8px', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '12px', boxShadow: 'var(--shadow-card)', zIndex: 100, width: '200px' }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase' }}>Filter By Type</div>
                {['Assets', 'Documents', 'Engineers', 'Work Orders'].map(t => (
                  <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0', fontSize: 12 }}>
                    <input type="checkbox" defaultChecked style={{ cursor: 'pointer' }} /> {t}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div style={{ position: 'relative' }}>
            <div className="kh-search-badge" onClick={() => setActivePopover(activePopover === 'advanced' ? null : 'advanced')}><Settings2 size={11} /> Advanced</div>
            {activePopover === 'advanced' && (
              <div style={{ position: 'absolute', top: '100%', left: 0, marginTop: '8px', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '12px', boxShadow: 'var(--shadow-card)', zIndex: 100, width: '240px' }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase' }}>Advanced Conditions</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <select style={{ width: '100%', padding: '6px', borderRadius: '4px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', fontSize: 12 }}>
                    <option>Status: Critical</option>
                    <option>Status: Warning</option>
                  </select>
                  <select style={{ width: '100%', padding: '6px', borderRadius: '4px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', fontSize: 12 }}>
                    <option>Department: Mech Unit C</option>
                    <option>Department: Electrical</option>
                  </select>
                </div>
              </div>
            )}
          </div>
          <div style={{ position: 'relative' }}>
            <div className="kh-search-badge" onClick={() => setActivePopover(activePopover === 'recent' ? null : 'recent')}><Clock size={11} /> Recent</div>
            {activePopover === 'recent' && (
              <div style={{ position: 'absolute', top: '100%', left: 0, marginTop: '8px', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '12px', boxShadow: 'var(--shadow-card)', zIndex: 100, width: '200px' }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase' }}>Recently Viewed</div>
                {['Pump-14', 'RCA_SealFailure_2026.pdf', 'WO-4821'].map(r => (
                  <div key={r} className="kh-ac-item" style={{ padding: '6px 8px', fontSize: 12, margin: 0, borderRadius: '4px' }} onClick={() => { setActivePopover(null); executeSearch(r); }}>
                    {r}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div style={{ position: 'relative' }}>
            <div className="kh-search-badge" style={{ background: 'rgba(47,107,255,0.15)', borderColor: 'var(--color-primary-blue)' }} onClick={() => setActivePopover(activePopover === 'semantic' ? null : 'semantic')}><Cpu size={11} /> Semantic</div>
            {activePopover === 'semantic' && (
              <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: '8px', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '12px', boxShadow: 'var(--shadow-card)', zIndex: 100, width: '220px' }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>Semantic Search Active</div>
                <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Using embedding-based similarity instead of exact keyword match.</div>
                <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
                  <input type="checkbox" defaultChecked style={{ cursor: 'pointer' }} /> Auto-expand related concepts
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Stats bar */}
        <div className="kh-stats-bar">
          {[
            { val: '48,392', label: 'Documents', color: 'var(--color-primary-blue)' },
            { val: '1.2M',   label: 'Knowledge Entities', color: 'var(--color-accent-cyan)' },
            { val: '1,284',  label: 'Linked Assets', color: 'var(--color-success)' },
            { val: '3.4M',   label: 'Relationships', color: 'var(--color-warning)' },
            { val: '94.6%',  label: 'AI Confidence', color: 'var(--color-success)' },
          ].map(s => (
            <div className="kh-stat-item" key={s.label}>
              <div className="kh-stat-val" style={{ color: s.color }}>{s.val}</div>
              <div className="kh-stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 3-COLUMN BODY ── */}
      <div className="kh-body">

        {/* ─── LEFT PANEL: Explorer ─── */}
        <div className="kh-panel">
          {/* Upload zone */}
          <div className="kh-upload-zone" onClick={handleUpload}>
            <Upload size={16} style={{ display: 'block', margin: '0 auto 6px' }} />
            <span>Drop files or click to upload</span>
            <div style={{ fontSize: 10, marginTop: 3 }}>PDF · Image · Excel · DOCX · CSV · P&ID</div>
            {uploadProgress !== null && (
              <div className="kh-upload-progress">
                <div className="kh-upload-bar" style={{ width: `${uploadProgress}%` }} />
              </div>
            )}
            {uploadProgress !== null && (
              <div style={{ fontSize: 10, color: 'var(--color-primary-blue)', marginTop: 4 }}>
                AI Processing… {Math.round(uploadProgress)}%
              </div>
            )}
          </div>

          {/* Knowledge Sources */}
          <div>
            <div className="kh-section-label" style={{ marginBottom: 6 }}>Knowledge Sources</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {FOLDERS.map(f => (
                <div className="kh-folder" key={f.id}>
                  <div className="kh-folder-header" onClick={() => toggleFolder(f.id)}>
                    <span className="kh-folder-icon" style={{ color: f.color }}>{f.icon}</span>
                    <span className="kh-folder-name">{f.label}</span>
                    <span className="kh-folder-count">{f.count}</span>
                    <ChevronRight size={12} className={`kh-folder-chevron${openFolders.has(f.id) ? ' open' : ''}`} />
                  </div>
                  {openFolders.has(f.id) && (
                    <div className="kh-folder-files">
                      {f.files.map(file => (
                        <div className="kh-file-row" key={file}>
                          <FileText size={11} color="var(--text-muted)" style={{ flexShrink: 0 }} />
                          <span className="kh-file-name" title={file}>{file}</span>
                          <div className="kh-file-actions">
                            <button className="kh-file-icon-btn" title="Preview" onClick={() => setSlideDoc(file)}><Eye size={11} /></button>
                            <button className="kh-file-icon-btn" title="Download" onClick={() => addToast(`Downloading ${file}`, 'info')}><Download size={11} /></button>
                            <button className="kh-file-icon-btn" title="Share" onClick={() => addToast(`Sharing ${file}`, 'info')}><Share2 size={11} /></button>
                            <button className="kh-file-icon-btn" title={favoritedFiles.has(file) ? 'Remove Favorite' : 'Add to Favorites'} onClick={() => toggleFavorite(file)} style={{ color: favoritedFiles.has(file) ? '#F6B73C' : undefined }}><Star size={11} /></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Pinned Assets */}
          <div>
            <div className="kh-section-label" style={{ marginBottom: 6 }}>Pinned Assets</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {PINNED.map(p => (
                <div className="kh-pinned-item" key={p.label} onClick={() => addToast(`Opening: ${p.label}`, 'info')}>
                  <span style={{ color: p.color }}>{p.icon}</span>
                  <span style={{ fontSize: 12, color: 'var(--text-primary)' }}>{p.label}</span>
                  <Pin size={10} color="var(--text-muted)" style={{ marginLeft: 'auto' }} />
                </div>
              ))}
            </div>
          </div>

          {/* AI Suggested Collections */}
          <div>
            <div className="kh-section-label" style={{ marginBottom: 6 }}>AI Suggested Collections</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {['Seal Failure Evidence', 'Q2 Maintenance Bundle', 'OISD Compliance Pack'].map(c => (
                <div className="kh-pinned-item" key={c} onClick={() => addToast(`Opening collection: ${c}`, 'info')}>
                  <Cpu size={12} color="var(--color-accent-cyan)" />
                  <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{c}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ─── CENTER: Graph + Activity ─── */}
        <div className="kh-panel" style={{ gap: 12 }}>
          <div className="kh-graph-card" style={{ flex: fullscreen ? 1 : 'none', height: fullscreen ? '100%' : 'auto' }}>
            {/* Toolbar */}
            <div className="kh-graph-toolbar">
              <button className="kh-toolbar-btn" onClick={() => setScale(s => Math.min(3, s + 0.2))}><ZoomIn size={13} /> Zoom In</button>
              <button className="kh-toolbar-btn" onClick={() => setScale(s => Math.max(0.3, s - 0.2))}><ZoomOut size={13} /> Zoom Out</button>
              <button className="kh-toolbar-btn" onClick={() => { setScale(1); setPan({x:0, y:0}); addToast('Fitting graph to screen', 'info'); }}><Maximize2 size={13} /> Fit</button>
              <button className="kh-toolbar-btn" onClick={() => { setPan({x:0, y:0}); addToast('Graph centered', 'info'); }}><Move size={13} /> Center</button>
              <div className="kh-toolbar-divider" />
              <button className={`kh-toolbar-btn${showLabels ? ' active' : ''}`} onClick={() => setShowLabels(!showLabels)}><Tag size={13} /> Labels</button>
              <button className="kh-toolbar-btn" onClick={() => { setSelectedNode(NODES[0]); addToast('Expanded all node connections', 'info'); }}><LayoutGrid size={13} /> Expand All</button>
              <button className="kh-toolbar-btn" onClick={resetGraph}><RefreshCw size={13} /> Reset</button>
              <div className="kh-toolbar-spacer" />
              <button className="kh-toolbar-btn" onClick={handleExportPNG}><Download size={13} /> PNG</button>
              <button className="kh-toolbar-btn" onClick={() => addToast('Exporting graph as JSON', 'info')}><Download size={13} /> JSON</button>
              <button className="kh-toolbar-btn" onClick={() => setFullscreen(!fullscreen)}>{fullscreen ? <Minimize2 size={13} /> : <Maximize2 size={13} />} {fullscreen ? 'Exit' : 'Fullscreen'}</button>
            </div>

            {/* Graph area */}
            <div className="kh-graph-area" 
                 ref={graphRef} 
                 style={{ height: fullscreen ? 'calc(100vh - 200px)' : '460px', touchAction: 'none' }}
                 onWheel={handleWheel}
                 onPointerDown={handlePointerDown}
                 onPointerMove={handlePointerMove}
                 onPointerUp={handlePointerUp}
                 onPointerLeave={handlePointerUp}
                 >
              <div style={{ position: 'absolute', inset: 0, transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`, transformOrigin: 'center center', transition: isDragging ? 'none' : 'transform 0.15s ease' }}>
                {/* SVG Edges */}
                <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', overflow: 'visible' }}>
                  {renderEdges()}
                </svg>

                {/* Nodes */}
                {NODES.map(node => {
                  const isDimmed = selectedNode && !connectedIds.has(node.id);
                  return (
                    <React.Fragment key={node.id}>
                      <div
                        className={`kh-node${selectedNode?.id === node.id ? ' selected' : ''}${isDimmed ? ' dimmed' : ''}`}
                        style={{
                          left: `${node.x}%`, top: `${node.y}%`,
                          width: node.size, height: node.size,
                          background: node.bg, borderColor: node.border, color: node.textColor,
                          fontSize: node.size >= 60 ? 11 : node.size >= 45 ? 10 : 9,
                          boxShadow: selectedNode?.id === node.id ? `0 0 20px ${node.border}55` : 'none',
                          whiteSpace: 'pre-line',
                        }}
                        onClick={(e) => { e.stopPropagation(); handleNodeClick(node); }}
                        title={node.detail}
                      >
                        {node.label}
                      </div>
                      {showLabels && !isDimmed && (
                        <div
                          className="kh-node-label"
                          style={{ left: `${node.x}%`, top: `calc(${node.y}% + ${node.size / 2 + 4}px)`, color: node.textColor, fontSize: 10 }}
                        >
                          {node.type}
                        </div>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>

              {/* Mini map */}
              <div className="kh-minimap">
                <svg width="90" height="60">
                  {NODES.map(n => (
                    <circle key={n.id} cx={n.x * 0.9} cy={n.y * 0.6} r={n.size > 60 ? 5 : 3}
                      fill={n.border} fillOpacity={0.7} />
                  ))}
                </svg>
              </div>

              {/* Legend */}
              <div style={{ position: 'absolute', top: 10, left: 10, display: 'flex', flexDirection: 'column', gap: 4 }}>
                {[{ color: '#2F6BFF', label: 'Asset' }, { color: '#14C38E', label: 'Document' }, { color: '#F45B69', label: 'Failure' }, { color: '#F6B73C', label: 'Maintenance' }].map(l => (
                  <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10, color: 'var(--text-muted)' }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: l.color }} /> {l.label}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Activity Timeline */}
          <Card style={{ padding: 16 }}>
            <div className="db-section-header" style={{ marginBottom: 10 }}>
              <span className="db-section-title"><Activity size={14} /> Recent Knowledge Activity</span>
              <button className="db-section-action" onClick={() => addToast('Viewing full activity log', 'info')}>View all →</button>
            </div>
            <div>
              {activities.map((a, i) => (
                <div className="kh-activity-item" key={i} style={{ cursor: 'pointer' }} onClick={() => addToast(`Focused related node for: ${a.text}`, 'info')}>
                  <div className="kh-activity-dot" style={{ background: a.color }} />
                  <div style={{ flex: 1, fontSize: 12, color: 'var(--text-secondary)' }}>{a.text}</div>
                  <div className="kh-activity-time">{a.time}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* ─── RIGHT PANEL: Inspector ─── */}
        <div className="kh-panel kh-inspector">
          {/* Asset Header */}
          <div className="kh-inspector-header">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
              <div className="kh-inspector-title">{selectedNode.label.replace('\n', ' ')}</div>
              <Badge variant={selectedNode.status === 'Critical' || selectedNode.status === 'RCA' ? 'critical' : selectedNode.status === 'Alert' || selectedNode.status === 'Warning' ? 'warning' : 'success'}>
                {selectedNode.status}
              </Badge>
            </div>
            <div className="kh-inspector-sub">{selectedNode.detail}</div>
            <div className="kh-inspector-scores">
              <div className="kh-score-pill">
                <div className="kh-score-val" style={{ color: 'var(--color-warning)' }}>74%</div>
                <div className="kh-score-label">Health</div>
              </div>
              <div className="kh-score-pill">
                <div className="kh-score-val" style={{ color: 'var(--color-critical)' }}>P1</div>
                <div className="kh-score-label">Criticality</div>
              </div>
              <div className="kh-score-pill">
                <div className="kh-score-val" style={{ color: 'var(--color-primary-blue)' }}>{selectedNode.docs}</div>
                <div className="kh-score-label">Docs</div>
              </div>
            </div>
            <div className="kh-inspector-actions">
              <button className="pm-btn pm-btn-primary pm-btn-sm animate-ripple" onClick={() => navigate('/assets')} title="View full asset profile"><Box size={13} /> Asset</button>
              <button className="pm-btn pm-btn-secondary pm-btn-sm animate-ripple" onClick={() => navigate('/documents')} title="View linked documents"><FileText size={13} /> Docs</button>
              <button className="pm-btn pm-btn-secondary pm-btn-sm animate-ripple" onClick={() => navigate('/timeline')} title="View maintenance history"><Clock size={13} /> Timeline</button>
              <button className="pm-btn pm-btn-secondary pm-btn-sm animate-ripple" onClick={() => navigate('/reports')} title="Generate asset report"><BarChart2 size={13} /> Report</button>
              <button className="pm-btn pm-btn-secondary pm-btn-sm animate-ripple" style={{ gridColumn: 'span 2' }} onClick={() => { addToast('Work Order WO-' + (4824 + Math.floor(Math.random()*10)) + ' created for ' + selectedNode.label.replace('\n', ' '), 'success'); navigate('/maintenance'); }} title="Create new work order"><PenTool size={13} /> Create Work Order</button>
              <button className="pm-btn pm-btn-ghost pm-btn-sm animate-ripple" style={{ gridColumn: 'span 2', justifyContent: 'center' }} onClick={() => navigate('/copilot')} title="Ask AI about this asset"><MessageSquare size={13} /> Ask AI Copilot</button>
            </div>
          </div>

          {/* Metadata */}
          <Card style={{ padding: 14 }}>
            <div className="db-section-title" style={{ marginBottom: 10 }}>Metadata</div>
            <div>
              {[
                { icon: <Hash size={13} />,         key: 'Asset ID',    val: 'PUMP-14-JR3-HZ' },
                { icon: <Building2 size={13} />,    key: 'Department',  val: 'Mechanical · Unit C' },
                { icon: <MapPin size={13} />,        key: 'Location',    val: 'Bay 4 · Hazira' },
                { icon: <Box size={13} />,           key: 'OEM',         val: 'Flowserve' },
                { icon: <Tag size={13} />,           key: 'Model',       val: 'DVSH200HC' },
                { icon: <Calendar size={13} />,      key: 'Comm. Date',  val: 'Mar 2018' },
                { icon: <Clock size={13} />,         key: 'RUL',         val: '118 Days' },
                { icon: <Cpu size={13} />,           key: 'AI Conf.',    val: '94.6%' },
              ].map(m => (
                <div className="kh-meta-row" key={m.key}>
                  <span className="kh-meta-icon">{m.icon}</span>
                  <span className="kh-meta-key">{m.key}</span>
                  <span className="kh-meta-val">{m.val}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Sensor Trends */}
          <Card style={{ padding: 14 }}>
            <div className="db-section-title" style={{ marginBottom: 10 }}>Live Sensor Trends</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { label: 'Temperature', unit: '87°C', icon: <Thermometer size={12} />, color: '#F45B69', data: MOCK_SENSOR_DATA[0] },
                { label: 'Pressure',    unit: '14 Bar', icon: <Activity size={12} />,    color: '#2F6BFF', data: MOCK_SENSOR_DATA[1] },
                { label: 'Vibration',   unit: '14.2 mm/s', icon: <Zap size={12} />,      color: '#F6B73C', data: MOCK_SENSOR_DATA[2] },
                { label: 'Power Draw',  unit: '48 kW', icon: <TrendingUp size={12} />,   color: '#14C38E', data: MOCK_SENSOR_DATA[3] },
              ].map(s => (
                <div key={s.label} style={{ padding: '8px 10px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'var(--text-muted)' }}>
                      <span style={{ color: s.color }}>{s.icon}</span> {s.label}
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 700, color: s.color }}>{s.unit}</span>
                  </div>
                  <div className="kh-mini-chart">
                    <MiniSpark data={s.data} color={s.color} />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Linked Documents */}
          <Card style={{ padding: 14 }}>
            <div className="db-section-header" style={{ marginBottom: 8 }}>
              <span className="db-section-title">Linked Documents</span>
              <button className="db-section-action" onClick={() => navigate('/documents')}>View all →</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {['Pump-14 Q2 Inspection.pdf', 'WO-4821 Work Order.pdf', 'RCA Seal Failure.pdf', 'OEM Manual DVSH200HC.pdf'].map(d => (
                <div key={d} className="db-list-item" style={{ padding: '7px 8px', borderRadius: 6, border: '1px solid var(--border-subtle)' }}
                  onClick={() => setSlideDoc(d)}>
                  <FileText size={13} color="var(--color-primary-blue)" className="db-list-icon" />
                  <div className="db-list-content">
                    <div className="db-list-title">{d}</div>
                  </div>
                  <ExternalLink size={11} color="var(--text-muted)" />
                </div>
              ))}
            </div>
          </Card>

          {/* AI Summary */}
          <Card style={{ padding: 14 }}>
            <div className="db-section-title" style={{ marginBottom: 8 }}>AI Summary</div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
              <p style={{ marginBottom: 8 }}><span style={{ fontWeight: 600, color: 'var(--color-critical)' }}>Critical Issue: </span>Mechanical seal stage-2 leakage with bearing temperature at 87°C.</p>
              <p style={{ marginBottom: 8 }}><span style={{ fontWeight: 600, color: 'var(--color-warning)' }}>Risk: </span>Seal failure likely within 7–10 days without intervention.</p>
              <p><span style={{ fontWeight: 600, color: 'var(--color-success)' }}>Action: </span>Issue P1 WO for seal replacement. Part FS-7832-HZ in stock.</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
