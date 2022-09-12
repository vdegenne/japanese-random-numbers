import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';


@customElement('instagram-name')
export class InstagramName extends LitElement {
  @property() url = ''

  static styles = css`
  :host {
    display: inline-flex;
    align-items: center;
    vertical-align: bottom;
  }
  a {
    color: white;
  }
  `

  render () {
    const name = this.url.split('/').filter(el=>el).pop()
    return html`<img src="./img/instagram.ico" width="16px" style="margin-right:4px;" /> <a href="${this.url}" target="_blank">${name}</a>`
  }
}