import './scss/cookies.scss';

class Cookie {
  constructor(options) {
    const defaults = {
      name: '',
      val: '',
      days: '',
      path: '',
      domain: '',
      secure: '',
    };

    this.settings = { ...defaults, ...options };
  }

  getCookie() {
    const { name } = this.settings;

    if (document.cookie !== '') {
      const cookies = document.cookie.split(/; */);

      for (let i = 0; i < cookies.length; i++) {
        const cookieName = cookies[i].split('=')[0];
        const cookieVal = cookies[i].split('=')[1];

        if (cookieName === decodeURIComponent(name)) {
          return decodeURIComponent(cookieVal);
        }
      }
    }

    return false;
  }

  setCookie() {
    const { name, val, days, path, domain, secure } = this.settings;

    if (navigator.cookieEnabled) {
      const cookieName = encodeURIComponent(name);
      const cookieVal = encodeURIComponent(val);
      let cookieText = `${cookieName}=${cookieVal}`;

      if (typeof days === 'number') {
        const data = new Date();
        data.setTime(data.getTime() + days * 24 * 60 * 60 * 1000);
        cookieText += `; expires=${data.toGMTString()}`;
      }

      if (path) {
        cookieText += `; path=${path}`;
      }
      if (domain) {
        cookieText += `; domain=${domain}`;
      }
      if (secure) {
        cookieText += '; secure';
      }

      document.cookie = cookieText;
    }
  }

  renderCookieInfo(options) {
    const defaults = {
      cookieName: 'acceptCookies',
      acceptCookies: !!this.getCookie('acceptCookies'),
      text: 'Lorem ipsum dolor...',
    };

    const settings = { ...defaults, ...options };

    const container = document.createElement('DIV');
    const wrapper = document.createElement('DIV');
    const paragraph = document.createElement('P');
    const btnClose = document.createElement('BUTTON');

    container.setAttribute('class', 'cookie-info');
    wrapper.setAttribute('class', 'cookie-info__content');
    paragraph.setAttribute('class', 'cookie-info__text');
    paragraph.textContent = settings.text;
    btnClose.setAttribute('class', 'cookie-info__close');

    wrapper.insertAdjacentElement('afterbegin', paragraph);
    wrapper.insertAdjacentElement('beforeend', btnClose);
    container.insertAdjacentElement('afterbegin', wrapper);

    if (!settings.acceptCookies) {
      document.body.insertAdjacentElement('beforeend', container);
    }

    btnClose.addEventListener('click', () => {
      this.settings.val = true;
      this.setCookie();
      container.classList.add('is-hidden');
    });
  }
}

export { Cookie as default };
