import 'babel-core/polyfill';
import get from './get';

get('http://content.guardianapis.com/uk-news?api-key=9wur7sdh84azzazdt3ye54k4').then((req) => console.log(req.data));
