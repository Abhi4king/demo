// Cookie Helpers
export const setCookie = (name: string, value: string, days: number = 365) => {
    const d = new Date();
    d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + d.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
};
  
export const getCookie = (name: string): string | undefined => {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return undefined;
};

// Environment Variable Helper
export const getEnvVar = (key: string, fallback: string = ''): string => {
    // Check standard process.env
    if (typeof process !== 'undefined' && process.env && process.env[key]) {
        return process.env[key] as string;
    }
    if (typeof process !== 'undefined' && process.env && process.env[`REACT_APP_${key}`]) {
        return process.env[`REACT_APP_${key}`] as string;
    }
    // Check Vite specific
    if (typeof import.meta !== 'undefined' && (import.meta as any).env && (import.meta as any).env[`VITE_${key}`]) {
        return (import.meta as any).env[`VITE_${key}`] as string;
    }
    return fallback;
};

// Types
export interface LogEntry {
    id: string;
    username: string;
    action: string;
    timestamp: number;
    details?: string;
}

export interface ScoreEntry {
    username: string;
    score: number;
    date: number;
}

export type SyncStatus = 'idle' | 'syncing' | 'synced' | 'error';

// Simulated Backend (LocalStorage + npoint.io)
const LOGS_KEY = 'mns_admin_logs';
const LEADERBOARD_KEY = 'mns_leaderboard';

// Construct URL intelligently to handle cases where Env Var is just the ID
const rawSyncVar = getEnvVar('SYNC_API_URL', "https://api.npoint.io/42f4d1ac597f1385b282");
const SYNC_API_URL = rawSyncVar.startsWith('http') 
    ? rawSyncVar 
    : `https://api.npoint.io/${rawSyncVar}`;

// Event Management
type EventType = 'syncStatus' | 'dataChange';
const listeners: Record<EventType, Set<Function>> = {
    syncStatus: new Set(),
    dataChange: new Set()
};

let currentSyncStatus: SyncStatus = 'idle';
let isSyncDisabled = false; // Flag to disable sync if unauthorized

const notifySyncStatus = (status: SyncStatus) => {
    currentSyncStatus = status;
    listeners.syncStatus.forEach(fn => fn(status));
};

const notifyDataChange = () => {
    listeners.dataChange.forEach(fn => fn());
};

export const subscribeToSync = (listener: (status: SyncStatus) => void) => {
    listeners.syncStatus.add(listener);
    listener(currentSyncStatus);
    return () => {
        listeners.syncStatus.delete(listener);
    };
};

export const subscribeToData = (listener: () => void) => {
    listeners.dataChange.add(listener);
    return () => {
        listeners.dataChange.delete(listener);
    };
};

const performSync = async () => {
    // Prevent overlapping syncs or if disabled (unless manually triggered)
    if (currentSyncStatus === 'syncing' || isSyncDisabled) return;
    
    notifySyncStatus('syncing');
    console.log("Starting Sync with:", SYNC_API_URL);

    try {
        // 1. Fetch Remote Data
        const response = await fetch(SYNC_API_URL);
        
        // Handle Auth/Forbidden errors immediately by disabling sync
        if (response.status === 401 || response.status === 403) {
             console.warn("Sync API Unauthorized (401/403). Switching to Local Storage only.");
             isSyncDisabled = true;
             notifySyncStatus('idle'); // Treat as success (local mode)
             return;
        }

        let remoteData: any = { logs: [], leaderboard: [] };
        
        if (response.ok) {
            try {
                const text = await response.text();
                if (text && text.trim().length > 0) {
                    remoteData = JSON.parse(text);
                }
            } catch (e) {
                console.warn("Failed to parse remote JSON, assuming empty.", e);
            }
        } else {
             // If 404, we can try to create/post. Other errors we might want to stop.
             if (response.status !== 404) {
                 throw new Error(`Sync fetch failed: ${response.status}`);
             }
        }

        // 2. Load Local Data
        const localLogs: LogEntry[] = JSON.parse(localStorage.getItem(LOGS_KEY) || '[]');
        const localScores: ScoreEntry[] = JSON.parse(localStorage.getItem(LEADERBOARD_KEY) || '[]');

        // 3. Merge Strategies
        const remoteLogs = (remoteData && Array.isArray(remoteData.logs)) ? remoteData.logs : [];
        const remoteScores = (remoteData && Array.isArray(remoteData.leaderboard)) ? remoteData.leaderboard : [];

        // Merge Logs: Deduplicate by ID
        const allLogs = [...localLogs, ...remoteLogs];
        const uniqueLogs = Array.from(new Map(allLogs.map(item => [item.id, item])).values())
            .sort((a, b) => b.timestamp - a.timestamp)
            .slice(0, 100); // Keep only latest 100 logs

        // Merge Leaderboard: Keep unique USERS, retaining their HIGHEST score.
        const allScores = [...localScores, ...remoteScores];
        const bestScoresMap = new Map<string, ScoreEntry>();
        
        allScores.forEach(s => {
            const existing = bestScoresMap.get(s.username);
            // If user not in map, or this score is higher than what's in map
            if (!existing || s.score > existing.score) {
                bestScoresMap.set(s.username, s);
            }
        });
        
        const uniqueScores = Array.from(bestScoresMap.values())
            .sort((a, b) => b.score - a.score)
            .slice(0, 10);

        // 4. Update Local Storage
        localStorage.setItem(LOGS_KEY, JSON.stringify(uniqueLogs));
        localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(uniqueScores));
        
        notifyDataChange(); // Notify UI to update

        // 5. Push Merged Data Back to Remote
        console.log("Pushing data to remote...");
        const postResponse = await fetch(SYNC_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                logs: uniqueLogs,
                leaderboard: uniqueScores
            })
        });

        if (postResponse.status === 401 || postResponse.status === 403) {
             console.warn("Sync API Unauthorized (401/403) during POST. Switching to Local Storage only.");
             isSyncDisabled = true;
             notifySyncStatus('idle');
             return;
        }

        if (!postResponse.ok) {
            throw new Error(`Post failed: ${postResponse.status}`);
        }

        console.log("Sync successful.");
        notifySyncStatus('synced');
        
        setTimeout(() => {
            if (currentSyncStatus === 'synced') notifySyncStatus('idle');
        }, 3000);

    } catch (error) {
        console.error("Sync failed:", error);
        notifySyncStatus('error');
    }
};

