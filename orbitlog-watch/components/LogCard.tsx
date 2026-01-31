
import React from 'react';
import { LogEntry } from '../types';
import { AlertCircle, CheckCircle, Info, AlertTriangle, Bug, LogIn, Trash2, ShieldAlert } from 'lucide-react';

interface LogCardProps {
  log: LogEntry;
  onClick?: (log: LogEntry) => void;
}

const getIcon = (level: string) => {
  const normalizedLevel = level.toUpperCase();
  switch (normalizedLevel) {
    case 'ERROR': return <AlertCircle className="w-4 h-4 text-watch-danger" />;
    case 'WARN': 
    case 'WARNING': return <AlertTriangle className="w-4 h-4 text-watch-warning" />;
    case 'SUCCESS': return <CheckCircle className="w-4 h-4 text-watch-success" />;
    case 'DEBUG': return <Bug className="w-4 h-4 text-watch-muted" />;
    case 'LOGIN': return <LogIn className="w-4 h-4 text-watch-success" />;
    case 'DELETE': return <Trash2 className="w-4 h-4 text-rose-500" />;
    case 'BLOCK': return <ShieldAlert className="w-4 h-4 text-orange-500" />;
    case 'INFO':
    default: return <Info className="w-4 h-4 text-watch-accent" />;
  }
};

const getLevelStyles = (level: string) => {
  const normalizedLevel = level.toUpperCase();
  switch (normalizedLevel) {
    case 'ERROR': return {
      border: 'border-watch-danger',
      bg: 'bg-red-500/10 dark:bg-red-900/20',
      badge: 'bg-red-500 text-white',
    };
    case 'WARN': 
    case 'WARNING': return {
      border: 'border-watch-warning',
      bg: 'bg-amber-500/10 dark:bg-amber-900/20',
      badge: 'bg-amber-500 text-black',
    };
    case 'SUCCESS': 
    case 'LOGIN': return {
      border: 'border-watch-success',
      bg: 'bg-emerald-500/10 dark:bg-emerald-900/20',
      badge: 'bg-emerald-500 text-white',
    };
    case 'DELETE': return {
      border: 'border-rose-500',
      bg: 'bg-rose-500/10 dark:bg-rose-900/20',
      badge: 'bg-rose-500 text-white',
    };
    case 'BLOCK': return {
      border: 'border-orange-500',
      bg: 'bg-orange-500/10 dark:bg-orange-900/20',
      badge: 'bg-orange-500 text-white',
    };
    case 'DEBUG': return {
      border: 'border-slate-400',
      bg: 'bg-slate-500/10 dark:bg-slate-800/30',
      badge: 'bg-slate-500 text-white',
    };
    default: return {
      border: 'border-watch-accent',
      bg: 'bg-blue-500/5 dark:bg-blue-900/10',
      badge: 'bg-watch-accent text-white',
    };
  }
};

export const LogCard: React.FC<LogCardProps> = ({ log, onClick }) => {
  // Format time to HH:mm:ss
  let timeStr = '';
  try {
      timeStr = new Date(log.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit' });
  } catch (e) {
      timeStr = '--:--';
  }

  const styles = getLevelStyles(log.level as string);

  return (
    <div
      onClick={() => onClick && onClick(log)}
      className={`
        w-full mb-1 p-3 rounded-2xl border-l-4 ${styles.border} ${styles.bg}
        ${onClick ? 'active:scale-95 cursor-pointer' : ''} transition-all duration-150 shadow-sm
        flex flex-col gap-1.5 relative overflow-hidden group backdrop-blur-sm
      `}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-1.5 shrink-0">
          {getIcon(log.level as string)}
          <span className={`
            text-[9px] px-1.5 py-0.5 rounded-md font-black uppercase tracking-wider
            ${styles.badge}
          `}>
            {log.level}
          </span>
          <span className="text-[10px] text-watch-muted font-mono font-medium">{timeStr}</span>
        </div>
        
        {log.user && (
          <span className="text-[10px] text-watch-accent font-bold tracking-tight uppercase break-words text-right leading-tight max-w-[100px]">
            {log.user}
          </span>
        )}
      </div>
      
      <div className="text-[13px] font-semibold text-watch-text line-clamp-2 leading-[1.2] tracking-tight">
        {log.message}
      </div>
    </div>
  );
};
