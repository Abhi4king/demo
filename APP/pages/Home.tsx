import React, { useState, useEffect } from 'react';
import { GlassCard } from '../components/GlassCard';
import { convertBase } from '../utils/converter';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Home: React.FC = () => {
  const [values, setValues] = useState({
    decimal: '',
    binary: '',
    octal: '',
    hex: ''
  });

  const handleChange = (value: string, fromBase: number) => {
    // Prevent infinite loop if clearing inputs
    if (value === "") {
        setValues({ decimal: '', binary: '', octal: '', hex: '' });
        return;
    }

    setValues({
        decimal: fromBase === 10 ? value : convertBase(value, fromBase, 10),
        binary: fromBase === 2 ? value : convertBase(value, fromBase, 2),
        octal: fromBase === 8 ? value : convertBase(value, fromBase, 8),
        hex: fromBase === 16 ? value : convertBase(value, fromBase, 16),
    });
  };

  return (
    <div className="space-y-8 pt-4 pb-24 sm:pt-0">
      <div className="text-center space-y-2">
        <h1 className="text-5xl md:text-7xl font-thin tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-gray-400">
          Number Systems
        </h1>
        <p className="text-lg font-light text-blue-200/80">Master the language of computing</p>
      </div>

      {/* Universal Converter */}
      <GlassCard className="border-t border-t-blue-400/30 bg-gradient-to-b from-white/10 to-transparent">
        <div className="mb-6">
          <h2 className="text-2xl font-light">Universal Converter</h2>
          <p className="text-sm text-gray-400">Type in any field. Supports floating points (e.g., 12.5).</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputGroup 
            label="Decimal (Base 10)" 
            value={values.decimal} 
            onChange={(e) => handleChange(e.target.value, 10)} 
            placeholder="e.g. 127.5"
          />
          <InputGroup 
            label="Binary (Base 2)" 
            value={values.binary} 
            onChange={(e) => handleChange(e.target.value, 2)} 
            placeholder="e.g. 1010.1"
          />
          <InputGroup 
            label="Octal (Base 8)" 
            value={values.octal} 
            onChange={(e) => handleChange(e.target.value, 8)} 
            placeholder="e.g. 74.2"
          />
          <InputGroup 
            label="Hexadecimal (Base 16)" 
            value={values.hex} 
            onChange={(e) => handleChange(e.target.value, 16)} 
            placeholder="e.g. F3.A"
          />
        </div>
      </GlassCard>

      {/* Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link to="/decimal">
            <GlassCard className="h-full hover:scale-[1.02] active:scale-95 cursor-pointer group">
                <div className="flex justify-between items-center">
                    <span className="text-2xl font-thin">01. Decimal</span>
                    <ArrowRight className="opacity-0 group-hover:opacity-100 transition-opacity text-blue-300"/>
                </div>
                <p className="mt-2 text-gray-400 font-light text-sm">Base 10. The human standard.</p>
            </GlassCard>
        </Link>
        <Link to="/binary">
            <GlassCard className="h-full hover:scale-[1.02] active:scale-95 cursor-pointer group">
                <div className="flex justify-between items-center">
                    <span className="text-2xl font-thin">02. Binary</span>
                    <ArrowRight className="opacity-0 group-hover:opacity-100 transition-opacity text-teal-300"/>
                </div>
                <p className="mt-2 text-gray-400 font-light text-sm">Base 2. The machine language.</p>
            </GlassCard>
        </Link>
        <Link to="/octal">
            <GlassCard className="h-full hover:scale-[1.02] active:scale-95 cursor-pointer group">
                <div className="flex justify-between items-center">
                    <span className="text-2xl font-thin">03. Octal</span>
                    <ArrowRight className="opacity-0 group-hover:opacity-100 transition-opacity text-purple-300"/>
                </div>
                <p className="mt-2 text-gray-400 font-light text-sm">Base 8. Legacy computing shorthand.</p>
            </GlassCard>
        </Link>
        <Link to="/hexadecimal">
            <GlassCard className="h-full hover:scale-[1.02] active:scale-95 cursor-pointer group">
                <div className="flex justify-between items-center">
                    <span className="text-2xl font-thin">04. Hexadecimal</span>
                    <ArrowRight className="opacity-0 group-hover:opacity-100 transition-opacity text-pink-300"/>
                </div>
                <p className="mt-2 text-gray-400 font-light text-sm">Base 16. Modern memory addressing.</p>
            </GlassCard>
        </Link>
      </div>
    </div>
  );
};

const InputGroup = ({ label, value, onChange, placeholder }: { label: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, placeholder: string }) => (
  <div className="space-y-2">
    <label className="text-xs uppercase tracking-widest text-gray-400 ml-1">{label}</label>
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full bg-black/20 border border-white/10 rounded-2xl px-4 py-3 text-lg font-mono text-white placeholder-gray-600 focus:outline-none focus:border-blue-400/50 focus:bg-white/5 transition-all shadow-inner"
    />
  </div>
);