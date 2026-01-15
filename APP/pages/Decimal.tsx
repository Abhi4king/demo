import React from 'react';
import { GlassCard } from '../components/GlassCard';

export const Decimal: React.FC = () => {
  return (
    <div className="space-y-8 pt-4 pb-24 sm:pt-0">
      <header>
        <h1 className="text-4xl font-thin mb-2">Decimal System</h1>
        <div className="inline-block px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs tracking-wider border border-blue-500/30">
          BASE 10
        </div>
      </header>

      <div className="grid md:grid-cols-2 gap-6">
        <GlassCard title="Definition">
          <p className="font-light text-gray-300 leading-relaxed">
            The decimal number system is derived from the Greek word <strong className="text-white">"DEKA"</strong> (meaning 10). 
            It is the system we use in our daily lives, containing 10 unique symbols:
          </p>
          <div className="flex gap-2 mt-4 text-2xl font-mono text-blue-200 justify-center flex-wrap">
            {[0,1,2,3,4,5,6,7,8,9].map(n => <span key={n} className="p-2 bg-white/5 rounded-lg">{n}</span>)}
          </div>
        </GlassCard>

        <GlassCard title="Position Weights">
          <p className="text-sm text-gray-400 mb-4">
            In any number system, the value depends on the position. For Base 10, weights are powers of 10.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-center border-collapse">
              <thead>
                <tr className="text-gray-500 text-xs uppercase border-b border-white/10">
                  <th className="pb-2">Position</th>
                  <th className="pb-2">Weight</th>
                  <th className="pb-2">Example (345)</th>
                </tr>
              </thead>
              <tbody className="font-mono text-sm">
                <tr className="border-b border-white/5">
                  <td className="py-2">2 (Hundreds)</td>
                  <td className="text-blue-300">10<sup>2</sup> = 100</td>
                  <td>3 × 100 = 300</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-2">1 (Tens)</td>
                  <td className="text-blue-300">10<sup>1</sup> = 10</td>
                  <td>4 × 10 = 40</td>
                </tr>
                <tr>
                  <td className="py-2">0 (Units)</td>
                  <td className="text-blue-300">10<sup>0</sup> = 1</td>
                  <td>5 × 1 = 5</td>
                </tr>
              </tbody>
            </table>
            <div className="mt-4 text-center font-bold text-xl border-t border-white/20 pt-2">
                Total = 345
            </div>
          </div>
        </GlassCard>
      </div>

      <GlassCard title="Floating Point Weights">
        <p className="mb-4 text-gray-300 font-light">
          For fractions, the weights become negative powers of 10, moving to the right of the decimal point.
        </p>
        <div className="flex justify-center items-center gap-1 font-mono text-lg flex-wrap">
          <div className="text-center">
            <div className="text-xs text-gray-500">10<sup>1</sup></div>
            <div className="p-2 border border-white/20 rounded">2</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-500">10<sup>0</sup></div>
            <div className="p-2 border border-white/20 rounded">5</div>
          </div>
          <div className="text-2xl pt-4">.</div>
          <div className="text-center">
            <div className="text-xs text-gray-500">10<sup>-1</sup></div>
            <div className="p-2 border border-yellow-500/30 rounded bg-yellow-500/10">1</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-500">10<sup>-2</sup></div>
            <div className="p-2 border border-yellow-500/30 rounded bg-yellow-500/10">2</div>
          </div>
        </div>
        <p className="text-center mt-4 text-sm text-gray-400">
            25.12 = (2 × 10) + (5 × 1) + (1 × 0.1) + (2 × 0.01)
        </p>
      </GlassCard>
    </div>
  );
};