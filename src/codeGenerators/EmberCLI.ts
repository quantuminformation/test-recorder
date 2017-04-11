import formattingRules from '../util/formattingRules'
import { TestRecorder } from '../TestRecorder'
import { ICodeGenerator } from './ICodeGenerator'

export class EmberCLIGenerator implements ICodeGenerator {
  lastRoute: string = ''
  description: string = 'EMBER_CLI'

  constructor () {
    // tslint:disable-line
  }

  selectChange (queryPath, event: Event) {
    let target = event.target as HTMLSelectElement
    let newSelectedIndex = target.selectedIndex
    let newValue = (target.options[newSelectedIndex] as HTMLOptionElement).value
    let code = `
Ember.$("${queryPath}").trigger({type:'mouseup', which:1})
andThen(function () {
${formattingRules.indentationX2}${TestRecorder.MUTATIONS_PLACEHOLDER}
})`
    return code
  }

  clickHappened (queryPath: string) {
    let code = `
click("${queryPath}")
andThen(function () {
${formattingRules.indentationX2}${TestRecorder.MUTATIONS_PLACEHOLDER}
})`
    return code
  }

  inputTextEdited (queryPath, newValue) {
    let code = `
fillIn("${queryPath}", "${newValue}")
andThen(function () {
${formattingRules.indentationX2}${TestRecorder.MUTATIONS_PLACEHOLDER}
})`
    return code
  }

  elementAdded (id) {
    return `assert.equal(find("#${id}").length, 1, "${id} shown AFTER user [INSERT REASON]")`
  }

  elementRemoved (id) {
    return `assert.equal(find("#${id}").length, 0, "${id} removed AFTER user [INSERT REASON]")`
  }

  characterDataChanged (record: MutationRecord) {
    let el = record.target as HTMLElement
    return `equal(find('#${el.parentElement.id}').text(), '${el.nodeValue}')`
  }

}
