class DigitalClock extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
                .clock {
                    font-size: 2em;
                    font-family: 'Arial', sans-serif;
                }
            </style>
            <div class="clock"></div>
        `;
    }

    connectedCallback() {
        this.updateTime();
        this.timer = setInterval(() => this.updateTime(), 1000);
    }

    disconnectedCallback() {
        clearInterval(this.timer);
    }

    updateTime() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        this.shadowRoot.querySelector('.clock').textContent = `${hours}:${minutes}:${seconds}`;
    }
}

customElements.define('digital-clock', DigitalClock);
