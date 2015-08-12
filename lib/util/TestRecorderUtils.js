//todo perhaps use typescript to have these as interface implementation
import mutationUtils from './MutationUtils';
import common from './common';


export default {

  updateCodeCallback: null,//callback to the component to set the code, we need this here so we can tie into the framework we are automating
  generatedTestCode: "", //this is sent to what ever wants to receive generated code
  lastRoute: "",
  cachedMutations: "", //this stores the changes made from mutations until we want to insert them into the generated code

  codeOutputDiv: null,//holds the screen for the code


  insertMutationsToGeneratedScript: function (newChanges) {
    this.setGeneratedScript(this.generatedTestCode.replace(common.MUTATIONS_PLACEHOLDER, this.cachedMutations));
    this.cachedMutations = "";
  },

  /**
   * Stores a result from a mutation
   * @param newChanges
   */
  storeMutationResult: (newChanges) => {
    this.cachedMutations += newChanges;
  },

  /**
   * Wires up everything
   * @param rootDomNode
   * @param updateCodeCallback //the only reason for this is so we can update the ember component or protractor
   */
  setupAll: function (rootDomNode, codeOutputDiv) {

    this.codeOutputDiv = codeOutputDiv;
    this.setUpChangeListeners();
    this.setUpClickListeners();
    this.setUpOtherListeners();
    //this will iterate through this node and watch for changes and store them until we want to display them
    mutationUtils.monitorMutations(rootDomNode, this.storeMutationResult);
  },

  setGeneratedScript: function (code) {
    this.generatedTestCode = code;
    //todo perhaps use Object.observe once FF supports it
    this.codeOutputDiv.innerHTML = '<pre>' + this.generatedTestCode + '</pre>';
  },
  appendToGeneratedScript: function (code) {
    this.generatedTestCode += code;
    //todo perhaps use Object.observe once FF supports it
    this.codeOutputDiv.innerHTML = '<pre>' + this.generatedTestCode + '</pre>';
  },

  setUpOtherListeners: function () {

    var self = this;

    /**
     * this is used for capturing text input fill-ins
     */

    document.addEventListener('focusout', e => {
      if (e.target.tagName === 'INPUT' && e.target.type === 'text') {
        let newCode = common.currentCodeGenerator.inputTextEdited(self.getPlaybackPath(e), e.target.value);
        self.appendToGeneratedScript(newCode);
      }
    });
  },

  setUpChangeListeners: function () {
    document.addEventListener("change", (e)=> {
      //setsUpSelect input watching
      if (e.target.localName === "select") {
        let newSelectedIndex = e.target.selectedIndex;
        let newCode = common.currentCodeGenerator.selectChange(this.getPlaybackPath(e), newSelectedIndex);
        this.appendToGeneratedScript(newCode);
      }
    });

    /*  window.addEventListener("hashchange", function (e) {
     console.log("hash");
     alert("hash");
     });*/


//todo figure out how to assert route changes for different frameworks


    //just examine history changes for now

    window.onpushstate = function (e) {
      alert("push");

    };
    window.onpopstate = function (e) {
      alert("pop");

    };


  },

  /**
   * handle simple click events here, not things like selects, date pickers etc
   * We assume that the user doesn't click on the application why async operations are ongoing so we
   * know where to place the changes in the generated code.
   */
  setUpClickListeners: function () {

    var self = this;

    document.addEventListener('click', (e)=> {

      if (e.target.localName === 'input' && e.target.type === 'text' || //on listen to focus-out for these
        e.target.localName === 'html' ||  //don't want to record clicking outside the app'
        e.target.localName === 'pre' || //don't want to recorded the output code'
        e.target.type === 'select-one') { // so listen to clicks on select inputs, we handle this with triggers
        return;
      }

      var newTestPrint = common.currentCodeGenerator.clickHappened(this.getPlaybackPath(e));
      this.appendToGeneratedScript(newTestPrint);
      this.awaitMutations();
    });

  },
  /**
   * Wait for a bit then insert changed into the last placeholder
   * todo Use performance api
   * todo possibly use framework specific hooks to decide when operations finished, ie ember promises for routes
   */
  awaitMutations: function () {
    setTimeout(()=> {
      this.insertMutationsToGeneratedScript();
    }, 500)
  },

  /**
   *
   * @param e event from the DOM that we want to workout the testing path.
   */
  getPlaybackPath: function (e) {
    let hasEmberIdRegex = /ember[\d]+/;
    if (e.target.id && !hasEmberIdRegex.test(e.target.id)) {
      return "#" + e.target.id;
    } else {
      let path = e.path.reverse().slice(2); //remove the window and document path sections
      let fullPath = path.map(function (element) {
        // we need to make each path segment more specific if other siblings of the same type exist
        let index = findNthChildIndex(element);
        return element.localName + (index !== -1 ? ':nth-child(' + index + ')' : '');
      }).join('>');//join all the segments for the query selector
      console.log(fullPath);
      return fullPath;
    }
  }
};

/**
 * Gets the nth child index so we can select the element directly
 *
 * @param element
 * @returns {number}
 */
function findNthChildIndex(element) {
  let parent = element.parentNode;
  if (!parent) {//its the <html> tag
    return -1;
  }
  let children = parent.children;
  let hasOthers = [].some.call(children, function (elem) {
    return elem.tagName === element.tagName && elem !== element;
  });
  if (!hasOthers) {
    return -1;
  }
  return Array.from(children).indexOf(element) + 1;//because nth child is 1 indexed
}
