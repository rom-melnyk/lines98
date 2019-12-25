type CellProperties = 'ball' | 'intention' | 'trace';

export class Cell {
  private readonly htmlElement: HTMLDivElement;

  private ball: number = null;
  private intention: number = null;
  private trace: number = null;

  constructor(
    public x: number,
    public y: number,
  ) {
    this.htmlElement = document.createElement('div');
    this.htmlElement.className = 'cell';
    // this.htmlElement.addEventListener('click', this.clickHandler.bind(this));
  }

  public getHtmlElement() {
    return this.htmlElement;
  }

  public get(property: CellProperties): number {
    switch (property) {
      case 'ball':
        return this.ball;
      case 'intention':
        return this.intention;
      case 'trace':
        return this.trace;
      default:
        throw new Error(`Cell does not have property .${property}`);
    }
  }

  public set(property: CellProperties, value: number): void {
    if (value) {
      this.htmlElement.setAttribute(property, `${value}`);
    } else {
      this.htmlElement.removeAttribute(property);
    }

    this[property] = value;
  }
}
