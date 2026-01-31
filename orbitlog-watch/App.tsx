
import React, { useState, useEffect } from 'react';
import { LogEntry, ViewState, AppConfig } from './types';
import { fetchLogsFromBin } from './services/api';
import { STORAGE_KEY, MOCK_LOGS } from './constants';
import { LogCard } from './components/LogCard';
import { ConfigView } from './components/ConfigView';
import { Sun, Moon, RefreshCw, Loader2 } from 'lucide-react';

const DEFAULT_BIN_ID = '696ed48cae596e708fe7ac88';
const DEFAULT_API_KEY = '$2a$10$KRFqSUpTdnHAQJcf95SxGOdqUVRAAuncIN3lLgfQtHbG9tQnKoyhW';
const THEME_KEY = 'orbitlog_theme';

export default function App() {
  const [view, setView] = useState<ViewState>('CONFIG');
  const [config, setConfig] = useState<AppConfig>({ 
    binId: DEFAULT_BIN_ID, 
    apiKey: DEFAULT_API_KEY,
    username: 'Admin'
  });
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [time, setTime] = useState(new Date());
  
  // Theme state: default to 'dark'
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  // Clock effect
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Initialize theme from local storage
  useEffect(() => {
    const savedTheme = localStorage.getItem(THEME_KEY) as 'dark' | 'light' | null;
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem(THEME_KEY, newTheme);
  };

  // Load logs function
  const loadLogs = async (binId: string, apiKey?: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchLogsFromBin(binId, apiKey);
      setLogs(data);
      setView('LIST');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to load');
    } finally {
      setLoading(false);
    }
  };

  // Load config from local storage on mount
  useEffect(() => {
    const savedConfig = localStorage.getItem(STORAGE_KEY);
    if (savedConfig) {
      const parsed = JSON.parse(savedConfig);
      setConfig(parsed);
      if (parsed.binId) {
        loadLogs(parsed.binId, parsed.apiKey);
      }
    } else {
      loadLogs(DEFAULT_BIN_ID, DEFAULT_API_KEY);
    }
  }, []);

  const handleSaveConfig = (newConfig: AppConfig) => {
    setConfig(newConfig);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newConfig));
    loadLogs(newConfig.binId, newConfig.apiKey);
  };

  const handleUseMock = () => {
    setLogs(MOCK_LOGS);
    setView('LIST');
  };

  const handleRefresh = () => {
    if (config.binId) {
      loadLogs(config.binId, config.apiKey);
    } else {
      setLoading(true);
      setTimeout(() => setLoading(false), 500);
    }
  };

  return (
    <div className={`
      w-full h-full rounded-full overflow-hidden relative shadow-[0_0_50px_rgba(0,0,0,0.5)] border-[6px] box-border
      font-sans antialiased selection:bg-watch-accent selection:text-white transition-colors duration-300
      ${theme === 'dark' ? 'dark-theme border-[#222]' : 'border-gray-300'}
      bg-watch-bg text-watch-text
    `}>

      {/* Background radial gradient */}
      <div className={`absolute inset-0 pointer-events-none ${theme === 'dark' ? 'bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-900 via-black to-black' : 'bg-gray-100'}`} />

      {/* Main Content Area */}
      {view === 'CONFIG' ? (
        <ConfigView initialConfig={config} onSave={handleSaveConfig} onUseMock={handleUseMock} />
      ) : (
        <div className="w-full h-full relative">
          
          {/* Header Section (Time, Actions) - Fixed at top with transparency */}
          <div className={`absolute top-0 left-0 right-0 z-20 flex flex-col items-center pt-8 pb-4 transition-colors duration-300 ${theme === 'dark' ? 'bg-gradient-to-b from-black via-black/90 to-transparent' : 'bg-gradient-to-b from-white via-white/90 to-transparent'}`}>
            
            {/* Time */}
            <div className="text-3xl font-bold tracking-tight leading-none mb-4 font-mono text-watch-text cursor-default select-none">
              {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
            </div>

             {/* Action Buttons */}
             <div className="flex justify-center gap-5 pointer-events-auto">
               <button 
                  onClick={toggleTheme}
                  className="p-3 rounded-full bg-watch-surface/80 backdrop-blur-md text-watch-muted hover:text-watch-text hover:bg-watch-surface transition-all active:scale-90 shadow-md"
                  title="Toggle Theme"
               >
                 {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
               </button>
               <button 
                  onClick={handleRefresh}
                  className="p-3 rounded-full bg-watch-surface/80 backdrop-blur-md text-watch-muted hover:text-watch-text hover:bg-watch-surface transition-all active:scale-90 shadow-md"
                  title="Refresh Logs"
               >
                  <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
               </button>
            </div>
          </div>

          {/* Log List */}
          <div className="h-full overflow-y-auto no-scrollbar scroll-smooth snap-y snap-mandatory pt-36 pb-24 px-8">
            
            {loading ? (
              <div className="flex flex-col items-center justify-center h-24 space-y-2 mt-4">
                <Loader2 className="animate-spin text-watch-accent w-8 h-8" />
                <span className="text-xs text-watch-muted font-medium">Syncing...</span>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center h-32 mt-4 text-center px-4">
                 <span className="text-watch-danger mb-1 font-bold text-sm">Error</span>
                 <p className="text-[10px] text-watch-muted leading-snug max-w-[150px] mx-auto">{error}</p>
                 <button onClick={() => setView('CONFIG')} className="mt-4 text-[11px] text-watch-accent font-bold underline px-4 py-2 bg-watch-surface rounded-full">
                   Settings
                 </button>
              </div>
            ) : logs.length === 0 ? (
               <div className="text-center text-watch-muted mt-12 text-sm">No logs found.</div>
            ) : (
              <div className="flex flex-col gap-3 items-center w-full mx-auto">
                {logs.map((log) => (
                  <LogCard key={log.id} log={log} />
                ))}
                
                {/* Large bottom spacer to allow the last log to scroll past the curved bottom edge */}
                <div className="h-40 w-full shrink-0" />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
