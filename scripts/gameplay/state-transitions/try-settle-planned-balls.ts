import { random } from '@rom98m/utils'
import { Cell } from '../../cell'
import { State } from '../fsm/fsm'

export function separatePlannedFromExistingBalls(allCells: Cell[]): State {
  const plannedExistingOverlaps = allCells.filter(cell => cell.get('ball') && cell.get('planned'))
  const availableCells = allCells.filter(cell => !cell.get('ball') && !cell.get('planned'))

  if (availableCells.length < plannedExistingOverlaps.length) return State.GAME_OVER

  plannedExistingOverlaps.forEach(source => {
    const index = random(availableCells.length)
    const destination = availableCells.splice(index, 1)[0] // Splice from array and pick it
    destination.set('planned', source.get('planned'))
    source.set('planned', null)
  })

  return State.SETTLE_PLANNED_BALLS
}
