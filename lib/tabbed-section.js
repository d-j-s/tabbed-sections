import * as dom from "./dom";

const SELECTED_PANEL_CLASS = 'Panel--selected';
const SELECTED_TAB_CLASS = 'Tabs-item--selected';
const ARIA_CONTROLS_ATTR = 'aria-controls';
const ARIA_SELECTED_ATTR = 'aria-selected';

export default class TabbedSection {

    constructor(el) {
      this.el = el;

      let tabs = dom.$$('.Tabs-item', el);
      let panels = dom.$$('.Panel', el);
      if (!panels.length) {

      } else {
        this.setupTabs(tabs);
        this.setupPanels(panels);
      }

      this.bind();

      TabbedSection.store(this);
    }

    setupTabs(tabs) {
      this.tabs = {};
      tabs.forEach(tab => {
        let a = dom.$('a', tab);
        this.tabs[a.getAttribute(ARIA_CONTROLS_ATTR)] = tab;
        if (a.getAttribute(ARIA_SELECTED_ATTR) === 'true') {
          this.currentTab = tab;
        }
      });
    }

    setupPanels(panels) {
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
      dom.$$('[data-tabbed-sections]').forEach(el => new TabbedSection(el));
    }

    static store(instance) {
      TabbedSection.instances = TabbedSection.instances || [];
      TabbedSection.instances.push(instance);
    }

}
