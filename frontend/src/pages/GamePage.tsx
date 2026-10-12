import { useState, useRef, useEffect } from 'react';
import { useLocation, Navigate, useNavigate } from 'react-router-dom';
import PayoffMatrix from '@/components/PayoffMatrix';
import ScoreBoard from '@/components/ScoreBoard';
import MoveButtons from '@/components/MoveButtons';
import AiThinkingIndicator from '@/components/AiThinkingIndicator';
import RoundHistoryTable from '@/components/RoundHistoryTable';
import { STRATEGY_MAP } from '@/lib/strategies';
import { applyNoise } from '@/lib/noise';
import { computeReport } from '@/lib/reports';
import { saveSession } from '@/lib/api';
import type { SessionConfig, Round, Move } from '@/types';

type GamePhase = 'player_turn' | 'ai_thinking' | 'game_over';

export default function GamePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const config = (location.state?.config as SessionConfig | undefined) || {
    participantName: 'Aditya K.',
    participantAge: 21,
    strategyName: 'Tit for Tat',
    roundCount: 20,
    payoffT: 5,
    payoffR: 3,
    payoffP: 1,
    payoffS: 0,
    noiseProbability: 0
  };

  const sampleInitialRounds: Round[] = [
    { roundNumber: 1, participantMove: 'C', intendedParticipantMove: 'C', noiseApplied: false, opponentMove: 'C', participantScoreThisRound: 3, opponentScoreThisRound: 3, cumulativeParticipantScore: 3, cumulativeOpponentScore: 3, responseLatencyMs: 420, timestampUtc: new Date().toISOString() },
    { roundNumber: 2, participantMove: 'C', intendedParticipantMove: 'C', noiseApplied: false, opponentMove: 'C', participantScoreThisRound: 3, opponentScoreThisRound: 3, cumulativeParticipantScore: 6, cumulativeOpponentScore: 6, responseLatencyMs: 385, timestampUtc: new Date().toISOString() },
    { roundNumber: 3, participantMove: 'D', intendedParticipantMove: 'D', noiseApplied: false, opponentMove: 'C', participantScoreThisRound: 5, opponentScoreThisRound: 0, cumulativeParticipantScore: 11, cumulativeOpponentScore: 6, responseLatencyMs: 650, timestampUtc: new Date().toISOString() },
    { roundNumber: 4, participantMove: 'C', intendedParticipantMove: 'C', noiseApplied: false, opponentMove: 'D', participantScoreThisRound: 0, opponentScoreThisRound: 5, cumulativeParticipantScore: 11, cumulativeOpponentScore: 11, responseLatencyMs: 410, timestampUtc: new Date().toISOString() },
    { roundNumber: 5, participantMove: 'C', intendedParticipantMove: 'C', noiseApplied: false, opponentMove: 'C', participantScoreThisRound: 3, opponentScoreThisRound: 3, cumulativeParticipantScore: 14, cumulativeOpponentScore: 14, responseLatencyMs: 390, timestampUtc: new Date().toISOString() },
  ];

  const [rounds, setRounds] = useState<Round[]>(location.state?.config ? [] : sampleInitialRounds);
  const [phase, setPhase] = useState<GamePhase>('player_turn');
  const roundStartTime = useRef<number>(Date.now());

  const currentRoundNum = rounds.length + 1;
  const participantScore = rounds.reduce((sum, r) => sum + r.participantScoreThisRound, 0);
  const opponentScore = rounds.reduce((sum, r) => sum + r.opponentScoreThisRound, 0);

  const handleMove = (intendedMove: Move) => {
    if (phase !== 'player_turn') return;

    const responseLatencyMs = Date.now() - roundStartTime.current;
    setPhase('ai_thinking');

    setTimeout(() => {
      // 1. Participant Move & Noise
      const { actual: participantMove, noiseApplied } = applyNoise(intendedMove, config.noiseProbability);

      // 2. Opponent Move
      const strategyFn = STRATEGY_MAP[config.strategyName] || STRATEGY_MAP['Tit for Tat'];
      const myHistory = rounds.map(r => r.participantMove);
      const oppHistory = rounds.map(r => r.opponentMove);
      const opponentMove = strategyFn(oppHistory, myHistory); // The opponent's perspective

      // 3. Resolve Payoffs
      let pScore = 0;
      let oScore = 0;
      if (participantMove === 'C' && opponentMove === 'C') {
        pScore = config.payoffR;
        oScore = config.payoffR;
      } else if (participantMove === 'C' && opponentMove === 'D') {
        pScore = config.payoffS;
        oScore = config.payoffT;
      } else if (participantMove === 'D' && opponentMove === 'C') {
        pScore = config.payoffT;
        oScore = config.payoffS;
      } else {
        pScore = config.payoffP;
        oScore = config.payoffP;
      }

      // 4. Save Round
      const newRound: Round = {
        roundNumber: currentRoundNum,
        intendedParticipantMove: intendedMove,
        participantMove,
        noiseApplied,
        opponentMove,
        participantScoreThisRound: pScore,
        opponentScoreThisRound: oScore,
        cumulativeParticipantScore: participantScore + pScore,
        cumulativeOpponentScore: opponentScore + oScore,
        responseLatencyMs,
        timestampUtc: new Date().toISOString()
      };

      const updatedRounds = [...rounds, newRound];
      setRounds(updatedRounds);

      if (currentRoundNum >= config.roundCount) {
        setPhase('game_over');
        
        // M3: Compute report and save
        const report = computeReport(updatedRounds);
        saveSession(config, updatedRounds, report)
          .then(({ sessionId }) => {
            navigate(`/report/${sessionId}`, { state: { config, rounds: updatedRounds, report } });
          })
          .catch(err => {
            console.error(err);
            alert('Could not save session — data displayed from local state');
            // Navigate to report anyway with local state (0 as fake id)
            navigate(`/report/0`, { state: { config, rounds: updatedRounds, report } });
          });

      } else {
        setPhase('player_turn');
      }
    }, 800);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-extrabold tracking-tight text-white">IPD Session</h2>
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-neutral-900 border border-neutral-800 text-sm font-medium text-neutral-300">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
          </span>
          Playing against: <span className="text-white font-bold">{config.strategyName}</span>
        </div>
      </div>

      <ScoreBoard 
        participantScore={participantScore} 
        opponentScore={opponentScore} 
        currentRound={Math.min(currentRoundNum, config.roundCount)} 
        totalRounds={config.roundCount} 
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <div className="space-y-6">
          <PayoffMatrix config={config} />
        </div>
        
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 sm:p-8 shadow-lg min-h-[300px] flex flex-col justify-center relative">
          {phase === 'game_over' ? (
            <div className="text-center space-y-4">
              <div className="text-4xl">🏁</div>
              <h3 className="text-2xl font-bold text-white">Session Complete</h3>
              <p className="text-neutral-400">Saving results...</p>
            </div>
          ) : (
            <>
              <div className="text-center mb-4">
                <h3 className="font-bold text-xl text-white">Make Your Move</h3>
                <p className="text-sm text-neutral-400 mt-1">Select Cooperate or Defect for this round</p>
              </div>
              <MoveButtons onMove={handleMove} disabled={phase !== 'player_turn'} />
              <div className="mt-8 h-8">
                <AiThinkingIndicator isVisible={phase === 'ai_thinking'} />
              </div>
            </>
          )}
        </div>
      </div>

      <RoundHistoryTable rounds={rounds} />
    </div>
  );
}
