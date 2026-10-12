import type { Round, Report } from '../types';

export function computeReport(rounds: Round[]): Report {
  const N = rounds.length;
  if (N === 0) {
    return {
      cooperationRate: null, conditionalCooperationRate: null, retaliationIndex: null,
      forgivenessIndex: null, reciprocityCorrelation: null, riskTakingTendency: null,
      meanLatencyCMs: null, sdLatencyCMs: null, meanLatencyDMs: null, sdLatencyDMs: null, switchingRate: null
    };
  }

  const cp = rounds.map(r => r.participantMove === 'C' ? 1 : 0);
  const co = rounds.map(r => r.opponentMove === 'C' ? 1 : 0);

  // 1. Cooperation Rate
  const cooperationRate = cp.reduce((sum, c) => sum + c, 0) / N;

  // 2. Conditional Cooperation Rate
  let condCoopNum = 0, condCoopDenom = 0;
  for (let t = 1; t < N; t++) {
    if (co[t - 1] === 1) {
      condCoopDenom++;
      if (cp[t] === 1) condCoopNum++;
    }
  }
  const conditionalCooperationRate = condCoopDenom > 0 ? condCoopNum / condCoopDenom : null;

  // 3. Retaliation Index
  let retalNum = 0, retalDenom = 0;
  for (let t = 1; t < N; t++) {
    if (co[t - 1] === 0) {
      retalDenom++;
      if (cp[t] === 0) retalNum++;
    }
  }
  const retaliationIndex = retalDenom > 0 ? retalNum / retalDenom : null;

  // 4. Forgiveness Index
  const forgivenessEvents: number[] = [];
  for (let t = 1; t < N; t++) {
    // Retaliation event: participant plays D after opponent plays D
    if (co[t - 1] === 0 && cp[t] === 0) {
      let roundsToC = 0;
      let returnedToC = false;
      for (let j = t + 1; j < N; j++) {
        roundsToC++;
        if (cp[j] === 1) {
          returnedToC = true;
          break;
        }
      }
      if (!returnedToC) {
        roundsToC = N - 1 - t; // Remaining rounds if never returned to C
      }
      forgivenessEvents.push(roundsToC);
    }
  }
  const forgivenessIndex = forgivenessEvents.length > 0 
    ? forgivenessEvents.reduce((a, b) => a + b, 0) / forgivenessEvents.length 
    : null;

  // 5. Reciprocity Correlation
  let reciprocityCorrelation = null;
  if (N >= 3) {
    const x = cp.slice(1);
    const y = co.slice(0, N - 1);
    const xBar = x.reduce((a, b) => a + b, 0) / x.length;
    const yBar = y.reduce((a, b) => a + b, 0) / y.length;
    
    let num = 0, denX = 0, denY = 0;
    for (let i = 0; i < x.length; i++) {
      const dx = x[i] - xBar;
      const dy = y[i] - yBar;
      num += dx * dy;
      denX += dx * dx;
      denY += dy * dy;
    }
    
    if (denX > 0 && denY > 0) {
      reciprocityCorrelation = num / Math.sqrt(denX * denY);
    } else {
      reciprocityCorrelation = null;
    }
  }

  // 6. Risk-Taking Tendency
  let riskNum = 0, riskDenom = 0;
  for (let t = 1; t < N; t++) {
    if (co[t - 1] === 0) {
      riskDenom++;
      if (cp[t] === 1) riskNum++;
    }
  }
  const riskTakingTendency = riskDenom > 0 ? riskNum / riskDenom : null;

  // 7. Response Latency Profile
  const latC = rounds.filter(r => r.participantMove === 'C').map(r => r.responseLatencyMs);
  const latD = rounds.filter(r => r.participantMove === 'D').map(r => r.responseLatencyMs);

  const meanLatencyCMs = latC.length > 0 ? latC.reduce((a, b) => a + b, 0) / latC.length : null;
  const sdLatencyCMs = meanLatencyCMs !== null && latC.length > 1
    ? Math.sqrt(latC.reduce((sq, val) => sq + Math.pow(val - meanLatencyCMs, 2), 0) / (latC.length - 1))
    : (latC.length === 1 ? 0 : null);

  const meanLatencyDMs = latD.length > 0 ? latD.reduce((a, b) => a + b, 0) / latD.length : null;
  const sdLatencyDMs = meanLatencyDMs !== null && latD.length > 1
    ? Math.sqrt(latD.reduce((sq, val) => sq + Math.pow(val - meanLatencyDMs, 2), 0) / (latD.length - 1))
    : (latD.length === 1 ? 0 : null);

  // 8. Switching Rate
  let switches = 0;
  for (let t = 1; t < N; t++) {
    if (cp[t] !== cp[t - 1]) switches++;
  }
  const switchingRate = N > 1 ? switches / (N - 1) : null;

  return {
    cooperationRate,
    conditionalCooperationRate,
    retaliationIndex,
    forgivenessIndex,
    reciprocityCorrelation,
    riskTakingTendency,
    meanLatencyCMs,
    sdLatencyCMs,
    meanLatencyDMs,
    sdLatencyDMs,
    switchingRate
  };
}
