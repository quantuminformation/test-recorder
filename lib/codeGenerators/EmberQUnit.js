import formattingRules from '../util/formattingRules';

export default {
  lastRoute: "",

  initialCode: function () {
    this.lastRoute = this.getCurrentRoute();
    return 'visit("' + (this.lastRoute === 'index' ? '/' : this.lastRoute) + '");<br>';
  },

  selectChange: function (queryPath, newSelectedIndex) {
    return "select triggered" + queryPath + newSelectedIndex;
  },

  inputTextEdited: function (queryPath, newValue) {
    return 'fillIn("' + queryPath + '", "' + newValue + '");<br/>';
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
  }
};

