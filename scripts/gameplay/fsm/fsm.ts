export enum State {
  GAME_OVER = 'game_over',
  PLAN_NEW_BALLS = 'plan_new_balls',
  AWAITING_USER_ACTION = 'awaiting_user_action',
  BALL_CELL_CLICKED = 'ball_cell_clicked',
  EMPTY_OR_PLANNED_CELL_CLICKED = 'empty_or_planned_cell_clicked',
  UNDO = 'undo',
  BALL_CAN_MOVE = 'ball_can_move',
  BALL_MOVED = 'ball_moved',
  TRY_SETTLE_PLANNED_BALLS = 'try_settle_planned_balls',
  SETTLE_PLANNED_BALLS = 'settle_planned_balls',
}

type TransitionFn = () => State | null

/**
 * Finite State Machine (FSM) + transitions.
 * Each state has a transition function. It's invoked when the state is entered.
 * Transition function returns:
 *   - next state name (means the state is transitory and showm must go on),
 *   - `null` (means the state is "stable"; FSM reached the terminal point and awaiting actions from the outer world).
 */
export class Fsm {
  private readonly stateTransitions: Map<State, TransitionFn> = new Map()
  private _current = null as State | null

  constructor(
    private readonly debug = false,
  ) {}

  public registerState(name: State, transitionFn: TransitionFn) {
    if (!name) {
      throw new Error(`Cannot add nameless FSM entity.`)
    }

    if (this.stateTransitions.get(name)) {
      throw new Error(`State "${name}" already registered.`)
    }

    this.stateTransitions.set(name, transitionFn)
  }

  public get currentState(): State { return this._current }

  public goTo(nextState: State) {
    if (!this.stateTransitions.has(nextState)) {
      console.error(`FSM: the state "${nextState}" was not registered`)
      return
    }

    let state = nextState
    do {
      this._current = state
      if (this.debug) {
        console.info(`FSM: entered "${state}"; executing transition…`)
      }

      const transitionFn = this.stateTransitions.get(state)
      state = transitionFn()
      if (this.debug) {
        console.info(state
          ? `     ↳ transiting to "${state}"`
          : `     ↳ settled; awaiting user action`
        )
      }
    } while (state != null)
  }
}

