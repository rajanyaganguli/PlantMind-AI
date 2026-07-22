import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Cpu, User, FileText, ChevronRight, Send, Paperclip, 
  Mic, Trash2, Edit2, Pin, Plus, Clock 
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { useToast } from '../context/ToastContext';
import '../components/dashboard/dashboard.css';

interface Message {
  id: string;
  role: 'user' | 'ai';
  content: string | React.ReactNode;
  citations?: string[];
  suggestions?: string[];
  timestamp: string;
}

const mockConversations = [
  { id: '1', title: 'Pump-14 Failure Prediction', time: '10m ago', pinned: true },
  { id: '2', title: 'OISD Audit Preparation', time: '2h ago', pinned: false },
  { id: '3', title: 'Lubrication Schedule Optimization', time: 'Yesterday', pinned: false },
  { id: '4', title: 'Compressor-08 Vibration Trend', time: 'Yesterday', pinned: false },
];

const now = () => new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

export function AICopilot() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm1',
      role: 'ai',
      content: (
        <div>
          <h4 style={{ marginBottom: '8px', color: 'var(--text-primary)' }}>Hazira Plant Command Center</h4>
          <p style={{ marginBottom: '12px' }}>I am fully synced with your plant telemetry and document graph. How can I assist you today?</p>
          <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: 'var(--text-muted)' }}>
            <span>● 1,284 Assets</span>
            <span>● 48,392 Documents</span>
            <span>● Live Telemetry</span>
          </div>
        </div>
      ),
      suggestions: ['Show health of Pump-14', 'List critical assets', 'What maintenance is due this week?', 'Explain RCA for seal failure'],
      timestamp: now(),
    }
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const send = (text?: string) => {
    const q = text ?? input;
    if (!q.trim()) return;
    setInput('');
    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: q, timestamp: now() };
    setMessages(prev => [...prev, userMsg]);
    setTyping(true);
    
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: (
          <div>
            <p style={{ marginBottom: '12px' }}>Based on the indexed documents and sensor telemetry for Hazira Manufacturing Plant, here is what I found:</p>
            <div style={{ background: 'var(--bg-primary)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontWeight: 600, color: 'var(--color-primary-blue)' }}>Pump-14 (PUMP-14-JR3)</span>
                <Badge variant="critical">74% Health</Badge>
              </div>
              <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '4px', margin: 0 }}>
                <li><strong>Remaining Useful Life:</strong> 118 days</li>
                <li><strong>Alert:</strong> Mechanical Seal Leakage</li>
                <li><strong>Sensor:</strong> Bearing temp reached <span style={{ color: 'var(--color-critical)' }}>87°C</span> (Threshold: 80°C)</li>
              </ul>
            </div>
            <p><strong>Recommended Action:</strong> Replace mechanical seal within 7 days to prevent unplanned downtime.</p>
          </div>
        ),
        citations: ['Pump_14_Inspection_Report_May_2026.pdf', 'OEM_Manual_Flowserve_DVSH200HC.pdf'],
        suggestions: ['Generate Work Order for seal replacement', 'Show vibration trend', 'What does the OEM manual say?'],
        timestamp: now(),
      }]);
      setTyping(false);
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div style={{ display: 'flex', height: '100%', gap: '16px', overflow: 'hidden' }}>
      
      {/* ─── LEFT SIDEBAR: Conversation History ─── */}
      <div style={{ width: '280px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <button className="pm-btn pm-btn-primary animate-ripple" onClick={() => addToast('Started new conversation', 'success')} style={{ width: '100%', justifyContent: 'center' }}>
          <Plus size={16} /> New Conversation
        </button>
        
        <div className="pm-card" style={{ flex: 1, padding: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-color)', fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Recent Chats
          </div>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {mockConversations.map(c => (
              <div key={c.id} className="db-list-item animate-ripple" style={{ margin: 0, padding: '12px 16px', borderBottom: '1px solid var(--border-subtle)', borderRadius: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '13px', fontWeight: c.id === '1' ? 600 : 500, color: c.id === '1' ? 'var(--color-primary-blue)' : 'var(--text-primary)' }}>{c.title}</span>
                  {c.pinned && <Pin size={12} color="var(--color-accent-cyan)" />}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}><Clock size={10} style={{ display: 'inline', marginRight: '4px' }}/> {c.time}</span>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="pm-btn-ghost" style={{ padding: '2px', background: 'none', border: 'none', color: 'var(--text-muted)' }} onClick={e => { e.stopPropagation(); addToast('Rename conversation', 'info'); }}><Edit2 size={12}/></button>
                    <button className="pm-btn-ghost" style={{ padding: '2px', background: 'none', border: 'none', color: 'var(--color-critical)' }} onClick={e => { e.stopPropagation(); addToast('Delete conversation', 'error'); }}><Trash2 size={12}/></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── MAIN CHAT AREA ─── */}
      <Card style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: 0 }}>
        
        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {messages.map((m) => (
            <div key={m.id} className="animate-fade" style={{ display: 'flex', gap: '16px', flexDirection: m.role === 'user' ? 'row-reverse' : 'row' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', flexShrink: 0, background: m.role === 'ai' ? 'var(--color-primary-blue)' : 'var(--bg-secondary)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-card)' }}>
                {m.role === 'ai' ? <Cpu size={18} color="#fff"/> : <User size={18} color="var(--text-muted)"/>}
              </div>
              <div style={{ maxWidth: '75%' }}>
                <div style={{
                  background: m.role === 'ai' ? 'transparent' : 'rgba(47,107,255,0.08)',
                  border: m.role === 'ai' ? 'none' : '1px solid rgba(47,107,255,0.2)',
                  borderRadius: '12px',
                  padding: m.role === 'ai' ? '0' : '12px 16px',
                  fontSize: '14px',
                  color: 'var(--text-primary)',
                  lineHeight: '1.6',
                }}>
                  {m.content}
                </div>
                {m.citations && (
                  <div style={{ marginTop: '12px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {m.citations.map((c, ci) => (
                      <div key={ci} onClick={() => { addToast(`Previewing ${c}`, 'info'); navigate('/documents'); }} className="animate-ripple" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', padding: '4px 10px', borderRadius: '4px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                        <FileText size={12} color="var(--color-primary-blue)"/> {c}
                      </div>
                    ))}
                  </div>
                )}
                {m.suggestions && m.role === 'ai' && (
                  <div style={{ marginTop: '16px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {m.suggestions.map((s, si) => (
                      <button key={si} className="pm-btn pm-btn-secondary pm-btn-sm animate-ripple" onClick={() => send(s)} style={{ borderRadius: '16px', fontSize: '12px' }}>
                        {s} <ChevronRight size={12} />
                      </button>
                    ))}
                  </div>
                )}
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '8px', textAlign: m.role === 'user' ? 'right' : 'left' }}>{m.timestamp}</div>
              </div>
            </div>
          ))}
          
          {typing && (
            <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--color-primary-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: 'var(--shadow-card)' }}>
                <Cpu size={18} color="#fff"/>
              </div>
              <div style={{ padding: '8px 12px' }}>
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center', height: '100%' }}>
                  {[0, 1, 2].map(d => (
                    <div key={d} style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--color-primary-blue)', animation: `pulse 1.2s ease ${d * 0.2}s infinite` }} />
                  ))}
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input Area */}
        <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border-color)', background: 'var(--bg-sidebar)' }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius)', padding: '12px', transition: 'border-color var(--transition-fast)' }} className={input ? 'focused' : ''}>
            <button className="pm-btn-ghost" onClick={() => addToast('Open file attachment dialog', 'info')} style={{ padding: '4px', background: 'none', border: 'none', color: 'var(--text-muted)' }}><Paperclip size={18}/></button>
            <textarea
              style={{ flex: 1, background: 'transparent', border: 'none', color: 'var(--text-primary)', fontSize: '14px', outline: 'none', resize: 'none', maxHeight: '120px', minHeight: '24px', lineHeight: '1.5' }}
              placeholder="Ask about assets, documents, maintenance, RCA (Shift+Enter for newline)"
              value={input}
              rows={Math.min(5, input.split('\n').length)}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button className="pm-btn-ghost" onClick={() => addToast('Voice input started', 'info')} style={{ padding: '4px', background: 'none', border: 'none', color: 'var(--text-muted)' }}><Mic size={18}/></button>
            <button className="pm-btn pm-btn-primary animate-ripple" onClick={() => send()} disabled={!input.trim()} style={{ padding: '8px', borderRadius: '8px' }}>
              <Send size={16}/>
            </button>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', fontSize: '11px', color: 'var(--text-muted)' }}>
            <span>AI responses are generated based on indexed documents and live telemetry. Verify critical actions.</span>
            <button className="pm-btn-ghost" onClick={() => { setMessages([messages[0]]); addToast('Chat cleared', 'success'); }} style={{ background: 'none', border: 'none', textDecoration: 'underline' }}>Clear Chat</button>
          </div>
        </div>
      </Card>
      
    </div>
  );
}
