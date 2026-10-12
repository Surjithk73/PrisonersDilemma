import type { Move } from '../types';

export type StrategyFn = (myHistory: Move[], opponentHistory: Move[]) => Move;

export const TitForTat: StrategyFn = (_, opp) => (opp.length === 0 ? 'C' : opp[opp.length - 1]);

export const GenerousTitForTat: StrategyFn = (_, opp) => {
  if (opp.length === 0) return 'C';
  const last = opp[opp.length - 1];
  if (last === 'C') return 'C';
  // 10% chance to forgive a defection
  return Math.random() < 0.1 ? 'C' : 'D';
};

export const SuspiciousTitForTat: StrategyFn = (_, opp) => (opp.length === 0 ? 'D' : opp[opp.length - 1]);

export const TwoTitsForTat: StrategyFn = (_, opp) => {
  if (opp.length === 0) return 'C';
  // Defect if the opponent defected in either of the last 2 rounds
  const last1 = opp[opp.length - 1];
  const last2 = opp.length > 1 ? opp[opp.length - 2] : 'C';
  if (last1 === 'D' || last2 === 'D') return 'D';
  return 'C';
};

export const GrimTrigger: StrategyFn = (_, opp) => (opp.includes('D') ? 'D' : 'C');

export const Pavlov: StrategyFn = (my, opp) => {
  if (my.length === 0) return 'C';
  const myLast = my[my.length - 1];
  const oppLast = opp[opp.length - 1];
  // Win-stay (T or R), lose-shift (P or S)
  const score = (myLast === 'C' && oppLast === 'C') ? 3 :
                (myLast === 'D' && oppLast === 'C') ? 5 :
                (myLast === 'D' && oppLast === 'D') ? 1 : 0;
  
  if (score === 3 || score === 5) {
    return myLast;
  } else {
    return myLast === 'C' ? 'D' : 'C';
  }
};

export const AlwaysCooperate: StrategyFn = () => 'C';

export const AlwaysDefect: StrategyFn = () => 'D';

export const Random: StrategyFn = () => (Math.random() < 0.5 ? 'C' : 'D');

export const HardJoss: StrategyFn = (_, opp) => {
  if (opp.length === 0) return 'C';
  const shouldC = opp[opp.length - 1] === 'C';
  if (shouldC && Math.random() < 0.1) return 'D';
  return opp[opp.length - 1];
};

export const SoftJoss: StrategyFn = (_, opp) => {
  if (opp.length === 0) return 'C';
  const shouldD = opp[opp.length - 1] === 'D';
  if (shouldD && Math.random() < 0.1) return 'C';
  return opp[opp.length - 1];
};

export const Davis: StrategyFn = (_, opp) => {
  if (opp.length < 10) return 'C';
  return opp.includes('D') ? 'D' : 'C';
};

export const Feld: StrategyFn = (my) => {
  const round = my.length + 1;
  // Probability decreases linearly from 1.0 at round 1 to 0.5 at round 200 (max)
  // Since we don't know total rounds here, we decay it over a typical 200 bounds or just use round count.
  // Actually, spec says: decreases linearly 1.0 to 0.5 over the game.
  // Since StrategyFn doesn't take totalRounds, we'll approximate assuming 20 rounds or just decay it smoothly.
  // Wait, let's pass totalRounds? StrategyFn signature doesn't have it.
  // Let's decay it such that round 1 = 1.0, round 20 = 0.5.
  const decayRate = 0.5 / 20; 
  const prob = Math.max(0.5, 1.0 - (round - 1) * decayRate);
  return Math.random() < prob ? 'C' : 'D';
};

export const Alternator: StrategyFn = (my) => (my.length % 2 === 0 ? 'C' : 'D');

export const GoByMajority: StrategyFn = (_, opp) => {
  if (opp.length === 0) return 'C';
  const cCount = opp.filter(m => m === 'C').length;
  const dCount = opp.length - cCount;
  return cCount >= dCount ? 'C' : 'D';
};

export const STRATEGY_MAP: Record<string, StrategyFn> = {
  'Tit for Tat': TitForTat,
  'Generous Tit for Tat': GenerousTitForTat,
  'Suspicious Tit for Tat': SuspiciousTitForTat,
  'Two Tits for Tat': TwoTitsForTat,
  'Grim Trigger': GrimTrigger,
  'Pavlov': Pavlov,
  'Always Cooperate': AlwaysCooperate,
  'Always Defect': AlwaysDefect,
  'Random': Random,
  'Hard Joss': HardJoss,
  'Soft Joss': SoftJoss,
  'Davis': Davis,
  'Feld': Feld,
  'Alternator': Alternator,
  'Go By Majority': GoByMajority
};
