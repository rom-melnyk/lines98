import { Runtime } from './runtime'
import { Playground } from '../playground'
import { Cell } from '../cell'

import { Fsm } from './fsm/fsm'
import { FsmNames } from './fsm/names'

import { clearTrace, drawTrace, findShortestPath } from './trace-utils'
import { dropNewBalls, moveDropsAwayFromExistingBalls, convertDropsToBalls, } from './actions/ball-drop-actions'
import { clickOnBall, clickOnEmptyOrDroppedCell, undoLastBallMove } from './actions/ui-handlers'
import { loadGame } from './operations/load-save-operations'

export class Gameplay {
  private readonly fsm = new Fsm()

  constructor(
    public runtime: Runtime,
    public playground: Playground,
  ) {
    this.playground.cells.forEach((cell) => {
      cell.getHtmlElement().addEventListener('click', this.createMouseClickHandler(cell))
      cell.getHtmlElement().addEventListener('mouseover', this.createMouseOverHandler(cell))
      cell.getHtmlElement().addEventListener('mouseout', () => clearTrace(this.runtime))
    })

    window.addEventListener('keypress', this.createKeypressHandler())
    const undoButton = document.querySelector('.stats-panel .undo')
    undoButton.addEventListener('click', () => undoLastBallMove(this.playground.cells, this.runtime, this.fsm))

    this.fsm.add(FsmNames.GAME_OVER, () => null)

    this.fsm.add(FsmNames.DROP_NEW_BALLS, () => dropNewBalls(this.playground.cells, this.runtime))
    this.fsm.add(FsmNames.NOTHING_SELECTED, () => null)
    this.fsm.add(FsmNames.BALL_SELECTED, () => null)
    this.fsm.add(FsmNames.NO_LINES_ON_BOARD, () => FsmNames.MOVE_DROPS_AWAY_FROM_EXISTING_BALLS)
    this.fsm.add(FsmNames.MOVE_DROPS_AWAY_FROM_EXISTING_BALLS, () => moveDropsAwayFromExistingBalls(this.playground.cells))
    this.fsm.add(FsmNames.CONVERT_DROPS_TO_BALLS, () => convertDropsToBalls(this.playground.cells, this.runtime))
    this.fsm.add(FsmNames.DROPS_CONVERTED_TO_BALLS, () => FsmNames.DROP_NEW_BALLS)
  }

  public init() {
    if (!loadGame(this.playground.cells, this.runtime)) {
      this.fsm.goTo(FsmNames.DROP_NEW_BALLS)
      this.fsm.goTo(FsmNames.CONVERT_DROPS_TO_BALLS)
    }
  }

  private createMouseClickHandler(cell: Cell) {
    return () => {
      if (cell.get('ball')) {
        clickOnBall(cell, this.runtime, this.fsm)
      } else {
        clickOnEmptyOrDroppedCell(cell, this.playground.cells, this.runtime, this.fsm)
      }
    }
  }

  private createMouseOverHandler(cell: Cell) {
    return () => {
      if (!this.runtime.selected) {
        return
      }

      clearTrace(this.runtime)
      this.runtime.trace = findShortestPath(this.runtime.selected, cell, this.playground.cells)
      drawTrace(this.runtime, this.runtime.selected.get('ball'))
    }
  }

  private createKeypressHandler() {
    return (e: KeyboardEvent) => {
      if (e.ctrlKey && (e.key === 'z' || e.key === 'Z')) {
        undoLastBallMove(this.playground.cells, this.runtime, this.fsm)
      }
    }
  }
}
