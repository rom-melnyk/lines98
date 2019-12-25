import * as constants from './constants';
import * as utils from './gameplay/utils';
import { Cell } from './cell';

export class Playground {
  private readonly cells: Cell[] = [];
  private palette: number = 1;
  private htmlElement: HTMLDivElement;

  constructor() {
    this.htmlElement = document.querySelector('.playground');
    this.setPalette(constants.palettes[0]);

    for (let y = 0; y < constants.playgroundSize; y++) {
      for (let x = 0; x < constants.playgroundSize; x++) {
        const cell = new Cell(x, y);
        this.cells.push(cell);
        this.htmlElement.appendChild(cell.getHtmlElement());
      }
    }
  }

  public getCellAt(x: number, y: number): Cell {
    return utils.getAt<Cell>(this.cells, x, y);
  }

  public setPalette(palette: number): void {
    this.htmlElement.classList.remove(`${this.palette}`);
    this.palette = palette;
    this.htmlElement.classList.add(`palette-${palette}`);
  }
}
