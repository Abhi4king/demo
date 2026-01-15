import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Decimal } from './pages/Decimal';
import { Binary } from './pages/Binary';
import { Octal } from './pages/Octal';
import { Hexadecimal } from './pages/Hexadecimal';
import { Quiz } from './pages/Quiz';
import { Leaderboard } from './pages/Leaderboard';
import { Admin } from './pages/Admin';

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/decimal" element={<Decimal />} />
          <Route path="/binary" element={<Binary />} />
          <Route path="/octal" element={<Octal />} />
          <Route path="/hexadecimal" element={<Hexadecimal />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;