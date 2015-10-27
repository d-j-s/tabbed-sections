export function $$(selector, ctx) {
  return Array.from((ctx || document).querySelectorAll(selector));
}
