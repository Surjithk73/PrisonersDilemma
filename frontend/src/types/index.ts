export type Move = 'C' | 'D';

export interface SessionConfig {
  participantName: string;
  participantAge: number;
  strategyName: string;
  roundCount: number;
  payoffT: number;
  payoffR: number;
  payoffP: number;
  payoffS: number;
  noiseProbability: number;
}

export interface Round {
  roundNumber: number;
  participantMove: Move;
  intendedParticipantMove: Move;
  noiseApplied: boolean;
  opponentMove: Move;
  participantScoreThisRound: number;
  opponentScoreThisRound: number;
  cumulativeParticipantScore: number;
  cumulativeOpponentScore: number;
  responseLatencyMs: number;
  timestampUtc: string;
}

export interface Report {
  cooperationRate: number | null;
  conditionalCooperationRate: number | null;
  retaliationIndex: number | null;
  forgivenessIndex: number | null;
  reciprocityCorrelation: number | null;
  riskTakingTendency: number | null;
  meanLatencyCMs: number | null;
  sdLatencyCMs: number | null;
  meanLatencyDMs: number | null;
  sdLatencyDMs: number | null;
  switchingRate: number | null;
}

export interface SessionSummary {
  id: number;
  participantName: string;
  participantAge: number;
  strategyName: string;
  roundCount: number;
  cooperationRate: number | null;
  completedAt: string;
}
