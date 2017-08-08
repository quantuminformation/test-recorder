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

    // the check here is we don't want to record

    // 4 things with an ember id, (where a user has not given one but ember needs to add an id)
    let hasEmberIdRegex = /ember[\d]+/

    return node.nodeType !== 3 && // 1 whitespace
      (node.id || testHelper) && // does it have and or a data-test attribute
      !hasDoNotRecordClass &&    // 3 things that have a hasDoNotRecordClass
      !hasEmberIdRegex.test(node.id)
  },

  filterDoNotRecordAndWhiteSpace (node) {
    let classListArray = node.classList && Array.prototype.slice.call(node.classList)
    // let isEmberView = classListArray ? (classListArray.indexOf("ember-view") === -1) : false;
    let hasDoNotRecordClass = classListArray ? (classListArray.indexOf('doNotRecord') !== -1) : false
    return node.nodeType !== 3 && !hasDoNotRecordClass
  }
}
