import React, { useEffect, useState } from 'react';
import { Navigation } from './Navigation';
import { useLocation, useNavigate } from 'react-router-dom';
import { getCookie, setCookie, storage, subscribeToSync, SyncStatus } from '../utils/storage';
import { Lock, User, Cloud, CloudOff, RefreshCw, CheckCircle2 } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [showNameModal, setShowNameModal] = useState(false);
  const [username, setUsername] = useState('');
  const [tempName, setTempName] = useState('');
  
  // Sync State
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('idle');
  
  const location = useLocation();
  const navigate = useNavigate();

  // Initialize User
  useEffect(() => {
    const existingUser = getCookie('mns_username');
    if (existingUser) {
        setUsername(existingUser);
    } else {
        setShowNameModal(true);
    }
    
    // Initial Sync
    storage.triggerSync();
  }, []);

  // Subscribe to Sync Status
  useEffect(() => {
    const unsubscribe = subscribeToSync((status) => {
        setSyncStatus(status);
    });
    return unsubscribe;
  }, []);

  // Logger
  useEffect(() => {
    if (username && location.pathname) {
        let action = 'Visited Page';
        let details = location.pathname;

        if (location.pathname === '/') action = 'Started Session';
        if (location.pathname === '/quiz') action = 'Started Quiz';

        storage.addLog(username, action, details);
    }
  }, [location.pathname, username]);

  const handleSaveName = () => {
    if (!tempName.trim()) return;
    setCookie('mns_username', tempName.trim());
    setCookie('mns_streak', '0');
    setUsername(tempName.trim());
    setShowNameModal(false);
    storage.addLog(tempName.trim(), 'User Registered');
  };

  const getSyncIcon = () => {
    switch(syncStatus) {
        case 'syncing': return <RefreshCw size={16} className="animate-spin text-blue-300" />;
        case 'synced': return <CheckCircle2 size={16} className="text-green-400" />;
        case 'error': return <CloudOff size={16} className="text-red-400" />;
        default: return <Cloud size={16} className="text-gray-500 hover:text-white" />;
    }
  };

  return (
    <div className="min-h-screen w-full bg-deep-space text-white font-sans selection:bg-blue-500/30 selection:text-blue-100 overflow-x-hidden relative">
      {/* Mesh Gradients (Atmospheric background) */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-900/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-teal-900/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-[40%] left-[40%] w-[30%] h-[30%] bg-blue-900/10 rounded-full blur-[100px]"></div>
      </div>

      {/* Top Controls */}
      <div className="fixed top-4 right-4 z-50 flex gap-2">
          {/* Sync Indicator */}
          <button 
             onClick={() => storage.triggerSync()}
             className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-all border border-transparent hover:border-white/10"
             title={`Status: ${syncStatus.toUpperCase()}`}
          >
             {getSyncIcon()}
          </button>

          {/* Admin Button */}
          <button 
            onClick={() => navigate('/admin')}
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-500 hover:text-white transition-all border border-transparent hover:border-white/10"
            title="Admin Login"
          >
            <Lock size={16} />
          </button>
      </div>

      {/* Username Modal */}
      {showNameModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="w-full max-w-sm bg-[#1a1b26] border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
                <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-300">
                        <User size={32} />
                    </div>
                    <h2 className="text-2xl font-light text-white">Welcome</h2>
                    <p className="text-gray-400 text-sm mt-2">Enter your name to track your progress and compete.</p>
                </div>
                <input 
                    type="text" 
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    placeholder="Username"
                    className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-center text-white placeholder-gray-600 focus:border-blue-500/50 outline-none mb-4"
                    autoFocus
                />
                <button 
                    onClick={handleSaveName}
                    disabled={!tempName.trim()}
                    className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Start Learning
                </button>
            </div>
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-6 py-8 sm:py-24">
        {children}
      </div>

      <Navigation />
    </div>
  );
};