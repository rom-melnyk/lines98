import { getAt } from '../utils';
import { Cell } from '../../cell';
import { State } from '../state';
import { clearTrace, drawTrace } from './trace-utils';

function getDistanceBetween(cellA: Cell, cellB: Cell): number {
  const dx = cellA.x - cellB.x;
  const dy = cellA.y - cellB.y;
  return Math.sqrt(dx * dx + dy * dy);
}

function findDirectionsFrom(fromCell: Cell, toCell: Cell, allCells: Cell[], visitedCells: Set<Cell>): Cell[] {
  return [
    getAt(allCells, fromCell.x, fromCell.y + 1),
    getAt(allCells, fromCell.x, fromCell.y - 1),
    getAt(allCells, fromCell.x + 1, fromCell.y),
    getAt(allCells, fromCell.x - 1, fromCell.y),
  ].filter((cell) => {
    return cell && !cell.get('ball') && !visitedCells.has(cell);
  }).sort((cellA, cellB) => {
    // Sort by distance to the `toCell`.
    return getDistanceBetween(cellA, toCell) - getDistanceBetween(cellB, toCell);
  });
}

function findShortestPath(fromCell: Cell, toCell: Cell, allCells: Cell[]): Cell[] {
  const visitedCells = new Set<Cell>();

  const foundPaths: Map<Cell, Cell[]> = new Map();
  foundPaths.set(fromCell, [fromCell]);

  let cell = fromCell;
  const cellsToProceed: Cell[] = [];

  while (cell) {
    visitedCells.add(cell);

    const pathToCell = foundPaths.get(cell);
    const pathToFinalDestination = foundPaths.get(toCell);

    // If there is path to `toCell` and it's shorter than current one, it  does not make sense to proceed with current.
    if (!pathToFinalDestination || pathToFinalDestination.length > pathToCell.length + 1) {
      const neighbors = findDirectionsFrom(cell, toCell, allCells, visitedCells);

      neighbors.forEach((neighbor) => {
        const pathToNeighbor = foundPaths.get(neighbor);
        if (!pathToNeighbor || pathToNeighbor.length > pathToCell.length + 1) {
          foundPaths.set(neighbor, [...pathToCell, neighbor]);
        }
      });

      cellsToProceed.push(...neighbors);
    }

    // Pick next unvisited cell.
    do {
      cell = cellsToProceed.shift();
    } while (cell && visitedCells.has(cell));
  }

  return foundPaths.get(toCell) || [];
}

function findPath(fromCell: Cell, toCell: Cell, allCells: Cell[]): Cell[] {
  const visitedCells = new Set<Cell>();

  let path: Cell[] = [];
  let cell = fromCell;

  while (cell) {
    path.push(cell);
    visitedCells.add(cell);

    if (cell === toCell) {
      return path;
    }

    cell = findDirectionsFrom(cell, toCell, allCells, visitedCells)[0];

    // If dead end detected, go back along the path until it's possible to go further.
    while (!cell && path.length > 1) {
      path.pop();
      cell = findDirectionsFrom(path[path.length - 1], toCell, allCells, visitedCells)[0];
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
  state.trace = findShortestPath(selectedCell, cell, allCells);

  drawTrace(state, selectedCell.get('ball'));
}
