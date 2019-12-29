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

  private readonly scoreElement: HTMLSpanElement;
  constructor() {
    this.scoreElement = document.querySelector('.stats-panel .score');
  }

  public updateScore(cellsWiped: number) {
    // For each ball of minimal line the `cost` is added to the score.
    // For each ball over minimal line size the cost is increased by one:
    //  - line of 1..5 balls   = 5 * cost,
    //  - line of 6 balls      = 5 * cost + 2 * cost,
    //  - line of 7 balls      = 5 * cost + 2 * cost + 3 * cost,
    //  - line of 8 balls      = 5 * cost + 2 * cost + 3 * cost + 4 * cost,
    // ...and so on. Think "arithmetical progression".
    const cost = 1;
    const oversize = Math.abs(cellsWiped) - constants.lineSize;
    this.score += cellsWiped * cost;
    // Sum of arithmetical progression {from = 2; increment = 1; steps = oversize}.
    this.score += Math.sign(cellsWiped) * cost * (2 + oversize + 1) * oversize / 2;

    let score = this.score.toString(10);
    score = Array(5 - score.length).fill('0').join('') + score;
    this.scoreElement.innerText = score;
  }
}
