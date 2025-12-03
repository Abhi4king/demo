
import React from 'react';
import { FileSystemNode, FileType } from '../../data/types';
import FileIcon from '../FileIcon';
import { useToast } from '../../context/ToastContext';

interface PreviewModalProps {
  node: FileSystemNode;
  onClose: () => void;
  isAdmin: boolean;
}

const extractGoogleDriveIdFromUrl = (url: string): string | null => {
    const regexes = [
        /\/file\/d\/([a-zA-Z0-9_-]+)/, // For /preview URLs
        /id=([a-zA-Z0-9_-]+)/,        // For /uc URLs
    ];
    for (const regex of regexes) {
        const match = url.match(regex);
        if (match && match[1]) {
            return match[1];
        }
    }
    return null;
};

const PreviewModal: React.FC<PreviewModalProps> = ({ node, onClose, isAdmin }) => {
  const { showToast } = useToast();

  const handleDownload = () => {
    const link = document.createElement('a');
    
    if (node.url?.includes('drive.google.com')) {
        const driveId = extractGoogleDriveIdFromUrl(node.url);
        if (driveId) {
            // Construct a direct download link
            link.href = `https://drive.google.com/uc?export=download&id=${driveId}`;
            link.download = node.name;
        } else {
            // Fallback to opening in a new tab if ID extraction fails
            link.href = node.url;
            link.target = '_blank';
        }
    } else {
        link.href = node.url!;
        link.download = node.name;
    }
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Downloading "${node.name}"...`);
  };
  
  const formatFileSize = (bytes?: number) => {
    if (!bytes || bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const renderPreviewContent = () => {
    const isDataUrl = node.url?.startsWith('data:');
    const isGoogleDrive = node.url?.includes('drive.google.com');

    if (isGoogleDrive) {
        // The /preview URL works for all file types (docs, sheets, images, etc.) and provides a consistent UI.
        return <iframe src={node.url} title={node.name} className="w-full h-full border-0 bg-white" />;
    }

    if (node.fileType === FileType.PDF) {
      return (
        <object data={node.url} type="application/pdf" className="w-full h-full bg-white">
          <div className="flex flex-col items-center justify-center h-full text-center p-8 bg-black/10 rounded-lg">
            <div className="flex justify-center mb-4">
              <FileIcon nodeType={node.type} fileType={node.fileType} />
            </div>
            <h3 className="text-lg font-medium text-slate-800 dark:text-white">PDF preview failed to load.</h3>
            <p className="text-sm text-slate-800 dark:text-gray-400">Your browser may not support embedding this PDF.</p>
            {isAdmin && (
                <button onClick={handleDownload} className="mt-4 px-4 py-2 text-sm bg-sky-600 text-white rounded-md hover:bg-sky-700">
                    Download PDF
                </button>
            )}
          </div>
        </object>
      );
    }
    
    if (isDataUrl) {
       if (node.fileType === FileType.IMG) {
        return <img src={node.url} alt={node.name} className="max-w-full max-h-full object-contain rounded-lg" />;
      }
      return (
        <div className="text-center p-8 bg-black/10 rounded-lg">
          <div className="flex justify-center mb-4">
            <FileIcon nodeType={node.type} fileType={node.fileType} />
          </div>
          <h3 className="text-lg font-medium text-slate-800 dark:text-white">Live preview unavailable</h3>
          <p className="text-sm text-slate-800 dark:text-gray-400">Previews for uploaded document files are not supported.</p>
          {isAdmin && (
            <button onClick={handleDownload} className="mt-4 px-4 py-2 text-sm bg-sky-600 text-white rounded-md hover:bg-sky-700">
                Download to view
            </button>
          )}
        </div>
      );
    }
  
    switch (node.fileType) {
      case FileType.IMG:
        return <img src={node.url} alt={node.name} className="max-w-full max-h-full object-contain rounded-lg" />;
      
      case FileType.DOCX:
      case FileType.XLSX:
      case FileType.PPT:
        const viewerUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(node.url!)}`;
        return <iframe src={viewerUrl} title={node.name} className="w-full h-full border-0 bg-white" />;

      default:
        return (
          <div className="text-center p-8 bg-black/10 rounded-lg">
            <div className="flex justify-center mb-4">
              <FileIcon nodeType={node.type} fileType={node.fileType} />
            </div>
            <h3 className="text-lg font-medium text-slate-800 dark:text-white">No preview available</h3>
            <p className="text-sm text-slate-800 dark:text-gray-400">Preview is not supported for .{node.fileType} files.</p>
          </div>
        );
    }
  };

  const isFullBleedPreview = 
      node.url?.includes('drive.google.com') ||
      node.fileType === FileType.PDF ||
      (!node.url?.startsWith('data:') && !node.url?.includes('drive.google.com') && [FileType.DOCX, FileType.XLSX, FileType.PPT].includes(node.fileType!));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white/10 dark:bg-gray-900/50 backdrop-blur-2xl rounded-2xl shadow-xl w-full max-w-4xl h-[90vh] m-4 border border-white/20 flex flex-col" onClick={(e) => e.stopPropagation()}>
        <header className="p-4 border-b border-white/20 flex justify-between items-center flex-shrink-0">
            <div className="flex items-center gap-3 min-w-0">
                <FileIcon nodeType={node.type} fileType={node.fileType} />
                <div className="min-w-0">
                    <h2 className="text-lg font-bold truncate text-slate-800 dark:text-white">{node.name}</h2>
                    <p className="text-xs text-slate-800 dark:text-gray-400">{formatFileSize(node.size)}</p>
                </div>
            </div>
            <div className="flex items-center gap-2">
                {isAdmin && (
                    <button
                        onClick={handleDownload}
                        className="flex items-center gap-2 px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                        Download
                    </button>
                )}
                 <button onClick={onClose} className="p-2 rounded-full text-slate-800 dark:text-gray-400 hover:bg-gray-500/20">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            </div>
        </header>
        <div className={`flex-1 min-h-0 bg-black/20 dark:bg-black/30 ${isFullBleedPreview ? '' : 'p-4 flex items-center justify-center'}`}>
            {renderPreviewContent()}
        </div>
      </div>
    </div>
  );
};

export default PreviewModal;
