import { State } from './gameplay/state';
import { Playground } from './playground';

import { Gameplay } from './gameplay/gameplay';

function init() {
  const state = new State();
  const playground = new Playground();
  const gameplay = new Gameplay(state, playground);

  // TODO remove after debugging.
  (window as any).L98 = gameplay;
  gameplay.makeIntentions();
  gameplay.makeIntentions();
  gameplay.makeIntentions();
  gameplay.settleIntentions();
}

window.addEventListener('load', init);
