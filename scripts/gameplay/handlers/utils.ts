import { Cell } from '../../cell';
import { State } from '../state';
import { getAt } from '../utils';

export function drawTrace(allCells: Cell[], state: State, trace: number) {
  state.trace.forEach((coords) => {
    const cell = getAt(allCells, coords.x, coords.y);
    if (cell) {
      cell.set('trace', trace);
    }
  });
}
