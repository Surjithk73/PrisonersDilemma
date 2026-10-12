import { describe, it, expect } from 'vitest';
import {
  TitForTat, GenerousTitForTat, SuspiciousTitForTat, TwoTitsForTat,
  GrimTrigger, Pavlov, AlwaysCooperate, AlwaysDefect, Alternator, GoByMajority, Davis
} from './strategies';

describe('Strategies', () => {
  it('TitForTat', () => {
    expect(TitForTat([], [])).toBe('C');
    expect(TitForTat(['C'], ['C'])).toBe('C');
    expect(TitForTat(['C'], ['D'])).toBe('D');
  });

  it('SuspiciousTitForTat', () => {
    expect(SuspiciousTitForTat([], [])).toBe('D');
    expect(SuspiciousTitForTat(['D'], ['C'])).toBe('C');
  });

  it('TwoTitsForTat', () => {
    expect(TwoTitsForTat([], [])).toBe('C');
    expect(TwoTitsForTat(['C'], ['C'])).toBe('C');
    expect(TwoTitsForTat(['C'], ['D'])).toBe('D');
    expect(TwoTitsForTat(['C', 'D'], ['D', 'C'])).toBe('D');
    expect(TwoTitsForTat(['C', 'D', 'D'], ['D', 'C', 'C'])).toBe('C');
  });

  it('GrimTrigger', () => {
    expect(GrimTrigger([], [])).toBe('C');
    expect(GrimTrigger(['C'], ['C'])).toBe('C');
    expect(GrimTrigger(['C'], ['D'])).toBe('D');
    expect(GrimTrigger(['C', 'D'], ['D', 'C'])).toBe('D'); // stays D forever
  });

  it('Pavlov', () => {
    expect(Pavlov([], [])).toBe('C');
    // Win-stay
    expect(Pavlov(['C'], ['C'])).toBe('C');
    expect(Pavlov(['D'], ['C'])).toBe('D'); // T=5, win, stay D
    // Lose-shift
    expect(Pavlov(['C'], ['D'])).toBe('D'); // S=0, lose, shift to D
    expect(Pavlov(['D'], ['D'])).toBe('C'); // P=1, lose, shift to C
  });

  it('AlwaysCooperate', () => {
    expect(AlwaysCooperate([], [])).toBe('C');
    expect(AlwaysCooperate(['C'], ['D'])).toBe('C');
  });

  it('AlwaysDefect', () => {
    expect(AlwaysDefect([], [])).toBe('D');
    expect(AlwaysDefect(['D'], ['C'])).toBe('D');
  });

  it('Alternator', () => {
    expect(Alternator([], [])).toBe('C');
    expect(Alternator(['C'], ['D'])).toBe('D');
    expect(Alternator(['C', 'D'], ['C', 'C'])).toBe('C');
  });

  it('GoByMajority', () => {
    expect(GoByMajority([], [])).toBe('C');
    expect(GoByMajority(['C'], ['D'])).toBe('D');
    expect(GoByMajority(['C', 'C'], ['D', 'C'])).toBe('C'); // tie goes to C
    expect(GoByMajority(['C', 'C', 'C'], ['D', 'D', 'C'])).toBe('D');
  });

  it('Davis', () => {
    expect(Davis([], [])).toBe('C');
    // round 9
    expect(Davis(Array(9).fill('C'), Array(9).fill('D'))).toBe('C');
    // round 10
    expect(Davis(Array(10).fill('C'), Array(10).fill('D'))).toBe('D');
  });
});
