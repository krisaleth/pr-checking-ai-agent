import React, { useState } from 'react';
import {
  Code2,
  Lock,
  User,
  Eye,
  EyeOff,
  ShieldCheck,
  AlertCircle,
  Loader2,
  ArrowRight,
  Terminal,
  Activity
} from 'lucide-react';

interface AdminLoginProps {
  onLoginSuccess?: (token: string) => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation cơ bản trước khi gọi API
    if (!username.trim() || !password) {
      setErrorMessage('Please provide both admin username and passphrase.');
      return;
    }

    setIsLoading(true);

    try {
      // Mock call API tới endpoint: POST /admin/login
      // Thực tế thay bằng: const res = await axios.post('/admin/login', { username, password, rememberMe });
      await new Promise((resolve) => setTimeout(resolve, 900));

      // Demo login test: username = "admin", password = bất kỳ khác rỗng
      if (username.trim() === 'admin' || username.trim() === 'secops-admin') {
        if (onLoginSuccess) {
          onLoginSuccess('mock_jwt_token_admin_session_key_v2.4');
        } else {
          // Điều hướng chuyển trang nếu có router
          console.log('Login successful');
        }
      } else {
        setErrorMessage('Invalid username or passphrase. Please verify your credentials.');
      }
    } catch (err: any) {
      setErrorMessage(err?.response?.data?.message || 'Authentication service unreachable. Try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070a11] text-slate-100 flex flex-col justify-between items-center p-4 selection:bg-blue-500/30 relative overflow-hidden font-sans">
      {/* Background Subtle Glow Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(59,130,246,0.15),rgba(255,255,255,0))] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293d08_1px,transparent_1px),linear-gradient(to_bottom,#1f293d08_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      {/* Top Bar Spacer */}
      <div className="w-full h-8" />

      {/* Main Login Card Container */}
      <div className="relative z-10 w-full max-w-[440px] my-auto">
        <div className="bg-[#0e131e]/95 backdrop-blur-xl border border-slate-800/90 rounded-2xl p-7 sm:p-8 shadow-2xl shadow-black/80 space-y-6">
          
          {/* Header Brand */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-blue-600/15 border border-blue-500/30 flex items-center justify-center text-blue-400 font-mono font-bold text-lg shadow-inner">
                <Code2 className="w-5 h-5" />
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-[11px] font-mono font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                v2.4 SECURE
              </div>
            </div>

            <div>
              <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                PR Check AI Agent
              </h1>
              <div className="text-[11px] font-mono uppercase tracking-wider text-blue-400/90 font-semibold mt-0.5">
                ADMIN PORTAL CONSOLE
              </div>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Sign in to access protected triage rules, telemetry stream, and code review policies.
              </p>
            </div>
          </div>

          {/* Error Message Box */}
          {errorMessage && (
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-start gap-2.5 text-xs animate-in fade-in slide-in-from-top-1 duration-200">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <div className="leading-snug">{errorMessage}</div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-slate-300">
                Admin Identity / Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. secops-admin"
                  className="w-full bg-[#131926] border border-slate-700/80 rounded-lg pl-9 pr-3.5 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors font-mono"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-medium text-slate-300">
                  Session Passphrase
                </label>
                <span className="text-[10px] font-mono text-slate-500 tracking-wider">
                  RSA-4096
                </span>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter master admin key"
                  className="w-full bg-[#131926] border border-slate-700/80 rounded-lg pl-9 pr-10 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors font-mono"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me & Need Access */}
            <div className="flex items-center justify-between pt-1 text-xs">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-3.5 h-3.5 rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-0 focus:ring-offset-0 transition-colors"
                />
                <span className="text-slate-400 hover:text-slate-300">Remember device</span>
              </label>

              <button
                type="button"
                onClick={() => alert('Please contact internal SecOps or Infra Lead to issue or rotate emergency tokens.')}
                className="text-slate-400 hover:text-blue-400 transition-colors"
              >
                Need access?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-2.5 px-4 rounded-lg bg-blue-600 hover:bg-blue-500 active:bg-blue-700 disabled:opacity-60 text-white font-medium text-xs sm:text-sm shadow-md shadow-blue-600/20 transition-all flex items-center justify-center gap-2 group"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Signing In to Workspace...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-blue-200" />
                  <span>Sign In to Workspace</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform text-blue-200" />
                </>
              )}
            </button>
          </form>

          {/* System Telemetry Health Banner */}
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>SYSTEM ONLINE</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-500">
              <span>API:</span>
              <span className="text-emerald-400 font-semibold">HEALTHY (12ms)</span>
            </div>
          </div>
        </div>

        {/* Security Compliance Footnote */}
        <div className="mt-6 text-center space-y-1 text-slate-500 text-[11px]">
          <div className="flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
            <span>Protected by internal organization SSO & WebAuthn guardrails</span>
          </div>
          <div className="font-mono text-[10px] text-slate-600">
            v2.4 Developer Console • Strict IP Whitelisting Enabled
          </div>
        </div>
      </div>

      {/* Bottom Global Footer */}
      <footer className="w-full text-center py-4 text-[11px] font-mono text-slate-600 relative z-10">
        PR CHECK AI AGENT v2.4.0 • SECURE WORKSPACE TELEMETRY • © 2025 INC.
      </footer>
    </div>
  );
};