import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, FileText, Cpu, Upload, ScanLine, PenTool, GitBranch,
  ClipboardList, Activity, AlertTriangle, CheckCircle, Calendar,
  FileCheck, Database, Wrench, Search, ArrowRight, Send
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { AlertCard } from '../components/dashboard/AlertCard';
import { KpiCard } from '../components/dashboard/KpiCard';
import { QuickActionTile } from '../components/dashboard/QuickActionTile';
import { HealthTable } from '../components/dashboard/HealthTable';
import { useToast } from '../context/ToastContext';
import { useGlobal } from '../context/GlobalContext';
import '../components/dashboard/dashboard.css';

/* ─── Data ─────────────────────────────────────────── */
const healthTrend = [
  {name:'Mon',value:92},{name:'Tue',value:90},{name:'Wed',value:88},
  {name:'Thu',value:85},{name:'Fri',value:87},{name:'Sat',value:89},{name:'Sun',value:84},
];
const downtimeData = [
  {name:'Mech',value:45},{name:'Elec',value:25},{name:'Inst',value:15},{name:'Proc',value:10},
];
const maintData = [{name:'Completed',value:75},{name:'Pending',value:25}];
const COLORS = ['#2F6BFF','#203553'];

const sparkTotal   = [80,82,83,85,84,86,84];
const sparkHealthy = [74,76,77,78,79,80,78];
const sparkCrit    = [4,3,4,3,3,4,3];
const sparkDocs    = [200,210,215,218,220,222,216];
const sparkWO      = [50,49,48,47,47,46,47];
const sparkAI      = [180,190,195,200,205,210,216];

const assets = [
  { id:'PUMP-14-JR3', name:'Pump-14', health:74, risk:'High' as const, rul:'118 Days', engineer:'Rahul Sharma', status:'Attention Required' },
  { id:'COMP-08-Z2',  name:'Compressor-08', health:91, risk:'Low' as const, rul:'420 Days', engineer:'Priya Nair', status:'Healthy' },
  { id:'BLR-03-K1',   name:'Boiler-03', health:83, risk:'Medium' as const, rul:'205 Days', engineer:'Ankit Verma', status:'Monitor' },
  { id:'CT-02-P4',    name:'Cooling Tower CT-02', health:95, risk:'Low' as const, rul:'640 Days', engineer:'Sandeep Kulkarni', status:'Healthy' },
];

const suggestions = [
  'Show health of Pump-14',
  'Find vibration reports',
  'Upcoming maintenance',
  'Open inspection reports',
  'Predict next failure',
];



const upcoming = [
  { asset:'Pump-14', day:'18', mon:'Jul', task:'Bearing Replacement' },
  { asset:'Motor MTR-105', day:'21', mon:'Jul', task:'Lubrication' },
  { asset:'Boiler-03', day:'25', mon:'Jul', task:'Safety Inspection' },
];



