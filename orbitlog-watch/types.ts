export enum LogLevel {
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  DEBUG = 'DEBUG',
  SUCCESS = 'SUCCESS',
}

export interface LogEntry {
  id: string;
  timestamp: string;
  level: LogLevel | string;
  message: string;
  details?: any;
  user?: string;
}

export type ViewState = 'CONFIG' | 'LIST' | 'DETAIL';

export interface AppConfig {
  binId: string;
  apiKey?: string;
  username?: string;
}