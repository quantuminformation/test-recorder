export interface ICodeGenerator {
  description: string
  elementAdded: (id: string) => string
  elementRemoved: (id: string) => string
  clickHappened: (queryPath: string) => string
  inputTextEdited: (queryPath: string, newValue: string) => string
  selectChange: (queryPath: string, newSelectedIndex: number) => string
}
