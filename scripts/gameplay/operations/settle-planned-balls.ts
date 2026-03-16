import { random } from '@rom98m/utils'
import { Cell } from '../../cell'
import { Runtime } from '../runtime'
import { findCellsToWipe } from '../utils/line-utils'

export function separatePlannedFromExistingBalls(allCells: Cell[]) {
  const plannedExistingOverlaps = allCells.filter(cell => cell.get('ball') && cell.get('planned'))
  const availableCells = allCells.filter(cell => !cell.get('ball') && !cell.get('planned'))

  // It might happen that it's not enought room for moving overlaps;
  // This will be turned to GAME_OVER in next FSM transition.
  while (availableCells.length > 0 && plannedExistingOverlaps.length > 0) {
    const planned = plannedExistingOverlaps.pop()
    const index = random(availableCells.length)
    const destination = availableCells.splice(index, 1)[0] // Splice from array and pick it
    destination.set('planned', planned.get('planned'))
    planned.set('planned', null)
  }
}

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
}
