import { Cell } from '../../cell';
import { State } from '../state';
import { getAt } from '../utils';
import { clearTrace } from './trace-utils';

function unselectCell(cell: Cell, state: State) {
  cell.set('selected', null);
  state.selected = null;
}

function selectCell(cell: Cell, state: State) {
  cell.set('selected', 1);
  state.selected = cell;
}

export function clickOnBall(cell: Cell, state: State) {
  if (cell.get('selected')) {
    unselectCell(cell, state);
  } else {
    if (state.selected) {
      unselectCell(state.selected, state);
    }
    selectCell(cell, state);
  }
}

function moveBall(fromCell: Cell, toCell: Cell) {
  toCell.set('ball', fromCell.get('ball'));
  fromCell.set('ball', null);
}

export function clickOnEmptyOrIntendedCell(cell: Cell, allCells: Cell[], state: State) {
  if (!state.selected || !state.trace) {
    return;
  }

  const selectedCell = getAt(allCells, state.selected.x, state.selected.y);

  moveBall(selectedCell, cell);
  unselectCell(selectedCell, state);
  clearTrace(state);

  // TODO Add `wipe()` logic.
}