export function Dashboard() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { documents, activities } = useGlobal();
  const [searchVal, setSearchVal] = useState('');
  const [timeframe, setTimeframe] = useState('7D');

  const handleChip = (q: string) => {
    setSearchVal(q);
    addToast(`Querying: "${q}"`, 'info');
  };

  return (
    <div style={{ display:'grid', gridTemplateColumns:'1fr 268px', gap:'16px', alignItems:'start' }}>
      
      {/* ───── MAIN COLUMN ───── */}
      <div style={{ display:'flex', flexDirection:'column', gap:'16px', minWidth:0 }}>

        {/* AI Command Search */}
        <div className="db-ai-search">
          <div className="db-ai-search-label">AI Command Center</div>
          <div className="db-ai-search-row">
            <div className="db-ai-search-input-wrap">
              <Search size={15} className="db-ai-search-icon" />
              <input
                className="db-ai-search-input"
                placeholder="What would you like to know about your plant today?"
                value={searchVal}
                onChange={e => setSearchVal(e.target.value)}
                onKeyDown={e => { if(e.key==='Enter' && searchVal) { navigate('/copilot'); }}}
              />
            </div>
            <button className="pm-btn pm-btn-primary" onClick={() => { if(searchVal) navigate('/copilot'); else addToast('Enter a query first','warning'); }}>
              <Send size={14} /> Ask AI
            </button>
          </div>
          <div className="db-ai-chips">
            {suggestions.map(s => <span key={s} className="db-ai-chip" onClick={() => handleChip(s)}>{s}</span>)}
          </div>
        </div>

        {/* Alerts Row */}
        <div className="db-grid db-grid-3">
          <AlertCard type="critical" title="Mechanical Seal Leakage" equipment="Pump-14 · Unit C Bay 4"
            detail="Bearing Temp: 87°C · Vibration: 14.2 mm/s" time="10 min ago" onView={() => addToast('Quick View: Pump-14 Seal Leakage', 'info')} onDetails={() => navigate('/assets')} />
          <AlertCard type="warning" title="Lubrication Overdue" equipment="Motor MTR-105"
            detail="Maintenance schedule missed by 48 hours." time="2h ago" onView={() => addToast('Quick View: MTR-105 Lubrication', 'info')} onDetails={() => navigate('/maintenance')} />
          <AlertCard type="info" title="OISD Audit Due in 9 Days" equipment="Hazira Manufacturing Plant"
            detail="Prepare documentation and verify compliance." time="Today" onView={() => addToast('Quick View: Audit Requirements', 'info')} onDetails={() => navigate('/compliance')} />
        </div>

        {/* KPIs */}
        <div className="db-grid db-grid-6">
          <KpiCard label="Total Assets" value="1,284" trend={2.1} icon={<Box size={16}/>} sparkData={sparkTotal} onClick={() => navigate('/assets')} />
          <KpiCard label="Healthy Assets" value="1,126" trend={1.8} icon={<CheckCircle size={16}/>} color="var(--color-success)" sparkData={sparkHealthy} onClick={() => navigate('/assets')} />
          <KpiCard label="Critical Assets" value="32" trend={-4.2} trendInverted icon={<AlertTriangle size={16}/>} color="var(--color-critical)" sparkData={sparkCrit} onClick={() => navigate('/assets')} />
          <KpiCard label="Docs Indexed" value="48,392" trend={3.5} icon={<FileText size={16}/>} color="var(--color-accent-cyan)" sparkData={sparkDocs} onClick={() => navigate('/documents')} />
          <KpiCard label="Open Work Orders" value="47" trend={-2.0} trendInverted icon={<Wrench size={16}/>} color="var(--color-warning)" sparkData={sparkWO} onClick={() => navigate('/maintenance')} />
          <KpiCard label="AI Insights" value="216" trend={8.0} icon={<Cpu size={16}/>} color="var(--color-primary-blue)" sparkData={sparkAI} onClick={() => navigate('/copilot')} />
        </div>

        {/* Quick Actions */}
        <Card>
          <div className="db-section-header">
            <span className="db-section-title">Quick Actions</span>
          </div>
          <div className="db-quick-actions">
            <QuickActionTile icon={<Upload size={15}/>} label="Upload Document" description="Add PDFs, DWGs, or spreadsheets" onClick={() => { addToast('Opening Document Upload Modal…','info'); navigate('/documents'); }} />
            <QuickActionTile icon={<ClipboardList size={15}/>} label="Generate Report" description="Create custom operational reports" onClick={() => { addToast('Opening Report Wizard…','info'); navigate('/reports'); }} />
            <QuickActionTile icon={<PenTool size={15}/>} label="Create Work Order" description="Draft new maintenance request" onClick={() => { addToast('Opening Work Order Draft…','info'); navigate('/maintenance'); }} />
            <QuickActionTile icon={<Cpu size={15}/>} label="Open AI Copilot" description="Chat with knowledge graph" color="var(--color-accent-cyan)" onClick={() => navigate('/copilot')} />
            <QuickActionTile icon={<GitBranch size={15}/>} label="Knowledge Graph" description="Explore asset relationships" color="var(--color-success)" onClick={() => navigate('/knowledge')} />
            <QuickActionTile icon={<ScanLine size={15}/>} label="Scan Asset QR" description="Identify physical assets via camera" color="var(--color-warning)" onClick={() => addToast('Camera: Scan QR code to identify asset','info')} />
          </div>
        </Card>

        {/* Health Table */}
        <Card>
          <div className="db-section-header">
            <span className="db-section-title"><Activity size={14}/> Machine Health</span>
            <button className="db-section-action" onClick={() => navigate('/assets')}>View all assets →</button>
          </div>
          <HealthTable assets={assets} />
        </Card>

        {/* Charts Row */}
        <div className="db-grid db-grid-2">
          {/* Health Trend */}
          <Card>
            <div className="db-section-header">
              <span className="db-section-title">Health Trend</span>
              <div className="db-chart-toolbar">
                {['1D','7D','30D','90D'].map(t => (
                  <button key={t} className={`db-chart-btn${timeframe===t?' active':''}`} onClick={() => setTimeframe(t)}>{t}</button>
                ))}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={160}>
              <AreaChart data={healthTrend} margin={{ top:4, right:4, left:-20, bottom:0 }}>
                <defs>
                  <linearGradient id="cyanGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#12D3FF" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#12D3FF" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#182840" vertical={false}/>
                <XAxis dataKey="name" stroke="#7D8DA6" tick={{fill:'#7D8DA6',fontSize:11}}/>
                <YAxis stroke="#7D8DA6" tick={{fill:'#7D8DA6',fontSize:11}} domain={[80,100]}/>
                <Tooltip contentStyle={{background:'var(--bg-card)',border:'1px solid var(--border-color)',borderRadius:'6px',fontSize:'12px'}} itemStyle={{color:'#12D3FF'}}/>
                <Area type="monotone" dataKey="value" stroke="#12D3FF" strokeWidth={2} fill="url(#cyanGrad)" dot={false}/>
              </AreaChart>
            </ResponsiveContainer>
          </Card>

          {/* Downtime */}
          <Card>
            <div className="db-section-header">
              <span className="db-section-title">Downtime by Dept (hrs)</span>
              <button className="db-section-action" onClick={() => navigate('/reports')}>Export →</button>
            </div>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={downtimeData} margin={{top:4,right:4,left:-20,bottom:0}}>
                <CartesianGrid strokeDasharray="3 3" stroke="#182840" vertical={false}/>
                <XAxis dataKey="name" stroke="#7D8DA6" tick={{fill:'#7D8DA6',fontSize:11}}/>
                <YAxis stroke="#7D8DA6" tick={{fill:'#7D8DA6',fontSize:11}}/>
                <Tooltip contentStyle={{background:'var(--bg-card)',border:'1px solid var(--border-color)',borderRadius:'6px',fontSize:'12px'}} itemStyle={{color:'#F45B69'}}/>
                <Bar dataKey="value" fill="#F45B69" radius={[4,4,0,0]} maxBarSize={48}/>
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Bottom 3-col Row */}
        <div className="db-grid db-grid-3">
          {/* Activity */}
          <Card>
            <div className="db-section-header">
              <span className="db-section-title">Recent Activity</span>
            </div>
            <div className="db-list">
              {activities.slice(0, 5).map((a) => (
                <div key={a.id} className="db-list-item" onClick={() => addToast(a.text, 'info')}>
                  <div className="db-activity-dot" style={{ background: a.color }} />
                  <div className="db-list-content">
                    <div className="db-list-title">{a.text}</div>
                  </div>
                  <span className="db-list-time">{a.time}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Upcoming Maintenance */}
          <Card>
            <div className="db-section-header">
              <span className="db-section-title"><Calendar size={13}/> Upcoming Maintenance</span>
              <button className="db-section-action" onClick={() => navigate('/maintenance')}>All →</button>
            </div>
            <div className="db-list">
              {upcoming.map((u,i) => (
                <div key={i} className="db-maint-item" onClick={() => { addToast(`Opening WO: ${u.asset}`,'info'); navigate('/maintenance'); }}>
                  <div className="db-maint-date-box">
                    <div className="db-maint-day">{u.day}</div>
                    <div className="db-maint-mon">{u.mon}</div>
                  </div>
                  <div className="db-list-content">
                    <div className="db-list-title">{u.asset}</div>
                    <div className="db-list-sub">{u.task}</div>
                  </div>
                  <ArrowRight size={14} color="var(--text-muted)" />
                </div>
              ))}
            </div>
          </Card>

          {/* Maintenance Pie */}
          <Card>
            <div className="db-section-header">
              <span className="db-section-title">Maintenance Completion</span>
            </div>
            <ResponsiveContainer width="100%" height={140}>
              <PieChart>
                <Pie data={maintData} cx="50%" cy="50%" innerRadius={42} outerRadius={58} paddingAngle={4} dataKey="value">
                  {maintData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                </Pie>
                <Tooltip contentStyle={{background:'var(--bg-card)',border:'1px solid var(--border-color)',borderRadius:'6px',fontSize:'12px'}}/>
              </PieChart>
            </ResponsiveContainer>
            <div style={{ display:'flex', justifyContent:'center', gap:'16px', marginTop:'-4px' }}>
              <span style={{fontSize:'12px',color:'var(--color-primary-blue)',fontWeight:600}}>● 75% Completed</span>
              <span style={{fontSize:'12px',color:'var(--text-muted)'}}>● 25% Pending</span>
            </div>
          </Card>
        </div>
      </div>

      {/* ───── RIGHT SIDEBAR ───── */}
      <div className="db-right-section">

        {/* AI Recommendations */}
        <Card className="db-right-card">
          <div className="db-section-header">
            <span className="db-section-title">AI Recommendations</span>
            <Badge variant="default">4</Badge>
          </div>
          <div className="db-list">
            <div className="db-ai-rec-item" onClick={() => navigate('/copilot')}>
              <Badge variant="critical">Critical</Badge>
              <div className="db-ai-rec-text">Replace Pump-14 mechanical seal within 7 days.</div>
            </div>
            <div className="db-ai-rec-item" onClick={() => navigate('/copilot')}>
              <Badge variant="warning">High</Badge>
              <div className="db-ai-rec-text">Inspect bearing alignment.</div>
            </div>
            <div className="db-ai-rec-item" onClick={() => navigate('/copilot')}>
              <Badge variant="default">Medium</Badge>
              <div className="db-ai-rec-text">Review vibration trend with analyst.</div>
            </div>
            <div className="db-ai-rec-item" onClick={() => navigate('/copilot')}>
              <Badge variant="default">Low</Badge>
              <div className="db-ai-rec-text">Generate RCA after maintenance.</div>
            </div>
          </div>
        </Card>

        {/* Recent Docs */}
        <Card className="db-right-card">
          <div className="db-section-header">
            <span className="db-section-title">Recent Documents</span>
            <button className="db-section-action" onClick={() => navigate('/documents')}>All →</button>
          </div>
          <div className="db-list">
            {documents.slice(0, 5).map((d) => (
              <div key={d.id} className="db-list-item" onClick={() => { addToast(`Opening ${d.name}`,'info'); navigate('/documents'); }}>
                <FileText size={13} className="db-list-icon" color="var(--text-muted)" />
                <div className="db-list-content">
                  <div className="db-list-title">{d.name}</div>
                  <div className="db-list-sub">{d.type}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* System Health */}
        <Card className="db-right-card">
          <div className="db-section-header">
            <span className="db-section-title">System Health</span>
            <Badge variant="success">All OK</Badge>
          </div>
          <div>
            <div className="db-sys-item">
              <span className="db-sys-name"><FileCheck size={13}/> OCR Service</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--text-primary)' }}><span className="pm-status-dot"></span> Healthy</div>
            </div>
            <div className="db-sys-item">
              <span className="db-sys-name"><GitBranch size={13}/> Knowledge Graph</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--text-primary)' }}><span className="pm-status-dot"></span> Healthy</div>
            </div>
            <div className="db-sys-item">
              <span className="db-sys-name"><Cpu size={13}/> AI Copilot</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--text-primary)' }}><span className="pm-status-dot" style={{ background: 'var(--color-warning)' }}></span> Degraded</div>
            </div>
            <div className="db-sys-item">
              <span className="db-sys-name"><Database size={13}/> Database</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--text-primary)' }}><span className="pm-status-dot"></span> Healthy</div>
            </div>
          </div>
        </Card>

        {/* Maintenance Donut */}
        <Card className="db-right-card">
          <div className="db-section-header">
            <span className="db-section-title">Asset Risk Summary</span>
          </div>
          <ResponsiveContainer width="100%" height={100}>
            <PieChart>
              <Pie data={[{v:1126},{v:32},{v:126}]} cx="50%" cy="50%" innerRadius={28} outerRadius={42} dataKey="v" paddingAngle={3}>
                <Cell fill="var(--color-success)" />
                <Cell fill="var(--color-critical)" />
                <Cell fill="var(--color-warning)" />
              </Pie>
              <Tooltip contentStyle={{background:'var(--bg-card)',border:'1px solid var(--border-color)',borderRadius:'6px',fontSize:'11px'}}/>
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display:'flex', flexDirection:'column', gap:'4px', marginTop:'4px' }}>
            <div style={{ display:'flex', justifyContent:'space-between', fontSize:'11px' }}>
              <span style={{ color:'var(--color-success)' }}>● Healthy</span><span>1,126</span>
            </div>
            <div style={{ display:'flex', justifyContent:'space-between', fontSize:'11px' }}>
              <span style={{ color:'var(--color-warning)' }}>● At-Risk</span><span>126</span>
            </div>
            <div style={{ display:'flex', justifyContent:'space-between', fontSize:'11px' }}>
              <span style={{ color:'var(--color-critical)' }}>● Critical</span><span>32</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
