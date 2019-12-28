import { Cell } from '../../cell';
import { State } from '../state';

/**
 * IMPORTANT! `cell` is not always `state.selected`.
 */
export function unselectCell(cell: Cell, state: State) {
  cell.set('selected', null);
  state.selected = null;
}

export function selectCell(cell: Cell, state: State) {
  cell.set('selected', 1);
  state.selected = cell;
}

export function moveBall(fromCell: Cell, toCell: Cell, state: State) {
  toCell.set('ball', fromCell.get('ball'));
  fromCell.set('ball', null);
  state.lastBallMove = [fromCell, toCell];
}

export function findCellsToWipe(allCells: Cell[]): Cell[] {
  // TODO Implement me!
  return [];
}

export function wipeCells(cells: Cell[], state: State) {
  state.lastWipedCells = cells;
  state.lastWipedColor = cells[0].get('ball');
  cells.forEach((cell) => cell.set('ball', null));
}

export function clearWipedState(state: State) {
  state.lastWipedCells = [];
  state.lastWipedColor = null;
}
