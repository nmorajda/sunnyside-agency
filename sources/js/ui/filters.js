import { removeClass } from './utils/utils.js';
import './scss/filters.scss';

class Filters {
  constructor(elemContainer, options = {}) {
    const defaults = {
      btnAll: true,
      sortBtns: false,
      renderSelect: true,
    };

    this.settings = Object.assign({}, defaults, options);
    this.elemContainer = document.querySelector(elemContainer);
    this.items = this.elemContainer.querySelectorAll('[data-category]');
    this.btns = [];
  }

  createFilterBtn(filter, label, className = null) {
    const btn = document.createElement('button');

    btn.type = 'button';
    btn.setAttribute('data-filter', filter);
    btn.textContent = label || filter;

    if (className) {
      btn.classList.add(className);
    }

    return btn;
  }

  createBtns() {
    if (this.settings.btnAll) {
      this.btns.push(this.createFilterBtn('all', 'All', 'is-active'));
    }

    const items = [...this.elemContainer.querySelectorAll('[data-category]')];

    items.forEach(item => {
      let issetFilter = this.btns.some(
        btn => btn.dataset.filter === item.dataset.category
      );

      if (!issetFilter) {
        let filter = item.dataset.category;
        let label = item.dataset.label;
        this.btns.push(this.createFilterBtn(filter, label));
      }
    });
  }

  createSelect() {
    const select = document.createElement('select');
    select.setAttribute('id', 'filtersSelect');
    select.classList.add('display--sm');

    this.btns.forEach((btn, index) => {
      select[index] = new Option(btn.textContent, btn.dataset.filter);
    });

    select.addEventListener('change', e => {
      this.filter(e.target.value);
    });

    return select;
  }

  sortBtns() {
    this.btns.sort((a, b) => a.textContent.localeCompare(b.textContent));
  }

  renderFilters() {
    const filtersContainer = document.createElement('div');
    const btnsContainer = document.createElement('div');

    filtersContainer.classList.add('filters');
    btnsContainer.classList.add('filters__btns', 'is-hidden-touch');

    this.createBtns();

    if (this.settings.sortBtns) {
      this.sortBtns();
    }

    this.btns.forEach(btn => {
      btnsContainer.appendChild(btn);
    });

    filtersContainer.appendChild(btnsContainer);
    this.elemContainer.prepend(filtersContainer);

    // Click event
    btnsContainer.addEventListener('click', e => {
      if (!e.target.dataset.filter) {
        return;
      }

      this.filter(e.target.dataset.filter);
    });
  }

  setActiveBtn(value) {
    const btns = this.elemContainer.querySelectorAll('[data-filter]');

    btns.forEach(btn => {
      btn.classList.remove('is-active');

      if (btn.dataset.filter === value) {
        btn.classList.add('is-active');
      }
    });

    if (this.settings.renderSelect) {
      console.log('aas');
      this.elemContainer.querySelector('#filtersSelect').value = value;
    }
  }

  filter(value) {
    this.setActiveBtn(value);

    this.items.forEach(item => {
      item.classList.remove('hide');
      item.classList.add('show');

      if ((item.dataset.category !== value) & (value !== 'all')) {
        item.classList.remove('show');
        item.classList.add('hide');
      }
    });
  }

  init() {
    this.renderFilters();

    if (this.settings.renderSelect) {
      const filtersContainer = this.elemContainer.querySelector('.filters');
      filtersContainer.append(this.createSelect());
    }
  }
}

export { Filters as default };
