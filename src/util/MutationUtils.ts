import { Settings } from '../Settings'
import { Regexes } from '../Regexes'

export default {
  isElementRecorded (node: HTMLElement) {
    let classListArray = node.classList && Array.prototype.slice.call(node.classList)
    // let isEmberView = classListArray ? (classListArray.indexOf("ember-view") === -1) : false;
    let hasDoNotRecordClass = classListArray ? (classListArray.indexOf('doNotRecord') !== -1) : false
    let testHelper: string
    for (let i in node.dataset) {
      if (i.match(/^data-test*/)) {
        testHelper = i
        break
      }
    }

    let hasIdOrUserAllowsNonIdRecording = node.id || Settings.get().recordAll
    console.log(Settings.get())

    return node.parentElement && // if it doesn't have a parent then its a "weird" thing
      node.nodeType !== 3 && // 1 whitespace
      (hasIdOrUserAllowsNonIdRecording || testHelper) && // does it have and or a data-test attribute
      !hasDoNotRecordClass &&    // 3 things that have a hasDoNotRecordClass
      !Regexes.hasEmberIdRegex.test(node.id)
  },

  filterDoNotRecordAndWhiteSpace (node) {
    let classListArray = node.classList && Array.prototype.slice.call(node.classList)
    // let isEmberView = classListArray ? (classListArray.indexOf("ember-view") === -1) : false;
    let hasDoNotRecordClass = classListArray ? (classListArray.indexOf('doNotRecord') !== -1) : false
    return node.nodeType !== 3 && !hasDoNotRecordClass
  }
}
