import 'babel-core/polyfill';

import get from './get';
import * as dom from './dom';

import tabTemplate from '../components/tabs/tabs.js';
import panelTemplate from '../components/panel/panel.js';

const DATA_ATTR_NAME = 'data-tabbed-sections';
const DATA_ATTR_SELECTOR = `[${DATA_ATTR_NAME}]`;
const SELECTED_PANEL_CLASS = 'Panel--selected';
const SELECTED_TAB_CLASS = 'Tabs-item--selected';

const url = section => `http://content.guardianapis.com/${section}?show-fields=trailText&api-key=9wur7sdh84azzazdt3ye54k4`;

let panelId = 0;

// finds `[data-tabbed-sections]` elements and builds tabs and loads content
const init = () => dom.$$(DATA_ATTR_SELECTOR).map(el => {
  // config is JSON encoded in the data-tabbed-sections attribute
  let conf = JSON.parse(el.getAttribute(DATA_ATTR_NAME));

  let loaded = {};
  let tabItems = {};
  let selectedPanel;
  let selectedTab;

  // Map over the config for tabs to build tabs data for template
  let tabs = Object.keys(conf).map((key, i) => {
    let isSelected = i === 0;
    let tabContent = {
      key,
      panelId: `Panel-id${panelId}`,
      section: conf[key],
      selected: isSelected
    };
    panelId++;

    // Grab the content render the template and stick it in the dom;
    get(url(tabContent.key)).then(req => {
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

      // save a ref to the panel so we can switch classes to show/hide
      loaded[tabs[i].panelId] = div;
      if (isSelected) {
        selectedPanel = div;
      }
    });

    return tabContent;
  });

  el.innerHTML = tabTemplate({ tabs: tabs });

  dom.$$('.Tabs-item', el).forEach((tab, i) => {
    if (i === 0) {
      selectedTab = tab;
    }
    tabItems[tabs[i].panelId] = tab;
  });

  let tabEl = dom.$('.Tabs', el);

  dom.delegateClick(tabEl, 'aria-controls', e => {
    e.preventDefault();

    let panelId = e.target.getAttribute('aria-controls');
    if (loaded[panelId]) {

      // remove the selected class from the previously selected tab
      // add the selected class to the previously selected tab
      // switch the aria-selected attribute over
      dom.removeClass(selectedTab, SELECTED_TAB_CLASS);
      let tab = tabItems[panelId];
      dom.addClass(tab, SELECTED_TAB_CLASS);
      selectedTab.setAttribute('aria-selected', false);
      tab.setAttribute('aria-selected', true);
      selectedTab = tab;

      // remove the selected class from the previously selected panel
      // add the selected class to the previously selected panel
      let panel = loaded[panelId];
      dom.removeClass(selectedPanel, SELECTED_PANEL_CLASS);
      dom.addClass(panel, SELECTED_PANEL_CLASS);
      selectedPanel = panel;

    }
  });

  return tabs;
});

window.onload = () => {
  window.tabs = init();
};
