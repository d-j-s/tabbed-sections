const WHITE_SPACE = /\s+/;

export function $(selector, ctx) {
  return (ctx || document).querySelector(selector);
}

export function $$(selector, ctx) {
  return Array.from((ctx || document).querySelectorAll(selector));
}

export function delegateClick(el, attribute, cb) {
  el.addEventListener('click', e => {
    if (e.target && e.target.getAttribute(attribute)) {
      cb(e);
    }
  }, true);
}

export function addClass(el, className) {
  el.className += ` ${className}`;
}

export function removeClass(el, className) {
  el.className = el.className.split(WHITE_SPACE).filter(item => item !== className).join(' ');
}
