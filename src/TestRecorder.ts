//todo perhaps use typescript to have these as interface implementation
import { NightwatchGenerator } from './codeGenerators/NightwatchGenerator'
import './styles/app.pcss'
import { copyTextToClipboard } from './util/clipboard'
//import  'prismjs'
//import  'prismjs/components/prism-javascript'
import { ICodeGenerator } from './codeGenerators/ICodeGenerator'
import { EmberCLIGenerator } from "./codeGenerators/EmberCLIGenerator"
import { ChromelessGenerator } from "./codeGenerators/Chromeless"
import { MutationEntry } from "./util/MutationEntry"
import { UserEvent } from "./util/UserEvent"
import SolarPopup from 'solar-popup'
import { Settings } from "./Settings"
import PathTools, { getPath, isElementClassOrChildOfClass } from "./util/PathTools"

declare let require

//declare var Prism

/**
 * Default tests that are generated are for Nightwatch
 */
export class TestRecorder {

  // defaults
  defaultFontSizePx: number = 8

  codeGenerators: Map<string, ICodeGenerator>

  currentCodeGenerator: ICodeGenerator
  currentUserEvent: UserEvent

  mutationObserversArr: MutationObserver[] = []
  generatedTestCode: string = '' //this is sent to what ever wants to receive generated code

  //todo think about refactor
  //userEvents: UserEvent[] = []

  lastRoute: ''
  cachedMutations: MutationEntry[] = [] //this stores the changes made from mutations until we want to insert them into the generated code
  hostElement: HTMLElement
  codeOutputDiv: HTMLElement

  static MUTATIONS_PLACEHOLDER = '[MUTATIONS_PLACEHOLDER]'
  static DO_NOT_RECORD = 'doNotRecord'

  /**
   * @param config you can override this
   */
  constructor () {
    let nightwatchGenerator = new NightwatchGenerator()
    let emberCLIGenerator = new EmberCLIGenerator()
    let chromelessGenerator = new ChromelessGenerator()
    this.codeGenerators = new Map([
      [emberCLIGenerator.description, emberCLIGenerator],
      [nightwatchGenerator.description, nightwatchGenerator],
      [chromelessGenerator.description, chromelessGenerator]
    ])

    let rootDomNode = document.querySelector('body')
    let ui = document.createElement('div')

    //apply settings
    if (Settings.get().currentCodeGenerator) {
      this.currentCodeGenerator = this.codeGenerators.get(Settings.get().currentCodeGenerator)
    }
    if (!this.currentCodeGenerator) {
      this.currentCodeGenerator = this.codeGenerators.values().next().value
    }

    // language=HTML
    ui.innerHTML =
      `<div id="testRecorderUI" class="${TestRecorder.DO_NOT_RECORD}" draggable=true>
          <div class="header">
          <span id="clear" >&#x1F6AB;</span>
          <span id="debug">&#x1F41B;</span>
          <button id="copy">Copy</button>
           <span class="info" >&#x1F3F7;</span>
          <span class="settings" >&#x2699;</span>
          <select id="framework-choice">
            ${Array.from(this.codeGenerators.keys()).map(item =>
        `<option value="${item}" ${item === this.currentCodeGenerator.description ? "selected" : ""}>${item}</option>`).join('')}
          </select>
          <span class="minimise" >_</span>
          <span class="resize" >&#x1F5D6;</span>
        </div>
        <div id="generatedScript" class="language-javascript"></div>
        </div>
    </div> `

    document.body.appendChild(ui.firstChild)

    this.hostElement = document.getElementById('testRecorderUI')
    this.codeOutputDiv = document.getElementById('generatedScript')
    //this will iterate through this node and watch for changes and store them until we want to display them
    this.addObserverForTarget(rootDomNode)
    this.setupTestRecorderUI_and_app_Events()
    this.setUpDragAndDrop(this.hostElement, document)

    //load settings
    if (Settings.get().persistCode) {
      if (Settings.get().generatedTestCode) {
        this.codeOutputDiv.innerHTML = '<pre>' + Settings.get().generatedTestCode + '</pre>'
      }
    }
    this.updateFontSize()
  }

