/**
 * this is the default configuration
 * If you want to override this, pass it in as an argument to the TestRecorder constructor
 */
export let Settings = {
  save (settings: object) {
    localStorage.setItem('settings', JSON.stringify(settings))
  },
  get () {
    return JSON.parse(localStorage.getItem('settings'))
  }
}
