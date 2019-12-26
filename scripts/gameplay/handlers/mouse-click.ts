import { Cell } from '../../cell';
import { State } from '../state';
import { getAt } from '../utils';

function unselectCell(cell: Cell, state: State) {
  cell.set('selected', null);
  state.selected = null;
}

function selectCell(cell: Cell, state: State) {
  cell.set('selected', 1);
  state.selected = { x: cell.x, y: cell.y };
}

export function clickOnBall(cell: Cell, state: State) {
  if (cell.get('selected')) {
    unselectCell(cell, state);
  } else if (!state.selected) {
    selectCell(cell, state);
  }
}

function moveBall(fromCell: Cell, toCell: Cell, state: State) {
  toCell.set('ball', fromCell.get('ball'));
  fromCell.set('ball', null);
  unselectCell(fromCell, state);
}

export function clickOnEmptyOrIntendedCell(cell: Cell, allCells: Cell[], state: State) {
  if (!state.selected || /* no route possible */ false) {
    return;
  }

  const selectedCell = getAt(allCells, state.selected.x, state.selected.y);
  moveBall(selectedCell, cell, state);
  // TODO Add `wipe()` logic.
}
