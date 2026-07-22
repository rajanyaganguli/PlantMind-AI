import type { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { TopNavbar } from './TopNavbar';
import './layout.css';

interface AppLayoutProps { children: ReactNode; title: string; fullHeight?: boolean; }

export function AppLayout({ children, title, fullHeight }: AppLayoutProps) {
  return (
    <div className="pm-layout">
      <Sidebar />
      <div className="pm-main-content">
        <TopNavbar title={title} />
        <main className="pm-page-content" style={fullHeight ? { overflow: 'hidden', padding: 0 } : {}}>
          {children}
        </main>
      </div>
    </div>
  );
}
