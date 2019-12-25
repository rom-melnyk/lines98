import { State } from './gameplay/state';
import { Playground } from './playground';

import * as gameplay from './gameplay/gameplay';

function init() {
  const state = new State();
  const playground = new Playground();

  // TODO remove after debugging.
  (window as any).L98 = {
    makeIntentions: () => gameplay.makeIntentions(state, playground),
    undoIntentions: () => gameplay.undoIntentions(state, playground),
    settleIntentions: () => gameplay.settleIntentions(state, playground),
    unsetBalls: () => gameplay.unsetBalls(state, playground),
  };
}

window.addEventListener('load', init);
