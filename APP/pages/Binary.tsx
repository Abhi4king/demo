import React from 'react';
import { GlassCard } from '../components/GlassCard';

export const Binary: React.FC = () => {
  return (
    <div className="space-y-8 pt-4 pb-24 sm:pt-0">
      <header>
        <h1 className="text-4xl font-thin mb-2">Binary System</h1>
        <div className="inline-block px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs tracking-wider border border-teal-500/30">
          BASE 2
        </div>
      </header>

      <GlassCard title="Definition">
         <p className="font-light text-gray-300">
            Derived from the word <strong className="text-white">"Bi"</strong> (meaning two). 
            This is the language of computers, using only two states: <span className="font-mono text-teal-300">0</span> (Off) and <span className="font-mono text-teal-300">1</span> (On).
         </p>
      </GlassCard>

      <div className="grid md:grid-cols-2 gap-6">
        <GlassCard title="Powers of 2 (The Table)">
            <div className="overflow-x-auto">
                <table className="w-full text-center">
                    <thead>
                        <tr className="text-teal-400 text-xs uppercase border-b border-white/10">
                            <th className="py-2">Power</th>
                            <th className="py-2">Value</th>
                        </tr>
                    </thead>
                    <tbody className="font-mono text-sm">
                        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(p => (
                            <tr key={p} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                <td className="py-2 text-gray-400">2<sup>{p}</sup></td>
                                <td className="py-2 text-white">{Math.pow(2, p)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </GlassCard>

        <GlassCard title="Double Dabble (Integer)">
            <p className="text-sm text-gray-400 mb-4">
                To convert Decimal to Binary (Integer), repeatedly divide by 2 and record the remainder. Read from <strong className="text-white">Bottom to Top</strong>.
            </p>
            <div className="bg-black/30 rounded-xl p-4 font-mono text-sm">
                <p className="text-xs text-gray-500 mb-2">Example: 13 to Binary</p>
                <div className="grid grid-cols-3 gap-y-2 border-b border-white/10 pb-2 mb-2">
                    <span>Div</span>
                    <span>Quotient</span>
                    <span className="text-teal-300">Rem</span>
                </div>
                <div className="grid grid-cols-3 gap-y-2">
                    <span>13 / 2</span><span>6</span><span className="text-teal-300">1</span>
                    <span>6 / 2</span><span>3</span><span className="text-teal-300">0</span>
                    <span>3 / 2</span><span>1</span><span className="text-teal-300">1</span>
                    <span>1 / 2</span><span>0</span><span className="text-teal-300">1</span>
                </div>
                <div className="mt-4 pt-2 border-t border-white/10 text-right text-teal-300 text-lg">
                    Result: 1101
                </div>
            </div>
        </GlassCard>
      </div>

      <GlassCard title="Fractional Part Conversion">
        <p className="font-light text-gray-300 mb-4">
            Multiply the fractional part by 2. Record the integer part as the carry. Repeat with the new fraction. Read from <strong className="text-white">Top to Bottom</strong>.
        </p>
        <div className="bg-black/30 rounded-xl p-4 font-mono text-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-transparent via-teal-500 to-transparent opacity-50"></div>
             <p className="text-xs text-gray-500 mb-2">Example: 0.625 to Binary</p>
             <div className="space-y-2">
                <div className="flex justify-between border-b border-white/5 pb-1">
                    <span>0.625 × 2 = 1.25</span>
                    <span className="text-teal-300 font-bold">1</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-1">
                    <span>0.25 × 2 = 0.50</span>
                    <span className="text-teal-300 font-bold">0</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-1">
                    <span>0.50 × 2 = 1.00</span>
                    <span className="text-teal-300 font-bold">1</span>
                </div>
             </div>
             <div className="mt-4 text-right">
                Result: <span className="text-teal-300">.101</span>
             </div>
        </div>
      </GlassCard>
    </div>
  );
};