import { TestRecorder } from '../../src/TestRecorder'
import './index.pcss'

let testRecorder = new TestRecorder()

//the vanilla interactions, but same would be

let sandbox: HTMLElement = document.querySelector('#buttonClickMutation') as HTMLElement
document.querySelector('#makeDiv').addEventListener('click', function () {

  let newElement: HTMLElement = document.createElement('div')
  newElement.innerHTML =
    `<p>Generated Div and P</p>`
  newElement.id = 'new-element'
  sandbox.appendChild(newElement)
})

document.querySelector('#select').addEventListener('change', function (event) {

  let mutationElement: HTMLElement = document.querySelector('#selectMutation') as HTMLElement
  let target = event.target as HTMLSelectElement
  let newSelectedIndex = target.selectedIndex
  let newValue = (target.options[newSelectedIndex] as HTMLOptionElement).value

  mutationElement.innerText = newValue
})

