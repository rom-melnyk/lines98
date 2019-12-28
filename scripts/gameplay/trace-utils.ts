import { getAt } from './playground-utils';
import { Cell } from '../cell';
import { State } from './state';

function getDistanceBetween(cellA: Cell, cellB: Cell): number {
  const dx = cellA.x - cellB.x;
  const dy = cellA.y - cellB.y;
  return Math.sqrt(dx * dx + dy * dy);
}

function findNeighborsOf(fromCell: Cell, toCell: Cell, allCells: Cell[], visitedCells: Set<Cell>): Cell[] {
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

export function findShortestPath(fromCell: Cell, toCell: Cell, allCells: Cell[]): Cell[] {
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
      const neighbors = findNeighborsOf(cell, toCell, allCells, visitedCells);

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

    cell = findNeighborsOf(cell, toCell, allCells, visitedCells)[0];

    // If dead end detected, go back along the path until it's possible to go further.
    while (!cell && path.length > 1) {
      path.pop();
      cell = findNeighborsOf(path[path.length - 1], toCell, allCells, visitedCells)[0];
    }
  }

  return [];
}

export function clearTrace(state: State) {
  state.trace.forEach((cell) => cell.set('trace', null));
  state.trace = [];
}

export function drawTrace(state: State, color: number) {
  state.trace.forEach((cell) => cell.set('trace', color));
}
