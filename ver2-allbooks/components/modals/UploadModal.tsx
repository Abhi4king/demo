
import React, { useState, useCallback } from 'react';
import { useFiles } from '../../context/FileContext';
import { FileSystemNode, FileType, NodeType } from '../../data/types';

interface UploadModalProps {
  parentId: string | null;
  onClose: () => void;
}

const extractGoogleDriveId = (url: string): string | null => {
  let id: string | null = null;
  // Regular expression to find Google Drive file IDs in various URL formats.
  // It looks for a string of at least 25 alphanumeric characters, underscores, or hyphens.
  const regexes = [
    /drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]{25,})/,
    /drive\.google\.com\/open\?id=([a-zA-Z0-9_-]{25,})/,
    /drive\.google\.com\/uc\?id=([a-zA-Z0-9_-]{25,})/
  ];

  for (const regex of regexes) {
    const match = url.match(regex);
    if (match && match[1]) {
      id = match[1];
      break;
    }
  }
  
  return id;
};

const getFileTypeFromName = (name: string): FileType => {
    const extension = name.split('.').pop()?.toLowerCase();
    if (!extension) return FileType.UNKNOWN;

    switch (extension) {
    case 'pdf': return FileType.PDF;
    case 'docx': return FileType.DOCX;
    case 'xlsx': return FileType.XLSX;
    case 'pptx': return FileType.PPT;
    case 'png':
    case 'jpg':
    case 'jpeg':
    case 'gif':
    case 'webp':
        return FileType.IMG;
    default:
        return FileType.UNKNOWN;
    }
};

const UploadModal: React.FC<UploadModalProps> = ({ parentId, onClose }) => {
  const [fileUrl, setFileUrl] = useState('');
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState('');
  const { addNode } = useFiles();

  const handleAddLink = useCallback(() => {
    if (!fileUrl.trim() || !fileName.trim()) {
      setError('Please provide both a file URL and a file name.');
      return;
    }

    const fileType = getFileTypeFromName(fileName);
    if (fileType === FileType.UNKNOWN) {
        setError('Invalid or unsupported file type. Please provide a file name with a valid extension (e.g., .pdf, .docx, .jpg).');
        return;
    }

    let finalUrl = fileUrl.trim();
    const driveId = extractGoogleDriveId(finalUrl);

    if (driveId) {
      // Use the standard, reliable embeddable preview URL for Google Drive files.
      finalUrl = `https://drive.google.com/file/d/${driveId}/preview`;
    } else {
        // Validate generic URL
        try {
            new URL(finalUrl);
        } catch (_) {
            setError('Invalid URL provided.');
            return;
        }
    }

    const newNode: Omit<FileSystemNode, 'id'> = {
      name: fileName.trim(),
      type: NodeType.FILE,
      fileType: fileType,
      size: 0, // Size is unknown for linked files
      uploadDate: new Date(),
      url: finalUrl,
      parentId: parentId,
    };

    addNode(newNode);
    onClose();
  }, [fileUrl, fileName, addNode, onClose, parentId]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white/10 dark:bg-gray-900/50 backdrop-blur-2xl rounded-2xl shadow-xl p-6 w-full max-w-md m-4 border border-white/20">
        <h2 className="text-xl font-bold mb-4 text-slate-800 dark:text-white">Add File Link</h2>
        <div className="space-y-4">
           <div>
            <label htmlFor="fileName" className="block text-sm font-medium text-slate-800 dark:text-gray-300 mb-1">
              File Name (with extension)
            </label>
             <input
              id="fileName"
              type="text"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              placeholder="e.g., Annual Report.pdf"
              className="w-full px-3 py-2 border border-white/20 rounded-md bg-white/20 dark:bg-gray-700/30 text-slate-800 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500"
              autoFocus
            />
           </div>
           <div>
             <label htmlFor="fileUrl" className="block text-sm font-medium text-slate-800 dark:text-gray-300 mb-1">
              File URL
            </label>
            <input
              id="fileUrl"
              type="url"
              value={fileUrl}
              onChange={(e) => setFileUrl(e.target.value)}
              placeholder="https://example.com/file.pdf or Google Drive Link"
              className="w-full px-3 py-2 border border-white/20 rounded-md bg-white/20 dark:bg-gray-700/30 text-slate-800 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500"
            />
           </div>
        </div>

        {error && <p className="text-sm text-red-400 mt-3">{error}</p>}
        
        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500/30 text-slate-800 dark:bg-gray-600/50 dark:text-gray-200 rounded-md hover:bg-gray-500/50 dark:hover:bg-gray-500/60"
          >
            Cancel
          </button>
          <button
            onClick={handleAddLink}
            disabled={!fileUrl.trim() || !fileName.trim()}
            className="px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700 disabled:bg-sky-400/50 disabled:cursor-not-allowed"
          >
            Add Link
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadModal;
