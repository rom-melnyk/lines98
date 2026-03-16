import { Runtime } from './runtime'
import { Playground } from '../playground'
import { Cell } from '../cell'

import { Fsm, State } from './fsm/fsm'

import * as constants from '../constants'
import { animateTrace, clearTrace, drawTrace, findShortestPath } from './utils/trace-utils'
import { animateWipe } from './utils/wipe-utils'
import { planNewBalls, } from './operations/plan-new-balls'
import {
  separatePlannedFromExistingBalls,
  settlePlannedBalls
} from './operations/settle-planned-balls'
import { loadGame, saveGame } from './operations/load-save-operations'
import { findCellsToWipe } from './utils/line-utils'

export class Gameplay {
  private readonly fsm = new Fsm()
  private isAnimating = false

  constructor(
    public runtime: Runtime,
    public playground: Playground,
  ) {
    this.playground.cells.forEach(cell => {
      cell.getHtmlElement().addEventListener('click', this.createMouseClickHandler(cell))
      cell.getHtmlElement().addEventListener('mouseover', this.createMouseOverHandler(cell))
      cell.getHtmlElement().addEventListener('mouseout', () => clearTrace(this.runtime))
    })

    window.addEventListener('keypress', this.createKeypressHandler())
    const undoButton = document.querySelector('.stats-panel .undo')
    undoButton.addEventListener('click', () => this.fsm.goTo(State.UNDO))

    this.setupFSM()
  }

  public init() {
    const wasLoaded = loadGame(this.playground.cells, this.runtime)
    if (wasLoaded) {
      this.fsm.goTo(State.AWAITING_USER_ACTION)
    } else {
      // Start new game by placing 3 balls
      this.fsm.goTo(State.PLAN_NEW_BALLS)
      this.fsm.goTo(State.SETTLE_PLANNED_BALLS)
    }
  }

  private createMouseClickHandler(cell: Cell) {
    return () => {
      if (this.isAnimating) return
      this.runtime.clicked = cell
      if (cell.get('ball')) this.fsm.goTo(State.BALL_CELL_CLICKED)
      else this.fsm.goTo(State.EMPTY_OR_PLANNED_CELL_CLICKED)
    }
  }

  private createMouseOverHandler(cell: Cell) {
    return () => {
      if (this.isAnimating) return
      if (!this.runtime.selected) return

      clearTrace(this.runtime)
      this.runtime.trace = findShortestPath(this.runtime.selected, cell, this.playground.cells)
      drawTrace(this.runtime, this.runtime.selected.get('ball'))
    }
  }

  private createKeypressHandler() {
    return (e: KeyboardEvent) => {
      if (e.ctrlKey && (e.key === 'z' || e.key === 'Z')) this.fsm.goTo(State.UNDO)
    }
  }

  private setupFSM() {
    this.fsm.registerState(State.GAME_OVER, () => null)

    this.fsm.registerState(State.PLAN_NEW_BALLS, () => {
      const availableCells = this.playground.cells.filter(cell => !cell.get('ball'))
      if (availableCells.length < constants.ballsPerDrop) return State.GAME_OVER

      planNewBalls(availableCells)
      saveGame(this.playground.cells, this.runtime)
      return State.AWAITING_USER_ACTION
    })

    this.fsm.registerState(State.AWAITING_USER_ACTION, () => null)

    this.fsm.registerState(State.UNDO, () => {
      this.runtime.undo(this.playground.cells)
      return State.PLAN_NEW_BALLS
    })

    this.fsm.registerState(State.BALL_CELL_CLICKED, () => {
      const cell = this.runtime.clicked
      if (!cell) return
      this.runtime.clicked = null

      if (cell.get('selected')) this.runtime.unselectCell(cell)
      else {
        if (this.runtime.selected) this.runtime.unselectCell(this.runtime.selected)
        this.runtime.selectCell(cell)
      }

      return State.AWAITING_USER_ACTION
    })

    this.fsm.registerState(State.EMPTY_OR_PLANNED_CELL_CLICKED, () => {
      return (this.runtime.selected && this.runtime.trace.length > 0)
        ? State.BALL_CAN_MOVE
        : State.AWAITING_USER_ACTION
    })

    this.fsm.registerState(State.BALL_CAN_MOVE, () => {
      const from = this.runtime.selected
      const to = this.runtime.clicked
      const duration = animateTrace(this.runtime)

      this.isAnimating = true
      setTimeout(() => {
        this.isAnimating = false
        this.runtime.selected = from
        this.runtime.clicked = to
        this.fsm.goTo(State.BALL_MOVED)
      }, duration)

      return null
    })

    this.fsm.registerState(State.BALL_MOVED, () => {
      const lastMoveDestination = this.runtime.clicked
      if (!lastMoveDestination) return
      this.runtime.clicked = null

      this.runtime.moveBall(this.runtime.selected, lastMoveDestination)
      this.runtime.unselectCell(this.runtime.selected)
      clearTrace(this.runtime)

      const cellsToWipe = findCellsToWipe(lastMoveDestination, this.playground.cells)
      if (cellsToWipe.length > 0) {
        const duration = animateWipe(cellsToWipe)
        this.isAnimating = true
        setTimeout(() => {
          this.isAnimating = false
          this.runtime.wipeCells(cellsToWipe)
          this.fsm.goTo(State.AWAITING_USER_ACTION)
        }, duration)
        return null
      } else {
        return State.SETTLE_PLANNED_BALLS
      }
    })

    this.fsm.registerState(State.SETTLE_PLANNED_BALLS, () => {
      separatePlannedFromExistingBalls(this.playground.cells)
      settlePlannedBalls(this.playground.cells, this.runtime)
      return State.PLAN_NEW_BALLS
    })
  }
}
