import formattingRules from 'ember-cli-test-recorder/util/formattingRules';

export default {

  mutationObserversArr: [],
  pendingGeneratedDomChangedScript: "",//this is observed by TestRecorderUtils

  /**
   * Adds observer for target and generates source code
   * @param target
   */
  addObserverForTarget: function (target) {

    var self = this;
    var observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {

        var addedNodesTestText = "";
        var removedNodesTestText = "";

        //convert these to Arrays
        var addedNodesArray = Array.prototype.slice.call(mutation.addedNodes);
        var removedNodesArray = Array.prototype.slice.call(mutation.removedNodes);

        // This array is used to add new mutation Observers from the newly added DOM
        var newMutationsFromAddedNodesArray = addedNodesArray.filter(filterDoNotRecordAndWhiteSpace);

        //loop through the above and add observers, we need to do this dynamically
        newMutationsFromAddedNodesArray.forEach(function (node) {
          self.addObserverForTarget(node); //just drill down 2 levels more
        });

        //this array is used to generate the source code, we filter
        addedNodesArray = addedNodesArray.filter(filter_DoNotRecord_WhiteSpace_emberID_noID);
        removedNodesArray = removedNodesArray.filter(filter_DoNotRecord_WhiteSpace_emberID_noID);

        if (!addedNodesArray.length && !removedNodesArray.length) {
          //no point continuing in this iteration if nothing of interest
          return;
        }

        //mutations should be mutually exclusive?
        if (addedNodesArray.length && removedNodesArray.length) {
          alert("strange");
          return;
        }

        addedNodesArray.forEach(function (node) {
          addedNodesTestText += formattingRules.indentation + 'assert.equal(find("#' + node.id + '").length, 1, "' + node.id + ' shown AFTER user [INSERT REASON]");' + '<br/>';
        });

        removedNodesArray.forEach(function (node) {
          removedNodesTestText += formattingRules.indentation + 'assert.equal(find("#' + node.id + '").length, 0, "' + node.id + ' removed AFTER user [INSERT REASON]");' + '<br/>';
        });

        //todo find a better way for this result to be inserted in the generatedCode
        self.pendingGeneratedDomChangedScript = self.pendingGeneratedDomChangedScript + (addedNodesTestText || removedNodesTestText);
        // self.set("generatedScript", newText);
        console.log(mutation);
      });
    });
    var config = {attributes: true, childList: true, characterData: true};

    //this is the only place where observe is called so we can track them here too to disconnect
    observer.observe(target, config);
    this.mutationObserversArr.push(observer);
    this.addInnerObserversForTarget(target, 0);
  },


  /**
   * Create observers for the children
   * Can be used recursively to desired depth, atm this is set to max of 4
   * @param target
   */
  addInnerObserversForTarget: function (target, currentLevel) {
    for (var i = 0; target.children && i < target.children.length; i++) {
      var child = target.children[i];
      var classListArray = child.classList && Array.prototype.slice.call(child.classList);
      var hasDoNotRecordClass = classListArray ? (classListArray.indexOf("doNotRecord") !== -1) : false;

      if (!hasDoNotRecordClass) {//abort any recording of this dom tree
        this.addObserverForTarget(child);
        if (currentLevel <= 6) {//todo compare with root ember element
          var nextLevel = currentLevel + 1;
          this.addInnerObserversForTarget(child, nextLevel);
        }
      }
    }
  }
};


function filter_DoNotRecord_WhiteSpace_emberID_noID(node) {
  var classListArray = node.classList && Array.prototype.slice.call(node.classList);
  //var isEmberView = classListArray ? (classListArray.indexOf("ember-view") === -1) : false;
  var hasDoNotRecordClass = classListArray ? (classListArray.indexOf("doNotRecord") !== -1) : false;

  //the check here is we don't want to record
  // 1 whitespace
  // 2 things with no id
  // 3 things that have a hasDoNotRecordClass
  // 4 things with an ember id, (where a user has not given one but ember needs to add an id)
  var hasEmberIdRegex = /ember[\d]+/;

  return node.nodeType !== 3 && node.id && !hasDoNotRecordClass && !hasEmberIdRegex.test(node.id);
}

function filterDoNotRecordAndWhiteSpace(node) {
  var classListArray = node.classList && Array.prototype.slice.call(node.classList);
  //var isEmberView = classListArray ? (classListArray.indexOf("ember-view") === -1) : false;
  var hasDoNotRecordClass = classListArray ? (classListArray.indexOf("doNotRecord") !== -1) : false;
  return node.nodeType !== 3 && !hasDoNotRecordClass;
}


