import formattingRules from '../util/formattingRules';
import common from '../util/common';

export default {
  lastRoute: "",
  description: "Angular 1.x generator",

  initialCode: function () {
    this.lastRoute = this.getCurrentRoute();

    var code =
      "beforeEach(function() {<br>" +
      formattingRules.indentation + "browser.get('index.html#" + this.lastRoute + "');<br>" +
      "});<br>"

    return code;
  },

  selectChange: function (queryPath, newSelectedIndex) {
    return "select triggered" + queryPath + newSelectedIndex;
  },

  clickHappened: function (queryPath) {
    var code = "element(" + queryPath + ")click().then(function(){<br/>" +

        //todo this needs to be looked at again as it assumes the route can only change after a click event
      this.routeChanged() +

      common.MUTATIONS_PLACEHOLDER + '<br/>' +
      '});<br/><br/>';
    return code;
  },

  inputTextEdited: function (queryPath, newValue) {
    return "element(" + queryPath + ").setValue(" + newValue + ");";
  },

  routeChanged: function () {

    if (this.lastRoute !== this.getCurrentRoute()) {
      this.lastRoute = this.getCurrentRoute();
      let code = formattingRules.indentation + 'assert.equal(currentRouteName(), "' +
        this.getCurrentRoute() + '", "The page navigates to ' + this.getCurrentRoute() +
        ' on button click");<br/>';
      return code;
    }
    return '';
  },

  getCurrentRoute: function () {
    let isIndex = window.location.pathname === '/';
    var pathArray = window.location.pathname.split('/');
    return isIndex ? 'index' : pathArray[1];
  },

  elementAdded: function (id) {
    return formattingRules.indentation + "expect($('#" + id + "').isDisplayed()).toBe(true); '<br/>'";
  },
  elementRemoved: function (id) {
    return formattingRules.indentation + "expect($('#" + id + "').isDisplayed()).toBe(false); '<br/>'";
  }


};

