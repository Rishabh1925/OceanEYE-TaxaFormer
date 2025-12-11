/**
 * Queue Status Component
 * Shows queue position and estimated wait time
 */

import { useState, useEffect } from 'react';
import { Clock, Users, Loader2, CheckCircle2, AlertCircle, Zap } from 'lucide-react';

interface QueueStatusProps {
  isDarkMode: boolean;
  sessionId: string;
  onStatusChange?: (status: string) => void;
}

interface QueueData {
  status: string;
  job_id?: string;
  filename?: string;
  position?: number;
  queue_length?: number;
  estimated_wait?: number;
  estimated_remaining?: number;
  progress?: number;
  message?: string;
}

export default function QueueStatus({ isDarkMode, sessionId, onStatusChange }: QueueStatusProps) {
  const [queueData, setQueueData] = useState<QueueData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkQueueStatus();
    const interval = setInterval(checkQueueStatus, 2000); // Check every 2 seconds
    return () => clearInterval(interval);
  }, [sessionId]);

  useEffect(() => {
    if (queueData && onStatusChange) {
      onStatusChange(queueData.status);
    }
  }, [queueData, onStatusChange]);

  const checkQueueStatus = async () => {
    try {
      const response = await fetch(`/api/queue/status?session_id=${sessionId}`);
      if (response.ok) {
        const data = await response.json();
        setQueueData(data);
        setError(null);
      } else {
        setError('Failed to check queue status');
      }
    } catch (err) {
      setError('Queue service unavailable');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number): string => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  if (loading) {
    return (
      <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-800/50' : 'bg-white/50'} backdrop-blur-md`}>
        <div className="flex items-center gap-3">
          <Loader2 className={`w-5 h-5 animate-spin ${isDarkMode ? 'text-cyan-400' : 'text-blue-600'}`} />
          <span className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
            Checking queue status...
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-red-900/20' : 'bg-red-100/50'} backdrop-blur-md`}>
        <div className="flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <span className={`text-sm ${isDarkMode ? 'text-red-400' : 'text-red-700'}`}>
            {error}
          </span>
        </div>
      </div>
    );
  }

  if (!queueData || queueData.status === 'no_job') {
    return null; // No queue status to show
  }

  if (queueData.status === 'disabled') {
    return null; // Queue system disabled
  }

  // Processing status
  if (queueData.status === 'processing') {
    return (
      <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-blue-900/20' : 'bg-blue-100/50'} backdrop-blur-md border ${isDarkMode ? 'border-blue-700/50' : 'border-blue-200'}`}>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Zap className={`w-6 h-6 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
              <div className="absolute inset-0 animate-ping">
                <Zap className={`w-6 h-6 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'} opacity-20`} />
              </div>
            </div>
            <div>
              <h3 className={`font-semibold ${isDarkMode ? 'text-blue-300' : 'text-blue-800'}`}>
                Processing Your File
              </h3>
              <p className={`text-sm ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                {queueData.filename}
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className={isDarkMode ? 'text-blue-300' : 'text-blue-700'}>
                Progress
              </span>
              <span className={`font-mono ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                {queueData.progress || 0}%
              </span>
            </div>
            <div className={`h-2 rounded-full overflow-hidden ${isDarkMode ? 'bg-slate-700' : 'bg-slate-200'}`}>
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-500"
                style={{ width: `${queueData.progress || 0}%` }}
              />
            </div>
          </div>

          {queueData.estimated_remaining && queueData.estimated_remaining > 0 && (
            <div className="flex items-center gap-2 text-sm">
              <Clock className={`w-4 h-4 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
              <span className={isDarkMode ? 'text-blue-300' : 'text-blue-700'}>
                Estimated remaining: {formatTime(queueData.estimated_remaining)}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Queued status
  if (queueData.status === 'queued') {
    return (
      <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-orange-900/20' : 'bg-orange-100/50'} backdrop-blur-md border ${isDarkMode ? 'border-orange-700/50' : 'border-orange-200'}`}>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Users className={`w-6 h-6 ${isDarkMode ? 'text-orange-400' : 'text-orange-600'}`} />
            <div>
              <h3 className={`font-semibold ${isDarkMode ? 'text-orange-300' : 'text-orange-800'}`}>
                In Queue
              </h3>
              <p className={`text-sm ${isDarkMode ? 'text-orange-400' : 'text-orange-600'}`}>
                {queueData.filename}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-orange-800/30' : 'bg-orange-200/50'}`}>
              <div className={`font-semibold ${isDarkMode ? 'text-orange-300' : 'text-orange-800'}`}>
                Position
              </div>
              <div className={`text-lg font-bold ${isDarkMode ? 'text-orange-400' : 'text-orange-600'}`}>
                #{queueData.position}
              </div>
            </div>
            <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-orange-800/30' : 'bg-orange-200/50'}`}>
              <div className={`font-semibold ${isDarkMode ? 'text-orange-300' : 'text-orange-800'}`}>
                Queue Length
              </div>
              <div className={`text-lg font-bold ${isDarkMode ? 'text-orange-400' : 'text-orange-600'}`}>
                {queueData.queue_length}
              </div>
            </div>
          </div>

          {queueData.estimated_wait && queueData.estimated_wait > 0 && (
            <div className="flex items-center gap-2 text-sm">
              <Clock className={`w-4 h-4 ${isDarkMode ? 'text-orange-400' : 'text-orange-600'}`} />
              <span className={isDarkMode ? 'text-orange-300' : 'text-orange-700'}>
                Estimated wait: {formatTime(queueData.estimated_wait)}
              </span>
            </div>
          )}

          <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-slate-800/50' : 'bg-white/50'}`}>
            <p className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
              {queueData.message || "Your file is in the processing queue. Please wait..."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Completed status
  if (queueData.status === 'completed') {
    return (
      <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-green-900/20' : 'bg-green-100/50'} backdrop-blur-md border ${isDarkMode ? 'border-green-700/50' : 'border-green-200'}`}>
        <div className="flex items-center gap-3">
          <CheckCircle2 className={`w-5 h-5 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />
          <div>
            <span className={`font-semibold ${isDarkMode ? 'text-green-300' : 'text-green-800'}`}>
              Analysis Complete
            </span>
            <p className={`text-sm ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
              {queueData.filename}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Failed status
  if (queueData.status === 'failed') {
    return (
      <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-red-900/20' : 'bg-red-100/50'} backdrop-blur-md border ${isDarkMode ? 'border-red-700/50' : 'border-red-200'}`}>
        <div className="flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <div>
            <span className={`font-semibold ${isDarkMode ? 'text-red-300' : 'text-red-800'}`}>
              Analysis Failed
            </span>
            <p className={`text-sm ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}>
              Please try uploading your file again
            </p>
          </div>
        </div>
      </div>
    );
  }

  return null;
}