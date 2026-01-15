import React, { useState, useEffect, useRef } from 'react';
import { GlassCard } from '../components/GlassCard';
import { convertBase } from '../utils/converter';
import { getCookie, setCookie, storage } from '../utils/storage';
import { Trophy, Check, RefreshCcw, Flame, ArrowRight } from 'lucide-react';

type Difficulty = 'Novice' | 'Adept' | 'Master';

interface Question {
  value: string;
  fromBase: number;
  toBase: number;
}

export const Quiz: React.FC = () => {
  const [difficulty, setDifficulty] = useState<Difficulty>('Novice');
  const [question, setQuestion] = useState<Question | null>(null);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [username, setUsername] = useState('');

  const inputRef = useRef<HTMLInputElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Load User Data
    const user = getCookie('mns_username');
    const savedStreak = parseInt(getCookie('mns_streak') || '0');
    
    if (user) setUsername(user);
    setBestStreak(savedStreak);
    
    generateQuestion();

    return () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  // Auto-focus input when question changes or feedback is cleared
  useEffect(() => {
    if (!feedback && inputRef.current) {
        // Small delay to ensure render is complete and transition isn't blocking
        setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [question, feedback]);

  const generateQuestion = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    let bases = [10, 2];
    let maxVal = 31;

    if (difficulty === 'Adept') {
      bases = [10, 2, 8];
      maxVal = 63;
    } else if (difficulty === 'Master') {
      bases = [10, 2, 8, 16];
      maxVal = 255;
    }

    const fromBase = bases[Math.floor(Math.random() * bases.length)];
    let toBase = bases[Math.floor(Math.random() * bases.length)];
    while (toBase === fromBase) {
      toBase = bases[Math.floor(Math.random() * bases.length)];
    }

    const valDec = Math.floor(Math.random() * maxVal);
    const valStr = valDec.toString(fromBase).toUpperCase();

    // Avoid exact duplicate of previous question immediately
    setQuestion((prev) => {
        if (prev && prev.value === valStr && prev.fromBase === fromBase && prev.toBase === toBase) {
            // Simple perturbation to ensure difference
            const newValDec = (valDec + 1) % maxVal;
            return {
                 value: newValDec.toString(fromBase).toUpperCase(),
                 fromBase,
                 toBase
            };
        }
        return { value: valStr, fromBase, toBase };
    });

    setAnswer('');
    setFeedback(null);
  };

  useEffect(() => {
    setStreak(0);
    generateQuestion();
  }, [difficulty]);

  const getMultiplier = (level: Difficulty) => {
    switch (level) {
        case 'Novice': return 2;
        case 'Adept': return 5;
        case 'Master': return 10;
        default: return 2;
    }
  };

  const checkAnswer = () => {
    if (!question) return;
    const correctAnswer = convertBase(question.value, question.fromBase, question.toBase);
    
    const normalizedUser = answer.trim().toUpperCase().replace(/^0+/, '') || '0';
    const normalizedCorrect = correctAnswer.replace(/^0+/, '') || '0';

    if (normalizedUser === normalizedCorrect) {
      // Correct
      const newStreak = streak + 1;
      setFeedback('correct');
      setStreak(newStreak);
      
      // Calculate Weighted Score
      const points = newStreak * getMultiplier(difficulty);

      // Update personal best (Raw Streak)
      if (newStreak > bestStreak) {
        setBestStreak(newStreak);
        setCookie('mns_streak', newStreak.toString());
      }
      
      // Update Leaderboard (Weighted Points)
      const currentUser = username || getCookie('mns_username') || '';
      if (currentUser) {
          storage.saveScore(currentUser, points);
          if (!username) setUsername(currentUser);
      }

      // Auto Advance after delay
      timeoutRef.current = setTimeout(() => {
          generateQuestion();
      }, 1200);

    } else {
      // Wrong
      setFeedback('wrong');
      
      // Log the session result
      const currentUser = username || getCookie('mns_username') || '';
      
      if (currentUser && streak > 0) {
        const points = streak * getMultiplier(difficulty);
        storage.addLog(currentUser, 'Completed Quiz Streak', `Streak: ${streak} | Difficulty: ${difficulty} | Score: ${points}`);
        storage.saveScore(currentUser, points);
      }
      
      setStreak(0);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
        if (feedback === 'correct') {
            // User impatient, go next immediately
            generateQuestion();
        } else if (feedback === 'wrong') {
            // Allow user to skip/next on wrong
            generateQuestion();
        } else {
            checkAnswer();
        }
    }
  };

  const getBaseName = (b: number) => {
    switch(b) {
      case 2: return 'Binary';
      case 8: return 'Octal';
      case 10: return 'Decimal';
      case 16: return 'Hex';
      default: return `Base ${b}`;
    }
  };

  return (
    <div className="space-y-8 pt-4 pb-24 sm:pt-0">
      <header className="flex justify-between items-end">
        <div>
            <h1 className="text-4xl font-thin mb-2">Training</h1>
            <p className="text-blue-200/80 font-light">
                {username ? `Ready, ${username}?` : 'Test your skills'}
            </p>
        </div>
        <div className="text-right">
            <div className="text-xs text-gray-400 uppercase tracking-widest mb-1">Personal Best: {bestStreak}</div>
            <div className="text-3xl font-mono text-yellow-400 flex items-center justify-end gap-2">
                <Flame size={20} className={streak > 0 ? "text-orange-500 animate-pulse" : "text-gray-600"} />
                {streak}
            </div>
        </div>
      </header>

      {/* Difficulty Selector */}
      <div className="flex p-1 bg-white/5 rounded-2xl border border-white/10">
        {(['Novice', 'Adept', 'Master'] as Difficulty[]).map((level) => (
            <button
                key={level}
                onClick={() => setDifficulty(level)}
                className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                    difficulty === level 
                    ? 'bg-white/10 text-white shadow-lg border border-white/5' 
                    : 'text-gray-500 hover:text-gray-300'
                }`}
            >
                {level}
            </button>
        ))}
      </div>

      <GlassCard className={`transition-all duration-500 ${feedback === 'correct' ? 'border-green-500/30 bg-green-900/10' : feedback === 'wrong' ? 'border-red-500/30 bg-red-900/10' : ''}`}>
        {question && (
            <div className="text-center py-8">
                <p className="text-xs text-gray-500 uppercase tracking-widest mb-6">Convert this number</p>
                <div className="text-6xl font-thin mb-8 font-mono tracking-wider break-all">{question.value}</div>
                
                <div className="flex justify-center items-center gap-4 text-sm font-light text-gray-300">
                    <div className="flex flex-col items-center">
                        <span className="text-xs text-gray-500 mb-1">FROM</span>
                        <span className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 w-24">{getBaseName(question.fromBase)}</span>
                    </div>
                    <ArrowRight size={20} className="text-gray-600 mt-4"/>
                    <div className="flex flex-col items-center">
                        <span className="text-xs text-blue-400/70 mb-1">TO</span>
                        <span className="px-4 py-2 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-200 w-24">{getBaseName(question.toBase)}</span>
                    </div>
                </div>
            </div>
        )}

        <div className="mt-8 space-y-4">
            <input 
                ref={inputRef}
                type="text" 
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type answer..."
                autoComplete="off"
                className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-center text-2xl font-mono text-white placeholder-gray-700 focus:outline-none focus:border-blue-500/50 transition-all"
                disabled={feedback === 'correct'} // Disable input only when correct to prevent typing during auto-advance
            />
            
            {feedback === null ? (
                <button 
                    onClick={checkAnswer}
                    disabled={!answer}
                    className="w-full py-4 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/10 text-white font-medium tracking-wide transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Check Answer
                </button>
            ) : (
                <button 
                    onClick={generateQuestion}
                    className={`w-full py-4 rounded-2xl border font-medium tracking-wide transition-all flex items-center justify-center gap-2 animate-in fade-in zoom-in duration-300 ${
                        feedback === 'correct' 
                        ? 'bg-green-500/20 border-green-500/30 text-green-300 hover:bg-green-500/30' 
                        : 'bg-red-500/20 border-red-500/30 text-red-300 hover:bg-red-500/30'
                    }`}
                >
                    {feedback === 'correct' ? <><Check size={20}/> Correct! Next...</> : <><RefreshCcw size={20}/> Incorrect. Skip/Next</>}
                </button>
            )}
        </div>
      </GlassCard>
    </div>
  );
};
