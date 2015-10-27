import 'babel-core/polyfill';
import get from './get';
import tabTemplate from '../components/tabs/tabs.js';
import panelTemplate from '../components/panel/panel.js';

get('http://content.guardianapis.com/uk-news?api-key=9wur7sdh84azzazdt3ye54k4').then((req) => {
  document.body.innerHTML += panelTemplate({
    panelId: 'x1',
    items: req.data.response.results
  });
});

console.log(tabTemplate({
  tabs: [
    {
      panelId: 'x1',
      section: 'News',
      selected: true
    }
  ]
}));

console.log(panelTemplate({
  panelId: 'x1',
  items: [
    {
      webTitle: "Tony Blair’s partial apology for Iraq isn’t enough | Letters",
      webUrl: "http://www.theguardian.com/uk-news/2015/oct/27/tony-blair-partial-apology-for-iraq-is-not-enough",
      fields: {
          trailText: "<strong>Letters:</strong> Sadly, the rise of Isis was a relatively milder consequence of the Iraq war"
      }
    }
  ]
}));
