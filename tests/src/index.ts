import { TestRecorder } from '../../src/TestRecorder'
import './index.pcss'

let testRecorder = new TestRecorder()

document.querySelector('.makeDiv').addEventListener('click', function () {
  let newElement: HTMLElement = document.createElement('div')
  newElement.innerHTML =
    `<p>Generated Div and P</p>`
  newElement.id = 'new-element'
  document.querySelector('#buttonClickMutation').appendChild(newElement)

  let newElement2: HTMLElement = document.createElement('div')
  newElement2.innerHTML =
    `<p>Generated Div and P 2</p>`
  newElement2.id = 'new-element2'
  document.querySelector('#buttonClickMutation').appendChild(newElement2)
  document.querySelector('#buttonClickMutation').removeChild(newElement2)


})
document.querySelector('#removeDiv').addEventListener('click', function () {
  let existingEl = document.querySelector('#new-element')
  if (existingEl) {
    document.querySelector('#buttonClickMutation').removeChild(document.querySelector('#new-element'))
  }
})

document.querySelector('#input').addEventListener('change', function () {
  let mutationElement: HTMLElement = document.querySelector('#inputMutation') as HTMLElement
  let target = event.target as HTMLSelectElement
  mutationElement.innerText = target.value
  // todo figure out a way to resolve mutation differences when using innerHTML
  // see http://stackoverflow.com/a/43293314/3915717
})

document.querySelector('#select').addEventListener('change', function (event) {

  let mutationElement: HTMLElement = document.querySelector('#selectMutation') as HTMLElement
  let target = event.target as HTMLSelectElement
  let newSelectedIndex = target.selectedIndex
  let newValue = (target.options[newSelectedIndex] as HTMLOptionElement).value

  mutationElement.innerText = newValue
})

