import * as constants from '../../constants';
import { random, getRandomElement } from '../playground-utils';
import { Cell } from '../../cell';
import { FsmNames } from '../fsm/names';
import { Runtime } from '../runtime';
import { findCellsToWipe, wipeCells, clearWipedState } from '../operations/ball-operations';
import { saveGame } from '../operations/load-save-operations';

export function makeIntentions(allCells: Cell[], runtime: Runtime) {
  const availableCells = allCells.filter((cell) => !cell.get('ball'));
  if (availableCells.length < constants.ballsPerIntention) {
    return FsmNames.GAME_OVER;
  }

  for (let i = 0; i < constants.ballsPerIntention; i++) {
    const index = random(availableCells.length);
    const cell = availableCells.splice(index, 1)[0]; // Splice from array and pick it.
    const intention = getRandomElement<number>(constants.colors);

    cell.set('intention', intention);
  }

  saveGame(allCells, runtime);
  return FsmNames.NOTHING_SELECTED;
}

export function separateIntentionsFromBalls(allCells: Cell[]) {
  const intentionsOverBalls = allCells.filter((cell) => cell.get('ball') && cell.get('intention'));
  const availableCells = allCells.filter((cell) => !cell.get('ball') && !cell.get('intention'));
  if (availableCells.length < intentionsOverBalls.length) {
    return FsmNames.GAME_OVER;
  }

  intentionsOverBalls.forEach((source) => {
    const index = random(availableCells.length);
    const destination = availableCells.splice(index, 1)[0]; // Splice from array and pick it.
    destination.set('intention', source.get('intention'));
    source.set('intention', null);
  });

  return FsmNames.INTENTIONS_READY_TO_SETTLE;
}

export function settleIntentions(allCells: Cell[], runtime: Runtime) {
  runtime.lastSettled = allCells.filter((cell) => cell.get('intention'));
  runtime.lastSettled.forEach((cell) => {
    cell.set('ball', cell.get('intention'));
    cell.set('intention', null);
  });

  const cellsToWipe = findCellsToWipe(allCells);
  if (cellsToWipe.length > 0) {
    wipeCells(cellsToWipe, runtime);
  } else {
    clearWipedState(runtime);
  }

  return FsmNames.INTENTIONS_SETTLED;
}
