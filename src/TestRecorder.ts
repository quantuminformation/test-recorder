//todo perhaps use typescript to have these as interface implementation
import mutationUtils from './util/MutationUtils'
import {NightwatchGenerator} from "./codeGenerators/NightwatchGenerator"

/**
 * Default tests that are generated are for Nightwatch
 */
export class  TestRecorder {

  updateCodeCallback: null//callback to the component to set the code, we need this here so we can tie into the framework we are automating
  generatedTestCode: "" //this is sent to what ever wants to receive generated code
  lastRoute: ""
  cachedMutations: "" //this stores the changes made from mutations until we want to insert them into the generated code
  currentCodeGenerator = new NightwatchGenerator
  codeOutputDiv: null//holds the screen for the code

  static MUTATIONS_PLACEHOLDER = "[MUTATIONS_PLACEHOLDER]"

  constructor(){

  }

  insertMutationsToGeneratedScript(newChanges) {
    this.setGeneratedScript(this.generatedTestCode.replace(TestRecorder.MUTATIONS_PLACEHOLDER, this.cachedMutations))
    this.cachedMutations = ""
  }

  /**
   * Stores a result from a mutation
   * @param newChanges
   */
  storeMutationResult(newChanges) {
    return (newChanges)=> {
      this.cachedMutations += newChanges
    }
  }

  /**
   * Wires up everything
   * @param rootDomNode
   * @param codeOutputDiv The UI that displays the code to the user
   */
  setupAll(rootDomNode, codeOutputDiv) {

    this.codeOutputDiv = codeOutputDiv
    this.setUpChangeListeners()
    this.setUpClickListeners()
    this.setUpOtherListeners()
    //this will iterate through this node and watch for changes and store them until we want to display them
    mutationUtils.monitorMutations(rootDomNode, this.storeMutationResult)
  }

  setGeneratedScript (code) {
    this.generatedTestCode = code
    //todo perhaps use Object.observe once FF supports it
    this.codeOutputDiv.innerHTML = '<pre>' + this.generatedTestCode + '</pre>'
  }
  appendToGeneratedScript (code) {
    this.generatedTestCode += code
    //todo perhaps use Object.observe once FF supports it
    this.codeOutputDiv.innerHTML = '<pre>' + this.generatedTestCode + '</pre>'
  }

  setUpOtherListeners() {

    var self = this

    /**
     * this is used for capturing text input fill-ins
     */

    document.addEventListener('focusout', (e:FocusEvent) => {
      if (e.target.tagName === 'INPUT' && e.target.type === 'text') {
        let newCode = this.currentCodeGenerator.inputTextEdited(self.getPlaybackPath(e), e.target.value)
        self.appendToGeneratedScript(newCode)
      }
    })
  },

  setUpChangeListeners () {
    document.addEventListener("change", (e)=> {
      //setsUpSelect input watching
      if (e.target.localName === "select") {
        let newSelectedIndex = e.target.selectedIndex
        let newCode = currentCodeGenerator.selectChange(this.getPlaybackPath(e), newSelectedIndex)
        this.appendToGeneratedScript(newCode)
      }
    })

    /*  window.addEventListener("hashchange", function (e) {
     console.log("hash")
     alert("hash")
     })*/


//todo figure out how to assert route changes for different frameworks


    //just examine history changes for now

    window.onpushstate = function (e) {
      alert("push")

    }
    window.onpopstate = function (e) {
      alert("pop")

    }


  },

  /**
   * handle simple click events here, not things like selects, date pickers etc
   * We assume that the user doesn't click on the application why async operations are ongoing so we
   * know where to place the changes in the generated code.
   */
  setUpClickListeners () {

    var self = this

    document.addEventListener('click', (e)=> {

      if (e.target.localName === 'input' && e.target.type === 'text' || //on listen to focus-out for these
        e.target.localName === 'html' ||  //don't want to record clicking outside the app'
        e.target.localName === 'pre' || //don't want to recorded the output code'
        e.target.type === 'select-one') { // so listen to clicks on select inputs, we handle this with triggers
        return
      }

      var newTestPrint = common.currentCodeGenerator.clickHappened(this.getPlaybackPath(e))
      this.appendToGeneratedScript(newTestPrint)
      this.awaitMutations()
    })

  },
  /**
   * Wait for a bit then insert changed into the last placeholder
   * todo Use performance api
   * todo possibly use framework specific hooks to decide when operations finished, ie ember promises for routes
   */
  awaitMutations() {
    setTimeout(()=> {
      this.insertMutationsToGeneratedScript()
    }, 500)
  },

  /**
   *
   * @param e event from the DOM that we want to workout the testing path.
   */
  getPlaybackPath (e) {
    let hasEmberIdRegex = /ember[\d]+/
    if (e.target.id && !hasEmberIdRegex.test(e.target.id)) {
      return "#" + e.target.id
    } else {
      let path = e.path.reverse().slice(2) //remove the window and document path sections
      let fullPath = path.map(function (element) {
        // we need to make each path segment more specific if other siblings of the same type exist
        let index = findNthChildIndex(element)
        return element.localName + (index !== -1 ? ':nth-child(' + index + ')' : '')
      }).join('>')//join all the segments for the query selector
      console.log(fullPath)
      return fullPath
    }
  }

  selectText(el) {
    var range;
    if (window.getSelection && document.createRange) {
      range = document.createRange();
      let sel = window.getSelection();
      range.selectNodeContents(el.currentTarget);
      sel.removeAllRanges();
      sel.addRange(range);
    } else if (document.body && document.body.createTextRange) {
      range = document.body.createTextRange();
      range.moveToElementText(el);
      range.select();
    }
  }

  createUI{
  let rootDomNode = document.querySelector('body');


  let ui = document.createElement('div');
  ui.innerHTML =
  `<div id="testRecorderUI" class="doNotRecord">
    <div id="testRecorderUI-Title">${common.currentCodeGenerator.description}</div> 
    <div id="generatedScript"></div> 
    </div>`

  document.body.appendChild(ui);
  document.getElementById("generatedScript").onclick = selectText;

  let codeOutputDiv = document.getElementById("generatedScript");
  TestRecorderUtils.setupAll(rootDomNode, codeOutputDiv);
}

}

/**
 * Gets the nth child index so we can select the element directly
 *
 * @param element
 * @returns {number}
 */
function findNthChildIndex(element: HTMLElement) {
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
