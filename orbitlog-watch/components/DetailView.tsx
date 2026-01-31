import React from 'react';
import { LogEntry } from '../types';
import { X } from 'lucide-react';

interface DetailViewProps {
  log: LogEntry;
  onClose: () => void;
}

export const DetailView: React.FC<DetailViewProps> = ({ log, onClose }) => {
  return (
    <div className="absolute inset-0 z-50 bg-watch-bg flex flex-col animate-in fade-in duration-200">
        {/* Sticky Header */}
      <div className="h-16 shrink-0 flex items-center justify-center border-b border-watch-border bg-watch-bg/90 backdrop-blur-sm relative z-10">
        <button
          onClick={onClose}
          className="p-2 rounded-full bg-watch-surface active:bg-watch-border transition-colors absolute top-2 text-watch-text"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 no-scrollbar pb-24 text-center">
        <div className="mb-4">
          <span className={`
            px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider
            ${log.level === 'ERROR' ? 'bg-watch-danger/20 text-watch-danger' :
              log.level === 'WARN' ? 'bg-watch-warning/20 text-watch-warning' :
              log.level === 'SUCCESS' ? 'bg-watch-success/20 text-watch-success' :
              'bg-blue-500/20 text-blue-400'}
          `}>
            {log.level}
          </span>
        </div>

        <p className="text-xs text-watch-muted mb-2 font-mono">{log.timestamp}</p>

        <p className="text-lg text-watch-text font-medium mb-6 leading-relaxed">
          {log.message}
        </p>

        {log.details && (
          <div className="text-left bg-watch-surface rounded-xl p-3 text-xs font-mono text-watch-muted overflow-x-auto whitespace-pre-wrap break-all border border-watch-border">
            {JSON.stringify(log.details, null, 2)}
          </div>
        )}
      </div>
    </div>
  );
};