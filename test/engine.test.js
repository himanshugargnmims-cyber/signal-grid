import test from 'node:test';
import assert from 'node:assert/strict';
import { CELL_COUNT, createPuzzle, hint, isLit, isSolved, play, toggle } from '../src/engine.js';

test('corner press flips only itself and its two neighbors', () => {
  const board = toggle(0, 0);
  assert.deepEqual([0, 1, 5].map((index) => isLit(board, index)), [true, true, true]);
  assert.equal(isLit(board, 6), false);
  assert.equal(toggle(board, 0), 0);
});

test('same seed gives the same board and a valid solution', () => {
  const first = createPuzzle('share-me');
  const second = createPuzzle('share-me');
  assert.deepEqual(first, second);
  assert.notEqual(first.board, 0);
  let solved = first;
  for (let i = 0; i < CELL_COUNT; i++) if (first.solutionMask & (1 << i)) solved = play(solved, i);
  assert.equal(isSolved(solved), true);
  assert.equal(hint(solved), null);
});

test('hint is a useful next press', () => {
  let state = createPuzzle('next');
  let steps = 0;
  while (!isSolved(state) && steps < CELL_COUNT) { state = play(state, hint(state)); steps++; }
  assert.equal(isSolved(state), true);
});
