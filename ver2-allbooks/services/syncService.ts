import { FileSystemNode } from '../data/types';
import { JSONBIN_API_KEY, JSONBIN_BIN_ID } from '../config';

const dateReviver = (key: string, value: any) => {
  if (key === 'uploadDate' && typeof value === 'string') {
    const date = new Date(value);
    if (!isNaN(date.getTime())) {
      return date;
    }
  }
  return value;
};


export const fetchFileSystem = async (): Promise<FileSystemNode[]> => {
    if (!JSONBIN_API_KEY || !JSONBIN_BIN_ID || JSONBIN_API_KEY.startsWith('$2a$10$') === false || JSONBIN_BIN_ID.length < 10) {
        throw new Error("Syncing is not configured.");
    }

    const URL = `https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}/latest`;

    let response;
    try {
        response = await fetch(URL, {
            method: 'GET',
            headers: {
                'X-Master-Key': JSONBIN_API_KEY,
                'X-Bin-Meta': 'false', // Get raw record data without metadata wrapper
            }
        });
    } catch (error) {
        // This catches network errors (e.g., no internet, DNS issues, CORS)
        console.error("Network error during fetch:", error);
        throw new Error("Network request to sync service failed. Please check your internet connection.");
    }

    if (response.status === 404) {
        throw new Error("JSONBin.io bin not found. Please verify your BIN_ID in config.ts.");
    }
    
    if (!response.ok) {
        throw new Error(`Failed to fetch file system. Server responded with status: ${response.status}`);
    }

    const responseText = await response.text();
    // A new or empty bin might return an empty response
    if (!responseText) return [];
    
    try {
        const nodes = JSON.parse(responseText, dateReviver);
        // Ensure the response is an array
        return Array.isArray(nodes) ? nodes : [];
    } catch(e) {
        console.error("Failed to parse JSON from JSONBin.io", e);
        throw new Error("Data in sync service bin is not valid JSON.");
    }
};

export const updateFileSystem = async (nodes: FileSystemNode[]): Promise<void> => {
     if (!JSONBIN_API_KEY || !JSONBIN_BIN_ID || JSONBIN_API_KEY.startsWith('$2a$10$') === false || JSONBIN_BIN_ID.length < 10) {
        return; // Silently fail if not configured
    }

    const URL = `https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}`;

    let response;
    try {
        response = await fetch(URL, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-Master-Key': JSONBIN_API_KEY,
            },
            body: JSON.stringify(nodes),
        });
    } catch (error) {
        console.error("Network error during update:", error);
        throw new Error("Network request to sync service failed. Please check your internet connection.");
    }

    if (!response.ok) {
        try {
            const errorData = await response.json();
            throw new Error(`Failed to update sync service bin. Status: ${response.status}. Message: ${errorData.message}`);
        } catch(e) {
            throw new Error(`Failed to update sync service bin. Status: ${response.status}`);
        }
    }
};