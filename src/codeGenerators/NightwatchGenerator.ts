import formattingRules from '../util/formattingRules'
import { TestRecorder } from '../TestRecorder'
import { ICodeGenerator } from './ICodeGenerator'
import { MutationEntry } from '../util/MutationEntry'

export class NightwatchGenerator implements ICodeGenerator {
  lastRoute: string = ''
  description: string = 'NightWatch generator'

  constructor () {
    // tslint:disable-line
  }

  selectChange (queryPath, event: Event) {
    let target = event.target as HTMLSelectElement
    let newSelectedIndex = target.selectedIndex
    let newValue = (target.options[newSelectedIndex] as HTMLOptionElement).value
    let code = `
browser.click('${queryPath} [value="${newValue}"]')
browser.pause(500)
${TestRecorder.MUTATIONS_PLACEHOLDER}`
    return code
  }

  clickHappened (queryPath: string) {
    let code = `
browser.click('${queryPath}')
browser.pause(500)
${TestRecorder.MUTATIONS_PLACEHOLDER}`
    return code
  }

  inputTextEdited (queryPath, newValue) {
    let code = `
browser.setValue('${queryPath}', '${newValue}')
browser.pause(500)
${TestRecorder.MUTATIONS_PLACEHOLDER}`
    return code
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

  elementAdded (id): MutationEntry {
    return new MutationEntry(`#${id}`, `browser.expect.element('#${id}').to.be.present`)
  }

  elementRemoved (id): MutationEntry {
    return new MutationEntry(`#${id}`, `browser.expect.element('#${id}').to.not.be.present`)
  }

  characterDataChanged (record: MutationRecord): MutationEntry {
    let el = record.target as HTMLElement
    return new MutationEntry(`#${el.parentElement.id}`, `browser.assert.containsText('#${el.parentElement.id}','${el.nodeValue}')`)
  }

}
