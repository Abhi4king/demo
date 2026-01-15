import React from 'react';
import { GlassCard } from '../components/GlassCard';

export const Hexadecimal: React.FC = () => {
  const hexMap = [
    { hex: '0', bin: '0000', dec: '0' },
    { hex: '1', bin: '0001', dec: '1' },
    { hex: '2', bin: '0010', dec: '2' },
    { hex: '3', bin: '0011', dec: '3' },
    { hex: '4', bin: '0100', dec: '4' },
    { hex: '5', bin: '0101', dec: '5' },
    { hex: '6', bin: '0110', dec: '6' },
    { hex: '7', bin: '0111', dec: '7' },
    { hex: '8', bin: '1000', dec: '8' },
    { hex: '9', bin: '1001', dec: '9' },
    { hex: 'A', bin: '1010', dec: '10' },
    { hex: 'B', bin: '1011', dec: '11' },
    { hex: 'C', bin: '1100', dec: '12' },
    { hex: 'D', bin: '1101', dec: '13' },
    { hex: 'E', bin: '1110', dec: '14' },
    { hex: 'F', bin: '1111', dec: '15' },
  ];

  return (
    <div className="space-y-8 pt-4 pb-24 sm:pt-0">
      <header>
        <h1 className="text-4xl font-thin mb-2">Hexadecimal</h1>
        <div className="inline-block px-3 py-1 rounded-full bg-pink-500/20 text-pink-300 text-xs tracking-wider border border-pink-500/30">
          BASE 16
        </div>
      </header>

      <GlassCard title="Definition">
         <p className="font-light text-gray-300">
            Derived from "Hexa" (Six) and "Deka" (Ten). It uses digits <span className="font-mono text-pink-300">0-9</span> and letters <span className="font-mono text-pink-300">A-F</span>.
            Crucial for representing binary data compactly (e.g., color codes #FFFFFF).
         </p>
      </GlassCard>

      <div className="grid lg:grid-cols-2 gap-6">
        <GlassCard title="Reference Table" className="max-h-96 overflow-y-auto">
            <table className="w-full text-center text-sm">
                <thead className="sticky top-0 bg-black/80 backdrop-blur-md">
                    <tr className="text-pink-400 border-b border-white/20">
                        <th className="py-2">Hex</th>
                        <th>Binary (4-bit)</th>
                        <th>Decimal</th>
                    </tr>
                </thead>
                <tbody className="font-mono">
                    {hexMap.map((row) => (
                        <tr key={row.hex} className="border-b border-white/5 hover:bg-white/10">
                            <td className="py-2 font-bold text-pink-200">{row.hex}</td>
                            <td className="text-gray-400">{row.bin}</td>
                            <td className="text-gray-500">{row.dec}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </GlassCard>

        <div className="space-y-6">
            <GlassCard title="Grouping (4 Bits)">
                <p className="text-sm text-gray-300 mb-4">
                    Convert Binary to Hex by grouping bits into sets of <strong className="text-white">4</strong>.
                    <br/><span className="text-xs text-gray-500">2<sup>4</sup> = 16.</span>
                </p>
                <div className="flex flex-wrap gap-2 justify-center font-mono">
                    <div className="text-center p-2 bg-pink-900/20 rounded border border-pink-500/20">
                        <div className="text-gray-400">1011</div>
                        <div className="font-bold text-pink-300 pt-1 border-t border-pink-500/20 mt-1">B</div>
                    </div>
                    <div className="text-center p-2 bg-pink-900/20 rounded border border-pink-500/20">
                        <div className="text-gray-400">0101</div>
                        <div className="font-bold text-pink-300 pt-1 border-t border-pink-500/20 mt-1">5</div>
                    </div>
                </div>
                <div className="text-center mt-2 text-xs text-gray-500">Result: B5</div>
            </GlassCard>

            <GlassCard title="Hexa Dabble">
                <p className="text-sm text-gray-300 mb-2">
                    Divide Decimal by 16. Convert remainders &gt; 9 to letters.
                </p>
                <div className="font-mono text-sm bg-black/40 p-3 rounded-xl border border-white/10">
                    <div className="flex justify-between items-center mb-1">
                        <span>453 / 16 = 28</span>
                        <span className="text-pink-300">rem 5</span>
                    </div>
                    <div className="flex justify-between items-center mb-1">
                        <span>28 / 16 = 1</span>
                        <span className="text-pink-300">rem 12 (C)</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span>1 / 16 = 0</span>
                        <span className="text-pink-300">rem 1</span>
                    </div>
                    <div className="text-right mt-2 pt-2 border-t border-white/10 font-bold">
                        Result: 1C5
                    </div>
                </div>
            </GlassCard>
        </div>
      </div>
    </div>
  );
};