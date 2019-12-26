import * as constants from '../constants';
import { random, getRandomElement } from './utils';

import { State } from './state';
import { Playground } from '../playground';
import { Cell } from '../cell';

export class Gameplay {
  constructor(
    public state: State,
    public playground: Playground,
  ) {}

  public makeIntentions(): void {
    const availableCells = this.playground.cells.filter((cell) => !cell.get('ball'));
    if (availableCells.length < constants.ballsPerIntention) {
      throw new constants.GameOver();
    }

    for (let i = 0; i < constants.ballsPerIntention; i++) {
      const index = random(availableCells.length);
      const cell = availableCells.splice(index, 1)[0]; // Splice from array and pick it.
      const intention = getRandomElement<number>(constants.colors);

      cell.set('intention', intention);
    }
  }

  public undoIntentions(): void {
    this.playground.cells
      .filter((cell) => cell.get('intention'))
      .forEach((cell) => {
        cell.set('intention', null);
      });
  }

  public settleIntentions(): void {
    this.state.lastSettled = [];

    this.playground.cells
      .filter((cell) => cell.get('intention'))
      .forEach((cell) => {
        const ball = cell.get('intention');
        cell.set('ball', ball);
        cell.set('intention', null);

        this.state.lastSettled.push({ x: cell.x, y: cell.y });
      });
  }

  public undoSettleIntention(): void {
    this.state.lastSettled.forEach((cellState) => {
      const cell = this.playground.getCellAt(cellState.x, cellState.y);
      cell.set('ball', null);
    });

    this.state.lastSettled = [];
  }

}
