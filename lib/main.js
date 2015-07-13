import TestRecorderUtils from 'ember-cli-test-recorder/util/TestRecorderUtils';

document.body.onload = function addElement() {
  var newDiv = document.createElement("div");
  newDiv.setAttribute("id", "generatedScript");
  newDiv.setAttribute("class", "dont"); //ignore click events on this for test recording
  newDiv.onclick = selectText;
  document.body.appendChild(newDiv);
  TestRecorderUtils.setupAll(document.querySelector('body [id^=ember]'), newDiv);
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
