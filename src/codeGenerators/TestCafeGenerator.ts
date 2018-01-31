import formattingRules from '../util/formattingRules'
import { TestRecorder } from '../TestRecorder'
import { ICodeGenerator } from './ICodeGenerator'
import { MutationEntry } from '../util/MutationEntry'
import { UserEvent } from '../util/UserEvent'

export class TestCafeGenerator implements ICodeGenerator {
  lastRoute: string = ''
  description: string = 'TestCafe'

  constructor () {
    // tslint:disable-line
  }

  selectChange (queryPath, event: Event): UserEvent {
    let target = event.target as HTMLSelectElement
    let newSelectedIndex = target.selectedIndex
    let newValue = (target.options[newSelectedIndex] as HTMLOptionElement).value

    return new UserEvent(
      `.click('${queryPath} [value="${newValue}"]')
      `,
      `${TestRecorder.MUTATIONS_PLACEHOLDER}`
    )
  }

  clickHappened (queryPath: string): UserEvent {
    return new UserEvent(`
.click('${queryPath}')
`,
      `${TestRecorder.MUTATIONS_PLACEHOLDER}`
    )
  }

  inputTextEdited (queryPath, newValue): UserEvent {

    return new UserEvent(`
typeText('${queryPath}', '${newValue}')
`,
      `${TestRecorder.MUTATIONS_PLACEHOLDER}`
    )
  }

  elementAdded (queryPath: string): MutationEntry {
    return new MutationEntry(`${queryPath}`, `.waitForElementPresent('${queryPath}', 1000)`)
  }

  elementRemoved (queryPath: string): MutationEntry {
    return new MutationEntry(`${queryPath}`, `.waitForElementNotPresent('${queryPath}', 1000)`)
  }

  characterDataChanged (record: MutationRecord): MutationEntry {
    let el = record.target as HTMLElement
    return new MutationEntry(`#${el.parentElement.id}`, `.assert.containsText('#${el.parentElement.id}','${el.nodeValue}')`)
  }

}