  updateFontSize () {
    if (Settings.get().codeFontSize) {
      this.codeOutputDiv.style.fontSize = `${Settings.get().codeFontSize}px`
    } else {
      this.codeOutputDiv.style.fontSize = `${this.defaultFontSizePx}px`

    }
  }

  destroy () {
    console.log("removing test recorder")
    this.hostElement.parentElement.removeChild(this.hostElement)
    //todo remove listeners
  }

  /**
   * listen to events of various type bubbling up to the document
   */
  setupTestRecorderUI_and_app_Events () {

    //test recorder UI--------------------------------------------------------------------
    document.querySelector('#copy').addEventListener('click', () => {
      copyTextToClipboard(this.codeOutputDiv.textContent)
    })
    document.querySelector('.info').addEventListener('click', () => {
      alert(`Version: ${require('../package.json').version}`)
    })
    document.querySelector('.settings').addEventListener('click', () => {
      let el = document.createElement('div')

      // language=HTML
      el.innerHTML = `
        <h3>Test Recorder settings</h3>
        <p>This stores the settings in your local storage for the current web URL</p>
        <form>
        <ul>
          <li title="By default only elements with id's or data-test* attributes are recorded">
            Record all elements<input name="recordAll" type="checkbox" ${Settings.get().recordAll ? "checked" : ""}>
          </li>
          <li title="Useful for page refreshes">
            Persist code<input name="persistCode" type="checkbox" ${Settings.get().persistCode ? "checked" : ""}>
          </li>
          <li title="Opens on page refreshes">
            Keep recorder open<input name="keepOpen" type="checkbox" ${Settings.get().keepOpen ? "checked" : ""}>
          </li>
          <li title="The size of the generated code in pixels">
            Code size px<input name="codeFontSize" type="number" value="${Settings.get().codeFontSize ? Settings.get().codeFontSize : 10}">
          </li>
          </ul>
          <button>Save</button>
        </form>
      `

      el.addEventListener('submit', (e) => {
        let settings = {
          recordAll: (<HTMLInputElement> el.querySelector('[name="recordAll"]')).checked,
          keepOpen: (<HTMLInputElement> el.querySelector('[name="keepOpen"]')).checked,
          persistCode: (<HTMLInputElement> el.querySelector('[name="persistCode"]')).checked,
          codeFontSize: (<HTMLInputElement> el.querySelector('[name="codeFontSize"]')).value
        }
        Settings.save(settings)

        // update UI
        this.updateFontSize()
      })
      let popup = new SolarPopup(el)
      popup.hostElement.classList.add(TestRecorder.DO_NOT_RECORD)
      popup.show()

    })
    document.querySelector('.minimise').addEventListener('click', () => {
      this.hostElement.style.height = "30px"

    })
    document.querySelector('.resize').addEventListener('click', () => {
      this.hostElement.style.height = "300px"

    })
    document.querySelector('#debug').addEventListener('click', () => {
      console.log(this.cachedMutations)
      console.log(this)
    })
    document.querySelector('#clear').addEventListener('click', () => {
      this.setGeneratedScript("")
    })
    document.querySelector('#framework-choice').addEventListener('change', (event: any) => {
      let newValue = (event.target.options[event.target.selectedIndex]).value
      this.currentCodeGenerator = this.codeGenerators.get(newValue)
      Settings.saveItem("currentCodeGenerator", this.currentCodeGenerator.description)
    })

    /**
     * Common filter applied to all browser events
     * @param e
     * @returns {boolean}
     */
    function filterEvent (path: any): boolean {
      path = getPathUpTillBody(path)

      if (!path || path.length === 0) { // eg clicking outside the body if the app is less than the height of the window
        return false
      }
      if (isAnyElementInPathClassOrChildOfClass(path, TestRecorder.DO_NOT_RECORD)) {
        return false
      }
      return true
    }

    document.addEventListener('click', (e: any) => {
      if (!filterEvent(e.path)) {
        return
      }

      if (e.target.localName === 'input' && e.target.type === 'text' || //on listen to focus-out for these
        e.target.localName === 'html' ||  // don't want to record clicking outside the app'
        e.target.type === 'select-one') { // selects handled elsewhere
        return
      }

      let newTestPrint = this.currentCodeGenerator.clickHappened(getPlaybackPath(e.target, e.path))
      this.appendToGeneratedScript(newTestPrint)
      this.awaitMutations()
    })

    document.addEventListener('change', (e: any) => {
      if (!filterEvent(e.path)) {
        return
      }

      //setsUpSelect input watching
      if (e.target.localName === 'select') {
        let newCode = this.currentCodeGenerator.selectChange(getPlaybackPath(e.target, e.path), e)
        this.appendToGeneratedScript(newCode)
        this.awaitMutations()

      }
    })

    document.addEventListener('focusout', (e: any) => {
      if (!filterEvent(e.path)) {
        return
      }

      if (e.target.tagName === 'INPUT' && (e.target.type === 'text' || e.target.type === 'textArea')) {
        let newCode = this.currentCodeGenerator.inputTextEdited(getPlaybackPath(e.target, e.path), e.target.value)
        this.appendToGeneratedScript(newCode)
        this.awaitMutations()
      }
    })
  }

