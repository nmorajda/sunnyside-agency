import { debounce } from './utils/utils.js';

class StickyHeader {
  constructor(options) {
    const defaults = {
      elemSelector: '.header',
      scrollTop: 120,
    };

    this.settings = { ...defaults, ...options };
  }

  init() {
    const { elemSelector, scrollTop } = this.settings;

    const elemSticky = document.querySelector(elemSelector);

    window.addEventListener(
      'scroll',
      debounce(() => {
        if (
          document.body.scrollTop > scrollTop ||
          document.documentElement.scrollTop > scrollTop
        ) {
          elemSticky.classList.add('is-sticky');
        } else {
          elemSticky.classList.remove('is-sticky');
        }
      }, 0)
    );
  }
}

export { StickyHeader as default };
