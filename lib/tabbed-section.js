import * as dom from "./dom";
import get from './get';

import tabTemplate from './templates/tabs.js';
import panelTemplate from './templates/panel.js';

const DATA_ATTR_NAME = 'data-tabbed-sections';
const DATA_ATTR_SELECTOR = `[${DATA_ATTR_NAME}]`;
const SELECTED_PANEL_CLASS = 'Panel--selected';
const SELECTED_TAB_CLASS = 'Tabs-item--selected';
const ARIA_CONTROLS_ATTR = 'aria-controls';
const ARIA_SELECTED_ATTR = 'aria-selected';

const url = section => `http://content.guardianapis.com/${section}?show-fields=trailText&api-key=9wur7sdh84azzazdt3ye54k4`;

let panelId = 0;

export default class TabbedSection {

    constructor(el) {
      this.el = el;

      if (!dom.$$('.Panel', el).length) {
        this.load();
      } else {
        this.setupTabs();
        this.setupPanels();
      }

      this.bind();

      TabbedSection.store(this);
    }

    load() {
      let conf = JSON.parse(this.el.getAttribute(DATA_ATTR_NAME));

      let panelPromises = [];

      let tabData = Object.keys(conf).map((key, i) => {
        let tabContent = {
          key,
          panelId: `Panel-id${panelId}`,
          section: conf[key],
          selected: i === 0
        };
        panelId++;

        panelPromises.push(get(url(tabContent.key)).then(req => {
          let resp = req.data.response;
          let div = document.createElement('div');
          div.className = `Panel${i == 0 ? ' Panel--selected' : ''}`;
          div.setAttribute('role', 'tabpanel');
          div.setAttribute('aria-labelledby', tabContent.panelId);
          div.id = tabContent.panelId;
          div.innerHTML = panelTemplate({
            id: resp.edition.id,
            selected: i == 0,
            items: resp.results
          });
          this.el.appendChild(div);
        }));

        return tabContent;
      });

      this.el.innerHTML = tabTemplate({ tabs: tabData });
      this.setupTabs();

      Promise.all(panelPromises).then(promises => this.setupPanels());
    }

    setupTabs() {
      let tabs = dom.$$('.Tabs-item', this.el);
      this.tabs = {};
      tabs.forEach(tab => {
        let a = dom.$('a', tab);
        this.tabs[a.getAttribute(ARIA_CONTROLS_ATTR)] = tab;
        if (a.getAttribute(ARIA_SELECTED_ATTR) === 'true') {
          this.currentTab = tab;
        }
      });
    }

    setupPanels() {
      let panels = dom.$$('.Panel', this.el);
      this.panels = {};
      panels.forEach(panelEl => {
        this.panels[panelEl.getAttribute('aria-labelledby')] = panelEl;
        if (panelEl.className.indexOf('Panel--selected') !== -1) {
          this.currentPanel = panelEl;
        }
      });
    }

    bind() {
      this.tabsEl = dom.$('.Tabs', this.el);
      dom.delegateClick(this.tabsEl, ARIA_CONTROLS_ATTR, e => {
        e.preventDefault();

        let panelId = e.target.getAttribute(ARIA_CONTROLS_ATTR);
        if (this.tabs[panelId]) {

          dom.removeClass(this.currentTab, SELECTED_TAB_CLASS);
          dom.addClass(this.tabs[panelId], SELECTED_TAB_CLASS);
          this.currentTab.setAttribute(ARIA_SELECTED_ATTR, false);
          this.tabs[panelId].setAttribute(ARIA_SELECTED_ATTR, true);
          this.currentTab = this.tabs[panelId];

          dom.removeClass(this.currentPanel, SELECTED_PANEL_CLASS);
          dom.addClass(this.panels[panelId], SELECTED_PANEL_CLASS);
          this.currentPanel = this.panels[panelId];

        }

      });
    }

    static init() {
      dom.$$(DATA_ATTR_SELECTOR).forEach(el => new TabbedSection(el));
    }

    static store(instance) {
      TabbedSection.instances = TabbedSection.instances || [];
      TabbedSection.instances.push(instance);
    }

}
