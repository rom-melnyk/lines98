import { State } from './state';
import { Playground } from '../playground';
import { Cell } from '../cell';

import { Fsm } from './fsm/fsm';
import { FsmNames } from './fsm/names';

import { makeIntentions, separateIntentionsFromBalls, settleIntentions, } from './actions/intention-actions';
import { clickOnBall, clickOnEmptyOrIntendedCell } from './actions/ball-actions';
import { undoSettleIntention, undoIntentions } from './actions/intention-utils';
import { clearTrace, drawTrace, findShortestPath } from './trace-utils';
import { moveBall, undoWipe } from './actions/ball-utils';

export class Gameplay {
  private readonly fsm: Fsm;

  constructor(
    public state: State,
    public playground: Playground,
  ) {
    this.fsm = new Fsm();

    this.playground.cells.forEach((cell) => {
      cell.getHtmlElement().addEventListener('click', this.createMouseClickHandler(cell));
      cell.getHtmlElement().addEventListener('mouseover', this.createMouseOverHandler(cell));
      cell.getHtmlElement().addEventListener('mouseout', () => clearTrace(this.state));
    });

    window.addEventListener('keypress', this.createCtrlZHandler());

    this.fsm.add(FsmNames.GAME_OVER, {});
    this.fsm.add(FsmNames.NOTHING_SELECTED, {});
    this.fsm.add(FsmNames.BALL_SELECTED, {});
    this.fsm.add(FsmNames.NO_LINES_ON_BOARD, { transition: FsmNames.SEPARATE_INTENTIONS_FROM_BALLS });
    this.fsm.add(FsmNames.INTENTIONS_READY_TO_SETTLE, { transition: FsmNames.SETTLE_INTENTIONS });
    this.fsm.add(FsmNames.INTENTIONS_SETTLED, { transition: FsmNames.MAKE_INTENTIONS });

    this.fsm.add(FsmNames.MAKE_INTENTIONS, () => makeIntentions(this.playground.cells));
    this.fsm.add(FsmNames.SEPARATE_INTENTIONS_FROM_BALLS, () => separateIntentionsFromBalls(this.playground.cells));
    this.fsm.add(FsmNames.SETTLE_INTENTIONS, () => settleIntentions(this.playground.cells, this.state));
  }

  public init() {
    this.fsm.goTo(FsmNames.MAKE_INTENTIONS);
    this.fsm.goTo(FsmNames.SETTLE_INTENTIONS);
  }

  private createMouseClickHandler(cell: Cell) {
    return () => {
      if (cell.get('ball')) {
        clickOnBall(cell, this.state, this.fsm);
      } else {
        clickOnEmptyOrIntendedCell(cell, this.playground.cells, this.state, this.fsm);
      }
    };
  }

  private createMouseOverHandler(cell: Cell) {
    return () => {
      if (!this.state.selected) {
        return;
      }

      clearTrace(this.state);
      this.state.trace = findShortestPath(this.state.selected, cell, this.playground.cells);
      drawTrace(this.state, this.state.selected.get('ball'));
    };
  }

  private createCtrlZHandler() {
    return (e: KeyboardEvent) => {
      const isCtrlZ = e.ctrlKey && (e.key === 'z' || e.key === 'Z');
      if (!isCtrlZ || !this.state.lastBallMove) {
        return;
      }

      undoWipe(this.state);
      undoIntentions(this.playground.cells);
      undoSettleIntention(this.state);
      moveBall(this.state.lastBallMove[1], this.state.lastBallMove[0], this.state);
      this.state.lastBallMove = null;
      this.fsm.goTo(FsmNames.MAKE_INTENTIONS);
    }
  }
}