  setUpDragAndDrop (source, target) {
    let testRecorderDragstart = (ev) => {
      let style = window.getComputedStyle(ev.target, null)
      target.addEventListener('dragover', testRecorderDragover)
      target.addEventListener('drop', testRecorderDrop)
      ev.dataTransfer.setData('text/plain', `${(parseInt(style.getPropertyValue('left'), 10) - ev.clientX)}, ${(parseInt(style.getPropertyValue('top'), 10) - ev.clientY)}`)
    }
    let testRecorderDragover = (ev) => {
      source.style.visibility = 'hidden'
      ev.preventDefault()
    }
    let testRecorderDrop = (ev) => {
      let offset = ev.dataTransfer.getData('text/plain').split(',')
      source.style.left = (ev.clientX + parseInt(offset[0], 10)) + 'px'
      source.style.top = (ev.clientY + parseInt(offset[1], 10)) + 'px'
      event.preventDefault()
    }
    let testRecorderDragend = (ev) => {
      source.style.visibility = 'visible'
      target.removeEventListener('dragover', testRecorderDragover)
      target.removeEventListener('drop', testRecorderDrop)
    }
    source.addEventListener('dragstart', testRecorderDragstart)
    source.addEventListener('dragend', testRecorderDragend)
  }

  insertMutationsToGeneratedScript () {

    //don't add the assertino code if we didn't find any mutations of interest
    if (!this.cachedMutations.length) {
      return
    }
    // removeConflictingMutations by retrieving last values of a given path
    var lastUniqueItems = {}
    this.cachedMutations.forEach(item => {
      lastUniqueItems[item.path] = item
    })

    this.cachedMutations = (Object as any).values(lastUniqueItems)

    let final = this.cachedMutations.map((item: MutationEntry) => item.generatedCode).join("<br>")
    let newCode = this.currentUserEvent.mutationCode.replace(TestRecorder.MUTATIONS_PLACEHOLDER, final)
    this.generatedTestCode += newCode
    this.setGeneratedScript(this.generatedTestCode)
    this.cachedMutations = []
  }

