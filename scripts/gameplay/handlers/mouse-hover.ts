import { getAt } from '../utils';
import { Cell } from '../../cell';
import { State } from '../state';
import { clearTrace, drawTrace } from './trace-utils';

function getDistanceBetween(cellA: Cell, cellB: Cell): number {
  const dx = cellA.x - cellB.x;
  const dy = cellA.y - cellB.y;
  return Math.sqrt(dx * dx + dy * dy);
}

function findDirectionFrom(fromCell: Cell, toCell: Cell, allCells: Cell[], visitedCells: Map<string, Cell>): Cell {
  const allDirections = [
    getAt(allCells, fromCell.x, fromCell.y + 1),
    getAt(allCells, fromCell.x, fromCell.y - 1),
    getAt(allCells, fromCell.x + 1, fromCell.y),
    getAt(allCells, fromCell.x - 1, fromCell.y),
  ].filter((cell) => {
    return cell && !cell.get('ball') && !visitedCells.get(cell.serializeCoords());
  }).sort((cellA, cellB) => {
    // Sort by distance to the `toCell`.
    return getDistanceBetween(cellA, toCell) - getDistanceBetween(cellB, toCell);
  });

  return allDirections [0];
}

function findShortPath(fromCell: Cell, toCell: Cell, allCells: Cell[]): Cell[] {
  const visitedCells: Map<string, Cell> = new Map();

  let path: Cell[] = [];
  let cell = fromCell;

  while (cell) {
    path.push(cell);
    visitedCells.set(cell.serializeCoords(), cell);

    if (cell === toCell) {
      return path;
    }

    cell = findDirectionFrom(cell, toCell, allCells, visitedCells);

    // If dead end detected, go back along the path until it's possible to go further.
    while (!cell && path.length > 1) {
      path.pop();
      cell = findDirectionFrom(path[path.length - 1], toCell, allCells, visitedCells);
    }
  }

  return [];
}

export function mouseOverCell(cell: Cell, allCells: Cell[], state: State) {
  if (!state.selected) {
    return;
  }

  clearTrace(state);

  const selectedCell = getAt(allCells, state.selected.x, state.selected.y);
  state.trace = findShortPath(selectedCell, cell, allCells);

  drawTrace(state, selectedCell.get('ball'));
}
