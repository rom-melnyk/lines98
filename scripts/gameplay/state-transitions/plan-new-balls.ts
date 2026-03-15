import { random, pickRandom } from '@rom98m/utils'
import * as constants from '../../constants'
import { Cell } from '../../cell'
import { State } from '../fsm/fsm'
import { Runtime } from '../runtime'
import { saveGame } from '../operations/load-save-operations'

export function planNewBalls(allCells: Cell[], runtime: Runtime): State {
  const availableCells = allCells.filter(cell => !cell.get('ball'))
  if (availableCells.length < constants.ballsPerDrop) return State.GAME_OVER

  for (let i = 0; i < constants.ballsPerDrop; i++) {
    const index = random(availableCells.length)
    const cell = availableCells.splice(index, 1)[0] // Splice from array and pick it.
    const newColor = pickRandom(constants.colors)

    cell.set('planned', newColor)
  }

  saveGame(allCells, runtime)
  return State.AWAITING_USER_ACTION
}