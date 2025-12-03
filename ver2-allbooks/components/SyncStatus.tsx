
import React from 'react';
import { useFiles } from '../context/FileContext';

const SyncStatus: React.FC = () => {
    const { isSyncing, syncError, isSyncConfigured } = useFiles();

    if (!isSyncConfigured) {
        return (
            <div className="group relative">
                <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full border bg-yellow-900/40 border-yellow-400/30">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8.257 3.099c.636-1.21 2.852-1.21 3.488 0l6.065 11.572c.636 1.21-.472 2.729-1.744 2.729H3.936c-1.272 0-2.38-1.519-1.744-2.729L8.257 3.099zM10 12a1 1 0 11-2 0 1 1 0 012 0zm-1-4a1 1 0 00-1 1v2a1 1 0 102 0V9a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm font-medium hidden sm:inline text-yellow-400">Sync Off</span>
                </div>
                <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-max max-w-xs bg-gray-900 text-white text-xs rounded-lg py-1.5 px-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none shadow-lg z-50">
                    Cloud sync is not configured.
                    <svg className="absolute text-gray-900 h-2 w-full left-0 bottom-full" x="0px" y="0px" viewBox="0 0 255 255"><polygon className="fill-current" points="0,255 127.5,127.5 255,255"/></svg>
                </div>
            </div>
        );
    }

    const getStatus = () => {
        if (isSyncing) {
            return {
                icon: (
                    <svg className="animate-spin h-5 w-5 text-sky-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                ),
                text: 'Syncing...',
                textColor: 'text-sky-400',
                tooltip: 'Saving changes to the cloud.',
            };
        }
        if (syncError) {
            return {
                icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                ),
                text: 'Error',
                textColor: 'text-red-400',
                tooltip: syncError,
            };
        }
        return {
            icon: (
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
            ),
            text: 'Synced',
            textColor: 'text-green-400',
            tooltip: 'All changes are saved to the cloud.',
        };
    };

    const { icon, text, textColor, tooltip } = getStatus();

    return (
        <div className="group relative">
            <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-full border bg-white/10 dark:bg-gray-900/20 border-white/10`}>
                {icon}
                <span className={`text-sm font-medium hidden sm:inline ${textColor}`}>{text}</span>
            </div>
            <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-max max-w-xs bg-gray-900 text-white text-xs rounded-lg py-1.5 px-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none shadow-lg z-50">
                {tooltip}
                <svg className="absolute text-gray-900 h-2 w-full left-0 bottom-full" x="0px" y="0px" viewBox="0 0 255 255"><polygon className="fill-current" points="0,255 127.5,127.5 255,255"/></svg>
            </div>
        </div>
    );
};

export default SyncStatus;