// Debounce helper
let debounceTimer: ReturnType<typeof setTimeout>;
const debouncedSync = () => {
    if (isSyncDisabled) return;
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
        performSync();
    }, 2000); 
};

export const storage = {
    // Logging
    addLog: (username: string, action: string, details?: string) => {
        const logs: LogEntry[] = JSON.parse(localStorage.getItem(LOGS_KEY) || '[]');
        const newLog: LogEntry = {
            id: crypto.randomUUID(),
            username,
            action,
            timestamp: Date.now(),
            details
        };
        const updatedLogs = [newLog, ...logs].slice(0, 100); // Limit to 100 logs
        localStorage.setItem(LOGS_KEY, JSON.stringify(updatedLogs));
        notifyDataChange();
        debouncedSync();
    },

    getLogs: (): LogEntry[] => {
        return JSON.parse(localStorage.getItem(LOGS_KEY) || '[]');
    },

    clearLogs: () => {
        localStorage.removeItem(LOGS_KEY);
        notifyDataChange();
        
        // Push empty logs to remote to overwrite
        if (!isSyncDisabled) {
            notifySyncStatus('syncing');
            fetch(SYNC_API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    logs: [], 
                    leaderboard: storage.getLeaderboard() 
                })
            }).then((res) => {
                if(res.status === 401 || res.status === 403) {
                    isSyncDisabled = true;
                    notifySyncStatus('idle');
                } else {
                    notifySyncStatus('synced');
                    notifyDataChange();
                }
            })
            .catch(() => notifySyncStatus('error'));
        }
    },

    // Leaderboard
    saveScore: (username: string, score: number) => {
        let scores: ScoreEntry[] = JSON.parse(localStorage.getItem(LEADERBOARD_KEY) || '[]');
        
        const existingIndex = scores.findIndex(s => s.username === username);
        let updated = false;

        if (existingIndex >= 0) {
            // Only update if the new score is higher than the existing one
            if (scores[existingIndex].score < score) {
                scores[existingIndex].score = score;
                scores[existingIndex].date = Date.now();
                updated = true;
            }
        } else {
            // New user entry
            scores.push({ username, score, date: Date.now() });
            updated = true;
        }
        
        if (updated) {
            // Sort and Keep Top 10
            const top10 = scores.sort((a, b) => b.score - a.score).slice(0, 10);
            localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(top10));
            notifyDataChange();
            debouncedSync();
        }
    },

    getLeaderboard: (): ScoreEntry[] => {
        return JSON.parse(localStorage.getItem(LEADERBOARD_KEY) || '[]');
    },

    resetLeaderboard: () => {
        localStorage.removeItem(LEADERBOARD_KEY);
        notifyDataChange();
        
        // Force reset remote if allowed
        if (!isSyncDisabled) {
            notifySyncStatus('syncing');
            fetch(SYNC_API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ logs: storage.getLogs(), leaderboard: [] })
            }).then((res) => {
                if(res.status === 401 || res.status === 403) {
                    isSyncDisabled = true;
                    notifySyncStatus('idle');
                } else {
                    notifySyncStatus('synced');
                    notifyDataChange();
                }
            })
            .catch(() => notifySyncStatus('error'));
        }
    },

    // Public Sync Methods
    triggerSync: () => {
        // Reset disabled state to allow manual retry
        isSyncDisabled = false;
        
        // Bypass debounce for manual trigger
        clearTimeout(debounceTimer);
        performSync();
    }
};
