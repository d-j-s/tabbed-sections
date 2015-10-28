import 'babel-core/polyfill';
import get from './get';
import TabbedSection from './tabbed-section';

TabbedSection.init();

window.TabbedSection = TabbedSection;
