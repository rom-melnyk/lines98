import { Cell } from '../../cell';
import { Runtime } from '../runtime';

export function undoIntentions(allCells: Cell[]): void {
  allCells
    .filter((cell) => cell.get('intention'))
    .forEach((cell) => cell.set('intention', null));
}


export function undoSettleIntention(runtime: Runtime): void {
  runtime.lastSettled.forEach((cell) => cell.set('ball', null));
  runtime.lastSettled = [];
}
