import * as constants from '../../constants';
import { Cell } from '../../cell';
import { Runtime } from '../runtime';
import { getAt } from '../playground-utils';

/**
 * IMPORTANT! `cell` is not always `runtime.selected`.
 */
export function unselectCell(cell: Cell, runtime: Runtime) {
  cell.set('selected', null);
  runtime.selected = null;
}

export function selectCell(cell: Cell, runtime: Runtime) {
  cell.set('selected', 1);
  runtime.selected = cell;
}

export function moveBall(fromCell: Cell, toCell: Cell, runtime: Runtime) {
  toCell.set('ball', fromCell.get('ball'));
  fromCell.set('ball', null);
  runtime.lastBallMove = [fromCell, toCell];
}

/**
 * Does not include current cell!
 */
function followColorAlongLine(cell: Cell, allCells: Cell[], incX: -1 | 0 | 1, incY: -1 | 0 | 1): Cell[] {
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
        followColorAlongLine(cell, allCells, 1, 0),
        followColorAlongLine(cell, allCells, 0, 1),
        followColorAlongLine(cell, allCells, 1, 1),
        followColorAlongLine(cell, allCells, -1, 1),
      );
      cellsWithSameColor.forEach((cellWithSameColor) => toWipe.add(cellWithSameColor));
      if (cellsWithSameColor.length > 0) {
        toWipe.add(cell);
      }
    });

  return Array.from(toWipe);
}

export function wipeCells(cells: Cell[], runtime: Runtime) {
  runtime.lastWipedCells = cells;
  runtime.lastWipedColor = cells[0].get('ball');
  cells.forEach((cell) => cell.set('ball', null));
}

export function clearWipedState(runtime: Runtime) {
  runtime.lastWipedCells = [];
  runtime.lastWipedColor = null;
}

export function undoWipe(runtime: Runtime) {
  runtime.lastWipedCells.forEach((cell) => cell.set('ball', runtime.lastWipedColor));
}
