function init() {
  const playgroundEl: HTMLDivElement = document.querySelector('.playground');
  playgroundEl.classList.add('palette-1');

  const fieldSize = 9;
  for (let x = 0; x < fieldSize; x++) {
    for (let y = 0; y < fieldSize; y++) {
      const buttonEl = document.createElement('div');
      buttonEl.className = 'cell';
      playgroundEl.appendChild(buttonEl);
    }
  }
}

window.addEventListener('load', init);
