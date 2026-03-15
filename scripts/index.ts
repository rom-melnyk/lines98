import { Runtime } from './gameplay/runtime'
import { Playground } from './playground'
import { Gameplay } from './gameplay/gameplay'
import { GameHistory } from './gameplay/history'

function init() {
  const history = new GameHistory()
  const runtime = new Runtime(history)
  const playground = new Playground()
  const gameplay = new Gameplay(runtime, playground)
  gameplay.init()
}

window.addEventListener('load', init)
