import React, { useState } from 'react';
import { AppConfig } from '../types';
import { Save, Play } from 'lucide-react';

interface ConfigViewProps {
  initialConfig: AppConfig;
  onSave: (config: AppConfig) => void;
  onUseMock: () => void;
}

export const ConfigView: React.FC<ConfigViewProps> = ({ initialConfig, onSave, onUseMock }) => {
  const [binId, setBinId] = useState(initialConfig.binId);
  const [apiKey, setApiKey] = useState(initialConfig.apiKey || '');
  const [username, setUsername] = useState(initialConfig.username || 'Admin');

  const handleSave = () => {
    if (binId.trim()) {
      onSave({ 
        binId: binId.trim(), 
        apiKey: apiKey.trim(),
        username: username.trim() || 'Admin'
      });
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center pt-12 pb-12 px-8 overflow-y-auto no-scrollbar space-y-3 bg-watch-bg text-watch-text">
      <div className="text-center space-y-1">
        <h2 className="text-xl font-bold text-watch-text">Setup</h2>
        <p className="text-xs text-watch-muted">Configure your watch view</p>
      </div>

      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username (e.g. Admin)"
        className="w-full bg-watch-surface border border-watch-border rounded-lg px-3 py-2 text-center text-sm focus:border-watch-accent outline-none text-watch-text placeholder-watch-muted transition-colors"
      />

      <input
        type="text"
        value={binId}
        onChange={(e) => setBinId(e.target.value)}
        placeholder="Bin ID (e.g. 64f2...)"
        className="w-full bg-watch-surface border border-watch-border rounded-lg px-3 py-2 text-center text-sm focus:border-watch-accent outline-none text-watch-text placeholder-watch-muted transition-colors"
      />

      <input
        type="password"
        value={apiKey}
        onChange={(e) => setApiKey(e.target.value)}
        placeholder="API Key (Optional)"
        className="w-full bg-watch-surface border border-watch-border rounded-lg px-3 py-2 text-center text-sm focus:border-watch-accent outline-none text-watch-text placeholder-watch-muted transition-colors"
      />

      <div className="flex flex-col gap-2 w-full pt-2">
        <button
          onClick={handleSave}
          disabled={!binId}
          className="w-full bg-watch-accent disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold py-3 rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-transform"
        >
          <Save size={18} />
          <span>Save & Load</span>
        </button>

        <button
          onClick={onUseMock}
          className="w-full bg-watch-surface border border-watch-border text-watch-muted font-medium py-3 rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-transform hover:text-watch-text"
        >
          <Play size={18} />
          <span>Demo Mode</span>
        </button>
      </div>
      
      {/* Spacer for bottom scroll */}
      <div className="h-10 shrink-0" />
    </div>
  );
};