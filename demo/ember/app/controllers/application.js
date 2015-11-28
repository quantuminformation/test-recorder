import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    goToIndexRoute: function () {
      this.transitionToRoute("index");
    },
    goToFooRoute: function () {
      this.transitionToRoute("foo");
    }
  }
});
