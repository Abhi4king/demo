import { LogEntry } from '../types';

interface JsonBinResponse {
  record: LogEntry[] | { logs: LogEntry[] } | any;
  metadata: any;
}

export const fetchLogsFromBin = async (binId: string, apiKey?: string): Promise<LogEntry[]> => {
  if (!binId) throw new Error("Bin ID is required");

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (apiKey) {
    // Heuristic: JSONBin Master Keys usually start with $2a$ or $2b$ (bcrypt hashes).
    // If it looks like a master key, use X-Master-Key header.
    // Otherwise, use X-Access-Key.
    if (apiKey.startsWith('$2')) {
      headers['X-Master-Key'] = apiKey;
    } else {
      headers['X-Access-Key'] = apiKey;
    }
  }

  try {
    const response = await fetch(`https://api.jsonbin.io/v3/b/${binId}`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      let errorMessage = response.statusText;
      
      // Attempt to get more specific error from body if statusText is generic or empty
      if (!errorMessage || errorMessage === 'OK') { 
         try {
           const errBody = await response.json();
           errorMessage = errBody.message || `Status ${response.status}`;
         } catch {
           errorMessage = `Status ${response.status}`;
         }
      }
      
      throw new Error(`API Error: ${errorMessage}`);
    }

    const data: JsonBinResponse = await response.json();

    // Normalize data structure logic
    let rawLogs: any[] = [];
    if (Array.isArray(data.record)) {
      rawLogs = data.record;
    } else if (data.record && Array.isArray(data.record.logs)) {
      rawLogs = data.record.logs;
    } else if (data.record && typeof data.record === 'object') {
       // Attempt to find an array if the structure is different
       const possibleArray = Object.values(data.record).find(val => Array.isArray(val));
       if (possibleArray) rawLogs = possibleArray as any[];
       
       // Fallback for single object entry if it looks like a log
       else if ('message' in data.record || 'details' in data.record || 'action' in data.record) {
          rawLogs = [data.record];
       }
    }
    
    // Map raw data to application LogEntry interface
    return rawLogs.map((item: any) => {
      // 1. Determine Message
      // Prefer 'message', fallback to 'details' if it's a string, fallback to 'action'
      let message = item.message;
      if (!message && typeof item.details === 'string') {
        message = item.details;
      }
      
      // 2. Determine User
      // Prefer 'user', fallback to 'userName'
      const user = item.user || item.userName;

      // 3. Determine Level
      // Prefer 'level', fallback to 'action'
      const level = item.level || item.action || 'INFO';

      return {
        id: item.id ? String(item.id) : Math.random().toString(36).substr(2, 9),
        timestamp: item.timestamp || new Date().toISOString(),
        level: level,
        message: message || `Action: ${level}`,
        details: item.details, // Keep original details object/string
        user: user
      };
    });
    
  } catch (error: any) {
    // Ensure the error message is a string
    throw new Error(error.message || "Failed to connect to JSONBin");
  }
};