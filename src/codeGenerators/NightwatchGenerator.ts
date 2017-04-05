import formattingRules from '../util/formattingRules'
import { TestRecorder } from '../TestRecorder'
import { ICodeGenerator } from './ICodeGenerator'

export class NightwatchGenerator implements ICodeGenerator {
  lastRoute: string = ''
  description: string = 'NightWatch generator'

  constructor () {
  // tslint:disable-line
  }

  /*  initialCode(): string {
   return `
   'Demo test Google' : function (client) {
   ${formattingRules.indentation}client`

   }*/

  selectChange (queryPath, newSelectedIndex) {
    return 'select triggered' + queryPath + newSelectedIndex
  }

  clickHappened (queryPath: string) {
    let code = `
browser.click('${queryPath}')
browser.pause(500)
${TestRecorder.MUTATIONS_PLACEHOLDER}`
    return code
  }

  inputTextEdited (queryPath, newValue) {
    return "$('" + queryPath + "').sendKeys('" + newValue + "')<br/>"
  }

  routeChanged () {

    if (this.lastRoute !== this.getCurrentRoute()) {
      // x  this.lastRoute = this.getCurrentRoute()
      let code = formattingRules.indentation + '.assert.equal(currentRouteName(), "' +
        this.getCurrentRoute() + '", "The page navigates to ' + this.getCurrentRoute() +
        ' on button click")<br/>'
      return code
    }
    return ''
  }

  getCurrentRoute () {
    let isIndex = window.location.pathname === '/'
    let pathArray = window.location.pathname.split('/')
    return isIndex ? 'index' : pathArray[1]
  }

  elementAdded (id): string {
    return `browser.expect.element('#${id}').to.be.present<br/>`
  }

  elementRemoved (id): string {
    return `browser.expect.element('#${id}').to.not.be.present<br/>`
  }
}
