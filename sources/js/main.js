import '../scss/main.scss';
import LazyLoad from 'vanilla-lazyload';
import Gallery from './ui/lightbox';
import StickyHeader from './ui/sticky-header.js';
import MoveToTop from './ui/move-to-top.js';
import Cookie from './ui/cookie.js';

window.addEventListener('DOMContentLoaded', () => {
  const body = document.body;
  const btnToggle = document.querySelector('.btn-toggle');
  const header = document.querySelector('.header');
  const dropdown = document.querySelectorAll('.has-dropdown');
  const emails = document.querySelectorAll('.js-email');

  // protect email address
  const email = {
    user: 'biuro',
    at: '@',
    domain: 'abmstudio.pl',
  };

  emails.forEach(element => {
    element.innerHTML = email.user + email.at + email.domain;
  });

  // Sticky Header
  const stickyHeader = new StickyHeader();
  stickyHeader.init();

  // Lazy Load
  const myLazyLoad = new LazyLoad({
    elements_selector: '.lazy',
    load_delay: 300,
  });

  const gallery = new Gallery('.gallery-items');
  gallery.init();

  // Copyright year
  const year = document.querySelector('.js-year');
  const today = new Date();
  year.textContent = today.getFullYear();

  // Move to top
  const toTop = new MoveToTop({ scrollTop: 400 });
  toTop.render();

  // Cookie
  const cookie = new Cookie({
    name: 'acceptCookies',
    value: false,
    days: 30,
  });

  cookie.renderCookieInfo({
    text:
      'Używamy plików cookies, aby zapewnić Ci najlepszą możliwą obsługę na naszej stronie. Kontynuując wyrażasz zgodę na stosowanie przez nas plików cookies.',
  });

  // mobile menu toggle
  const handleBtnToggle = () => {
    body.classList.toggle('overflow-hidden');
    btnToggle.classList.toggle('btn-toggle--active');
    header.classList.toggle('mobile-nav--active');
  };

  const disabledMobileMenu = () => {
    body.classList.remove('overflow-hidden');
    btnToggle.classList.remove('btn-toggle--active');
    header.classList.remove('mobile-nav--active');
  };

  // dropdown
  const handleDropdown = e => {
    if (e.target.closest('.has-dropdown')) {
      e.preventDefault();
      const current = e.target.closest('.has-dropdown');

      // disabled all dropdown without clicked
      dropdown.forEach(content => {
        if (content !== current) {
          content.classList.remove('is-active');
        }
      });

      current.classList.toggle('is-active');
    }
  };

  // EVENTS
  // mobile menu open/close
  btnToggle.addEventListener('click', handleBtnToggle);

  // dropdown menu
  document.addEventListener('click', handleDropdown);

  // disabled mobile menu if click on menu item or overlay
  document.body.addEventListener('click', e => {
    if (
      e.target.classList.contains('header__nav__link') ||
      e.target.classList.contains('overlay')
    ) {
      disabledMobileMenu();
    }
  });
});
