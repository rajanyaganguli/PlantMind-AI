import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { GlobalProvider } from './context/GlobalContext';
import { AppLayout } from './components/layout/AppLayout';
import { Dashboard } from './pages/Dashboard';
import { AssetDetail } from './pages/AssetDetail';
import { Documents } from './pages/Documents';
import { KnowledgeHub } from './pages/KnowledgeHub';
import { Timeline } from './pages/Timeline';
import { AICopilot } from './pages/AICopilot';
import { Login } from './pages/Login';
import { PlaceholderPage } from './pages/PlaceholderPage';
import { ShieldCheck, Wrench, AlertTriangle, BarChart2, Settings } from 'lucide-react';
import type { ReactNode } from 'react';

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  return user ? <>{children}</> : <Navigate to="/login" replace />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/dashboard" element={
        <ProtectedRoute><AppLayout title="AI Command Center"><Dashboard /></AppLayout></ProtectedRoute>
      } />
      <Route path="/assets" element={
        <ProtectedRoute><AppLayout title="Asset Detail: Pump-14"><AssetDetail /></AppLayout></ProtectedRoute>
      } />
      <Route path="/documents" element={
        <ProtectedRoute><AppLayout title="Document Intelligence" fullHeight><Documents /></AppLayout></ProtectedRoute>
      } />
      <Route path="/knowledge" element={
        <ProtectedRoute><AppLayout title="Knowledge Hub" fullHeight><KnowledgeHub /></AppLayout></ProtectedRoute>
      } />
      <Route path="/timeline" element={
        <ProtectedRoute><AppLayout title="Timeline" fullHeight><Timeline /></AppLayout></ProtectedRoute>
      } />
      <Route path="/copilot" element={
        <ProtectedRoute><AppLayout title="AI Copilot" fullHeight><AICopilot /></AppLayout></ProtectedRoute>
      } />
      <Route path="/maintenance" element={
        <ProtectedRoute><AppLayout title="Maintenance"><PlaceholderPage title="Maintenance" icon={Wrench} /></AppLayout></ProtectedRoute>
      } />
      <Route path="/root-cause" element={
        <ProtectedRoute><AppLayout title="Root Cause Analysis"><PlaceholderPage title="Root Cause Analysis" icon={AlertTriangle} /></AppLayout></ProtectedRoute>
      } />
      <Route path="/compliance" element={
        <ProtectedRoute><AppLayout title="Compliance"><PlaceholderPage title="Compliance" icon={ShieldCheck} /></AppLayout></ProtectedRoute>
      } />
      <Route path="/reports" element={
        <ProtectedRoute><AppLayout title="Reports"><PlaceholderPage title="Reports" icon={BarChart2} /></AppLayout></ProtectedRoute>
      } />
      <Route path="/settings" element={
        <ProtectedRoute><AppLayout title="Settings"><PlaceholderPage title="Settings" icon={Settings} /></AppLayout></ProtectedRoute>
      } />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <GlobalProvider>
          <ToastProvider>
            <AppRoutes />
          </ToastProvider>
        </GlobalProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
