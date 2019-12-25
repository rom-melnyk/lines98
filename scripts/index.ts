import { Playground } from './playground';
import { State } from './gameplay/state';

function init() {
  const playground = new Playground();
  const state = new State();
}

window.addEventListener('load', init);
