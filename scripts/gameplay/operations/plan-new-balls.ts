import { random, pickRandom } from '@rom98m/utils'
import * as constants from '../../constants'
import { Cell } from '../../cell'

export function planNewBalls(availableCells: Cell[]) {
  for (let i = 0; i < constants.ballsPerDrop; i++) {
    const index = random(availableCells.length)
    const cell = availableCells.splice(index, 1)[0] // Splice from array and pick it.
    const newColor = pickRandom(constants.colors)

    cell.set('planned', newColor)
  }
}