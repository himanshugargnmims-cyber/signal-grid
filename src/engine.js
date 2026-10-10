export const SIZE = 5;
export const CELL_COUNT = SIZE * SIZE;

function bit(index) { return 1 << index; }

export function toggle(board, index) {
  if (!Number.isInteger(index) || index < 0 || index >= CELL_COUNT) throw new RangeError('Cell index out of range');
  const row = Math.floor(index / SIZE);
  const col = index % SIZE;
  for (const [dr, dc] of [[0, 0], [-1, 0], [1, 0], [0, -1], [0, 1]]) {
    const r = row + dr;
    const c = col + dc;
    if (r >= 0 && r < SIZE && c >= 0 && c < SIZE) board ^= bit(r * SIZE + c);
  }
  return board;
}

function seedNumber(seed) {
  let hash = 2166136261;
  for (const char of seed) {
    hash ^= char.codePointAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0 || 1;
}

function random(seed) {
  let state = seedNumber(seed);
  return () => {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    return (state >>> 0) / 0x100000000;
  };
}

export function createPuzzle(seed) {
  if (typeof seed !== 'string' || seed.length === 0) throw new Error('Seed must be a nonempty string');
  const rng = random(seed);
  const indexes = Array.from({ length: CELL_COUNT }, (_, index) => index);
  for (let i = indexes.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [indexes[i], indexes[j]] = [indexes[j], indexes[i]];
  }
  let board = 0;
  let solutionMask = 0;
  for (const index of indexes.slice(0, 10)) {
    board = toggle(board, index);
    solutionMask ^= bit(index);
  }
  if (board === 0) {
    board = toggle(board, 0);
    solutionMask ^= bit(0);
  }
  return { seed, board, initialBoard: board, solutionMask, moves: 0, hints: 0 };
}

export function play(state, index) {
  return { ...state, board: toggle(state.board, index), solutionMask: state.solutionMask ^ bit(index), moves: state.moves + 1 };
}

export function isSolved(state) { return state.board === 0; }

export function hint(state) {
  if (isSolved(state)) return null;
  for (let index = 0; index < CELL_COUNT; index++) {
    if (state.solutionMask & bit(index)) return index;
  }
  return null;
}

export function isLit(board, index) { return Boolean(board & bit(index)); }
