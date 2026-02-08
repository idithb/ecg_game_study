
import React, { useState, useCallback } from 'react';
import { ActivityLevel, GameState, GamePhase } from './types';
import { DAILY_SCHEDULE, SCIENTIFIC_FACTS, MAX_ROUNDS } from './constants';
import ECGMonitor from './components/ECGMonitor';

const App: React.FC = () => {
  const [state, setState] = useState<GameState>({
    score: 0,
    currentRoundIndex: 0,
    phase: GamePhase.INTRO,
    feedback: {
      show: false,
      isCorrect: false,
      message: '',
    },
  });

  const currentEvent = DAILY_SCHEDULE[state.currentRoundIndex];

  const startGame = () => {
    setState(prev => ({ 
      ...prev, 
      phase: GamePhase.READY, 
      currentRoundIndex: 0, 
      score: 0 
    }));
    setTimeout(() => {
      setState(prev => ({ ...prev, phase: GamePhase.PLAYING }));
    }, 1800);
  };

  const handleChoice = (choice: ActivityLevel) => {
    if (state.feedback.show) return;

    const isCorrect = choice === currentEvent.activity;
    const fact = SCIENTIFIC_FACTS[currentEvent.activity] || '';
    
    setState(prev => ({
      ...prev,
      score: isCorrect ? prev.score + 10 : Math.max(0, prev.score - 5),
      feedback: {
        show: true,
        isCorrect,
        message: isCorrect 
          ? fact 
          : "לא בדיוק. שימו לב לקצב הלב - האם הוא מתאים לפעילות זו בשעה זו?"
      }
    }));

    const delay = isCorrect ? 4000 : 3000;

    setTimeout(() => {
      if (state.currentRoundIndex >= MAX_ROUNDS - 1 && isCorrect) {
        setState(prev => ({ ...prev, phase: GamePhase.FINISHED, feedback: { ...prev.feedback, show: false } }));
      } else if (isCorrect) {
        setState(prev => ({ 
          ...prev, 
          currentRoundIndex: prev.currentRoundIndex + 1,
          feedback: { ...prev.feedback, show: false } 
        }));
      } else {
        setState(prev => ({ ...prev, feedback: { ...prev.feedback, show: false } }));
      }
    }, delay);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-[#f0f7ff] text-slate-800 p-4 md:p-8 font-sans overflow-y-auto" dir="rtl">
      {/* Header */}
      <header className="w-full max-w-4xl flex justify-between items-center mb-8 pb-4 border-b border-blue-200 shrink-0">
        <div>
          <h1 className="text-2xl md:text-4xl font-black text-slate-800 tracking-tight">
            אתגר הדופק: <span className="text-blue-600">24 שעות</span>
          </h1>
          <p className="text-sm text-slate-500 font-medium">מעבדה וירטואלית: ניטור יממה בחיי אדם</p>
        </div>
        {state.phase === GamePhase.PLAYING && (
          <div className="flex gap-4">
            <div className="bg-white px-4 py-2 rounded-2xl border border-blue-100 shadow-sm flex flex-col items-center min-w-[80px]">
              <span className="text-[10px] uppercase text-slate-400 font-bold">שלב</span>
              <span className="text-xl font-mono text-slate-800">{state.currentRoundIndex + 1}/{MAX_ROUNDS}</span>
            </div>
            <div className="bg-white px-4 py-2 rounded-2xl border border-green-100 shadow-sm flex flex-col items-center min-w-[80px]">
              <span className="text-[10px] uppercase text-green-600 font-bold">ניקוד</span>
              <span className="text-xl font-mono text-slate-800">{state.score}</span>
            </div>
          </div>
        )}
      </header>

      {/* Main Game Area */}
      <div className="w-full max-w-4xl flex-1 flex flex-col items-center justify-center">
        
        {state.phase === GamePhase.INTRO && (
          <div className="bg-white p-8 md:p-12 rounded-[2rem] border border-blue-100 shadow-2xl w-full animate-fade-in">
            <h2 className="text-3xl font-black mb-6 text-slate-800 text-center">איך הלב מגיב ליום שלנו?</h2>
            <p className="text-center text-slate-600 mb-10 text-lg leading-relaxed">
              הלב משנה את הקצב שלו לאורך כל היממה בהתאם למאמץ ולבריאות שלנו. <br/>
              המטרה: לזהות מה האדם עושה ב-6 נקודות זמן ביום (24 שעות).
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {Object.values(ActivityLevel).map(level => (
                <div key={level} className="p-5 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow">
                  <span className="font-bold text-slate-700 text-lg">{level}</span>
                  <div className="h-20 w-full rounded-xl overflow-hidden border border-slate-300">
                    <ECGMonitor activity={level} height={100} showLabels={false} />
                  </div>
                </div>
              ))}
            </div>
            
            <button 
              onClick={startGame}
              className="w-full py-6 bg-blue-600 hover:bg-blue-700 text-white font-black text-2xl rounded-2xl transition-all shadow-lg active:scale-95"
            >
              בואו נתחיל את היום!
            </button>
          </div>
        )}

        {state.phase === GamePhase.READY && (
          <div className="flex-1 flex flex-col items-center justify-center animate-pulse">
            <h2 className="text-7xl md:text-9xl font-black text-blue-600 tracking-tighter drop-shadow-xl">מתחילים...</h2>
            <p className="text-2xl text-slate-400 mt-6 italic">השעה 02:00, הלילה בעיצומו</p>
          </div>
        )}

        {state.phase === GamePhase.PLAYING && (
          <div className="w-full flex flex-col gap-8 md:gap-10 animate-fade-in">
            <div className="text-center">
              <h3 className="text-2xl md:text-3xl font-black text-slate-800 mb-2">מה האדם עושה בשעה זו?</h3>
              <p className="text-slate-500 font-medium">בחנו את רצף הפעימות במוניטור</p>
            </div>

            <div className="w-full aspect-[16/9] md:aspect-[21/9] max-h-[440px]">
              <ECGMonitor 
                activity={currentEvent.activity} 
                timeLabel={currentEvent.time} 
              />
            </div>

            <div className="grid grid-cols-2 gap-6 pb-12">
              {Object.values(ActivityLevel).map((level) => (
                <button
                  key={level}
                  onClick={() => handleChoice(level)}
                  disabled={state.feedback.show}
                  className={`
                    py-6 md:py-10 rounded-3xl border-2 transition-all duration-300 font-black text-2xl shadow-sm
                    ${state.feedback.show && currentEvent.activity === level && state.feedback.isCorrect
                      ? 'bg-green-500 border-green-400 text-white scale-105 z-10 shadow-green-200 shadow-xl'
                      : 'bg-slate-200 border-slate-300 text-slate-700 hover:border-blue-400 hover:bg-blue-50 active:scale-95'
                    }
                    ${state.feedback.show && level !== currentEvent.activity ? 'opacity-30 blur-[1px]' : ''}
                  `}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>
        )}

        {state.phase === GamePhase.FINISHED && (
          <div className="bg-white p-10 md:p-16 rounded-[3rem] border border-blue-100 shadow-2xl w-full max-w-2xl text-center animate-fade-in">
            <div className="text-7xl mb-8">✨</div>
            <h2 className="text-5xl font-black mb-4 text-slate-800">היום הושלם!</h2>
            <p className="text-slate-500 text-xl mb-12 font-medium">ניתחתם בהצלחה את פעילות הלב לאורך יממה שלמה.</p>
            
            <div className="bg-blue-50 rounded-3xl p-8 mb-12 border border-blue-100 shadow-inner">
              <div className="text-sm text-blue-400 uppercase font-black mb-2 tracking-widest">הניקוד שצברת</div>
              <div className="text-8xl font-mono text-blue-600 font-black tracking-tighter">{state.score}</div>
            </div>

            <button 
              onClick={startGame}
              className="w-full py-6 bg-blue-600 hover:bg-blue-700 text-white font-black text-2xl rounded-2xl transition-all shadow-xl active:scale-95"
            >
              יום חדש
            </button>
          </div>
        )}
      </div>

      {/* Feedback Overlay */}
      {state.feedback.show && state.phase === GamePhase.PLAYING && (
        <div className="fixed inset-0 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm z-50 p-4">
          <div className={`
            max-w-lg w-full p-10 rounded-[2.5rem] border-8 shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] transform animate-bounce-in
            ${state.feedback.isCorrect ? 'bg-white border-green-500' : 'bg-white border-red-500'}
          `}>
            <div className="flex flex-col items-center text-center">
              <div className={`text-8xl mb-6 ${state.feedback.isCorrect ? 'text-green-500' : 'text-red-500'}`}>
                {state.feedback.isCorrect ? '✓' : '✗'}
              </div>
              <h2 className={`text-3xl font-black mb-6 ${state.feedback.isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                {state.feedback.isCorrect ? 'זיהוי נכון!' : 'נסו שוב...'}
              </h2>
              <p className="text-2xl text-slate-700 leading-relaxed font-bold">
                {state.feedback.message}
              </p>
              {state.feedback.isCorrect && (
                <div className="mt-10 pt-6 border-t border-slate-100 w-full text-lg text-slate-400 font-medium italic">
                  {state.currentRoundIndex < MAX_ROUNDS - 1 ? 'היום ממשיך לשעות הבאות...' : 'היום הגיע לסיומו...'}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes bounce-in {
          0% { transform: scale(0.3); opacity: 0; }
          50% { transform: scale(1.05); opacity: 1; }
          70% { transform: scale(0.9); }
          100% { transform: scale(1); }
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-bounce-in {
          animation: bounce-in 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default App;
