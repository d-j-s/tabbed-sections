import $$ from "./dom";

class TabbedSection {

    constructor(config, el, sync = false) {
        this.config = config;
        this.el = el;

        this.initTabs();

        if (!sync) {
            this.loadTab(0);
        }
    }



    static init(el) {
        if (!el) {
            return $$('[data-tabbed-sections]').map(TabbedContent.init);
        }
        return new TabbedContent(JSON.parse(el.getAttribute('data-tabbed-sections')), el);
    }

}
