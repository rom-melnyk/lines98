import { Cell } from '../../cell'
import { Runtime } from '../runtime'

export function undoDrop(allCells: Cell[]): void {
  allCells
    .filter((cell) => cell.get('drop'))
    .forEach((cell) => cell.set('drop', null))
}


export function undoDropsToBalls(runtime: Runtime): void {
  runtime.lastSettled.forEach((cell) => cell.set('ball', null))
  runtime.lastSettled = []
}
