import { FsmNames } from './names';

type FsmState = () => FsmState | FsmNames;

/**
 * Finite state machine implementation.
 * Each state is a function doing something and returning one of following:
 *   - next state,
 *   - next state name,
 *   - nothing (it means the "stable state" awaiting actions from the outer world).
 */
export class Fsm {
  private states: Map<FsmNames, FsmState> = new Map();

  constructor(
    private debug = false,
  ) {}

  public add(name: FsmNames, state: FsmState) {
    if (!name) {
      throw new Error(`Cannot add nameless FSM entity.`);
    }

    if (this.states.get(name)) {
      throw new Error(`FSM entity "${name}" already exists.`)
    }

    this.states.set(name, state);
  }

  public goTo(state: FsmState | FsmNames) {
    const stateToGo: FsmState = typeof state === 'string' ? this.states.get(state) : state;

    if (!stateToGo) {
      if (this.debug) {
        console.info('FSM: stable state; awaiting actions from outer world.');
      }
      return;
    }

    if (this.debug) {
      const nameEntry = Array.from(
        this.states.entries()
      ).find(([n, s]) => s === stateToGo);
      const name = nameEntry && nameEntry[0];
      console.info(`FSM: At state "${name}"`);
    }

    // Use `setTimeout(() => this.goTo(stateToGo()), 0)` in case in Stack overflow.
    this.goTo(stateToGo());
  }
}
