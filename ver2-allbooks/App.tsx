
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { FileProvider, useFiles } from './context/FileContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { ToastProvider, ToastContainer } from './context/ToastContext';
import PublicView from './pages/PublicView';
import AdminView from './pages/AdminView';
import Login from './pages/Login';
import Header from './components/Header';
import Footer from './components/Footer';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const FullScreenLoader: React.FC = () => (
  <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="flex flex-col items-center gap-4">
          <svg className="animate-spin h-10 w-10 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-white font-medium">Loading documents...</p>
      </div>
  </div>
);


const AppContent: React.FC = () => {
  const { theme } = useTheme();
  const { isLoading } = useFiles();

  if (isLoading) {
    return (
       <div className={`min-h-screen ${theme === 'light' ? 'bg-gradient-to-br from-sky-200 to-violet-200' : 'bg-gradient-to-br from-gray-900 via-purple-900 to-black'}`}>
         <FullScreenLoader />
       </div>
    );
  }

  return (
     <div className={`min-h-screen flex flex-col text-slate-800 dark:text-gray-100 transition-colors duration-500 ${theme === 'light' ? 'bg-gradient-to-br from-sky-200 to-violet-200' : 'bg-gradient-to-br from-gray-900 via-purple-900 to-black'}`}>
      <HashRouter>
          <Header />
          <main className="container mx-auto p-4 md:p-6 flex-grow">
            <Routes>
              <Route path="/*" element={<PublicView />} />
              <Route path="/login" element={<Login />} />
              <Route
                path="/admin/*"
                element={
                  <ProtectedRoute>
                    <AdminView />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
          <Footer />
      </HashRouter>
      <ToastContainer />
    </div>
  )
}


function App() {
  return (
    <AuthProvider>
      <FileProvider>
        <ThemeProvider>
          <ToastProvider>
           <AppContent />
          </ToastProvider>
        </ThemeProvider>
      </FileProvider>
    </AuthProvider>
  );
}

export default App;