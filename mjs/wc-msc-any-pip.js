import { _wcl } from './common-lib.js';
import { _wccss } from './common-css.js';

/*
 reference:
 - documentPictureInPicture min-size: 300 x 300
 - https://developer.chrome.com/docs/web-platform/document-picture-in-picture/
*/


const defaults = {
  width: 0,
  height: 0
};
const booleanAttrs = []; // booleanAttrs default should be false
const objectAttrs = [];
const custumEvents = {
  piping: 'msc-any-pip-piping',
  pipingEnd: 'msc-any-pip-pip-end'
};

const template = document.createElement('template');
template.innerHTML = `
<style>
${_wccss}

:host{position:relative;display:block;}

.main {
  --icon-pip: path('M2.4,11.4v-2H6L1.7,5.1l1.4-1.4L7.4,8V4.4h2v7H2.4z M4.4,20.4c-0.5,0-1-0.2-1.4-0.6c-0.4-0.4-0.6-0.9-0.6-1.4v-5h2v5h8v2 H4.4z M20.4,13.4v-7h-9v-2h9c0.5,0,1,0.2,1.4,0.6c0.4,0.4,0.6,0.9,0.6,1.4v7H20.4z M14.4,20.4v-5h8v5H14.4z');

  --piping-text: var(--msc-any-pip-piping-text, 'Playing in Picture-in-Picture.');
  --piping-color: var(--msc-any-pip-piping-color, #39e75f);
  --piping-font-size: var(--msc-any-pip-piping-font-size, 16px);

  --btn-size: 40px;
  --btn-icon-color: rgba(255 255 255);
}

.btn-pip {
  --btn-scale-normal: 1;
  --btn-scale-active: 0;
  --btn-scale: var(--btn-scale-normal);

  --btn-opacity-normal: .5;
  --btn-opacity-active: .8;
  --btn-opacity: var(--btn-opacity-normal);

  --btn-background-color: rgba(0 0 0/var(--btn-opacity));
}

.main--active{}
.main--active::after{position:absolute;inset-inline-start:50%;inset-block-start:50%;transform:translate(-50%,-50%);inline-size:80%;text-align:center;text-wrap:balance;line-height:1.3;content:var(--piping-text);color:var(--piping-color);font-size:var(--piping-font-size);}
:is(.main--active,.main--active--not-support) .btn-pip{--btn-scale:var(--btn-scale-active);}

.main{position:relative;inline-size:100%;outline:0 none;}
.btn-pip{position:absolute;inset-inline-end:8px;inset-block-start:8px;inline-size:var(--btn-size);aspect-ratio:1/1;font-size:0;color:transparent;background:var(--btn-background-color);border-radius:var(--btn-size);padding:0;margin:0;appearance:none;border:0 none;box-shadow:none;display:grid;place-content:center;outline:0 none;overflow:hidden;scale:var(--btn-scale);transition:background-color 200ms ease-in-out,scale 150ms linear;}
.btn-pip::before{content:'';inline-size:24px;aspect-ratio:1/1;background-color:var(--btn-icon-color);display:block;clip-path:var(--icon-pip);}
.btn-pip:active{scale:.8;transition-duration:0ms;}
.btn-pip:focus-visible{--btn-opacity:var(--btn-opacity-active);}

.main__slot{position:relative;inline-size:100%;display:block;}
.main__slot::slotted(*){max-inline-size:100%;}
.main__slot::slotted(.msc-any-pip-cloned){visibility:hidden;opacity:0;pointer-events:none;}

@media (hover: hover) {
  .btn-pip:hover{--btn-opacity:var(--btn-opacity-active);}
}
</style>

<div class="main" ontouchstart="" tabindex="0">
  <slot class="main__slot"></slot>
  <button class="btn-pip" type="button" title="Picture in Picture" aria-label="Picture in Picture">pip</button>
</div>
`;

// Houdini Props and Vals, https://web.dev/at-property/
if (CSS?.registerProperty) {
  try {
    CSS.registerProperty({
      name: '--msc-any-pip-piping-font-size',
      syntax: '<length>',
      inherits: true,
      initialValue: '16px'
    });

    CSS.registerProperty({
      name: '--msc-any-pip-piping-color',
      syntax: '<color>',
      inherits: true,
      initialValue: '#39e75f'
    });
  } catch(err) {
    console.warn(`msc-any-pip: ${err.message}`);
  }
}

export class MscAnyPip extends HTMLElement {
  #data;
  #nodes;
  #config;

  constructor(config) {
    super();

    // template
    this.attachShadow({ mode: 'open', delegatesFocus: true });
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    // data
    this.#data = {
      controller: ''
    };

