import type { Move } from '../types';

export const applyNoise = (intendedMove: Move, noiseProbabilityPercentage: number): { actual: Move; noiseApplied: boolean } => {
  if (noiseProbabilityPercentage <= 0) return { actual: intendedMove, noiseApplied: false };
  if (noiseProbabilityPercentage >= 100) return { actual: intendedMove === 'C' ? 'D' : 'C', noiseApplied: true };

  const probability = noiseProbabilityPercentage / 100;
  const flipped = Math.random() < probability;

  if (flipped) {
    return { actual: intendedMove === 'C' ? 'D' : 'C', noiseApplied: true };
  }

  return { actual: intendedMove, noiseApplied: false };
};
