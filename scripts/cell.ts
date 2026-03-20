import * as constants from './constants'

type CellProperties =
  | 'ball'
  | 'planned'
  | 'trace'
  | 'selected'
  | 'trace-animating'
  | 'wipe-animating'

export class Cell {
  public static fromSerialized(serialized: string) {
    const [coordsText, ballText, plannedText] = serialized.split('|')

    const coords = coordsText.split(':')
    const x = Number(coords[0])
    const y = Number(coords[1])
    if (
      isNaN(x) || x < 0 || x >= constants.playgroundSize
      || isNaN(y) || y < 0 || y >= constants.playgroundSize
    ) {
      throw new Error(`Invalid coordinates "${coordsText}"`)
    }

    const ball = ballText ? Number(ballText) : null
    if (ball !== null && constants.colors.indexOf(ball) === -1) {
      throw new Error(`Unrecognized ball "${ballText}"`)
    }

    const planned = plannedText ? Number(plannedText) : null
    if (planned !== null && constants.colors.indexOf(planned) === -1) {
      throw new Error(`Unrecognized planned color "${plannedText}"`)
    }

    return { x, y, ball, planned }
  }

  private readonly htmlElement: HTMLDivElement
  private properties: { [key in CellProperties]: number } = {
    ball: null,
    planned: null,
    trace: null,
    selected: null,
    'trace-animating': null,
    'wipe-animating': null,
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

  public get(property: CellProperties): number | null {
    return this.properties[property]
  }

  public set(property: CellProperties, value: number | null): void {
    if (value != null) {
      this.htmlElement.setAttribute(property, `${value}`)
      if (property === 'trace-animating') {
        this.htmlElement.style.setProperty('--trace-index', `${value}`)
      }
    } else {
      this.htmlElement.removeAttribute(property)
      if (property === 'trace-animating') {
        this.htmlElement.style.removeProperty('--trace-index')
      }
    }

    this.properties[property] = value
  }

  public reset() {
    Object.keys(this.properties)
      .forEach(prop => this.set(prop as CellProperties, null))
  }

  public serialize() {
    const coords = `${this.x}:${this.y}`
    const ball = this.get('ball') ? this.get('ball') : ''
    const planned = this.get('planned') ? this.get('planned') : ''
    return `${coords}|${ball}|${planned}`
  }
}
