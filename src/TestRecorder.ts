//todo perhaps use typescript to have these as interface implementation
import mutationUtils from './util/MutationUtils'
import {NightwatchGenerator} from "./codeGenerators/NightwatchGenerator"
import './styles/app.pcss'

/**
 * Default tests that are generated are for Nightwatch
 */
export class TestRecorder {


  mutationObserversArr: MutationObserver[] = []

  generatedTestCode: "" //this is sent to what ever wants to receive generated code
  lastRoute: ""
  cachedMutations: "" //this stores the changes made from mutations until we want to insert them into the generated code
  currentCodeGenerator = new NightwatchGenerator()
  hostElement: HTMLElement

  static MUTATIONS_PLACEHOLDER = "[MUTATIONS_PLACEHOLDER]"

  constructor() {
    let rootDomNode = document.querySelector('body');
    let ui = document.createElement('div');
    ui.innerHTML =
      `<div id="testRecorderUI" class="doNotRecord">
    <div id="testRecorderUI-Title">${this.currentCodeGenerator.description}</div> 
    <div id="generatedScript"></div> 
    </div>`

    document.body.appendChild(ui);

    let codeOutputDiv = document.getElementById("generatedScript");
    this.hostElement = codeOutputDiv
    this.setUpChangeListeners()
    this.setUpClickListeners()
    this.setUpOtherListeners()
    //this will iterate through this node and watch for changes and store them until we want to display them
    this.addObserverForTarget(rootDomNode, 0)
    this.setGeneratedScript(this.currentCodeGenerator.initialCode())
  }

  insertMutationsToGeneratedScript() {
    this.setGeneratedScript(this.generatedTestCode.replace(TestRecorder.MUTATIONS_PLACEHOLDER, this.cachedMutations))
    this.cachedMutations = ""
  }

  setGeneratedScript(code) {
    this.generatedTestCode = code
    //todo perhaps use Object.observe once FF supports it
    this.hostElement.innerHTML = '<pre>' + this.generatedTestCode + '</pre>'
  }

  appendToGeneratedScript(code) {
    this.generatedTestCode += code
    //todo perhaps use Object.observe once FF supports it
    this.hostElement.innerHTML = '<pre>' + this.generatedTestCode + '</pre>'
  }

  setUpOtherListeners() {
    document.addEventListener('focusout', (e: any) => {
      if (e.target.tagName === 'INPUT' && e.target.type === 'text') {
        let newCode = this.currentCodeGenerator.inputTextEdited(getPlaybackPath(e), e.target.value)
        this.appendToGeneratedScript(newCode)
      }
    })
  }


  setUpChangeListeners() {
    document.addEventListener("change", (e: any) => {
      //setsUpSelect input watching
      if (e.target.localName === "select") {
        let newSelectedIndex = e.target.selectedIndex
        let newCode = this.currentCodeGenerator.selectChange(getPlaybackPath(e), newSelectedIndex)
        this.appendToGeneratedScript(newCode)
      }
    })
  }

  /*  window.addEventListener("hashchange", function (e) {
   console.log("hash")
   alert("hash")
   })*/


//todo figure out how to assert route changes for different frameworks


  //just examine history changes for now

  /* window.onpushstate = function (e) {
   alert("push")

   }
   window.onpopstate = function (e) {
   alert("pop")

   }*/


  /**
   * handle simple click events here, not things like selects, date pickers etc
   * We assume that the user doesn't click on the application why async operations are ongoing so we
   * know where to place the changes in the generated code.
   */
  setUpClickListeners() {

    var self = this

    document.addEventListener('click', (e: any) => {

      if (e.target.localName === 'input' && e.target.type === 'text' || //on listen to focus-out for these
        e.target.localName === 'html' ||  //don't want to record clicking outside the app'
        e.target.localName === 'pre' || //don't want to recorded the output code'
        e.target.type === 'select-one') { // so listen to clicks on select inputs, we handle this with triggers
        return
      }

      var newTestPrint = this.currentCodeGenerator.clickHappened(getPlaybackPath(e))
      this.appendToGeneratedScript(newTestPrint)
      this.awaitMutations()
    })

  }

