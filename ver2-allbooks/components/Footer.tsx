import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-transparent text-center py-5 mt-auto">
      <div className="container mx-auto px-4 md:px-6">
        <p className="text-sm text-slate-600 dark:text-gray-400">
          Created with <span className="text-red-500">FUN</span> by Abhi <span className="text-red-500">J</span>aat, Sujal and Kuldeep
        </p>
      </div>
    </footer>
  );
};

export default Footer;