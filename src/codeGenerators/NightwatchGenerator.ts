import formattingRules from '../util/formattingRules'
import {TestRecorder} from "../TestRecorder";

export class NightwatchGenerator {
  lastRoute: string = ""
  description: string = "NightWatch generator"

  constructor() {

  }

/*  initialCode(): string {
    return `
'Demo test Google' : function (client) {
${formattingRules.indentation}client`

  }*/

  selectChange(queryPath, newSelectedIndex) {
    return "select triggered" + queryPath + newSelectedIndex
  }

  clickHappened(queryPath) {
    var code = `
${formattingRules.indentationX2}.click('${queryPath}')
${formattingRules.indentationX2}.pause(500)
${formattingRules.indentationX2}${TestRecorder.MUTATIONS_PLACEHOLDER}`
    return code
  }

  inputTextEdited(queryPath, newValue) {
    return "$('" + queryPath + "').sendKeys('" + newValue + "')<br/>"
  }

  routeChanged() {

    if (this.lastRoute !== this.getCurrentRoute()) {
      //x  this.lastRoute = this.getCurrentRoute()
      let code = formattingRules.indentation + 'assert.equal(currentRouteName(), "' +
        this.getCurrentRoute() + '", "The page navigates to ' + this.getCurrentRoute() +
        ' on button click")<br/>'
      return code
    }
    return ''
  }

  getCurrentRoute() {
    let isIndex = window.location.pathname === '/'
    var pathArray = window.location.pathname.split('/')
    return isIndex ? 'index' : pathArray[1]
  }

  elementAdded(id) {
    console.log('new el')
    return `${formattingRules.indentation}assert.visible('${id}')<br/>`
  }

  elementRemoved(id) {
    return formattingRules.indentation + "expect($('#" + id + "').isDisplayed()).toBe(false) '<br/>'"
  }
}

