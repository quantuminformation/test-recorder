import { TestRecorder } from '../src/TestRecorder'
import './index.pcss'

let testRecorder = new TestRecorder()

//the vanilla interactions, but same would be

let sandbox: HTMLElement = document.querySelector('#sandbox') as HTMLElement
document.querySelector('#makeDiv').addEventListener('click', function () {

  let newElement: HTMLElement = document.createElement('div')
  newElement.innerHTML =
    `<p>Generated Div and P</p>`
  newElement.id = 'new-element'
  sandbox.appendChild(newElement)
})
