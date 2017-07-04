import formattingRules from '../util/formattingRules'
import { TestRecorder } from '../TestRecorder'
import { ICodeGenerator } from './ICodeGenerator'
import { MutationEntry } from '../util/MutationEntry'
import { UserEvent } from '../util/UserEvent'

export class EmberCLIGenerator implements ICodeGenerator {
  lastRoute: string = ''
  description: string = 'EMBER_CLI'

  constructor () {
    // tslint:disable-line
  }

  selectChange (queryPath, event: Event): UserEvent {
    let target = event.target as HTMLSelectElement
    // let newSelectedIndex = target.selectedIndex
    // let newValue = (target.options[newSelectedIndex] as HTMLOptionElement).value

    return new UserEvent(
      `Ember.$('${queryPath}').trigger({type:'mouseup', which:1})
`,
      `andThen(function () {
${TestRecorder.MUTATIONS_PLACEHOLDER}
})
`
    )
  }

  clickHappened (queryPath: string): UserEvent {
    return new UserEvent(
      `click('${queryPath}')
`,
      `andThen(function () {
${TestRecorder.MUTATIONS_PLACEHOLDER}
})
`
    )
  }

  inputTextEdited (queryPath, newValue): UserEvent {

    return new UserEvent(`
fillIn('${queryPath}', '${newValue}')`,
      `andThen(function () {
${TestRecorder.MUTATIONS_PLACEHOLDER}
});
`
    )
  }

  elementAdded (id) {
    return new MutationEntry(`#${id}`, `${formattingRules.indentationX2}assert.equal(find('#${id}').length, 1, '${id} shown AFTER user [INSERT REASON]');`)
  }

  elementRemoved (id) {
    return new MutationEntry(`#${id}`, `${formattingRules.indentationX2}assert.equal(find('#${id}').length, 0, '${id} removed AFTER user [INSERT REASON]');`)
  }

  characterDataChanged (record: MutationRecord) {
    let el = record.target as HTMLElement
    return new MutationEntry(`#${el.parentElement.id}`, `${formattingRules.indentationX2}equal(find('#${el.parentElement.id}').text(), '${el.nodeValue}')`)
  }

}
