
import React, { useState, useCallback } from 'react';
import { generateSummary } from '../../services/geminiService';
import { FileSystemNode } from '../../data/types';
import { GEMINI_API_KEY } from '../../config';

interface SummarizeModalProps {
  node: FileSystemNode;
  onClose: () => void;
}

const SummarizeModal: React.FC<SummarizeModalProps> = ({ node, onClose }) => {
  const [text, setText] = useState('');
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSummarize = useCallback(async () => {
    if (!text.trim()) {
      setError('Please paste some content from the document to summarize.');
      return;
    }
    setError('');
    setIsLoading(true);
    setSummary('');

    const result = await generateSummary(text);
    setSummary(result);
    setIsLoading(false);
  }, [text]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white/10 dark:bg-gray-900/50 backdrop-blur-2xl rounded-2xl shadow-xl p-6 w-full max-w-2xl max-h-full overflow-y-auto border border-white/20">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">Summarize with Gemini</h2>
            <button onClick={onClose} className="text-slate-800 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
        </div>
        <p className="text-slate-800 dark:text-gray-300 mb-4">
          Paste content from <span className="font-semibold">{node.name}</span> below to generate a summary.
        </p>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste document text here..."
          className="w-full h-32 p-2 border border-white/20 rounded-md bg-white/20 dark:bg-gray-700/30 text-slate-800 dark:text-gray-200 resize-y focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
          disabled={isLoading}
        />
        {error && <p className="text-sm text-red-400 mt-2">{error}</p>}
        
        <div className="mt-4">
          <button
            onClick={handleSummarize}
            disabled={isLoading || !GEMINI_API_KEY}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-purple-400/50 dark:disabled:bg-purple-800/50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M11.983 1.905a2.5 2.5 0 00-4.012.138l-2.052 3.553a2.5 2.5 0 004.012-.138l-2.052-3.553zM10 12a2 2 0 100-4 2 2 0 000 4zM2 11a1 1 0 011-1h2.586a1 1 0 110 2H3a1 1 0 01-1-1zm15 0a1 1 0 01-1 1h-2.586a1 1 0 110-2H17a1 1 0 011 1zM7 2.5a1 1 0 011-1h2a1 1 0 110 2H8a1 1 0 01-1-1zM7 17.5a1 1 0 011-1h2a1 1 0 110 2H8a1 1 0 01-1-1z"/></svg>
            )}
            {isLoading ? 'Generating...' : 'Generate Summary'}
          </button>
          {!GEMINI_API_KEY && <p className="text-xs text-yellow-500 text-center mt-2">Note: GEMINI_API_KEY is not configured in config.ts. This feature is disabled.</p>}
        </div>

        {summary && (
          <div className="mt-6 p-4 bg-gray-500/20 dark:bg-gray-700/30 rounded-lg">
            <h3 className="font-semibold text-slate-800 dark:text-white mb-2">Summary:</h3>
            <div className="prose prose-sm dark:prose-invert max-w-none text-slate-800 dark:text-gray-300 whitespace-pre-wrap">{summary}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SummarizeModal;