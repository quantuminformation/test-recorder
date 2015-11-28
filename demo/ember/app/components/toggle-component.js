import Ember from 'ember';

export default Ember.Component.extend({
  showContent: true,
  classNames: ["lightGrey"],
  actions: {
    toggle: function () {
      this.set("showContent", !this.get("showContent"));
    }
  }
});
