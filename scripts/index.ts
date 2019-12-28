import { Runtime } from './gameplay/runtime';
import { Playground } from './playground';
import { Gameplay } from './gameplay/gameplay';

function init() {
  const runtime = new Runtime();
  const playground = new Playground();
  const gameplay = new Gameplay(runtime, playground);
  gameplay.init();
}

window.addEventListener('load', init);
