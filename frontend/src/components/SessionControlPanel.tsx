import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type { SessionConfig } from '@/types';

interface Props {
  config: SessionConfig;
  setConfig: React.Dispatch<React.SetStateAction<SessionConfig>>;
}

export const STRATEGIES = [
  'Tit for Tat', 'Generous Tit for Tat', 'Suspicious Tit for Tat', 'Two Tits for Tat',
  'Grim Trigger', 'Pavlov', 'Always Cooperate', 'Always Defect', 'Random',
  'Hard Joss', 'Soft Joss', 'Davis', 'Feld', 'Alternator', 'Go By Majority'
];

export default function SessionControlPanel({ config, setConfig }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setConfig(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));
  };

  const isValidMatrix = config.payoffT > config.payoffR && 
                        config.payoffR > config.payoffP && 
                        config.payoffP >= config.payoffS && 
                        config.payoffS >= 0 &&
                        config.payoffT > config.payoffP;

  return (
    <div className="w-full bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden shadow-lg transition-all">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between bg-neutral-900 hover:bg-neutral-800 transition-colors focus:outline-none"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-neutral-100">Session Control</h3>
            <p className="text-sm text-neutral-500">Advanced experiment settings</p>
          </div>
        </div>
        <ChevronDown className={`h-5 w-5 text-neutral-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <div className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
        <div className="overflow-hidden">
          <div className="p-6 pt-2 border-t border-neutral-800 space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Opponent Strategy */}
              <div className="space-y-2">
                <label htmlFor="strategyName" className="block text-sm font-medium text-neutral-300">Opponent Strategy</label>
                <div className="relative">
                  <select
                    id="strategyName"
                    name="strategyName"
                    value={config.strategyName}
                    onChange={handleChange}
                    className="w-full appearance-none bg-neutral-950 border border-neutral-700 text-neutral-100 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    {STRATEGIES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-neutral-500 pointer-events-none" />
                </div>
              </div>
              
              {/* Round Count */}
              <div className="space-y-2">
                <label htmlFor="roundCount" className="block text-sm font-medium text-neutral-300">Round Count</label>
                <input
                  type="number"
                  id="roundCount"
                  name="roundCount"
                  min={1}
                  max={200}
                  value={config.roundCount}
                  onChange={handleChange}
                  className="w-full bg-neutral-950 border border-neutral-700 text-neutral-100 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Payoff Matrix */}
            <div className="bg-neutral-950 p-5 rounded-lg border border-neutral-800 space-y-4">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-neutral-300">Payoff Matrix (T, R, P, S)</label>
                {!isValidMatrix && <span className="text-red-400 text-xs font-medium bg-red-400/10 px-2 py-1 rounded">Invalid Matrix</span>}
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="payoffT" className="block text-xs text-neutral-400">Temptation (T)</label>
                  <input type="number" id="payoffT" name="payoffT" value={config.payoffT} onChange={handleChange} className="w-full bg-neutral-900 border border-neutral-700 text-neutral-100 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="payoffR" className="block text-xs text-neutral-400">Reward (R)</label>
                  <input type="number" id="payoffR" name="payoffR" value={config.payoffR} onChange={handleChange} className="w-full bg-neutral-900 border border-neutral-700 text-neutral-100 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="payoffP" className="block text-xs text-neutral-400">Punishment (P)</label>
                  <input type="number" id="payoffP" name="payoffP" value={config.payoffP} onChange={handleChange} className="w-full bg-neutral-900 border border-neutral-700 text-neutral-100 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="payoffS" className="block text-xs text-neutral-400">Sucker (S)</label>
                  <input type="number" id="payoffS" name="payoffS" value={config.payoffS} onChange={handleChange} className="w-full bg-neutral-900 border border-neutral-700 text-neutral-100 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              {!isValidMatrix && (
                <p className="text-red-400 text-xs">Must satisfy T &gt; R &gt; P &ge; S &ge; 0.</p>
              )}
            </div>

            {/* Noise Probability */}
            <div className="space-y-2">
              <label htmlFor="noiseProbability" className="block text-sm font-medium text-neutral-300">Noise Probability (%)</label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  id="noiseProbabilityRange"
                  name="noiseProbability"
                  min={0}
                  max={100}
                  value={config.noiseProbability}
                  onChange={handleChange}
                  className="w-full h-2 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                <div className="w-20 relative">
                  <input
                    type="number"
                    id="noiseProbability"
                    name="noiseProbability"
                    min={0}
                    max={100}
                    value={config.noiseProbability}
                    onChange={handleChange}
                    className="w-full bg-neutral-950 border border-neutral-700 text-neutral-100 rounded-lg px-3 py-2 pr-6 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                  <span className="absolute right-3 top-2.5 text-neutral-500 text-sm pointer-events-none">%</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
