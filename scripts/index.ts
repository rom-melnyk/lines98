import { GameHistory } from './gameplay/history'
import { Runtime } from './gameplay/runtime'
import { Playground } from './playground'
import { Dialogs } from './dialogs'
import { Gameplay } from './gameplay/gameplay'

function init() {
  const history = new GameHistory()
  const runtime = new Runtime(history)
  const playground = new Playground()
  const dialogs = new Dialogs()
  const gameplay = new Gameplay(runtime, playground)
  gameplay.init()
}

window.addEventListener('load', init)
