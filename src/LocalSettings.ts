/**
 * this is the default configuration
 * If you want to override this, pass it in as an argument to the TestRecorder constructor
 */
enum monkeyModeDataItemType {
  TextInput,
  SelectInput,
  RadioInput
}

type monkeyModeDataItem = { type: monkeyModeDataItemType; value: any }
type SettingsObj = {
  recordAll: boolean
  currentCodeGenerator: string
  persistCode: boolean
  keepOpen: boolean
  generatedTestCode: string
  codeFontSizePx: number
  monkeyMode: boolean
  monkeyModeData: monkeyModeDataItem[]
}
const settingsDefaults: Partial<SettingsObj> = {
  recordAll: false,
  persistCode: false,
  keepOpen: false,
  codeFontSizePx: 10
  //monkeyMode: boolean
  //monkeyModeData: monkeyModeDataItem[]
}

class LocalSettings {
  private settings: Partial<SettingsObj>
  private LOCAL_SETTINGS = "test-recorder-settings"

  /**
   * loads json into the settings object then reads that in the app
   */
  constructor() {
    //check if settings exist if not init with default values
    this.settings = JSON.parse(localStorage.getItem(this.LOCAL_SETTINGS))
    if (!this.settings) {
      this.save(settingsDefaults)
    }
    console.log(this.settings)
  }

  private save(settings: Partial<SettingsObj>) {
    localStorage.setItem(this.LOCAL_SETTINGS, JSON.stringify(settings))
    this.settings = settings
    console.log(`new settings value saved: ${this.settings}`)
  }

  saveItem(key: string, data: any) {
    let currentData = this.get()
    currentData[key] = data
    this.save(currentData)
  }
  saveAll(data: any) {
    this.save(data)
  }

  get(): Partial<SettingsObj> {
    return this.settings
  }
}

export const localSettings = new LocalSettings()
