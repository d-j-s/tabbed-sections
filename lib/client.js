import 'babel-core/polyfill';

import get from './get';
import * as dom from './dom';

import tabTemplate from '../components/tabs/tabs.js';
import panelTemplate from '../components/panel/panel.js';

const DATA_ATTR_NAME = 'data-tabbed-sections';
const DATA_ATTR_SELECTOR = `[${DATA_ATTR_NAME}]`;

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

  let contentPromises = tabs.map((tab, i) => {
    return get(url(tab.key)).then(req => {
      let resp = req.data.response;
      el.innerHTML += panelTemplate({
        panelId: 'x',
        id: resp.edition.id,
        selected: false,
        items: resp.results
      });
    });
  });
});

window.onload = () => window.tabs = init();
