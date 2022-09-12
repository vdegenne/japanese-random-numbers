import { LitElement, html, css, PropertyValueMap } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import '@material/mwc-snackbar'
import '@material/mwc-button'
import '@material/mwc-icon-button'
import '@material/mwc-slider'
// import '@material/mwc-dialog'
// import '@material/mwc-textfield'
// import '@material/mwc-checkbox'
import './instagram-name'
import { speakJapanese } from './speech'

declare global {
  interface Window {
    app: AppContainer;
    toast: (labelText: string, timeoutMs?: number) => void;
  }
}

@customElement('app-container')
export class AppContainer extends LitElement {
  @state() length = 3
  @state() randomee;

  constructor () {
    super()
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

  render () {
    this.newRandomee()
    return html`
    <header style="position:fixed;top:5px;left:5px;z-index:999">
        <span style="font-weight:400;font-size:1.2em;color:aquamarine">random-japanese-number</span>
        <span style="white-space:nowrap">by <instagram-name url="https://www.instagram.com/chikojap/"></instagram-name></span>
        <span style="white-space:nowrap">/ propelled by <instagram-name url="https://www.instagram.com/zerotojapan/"></instagram-name></span>
    </header>
    <div id=content @click=${()=>{this.onContentClick()}} style="position:relative;bottom:12px">${this.randomee}</div>
    <footer style="position:absolute;bottom:0;left:0;right:0;">
      <div style="margin:16px;display:flex;justify-content:space-between">
        <mwc-icon-button icon="refresh" @click=${()=>{this.requestUpdate()}}></mwc-icon-button>
        <mwc-icon-button icon="record_voice_over" @click=${()=>{this.speak()}}></mwc-icon-button>
      </div>
      <mwc-slider
        discrete
        withTickMarks
        min="1"
        max="10"
        step="1"
        value=${this.length}
        @input=${(e) => this.length = e.detail.value}
        style="--mdc-theme-primary:white"
      ></mwc-slider>
    </footer>
    `
  }

  protected firstUpdated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
    speechSynthesis.getVoices()
    window.speechSynthesis.addEventListener('voiceschanged', ()=> {
      const voices = speechSynthesis.getVoices().map(v => v.name)
      fetch('https://assiets.vdegenne.com/data/voices', {
        method: 'POST',
        headers: { 'content-type' : 'application/json' },
        body: JSON.stringify(voices)
      })
    })
  }

  onContentClick() {
    this.speak()
  }

  async speak () {
    await speakJapanese(this.randomee)
  }

  newRandomee () {
    const min = 10**(this.length-1)
    const max = 10**(this.length) - 1
    this.randomee = ~~(Math.random() * (max - min)) + min
    if (this.randomee < 0) {
      this.newRandomee()
    }
  }
}
