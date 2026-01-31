import { LogEntry, LogLevel } from './types';

// Default mock data matching the user's observed structure
export const MOCK_LOGS: LogEntry[] = [
  {
    id: '1',
    timestamp: new Date().toISOString(),
    level: 'DELETE',
    message: 'Unblocked user: A',
    user: 'Admin'
  },
  {
    id: '2',
    timestamp: new Date(Date.now() - 1000 * 60).toISOString(),
    level: 'DELETE',
    message: 'Blocked user: A',
    user: 'Admin'
  },
  {
    id: '3',
    timestamp: new Date(Date.now() - 1000 * 120).toISOString(),
    level: 'LOGIN',
    message: 'Guest logged in via Public View',
    user: 'A'
  },
  {
    id: '4',
    timestamp: new Date(Date.now() - 1000 * 180).toISOString(),
    level: 'LOGIN',
    message: 'Guest logged in via Public View',
    user: 'Abhi'
  },
  {
    id: '5',
    timestamp: new Date(Date.now() - 1000 * 240).toISOString(),
    level: 'INFO',
    message: 'System initialization started',
    user: 'System'
  },
  {
    id: '6',
    timestamp: new Date(Date.now() - 1000 * 300).toISOString(),
    level: 'ERROR',
    message: 'Connection timed out to API',
    details: { endpoint: '/v1/sync', retry: 3 },
    user: 'Network'
  },
];

export const STORAGE_KEY = 'orbitlog_config';