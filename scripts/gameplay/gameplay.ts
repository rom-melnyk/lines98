import * as constants from '../constants';
import { random, getRandomElement } from './utils';

import { State, } from './state';
import { Playground } from '../playground';

export function makeIntentions(state: State, playground: Playground): void {
  const availableForIntention = state.cells.filter((cellState) => !cellState.ball);
  if (availableForIntention.length < constants.ballsPerIntention) {
    throw new constants.GameOver();
  }

  for (let i = 0; i < constants.ballsPerIntention; i++) {
    const index = random(availableForIntention.length);
    const cellState = availableForIntention.splice(index, 1)[0]; // Splice from array and pick it.

    const cell = playground.getCellAt(cellState.x, cellState.y);
    cellState.intention = getRandomElement<number>(constants.colors);
    cell.set('intention', cellState.intention);
  }
}

export function undoIntentions(state: State, playground: Playground): void {
  state.cells
    .filter((cellState) => cellState.intention)
    .forEach((cellState) => {
      const cell = playground.getCellAt(cellState.x, cellState.y);
      cell.set('intention', null);
      cellState.intention = null;
    });
}

export function settleIntentions(state: State, playground: Playground): void {
  state.lastCells = [];

  state.cells
    .filter((cellState) => cellState.intention)
    .forEach((cellState) => {
      const cell = playground.getCellAt(cellState.x, cellState.y);

      cellState.ball = cellState.intention;
      cell.set('ball', cellState.intention);

      cellState.intention = null;
      cell.set('intention', null);

      state.lastCells.push(cellState);
    });
}

export function unsetBalls(state: State, playground: Playground): void {
  state.lastCells.forEach((cellState) => {
    const cell = playground.getCellAt(cellState.x, cellState.y);
    cellState.ball = null;
    cell.set('ball', null);
  });

  state.lastCells = [];
}
