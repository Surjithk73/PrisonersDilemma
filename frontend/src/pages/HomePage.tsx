import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SessionControlPanel from '@/components/SessionControlPanel';
import type { SessionConfig } from '@/types';

export default function HomePage() {
  const navigate = useNavigate();
  const [config, setConfig] = useState<SessionConfig>({
    participantName: '',
    participantAge: 0,
    strategyName: 'Tit for Tat',
    roundCount: 20,
    payoffT: 5,
    payoffR: 3,
    payoffP: 1,
    payoffS: 0,
    noiseProbability: 0
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setConfig(prev => ({
      ...prev,
      [name]: name === 'participantAge' ? Number(value) : value
    }));
  };

  const isValidMatrix = config.payoffT > config.payoffR && 
                        config.payoffR > config.payoffP && 
                        config.payoffP >= config.payoffS && 
                        config.payoffS >= 0 &&
                        config.payoffT > config.payoffP;

  const canStart = config.participantName.trim().length > 0 && config.participantAge > 0 && isValidMatrix;

  const handleStart = () => {
    if (canStart) {
      navigate('/game', { state: { config } });
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-10 py-12 px-4 sm:px-6">
      <div className="space-y-3 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">IPD Cognitive Lab</h1>
        <p className="text-lg text-neutral-400 max-w-xl mx-auto">
          Iterated Prisoner's Dilemma research platform. Enter your details to begin the session.
        </p>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 sm:p-8 shadow-xl">
        <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          Participant Details
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="sm:col-span-2 space-y-2">
            <label htmlFor="participantName" className="block text-sm font-medium text-neutral-300">Full Name</label>
            <input 
              id="participantName" 
              name="participantName" 
              value={config.participantName} 
              onChange={handleChange} 
              placeholder="e.g. Jane Doe" 
              className="w-full bg-neutral-950 border border-neutral-700 text-neutral-100 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-neutral-600"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="participantAge" className="block text-sm font-medium text-neutral-300">Age</label>
            <input 
              type="number" 
              id="participantAge" 
              name="participantAge" 
              value={config.participantAge || ''} 
              onChange={handleChange} 
              min={1} 
              placeholder="21" 
              className="w-full bg-neutral-950 border border-neutral-700 text-neutral-100 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-neutral-600"
            />
          </div>
        </div>
      </div>

      <SessionControlPanel config={config} setConfig={setConfig} />

      <div className="pt-4">
        <button 
          onClick={handleStart}
          disabled={!canStart}
          className={`w-full py-4 px-8 rounded-xl text-lg font-bold transition-all transform active:scale-[0.98] ${
            canStart 
              ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20' 
              : 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
          }`}
        >
          Begin Session
        </button>
        {!canStart && (
          <p className="text-center text-sm text-neutral-500 mt-3">
            Please enter your name, age, and ensure matrix settings are valid.
          </p>
        )}
      </div>
    </div>
  );
}
