import React, { useState } from 'react';
import {
  AlertCircle,
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Loader2,
  ShieldCheck,
  User,
} from 'lucide-react';

import { loginAdmin } from '../services/adminApi.ts';

interface AdminLoginProps {
  onLoginSuccess: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({
  onLoginSuccess,
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!username.trim() || !password) {
      setError('Vui lòng nhập username và password.');
      return;
    }

    try {
      setLoading(true);
      setError('');

      await loginAdmin(username.trim(), password);

      onLoginSuccess();
    } catch (err) {
      console.error('Admin login failed:', err);

      setError(
        err instanceof Error
          ? err.message
          : 'Username hoặc password không chính xác.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />

        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(148,163,184,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.5) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-600/15 border border-blue-500/30 text-blue-400 shadow-lg shadow-blue-500/5">
            <ShieldCheck size={28} />
          </div>

          <h1 className="mt-5 text-2xl font-bold tracking-tight text-white">
            PR Check AI Agent
          </h1>

          <p className="mt-2 text-sm text-slate-400">
            Admin Console
          </p>
        </div>

        {/* Login Card */}
        <div className="rounded-2xl border border-slate-800 bg-[#0d121d]/95 shadow-2xl shadow-black/30 backdrop-blur-xl p-7">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-white">
              Sign in
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Đăng nhập để truy cập Admin Dashboard.
            </p>
          </div>

          {error && (
            <div className="mb-5 flex items-start gap-3 rounded-lg border border-rose-500/25 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
              <AlertCircle
                size={18}
                className="mt-0.5 flex-shrink-0"
              />

              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <div>
              <label
                htmlFor="admin-username"
                className="block text-xs font-medium text-slate-300 mb-2"
              >
                Username
              </label>

              <div className="relative">
                <User
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                />

                <input
                  id="admin-username"
                  type="text"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  placeholder="Admin username"
                  autoComplete="username"
                  disabled={loading}
                  className="w-full h-11 rounded-lg border border-slate-700 bg-[#080c14] pl-10 pr-3 text-sm text-white placeholder:text-slate-600 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 disabled:opacity-60"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="admin-password"
                className="block text-xs font-medium text-slate-300 mb-2"
              >
                Password
              </label>

              <div className="relative">
                <LockKeyhole
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                />

                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Admin password"
                  autoComplete="current-password"
                  disabled={loading}
                  className="w-full h-11 rounded-lg border border-slate-700 bg-[#080c14] pl-10 pr-11 text-sm text-white placeholder:text-slate-600 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 disabled:opacity-60"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  disabled={loading}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition"
                  aria-label={
                    showPassword
                      ? 'Hide password'
                      : 'Show password'
                  }
                >
                  {showPassword ? (
                    <EyeOff size={17} />
                  ) : (
                    <Eye size={17} />
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-lg bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white text-sm font-semibold flex items-center justify-center gap-2 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 size={17} className="animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign in
                  <ArrowRight size={17} />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-800 text-center">
            <p className="text-[11px] text-slate-500 font-mono">
              PR Check AI Agent • Protected Admin Area
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;