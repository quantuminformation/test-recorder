import TestRecorderUtils from './util/TestRecorderUtils';
import detectFramework from './util/detectFramework';
import emberQUnit from './codeGenerators/EmberQUnit';
import angular1Protractor from './codeGenerators/angular1Protractor';
import reactProtractor from './codeGenerators/reactProtractor';
import common from './util/common';

require ("./styles/app.css");//webpack will bundle this into the script

NodeList.prototype[Symbol.iterator] = Array.prototype[Symbol.iterator]; //for chrome

// get the framework type from the script tag
var framework = document.currentScript.dataset.framework;
/**
 * Create the UI div that holds the generated code
 */
document.body.onload = function addElement() {
  let rootDomNode = document.querySelector('body');

  switch (framework) {
    case 'ember':
      common.currentCodeGenerator = emberQUnit;
      break;
    case 'angular':
      common.currentCodeGenerator = angular1Protractor;
      break;
    case 'react':
      common.currentCodeGenerator = reactProtractor;
      break;
  }
  let ui = document.createElement('div');
  ui.innerHTML +=
    '<div id="testRecorderUI" class="doNotRecord">' +
    '<div id="testRecorderUI-Title">' + common.currentCodeGenerator.description + '</div>' +
    '<div id="generatedScript"></div>' +
    '</div> ';

  document.body.appendChild(ui);
  document.getElementById("generatedScript").onclick = selectText;

  let codeOutputDiv = document.getElementById("generatedScript");
  TestRecorderUtils.setupAll(rootDomNode, codeOutputDiv);
};

/**
 * selects all the generated source code when user clicks on the UI for the code
 * @param el
 */
function selectText(el) {
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
