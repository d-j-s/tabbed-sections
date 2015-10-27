import 'babel-core/polyfill';

import get from './get';
import * as dom from './dom';

import tabTemplate from '../components/tabs/tabs.js';
import panelTemplate from '../components/panel/panel.js';

const DATA_ATTR_NAME = 'data-tabbed-sections';
const DATA_ATTR_SELECTOR = `[${DATA_ATTR_NAME}]`;
const SELECTED_CLASS = 'Panel--selected';

const url = section => `http://content.guardianapis.com/${section}?show-fields=trailText&api-key=9wur7sdh84azzazdt3ye54k4`;

let panelId = 0;

const init = () => dom.$$(DATA_ATTR_SELECTOR).map(el => {
  let conf = JSON.parse(el.getAttribute(DATA_ATTR_NAME));

  let tabs = Object.keys(conf).map((key, i) => {
    let out = {
      key,
      panelId: `Panel-id${panelId}`,
      section: conf[key],
      selected: i == 0
    };
    panelId++;
    return out;
  });

  el.innerHTML = tabTemplate({tabs: tabs});

  let loaded = {};
  let selected;

  let contentPromises = tabs.map((tab, i) => {
    return get(url(tab.key)).then(req => {
      let resp = req.data.response;
      let div = document.createElement('div');
      div.className = `Panel${i == 0 ? ' Panel--selected' : ''}`;
      div.setAttribute('role', 'tabpanel');
      div.setAttribute('aria-labelledby', tabs[i].panelId);
      div.innerHTML = panelTemplate({
        id: resp.edition.id,
        selected: i == 0,
        items: resp.results
      });
      el.appendChild(div);
      loaded[tabs[i].panelId] = div;
      if (i == 0) {
        selected = div;
      }
      return div;
    });
  });

  let tabEl = dom.$('.Tabs', el);

  dom.delegateClick(tabEl, 'aria-controls', e => {
    e.preventDefault();
    if (loaded[e.target.getAttribute('aria-controls')]) {
      console.log(selected);
      let el = loaded[e.target.getAttribute('aria-controls')];
      dom.addClass(el, SELECTED_CLASS);
      dom.removeClass(selected, SELECTED_CLASS);
      selected = el;
    }
  });

  return tabs;
});

window.tabs = init();
