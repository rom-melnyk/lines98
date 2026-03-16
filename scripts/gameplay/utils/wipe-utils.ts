import { Cell } from '../../cell'

// Constant must match the animation durations in `_cell.scss`
const WIPE_DURATION_MS = 170

export function animateWipe(cells: Cell[]): number {
  cells.forEach(cell => cell.set('wipe-animating', 1))
  return WIPE_DURATION_MS
}
