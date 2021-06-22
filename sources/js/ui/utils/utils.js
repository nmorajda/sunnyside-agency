/*
@param {Function} func the function to debounce
@param {number} [wait = 0] the number of milliseconds to delay
*/

const debounce = (func, wait = 1000) => {
  if (typeof func !== 'function') {
    throw new TypeError('Expected a function');
  }

  let timerId;

  return (...args) => {
    if (timerId) {
      clearTimeout(timerId);
    }

    timerId = setTimeout(() => {
      func.apply(null, args);
    }, wait);
  };
};

const removeClass = (elems, className) =>
  elems.forEach(elem => elem.classList.remove(className));

export { debounce, removeClass };
