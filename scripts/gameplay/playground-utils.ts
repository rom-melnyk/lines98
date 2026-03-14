import * as constants from '../constants'

export function getAt<T extends any>(array: T[], x: number, y: number): T {
  if (x < 0 || x >= constants.playgroundSize || y < 0 || y >= constants.playgroundSize) {
    return null
  }

  return array[y * constants.playgroundSize + x]
}
