/**
 * Simple Analytics Dashboard for TaxaFormer
 * Shows basic usage statistics
 */

import { useState, useEffect } from 'react';
import { BarChart3, Users, Eye, MousePointer, TrendingUp, Calendar } from 'lucide-react';

interface AnalyticsStats {
  sessions_today: number;
  page_views_today: number;
  popular_pages: [string, number][];
}

interface AnalyticsDashboardProps {
  isDarkMode: boolean;
}

export default function AnalyticsDashboard({ isDarkMode }: AnalyticsDashboardProps) {
  const [stats, setStats] = useState<AnalyticsStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAnalyticsStats();
  }, []);

  const fetchAnalyticsStats = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/analytics/stats');
      
      if (response.ok) {
        const data = await response.json();
        if (data.status === 'success') {
          setStats(data.stats);
        } else if (data.status === 'disabled') {
          setError('Analytics is disabled');
        } else {
          setError('Failed to load analytics data');
        }
      } else {
        setError('Analytics service unavailable');
      }
    } catch (err) {
      setError('Failed to connect to analytics service');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-slate-800/50' : 'bg-white/50'} backdrop-blur-md`}>
        <div className="flex items-center gap-3 mb-4">
          <BarChart3 className={`w-6 h-6 ${isDarkMode ? 'text-cyan-400' : 'text-blue-600'}`} />
          <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            Analytics Dashboard
          </h3>
        </div>
        <div className="animate-pulse space-y-3">
          <div className={`h-4 rounded ${isDarkMode ? 'bg-slate-700' : 'bg-slate-200'}`}></div>
          <div className={`h-4 rounded w-3/4 ${isDarkMode ? 'bg-slate-700' : 'bg-slate-200'}`}></div>
          <div className={`h-4 rounded w-1/2 ${isDarkMode ? 'bg-slate-700' : 'bg-slate-200'}`}></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-slate-800/50' : 'bg-white/50'} backdrop-blur-md`}>
        <div className="flex items-center gap-3 mb-4">
          <BarChart3 className={`w-6 h-6 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`} />
          <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            Analytics Dashboard
          </h3>
        </div>
        <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
          {error}
        </p>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-slate-800/50' : 'bg-white/50'} backdrop-blur-md`}>
      <div className="flex items-center gap-3 mb-6">
        <BarChart3 className={`w-6 h-6 ${isDarkMode ? 'text-cyan-400' : 'text-blue-600'}`} />
        <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
          Analytics Dashboard
        </h3>
        <div className="flex items-center gap-1 text-xs text-green-500">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          Live
        </div>
      </div>

      {/* Today's Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-700/50' : 'bg-slate-100/50'}`}>
          <div className="flex items-center gap-3">
            <Users className={`w-5 h-5 ${isDarkMode ? 'text-cyan-400' : 'text-blue-600'}`} />
            <div>
              <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                Sessions Today
              </p>
              <p className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                {stats.sessions_today}
              </p>
            </div>
          </div>
        </div>

        <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-700/50' : 'bg-slate-100/50'}`}>
          <div className="flex items-center gap-3">
            <Eye className={`w-5 h-5 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
            <div>
              <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                Page Views Today
              </p>
              <p className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                {stats.page_views_today}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Popular Pages */}
      {stats.popular_pages.length > 0 && (
        <div>
          <h4 className={`text-sm font-semibold mb-3 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
            Popular Pages Today
          </h4>
          <div className="space-y-2">
            {stats.popular_pages.slice(0, 5).map(([page, views], index) => (
              <div
                key={page}
                className={`flex items-center justify-between p-2 rounded ${
                  isDarkMode ? 'bg-slate-700/30' : 'bg-slate-100/30'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-mono px-2 py-1 rounded ${
                    isDarkMode ? 'bg-slate-600 text-slate-300' : 'bg-slate-200 text-slate-700'
                  }`}>
                    #{index + 1}
                  </span>
                  <span className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                    {page === '/' ? '/home' : page}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <MousePointer className="w-3 h-3 text-slate-500" />
                  <span className={`text-sm font-medium ${isDarkMode ? 'text-cyan-400' : 'text-blue-600'}`}>
                    {views}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Refresh Button */}
      <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
        <button
          onClick={fetchAnalyticsStats}
          className={`flex items-center gap-2 text-xs px-3 py-1 rounded transition-colors ${
            isDarkMode
              ? 'text-slate-400 hover:text-cyan-400 hover:bg-slate-700/50'
              : 'text-slate-600 hover:text-blue-600 hover:bg-slate-100'
          }`}
        >
          <TrendingUp className="w-3 h-3" />
          Refresh Stats
        </button>
      </div>
    </div>
  );
}