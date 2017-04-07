import { TestRecorder } from '../../src/TestRecorder'
import './index.pcss'

let testRecorder = new TestRecorder()

document.querySelector('#makeDiv').addEventListener('click', function () {
  let newElement: HTMLElement = document.createElement('div')
  newElement.innerHTML =
    `<p>Generated Div and P</p>`
  newElement.id = 'new-element'
  document.querySelector('#buttonClickMutation').appendChild(newElement)
})
document.querySelector('#removeDiv').addEventListener('click', function () {
  let existingEl = document.querySelector('#new-element')
  if (existingEl) {
    document.querySelector('#buttonClickMutation').removeChild(document.querySelector('#new-element'))
  }
})

document.querySelector('#select').addEventListener('change', function (event) {

  let mutationElement: HTMLElement = document.querySelector('#selectMutation') as HTMLElement
  let target = event.target as HTMLSelectElement
  let newSelectedIndex = target.selectedIndex
  let newValue = (target.options[newSelectedIndex] as HTMLOptionElement).value

  mutationElement.innerText = newValue
})

