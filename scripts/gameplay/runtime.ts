import * as constants from '../constants';
import { Cell } from '../cell';

export class Runtime {
  public selected: Cell = null;
  public trace: Cell[] = [];
  public lastSettled: Cell[] = [];
  public lastWipedCells: Cell[] = [];
  public lastWipedColor: number = null;
  public lastBallMove: [Cell, Cell] /* from, to */ = null;
  public score = 0;

  public updateScore(cellsWiped: number) {
    const increment = 1;
    const sign = Math.sign(cellsWiped);
    cellsWiped = Math.abs(cellsWiped);
    while (cellsWiped > 0) {
      const perHopIncrement = cellsWiped > constants.lineSize
        ? (cellsWiped - constants.lineSize) * increment
        : increment;
      this.score += sign * perHopIncrement;
      cellsWiped--;
    }
  }
}
