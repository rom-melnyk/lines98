import { State } from '../state';

export function clearTrace(state: State) {
  state.trace.forEach((cell) => cell.set('trace', null));
  state.trace = [];
}

export function drawTrace(state: State, color: number) {
  state.trace.forEach((cell) => cell.set('trace', color));
}
