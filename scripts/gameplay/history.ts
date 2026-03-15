import { Cell } from "../cell"

export class GameHistory {
  private _lastPlannedCells: Cell[] = []
  private _lastWipedCells: Cell[] = []
  private _lastWipedColor: number = null
  private _lastBallMove: [Cell, Cell] | null /* from, to */ = null

  public get lastWipedCells() { return this._lastWipedCells }
  public get lastBallMove() { return this._lastBallMove }

  public setWipedCells(cells: Cell[]) {
    this._lastWipedCells = cells
    this._lastWipedColor = cells[0]?.get('ball') ?? null
  }

  public undoWipe() {
    this._lastWipedCells.forEach(cell => cell.set('ball', this._lastWipedColor))
  }

  public clearWipedCells() {
    this._lastWipedCells = []
    this._lastWipedColor = null
  }

  public setBallMove(fromCell: Cell, toCell: Cell) {
    this._lastBallMove = [fromCell, toCell]
  }

  public clearBallMove() {
    this._lastBallMove = null
  }

  public setPlannedCells(cells: Cell[]) {
    this._lastPlannedCells = cells
  }

  public undoPlannedToBalls() {
    this._lastPlannedCells.forEach(cell => cell.set('ball', null))
    this._lastPlannedCells = []
  }
}
