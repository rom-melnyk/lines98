import * as constants from './constants'

type CellProperties = 'ball' | 'drop' | 'trace' | 'selected'

export class Cell {
  public static fromSerialized(serialized: string) {
    const [coordsMarker, ballMarker, dropMarker] = serialized.split('|')

    const coords = coordsMarker.split(':')
    const x = Number(coords[0])
    const y = Number(coords[1])
    if (
      isNaN(x) || x < 0 || x >= constants.playgroundSize
      || isNaN(y) || y < 0 || y >= constants.playgroundSize
    ) {
      throw new Error(`Invalid coordinates "${coordsMarker}"`)
    }

    const ball = ballMarker ? Number(ballMarker) : null
    if (ball !== null && constants.colors.indexOf(ball) === -1) {
      throw new Error(`Unrecognized ball "${ballMarker}"`)
    }

    const drop = dropMarker ? Number(dropMarker) : null
    if (drop !== null && constants.colors.indexOf(drop) === -1) {
      throw new Error(`Unrecognized drop "${dropMarker}"`)
    }

    return { x, y, ball, drop }
  }

  private readonly htmlElement: HTMLDivElement
  private properties: { [key in CellProperties]: number } = {
    ball: null,
    drop: null,
    trace: null,
    selected: null,
  }

  constructor(
    public x: number,
    public y: number,
  ) {
    this.htmlElement = document.createElement('div')
    this.htmlElement.className = 'cell'
  }

  public getHtmlElement() {
    return this.htmlElement
  }

  public get(property: CellProperties): number {
    return this.properties[property]
  }

  public set(property: CellProperties, value: number): void {
    if (value) {
      this.htmlElement.setAttribute(property, `${value}`)
    } else {
      this.htmlElement.removeAttribute(property)
    }

    this.properties[property] = value
  }

  public serialize() {
    const coords = `${this.x}:${this.y}`
    const ball = this.get('ball') ? this.get('ball') : ''
    const drop = this.get('drop') ? this.get('drop') : ''
    return `${coords}|${ball}|${drop}`
  }
}
