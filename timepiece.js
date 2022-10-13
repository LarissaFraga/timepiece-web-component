const tpl = document.createElement('template');
tpl.innerHTML = `
<svg width="100" height="100">
  <g transform="translate(50, 50)" stroke="black" fill="none" stroke-width="2">
    <circle cx="0" cy="0" r="45" />
    ${[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330]
      .map((a) => `<path d="M 0 -42 v -3" transform="rotate(${a})"/>`)
      .join("\n")}

    <path id="hours" d="M 0 0 v -32" stroke-width="4" />
    <path id="minutes" d="M 0 0 v -40" />
    <circle cx="0" cy="0" r="4" stroke="none" fill="black"/>
    <path id="seconds" d="M 0 0 v -40" stroke="red"/>
    <circle cx="0" cy="0" r="2" stroke="none" fill="red"/>
  </g>
</svg>
`

class WcTimepiece extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
  }

  connectedCallback() {
    const type = this.getAttribute('type')
    if (type === 'clock') {
      this.shadowRoot.append(tpl.content.cloneNode(true))
      this.updateClockTimepiece()
      this.intervalId = setInterval(() => {
        this.updateClockTimepiece()
      }, 1000)
    } else {
      this.span = document.createElement('span')
      this.shadowRoot.append(this.span)
      this.updateDigitalTimepiece()
      this.intervalId = setInterval(() => {
        this.updateDigitalTimepiece()
      }, 1000)

    }

  }

  disconnectedCallback() {
    clearInterval(this.intervalId)
  }

  updateDigitalTimepiece() {
    const date = new Date()
    this.span.textContent = date.toLocaleTimeString()
  }

  updateClockTimepiece() {
    const date = new Date()

    const seconds = this.shadowRoot.getElementById('seconds')
    const minutes = this.shadowRoot.getElementById('minutes')
    const hours = this.shadowRoot.getElementById('hours')

    seconds.setAttribute('transform', `rotate(${(date.getSeconds() * 360) / 60})`)
    minutes.setAttribute('transform', `rotate(${((date.getMinutes() + date.getMinutes() / 60) * 360) / 60})`)
    hours.setAttribute('transform', `rotate(${(((date.getHours() % 12) + date.getMinutes() / 60) * 360) / 12})`)
  }

}

customElements.define('wc-timepiece', WcTimepiece)