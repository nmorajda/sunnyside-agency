import baguetteBox from 'baguettebox.js';
import 'baguettebox.js/dist/baguetteBox.min.css';

class LightBox {
  constructor(container, options) {
    const defaults = {};

    this.container = container;
    this.settings = { ...defaults, ...options };
  }

  init() {
    console.log(this.container);
    baguetteBox.run(this.container);
  }
}

export { LightBox as default };
