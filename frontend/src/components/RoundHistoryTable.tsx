import type { Round } from '@/types';

interface Props {
  rounds: Round[];
}

export default function RoundHistoryTable({ rounds }: Props) {
  if (rounds.length === 0) return null;

  return (
    <div className="mt-12 bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden shadow-lg">
      <div className="px-6 py-4 border-b border-neutral-800">
        <h3 className="font-bold text-white">Match History</h3>
      </div>
      <div className="overflow-x-auto max-h-80 overflow-y-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-neutral-400 uppercase bg-neutral-950 sticky top-0">
            <tr>
              <th className="px-6 py-3 font-medium">Round</th>
              <th className="px-6 py-3 font-medium">Your Move</th>
              <th className="px-6 py-3 font-medium">Opponent</th>
              <th className="px-6 py-3 font-medium text-right">Round Score</th>
              <th className="px-6 py-3 font-medium text-right">Total Score</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800">
            {[...rounds].reverse().map((round) => (
              <tr key={round.roundNumber} className="odd:bg-neutral-900 even:bg-neutral-800/30 hover:bg-neutral-800/80 transition-colors">
                <td className="px-6 py-4 font-medium text-neutral-300">
                  {round.roundNumber === rounds.length ? (
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                      {round.roundNumber}
                    </span>
                  ) : (
                    round.roundNumber
                  )}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${round.participantMove === 'C' ? 'bg-blue-500/10 text-blue-400' : 'bg-red-500/10 text-red-400'}`}>
                    {round.participantMove === 'C' ? 'Cooperate' : 'Defect'}
                  </span>
                  {round.noiseApplied && <span className="ml-2 text-xs text-amber-500" title="Noise applied">(Flipped)</span>}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${round.opponentMove === 'C' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                    {round.opponentMove === 'C' ? 'Cooperate' : 'Defect'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right text-neutral-300">
                  <span className="font-medium text-white">{round.participantScoreThisRound}</span> <span className="text-neutral-500 text-xs">vs</span> {round.opponentScoreThisRound}
                </td>
                <td className="px-6 py-4 text-right text-neutral-300 font-bold">
                  {round.cumulativeParticipantScore}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
