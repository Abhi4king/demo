import React, { useEffect, useState } from 'react';
import { GlassCard } from '../components/GlassCard';
import { storage, subscribeToData, ScoreEntry } from '../utils/storage';
import { Trophy, Medal } from 'lucide-react';

export const Leaderboard: React.FC = () => {
  const [scores, setScores] = useState<ScoreEntry[]>([]);

  useEffect(() => {
    // Initial Load
    setScores(storage.getLeaderboard());

    // Subscribe to live updates (from sync or local saves)
    const unsubscribe = subscribeToData(() => {
        setScores(storage.getLeaderboard());
    });

    return unsubscribe;
  }, []);

  const getRankStyle = (index: number) => {
    switch (index) {
        case 0: return "text-yellow-400";
        case 1: return "text-gray-300";
        case 2: return "text-amber-600";
        default: return "text-gray-500";
    }
  };

  return (
    <div className="space-y-8 pt-4 pb-24 sm:pt-0">
      <header className="text-center">
        <h1 className="text-4xl font-thin mb-2 flex items-center justify-center gap-3">
            <Trophy className="text-yellow-500" />
            Leaderboard
        </h1>
        <p className="text-blue-200/80 font-light">Top 10 Performers</p>
      </header>

      <GlassCard className="p-0 overflow-hidden">
        {scores.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
                <p>No scores yet. Be the first!</p>
            </div>
        ) : (
            <div className="divide-y divide-white/5">
                <div className="grid grid-cols-4 p-4 text-xs uppercase tracking-widest text-gray-500 bg-white/5">
                    <div className="col-span-1 text-center">Rank</div>
                    <div className="col-span-2">User</div>
                    <div className="col-span-1 text-right">Score</div>
                </div>
                {scores.map((entry, index) => (
                    <div key={index} className="grid grid-cols-4 p-4 items-center hover:bg-white/5 transition-colors">
                        <div className={`col-span-1 text-center font-bold text-lg ${getRankStyle(index)}`}>
                            {index + 1}
                        </div>
                        <div className="col-span-2 flex items-center gap-2">
                             {index < 3 && <Medal size={14} className={getRankStyle(index)} />}
                             <span className="text-white font-medium">{entry.username}</span>
                        </div>
                        <div className="col-span-1 text-right font-mono text-xl text-blue-300">
                            {entry.score}
                        </div>
                    </div>
                ))}
            </div>
        )}
      </GlassCard>
    </div>
  );
};