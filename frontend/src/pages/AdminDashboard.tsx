import React, { useEffect, useState } from 'react';

import {
  getAdminHealth,
  getAdminStats,
  logoutAdmin,
} from '../services/adminApi.ts';

import {
  Server,
  Database,
  Cpu,
  GitPullRequest,
  FolderGit2,
  Activity,
  Webhook,
  AlertCircle,
  LogOut,
  SlidersHorizontal,
  Sparkles,
} from 'lucide-react';

interface AIReviewItem {
  id: string;
  repo: string;
  prNumber: string;
  prTitle: string;
  status: 'Completed' | 'Running' | 'Failed';
  model: string;
  completedTime: string;
}

interface WebhookItem {
  id: string;
  event: string;
  action: string;
  repo: string;
  status: 'received' | 'processing' | 'processed';
  timestamp: string;
}

interface EventLogItem {
  id: string;
  type: 'info' | 'active' | 'success' | 'warn' | 'error';
  title: string;
  description: string;
  meta?: string;
  time: string;
}

interface DashboardStats {
  repositories: number;
  pullRequests: number;
  reviews: number;
  webhooks: number;
  completed: number;
  running: number;
  queued: number;
  failed: number;
}

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'activity'>(
    'dashboard',
  );

  const [filterModel, setFilterModel] = useState<string>('ALL');

  const [stats, setStats] = useState<DashboardStats>({
    repositories: 0,
    pullRequests: 0,
    reviews: 0,
    webhooks: 0,
    completed: 0,
    running: 0,
    queued: 0,
    failed: 0,
  });

  const [health, setHealth] = useState<any>(null);

  const [reviews, setReviews] = useState<AIReviewItem[]>([]);
  const [webhooks, setWebhooks] = useState<WebhookItem[]>([]);
  const [eventLogs, setEventLogs] = useState<EventLogItem[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /*
   * ============================================================
   * Helpers
   * ============================================================
   */

  const formatDateTime = (
    value?: string | Date | null,
  ): string => {
    if (!value) {
      return 'N/A';
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return 'N/A';
    }

    return date.toLocaleString();
  };

  const getHealthStatus = (status?: string): string => {
    if (!status) {
      return 'Checking';
    }

    if (status.toUpperCase() === 'OK') {
      return 'Online';
    }

    if (
      status.toLowerCase() === 'connected' ||
      status.toLowerCase() === 'configured' ||
      status.toLowerCase() === 'online'
    ) {
      return 'Online';
    }

    if (
      status.toLowerCase() === 'disconnected' ||
      status.toLowerCase() === 'not_configured' ||
      status.toLowerCase() === 'offline'
    ) {
      return 'Offline';
    }

    return status;
  };

  const getReviewStatus = (
    status?: string,
  ): 'Completed' | 'Running' | 'Failed' => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'complete':
      case 'success':
      case 'succeeded':
        return 'Completed';

      case 'failed':
      case 'error':
        return 'Failed';

      case 'running':
      case 'processing':
      case 'in_progress':
      case 'in-progress':
        return 'Running';

      default:
        return 'Running';
    }
  };

  const getWebhookStatus = (
    status?: string,
  ): 'received' | 'processing' | 'processed' => {
    switch (status?.toLowerCase()) {
      case 'processed':
      case 'completed':
      case 'success':
      case 'succeeded':
        return 'processed';

      case 'processing':
      case 'running':
        return 'processing';

      default:
        return 'received';
    }
  };

  const getActivityType = (
    status?: string,
  ): 'info' | 'active' | 'success' | 'warn' | 'error' => {
    switch (status?.toLowerCase()) {
      case 'failed':
      case 'error':
        return 'error';

      case 'running':
      case 'processing':
      case 'queued':
        return 'active';

      case 'completed':
      case 'processed':
      case 'success':
      case 'succeeded':
        return 'success';

      case 'warning':
      case 'warn':
        return 'warn';

      default:
        return 'info';
    }
  };

  /*
   * ============================================================
   * Load dashboard data
   * ============================================================
   */

  useEffect(() => {
    let mounted = true;

    const loadDashboard = async () => {
      try {
        if (mounted) {
          setError(null);
        }

        const [healthResponse, statsResponse] = await Promise.all([
          getAdminHealth(),
          getAdminStats(),
        ]);

        if (!mounted) {
          return;
        }

        /*
         * --------------------------------------------------------
         * Health
         * --------------------------------------------------------
         */

        setHealth(healthResponse?.health ?? null);

        /*
         * --------------------------------------------------------
         * Statistics
         *
         * Backend response:
         *
         * {
         *   success: true,
         *   stats: {...},
         *   recentReviews: [...],
         *   recentWebhooks: [...],
         *   activities: [...]
         * }
         * --------------------------------------------------------
         */

        const backendStats = statsResponse?.stats ?? {};

        setStats({
          repositories: backendStats.repositories ?? 0,
          pullRequests: backendStats.pullRequests ?? 0,
          reviews: backendStats.reviews ?? 0,
          webhooks: backendStats.webhooks ?? 0,
          completed: backendStats.completed ?? 0,
          running: backendStats.running ?? 0,
          queued: backendStats.queued ?? 0,
          failed: backendStats.failed ?? 0,
        });

        /*
         * --------------------------------------------------------
         * Recent AI Reviews
         *
         * IMPORTANT:
         * recentReviews is NOT inside stats.
         * It is at statsResponse.recentReviews.
         * --------------------------------------------------------
         */

        const recentReviews =
          Array.isArray(statsResponse?.recentReviews)
            ? statsResponse.recentReviews
            : [];

        setReviews(
          recentReviews.map((review: any) => ({
            id: String(
              review?._id ??
                review?.id ??
                `review-${review?.createdAt ?? Date.now()}`,
            ),

            repo:
              review?.pullRequestId?.repositoryId?.fullName ||
              review?.pullRequestId?.repositoryId?.name ||
              review?.repository?.fullName ||
              review?.repository?.name ||
              'Unknown repository',

            prNumber: review?.pullRequestId?.githubPrNumber
              ? `#${review.pullRequestId.githubPrNumber}`
              : review?.pullRequest?.githubPrNumber
                ? `#${review.pullRequest.githubPrNumber}`
                : 'N/A',

            prTitle:
              review?.pullRequestId?.title ||
              review?.pullRequest?.title ||
              'Untitled Pull Request',

            status: getReviewStatus(review?.status),

            model:
              review?.model ||
              review?.aiModel ||
              review?.provider ||
              'OpenRouter',

            completedTime: formatDateTime(
              review?.completedAt ||
                review?.finishedAt ||
                review?.updatedAt ||
                review?.createdAt,
            ),
          })),
        );

        /*
         * --------------------------------------------------------
         * Recent Webhooks
         *
         * IMPORTANT:
         * recentWebhooks is NOT inside stats.
         * It is at statsResponse.recentWebhooks.
         * --------------------------------------------------------
         */

        const recentWebhooks =
          Array.isArray(statsResponse?.recentWebhooks)
            ? statsResponse.recentWebhooks
            : [];

        setWebhooks(
          recentWebhooks.map((webhook: any) => ({
            id: String(
              webhook?._id ??
                webhook?.id ??
                `webhook-${webhook?.createdAt ?? Date.now()}`,
            ),

            event: webhook?.event || 'unknown',

            action: webhook?.action || 'unknown',

            repo:
              webhook?.repositoryId?.fullName ||
              webhook?.repositoryId?.name ||
              webhook?.repository?.fullName ||
              webhook?.repository?.name ||
              'Unknown repository',

            status: getWebhookStatus(webhook?.status),

            timestamp: formatDateTime(
              webhook?.receivedAt ||
                webhook?.createdAt ||
                webhook?.updatedAt,
            ),
          })),
        );

        /*
         * --------------------------------------------------------
         * Activity Log
         *
         * IMPORTANT:
         * activities is NOT inside stats.
         * It is at statsResponse.activities.
         * --------------------------------------------------------
         */

        const activities =
          Array.isArray(statsResponse?.activities)
            ? statsResponse.activities
            : [];

        setEventLogs(
          activities.map(
            (activity: any, index: number) => {
              const isWebhook =
                activity?.type === 'webhook';

              const activityStatus =
                activity?.status ||
                activity?.action ||
                activity?.event ||
                'info';

              let title = 'System Activity';
              let description =
                'System activity received.';

              let meta:
                | string
                | undefined;

              if (isWebhook) {
                title = `${activity?.event || 'Webhook'} ${
                  activity?.action || ''
                }`.trim();

                const repositoryName =
                  activity?.repository?.fullName ||
                  activity?.repository?.name ||
                  activity?.repository ||
                  'Unknown repository';

                description = `${repositoryName}${
                  activity?.pullRequestNumber
                    ? ` • PR #${activity.pullRequestNumber}`
                    : ''
                }`;

                meta = repositoryName;
              } else {
                title = 'AI Review';

                if (activity?.pullRequest) {
                  const repositoryName =
                    activity.pullRequest?.repository
                      ?.fullName ||
                    activity.pullRequest?.repository
                      ?.name ||
                    '';

                  const prNumber =
                    activity.pullRequest?.number ??
                    activity.pullRequest?.githubPrNumber ??
                    'N/A';

                  description = `${
                    repositoryName
                      ? `${repositoryName} • `
                      : ''
                  }PR #${prNumber}: ${
                    activity.pullRequest?.title ||
                    'Pull request review'
                  }`;

                  meta =
                    repositoryName || undefined;
                } else {
                  description =
                    'Pull request review';
                }
              }

              return {
                id: String(
                  activity?.reviewId ||
                    activity?._id ||
                    `${activity?.type}-${activity?.createdAt}-${index}`,
                ),

                type: getActivityType(
                  activityStatus,
                ),

                title,

                description,

                meta,

                time: formatDateTime(
                  activity?.createdAt,
                ),
              };
            },
          ),
        );
      } catch (err) {
        console.error(
          'Failed to load admin dashboard:',
          err,
        );

        if (!mounted) {
          return;
        }

        if (
          err instanceof Error &&
          err.message === 'UNAUTHORIZED'
        ) {
          setError(
            'Phiên đăng nhập admin đã hết hạn.',
          );
        } else {
          setError(
            'Không thể tải dữ liệu dashboard.',
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadDashboard();

    /*
     * Refresh dashboard every 15 seconds.
     */

    const interval = window.setInterval(() => {
      loadDashboard();
    }, 15000);

    return () => {
      mounted = false;
      window.clearInterval(interval);
    };
  }, []);

  /*
   * ============================================================
   * Logout
   * ============================================================
   */

  const handleLogout = async () => {
    try {
      await logoutAdmin();

      /*
       * Frontend owns the admin page now.
       * Do not redirect to /admin/login on backend.
       */

      window.location.href = '/';
    } catch (err) {
      console.error(
        'Logout failed:',
        err,
      );
    }
  };

  /*
   * ============================================================
   * Derived values
   * ============================================================
   */

  const completedRate =
    stats.reviews > 0
      ? (
          (stats.completed / stats.reviews) *
          100
        ).toFixed(1)
      : '0.0';

  const failedRate =
    stats.reviews > 0
      ? (
          (stats.failed / stats.reviews) *
          100
        ).toFixed(1)
      : '0.0';

  const filteredReviews =
    filterModel === 'ALL'
      ? reviews
      : reviews.filter(
          (review) =>
            review.model === filterModel,
        );

  /*
   * ============================================================
   * Render
   * ============================================================
   */

  return (
    <div className="min-h-screen bg-[#0a0e17] text-slate-100 flex flex-col font-sans selection:bg-blue-500/30">

      {/* ======================================================
          Top Navigation Bar
          ====================================================== */}

      <header className="h-16 border-b border-slate-800/80 bg-[#0d121d]/90 backdrop-blur px-6 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-6">

          {/* Logo */}

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 font-mono font-bold text-base shadow-sm">
              &lt;/&gt;
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-base tracking-tight">
                  PR Check AI Agent
                </span>

                <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  v1.0
                </span>
              </div>

              <span className="text-xs text-slate-400 font-medium block -mt-0.5">
                Admin Dashboard
              </span>
            </div>
          </div>

          {/* Navigation Tabs */}

          <nav className="hidden sm:flex items-center gap-1 bg-[#131926] p-1 rounded-lg border border-slate-800">
            <button
              onClick={() =>
                setActiveTab('dashboard')
              }
              className={`px-3.5 py-1.5 rounded-md text-xs font-medium transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              Dashboard
            </button>

            <button
              onClick={() =>
                setActiveTab('activity')
              }
              className={`px-3.5 py-1.5 rounded-md text-xs font-medium transition-all ${
                activeTab === 'activity'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              Activity Log
            </button>
          </nav>
        </div>

        {/* Right Status & Profile Controls */}

        <div className="flex items-center gap-5">
          <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />

            {loading
              ? 'Loading system status...'
              : error
                ? 'System status unavailable'
                : 'Operational • All systems normal'}
          </div>

          <div className="flex items-center gap-3 pl-2 border-l border-slate-800">
            <div className="text-right hidden sm:block">
              <span className="text-xs font-medium text-slate-200 block">
                Admin
              </span>

              <span className="text-[10px] font-mono text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded border border-blue-500/20 uppercase font-semibold">
                Admin
              </span>
            </div>

            <button
              title="Logout"
              onClick={handleLogout}
              className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors flex items-center gap-1 text-xs"
            >
              <LogOut className="w-4 h-4" />

              <span className="hidden md:inline">
                Logout
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* ======================================================
          Main Page Body
          ====================================================== */}

      <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto space-y-6">

        {/* Error */}

        {error && (
          <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-4 py-3 flex items-center gap-3 text-sm text-rose-400">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />

            <span>{error}</span>
          </div>
        )}

        {/* ====================================================
            Section 1: System Health
            ==================================================== */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

          {/* Server */}

          <div className="bg-[#111724] border border-slate-800/90 rounded-xl p-4 flex items-center justify-between hover:border-slate-700/80 transition-all">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Server
                </span>

                <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />

                  {getHealthStatus(
                    health?.server?.status,
                  )}
                </span>
              </div>

              <p className="text-xs font-mono text-slate-400">
                API Server
              </p>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-800/60 text-slate-400 border border-slate-700/50">
              <Server className="w-5 h-5 text-emerald-400" />
            </div>
          </div>

          {/* Database */}

          <div className="bg-[#111724] border border-slate-800/90 rounded-xl p-4 flex items-center justify-between hover:border-slate-700/80 transition-all">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Database
                </span>

                <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />

                  {getHealthStatus(
                    health?.database?.status,
                  )}
                </span>
              </div>

              <p className="text-xs font-mono text-slate-400">
                MongoDB
              </p>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-800/60 text-slate-400 border border-slate-700/50">
              <Database className="w-5 h-5 text-cyan-400" />
            </div>
          </div>

          {/* AI Engine */}

          <div className="bg-[#111724] border border-slate-800/90 rounded-xl p-4 flex items-center justify-between hover:border-slate-700/80 transition-all">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  AI Engine
                </span>

                <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />

                  {getHealthStatus(
                    health?.ai?.status,
                  )}
                </span>
              </div>

              <p className="text-xs font-mono text-slate-400">
                OpenRouter
              </p>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-800/60 text-slate-400 border border-slate-700/50">
              <Cpu className="w-5 h-5 text-blue-400" />
            </div>
          </div>

          {/* GitHub App */}

          <div className="bg-[#111724] border border-slate-800/90 rounded-xl p-4 flex items-center justify-between hover:border-slate-700/80 transition-all">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  GitHub App
                </span>

                <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />

                  {getHealthStatus(
                    health?.github?.status,
                  )}
                </span>
              </div>

              <p className="text-xs font-mono text-slate-400">
                Webhook Integration
              </p>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-800/60 text-slate-400 border border-slate-700/50">
              <Webhook className="w-5 h-5 text-purple-400" />
            </div>
          </div>
        </div>

        {/* ====================================================
            Dashboard Tab
            ==================================================== */}

        {activeTab === 'dashboard' && (
          <>
            {/* ==================================================
                Section 2: Top Statistics
                ================================================== */}

            <div className="space-y-3">

              {/* Row 1 */}

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

                {/* Repositories */}

                <div className="bg-[#111724] border border-slate-800/90 rounded-xl p-4 hover:border-slate-700 transition-all">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider">
                      Repositories
                    </span>

                    <FolderGit2 className="w-4 h-4 text-slate-500" />
                  </div>

                  <div className="text-2xl font-bold text-white tracking-tight">
                    {stats.repositories}

                    <span className="text-xs font-normal text-slate-400">
                      {' '}
                      monitored
                    </span>
                  </div>

                  <span className="text-xs text-slate-500 mt-1 block">
                    Active GitHub repos
                  </span>
                </div>

                {/* Pull Requests */}

                <div className="bg-[#111724] border border-slate-800/90 rounded-xl p-4 hover:border-slate-700 transition-all">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider">
                      Pull Requests
                    </span>

                    <GitPullRequest className="w-4 h-4 text-blue-400" />
                  </div>

                  <div className="text-2xl font-bold text-white tracking-tight">
                    {stats.pullRequests}

                    <span className="text-xs font-normal text-slate-400">
                      {' '}
                      tracked
                    </span>
                  </div>

                  <span className="text-xs text-slate-500 mt-1 block">
                    Across all repositories
                  </span>
                </div>

                {/* AI Reviews */}

                <div className="bg-[#111724] border border-slate-800/90 rounded-xl p-4 hover:border-slate-700 transition-all">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider">
                      AI Reviews
                    </span>

                    <Sparkles className="w-4 h-4 text-purple-400" />
                  </div>

                  <div className="text-2xl font-bold text-white tracking-tight">
                    {stats.reviews}
                  </div>

                  <span className="text-xs text-slate-500 mt-1 block">
                    Automated inspections run
                  </span>
                </div>

                {/* Webhooks */}

                <div className="bg-[#111724] border border-slate-800/90 rounded-xl p-4 hover:border-slate-700 transition-all">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider">
                      Webhooks
                    </span>

                    <Activity className="w-4 h-4 text-cyan-400" />
                  </div>

                  <div className="text-2xl font-bold text-white tracking-tight">
                    {stats.webhooks}
                  </div>

                  <span className="text-xs text-slate-500 mt-1 block">
                    Inbound events processed
                  </span>
                </div>
              </div>

              {/* Row 2 */}

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

                {/* Completed */}

                <div className="bg-[#111724] border-l-4 border-l-emerald-500 border border-slate-800/90 rounded-xl p-4">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-xs font-semibold uppercase text-slate-300">
                      Completed
                    </span>

                    <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                      {completedRate}% rate
                    </span>
                  </div>

                  <div className="text-2xl font-bold text-white tracking-tight">
                    {stats.completed}
                  </div>

                  <span className="text-xs text-slate-500 mt-1 block">
                    Successfully analyzed PRs
                  </span>
                </div>

                {/* Running */}

                <div className="bg-[#111724] border-l-4 border-l-amber-500 border border-slate-800/90 rounded-xl p-4">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-xs font-semibold uppercase text-slate-300">
                      Running
                    </span>

                    <span className="text-[11px] font-mono text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                      • Active
                    </span>
                  </div>

                  <div className="text-2xl font-bold text-white tracking-tight">
                    {stats.running}
                  </div>

                  <span className="text-xs text-slate-500 mt-1 block">
                    Currently in inference
                  </span>
                </div>

                {/* Queued */}

                <div className="bg-[#111724] border-l-4 border-l-blue-500 border border-slate-800/90 rounded-xl p-4">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-xs font-semibold uppercase text-slate-300">
                      Queued
                    </span>

                    <span className="text-[11px] font-mono text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded border border-blue-500/20">
                      Worker pool
                    </span>
                  </div>

                  <div className="text-2xl font-bold text-white tracking-tight">
                    {stats.queued}
                  </div>

                  <span className="text-xs text-slate-500 mt-1 block">
                    Awaiting analysis worker
                  </span>
                </div>

                {/* Failed */}

                <div className="bg-[#111724] border-l-4 border-l-rose-500 border border-slate-800/90 rounded-xl p-4">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-xs font-semibold uppercase text-slate-300">
                      Failed
                    </span>

                    <span className="text-[11px] font-mono text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/20">
                      {failedRate}% err
                    </span>
                  </div>

                  <div className="text-2xl font-bold text-white tracking-tight">
                    {stats.failed}
                  </div>

                  <span className="text-xs text-slate-500 mt-1 block">
                    Timeouts / API limits
                  </span>
                </div>
              </div>
            </div>

            {/* ==================================================
                Section 3: Two-Column Data Tables
                ================================================== */}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

              {/* Recent AI Reviews */}

              <div className="lg:col-span-8 bg-[#111724] border border-slate-800/90 rounded-xl overflow-hidden shadow-sm">
                <div className="p-4 md:px-5 border-b border-slate-800/80 flex items-center justify-between flex-wrap gap-2">

                  <div>
                    <h3 className="font-bold text-white text-sm md:text-base">
                      Recent AI Reviews
                    </h3>

                    <p className="text-xs text-slate-400 mt-0.5">
                      Real-time status of pull request evaluations
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={filterModel}
                      onChange={(event) =>
                        setFilterModel(
                          event.target.value,
                        )
                      }
                      className="px-2.5 py-1 text-xs font-medium text-slate-300 bg-slate-800/80 hover:bg-slate-700/80 rounded-md border border-slate-700 outline-none"
                    >
                      <option value="ALL">
                        All models
                      </option>

                      {Array.from(
                        new Set(
                          reviews
                            .map(
                              (review) =>
                                review.model,
                            )
                            .filter(Boolean),
                        ),
                      ).map((model) => (
                        <option
                          key={model}
                          value={model}
                        >
                          {model}
                        </option>
                      ))}
                    </select>

                    <button
                      className="px-2.5 py-1 text-xs font-medium text-slate-300 bg-slate-800/80 hover:bg-slate-700/80 rounded-md border border-slate-700 flex items-center gap-1.5"
                      onClick={() =>
                        setFilterModel('ALL')
                      }
                    >
                      <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />

                      Filter
                    </button>

                    <button
                      onClick={() =>
                        setActiveTab(
                          'activity',
                        )
                      }
                      className="text-xs text-blue-400 hover:text-blue-300 font-medium px-2 py-1"
                    >
                      View all →
                    </button>
                  </div>
                </div>

                {/* Table */}

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-slate-800/80 bg-[#0d121d] text-[11px] font-mono uppercase tracking-wider text-slate-400">
                        <th className="py-3 px-4">
                          Repository
                        </th>

                        <th className="py-3 px-4">
                          Pull Request
                        </th>

                        <th className="py-3 px-4">
                          Status
                        </th>

                        <th className="py-3 px-4">
                          Model
                        </th>

                        <th className="py-3 px-4 text-right">
                          Completed
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-800/50">
                      {filteredReviews.length === 0 ? (
                        <tr>
                          <td
                            colSpan={5}
                            className="py-10 text-center text-slate-500"
                          >
                            {loading
                              ? 'Loading reviews...'
                              : 'No reviews found.'}
                          </td>
                        </tr>
                      ) : (
                        filteredReviews.map(
                          (review) => (
                            <tr
                              key={review.id}
                              className="hover:bg-slate-800/30 transition-colors"
                            >
                              <td className="py-3 px-4 font-mono font-medium text-slate-300">
                                {review.repo}
                              </td>

                              <td className="py-3 px-4">
                                <div className="font-semibold text-slate-200">
                                  {review.prNumber}
                                </div>

                                <div className="text-[11px] text-slate-400 truncate max-w-[180px]">
                                  {review.prTitle}
                                </div>
                              </td>

                              <td className="py-3 px-4">
                                {review.status ===
                                  'Completed' && (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                    Completed
                                  </span>
                                )}

                                {review.status ===
                                  'Running' && (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-amber-500/10 text-amber-400 border border-amber-500/30">
                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                                    Running
                                  </span>
                                )}

                                {review.status ===
                                  'Failed' && (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-rose-500/10 text-rose-400 border border-rose-500/30">
                                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                                    Failed
                                  </span>
                                )}
                              </td>

                              <td className="py-3 px-4 font-mono text-slate-300">
                                {review.model}
                              </td>

                              <td className="py-3 px-4 text-right font-mono text-slate-400">
                                {review.completedTime}
                              </td>
                            </tr>
                          ),
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Recent Webhooks */}

              <div className="lg:col-span-4 bg-[#111724] border border-slate-800/90 rounded-xl overflow-hidden shadow-sm flex flex-col justify-between">
                <div>
                  <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-400" />

                      <h3 className="font-bold text-white text-sm">
                        Recent Webhooks
                      </h3>
                    </div>

                    <span className="text-[11px] font-mono text-slate-500">
                      GitHub
                    </span>
                  </div>

                  {/* Webhooks Feed List */}

                  <div className="divide-y divide-slate-800/50 text-xs">
                    {webhooks.length === 0 ? (
                      <div className="p-8 text-center text-slate-500">
                        {loading
                          ? 'Loading webhooks...'
                          : 'No webhooks found.'}
                      </div>
                    ) : (
                      webhooks.map(
                        (webhook) => (
                          <div
                            key={webhook.id}
                            className="p-3.5 hover:bg-slate-800/30 transition-colors flex items-center justify-between"
                          >
                            <div className="space-y-1">
                              <div className="flex items-center gap-1.5">
                                <span className="font-mono font-semibold text-slate-200">
                                  {webhook.event}
                                </span>

                                <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-1.5 py-0.2 rounded border border-slate-700">
                                  {webhook.action}
                                </span>
                              </div>

                              <span className="text-[11px] font-mono text-slate-400 block">
                                {webhook.repo}
                              </span>
                            </div>

                            <div className="text-right space-y-1">
                              <span
                                className={`text-[10px] uppercase font-mono font-semibold px-2 py-0.5 rounded ${
                                  webhook.status ===
                                  'received'
                                    ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
                                    : webhook.status ===
                                        'processing'
                                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                                      : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                                }`}
                              >
                                {webhook.status}
                              </span>

                              <span className="text-[11px] font-mono text-slate-500 block">
                                {webhook.timestamp}
                              </span>
                            </div>
                          </div>
                        ),
                      )
                    )}
                  </div>
                </div>

                <div className="p-3 border-t border-slate-800/80 bg-[#0d121d]/50 text-center">
                  <button className="text-xs text-slate-400 hover:text-white transition-colors">
                    View webhook delivery stream →
                  </button>
                </div>
              </div>
            </div>

            {/* ==================================================
                Section 4: Live Agent Event Stream
                ================================================== */}

            <div className="bg-[#111724] border border-slate-800/90 rounded-xl p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />

                  <h3 className="font-bold text-white text-sm">
                    Live Agent Event Stream
                  </h3>
                </div>

                <span className="text-xs text-slate-400 font-mono">
                  Showing last {eventLogs.length}{' '}
                  events
                </span>
              </div>

              <div className="space-y-3">
                {eventLogs.length === 0 ? (
                  <div className="py-6 text-center text-xs text-slate-500 font-mono">
                    {loading
                      ? 'Loading activity...'
                      : 'No recent activity.'}
                  </div>
                ) : (
                  eventLogs
                    .slice(0, 5)
                    .map((log) => (
                      <div
                        key={log.id}
                        className="flex items-start justify-between gap-4 text-xs font-mono"
                      >
                        <div className="flex items-start gap-2.5">
                          <span
                            className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                              log.type ===
                              'error'
                                ? 'bg-rose-400'
                                : log.type ===
                                    'active'
                                  ? 'bg-amber-400'
                                  : log.type ===
                                      'success'
                                    ? 'bg-emerald-400'
                                    : log.type ===
                                        'warn'
                                      ? 'bg-yellow-400'
                                      : 'bg-blue-400'
                            }`}
                          />

                          <div>
                            <p className="text-slate-200 font-sans font-medium">
                              {log.title}
                            </p>

                            <p className="text-[11px] text-slate-400 mt-0.5">
                              {log.description}
                            </p>
                          </div>
                        </div>

                        <span className="text-slate-500 text-[11px] flex-shrink-0">
                          {log.time}
                        </span>
                      </div>
                    ))
                )}
              </div>
            </div>
          </>
        )}

        {/* ======================================================
            Activity Tab
            ====================================================== */}

        {activeTab === 'activity' && (
          <div className="bg-[#111724] border border-slate-800/90 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 mb-4">
              <div>
                <h3 className="font-bold text-white">
                  Activity Log
                </h3>

                <p className="text-xs text-slate-400 mt-1">
                  Recent webhook and AI review activity
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
                <Activity className="w-4 h-4" />

                {eventLogs.length} events
              </div>
            </div>

            <div className="space-y-4">
              {eventLogs.length === 0 ? (
                <div className="py-10 text-center text-sm text-slate-500">
                  {loading
                    ? 'Loading activity...'
                    : 'No activity found.'}
                </div>
              ) : (
                eventLogs.map((log) => (
                  <div
                    key={log.id}
                    className="flex items-start justify-between gap-4 rounded-lg border border-slate-800/70 bg-[#0d121d]/50 p-4"
                  >
                    <div className="flex items-start gap-3">
                      <span
                        className={`w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0 ${
                          log.type ===
                          'error'
                            ? 'bg-rose-400'
                            : log.type ===
                                'active'
                              ? 'bg-amber-400'
                              : log.type ===
                                  'success'
                                ? 'bg-emerald-400'
                                : log.type ===
                                    'warn'
                                  ? 'bg-yellow-400'
                                  : 'bg-blue-400'
                        }`}
                      />

                      <div>
                        <p className="text-sm font-medium text-slate-200">
                          {log.title}
                        </p>

                        <p className="text-xs text-slate-400 mt-1">
                          {log.description}
                        </p>

                        {log.meta && (
                          <p className="text-[11px] text-slate-500 font-mono mt-1">
                            {log.meta}
                          </p>
                        )}
                      </div>
                    </div>

                    <span className="text-[11px] text-slate-500 font-mono whitespace-nowrap">
                      {log.time}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </main>

      {/* ======================================================
          Admin Footer Console
          ====================================================== */}

      <footer className="h-10 border-t border-slate-800/80 bg-[#0d121d] px-6 flex items-center justify-between text-[11px] text-slate-400 font-mono">
        <div>
          PR Check AI Agent • Developer Admin Console
        </div>

        <div className="flex items-center gap-4">
          <span>
            Reviews: {stats.running} running
          </span>

          <span>
            API:{' '}
            {error
              ? 'Unavailable'
              : 'Connected'}
          </span>

          <span className="text-slate-500">
            v2.4
          </span>
        </div>
      </footer>
    </div>
  );
};