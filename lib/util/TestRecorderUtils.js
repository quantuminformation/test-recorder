//todo perhaps use typescript to have these as interface implementation
import mutationUtils from './MutationUtils';


export default {

  updateCodeCallback: null,//callback to the component to set the code, we need this here so we can tie into the framework we are automating
  generatedTestCode: "", //this is sent to what ever wants to receive generated code
  lastRoute: "",

  currentCodeGenerator: null,//holds the env specific generator (angular,ember etc)

  codeOutputDiv: null,//holds the screen for the code


  /**
   * Wires up everything
   * @param rootDomNode
   * @param updateCodeCallback //the only reason for this is so we can update the ember component or protractor
   * @param currentCodeGenerator
   */
  setupAll: function (rootDomNode, codeOutputDiv, currentCodeGenerator) {

    this.currentCodeGenerator = currentCodeGenerator;
    this.codeOutputDiv = codeOutputDiv;
    this.setUpChangeListeners();
    this.setUpClickListeners();
    this.setUpOtherListeners();
    //this will iterate through this node and watch for changes and store them until we want to display them
    mutationUtils.addObserverForTarget(rootDomNode, this.currentCodeGenerator);
    this.setGeneratedScript(this.currentCodeGenerator.initialCode());
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
    for (var item of document.querySelectorAll("input")) {
      item.addEventListener("focusout", (e) => {
        e.target.classList.add("active");
        if (e.target.localName === 'input' && e.target.type === 'text') {
          let newCode = this.currentCodeGenerator.inputTextEdited(self.getPlaybackPath(e), e.target.value);
          //add to existing tests
          self.appendToGeneratedScript(newCode);
        } else {
          return;
        }

      }, false);
    }


  },

  setUpChangeListeners: function () {
    document.addEventListener("change", (e)=> {
      //setsUpSelect input watching
      if (e.target.localName === "select") {
        let newSelectedIndex = e.target.selectedIndex;
        let newCode = this.currentCodeGenerator.selectChange(this.getPlaybackPath(e), newSelectedIndex);
        this.appendToGeneratedScript(newCode);
      }
    });

//todo native history/hashchange watching
    /*

     window.addEventListener("hashchange", function(e){
     console.log("hash");
     alert("hash");
     });

     window.onpushstate = function () {
     alert("push");

     };
     window.onpopstate= function () {
     alert("pop");

     };
     */

  },

  /**
   * handle simple click events here, not things like selects, date pickers etc
   * //todo consider wrapping mutations code in timeout to give async ops time
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

      //clear this if not DOM mutations happen ()
      var cleanText = self.generatedTestCode.replace(self.MUTATIONS_PLACEHOLDER, "");
      var newGeneratedScript = cleanText;
      var newTestPrint = this.currentCodeGenerator.clickHappened(this.getPlaybackPath(e));

      //add to exisiting tests
      newGeneratedScript += newTestPrint;


      //todo make async, because the click event happens after mutations then we can immediately put this in, this should be put
      //in after after a user defined time period to allow server operations that take time
      var withReplacement = newGeneratedScript.replace(self.MUTATIONS_PLACEHOLDER, mutationUtils.pendingGeneratedDomChangedScript);
      self.setGeneratedScript(withReplacement);
      mutationUtils.pendingGeneratedDomChangedScript = "";
    });

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
