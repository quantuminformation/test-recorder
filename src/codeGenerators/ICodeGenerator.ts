import { MutationEntry } from '../util/MutationEntry'
export interface ICodeGenerator {
  description: string

  // mutations
  elementAdded: (id: string) => MutationEntry
  elementRemoved: (id: string) => MutationEntry
  characterDataChanged: (record: MutationRecord) => MutationEntry

  // events
  clickHappened: (queryPath: string) => string
  inputTextEdited: (queryPath: string, newValue: string) => string
  selectChange: (queryPath: string, event: Event) => string
}
