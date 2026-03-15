import * as constants from '../constants'
import { Cell } from '../cell'
import { GameHistory } from './history'

export class Runtime {
  public clicked: Cell = null
  public selected: Cell = null
  public trace: Cell[] = []
  public score = 0

  public readonly history: GameHistory

  private readonly scoreElement: HTMLSpanElement
  constructor(history: GameHistory) {
    this.scoreElement = document.querySelector('.stats-panel .score')
    this.history = history
  }

  public updateScore(cellsWiped: number) {
    // For each ball of minimal line the `cost` is added to the score.
    // For each ball over minimal line size the cost is increased by one:
    //  - line of 1..5 balls   = 5 * cost,
    //  - line of 6 balls      = 5 * cost + 2 * cost,
    //  - line of 7 balls      = 5 * cost + 2 * cost + 3 * cost,
    //  - line of 8 balls      = 5 * cost + 2 * cost + 3 * cost + 4 * cost,
    // ...and so on. Think "arithmetical progression".
    const cost = 1
    const oversize = Math.abs(cellsWiped) - constants.lineSize
    this.score += cellsWiped * cost
    // Sum of arithmetical progression {from = 2; increment = 1; steps = oversize}.
    this.score += Math.sign(cellsWiped) * cost * (2 + oversize + 1) * oversize / 2

    const score = this.score.toString(10).padStart(5, '0')
    this.scoreElement.innerText = score
  }

  public moveBall(fromCell: Cell, toCell: Cell) {
    toCell.set('ball', fromCell.get('ball'))
    fromCell.set('ball', null)
    this.history.setBallMove(fromCell, toCell)
  }

  public wipeCells(cells: Cell[]) {
    this.history.setWipedCells(cells)
    cells.forEach(cell => cell.set('ball', null))
    this.updateScore(cells.length)
  }

  public clearWipedFlag() {
  }

  public undo(allCells: Cell[]) {
    const [fromCell, toCell] = this.history.lastBallMove ?? []
    if (!fromCell || !toCell) return

    // 1. Undo wipe
    this.history.undoWipe()
    this.updateScore(-this.history.lastWipedCells.length)
    this.history.clearWipedCells()

    // 2.Undo currently planned
    allCells.forEach(cell => {
      if (cell.get('planned')) cell.set('planned', null) }
    )

    // 3. Undo "previously planned -> balls" transition
    this.history.undoPlannedToBalls()

    // 4. Undo last ball move
    this.moveBall(toCell, fromCell)
    this.history.clearBallMove()
  }

  public undoWipe() {
  }

  public unselectCell(cell: Cell) {
    cell.set('selected', null)
    this.selected = null
  }

  public selectCell(cell: Cell) {
    cell.set('selected', 1)
    this.selected = cell
  }
}
