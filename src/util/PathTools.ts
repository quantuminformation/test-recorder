import { localSettings } from "../LocalSettings"
import { Regexes } from "../Regexes"
import { TestRecorder } from "../TestRecorder"

export default {
  /**
   * A lot of logic to decide what mutations are output to the code generator
   * @param {HTMLElement} node
   * @returns {HTMLElement | any | boolean | string | any}
   */
  isElementRecorded(node: HTMLElement) {
    // ignore stuff inside do not record classes
    if (isElementClassOrChildOfClass(node, TestRecorder.DO_NOT_RECORD)) {
      return false
    }
    // if its not child of the body then its a 'weird' thing
    if (!isNodeChildOfBody(node)) {
      //   return false
    }

    // ember test selectors pass
    for (let i in node.dataset) {
      if (i.match(/^test*/)) {
        return true
      }
    }

    // accept all element with non dynamic ids
    if (node.id && !Regexes.hasEmberIdRegex.test(node.id)) {
      return true
    }

    if (localSettings.get().recordAll) {
      return true
    }
  },

  filterDoNotRecordAndWhiteSpace(node) {
    let classListArray = node.classList && Array.prototype.slice.call(node.classList)
    // let isEmberView = classListArray ? (classListArray.indexOf('ember-view') === -1) : false;
    let hasDoNotRecordClass = classListArray ? classListArray.indexOf("doNotRecord") !== -1 : false
    return node.nodeType !== 3 && !hasDoNotRecordClass
  }
}

export function isElementClassOrChildOfClass(element: HTMLElement, className): boolean {
  let classListArray = element.classList && Array.prototype.slice.call(element.classList)
  if (classListArray && classListArray.indexOf(className) !== -1) {
    return true
  }
  if (element.parentElement) {
    return isElementClassOrChildOfClass(element.parentElement, className)
  }
  return false
}

function isNodeChildOfBody(element: HTMLElement): boolean {
  if (element.parentElement && element.parentElement.tagName === "BODY") {
    return true
  }
  if (element.parentElement) {
    return isNodeChildOfBody(element.parentElement)
  }
  return false
}

export function getPath(element: HTMLElement): HTMLElement[] {
  const path: HTMLElement[] = []
  let currentElement = element
  while (currentElement) {
    path.push(currentElement)
    currentElement = currentElement.parentElement
  }
  return path
}
