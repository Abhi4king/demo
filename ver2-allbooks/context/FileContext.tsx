
import React, { createContext, useState, useContext, ReactNode, useCallback, useEffect } from 'react';
import { FileSystemNode, NodeType } from '../data/types';
import { INITIAL_NODES } from '../data/constants';
import { fetchFileSystem, updateFileSystem } from '../services/syncService';
import { JSONBIN_API_KEY, JSONBIN_BIN_ID } from '../config';

interface FileContextType {
  nodes: FileSystemNode[];
  isLoading: boolean;
  isSyncing: boolean;
  syncError: string | null;
  isSyncConfigured: boolean;
  addNode: (node: Omit<FileSystemNode, 'id'>) => void;
  renameNode: (id: string, newName: string) => void;
  deleteNode: (id: string) => void;
  moveNodes: (nodeIds: string[], newParentId: string | null) => void;
  getNode: (id: string) => FileSystemNode | undefined;
  getChildren: (parentId: string | null) => FileSystemNode[];
  getPath: (nodeId: string | null) => FileSystemNode[];
}

const FileContext = createContext<FileContextType | undefined>(undefined);

const isSyncConfigured = !!(JSONBIN_API_KEY && JSONBIN_BIN_ID && JSONBIN_API_KEY.startsWith('$2a$10$') && JSONBIN_BIN_ID.length > 10);


export const FileProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [nodes, setNodes] = useState<FileSystemNode[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);

  const loadInitialData = useCallback(async () => {
    setIsLoading(true);

    if (!isSyncConfigured) {
      setSyncError("Sync not configured. Add JSONBin keys to config.ts.");
      setNodes(INITIAL_NODES);
      setIsLoading(false);
      return;
    }
    
    try {
      setSyncError(null);
      const cloudNodes = await fetchFileSystem();
      setNodes(cloudNodes);
    } catch (err) {
      console.error(err);
      if (err instanceof Error) {
          setSyncError(err.message);
      } else {
          setSyncError("Connection failed. Using local data.");
      }
      setNodes(INITIAL_NODES);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
      loadInitialData();
  }, [loadInitialData]);
  
  const updateAndSync = useCallback((nodesToSync: FileSystemNode[]) => {
      if (isSyncConfigured) {
          setIsSyncing(true);
          setSyncError(null);
          
          updateFileSystem(nodesToSync)
            .catch(err => {
                console.error("Sync failed:", err);
                if (err instanceof Error) {
                    setSyncError(err.message);
                } else {
                    setSyncError("An unknown sync error occurred.");
                }
            })
            .finally(() => {
                setTimeout(() => setIsSyncing(false), 500); // Prevent flashing
            });
      }
  }, []);

  const addNode = useCallback((node: Omit<FileSystemNode, 'id'>) => {
    setNodes(prevNodes => {
        const newNodes = [...prevNodes, { ...node, id: new Date().toISOString() + Math.random() }];
        updateAndSync(newNodes);
        return newNodes;
    });
  }, [updateAndSync]);

  const renameNode = useCallback((id: string, newName: string) => {
    setNodes(prevNodes => {
        const newNodes = prevNodes.map((node) => (node.id === id ? { ...node, name: newName } : node));
        updateAndSync(newNodes);
        return newNodes;
    });
  }, [updateAndSync]);

  const deleteNode = useCallback((id: string) => {
    setNodes(prevNodes => {
        const nodesToDelete = new Set<string>([id]);
        const queue = [id];
        
        while (queue.length > 0) {
            const currentId = queue.shift()!;
            const children = prevNodes.filter(n => n.parentId === currentId);
            for (const child of children) {
                nodesToDelete.add(child.id);
                if (child.type === NodeType.FOLDER) {
                    queue.push(child.id);
                }
            }
        }
        const newNodes = prevNodes.filter((node) => !nodesToDelete.has(node.id));
        updateAndSync(newNodes);
        return newNodes;
    });
  }, [updateAndSync]);

  const moveNodes = useCallback((nodeIds: string[], newParentId: string | null) => {
    setNodes(prevNodes => {
      const newNodes = prevNodes.map(node => 
        nodeIds.includes(node.id) ? { ...node, parentId: newParentId } : node
      );
      updateAndSync(newNodes);
      return newNodes;
    });
  }, [updateAndSync]);
  
  const getNode = useCallback((id: string) => {
    return nodes.find(n => n.id === id);
  }, [nodes]);

  const getChildren = useCallback((parentId: string | null) => {
    return nodes.filter(n => n.parentId === parentId).sort((a,b) => {
        if (a.type === NodeType.FOLDER && b.type === NodeType.FILE) return -1;
        if (a.type === NodeType.FILE && b.type === NodeType.FOLDER) return 1;
        return a.name.localeCompare(b.name);
    });
  }, [nodes]);

  const getPath = useCallback((nodeId: string | null): FileSystemNode[] => {
    if (nodeId === null) return [];
    const path: FileSystemNode[] = [];
    let currentNode = nodes.find(n => n.id === nodeId);
    while(currentNode) {
        path.unshift(currentNode);
        currentNode = nodes.find(n => n.id === currentNode!.parentId);
    }
    return path;
  }, [nodes]);
  
  const value = {
      nodes,
      isLoading,
      isSyncing,
      syncError,
      isSyncConfigured,
      addNode,
      renameNode,
      deleteNode,
      moveNodes,
      getNode,
      getChildren,
      getPath,
  };

  return (
    <FileContext.Provider value={value}>
      {children}
    </FileContext.Provider>
  );
};

export const useFiles = () => {
  const context = useContext(FileContext);
  if (context === undefined) {
    throw new Error('useFiles must be used within a FileProvider');
  }
  return context;
};
