import { getAt } from '../utils';
import { Cell } from '../../cell';

function findPossibleDestinationsFrom(cell: Cell, allCells: Cell[], visitedCells: Map<string, Cell>): Cell[] {
  return [
    getAt(allCells, cell.x, cell.y - 1),
    getAt(allCells, cell.x, cell.y + 1),
    getAt(allCells, cell.x - 1, cell.y),
    getAt(allCells, cell.x + 1, cell.y),
  ].filter((cell) => {
    return cell && !cell.get('ball') && !visitedCells.get(cell.serializeCoords());
  });
}

export function findShortestPath(fromCell: Cell, toCell: Cell, allCells: Cell[]): Cell[] {
  const trace = fromCell.get('ball');
  const visitedCells: Map<string, Cell> = new Map();
  let shortestPath: Cell[] = [];

  let path: Cell[] = [];
  let cell = fromCell;

  while (cell) {
    path.push(cell);
    visitedCells.set(cell.serializeCoords(), cell);
    cell.set('trace', trace);

    // Found a path to `toCell`?
    if (cell === toCell) { // Yes: maybe consider path as shortest one and force dead end.
      if (shortestPath.length === 0 || path.length < shortestPath.length) {
        shortestPath = [...path];
      }
      cell = null;
    } else { // No: try going further.
      const possibleDestinations = findPossibleDestinationsFrom(cell, allCells, visitedCells);
      cell = possibleDestinations[0];
    }

    // If dead end detected, go back along the path until it's possible to go further.
    while (!cell && path.length > 1) {
      path.pop();
      cell = path[path.length - 1];
      const possibleDestinations = findPossibleDestinationsFrom(cell, allCells, visitedCells);
      cell = possibleDestinations[0];
    }
  }

  return shortestPath;
}
