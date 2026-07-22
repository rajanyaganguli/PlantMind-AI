import type { ElementType } from 'react';
import { Card } from '../components/ui/Card';

export function PlaceholderPage({ title, icon: Icon }: { title: string; icon: ElementType }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', padding: '24px' }}>
      <Card style={{ padding: '48px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', maxWidth: '400px', textAlign: 'center' }}>
        <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(47,107,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={32} color="var(--color-primary-blue)" />
        </div>
        <div style={{ fontSize: '20px', fontWeight: 600, color: 'var(--text-primary)' }}>{title}</div>
        <div style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
          This module is part of the PlantMind AI enterprise suite. Integration and data pipeline connections are currently being provisioned.
        </div>
      </Card>
    </div>
  );
}
