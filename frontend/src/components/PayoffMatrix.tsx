import type { SessionConfig } from '@/types';

interface Props {
  config: SessionConfig;
}

export default function PayoffMatrix({ config }: Props) {
  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden shadow-lg p-6 sm:p-8">
      <div className="text-center mb-8">
        <h3 className="font-bold text-xl text-white">Payoff Matrix</h3>
        <p className="text-sm text-neutral-400 mt-1">Scores awarded based on both players' moves</p>
      </div>
      
      <div className="grid grid-cols-[auto_1fr_1fr] gap-0.5 max-w-lg mx-auto bg-neutral-800 border border-neutral-800 rounded-xl overflow-hidden shadow-inner text-sm md:text-base">
        
        {/* Header Row */}
        <div className="bg-neutral-950 p-4" />
        <div className="bg-neutral-900 p-4 text-center">
          <span className="font-semibold text-neutral-200 block">Opponent</span>
          <span className="font-bold text-blue-400 block mt-1">Cooperates</span>
        </div>
        <div className="bg-neutral-900 p-4 text-center">
          <span className="font-semibold text-neutral-200 block">Opponent</span>
          <span className="font-bold text-red-400 block mt-1">Defects</span>
        </div>
        
        {/* Row 1: You Cooperate */}
        <div className="bg-neutral-900 p-4 flex flex-col items-end justify-center pr-6">
          <span className="font-semibold text-neutral-200 block">You</span>
          <span className="font-bold text-blue-400 block">Cooperate</span>
        </div>
        
        <div className="bg-neutral-950 hover:bg-neutral-900 transition-colors p-6 text-center border-t border-neutral-800 relative group flex flex-col items-center justify-center min-h-[120px]">
          <div className="flex gap-4 items-center justify-center">
            <div className="text-center">
              <span className="text-xs text-neutral-500 uppercase tracking-wider font-semibold block mb-1">You</span>
              <span className="text-3xl font-black text-emerald-400">{config.payoffR}</span>
            </div>
            <div className="w-px h-8 bg-neutral-800" />
            <div className="text-center">
              <span className="text-xs text-neutral-500 uppercase tracking-wider font-semibold block mb-1">Opponent</span>
              <span className="text-3xl font-black text-emerald-400">{config.payoffR}</span>
            </div>
          </div>
          <div className="absolute inset-x-0 bottom-2 text-center opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-xs text-neutral-500 bg-neutral-900 px-2 py-1 rounded-full border border-neutral-800">Reward</span>
          </div>
        </div>

        <div className="bg-neutral-950 hover:bg-neutral-900 transition-colors p-6 text-center border-t border-l border-neutral-800 relative group flex flex-col items-center justify-center min-h-[120px]">
          <div className="flex gap-4 items-center justify-center">
            <div className="text-center">
              <span className="text-xs text-neutral-500 uppercase tracking-wider font-semibold block mb-1">You</span>
              <span className="text-3xl font-black text-neutral-500">{config.payoffS}</span>
            </div>
            <div className="w-px h-8 bg-neutral-800" />
            <div className="text-center">
              <span className="text-xs text-neutral-500 uppercase tracking-wider font-semibold block mb-1">Opponent</span>
              <span className="text-3xl font-black text-amber-500">{config.payoffT}</span>
            </div>
          </div>
          <div className="absolute inset-x-0 bottom-2 text-center opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-xs text-neutral-500 bg-neutral-900 px-2 py-1 rounded-full border border-neutral-800">Sucker / Temptation</span>
          </div>
        </div>

        {/* Row 2: You Defect */}
        <div className="bg-neutral-900 p-4 flex flex-col items-end justify-center pr-6 border-t border-neutral-800">
          <span className="font-semibold text-neutral-200 block">You</span>
          <span className="font-bold text-red-400 block">Defect</span>
        </div>
        
        <div className="bg-neutral-950 hover:bg-neutral-900 transition-colors p-6 text-center border-t border-neutral-800 relative group flex flex-col items-center justify-center min-h-[120px]">
          <div className="flex gap-4 items-center justify-center">
            <div className="text-center">
              <span className="text-xs text-neutral-500 uppercase tracking-wider font-semibold block mb-1">You</span>
              <span className="text-3xl font-black text-amber-500">{config.payoffT}</span>
            </div>
            <div className="w-px h-8 bg-neutral-800" />
            <div className="text-center">
              <span className="text-xs text-neutral-500 uppercase tracking-wider font-semibold block mb-1">Opponent</span>
              <span className="text-3xl font-black text-neutral-500">{config.payoffS}</span>
            </div>
          </div>
          <div className="absolute inset-x-0 bottom-2 text-center opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-xs text-neutral-500 bg-neutral-900 px-2 py-1 rounded-full border border-neutral-800">Temptation / Sucker</span>
          </div>
        </div>

        <div className="bg-neutral-950 hover:bg-neutral-900 transition-colors p-6 text-center border-t border-l border-neutral-800 relative group flex flex-col items-center justify-center min-h-[120px]">
          <div className="flex gap-4 items-center justify-center">
            <div className="text-center">
              <span className="text-xs text-neutral-500 uppercase tracking-wider font-semibold block mb-1">You</span>
              <span className="text-3xl font-black text-red-400">{config.payoffP}</span>
            </div>
            <div className="w-px h-8 bg-neutral-800" />
            <div className="text-center">
              <span className="text-xs text-neutral-500 uppercase tracking-wider font-semibold block mb-1">Opponent</span>
              <span className="text-3xl font-black text-red-400">{config.payoffP}</span>
            </div>
          </div>
          <div className="absolute inset-x-0 bottom-2 text-center opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-xs text-neutral-500 bg-neutral-900 px-2 py-1 rounded-full border border-neutral-800">Punishment</span>
          </div>
        </div>

      </div>
    </div>
  );
}
