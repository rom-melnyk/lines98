import { FsmNames } from './names';

interface FsmState {
  transition?: FsmEntity | FsmNames;
}

type FsmAction = () => FsmEntity | FsmNames;

type FsmCondition = FsmAction; // Like FsmAction but has multiple return points.

type FsmEntity = FsmState | FsmAction | FsmCondition;

export class Fsm {
  private fsmEntities: Map<FsmNames, FsmEntity> = new Map();

  public add(name: FsmNames, stateOrActionOrCondition: FsmEntity) {
    if (!name) {
      throw new Error(`Cannot add nameless FSM entity.`);
    }

    if (this.fsmEntities.get(name)) {
      throw new Error(`FSM entity "${name}" already exists.`)
    }

    this.fsmEntities.set(name, stateOrActionOrCondition);
  }

  public goTo(stateOrActionOrCondition: FsmEntity | FsmNames) {
    const entityToGo: FsmEntity = typeof stateOrActionOrCondition === 'string'
      ? this.fsmEntities.get(stateOrActionOrCondition)
      : stateOrActionOrCondition;
    if (!entityToGo) {
      throw new Error(`FSM entity not found: "${stateOrActionOrCondition}"`);
    }

    if (typeof entityToGo === 'function') { // Action or Condition?
      this.goTo(entityToGo());
    } else if (entityToGo.transition) { // Transitional state?
      this.goTo(entityToGo.transition);
    } else {
      // Stable state; do nothing.
    }
  }
}
