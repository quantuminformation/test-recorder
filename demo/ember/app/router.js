import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function () {
  this.route('index', {'path': ''});
  this.route('foo');//we just have a route here so we can test for it on transition
});

export default Router;
