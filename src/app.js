import { CELL_COUNT, SIZE, createPuzzle, hint, isLit, isSolved, play } from './engine.js';

const boardElement = document.querySelector('#board');
const seedElement = document.querySelector('#seed');
const movesElement = document.querySelector('#moves');
const statusElement = document.querySelector('#status');
const hintElement = document.querySelector('#hint-text');
const newButton = document.querySelector('#new-game');
const restartButton = document.querySelector('#restart');
const hintButton = document.querySelector('#hint');
const shareButton = document.querySelector('#share');

function newSeed() {
  if (globalThis.crypto?.randomUUID) return crypto.randomUUID().slice(0, 8);
  return String(Date.now());
}

const initialSeed = new URL(location.href).searchParams.get('seed')?.slice(0, 80) || newSeed();
let state = createPuzzle(initialSeed);
let highlighted = null;

function setSeedUrl(seed) {
  const url = new URL(location.href);
  url.searchParams.set('seed', seed);
  history.replaceState(null, '', url);
}

function render() {
  seedElement.textContent = state.seed;
  movesElement.textContent = String(state.moves);
  statusElement.textContent = isSolved(state)
    ? `Grid cleared in ${state.moves} moves. Great work!`
    : `${Array.from({ length: CELL_COUNT }, (_, i) => isLit(state.board, i)).filter(Boolean).length} lights remain.`;
  boardElement.classList.toggle('solved', isSolved(state));
  boardElement.replaceChildren(...Array.from({ length: CELL_COUNT }, (_, index) => {
    const row = Math.floor(index / SIZE) + 1;
    const col = (index % SIZE) + 1;
    const lit = isLit(state.board, index);
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `cell${lit ? ' lit' : ''}${highlighted === index ? ' hinted' : ''}`;
    button.dataset.index = String(index);
    button.setAttribute('aria-label', `Row ${row}, column ${col}, ${lit ? 'lit' : 'unlit'}`);
    button.setAttribute('aria-pressed', String(lit));
    button.title = `Row ${row}, column ${col}`;
    return button;
  }));
}

boardElement.addEventListener('click', (event) => {
  const button = event.target.closest('button[data-index]');
  if (!button || isSolved(state)) return;
  const index = Number(button.dataset.index);
  state = play(state, index);
  highlighted = null;
  hintElement.textContent = '';
  render();
  boardElement.querySelector(`[data-index="${index}"]`)?.focus();
});

boardElement.addEventListener('keydown', (event) => {
  const button = event.target.closest('button[data-index]');
  if (!button) return;
  const current = Number(button.dataset.index);
  const row = Math.floor(current / SIZE);
  const col = current % SIZE;
  const directions = { ArrowUp: [-1, 0], ArrowDown: [1, 0], ArrowLeft: [0, -1], ArrowRight: [0, 1] };
  const direction = directions[event.key];
  if (!direction) return;
  event.preventDefault();
  const nextRow = (row + direction[0] + SIZE) % SIZE;
  const nextCol = (col + direction[1] + SIZE) % SIZE;
  boardElement.querySelector(`[data-index="${nextRow * SIZE + nextCol}"]`)?.focus();
});

newButton.addEventListener('click', () => {
  state = createPuzzle(newSeed());
  highlighted = null;
  hintElement.textContent = '';
  setSeedUrl(state.seed);
  render();
  boardElement.querySelector('button')?.focus();
});

restartButton.addEventListener('click', () => {
  state = createPuzzle(state.seed);
  highlighted = null;
  hintElement.textContent = 'Puzzle restarted.';
  render();
  boardElement.querySelector('button')?.focus();
});

hintButton.addEventListener('click', () => {
  highlighted = hint(state);
  hintElement.textContent = highlighted === null
    ? 'Puzzle solved.'
    : `Try row ${Math.floor(highlighted / SIZE) + 1}, column ${highlighted % SIZE + 1}.`;
  render();
  if (highlighted !== null) boardElement.querySelector(`[data-index="${highlighted}"]`)?.focus();
});

shareButton.addEventListener('click', async () => {
  setSeedUrl(state.seed);
  try {
    await navigator.clipboard.writeText(location.href);
    hintElement.textContent = 'Puzzle link copied.';
  } catch {
    hintElement.textContent = `Share this URL: ${location.href}`;
  }
});

setSeedUrl(state.seed);
render();
