import formattingRules from '../util/formattingRules'
import common from '../util/common'

export class NightwatchGenerator {
  lastRoute: ""
  description: "NightWatch generator"

  constructor(){

  }

  //todo decide what to do here
  initialCode: function () {
   /* this.lastRoute = this.getCurrentRoute()

    var code =
      "beforeEach(function() {<br>" +
      formattingRules.indentation + "browser.get('" + this.lastRoute + "')<br>" +
      "})<br>"

    return code*/
    return ""
  }

  selectChange (queryPath, newSelectedIndex) {
    return "select triggered" + queryPath + newSelectedIndex
  }

  clickHappened (queryPath) {
    var code = "element('" + queryPath + "')click().then(function(){<br/>" +

        //todo this needs to be looked at again as it assumes the route can only change after a click event
      this.routeChanged() +

      common.MUTATIONS_PLACEHOLDER + '<br/>' +
      '})<br/><br/>'
    return code
  }

  inputTextEdited (queryPath, newValue) {
    return "$('" + queryPath + "').sendKeys('" + newValue + "')<br/>"
  }

  routeChanged () {

    if (this.lastRoute !== this.getCurrentRoute()) {
      this.lastRoute = this.getCurrentRoute()
      let code = formattingRules.indentation + 'assert.equal(currentRouteName(), "' +
        this.getCurrentRoute() + '", "The page navigates to ' + this.getCurrentRoute() +
        ' on button click")<br/>'
      return code
    }
    return ''
  }

  getCurrentRoute () {
    let isIndex = window.location.pathname === '/'
    var pathArray = window.location.pathname.split('/')
    return isIndex ? 'index' : pathArray[1]
  }

  elementAdded (id) {
    return `${formattingRules.indentation}expect($('#" + ${id} + "').isDisplayed()).toBe(true) '<br/>'"`
  }
  elementRemoved (id) {
    return formattingRules.indentation + "expect($('#" + id + "').isDisplayed()).toBe(false) '<br/>'"



}

