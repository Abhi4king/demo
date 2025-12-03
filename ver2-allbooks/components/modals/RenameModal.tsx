
import React, { useState } from 'react';
import { useFiles } from '../../context/FileContext';
import { FileSystemNode } from '../../data/types';

interface RenameModalProps {
  node: FileSystemNode;
  onClose: () => void;
}

const RenameModal: React.FC<RenameModalProps> = ({ node, onClose }) => {
  const [newName, setNewName] = useState(node.name);
  const { renameNode } = useFiles();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newName.trim()) {
      renameNode(node.id, newName.trim());
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white/10 dark:bg-gray-900/50 backdrop-blur-2xl rounded-2xl shadow-xl p-6 w-full max-w-md m-4 border border-white/20">
        <h2 className="text-xl font-bold mb-4 text-slate-800 dark:text-white">Rename Item</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="w-full px-3 py-2 border border-white/20 rounded-md bg-white/20 dark:bg-gray-700/30 text-slate-800 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500"
            autoFocus
          />
          <div className="mt-6 flex justify-end space-x-3">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-500/30 text-slate-800 dark:bg-gray-600/50 dark:text-gray-200 rounded-md hover:bg-gray-500/50 dark:hover:bg-gray-500/60">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RenameModal;