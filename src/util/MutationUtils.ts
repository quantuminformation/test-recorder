export default {

  filter_DoNotRecord_WhiteSpace_emberID_noID (node) {
    let classListArray = node.classList && Array.prototype.slice.call(node.classList)
    //let isEmberView = classListArray ? (classListArray.indexOf("ember-view") === -1) : false;
    let hasDoNotRecordClass = classListArray ? (classListArray.indexOf('doNotRecord') !== -1) : false

    //the check here is we don't want to record
    // 1 whitespace
    // 2 things with no id
    // 3 things that have a hasDoNotRecordClass
    // 4 things with an ember id, (where a user has not given one but ember needs to add an id)
    let hasEmberIdRegex = /ember[\d]+/

    return node.nodeType !== 3 && node.id && !hasDoNotRecordClass && !hasEmberIdRegex.test(node.id)
  },

  filterDoNotRecordAndWhiteSpace (node) {
    let classListArray = node.classList && Array.prototype.slice.call(node.classList)
    //let isEmberView = classListArray ? (classListArray.indexOf("ember-view") === -1) : false;
    let hasDoNotRecordClass = classListArray ? (classListArray.indexOf('doNotRecord') !== -1) : false
    return node.nodeType !== 3 && !hasDoNotRecordClass
  }

}
