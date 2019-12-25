type CellProperties = 'ball' | 'intention' | 'trace' | 'selected';

export class Cell {
  private readonly htmlElement: HTMLDivElement;
  private properties: { [key in CellProperties]: number } = {
    ball: null,
    intention: null,
    trace: null,
    selected: null,
  };

  constructor(
    public x: number,
    public y: number,
  ) {
    this.htmlElement = document.createElement('div');
    this.htmlElement.className = 'cell';
    this.htmlElement.addEventListener('click', this.handleClick.bind(this));
  }

  public getHtmlElement() {
    return this.htmlElement;
  }

  public get(property: CellProperties): number {
    return this.properties[property];
  }

  public set(property: CellProperties, value: number): void {
    if (value) {
      this.htmlElement.setAttribute(property, `${value}`);
    } else {
      this.htmlElement.removeAttribute(property);
    }

    this.properties[property] = value;
  }

  private handleClick() {
    if (!this.properties.ball) {
      return;
    }

    this.set('selected', this.properties.selected ? null : 1);
  }
}
