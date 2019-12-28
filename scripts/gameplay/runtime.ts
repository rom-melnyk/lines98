import { Cell } from '../cell';

export class Runtime {
  public selected: Cell = null;
  public trace: Cell[] = [];
  public lastSettled: Cell[] = [];
  public lastWipedCells: Cell[] = [];
  public lastWipedColor: number = null;
  public lastBallMove: [Cell, Cell] /* from, to */ = null;
  public score = 0;
}
