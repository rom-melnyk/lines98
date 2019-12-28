import { Cell } from '../cell';

export class State {
  public selected: Cell = null;
  public trace: Cell[] = [];
  public lastSettled: Cell[] = [];
  public lastWipedCells: Cell[] = [];
  public lastWipedColor: number = null;
  public lastBallMove: [Cell, Cell] /* from, to */ = null;
  public score = 0;

  constructor() {}

  public serialize(): string {
    // TODO Implement me!
    return '';
  }

  public parse(serializedData: string): void {
    // TODO Implement me!
  }
}
