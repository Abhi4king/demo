
import React, { useState, useMemo } from 'react';
import { useFiles } from '../../context/FileContext';
import { FileSystemNode, NodeType } from '../../data/types';

interface MoveModalProps {
  nodeIds: string[];
  currentParentId: string | null;
  onClose: () => void;
  onMoveComplete: () => void;
}

const MoveModal: React.FC<MoveModalProps> = ({ nodeIds, currentParentId, onClose, onMoveComplete }) => {
  const { nodes, moveNodes, getChildren } = useFiles();
  const [selectedDestination, setSelectedDestination] = useState<string | null>(currentParentId);

  // Determine valid destinations
  // A folder cannot be moved into itself or one of its descendants
  const invalidDestinationIds = useMemo(() => {
    const invalidIds = new Set<string>(nodeIds); // Can't move into self
    
    const addDescendants = (parentId: string) => {
        const children = nodes.filter(n => n.parentId === parentId);
        for (const child of children) {
            if (child.type === NodeType.FOLDER) {
                invalidIds.add(child.id);
                addDescendants(child.id);
            }
        }
    };

    nodeIds.forEach(id => {
        // Only relevant if the item moving is a folder
        const node = nodes.find(n => n.id === id);
        if (node && node.type === NodeType.FOLDER) {
            addDescendants(id);
        }
    });

    return invalidIds;
  }, [nodes, nodeIds]);

  // Flatten folder structure for display
  // Simple recursive builder
  const buildFolderTree = (parentId: string | null, depth: number = 0): { node: FileSystemNode | null, depth: number }[] => {
      const result: { node: FileSystemNode | null, depth: number }[] = [];
      
      // Add Root if depth 0
      if (depth === 0) {
          result.push({ node: null, depth: 0 });
      }

      const children = nodes
        .filter(n => n.parentId === parentId && n.type === NodeType.FOLDER)
        .sort((a, b) => a.name.localeCompare(b.name));

      for (const child of children) {
          result.push({ node: child, depth: depth + 1 });
          result.push(...buildFolderTree(child.id, depth + 1));
      }
      return result;
  };

  const folderTree = useMemo(() => buildFolderTree(null), [nodes]);

  const handleMove = () => {
      moveNodes(nodeIds, selectedDestination);
      onMoveComplete();
      onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white/10 dark:bg-gray-900/50 backdrop-blur-2xl rounded-2xl shadow-xl p-6 w-full max-w-md m-4 border border-white/20 flex flex-col max-h-[80vh]">
        <h2 className="text-xl font-bold mb-4 text-slate-800 dark:text-white">Move {nodeIds.length} Item{nodeIds.length > 1 ? 's' : ''}</h2>
        <p className="text-sm text-slate-600 dark:text-gray-400 mb-2">Select destination folder:</p>
        
        <div className="flex-1 overflow-y-auto border border-white/10 rounded-md bg-white/5 dark:bg-black/20 p-2 space-y-1 custom-scrollbar">
            {folderTree.map((item) => {
                const isRoot = item.node === null;
                const id = isRoot ? null : item.node!.id;
                const name = isRoot ? 'Root Folder' : item.node!.name;
                const isInvalid = id !== null && invalidDestinationIds.has(id);
                const isCurrent = id === currentParentId;
                const isSelected = id === selectedDestination;

                if (isInvalid) return null; // Hide invalid destinations to clean up UI, or standard disable

                return (
                    <div 
                        key={id || 'root'}
                        onClick={() => !isCurrent && setSelectedDestination(id)}
                        className={`
                            flex items-center px-2 py-2 rounded cursor-pointer transition-colors
                            ${isSelected ? 'bg-sky-500 text-white' : 'hover:bg-white/10 text-slate-800 dark:text-gray-200'}
                            ${isCurrent ? 'opacity-50 cursor-default' : ''}
                        `}
                        style={{ paddingLeft: `${item.depth * 20 + 10}px` }}
                    >
                         <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 mr-2 ${isSelected ? 'text-white' : 'text-yellow-500'}`} viewBox="0 0 20 20" fill="currentColor">
                            <path d="M2 6a2 2 0 012-2h4l2 2h4a2 2 0 012 2v5a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                        </svg>
                        <span className="truncate">{name} {isCurrent && '(Current)'}</span>
                    </div>
                );
            })}
        </div>

        <div className="mt-6 flex justify-end space-x-3 flex-shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500/30 text-slate-800 dark:bg-gray-600/50 dark:text-gray-200 rounded-md hover:bg-gray-500/50 dark:hover:bg-gray-500/60"
          >
            Cancel
          </button>
          <button
            onClick={handleMove}
            disabled={selectedDestination === currentParentId}
            className="px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Move Here
          </button>
        </div>
      </div>
    </div>
  );
};

export default MoveModal;
