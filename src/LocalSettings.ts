/**
 * this is the default configuration
 * If you want to override this, pass it in as an argument to the TestRecorder constructor
 */
enum monkeyModeDataItemType {TextInput, SelectInput, RadioInput}

type monkeyModeDataItem = { type: monkeyModeDataItemType, value: any }
type SettingsObj = {
  recordAll: boolean,
  currentCodeGenerator: string
  persistCode: boolean,
  keepOpen: string
  generatedTestCode: string
  codeFontSize: number
  monkeyMode: boolean
  monkeyModeData: monkeyModeDataItem[]
}

 class LocalSettings {

  private settings: SettingsObj

  constructor() {
    this.settings = JSON.parse(localStorage.getItem('LocalSettings'))

    // init some data to sensible values
    if (this.settings.monkeyModeData) {
      this.settings.monkeyModeData = []
      this.save(this.settings)
    }

  }

  private save(settings: SettingsObj) {
    localStorage.setItem('LocalSettings', JSON.stringify(settings))
  }

  saveItem(key: string, data: any) {
    let currentData = this.get()
    currentData[key] = data
    this.save(currentData)
  }

  get(): SettingsObj {
    return this.settings
  }
}

export const localSettings = new LocalSettings()
