import { GameHistory } from './gameplay/history'
import { Runtime } from './gameplay/runtime'
import { Playground } from './playground'
import { Dialogs } from './dialogs'
import { Gameplay } from './gameplay/gameplay'

function init() {
  const gameHistory = new GameHistory()
  const runtime = new Runtime(gameHistory)
  const playground = new Playground()
  const dialogs = new Dialogs()
  const gameplay = new Gameplay(runtime, playground, gameHistory)
  gameplay.init()
}

window.addEventListener('load', init)
