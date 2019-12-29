import { Cell } from '../../cell';
import { Runtime } from '../runtime';
import { Fsm } from '../fsm/fsm';
import { FsmNames } from '../fsm/names';
import {
  unselectCell,
  selectCell,
  moveBall,
  findCellsToWipe,
  wipeCells,
  clearWipedFlag,
  undoWipe,
} from '../operations/ball-operations';
import { clearTrace } from '../trace-utils';
import { undoIntentions, undoSettleIntention } from '../operations/intention-operations';

export function clickOnBall(cell: Cell, runtime: Runtime, fsm: Fsm) {
  if (cell.get('selected')) {
    unselectCell(cell, runtime);
    fsm.goTo(FsmNames.NOTHING_SELECTED);
  } else {
    if (runtime.selected) {
      unselectCell(runtime.selected, runtime);
    }
    selectCell(cell, runtime);
    fsm.goTo(FsmNames.BALL_SELECTED);
  }
}

export function clickOnEmptyOrIntendedCell(currentCell: Cell, allCells: Cell[], runtime: Runtime, fsm: Fsm) {
  if (!runtime.selected || runtime.trace.length === 0) {
    return; // fsm.goTo(FsmNames.NOTHING_SELECTED);
  }

  moveBall(runtime.selected, currentCell, runtime);
  unselectCell(runtime.selected, runtime);
  clearTrace(runtime);

  const cellsToWipe = findCellsToWipe(allCells);
  if (cellsToWipe.length > 0) {
    wipeCells(cellsToWipe, runtime);
    fsm.goTo(FsmNames.NOTHING_SELECTED);
  } else {
    clearWipedFlag(runtime);
    fsm.goTo(FsmNames.NO_LINES_ON_BOARD);
  }
}

export function undoLastBallMove(allCells: Cell[], runtime: Runtime, fsm: Fsm) {
  if (!runtime.lastBallMove) {
    return;
  }

  undoWipe(runtime);
  undoIntentions(allCells);
  undoSettleIntention(runtime);
  moveBall(runtime.lastBallMove[1], runtime.lastBallMove[0], runtime);
  runtime.lastBallMove = null;
  fsm.goTo(FsmNames.MAKE_INTENTIONS);
}
