import React, { useState, useEffect } from 'react';
import { GlassCard } from '../components/GlassCard';
import { storage, LogEntry, getEnvVar, subscribeToData, subscribeToSync, SyncStatus } from '../utils/storage';
import { Trash2, Shield, Activity, List, RefreshCw } from 'lucide-react';

export const Admin: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'logs' | 'leaderboard'>('logs');
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [error, setError] = useState('');
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('idle');

  // Password from Env (supports ADMIN_PASSWORD, VITE_ADMIN_PASSWORD, etc.) or fallback
  const ADMIN_PASS = getEnvVar('ADMIN_PASSWORD', "Jaat4Raj");

  const handleLogin = () => {
    if (password === ADMIN_PASS) {
        setIsAuthenticated(true);
        loadData();
    } else {
        setError("Invalid password");
    }
  };

  const loadData = () => {
    setLogs(storage.getLogs());
  };
  
  const handleRefresh = () => {
    storage.triggerSync();
  };

  const handleResetLeaderboard = () => {
    if (confirm("Are you sure you want to reset all high scores?")) {
        storage.resetLeaderboard();
        alert("Leaderboard reset.");
    }
  };

  const handleClearLogs = () => {
    if (confirm("Are you sure you want to clear all system logs?")) {
        storage.clearLogs();
        alert("Logs cleared.");
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
        // Initial load
        loadData();
        
        // Subscribe to data changes
        const unsubData = subscribeToData(() => {
            loadData();
        });

        // Subscribe to sync status
        const unsubSync = subscribeToSync((status) => {
            setSyncStatus(status);
        });

        return () => {
            unsubData();
            unsubSync();
        };
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
        <div className="flex items-center justify-center min-h-[50vh]">
            <GlassCard className="max-w-md w-full text-center py-10">
                <Shield size={40} className="mx-auto text-red-400 mb-4" />
                <h2 className="text-2xl font-light mb-6">Admin Access</h2>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(''); }}
                    onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                    placeholder="Enter Password"
                    className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-center text-white mb-4 focus:border-red-500/50 outline-none"
                    autoFocus
                />
                {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
                <button
                    onClick={handleLogin}
                    className="w-full py-3 rounded-xl bg-red-900/40 border border-red-500/30 hover:bg-red-800/40 text-red-200 transition-all"
                >
                    Login
                </button>
            </GlassCard>
        </div>
    );
  }

  return (
    <div className="space-y-6 pt-4 pb-24 sm:pt-0">
      <header className="flex justify-between items-center">
        <h1 className="text-3xl font-thin">Admin Dashboard</h1>
        <div className="flex gap-4 items-center">
            <button 
                onClick={handleRefresh} 
                className={`p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all ${syncStatus === 'syncing' ? 'animate-spin text-blue-300' : ''}`}
                title="Force Refresh Data"
            >
                <RefreshCw size={18} />
            </button>
            <button onClick={() => setIsAuthenticated(false)} className="text-sm text-gray-400 hover:text-white">Logout</button>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-white/10 pb-4">
        <button 
            onClick={() => setActiveTab('logs')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${activeTab === 'logs' ? 'bg-white/10 text-white' : 'text-gray-500'}`}
        >
            <Activity size={16} /> User Logs
        </button>
        <button 
             onClick={() => setActiveTab('leaderboard')}
             className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${activeTab === 'leaderboard' ? 'bg-white/10 text-white' : 'text-gray-500'}`}
        >
            <List size={16} /> Leaderboard Management
        </button>
      </div>

      {activeTab === 'logs' && (
        <GlassCard className="p-0 overflow-hidden relative">
            <div className="flex justify-between items-center p-4 bg-white/5 border-b border-white/10">
                <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">System Logs</h3>
                 <button 
                    onClick={handleClearLogs}
                    className="flex items-center gap-2 px-3 py-1.5 bg-red-500/10 text-red-300 border border-red-500/20 rounded-lg hover:bg-red-500/20 transition-all text-xs"
                >
                    <Trash2 size={14} /> Clear Logs
                </button>
            </div>
            <div className="max-h-[600px] overflow-y-auto">
                <table className="w-full text-left text-sm">
                    <thead className="sticky top-0 bg-[#0f172a] text-gray-400 uppercase text-xs z-10 shadow-lg">
                        <tr>
                            <th className="p-4 bg-[#0f172a]">Time</th>
                            <th className="p-4 bg-[#0f172a]">User</th>
                            <th className="p-4 bg-[#0f172a]">Action</th>
                            <th className="p-4 bg-[#0f172a]">Details</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 font-mono">
                        {logs.length === 0 ? (
                            <tr><td colSpan={4} className="p-8 text-center text-gray-500">No logs found</td></tr>
                        ) : (
                            logs.map((log) => (
                                <tr key={log.id} className="hover:bg-white/5">
                                    <td className="p-4 text-gray-500">{new Date(log.timestamp).toLocaleTimeString()}</td>
                                    <td className="p-4 text-blue-300">{log.username}</td>
                                    <td className="p-4 text-white">{log.action}</td>
                                    <td className="p-4 text-gray-400 break-all">{log.details || '-'}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </GlassCard>
      )}

      {activeTab === 'leaderboard' && (
        <GlassCard>
            <div className="text-center py-8">
                <h3 className="text-xl font-light mb-4">Dangerous Zone</h3>
                <p className="text-gray-400 mb-6">Resetting the leaderboard will remove all high scores permanently. This action cannot be undone.</p>
                <button 
                    onClick={handleResetLeaderboard}
                    className="flex items-center gap-2 px-6 py-3 bg-red-500/20 text-red-300 border border-red-500/30 rounded-xl hover:bg-red-500/30 transition-all mx-auto"
                >
                    <Trash2 size={18} /> Reset Leaderboard
                </button>
            </div>
        </GlassCard>
      )}
    </div>
  );
};
