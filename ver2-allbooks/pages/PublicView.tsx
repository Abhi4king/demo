
import React, { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useFiles } from '../context/FileContext';
import FileList from '../components/FileList';
import SearchBar from '../components/SearchBar';
import Breadcrumbs from '../components/Breadcrumbs';

const PublicView: React.FC = () => {
  const { '*': path = '' } = useParams();
  const folderId = path.split('/').pop() || null;

  const { getChildren, getPath } = useFiles();
  const [searchTerm, setSearchTerm] = useState('');
  
  const currentChildren = useMemo(() => getChildren(folderId), [getChildren, folderId]);
  const breadcrumbPath = useMemo(() => getPath(folderId), [getPath, folderId]);

  const filteredNodes = useMemo(() => {
    if (!searchTerm) return currentChildren;
    return currentChildren.filter((node) =>
      node.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [currentChildren, searchTerm]);

  return (
    <div className="space-y-6">
      <div className="text-center md:text-left">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white">
          Public Document Repository
        </h1>
        <p className="mt-2 text-slate-600 dark:text-gray-400 hidden md:block">
          Browse and download available files.
        </p>
      </div>
       <Breadcrumbs path={breadcrumbPath} basePath="/" />
      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <FileList nodes={filteredNodes} isAdmin={false} basePath="" />
    </div>
  );
};

export default PublicView;