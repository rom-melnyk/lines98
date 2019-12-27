interface Position {
  x: number;
  y: number;
}

export class State {
  public selected: Position = null;
  public trace: Position[] = [];
  public lastSettled: Position[] = [];
  public lastWiped: Array<Position & { ball: number }> = [];
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
