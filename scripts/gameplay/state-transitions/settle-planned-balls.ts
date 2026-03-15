import { Cell } from '../../cell'
import { State } from "../fsm/fsm"
import { Runtime } from '../runtime'
import { findCellsToWipe } from '../operations/ball-operations'

export function settlePlannedBalls(allCells: Cell[], runtime: Runtime) {
  const lastPlannedCells = allCells.filter(cell => cell.get('planned'))
  runtime.history.setPlannedCells(lastPlannedCells)
  lastPlannedCells.forEach(cell => {
    cell.set('ball', cell.get('planned'))
    cell.set('planned', null)
  })

  // The `lastPlannedCells` might have built the lines which can be wiped
  const cellsToWipe = lastPlannedCells
    .map(cell => findCellsToWipe(cell, allCells))
    .flat()
  if (cellsToWipe.length > 0) {
    runtime.wipeCells(cellsToWipe)
  } else {
    runtime.history.clearWipedCells()
  }

  return State.PLAN_NEW_BALLS
}
