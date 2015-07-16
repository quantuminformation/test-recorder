import TestRecorderUtils from './util/TestRecorderUtils';

NodeList.prototype[Symbol.iterator] = Array.prototype[Symbol.iterator]; //for chrome


document.body.onload = function addElement() {
  let codeOutputDiv = document.createElement("div");

  //todo look at using more specific selector
  let rootDomNode = document.querySelector('body');
  //let rootDomNode = document.querySelector('body [id^=ember]')

  codeOutputDiv.setAttribute("id", "generatedScript");
  codeOutputDiv.setAttribute("class", "dont"); //ignore click events on this for test recording
  codeOutputDiv.onclick = selectText;
  document.body.appendChild(codeOutputDiv);

  //TestRecorderUtils.setupAll(document.querySelector('body [id^=ember]'), codeOutputDiv);
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
