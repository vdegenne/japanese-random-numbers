import { LitElement, html, css, PropertyValueMap } from 'lit'
import { customElement, query, state } from 'lit/decorators.js'
import '@material/mwc-snackbar'
import '@material/mwc-button'
import '@material/mwc-icon-button'
import '@material/mwc-slider'
// import '@material/mwc-dialog'
// import '@material/mwc-textfield'
// import '@material/mwc-checkbox'
import './instagram-name'
import { speakEnglish, speakJapanese } from './speech'
import { ControllerController } from './ControllerController'
import { shuffle } from './audio'
import { Slider } from '@material/mwc-slider'

declare global {
  interface Window {
    app: AppContainer;
    toast: (labelText: string, timeoutMs?: number) => void;
  }
}

@customElement('app-container')
export class AppContainer extends LitElement {
  @state() length = 3
  @state() randomee!: number;

  constructor () {
    super()
    new ControllerController(this)
  }

  static styles = css`
  :host {
    display: flex;
    flex-direction: column;
    height: 100vh;
    background-color: #212121;
    color: white;
  }

  #content {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 4em;
    cursor: pointer;
  }
  `

  @query('mwc-slider') slider!: Slider

  render () {
    this.newRandomee()
    return html`
    <header style="position:fixed;top:5px;left:5px;z-index:999">
        <span style="font-weight:400;font-size:1.2em;color:aquamarine">Japanese Numbers Practice</span>
        <span style="white-space:nowrap">by <instagram-name url="https://www.instagram.com/chikojap/"></instagram-name></span>
        <!-- <span style="white-space:nowrap">/ promoted by <instagram-name url="https://www.instagram.com/zerotojapan/"></instagram-name></span> -->
    </header>
    <div id=content @click=${()=>{this.onContentClick()}} style="position:relative;bottom:12px">${this.randomee}</div>
    <footer style="position:absolute;bottom:4px;left:4px;right:4px;display:flex">
      <mwc-icon-button icon="refresh" @click=${()=>{shuffle(); this.requestUpdate()}}></mwc-icon-button>
      <mwc-slider
        discrete
        withTickMarks
        min="1"
        max="10"
        step="1"
        value=${this.length}
        @input=${(e) => this.length = e.detail.value}
        style="--mdc-theme-primary:white;flex:1"
      ></mwc-slider>
      <mwc-icon-button icon="record_voice_over" @click=${()=>{this.speak()}}></mwc-icon-button>
    </footer>
    `
  }

  protected async firstUpdated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): Promise<void> {
    speechSynthesis.getVoices()
    window.speechSynthesis.addEventListener('voiceschanged', ()=> {
      const voices = speechSynthesis.getVoices().map(v => v.name)
      fetch('https://assiets.vdegenne.com/data/voices', {
        method: 'POST',
        headers: { 'content-type' : 'application/json' },
        body: JSON.stringify(voices)
      })
    })

    await this.updateComplete
    this.slider.layout()
  }

  onContentClick() {
    this.speak()
  }

  async speak () {
    let input:string = ''+this.randomee
    if (this.randomee == 50) {
      input = 'ごじゅう'
    }
    await speakJapanese(input)
  }

  async speakEnglish() {
    await speakEnglish(''+this.randomee)
  }

  newRandomee () {
    const min = 10**(this.length-1)
    const max = 10**(this.length)
    this.randomee = ~~(Math.random() * (max - min)) + min
    if (this.randomee < 0) {
      this.newRandomee()
    }
  }
}