  setGeneratedScript (code) {
    this.generatedTestCode = code
    this.codeOutputDiv.innerHTML = '<pre>' + this.generatedTestCode + '</pre>'
    if (Settings.get().persistCode) {
      Settings.saveItem("generatedTestCode", this.generatedTestCode)
    } else {
      Settings.saveItem("generatedTestCode", "")
    }
  }

  appendToGeneratedScript (userEvent: UserEvent) {
    this.currentUserEvent = userEvent
    this.generatedTestCode += userEvent.playbackCode
    this.codeOutputDiv.innerHTML = '<pre>' + this.generatedTestCode + '</pre>'
    if (Settings.get().persistCode) {
      Settings.saveItem("generatedTestCode", this.generatedTestCode)
    } else {
      Settings.saveItem("generatedTestCode", "")
    }

    //todo get prism to work
    // Prism.highlightAll()
  }

  /*  window.addEventListener("hashchange", function (e) {
   console.log("hash")
   alert("hash")
   })
   */

// todo figure out how to assert route changes for different frameworks

  // just examine history changes for now

  /* window.onpushstate = function (e) {
   alert("push")

   }
   window.onpopstate = function (e) {
   alert("pop")

   }*/

  /**
   * Wait for a bit then insert changed into the last placeholder
   * todo Use performance api
   * todo possibly use framework specific hooks to decide when operations finished, ie ember promises for routes
   */
  awaitMutations () {
    setTimeout(function () {
      this.insertMutationsToGeneratedScript()
    }.bind(this), 500)
  }

  childListMutation (mutationRecord: MutationRecord) {
    let addedNodesMutationEntries: MutationEntry[] = []
    let removedNodesMutationEntries: MutationEntry[] = []

    //convert these to Arrays
    let addedNodesArray = Array.prototype.slice.call(mutationRecord.addedNodes)
    let removedNodesArray = Array.prototype.slice.call(mutationRecord.removedNodes)

    // this array is used to generate the source code, we filter
    addedNodesArray = addedNodesArray.filter(PathTools.isElementRecorded)
    removedNodesArray = removedNodesArray.filter(PathTools.isElementRecorded)

    if (!addedNodesArray.length && !removedNodesArray.length) {
      //no point continuing in this iteration if nothing of interest
      return
    }

    // mutations should be mutually exclusive?
    if (addedNodesArray.length && removedNodesArray.length) {
      console.log('strange, both added and removed, investigate')
      return
    }

    addedNodesArray.forEach((node) => {
      let selector = getPlaybackPath(node, getPath(node))
      addedNodesMutationEntries.push(this.currentCodeGenerator.elementAdded(selector))
    })

    removedNodesArray.forEach((node) => {
      let selector = getPlaybackPath(node, getPath(node))
      removedNodesMutationEntries.push(this.currentCodeGenerator.elementRemoved(selector))
    })

    // this sends this new changes back
    this.cachedMutations = this.cachedMutations.concat(addedNodesMutationEntries.length ? addedNodesMutationEntries : removedNodesMutationEntries)
  }

  /**
   * this is the heart ond soul of the assertions
   */
  addObserverForTarget (target: HTMLElement) {
    let observer = new MutationObserver((mutations) => {
      mutations.forEach((mutationRecord: MutationRecord) => {

        switch (mutationRecord.type) {
          case 'characterData':
            let target = mutationRecord.target as HTMLElement

            if (!target.parentElement.id ||
              isElementClassOrChildOfClass(target, TestRecorder.DO_NOT_RECORD)) {
              return
            }
            this.cachedMutations.push(this.currentCodeGenerator.characterDataChanged(mutationRecord))
            return
          case 'childList':
            this.childListMutation(mutationRecord)
            return
          default:
            console.log(`discarding mutation of type ${mutationRecord.type}`)
        }

      })
    })
    let config = { attributes: true, childList: true, characterData: true, subtree: true }

    // this is the only place where observe is called so we can track them here too to disconnect
    observer.observe(target, config)
    console.log(target)
    this.mutationObserversArr.push(observer)

  }
}

