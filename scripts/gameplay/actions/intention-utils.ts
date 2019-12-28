import { Cell } from '../../cell';
import { State } from '../state';

export function undoIntentions(allCells: Cell[]): void {
  allCells
    .filter((cell) => cell.get('intention'))
    .forEach((cell) => cell.set('intention', null));
}


export function undoSettleIntention(state: State): void {
  state.lastSettled.forEach((cell) => cell.set('ball', null));
  state.lastSettled = [];
}
