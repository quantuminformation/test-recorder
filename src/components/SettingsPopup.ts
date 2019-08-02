import { IComponent } from "vanilla-typescript"
import { localSettings } from "../LocalSettings"
import { SolarPopup } from "solar-popup"
import { TestRecorder } from "../TestRecorder"

export class SettingsPopup  {
  hostElement: HTMLElement = document.createElement("div")
  constructor() {
    const { hostElement } = this

    // language=HTML
    hostElement.innerHTML = `
        <h3>Test Recorder settings</h3>
        <p>This stores the settings in your local storage for the current web URL</p>
        <form>
        <ul>
          <li title="By default only elements with id's or data-test* attributes are recorded">
            Record all elements<input name="recordAll" type="checkbox" ${
              localSettings.get().recordAll ? "checked" : ""
            }>
          </li>
          <li title="Useful for page refreshes">
            Persist code<input name="persistCode" type="checkbox" ${
              localSettings.get().persistCode ? "checked" : ""
            }>
          </li>
          <li title="Opens on page refreshes">
            Keep recorder open<input name="keepOpen" type="checkbox" ${
              localSettings.get().keepOpen ? "checked" : ""
            }>
          <li title="The size of the generated code in pixels">
            Code size px<input name="codeFontSize" type="number" value="${
              localSettings.get().codeFontSizePx ? localSettings.get().codeFontSizePx : 10
            }">
          </li>
          </li>
         <!-- <li title="Records form values for auto population">
            Monkey Mode<input name="monkeyMode" type="checkbox" ${
              localSettings.get().monkeyMode ? "checked" : ""
            }>
            <button name=clearMonkeyMode>Clear saved values</button>
          </li>-->
          </ul>
          <button>Save</button>
        </form>
      `

    this.hostElement.addEventListener("submit", e => {
      let settings = {
        recordAll: (<HTMLInputElement>hostElement.querySelector('[name="recordAll"]')).checked,
        keepOpen: (<HTMLInputElement>hostElement.querySelector('[name="keepOpen"]')).checked,
        persistCode: (<HTMLInputElement>hostElement.querySelector('[name="persistCode"]')).checked,
        //     monkeyMode: (<HTMLInputElement>el.querySelector('[name="monkeyMode"]')).checked,
        codeFontSize: (<HTMLInputElement>hostElement.querySelector('[name="codeFontSize"]')).value
      }
      localSettings.saveAll(settings)


    })
  }
  show() {
    let popup = new SolarPopup(this.hostElement)
    popup.hostElement.classList.add(TestRecorder.DO_NOT_RECORD)
    popup.show()
    document.querySelector(".modal-background").classList.add(TestRecorder.DO_NOT_RECORD)
  }
}
