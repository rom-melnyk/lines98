export enum DialogTypes {
  HOW_TO = 'how_to',
  GAME_OVER = 'game_over',
}

export class Dialogs {
  private readonly howToDialogHtmlElement: HTMLDialogElement
  private readonly howToTriggerHtmlElement: HTMLDivElement
  private readonly gameOverDialogHtmlElement: HTMLDialogElement

  constructor() {
    this.howToDialogHtmlElement = document.querySelector('dialog.how-to')!
    this.howToTriggerHtmlElement = document.querySelector('.how-to.link')!
    this.gameOverDialogHtmlElement = document.querySelector('dialog.game-over')!

    this.howToTriggerHtmlElement.addEventListener(
      'click',
      () => this.howToDialogHtmlElement.showModal()
    )

    ;[
      this.howToDialogHtmlElement,
      this.gameOverDialogHtmlElement,
    ].forEach(dialog => {
      dialog.querySelector('.close').addEventListener('click', () => dialog.close())
      dialog.addEventListener('click', e => { if (e.target === dialog) dialog.close() })
    });
  }

  public open(dialog: DialogTypes) {
    switch (dialog) {
      case DialogTypes.HOW_TO: {
        this.howToDialogHtmlElement.showModal()
        break
      }
      case DialogTypes.GAME_OVER: {
        this.gameOverDialogHtmlElement.showModal()
        break
      }
      default: {
        console.error(`❌ Unknown dialog type "${dialog}"`)
      }
    }
  }
}