    // nodes
    this.#nodes = {
      styleSheet: this.shadowRoot.querySelector('style'),
      main: this.shadowRoot.querySelector('.main'),
      trigger: this.shadowRoot.querySelector('.btn-pip')
    };

    // config
    this.#config = {
      ...defaults,
      ...config // new MscAnyPip(config)
    };

    // evts
    this._onClick = this._onClick.bind(this);
  }

  async connectedCallback() {
    const { config, error } = await _wcl.getWCConfig(this);
    const { main, trigger } = this.#nodes;

    if (error) {
      console.warn(`${_wcl.classToTagName(this.constructor.name)}: ${error}`);
      this.remove();
      return;
    } else {
      this.#config = {
        ...this.#config,
        ...config
      };
    }

    // upgradeProperty
    Object.keys(defaults).forEach((key) => this.#upgradeProperty(key));

    // remove script[type=application/json]
    Array.from(this.querySelectorAll('script[type="application/json"]')).forEach((script) => script.remove());

    // not suppout
    if (!window?.documentPictureInPicture) {
      main.classList.add('main--active--not-support');
    }

    // evts
    this.#data.controller = new AbortController();
    const signal = this.#data.controller.signal;
    trigger.addEventListener('click', this._onClick, { signal });
  }

  disconnectedCallback() {
    if (this.#data?.controller) {
      this.#data.controller.abort();
    }
  }

  #format(attrName, oldValue, newValue) {
    const hasValue = newValue !== null;

    if (!hasValue) {
      if (booleanAttrs.includes(attrName)) {
        this.#config[attrName] = false;
      } else {
        this.#config[attrName] = defaults[attrName];
      }
    } else {
      switch (attrName) {
        case 'width':
        case 'height':
          this.#config[attrName] = _wcl.isNumeric(newValue) ? parseFloat(newValue) : defaults[attrName];
          break;
      }
    }
  }

  attributeChangedCallback(attrName, oldValue, newValue) {
    if (!MscAnyPip.observedAttributes.includes(attrName)) {
      return;
    }

    this.#format(attrName, oldValue, newValue);

    switch (attrName) {
      default:
        break;
    }
  }

  static get observedAttributes() {
    return Object.keys(defaults); // MscAnyPip.observedAttributes
  }

  static get supportedEvents() {
    return Object.keys(custumEvents).map(
      (key) => {
        return custumEvents[key];
      }
    );
  }

  #upgradeProperty(prop) {
    let value;

    if (MscAnyPip.observedAttributes.includes(prop)) {
      if (Object.prototype.hasOwnProperty.call(this, prop)) {
        value = this[prop];
        delete this[prop];
      } else {
        if (booleanAttrs.includes(prop)) {
          value = (this.hasAttribute(prop) || this.#config[prop]) ? true : false;
        } else if (objectAttrs.includes(prop)) {
          value = this.hasAttribute(prop) ? this.getAttribute(prop) : JSON.stringify(this.#config[prop]);
        } else {
          value = this.hasAttribute(prop) ? this.getAttribute(prop) : this.#config[prop];
        }
      }

      this[prop] = value;
    }
  }

  set width(value) {
    if (value) {
      this.setAttribute('width', value);
    } else {
      this.removeAttribute('width');
    }
  }

  get width() {
    const { width } = this.getBoundingClientRect();
    return this.#config.width !== 0 ? this.#config.width : width;
  }

  set height(value) {
    if (value) {
      this.setAttribute('height', value);
    } else {
      this.removeAttribute('height');
    }
  }

  get height() {
    const { height } = this.getBoundingClientRect();
    return this.#config.height !== 0 ? this.#config.height : height;
  }

  #fireEvent(evtName, detail) {
    this.dispatchEvent(new CustomEvent(evtName,
      {
        bubbles: true,
        composed: true,
        ...(detail && { detail })
      }
    ));
  }

  async _onClick() {
    const children = [...this.children];

    if (!children.length) {
      return;
    }

    const clones = children.map(
      (element) => {
        const clone = element.cloneNode(true);

        clone.classList.add('msc-any-pip-cloned');
        return clone;
      }
    );

    // pip
    const delta = 30;
    const pipWindow = await window?.documentPictureInPicture.requestWindow({
      width: this.width,
      height: this.height + delta
    });
    _wcl.cloneStyleSheetsToDocument(pipWindow.document);
    children.forEach((child) => pipWindow.document.body.append(child));
    clones.forEach((child) => this.append(child));

    this.#nodes.main.classList.toggle('main--active', true);
    this.#fireEvent(custumEvents.piping);

    // event
    pipWindow.addEventListener('pagehide',
      () => {
        clones.forEach((child) => child.remove());
        children.forEach((child) => this.append(child));

        this.#nodes.main.classList.toggle('main--active', false);
        this.#fireEvent(custumEvents.pipingEnd);
      },
      { once:true }
    );
  }
}

// define web component
const S = _wcl.supports();
const T = _wcl.classToTagName('MscAnyPip');
if (S.customElements && S.shadowDOM && S.template && !window.customElements.get(T)) {
  window.customElements.define(_wcl.classToTagName('MscAnyPip'), MscAnyPip);
}