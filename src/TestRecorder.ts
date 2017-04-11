//todo perhaps use typescript to have these as interface implementation
import mutationUtils from './util/MutationUtils'
import { NightwatchGenerator } from './codeGenerators/NightwatchGenerator'
import './styles/app.pcss'
import { copyTextToClipboard } from './util/clipboard'
import  'prismjs'
import  'prismjs/components/prism-javascript'
import { ICodeGenerator } from './codeGenerators/ICodeGenerator'
import { EmberCLIGenerator } from "./codeGenerators/EmberCLI";
declare var Prism

/**
 * Default tests that are generated are for Nightwatch
 */
export class TestRecorder {

  codeGenerators: Map<string, ICodeGenerator>

  currentCodeGenerator: ICodeGenerator

  mutationObserversArr: MutationObserver[] = []
  generatedTestCode: string = '' //this is sent to what ever wants to receive generated code
  lastRoute: ''
  cachedMutations: string = '' //this stores the changes made from mutations until we want to insert them into the generated code
  hostElement: HTMLElement

  static MUTATIONS_PLACEHOLDER = '[MUTATIONS_PLACEHOLDER]'
  static DO_NOT_RECORD = 'doNotRecord'

  constructor () {

    let nightwatchGenerator = new NightwatchGenerator()
    let emberCLIGenerator = new EmberCLIGenerator()
    this.codeGenerators = new Map([
      [emberCLIGenerator.description, emberCLIGenerator],
      [nightwatchGenerator.description, nightwatchGenerator],
    ])

    this.currentCodeGenerator = this.codeGenerators.values().next().value

    let rootDomNode = document.querySelector('body')
    let ui = document.createElement('div')
    ui.innerHTML =
      `<div id="testRecorderUI" class="doNotRecord">
        <button id="copy">Copy</button>
        <select id="framework-choice">
          ${Array.from(this.codeGenerators.keys()).map(item => `<option value="${item}">${item}</option>`).join('')}
        </select>
    
        <div id="generatedScript" class="language-javascript"></div> 
        </div>
    </div> `

    document.body.appendChild(ui.firstChild)

    let codeOutputDiv = document.getElementById('generatedScript')
    this.hostElement = codeOutputDiv
    //this will iterate through this node and watch for changes and store them until we want to display them
    this.addObserverForTarget(rootDomNode, 0)
    // this.setGeneratedScript(this.currentCodeGenerator.initialCode())
    this.addListeners()
  }

  /**
   * listen to events of various type bubbling up to the document
   */
  addListeners () {

    //test recorder UI--------------------------------------------------------------------
    document.querySelector('#copy').addEventListener('click', () => {
      copyTextToClipboard(this.hostElement.textContent)
    })
    document.querySelector('#framework-choice').addEventListener('change', (event: any) => {
      let newValue = (event.target.options[event.target.selectedIndex]).value
      this.currentCodeGenerator = this.codeGenerators.get(newValue)
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

      let newTestPrint = this.currentCodeGenerator.clickHappened(getPlaybackPath(e))
      this.appendToGeneratedScript(newTestPrint)
      this.awaitMutations()
    })

    document.addEventListener('change', (e: any) => {
      if (!filterEvent(e.path)) {
        return
      }

      //setsUpSelect input watching
      if (e.target.localName === 'select') {
        let newCode = this.currentCodeGenerator.selectChange(getPlaybackPath(e), e)
        this.appendToGeneratedScript(newCode)
        this.awaitMutations()

      }
    })

    document.addEventListener('focusout', (e: any) => {
      if (!filterEvent(e.path)) {
        return
      }

      if (e.target.tagName === 'INPUT' && e.target.type === 'text') {
        let newCode = this.currentCodeGenerator.inputTextEdited(getPlaybackPath(e), e.target.value)
        this.appendToGeneratedScript(newCode)
        this.awaitMutations()
      }
    })
  }

  insertMutationsToGeneratedScript () {
    this.setGeneratedScript(this.generatedTestCode.replace(TestRecorder.MUTATIONS_PLACEHOLDER, this.cachedMutations))
    this.cachedMutations = ''
  }

  setGeneratedScript (code) {
    this.generatedTestCode = code
    //todo perhaps use Object.observe once FF supports it
    this.hostElement.innerHTML = '<pre>' + this.generatedTestCode + '</pre>'
  }

  appendToGeneratedScript (code) {
    this.generatedTestCode += code
    //todo perhaps use Object.observe once FF supports it
    this.hostElement.innerHTML = '<pre>' + this.generatedTestCode + '</pre>'
    Prism.highlightAll()
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
    let addedNodesTestText = ''
    let removedNodesTestText = ''

    //convert these to Arrays
    let addedNodesArray = Array.prototype.slice.call(mutationRecord.addedNodes)
    let removedNodesArray = Array.prototype.slice.call(mutationRecord.removedNodes)

    // this array is used to generate the source code, we filter
    addedNodesArray = addedNodesArray.filter(mutationUtils.filter_DoNotRecord_WhiteSpace_emberID_noID)
    removedNodesArray = removedNodesArray.filter(mutationUtils.filter_DoNotRecord_WhiteSpace_emberID_noID)

    if (!addedNodesArray.length && !removedNodesArray.length) {
      //no point continuing in this iteration if nothing of interest
      return
    }

    // mutations should be mutually exclusive?
    if (addedNodesArray.length && removedNodesArray.length) {
      alert('strange')
      return
    }

    addedNodesArray.forEach((node) => {
      addedNodesTestText += this.currentCodeGenerator.elementAdded(node.id)
    })

    removedNodesArray.forEach((node) => {
      removedNodesTestText += this.currentCodeGenerator.elementRemoved(node.id)
    })

    // this sends this new changes back
    this.cachedMutations += (addedNodesTestText || removedNodesTestText)
  }

  /**
   * Adds observer for target and generates source code
   * then adds observers for its children recursively
   * @param target
   */
  addObserverForTarget (target, recursionDepth) {
    let observer = new MutationObserver((mutations) => {
      mutations.forEach((mutationRecord: MutationRecord) => {

        switch (mutationRecord.type) {
          case 'characterData':
            let target = mutationRecord.target as HTMLElement

            if (!target.parentElement.id ||
              isElementClassOrChildOfClass(target, TestRecorder.DO_NOT_RECORD)) {
              this.cachedMutations = ""
              return
            }
            this.cachedMutations += this.currentCodeGenerator.characterDataChanged(mutationRecord)
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
function getPlaybackPath (e: any) {
  if (e.target.id) {
    return '#' + e.target.id
  } else {
    let path = get_Path_To_Nearest_Class_or_Id(getPathUpTillBody(e.path)).reverse()

    let fullPath = path.map(function (element: HTMLElement) {
      // we need to make each path segment more specific if other siblings of the same type exist
      let index = findNthChildIndex(element)
      let idPart = element.id ? `#${element.id}` : ""
      let classPart = element.className ? `.${element.className}` : ""
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
function isElementClassOrChildOfClass (element: HTMLElement, className): boolean {
  let classListArray = element.classList && Array.prototype.slice.call(element.classList)
  let hasDoNotRecordClass = classListArray ? (classListArray.indexOf('doNotRecord') !== -1) : false

  if (hasDoNotRecordClass) {
    return true
  }
  if (element.parentElement) {
    return isElementClassOrChildOfClass(element.parentElement, className)
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
