import * as constants from '../constants';

export interface Position {
  x: number;
  y: number;
}

export interface CellState extends Position{
  ball: number;
  intention: number;
}

export class State {
  public cells: CellState[] = [];
  public selected: Position = null;
  public destination: Position = null;
  public lastCells: CellState[] = [];

  constructor() {
    for (let y = 0; y < constants.playgroundSize; y++) {
      for (let x = 0; x < constants.playgroundSize; x++) {
        this.cells.push({ x, y, ball: null, intention: null });
      }
    }
  }

  public serialize(): string {
    // TODO Implement me!
    return '';
  }

  public parse(): void {
    // TODO Implement me!
  }
}
