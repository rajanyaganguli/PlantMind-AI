import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

export interface AppDocument {
  id: string;
  name: string;
  short: string;
  type: string;
  date: string;
  confidence: number;
  status: string;
  color: string;
}

export interface AppActivity {
  id: string;
  text: string;
  color: string;
  time: string;
}

interface GlobalContextType {
  documents: AppDocument[];
  addDocument: (doc: AppDocument) => void;
  activities: AppActivity[];
  addActivity: (activity: AppActivity) => void;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export function GlobalProvider({ children }: { children: ReactNode }) {
  const [documents, setDocuments] = useState<AppDocument[]>([
    { id: '1', name: 'Pump_14_Inspection_Report_Q2_2026.pdf', short: 'Pump-14 Inspection Report Q2.pdf', type: 'Report', date: 'Jul 12, 2026', confidence: 97, status: 'indexed', color: '#14C38E' },
    { id: '2', name: 'Lubrication_SOP_Rev4.pdf', short: 'Lubrication SOP Rev4.pdf', type: 'SOP', date: 'Jan 05, 2026', confidence: 94, status: 'indexed', color: '#14C38E' },
    { id: '3', name: 'Pump14_PandID_RevC.dwg', short: 'Pump-14 P&ID RevC.dwg', type: 'Drawing', date: 'Mar 22, 2025', confidence: 88, status: 'processing', color: '#F6B73C' },
    { id: '4', name: 'Bearing_Replacement_WO10231.pdf', short: 'Bearing Replacement WO10231.pdf', type: 'Work Order', date: 'Jun 30, 2026', confidence: 99, status: 'indexed', color: '#14C38E' },
    { id: '5', name: 'Pump14_Vibration_Analysis.xlsx', short: 'Pump-14 Vibration Analysis.xlsx', type: 'Data', date: 'Jul 15, 2026', confidence: 91, status: 'indexed', color: '#14C38E' },
    { id: '6', name: 'Root_Cause_Analysis_SealFailure_2026.pdf', short: 'RCA – Seal Failure 2026.pdf', type: 'RCA', date: 'Jul 16, 2026', confidence: 96, status: 'review', color: '#F45B69' },
  ]);

  const [activities, setActivities] = useState<AppActivity[]>([
    { id: 'a1', text: 'Pump-14 Q2 Inspection indexed', color: 'var(--color-success)', time: '5m ago' },
    { id: 'a2', text: '24 entities extracted from RCA report', color: 'var(--color-primary-blue)', time: '12m ago' },
    { id: 'a3', text: 'Work Order WO-4821 linked to Pump-14', color: 'var(--color-warning)', time: '1h ago' },
    { id: 'a4', text: 'Sensor alert: Bearing temp 87°C updated', color: 'var(--color-critical)', time: '2h ago' },
    { id: 'a5', text: 'Annotation added to OEM Manual by Priya Nair', color: 'var(--color-accent-cyan)', time: '3h ago' },
  ]);

  const addDocument = (doc: AppDocument) => setDocuments(prev => [doc, ...prev]);
  const addActivity = (act: AppActivity) => setActivities(prev => [act, ...prev]);

  return (
    <GlobalContext.Provider value={{ documents, addDocument, activities, addActivity }}>
      {children}
    </GlobalContext.Provider>
  );
}

export function useGlobal() {
  const context = useContext(GlobalContext);
  if (!context) throw new Error('useGlobal must be used within GlobalProvider');
  return context;
}
