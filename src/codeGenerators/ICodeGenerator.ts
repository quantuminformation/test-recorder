export interface ICodeGenerator {
  description: string

  // mutations
  elementAdded: (id: string) => string
  elementRemoved: (id: string) => string
  characterDataChanged: (record: MutationRecord) => string

  // events
  clickHappened: (queryPath: string) => string
  inputTextEdited: (queryPath: string, newValue: string) => string
  selectChange: (queryPath: string, event: Event) => string
}
