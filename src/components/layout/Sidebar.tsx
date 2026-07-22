import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, FileText, Box, MessageSquare, BookOpen,
  Wrench, AlertTriangle, ShieldCheck, BarChart2, Settings, Cpu
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './layout.css';

const navGroups: { label: string; items: { name: string; path: string; icon: React.ElementType; badge: string | null; badgeType?: string }[] }[] = [
  {
    label: 'OVERVIEW',
    items: [
      { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, badge: null },
    ],
  },
  {
    label: 'WORKSPACE',
    items: [
      { name: 'AI Copilot', path: '/copilot', icon: MessageSquare, badge: null },
      { name: 'Knowledge Hub', path: '/knowledge', icon: BookOpen, badge: null },
      { name: 'Documents', path: '/documents', icon: FileText, badge: '48k' },
    ],
  },
  {
    label: 'OPERATIONS',
    items: [
      { name: 'Assets', path: '/assets', icon: Box, badge: null },
      { name: 'Maintenance', path: '/maintenance', icon: Wrench, badge: '47', badgeType: 'warn' },
    ],
  },
  {
    label: 'ANALYTICS',
    items: [
      { name: 'Root Cause', path: '/root-cause', icon: AlertTriangle, badge: '3', badgeType: 'err' },
      { name: 'Compliance', path: '/compliance', icon: ShieldCheck, badge: null },
      { name: 'Reports', path: '/reports', icon: BarChart2, badge: null },
    ],
  },
  {
    label: 'ADMINISTRATION',
    items: [
      { name: 'Settings', path: '/settings', icon: Settings, badge: null },
    ],
  },
];

export function Sidebar() {
  const { user } = useAuth();

  return (
    <aside className="pm-sidebar">
      <div className="pm-sidebar-header">
        <Cpu size={20} className="pm-sidebar-logo" />
        <span className="pm-sidebar-brand">PlantMind AI</span>
      </div>

      <div className="pm-company-pill">
        <span className="pm-company-name">Apex Steel Industries Pvt Ltd</span>
        <span className="pm-company-plant">Hazira Manufacturing Plant</span>
      </div>

      <nav className="pm-nav">
        {navGroups.map(group => (
          <div key={group.label}>
            <div className="pm-nav-section-label">{group.label}</div>
            {group.items.map(item => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) => `pm-nav-item${isActive ? ' active' : ''}`}
              >
                <item.icon size={16} />
                <span>{item.name}</span>
                {item.badge && (
                  <span className={`pm-nav-badge${item.badgeType === 'warn' ? ' warn' : ''}`}>
                    {item.badge}
                  </span>
                )}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      <div className="pm-sidebar-footer">
        <div className="pm-profile-row">
          <div className="pm-avatar">{user?.initials ?? 'RS'}</div>
          <div>
            <div className="pm-profile-name">{user?.name ?? 'Rahul Sharma'}</div>
            <div className="pm-profile-role">{user?.role ?? 'Reliability Engineer'}</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
