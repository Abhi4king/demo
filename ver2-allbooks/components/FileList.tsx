
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileSystemNode, NodeType } from '../data/types';
import FileIcon from './FileIcon';
import RenameModal from './modals/RenameModal';
import DeleteConfirmModal from './modals/DeleteConfirmModal';
import SummarizeModal from './modals/SummarizeModal';
import PreviewModal from './modals/PreviewModal';
import { useToast } from '../context/ToastContext';

interface FileListProps {
  nodes: FileSystemNode[];
  isAdmin: boolean;
  basePath: string;
  selectedIds?: Set<string>;
  onToggleSelect?: (id: string) => void;
}

interface NodeItemProps {
    node: FileSystemNode;
    isAdmin: boolean;
    basePath: string;
    isSelected?: boolean;
    onToggleSelect?: (id: string) => void;
    onRename: (node: FileSystemNode) => void;
    onDelete: (node: FileSystemNode) => void;
    onSummarize: (node: FileSystemNode) => void;
    onPreview: (node: FileSystemNode) => void;
}


const NodeItem: React.FC<NodeItemProps> = ({ node, isAdmin, basePath, isSelected, onToggleSelect, onRename, onDelete, onSummarize, onPreview }) => {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const [restrictedClickCount, setRestrictedClickCount] = useState(0);

    const isSummarizable = node.type === NodeType.FILE && ['pdf', 'docx'].includes(node.fileType!);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const formatFileSize = (bytes?: number) => {
        if (!bytes || bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const handleNodeClick = () => {
        // Restricted Access Logic for Public Users
        if (!isAdmin && node.type === NodeType.FOLDER && node.name.trim().toLowerCase() === 'under construction') {
            const newCount = restrictedClickCount + 1;
            setRestrictedClickCount(newCount);

            if (newCount >= 3) {
                window.location.href = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSc2UpxJgo3ectK4O-LV2ENNfMy412dC1JpaA&s';
            } else {
                showToast("⚠️ Warning: This folder is under construction.", "error");
            }
            return;
        }

        if (node.type === NodeType.FOLDER) {
            navigate(`${basePath}/${node.id}`);
        } else {
            onPreview(node);
        }
    }

    const handleCheckboxClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onToggleSelect) {
            onToggleSelect(node.id);
        }
    }
    
    const nodeContent = (
      <>
        {isAdmin && onToggleSelect && (
            <div onClick={handleCheckboxClick} className="flex-shrink-0 mr-3 cursor-pointer">
                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${isSelected ? 'bg-sky-500 border-sky-500' : 'border-gray-400 hover:border-sky-400'}`}>
                    {isSelected && (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-white" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                    )}
                </div>
            </div>
        )}
        <div className="flex-shrink-0">
            <FileIcon nodeType={node.type} fileType={node.fileType} />
        </div>
        <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-800 dark:text-white truncate">{node.name}</p>
            {node.type === NodeType.FILE && (
                <p className="text-xs sm:text-sm text-slate-600 dark:text-gray-400">
                    {formatFileSize(node.size)} &middot; {node.uploadDate?.toLocaleDateString()}
                </p>
            )}
        </div>
      </>
    )

    return (
        <li className={`bg-white/20 dark:bg-gray-800/20 backdrop-blur-md p-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2 sm:space-x-4 border border-white/10 ${isSelected ? 'bg-sky-100/50 dark:bg-sky-900/30 border-sky-500/50' : 'hover:bg-white/30 dark:hover:bg-gray-700/30'} ${isMenuOpen ? 'relative z-20' : ''}`}>
            <button onClick={handleNodeClick} className="flex items-center space-x-4 flex-1 min-w-0 text-left w-full">
                {nodeContent}
            </button>
            
            {isAdmin && (
                <div className="flex-shrink-0">
                    {/* Desktop Buttons */}
                    <div className="hidden sm:flex items-center space-x-1">
                        {isSummarizable && (
                           <button onClick={(e) => { e.stopPropagation(); onSummarize(node); }} className="p-2 text-purple-500 hover:bg-purple-500/20 rounded-full transition-colors" title="Summarize with Gemini">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M11.983 1.905a2.5 2.5 0 00-4.012.138l-2.052 3.553a2.5 2.5 0 004.012-.138l-2.052-3.553zM10 12a2 2 0 100-4 2 2 0 000 4zM2 11a1 1 0 011-1h2.586a1 1 0 110 2H3a1 1 0 01-1-1zm15 0a1 1 0 01-1 1h-2.586a1 1 0 110-2H17a1 1 0 011 1zM7 2.5a1 1 0 011-1h2a1 1 0 110 2H8a1 1 0 01-1-1zM7 17.5a1 1 0 011-1h2a1 1 0 110 2H8a1 1 0 01-1-1z"/></svg>
                          </button>
                        )}
                        <button onClick={(e) => { e.stopPropagation(); onRename(node); }} className="p-2 text-sky-500 hover:bg-sky-500/20 rounded-full transition-colors" title="Rename"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg></button>
                        <button onClick={(e) => { e.stopPropagation(); onDelete(node); }} className="p-2 text-red-500 hover:bg-red-500/20 rounded-full transition-colors" title="Delete"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" /></svg></button>
                    </div>

                    {/* Mobile Kebab Menu */}
                    <div className="sm:hidden relative" ref={menuRef}>
                        <button onClick={(e) => { e.stopPropagation(); setIsMenuOpen(!isMenuOpen); }} className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-500/20 rounded-full">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" /></svg>
                        </button>
                        {isMenuOpen && (
                            <div className="absolute right-0 mt-2 w-40 bg-white/80 dark:bg-gray-800/90 backdrop-blur-lg rounded-md shadow-lg z-50 border border-white/20">
                                <ul className="py-1 text-slate-800 dark:text-gray-200">
                                    {isSummarizable && (
                                        <li><button onClick={(e) => { e.stopPropagation(); onSummarize(node); setIsMenuOpen(false); }} className="w-full text-left px-4 py-2 text-sm hover:bg-purple-500/20 flex items-center gap-3"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-500" viewBox="0 0 20 20" fill="currentColor"><path d="M11.983 1.905a2.5 2.5 0 00-4.012.138l-2.052 3.553a2.5 2.5 0 004.012-.138l-2.052-3.553zM10 12a2 2 0 100-4 2 2 0 000 4zM2 11a1 1 0 011-1h2.586a1 1 0 110 2H3a1 1 0 01-1-1zm15 0a1 1 0 01-1 1h-2.586a1 1 0 110-2H17a1 1 0 011 1zM7 2.5a1 1 0 011-1h2a1 1 0 110 2H8a1 1 0 01-1-1zM7 17.5a1 1 0 011-1h2a1 1 0 110 2H8a1 1 0 01-1-1z"/></svg> Summarize</button></li>
                                    )}
                                    <li><button onClick={(e) => { e.stopPropagation(); onRename(node); setIsMenuOpen(false); }} className="w-full text-left px-4 py-2 text-sm hover:bg-sky-500/20 flex items-center gap-3"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-sky-500" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg> Rename</button></li>
                                    <li><button onClick={(e) => { e.stopPropagation(); onDelete(node); setIsMenuOpen(false); }} className="w-full text-left px-4 py-2 text-sm hover:bg-red-500/20 flex items-center gap-3 text-red-500"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" /></svg> Delete</button></li>
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </li>
    );
};


const FileList: React.FC<FileListProps> = ({ nodes, isAdmin, basePath, selectedIds, onToggleSelect }) => {
    const [nodeToRename, setNodeToRename] = useState<FileSystemNode | null>(null);
    const [nodeToDelete, setNodeToDelete] = useState<FileSystemNode | null>(null);
    const [nodeToSummarize, setNodeToSummarize] = useState<FileSystemNode | null>(null);
    const [nodeToPreview, setNodeToPreview] = useState<FileSystemNode | null>(null);

    if (nodes.length === 0) {
        return (
            <div className="text-center py-12 bg-white/10 dark:bg-gray-800/20 backdrop-blur-sm rounded-xl">
                <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>
                <h3 className="mt-2 text-sm font-medium text-slate-800 dark:text-gray-200">This folder is empty</h3>
                <p className="mt-1 text-sm text-slate-600 dark:text-gray-400">{isAdmin ? 'Upload a file or create a new folder to get started.' : 'There are no files or folders here.'}</p>
            </div>
        )
    }

    return (
        <>
            <ul className="space-y-3">
                {nodes.map((node) => (
                    <NodeItem 
                        key={node.id} 
                        node={node} 
                        isAdmin={isAdmin} 
                        basePath={basePath} 
                        isSelected={selectedIds?.has(node.id)}
                        onToggleSelect={onToggleSelect}
                        onRename={setNodeToRename}
                        onDelete={setNodeToDelete}
                        onSummarize={setNodeToSummarize}
                        onPreview={setNodeToPreview}
                    />
                ))}
            </ul>
            {nodeToRename && <RenameModal node={nodeToRename} onClose={() => setNodeToRename(null)} />}
            {nodeToDelete && <DeleteConfirmModal node={nodeToDelete} onClose={() => setNodeToDelete(null)} />}
            {nodeToSummarize && <SummarizeModal node={nodeToSummarize} onClose={() => setNodeToSummarize(null)} />}
            {nodeToPreview && <PreviewModal node={nodeToPreview} isAdmin={isAdmin} onClose={() => setNodeToPreview(null)} />}
        </>
    );
};

export default FileList;
