import { MutationEntry } from "../util/MutationEntry"
import { UserEvent } from "../util/UserEvent"
export interface ICodeGenerator {
  description: string

  // mutations
  elementAdded: (id: string) => MutationEntry
  elementRemoved: (id: string) => MutationEntry
  characterDataChanged: (record: MutationRecord) => MutationEntry

  // events
  clickHappened: (queryPath: string) => UserEvent
  inputTextEdited: (queryPath: string, newValue: string) => UserEvent
  selectChange: (queryPath: string, event: Event) => UserEvent
}
