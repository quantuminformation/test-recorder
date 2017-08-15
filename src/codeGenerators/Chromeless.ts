import formattingRules from '../util/formattingRules'
import { TestRecorder } from '../TestRecorder'
import { ICodeGenerator } from './ICodeGenerator'
import { MutationEntry } from '../util/MutationEntry'
import { UserEvent } from '../util/UserEvent'

export class ChromelessGenerator implements ICodeGenerator {
  lastRoute: string = ''
  description: string = 'Chromeless'

  constructor () {
    // tslint:disable-line
  }

  selectChange (queryPath, event: Event): UserEvent {
    let target = event.target as HTMLSelectElement
    let newSelectedIndex = target.selectedIndex
    let newValue = (target.options[newSelectedIndex] as HTMLOptionElement).value

    return new UserEvent(
      `chromeless.click('${queryPath} [value="${newValue}"]')
      `,
      `${TestRecorder.MUTATIONS_PLACEHOLDER}`
    )
  }

  clickHappened (queryPath: string): UserEvent {
    return new UserEvent(`
chromeless.click('${queryPath}')
`,
      `${TestRecorder.MUTATIONS_PLACEHOLDER}`
    )
  }

  inputTextEdited (queryPath, newValue): UserEvent {

    return new UserEvent(`
chromeless.type('${newValue}', '${queryPath}')
`,
      `${TestRecorder.MUTATIONS_PLACEHOLDER}`
    )
  }

  elementAdded (queryPath: string): MutationEntry {
    return new MutationEntry(`${queryPath}`, `chromeless.wait('${queryPath}')`)
  }

  elementRemoved (queryPath: string): MutationEntry {
    return new MutationEntry(`${queryPath}`, `chromeless.wait('${queryPath}')`)
  }

  // todo get correct assertion for this
  characterDataChanged (record: MutationRecord): MutationEntry {
    let el = record.target as HTMLElement
    return new MutationEntry(`#${el.parentElement.id}`, `browser.assert.containsText('#${el.parentElement.id}','${el.nodeValue}')`)
  }

}
