import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Cpu, Eye, EyeOff, Loader2, Shield } from 'lucide-react';
import { useAuth, DEMO_USER } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import './login.css';

export function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { addToast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [ssoLoading, setSsoLoading] = useState<'microsoft'|'google'|null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      login(DEMO_USER);
      setIsLoading(false);
      addToast('Welcome back, Rahul Sharma', 'success');
      navigate('/dashboard');
    }, 1400);
  };

  const handleSSO = (provider: 'microsoft' | 'google') => {
    setSsoLoading(provider);
    setTimeout(() => {
      login(DEMO_USER);
      setSsoLoading(null);
      addToast(`Authenticated via ${provider === 'microsoft' ? 'Microsoft Entra' : 'Google Workspace'}`, 'success');
      navigate('/dashboard');
    }, 1800);
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <div className="login-header">
          <div className="login-logo">
            <Cpu size={28} />
            <span style={{ fontSize:'22px', fontWeight:'700', color:'var(--text-primary)' }}>PlantMind AI</span>
          </div>
          <div className="login-subtitle">Industrial Knowledge Intelligence</div>
          <div className="login-desc">
            AI-powered industrial operations platform for manufacturing, power, oil &amp; gas and heavy engineering.
          </div>
        </div>

        <div className="login-form-container">
          <form onSubmit={handleLogin}>
            <div className="login-form-group">
              <label className="login-label">Email</label>
              <input type="email" className="login-input" placeholder="engineer@apexsteel.com" defaultValue="rahul.sharma@apexsteel.com" required />
            </div>
            <div className="login-form-group">
              <label className="login-label">Password</label>
              <div className="login-input-wrapper">
                <input type={showPassword ? 'text' : 'password'} className="login-input" placeholder="••••••••" defaultValue="password123" required />
                <button type="button" className="login-input-icon" onClick={() => setShowPassword(!showPassword)} style={{ background:'none', border:'none' }}>
                  {showPassword ? <EyeOff size={15}/> : <Eye size={15}/>}
                </button>
              </div>
            </div>
            <div className="login-options">
              <label className="login-checkbox"><input type="checkbox" style={{ accentColor:'var(--color-primary-blue)' }} defaultChecked /> Remember Me</label>
              <a href="#" className="login-forgot">Forgot Password?</a>
            </div>
            <button type="submit" className="pm-btn pm-btn-primary login-btn" disabled={isLoading}>
              {isLoading ? <Loader2 size={16} className="animate-spin"/> : <><Shield size={15}/> Sign In</>}
            </button>
          </form>

          <div className="login-divider">OR CONTINUE WITH</div>

          <button type="button" className="pm-btn pm-btn-secondary login-social-btn" onClick={() => handleSSO('microsoft')} disabled={!!ssoLoading}>
            {ssoLoading==='microsoft' ? <Loader2 size={14} className="animate-spin"/> : (
              <svg width="16" height="16" viewBox="0 0 23 23"><rect x="1" y="1" width="10" height="10" fill="#f25022"/><rect x="12" y="1" width="10" height="10" fill="#7fba00"/><rect x="1" y="12" width="10" height="10" fill="#00a4ef"/><rect x="12" y="12" width="10" height="10" fill="#ffb900"/></svg>
            )}
            Continue with Microsoft
          </button>
          <button type="button" className="pm-btn pm-btn-secondary login-social-btn" onClick={() => handleSSO('google')} disabled={!!ssoLoading}>
            {ssoLoading==='google' ? <Loader2 size={14} className="animate-spin"/> : (
              <svg width="16" height="16" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            )}
            Continue with Google
          </button>
        </div>

        <div className="login-footer">
          <div>© 2026 Apex Steel Industries Pvt Ltd · All rights reserved</div>
          <div style={{ marginTop:'4px' }}>PlantMind AI v1.0.0 · <a href="#" style={{ color:'var(--color-primary-blue)' }}>Privacy Policy</a> · <a href="#" style={{ color:'var(--color-primary-blue)' }}>Terms of Use</a></div>
        </div>
      </div>

      <div className="login-right">
        <div className="login-right-overlay" />
        <img src="/industrial_login_bg.png" alt="Industrial Operations" className="login-bg-img" />
      </div>
    </div>
  );
}
