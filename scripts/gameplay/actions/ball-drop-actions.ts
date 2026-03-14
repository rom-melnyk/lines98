import { random, pickRandom } from '@rom98m/utils'
import * as constants from '../../constants'
import { Cell } from '../../cell'
import { FsmNames } from '../fsm/names'
import { Runtime } from '../runtime'
import { findCellsToWipe, } from '../operations/ball-operations'
import { saveGame } from '../operations/load-save-operations'

/**
 * @action
 * @return {FsmNames.GAME_OVER | FsmNames.NOTHING_SELECTED}
 */
export function dropNewBalls(allCells: Cell[], runtime: Runtime) {
  const availableCells = allCells.filter((cell) => !cell.get('ball'))
  if (availableCells.length < constants.ballsPerDrop) {
    return FsmNames.GAME_OVER
  }

  for (let i = 0; i < constants.ballsPerDrop; i++) {
    const index = random(availableCells.length)
    const cell = availableCells.splice(index, 1)[0]; // Splice from array and pick it.
    const newColor = pickRandom(constants.colors)

    cell.set('drop', newColor)
  }

  saveGame(allCells, runtime)
  return FsmNames.NOTHING_SELECTED
}

/**
 * @action
 * @return {FsmNames.GAME_OVER | FsmNames.CONVERT_DROPS_TO_BALLS}
 */
export function moveDropsAwayFromExistingBalls(allCells: Cell[]) {
  const dropsOverBalls = allCells.filter((cell) => cell.get('ball') && cell.get('drop'))
  const availableCells = allCells.filter((cell) => !cell.get('ball') && !cell.get('drop'))
  if (availableCells.length < dropsOverBalls.length) {
    return FsmNames.GAME_OVER
  }

  dropsOverBalls.forEach((source) => {
    const index = random(availableCells.length)
    const destination = availableCells.splice(index, 1)[0]; // Splice from array and pick it.
    destination.set('drop', source.get('drop'))
    source.set('drop', null)
  })

  return FsmNames.CONVERT_DROPS_TO_BALLS
}

/**
 * @action
 * @return {FsmNames.DROPS_CONVERTED_TO_BALLS}
 */
export function convertDropsToBalls(allCells: Cell[], runtime: Runtime) {
  runtime.lastSettled = allCells.filter((cell) => cell.get('drop'))
  runtime.lastSettled.forEach((cell) => {
    cell.set('ball', cell.get('drop'))
    cell.set('drop', null)
  })

  const cellsToWipe = findCellsToWipe(allCells)
  if (cellsToWipe.length > 0) {
    runtime.wipeCells(cellsToWipe)
  } else {
    runtime.clearWipedFlag()
  }

  return FsmNames.DROPS_CONVERTED_TO_BALLS
}
