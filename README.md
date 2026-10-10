# Signal Grid

A small, shareable browser puzzle based on Lights Out. Press a tile to flip it and its four orthogonal neighbors; clear all lights to win. The game uses no framework, build step, external assets, cookies, or analytics.

## Quick start

```sh
npm test
npm start
```

Open `http://localhost:8080`. A local HTTP server is needed because the game imports JavaScript modules. Python 3 is used only for the development server; any static server works.

## How to play

- Tap/click a tile, or use Tab to focus the board, arrow keys to move and Space/Enter to flip.
- **New puzzle** generates a fresh seed. **Restart** returns to the current seed's initial board.
- **Hint** highlights a tile in a known solution. **Share seed** copies a URL containing `?seed=...`; opening that URL reproduces the same puzzle.

Example: `http://localhost:8080/?seed=share-me` always starts with the same board. The engine starts with a solved board and applies ten distinct seeded presses, so each generated puzzle is solvable. The hint tracks a valid remaining solution even after arbitrary player moves.

## Limitations

This is one 5×5 mode with no timer, account, leaderboard, or stored progress. The known solution is not guaranteed to use the minimum number of moves. Share links use the current site's URL, so a link from localhost is only useful on your machine; deploy the static files to a public host to share publicly.

Run `npm test` for deterministic engine tests. MIT licensed.