  /**
   * Wait for a bit then insert changed into the last placeholder
   * todo Use performance api
   * todo possibly use framework specific hooks to decide when operations finished, ie ember promises for routes
   */
  awaitMutations() {
    setTimeout(function () {
      this.insertMutationsToGeneratedScript()
    }.bind(this), 500)
  }

  /**
   * Adds observer for target and generates source code
   * then adds observers for its children recursively
   * @param target
   */
  addObserverForTarget(target, recursionDepth) {
    let self = this;
    let observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {

        let addedNodesTestText = "";
        let removedNodesTestText = "";

        //convert these to Arrays
        let addedNodesArray = Array.prototype.slice.call(mutation.addedNodes);
        let removedNodesArray = Array.prototype.slice.call(mutation.removedNodes);

        // This array is used to add new mutation Observers from the newly added DOM
        let newMutationsFromAddedNodesArray = addedNodesArray.filter(mutationUtils.filterDoNotRecordAndWhiteSpace);

        //loop through the above and add observers, we need to do this dynamically
        newMutationsFromAddedNodesArray.forEach(function (node) {
          self.addObserverForTarget(node, recursionDepth); //just drill down 2 levels more
        });

        //this array is used to generate the source code, we filter
        addedNodesArray = addedNodesArray.filter(mutationUtils.filter_DoNotRecord_WhiteSpace_emberID_noID);
        removedNodesArray = removedNodesArray.filter(mutationUtils.filter_DoNotRecord_WhiteSpace_emberID_noID);

        if (!addedNodesArray.length && !removedNodesArray.length) {
          //no point continuing in this iteration if nothing of interest
          return;
        }

        //mutations should be mutually exclusive?
        if (addedNodesArray.length && removedNodesArray.length) {
          alert("strange");
          return;
        }

        addedNodesArray.forEach(function (node) {
          addedNodesTestText += this.currentCodeGenerator.elementAdded(node.id);
        });

        removedNodesArray.forEach(function (node) {
          removedNodesTestText += this.currentCodeGenerator.elementRemoved(node.id);
        });

        //this sends this new changes back
        this.cachedMutations += (addedNodesTestText || removedNodesTestText)
      });
    });
    let config = {attributes: true, childList: true, characterData: true};

    //this is the only place where observe is called so we can track them here too to disconnect
    observer.observe(target, config);
    console.log(target)
    this.mutationObserversArr.push(observer);

    //Create observers for the children recursively
    if ((target.children && target.children.length)) {
      let nextRecursionDepth = recursionDepth + 1;
      for (let i = 0; target.children && i < target.children.length; i++) {
        let child = target.children[i];
        let classListArray = child.classList && Array.prototype.slice.call(child.classList);
        let hasDoNotRecordClass = classListArray ? (classListArray.indexOf("doNotRecord") !== -1) : false;

        if (!hasDoNotRecordClass && recursionDepth <= 6 && child.children && child.children.length) {
          this.addObserverForTarget(child, nextRecursionDepth);
        }
      }
    }
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

/**
 *
 * @param e event from the DOM that we want to workout the testing path.
 */
function getPlaybackPath(e: any) {
  if (e.target.id) {
    return "#" + e.target.id
  } else {
    let path = e.path

    //get index of body, ignore window , document shadow etc
    let length = e.path.length
    for (var i = 0; i < length; i++) {
      if (path[i].tagName === 'BODY') {
        path = path.slice(0, i + 1).reverse()
        break
      }
    }
    let fullPath = path.map(function (element) {
      // we need to make each path segment more specific if other siblings of the same type exist
      let index = findNthChildIndex(element)
      return element.localName + (index !== -1 ? ':nth-child(' + index + ')' : '')
    }).join('>')//join all the segments for the query selector
    console.log(fullPath)
    return fullPath
  }
}
