import { Cell } from '../../cell';
import { State } from '../state';
import { Fsm } from '../fsm/fsm';
import { FsmNames } from '../fsm/names';
import { unselectCell, selectCell, moveBall, findCellsToWipe, wipeCells, clearWipedState } from './ball-utils';
import { clearTrace } from '../trace-utils';

export function clickOnBall(cell: Cell, state: State, fsm: Fsm) {
  if (cell.get('selected')) {
    unselectCell(cell, state);
    fsm.goTo(FsmNames.NOTHING_SELECTED);
  } else {
    if (state.selected) {
      unselectCell(state.selected, state);
    }
    selectCell(cell, state);
    fsm.goTo(FsmNames.BALL_SELECTED);
  }
}

export function clickOnEmptyOrIntendedCell(currentCell: Cell, allCells: Cell[], state: State, fsm: Fsm) {
  if (!state.selected || !state.trace) {
    return; // fsm.goTo(FsmNames.NOTHING_SELECTED);
  }

  moveBall(state.selected, currentCell, state);
  unselectCell(state.selected, state);
  clearTrace(state);

  const cellsToWipe = findCellsToWipe(allCells);
  if (cellsToWipe.length > 0) {
    wipeCells(cellsToWipe, state);
    fsm.goTo(FsmNames.NOTHING_SELECTED);
  } else {
    clearWipedState(state);
    fsm.goTo(FsmNames.NO_LINES_ON_BOARD);
  }
}
