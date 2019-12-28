import * as constants from '../../constants';
import { Cell } from '../../cell';
import { State } from '../state';
import { getAt } from '../playground-utils';

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

/**
 * Does not include current cell!
 */
function followColor(cell: Cell, allCells: Cell[], incX: -1 | 0 | 1, incY: -1 | 0 | 1): Cell[] {
  const result: Cell[] = [];
  let { x, y } = cell;
  let nextCell: Cell;
  let shouldContinue = false;

  do {
    x += incX;
    y += incY;
    nextCell = getAt(allCells, x, y);
    shouldContinue = nextCell && nextCell.get('ball') === cell.get('ball');
    if (shouldContinue) {
      result.push(nextCell);
    }
  } while (shouldContinue);

  return result.length >= (constants.lineSize - 1) ? result : [];
}

export function findCellsToWipe(allCells: Cell[]): Cell[] {
  const toWipe = new Set<Cell>();

  allCells
    .filter((cell) => cell.get('ball'))
    .forEach((cell) => {
      const cellsWithSameColor = [].concat(
        followColor(cell, allCells, 1, 0),
        followColor(cell, allCells, 0, 1),
        followColor(cell, allCells, 1, 1),
        followColor(cell, allCells, -1, 1),
      );
      cellsWithSameColor.forEach((cellWithSameColor) => toWipe.add(cellWithSameColor));
      if (cellsWithSameColor.length > 0) {
        toWipe.add(cell);
      }
    });

  return Array.from(toWipe);
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
