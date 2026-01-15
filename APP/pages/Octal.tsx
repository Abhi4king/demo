import React from 'react';
import { GlassCard } from '../components/GlassCard';

export const Octal: React.FC = () => {
  return (
    <div className="space-y-8 pt-4 pb-24 sm:pt-0">
      <header>
        <h1 className="text-4xl font-thin mb-2">Octal System</h1>
        <div className="inline-block px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs tracking-wider border border-purple-500/30">
          BASE 8
        </div>
      </header>

      <div className="grid md:grid-cols-2 gap-6">
        <GlassCard title="Definition">
            <p className="font-light text-gray-300">
                Derived from "Octet" (Eight). It uses digits <span className="font-mono text-purple-300">0-7</span>. 
                Often used in legacy computing systems (like PDP-8) and Unix file permissions.
            </p>
        </GlassCard>

        <GlassCard title="Octal Dabble">
            <p className="font-light text-gray-300 text-sm">
                Similar to binary, but divide by 8 for integers and multiply by 8 for fractions.
            </p>
            <div className="mt-4 p-3 bg-white/5 rounded-lg border border-white/10 font-mono text-sm">
                <div>(127)<sub>10</sub> → (?)<sub>8</sub></div>
                <div className="my-2 border-l-2 border-purple-500 pl-3">
                    <div>127 / 8 = 15, rem <span className="text-purple-300">7</span></div>
                    <div>15 / 8 = 1, rem <span className="text-purple-300">7</span></div>
                    <div>1 / 8 = 0, rem <span className="text-purple-300">1</span></div>
                </div>
                <div>Result: 177<sub>8</sub></div>
            </div>
        </GlassCard>
      </div>

      <GlassCard title="The Grouping Method (Binary to Octal)">
        <p className="mb-6 font-light text-gray-300">
            Group binary bits into sets of <strong className="text-white">3</strong> starting from the binary point.
            <br/><span className="text-xs text-gray-400">Because 2<sup>3</sup> = 8.</span>
        </p>

        <div className="flex flex-col items-center space-y-4">
            <div className="text-xs text-gray-500 uppercase tracking-widest">Binary Number</div>
            <div className="flex gap-1 font-mono text-xl">
                <div className="flex flex-col items-center p-2 bg-purple-900/30 rounded border border-purple-500/30">
                    <span>101</span>
                    <span className="text-xs text-purple-300 mt-1 border-t border-purple-500/30 pt-1 w-full text-center">5</span>
                </div>
                <div className="flex flex-col items-center p-2 bg-purple-900/30 rounded border border-purple-500/30">
                    <span>010</span>
                    <span className="text-xs text-purple-300 mt-1 border-t border-purple-500/30 pt-1 w-full text-center">2</span>
                </div>
                <div className="self-center text-2xl px-1">.</div>
                <div className="flex flex-col items-center p-2 bg-purple-900/30 rounded border border-purple-500/30">
                    <span>110</span>
                    <span className="text-xs text-purple-300 mt-1 border-t border-purple-500/30 pt-1 w-full text-center">6</span>
                </div>
            </div>
            <div className="text-xs text-gray-500 uppercase tracking-widest mt-4">Octal Result: 52.6</div>
        </div>
      </GlassCard>
    </div>
  );
};