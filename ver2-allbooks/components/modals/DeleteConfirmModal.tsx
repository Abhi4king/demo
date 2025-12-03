
import React from 'react';
import { useFiles } from '../../context/FileContext';
import { FileSystemNode, NodeType } from '../../data/types';

interface DeleteConfirmModalProps {
  node: FileSystemNode;
  onClose: () => void;
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({ node, onClose }) => {
  const { deleteNode } = useFiles();

  const handleDelete = () => {
    deleteNode(node.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white/10 dark:bg-gray-900/50 backdrop-blur-2xl rounded-2xl shadow-xl p-6 w-full max-w-md m-4 border border-white/20">
        <h2 className="text-xl font-bold mb-2 text-slate-800 dark:text-white">Confirm Deletion</h2>
        <p className="text-slate-800 dark:text-gray-300">
          Are you sure you want to delete <span className="font-semibold">{node.name}</span>?
          {node.type === NodeType.FOLDER && " All its contents will also be deleted."} This action cannot be undone.
        </p>
        <div className="mt-6 flex justify-end space-x-3">
          <button onClick={onClose} className="px-4 py-2 bg-gray-500/30 text-slate-800 dark:bg-gray-600/50 dark:text-gray-200 rounded-md hover:bg-gray-500/50 dark:hover:bg-gray-500/60">
            Cancel
          </button>
          <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;