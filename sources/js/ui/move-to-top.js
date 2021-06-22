import { debounce } from './utils/utils.js';
import './scss/move-to-top.scss';

class MoveToTop {
  constructor(options) {
    const defaults = {
      elemClass: 'js-move-to-top',
      scrollTop: 200,
    };

    this.settings = { ...defaults, ...options };
  }

  render() {
    const { elemClass, scrollTop } = this.settings;

    const btn = document.querySelector('#moveToTop');
    btn.classList.add(elemClass);

    window.addEventListener(
      'scroll',
      debounce(() => {
        if (
          document.body.scrollTop > scrollTop ||
          document.documentElement.scrollTop > scrollTop
        ) {
          btn.classList.remove('is-hidden');
        } else {
          btn.classList.add('is-hidden');
        }
      }, 300)
    );

    btn.addEventListener('click', () => {
      document.body.scrollTop = 0; // For Safari
      document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
    });
  }
}

export { MoveToTop as default };
