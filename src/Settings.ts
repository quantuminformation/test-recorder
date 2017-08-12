/**
 * this is the default configuration
 * If you want to override this, pass it in as an argument to the TestRecorder constructor
 */

type SettingsObj = {
  recordAll: any
}

export let Settings = {
  save (settings: object) {
    localStorage.setItem('settings', JSON.stringify(settings))
  },
  get (): SettingsObj {
    return JSON.parse(localStorage.getItem('settings'))
  }
}
