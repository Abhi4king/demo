import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Hash, Binary, Grip, Hexagon, Trophy, Crown } from 'lucide-react';

export const Navigation: React.FC = () => {
  const navItems = [
    { name: 'Hub', path: '/', icon: <Home size={18} /> },
    { name: 'Decimal', path: '/decimal', icon: <Hash size={18} /> },
    { name: 'Binary', path: '/binary', icon: <Binary size={18} /> },
    { name: 'Octal', path: '/octal', icon: <Grip size={18} /> },
    { name: 'Hex', path: '/hexadecimal', icon: <Hexagon size={18} /> },
    { name: 'Quiz', path: '/quiz', icon: <Trophy size={18} /> },
    { name: 'Ranks', path: '/leaderboard', icon: <Crown size={18} /> },
  ];

  return (
    <nav className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 w-[98%] max-w-lg sm:top-6 sm:bottom-auto">
      <div className="flex justify-between items-center bg-black/40 backdrop-blur-2xl border border-white/10 rounded-full px-2 py-3 shadow-2xl overflow-x-auto no-scrollbar">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex flex-col items-center justify-center min-w-[3rem] h-10 sm:w-12 sm:h-12 rounded-full transition-all duration-300 mx-1
              ${isActive 
                ? 'bg-white text-black shadow-lg shadow-white/20 scale-110' 
                : 'text-gray-400 hover:text-white hover:bg-white/10'}
            `}
          >
            {item.icon}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};