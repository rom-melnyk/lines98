import { Playground } from './playground';
import { State } from './gameplay/state';

import * as gameplay from './gameplay/gameplay';

function init() {
  const playground = new Playground();
  const state = new State();

  // TODO remove after debugging.
  (window as any).L98 = {
    makeIntentions: () => gameplay.makeIntentions(state, playground),
    undoIntentions: () => gameplay.undoIntentions(state, playground),
    settleIntentions: () => gameplay.settleIntentions(state, playground),
  };
}

window.addEventListener('load', init);