/**
 * Gets the nth child index so we can select the element directly
 *
 * @param element
 * @returns {number}
 */
function findNthChildIndex (element: HTMLElement) {
  let parent: HTMLElement | Node = element.parentNode
  if (!parent) {
    return -1
  }
  let children = (parent instanceof HTMLElement) ? parent.children : parent.childNodes

  let hasOthers = [].some.call(children, function (elem) {
    return elem.tagName === element.tagName && elem !== element
  })
  if (!hasOthers) {
    return -1
  }
  return Array.from(children).indexOf(element) + 1//because nth child is 1 indexed
}

/**
 *
 * @param e event from the DOM that we want to workout the testing path.
 */
function getPlaybackPath (element: HTMLElement, path: HTMLElement[]) {

  let testHelper: string
  for (var i in element.dataset) {
    if (i.match(/^test*/)) {
      //convert something like testFoo to data-test-foo
      testHelper = `data-${i}`.replace(/([A-Z])/g, "-$1").replace(/^-/, '').toLowerCase()
      if(element.dataset[i]){
        testHelper += `="${element.dataset[i]}"`
      }
      break
    }
  }

  if (testHelper) {
    return `[${testHelper}]`
  }
  else if (element.id) {
    return '#' + element.id
  } else {
    let newPath = getPathUpTillBody(path)
    newPath = get_Path_To_Nearest_Class_or_Id(newPath).reverse()

    let fullPath = newPath.map(function (element: HTMLElement) {
      // we need to make each path segment more specific if other siblings of the same type exist
      let index = findNthChildIndex(element)
      let idPart = element.id ? `#${element.id}` : ""

      let classPart = element.className ? `.${Array.from(element.classList).map(className => className).join('.')}` : ""
      return element.localName + idPart + classPart + (index !== -1 ? ':nth-child(' + index + ')' : '')
    }).join('>')// join all the segments for the query selector
    console.log(fullPath)
    return fullPath
  }
}

function isAnyElementInPathClassOrChildOfClass (path: HTMLElement[], className) {
  for (let i = 0; i < path.length; i++) {
    if (Array.from(path[i].classList).indexOf(className) !== -1) {
      return true
    }
  }
  return false
}

function getPathUpTillBody (path) {
  // `get index of body, ignore window , document shadow etc
  let length = path.length
  for (let i = 0; i < length; i++) {
    if (path[i].tagName === 'BODY') {
      return path.slice(0, i + 1)
    }
  }
}

function get_Path_To_Nearest_Class_or_Id (path) {
  // `get index of body, ignore window , document shadow etc
  let length = path.length
  for (let i = 0; i < length; i++) {
    if (path[i].className || path[i].id) {
      return path.slice(0, i + 1)
    }
  }
  return path
}

// open the recorder if user specifies
var testRecorder: TestRecorder
if (Settings.get().keepOpen) {
  console.log("opening test recorder automatically")
  console.log(Settings.get())
  testRecorder = new TestRecorder()
}
``
// chrome extension handler
declare var chrome: any

/*var port = chrome.runtime.connect('ibjkbgeclcimkbjklkggflanmjfcjefo');

window.addEventListener("message", function(event) {
  // We only accept messages from ourselves
  if (event.source != window)
    return;

  if (event.data.type && (event.data.type == "FROM_PAGE")) {
    console.log("Content script received: " + event.data.text);
    port.postMessage(event.data.text);
  }
}, false);*/

setTimeout(() => {
  if (chrome && chrome.runtime && chrome.runtime.onMessage) {
    chrome.runtime.onMessage.addListener(
      function () {
        if (!testRecorder) {
          console.log("Extension button click opening test recorder")
          testRecorder = new TestRecorder()
          return
        }
        console.log("Extension button clicked closing already open test recorder")
        testRecorder.destroy()
        testRecorder = null
      })
  }
}, 2100)
