import formattingRules from '../util/formattingRules'
import { TestRecorder } from '../TestRecorder'
import { ICodeGenerator } from './ICodeGenerator'
import { MutationEntry } from '../util/MutationEntry'
import { UserEvent } from '../util/UserEvent'

export class NightwatchGenerator implements ICodeGenerator {
  lastRoute: string = ''
  description: string = 'NightWatch generator'

  constructor () {
    // tslint:disable-line
  }

  selectChange (queryPath, event: Event): UserEvent {
    let target = event.target as HTMLSelectElement
    let newSelectedIndex = target.selectedIndex
    let newValue = (target.options[newSelectedIndex] as HTMLOptionElement).value

    return new UserEvent(
      `browser.click('${queryPath} [value="${newValue}"]')
      `,
`browser.pause(500)
${TestRecorder.MUTATIONS_PLACEHOLDER}`
    )
  }

  clickHappened (queryPath: string): UserEvent {
    return new UserEvent(`
browser.click('${queryPath}')
`,
`browser.pause(500)
${TestRecorder.MUTATIONS_PLACEHOLDER}`
    )
  }

  inputTextEdited (queryPath, newValue): UserEvent {

    return new UserEvent(`
browser.setValue('${queryPath}', '${newValue}')
`,
`browser.pause(500)
${TestRecorder.MUTATIONS_PLACEHOLDER}`
    )
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
