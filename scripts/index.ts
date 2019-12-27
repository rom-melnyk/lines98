import { State } from './gameplay/state';
import { Playground } from './playground';

import { Gameplay } from './gameplay/gameplay';

function init() {
  const state = new State();
  const playground = new Playground();
  const gameplay = new Gameplay(state, playground);

  window.addEventListener('keypress', (e) => {
    if (e.ctrlKey && (e.key === 'z' || e.key === 'Z')) {
      gameplay.undoSettleIntention();
      gameplay.undoIntentions();
      gameplay.makeIntentions();
    }
  });

  gameplay.makeIntentions();
  gameplay.settleIntentions();
  gameplay.makeIntentions();
}

window.addEventListener('load', init);
