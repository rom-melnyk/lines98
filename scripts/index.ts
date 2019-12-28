import { State } from './gameplay/state';
import { Playground } from './playground';
import { Gameplay } from './gameplay/gameplay';

function init() {
  const state = new State();
  const playground = new Playground();
  const gameplay = new Gameplay(state, playground);
  gameplay.init();
}

window.addEventListener('load', init);
