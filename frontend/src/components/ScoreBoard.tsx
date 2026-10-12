interface Props {
  participantScore: number;
  opponentScore: number;
  currentRound: number;
  totalRounds: number;
}

export default function ScoreBoard({ participantScore, opponentScore, currentRound, totalRounds }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 text-center shadow-lg relative overflow-hidden group">
        <div className="absolute inset-0 bg-blue-500/5 group-hover:bg-blue-500/10 transition-colors" />
        <div className="relative">
          <div className="text-sm font-semibold text-neutral-400 uppercase tracking-wider mb-2">Your Score</div>
          <div className="text-4xl font-black text-white">{participantScore}</div>
        </div>
      </div>
      
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 text-center shadow-lg flex flex-col justify-center items-center">
        <div className="text-sm font-semibold text-neutral-400 uppercase tracking-wider mb-2">Round</div>
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-black text-white">{currentRound}</span>
          <span className="text-xl font-medium text-neutral-500">/ {totalRounds}</span>
        </div>
      </div>
      
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 text-center shadow-lg relative overflow-hidden group">
        <div className="absolute inset-0 bg-red-500/5 group-hover:bg-red-500/10 transition-colors" />
        <div className="relative">
          <div className="text-sm font-semibold text-neutral-400 uppercase tracking-wider mb-2">Opponent Score</div>
          <div className="text-4xl font-black text-white">{opponentScore}</div>
        </div>
      </div>
    </div>
  );
}
