import { Runtime } from '../runtime';
import { Cell } from '../../cell';
import { getAt } from '../playground-utils';

const localStorageKey = 'Lines98';

interface Save {
  score: number;
  cells: string[];
}

export function loadGame(allCells: Cell[], runtime: Runtime): boolean {
  try {
    const { score, cells } = JSON.parse(localStorage.getItem(localStorageKey)) as Save;
    runtime.score = score;
    cells.forEach((serialized) => {
      const { x, y, ball, intention } = Cell.fromSerialized(serialized);
      const cell = getAt(allCells, x, y);
      cell.set('ball', ball);
      cell.set('intention', intention);
    });
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
}

export function saveGame(allCells: Cell[], runtime: Runtime) {
  const save: Save = {
    score: runtime.score,
    cells: allCells
      .filter((cell) => cell.get('ball') || cell.get('intention'))
      .map((cell) => cell.serialize())
  };
  localStorage.setItem(localStorageKey, JSON.stringify(save));
}
