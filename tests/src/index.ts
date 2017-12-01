import { TestRecorder } from '../../src/TestRecorder'
import './index'

// delay the recorder setup
setTimeout(()=> {
  new TestRecorder()
},500)


function init() {
  document.querySelector('.makeDiv').addEventListener('click', function () {
    let newElement = document.createElement('div')
    newElement.innerHTML =
      `<p>Generated Div and P</p>`
    newElement.id = 'new-element'

    let newElementWithNoId = document.createElement('div')
    newElementWithNoId.innerHTML =
      `<p>Generated Div and P 2</p>`
    document.querySelector('#buttonClickMutation').appendChild(newElement)
    document.querySelector('#buttonClickMutation').appendChild(newElementWithNoId)

    // add and remove stuff to see if they are both recorded
    let newElement2 = document.createElement('div')
    newElement2.innerHTML =
      `<p>Generated Div and P 2</p>`
    newElement2.id = 'new-element2'
    document.querySelector('#buttonClickMutation').appendChild(newElement2)
    document.querySelector('#buttonClickMutation').removeChild(newElement2)
  })

  document.querySelector('[data-test-foo2="baa"]').addEventListener('click', function () {
    let newElementWithDataTest = document.createElement('div')
    newElementWithDataTest.innerHTML =
      `<p>Generated Div with data-test attr</p>`
    newElementWithDataTest.dataset['data-test-created-div']

    document.querySelector('#buttonClickMutation').appendChild(newElementWithDataTest)
    document.querySelector('#buttonClickMutation').appendChild(newElementWithDataTest)
  })


  document.querySelector('#removeDiv').addEventListener('click', function () {
    let existingEl = document.querySelector('#new-element')
    if (existingEl) {
      document.querySelector('#buttonClickMutation').removeChild(document.querySelector('#new-element'))
    }
  })

  document.querySelector('#input').addEventListener('change', function () {
    let mutationElement = document.querySelector('#inputMutation') as HTMLElement
    let target = event.target as HTMLSelectElement
    mutationElement.innerText = target.value
    // todo figure out a way to resolve mutation differences when using innerHTML
    // see http://stackoverflow.com/a/43293314/3915717
  })

  document.querySelector('#select').addEventListener('change', function (event) {

    let mutationElement = document.querySelector('#selectMutation') as HTMLElement
    let target = event.target as HTMLSelectElement
    let newSelectedIndex = target.selectedIndex
    let newValue = (target.options[newSelectedIndex] as HTMLOptionElement).value

    mutationElement.innerText = newValue
  })

//drag stuff
  Array.from(document.querySelectorAll('.dropDiv')).forEach((element) => {
    element.addEventListener('drop', (event:DragEvent) => {
      event.preventDefault();
      var data = event.dataTransfer.getData("text");
      (event.target as HTMLElement).appendChild(document.getElementById(data));
    })
    element.addEventListener('dragover', (event) => {
      event.preventDefault();
    })
  })

  document.querySelector('#drag1').addEventListener('dragstart', (event:DragEvent) => {
    event.dataTransfer.setData("text", (event.target as HTMLElement).id);
  })
}

init()
