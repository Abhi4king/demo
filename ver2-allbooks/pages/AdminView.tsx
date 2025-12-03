
import React, { useState, useMemo, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useFiles } from '../context/FileContext';
import FileList from '../components/FileList';
import SearchBar from '../components/SearchBar';
import UploadModal from '../components/modals/UploadModal';
import NewFolderModal from '../components/modals/NewFolderModal';
import MoveModal from '../components/modals/MoveModal';
import Breadcrumbs from '../components/Breadcrumbs';

const AdminView: React.FC = () => {
  const { '*': path = '' } = useParams();
  const folderId = path.split('/').pop() || null;

  const { getChildren, getPath } = useFiles();
  const [searchTerm, setSearchTerm] = useState('');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isNewFolderModalOpen, setIsNewFolderModalOpen] = useState(false);
  const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);
  
  // Multi-select state
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  
  const currentChildren = useMemo(() => getChildren(folderId), [getChildren, folderId]);
  const breadcrumbPath = useMemo(() => getPath(folderId), [getPath, folderId]);

  const filteredNodes = useMemo(() => {
    if (!searchTerm) return currentChildren;
    return currentChildren.filter((node) =>
      node.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [currentChildren, searchTerm]);

  // Handle selection toggling
  const toggleSelection = useCallback((id: string) => {
    setSelectedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }, []);

  const clearSelection = () => setSelectedIds(new Set());

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white">
            Admin Dashboard
          </h1>
          <Breadcrumbs path={breadcrumbPath} basePath="/admin" />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto flex-wrap justify-end">
          {selectedIds.size > 0 ? (
              <>
               <span className="text-sm text-slate-600 dark:text-gray-400 mr-2">{selectedIds.size} selected</span>
               <button
                onClick={() => setIsMoveModalOpen(true)}
                className="flex-grow md:flex-grow-0 flex items-center justify-center gap-2 bg-blue-500/50 hover:bg-blue-500/80 border border-blue-400/50 text-white font-bold py-2 px-4 rounded-lg transition-all shadow-md"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                   <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                   <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                Move
              </button>
               <button
                onClick={clearSelection}
                className="flex-grow md:flex-grow-0 flex items-center justify-center gap-2 bg-gray-500/30 hover:bg-gray-500/50 border border-gray-400/30 text-slate-800 dark:text-gray-200 font-bold py-2 px-4 rounded-lg transition-all shadow-md"
              >
                Cancel
              </button>
              </>
          ) : (
              <>
                <button
                    onClick={() => setIsNewFolderModalOpen(true)}
                    className="flex-grow md:flex-grow-0 flex items-center justify-center gap-2 bg-yellow-500/50 hover:bg-yellow-500/80 border border-yellow-400/50 text-white font-bold py-2 px-4 rounded-lg transition-all shadow-md"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4l2 2h4a2 2 0 012 2v5a2 2 0 01-2 2H4a2 2 0 01-2-2V6zm10 4a1 1 0 10-2 0v1H9a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1v-1z" clipRule="evenodd" /></svg>
                    New Folder
                </button>
                <button
                    onClick={() => setIsUploadModalOpen(true)}
                    className="flex-grow md:flex-grow-0 flex items-center justify-center gap-2 bg-green-500/50 hover:bg-green-500/80 border border-green-400/50 text-white font-bold py-2 px-4 rounded-lg transition-all shadow-md"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                    </svg>
                    Add File
                </button>
              </>
          )}
        </div>
      </div>
      
      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      
      <FileList 
        nodes={filteredNodes} 
        isAdmin={true} 
        basePath="/admin" 
        selectedIds={selectedIds}
        onToggleSelect={toggleSelection}
      />
      
      {isUploadModalOpen && (
        <UploadModal parentId={folderId} onClose={() => setIsUploadModalOpen(false)} />
      )}
      {isNewFolderModalOpen && (
        <NewFolderModal parentId={folderId} onClose={() => setIsNewFolderModalOpen(false)} />
      )}
      {isMoveModalOpen && (
          <MoveModal 
            nodeIds={Array.from(selectedIds)} 
            currentParentId={folderId} 
            onClose={() => setIsMoveModalOpen(false)}
            onMoveComplete={clearSelection}
          />
      )}
    </div>
  );
};

export default AdminView;
