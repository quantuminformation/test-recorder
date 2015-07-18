import TestRecorderUtils from './util/TestRecorderUtils';
import detectFramework from './util/detectFramework';
import emberQUnit from './codeGenerators/EmberQUnit';
import angular1Protractor from './codeGenerators/angular1Protractor';

NodeList.prototype[Symbol.iterator] = Array.prototype[Symbol.iterator]; //for chrome

/**
 * Create the UI div that holds the generated code
 */
document.body.onload = function addElement() {
  let rootDomNode = document.querySelector('body');
  //set up the extra UI


  var currentCodeGenerator;
  switch (detectFramework()) {
    case 'ember':
      currentCodeGenerator = emberQUnit;
      break;
    case 'angular':
      currentCodeGenerator = angular1Protractor;
      break;
  }

  document.body.innerHTML +=
    '<div id="testRecorderUI" class="dont" onclick="selectText()">' +
    '<div id="testRecorderUI-Title">' + currentCodeGenerator.description + '</div>' +
    '<div id="generatedScript"></div>' +
    '</div> ';

  let codeOutputDiv = document.getElementById("generatedScript");
  TestRecorderUtils.setupAll(rootDomNode, codeOutputDiv, currentCodeGenerator);
};

/**
 * selects all the generated source code when user clicks on the UI for the code
 * @param el
 */
function selectText(el) {
  var range;
  if (window.getSelection && document.createRange) {
    range = document.createRange();
    var sel = window.getSelection();
    range.selectNodeContents(el.currentTarget);
    sel.removeAllRanges();
    sel.addRange(range);
  } else if (document.body && document.body.createTextRange) {
    range = document.body.createTextRange();
    range.moveToElementText(el);
    range.select();
  }
}
