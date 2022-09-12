import gameControl from 'gamecontroller.js/src/gamecontrol.js'
import { shuffle } from './audio';
import { AppContainer } from './main'

export class ControllerController {
  private app: AppContainer;

  // private secondary =false

  constructor (appInstance: AppContainer) {
    this.app = appInstance;
    gameControl.on('connect', gamepad=>{
      gamepad
      .before('button0', ()=>{
        shuffle()
        this.app.requestUpdate()
      })

      .before('button6', () => {
        this.app.speakEnglish()
      })

      .before('button7', ()=>{
        this.app.speak()
      })

      .before('button14', async () => {
        this.app.slider.value--;
        await this.app.slider.updateComplete
        this.app.length = this.app.slider.value;
        shuffle()
      })
      .before('button15', async () => {
        this.app.slider.value++;
        await this.app.slider.updateComplete
        this.app.length = this.app.slider.value;
        shuffle()
      })
    })
  }
}