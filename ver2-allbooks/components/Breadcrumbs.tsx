import React from 'react';
import { Link } from 'react-router-dom';
import { FileSystemNode } from '../data/types';

interface BreadcrumbsProps {
  path: FileSystemNode[];
  basePath: string;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ path, basePath }) => {
  return (
    <nav className="inline-block mt-2 bg-white/10 dark:bg-gray-900/20 backdrop-blur-sm rounded-full px-4 py-2 border border-white/10" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-2 text-sm text-slate-800 dark:text-gray-300">
        <li className="inline-flex items-center">
          <Link to={basePath} className="inline-flex items-center font-medium hover:text-sky-600 dark:hover:text-sky-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg>
            Root
          </Link>
        </li>
        {path.map((node, index) => {
          const linkPath = [basePath.replace(/\/$/, ''), node.id].join('/');
          return (
          <li key={node.id}>
            <div className="flex items-center">
              <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path></svg>
              {index === path.length - 1 ? (
                <span className="ml-1 font-medium text-slate-800 dark:text-gray-400">{node.name}</span>
              ) : (
                <Link to={linkPath} className="ml-1 font-medium hover:text-sky-600 dark:hover:text-sky-400">
                  {node.name}
                </Link>
              )}
            </div>
          </li>
        )})}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;