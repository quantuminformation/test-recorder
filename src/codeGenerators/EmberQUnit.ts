import formattingRules from '../util/formattingRules'
import {TestRecorder} from "../TestRecorder"
import {ICodeGenerator} from "./ICodeGenerator";

export class NightwatchGenerator implements ICodeGenerator{
  lastRoute: string = ""
  description: string = "Ember QUnit generator"

  constructor() {

  }

/*
  initialCode: function () {
    this.lastRoute = this.getCurrentRoute()
    return 'visit("' + (this.lastRoute === 'index' ? '/' : this.lastRoute) + '")<br>'
  }*/

  selectChange (queryPath, newSelectedIndex) {
    return "select triggered" + queryPath + newSelectedIndex
  }

/*  clickHappened: function (queryPath) {
    var code = 'click("' + queryPath + '")<br/>' + 'andThen(function () {' + '<br/>' +

      //todo this needs to be looked at again as it assumes the route can only change after a click event
      this.routeChanged() +

      TestRecorder.MUTATIONS_PLACEHOLDER + '<br/>' +
      '})<br/><br/>'
    return code
  },*/


  clickHappened(queryPath) {
    var code = `
${formattingRules.indentationX2}.click("${queryPath}")
${formattingRules.indentationX2}.andThen(function () {
${formattingRules.indentationX2}${TestRecorder.MUTATIONS_PLACEHOLDER}
${formattingRules.indentationX2}})`

    return code
  }


  inputTextEdited(queryPath, newValue) {
    return 'fillIn("' + queryPath + '", "' + newValue + '")<br/>'
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
    return formattingRules.indentation + 'assert.equal(find("#' + id + '").length, 1, "' + id + ' shown AFTER user [INSERT REASON]")' + '<br/>'
  }
  elementRemoved (id) {
    return formattingRules.indentation + 'assert.equal(find("#' + id + '").length, 0, "' + id + ' removed AFTER user [INSERT REASON]")' + '<br/>'
  }

}

