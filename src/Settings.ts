/**
 * this is the default configuration
 * If you want to override this, pass it in as an argument to the TestRecorder constructor
 */

type SettingsObj = {
  recordAll: boolean,
  currentCodeGenerator: string
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
    return JSON.parse(localStorage.getItem('settings'))
  }
}
