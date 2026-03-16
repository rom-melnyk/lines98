import * as constants from '../../constants'
import { Cell } from '../../cell'
import { getAt } from './playground-utils'

function followColorAlongLine(cell: Cell, allCells: Cell[], incX: -1 | 0 | 1, incY: -1 | 0 | 1): Cell[] {
  const result: Cell[] = []
  let { x, y } = cell
  let nextCell: Cell
  let shouldContinue = false

  do {
    x += incX
    y += incY
    nextCell = getAt(allCells, x, y)
    shouldContinue = nextCell && nextCell.get('ball') === cell.get('ball')
    if (shouldContinue) result.push(nextCell)
  } while (shouldContinue)

  return result
}

export function findCellsToWipe(cell: Cell, allCells: Cell[]): Cell[] {
  if (!cell.get('ball')) return []

  const cellsWithSameColor = [
    [cell].concat(
      followColorAlongLine(cell, allCells, 1, 0),     // E
      followColorAlongLine(cell, allCells, -1, 0),    // W
    ),
    [cell].concat(
      followColorAlongLine(cell, allCells, 0, 1),     // S
      followColorAlongLine(cell, allCells, 0, -1),    // N
    ),
    [cell].concat(
      followColorAlongLine(cell, allCells, 1, 1),     // SE
      followColorAlongLine(cell, allCells, -1, -1),   // NW
    ),
    [cell].concat(
      followColorAlongLine(cell, allCells, -1, 1),    // SW
      followColorAlongLine(cell, allCells, 1, -1),    // NE
    ),
  ]
    .filter(cells => cells.length >= constants.lineSize)
    .flat()

  return Array.from(new Set(cellsWithSameColor)) // unique cells
}
