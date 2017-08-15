/**
 * this is the default configuration
 * If you want to override this, pass it in as an argument to the TestRecorder constructor
 */

type SettingsObj = {
  recordAll: boolean,
  currentCodeGenerator: string
  persistCode: boolean,
  keepOpen: string
  generatedTestCode: string
}

export let Settings = {
  save (settings: object) {
    localStorage.setItem('settings', JSON.stringify(settings))
  },
  saveItem (key: string, data: any) {
    let currentData = this.get()
    currentData[key] = data
    this.save(currentData)
  },
  get (): SettingsObj {
    let value = JSON.parse(localStorage.getItem('settings'))
    return value ? value : {}
  }
}
