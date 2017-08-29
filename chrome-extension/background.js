chrome.browserAction.onClicked.addListener(function (activeTab) {
  chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { greeting: "hello" }, function (response) {
      console.log(response.farewell);
    });
  });
});

chrome.runtime.onInstalled.addListener(
  function() {
    chrome.tabs.query({}, function (tabs) {
      tabs.forEach(function(tab) {
        chrome.tabs.executeScript(tab.id, { file: './test-recorder.js' }, function() {
          let error = chrome.runtime.lastError;
          if (error) console.log(error);
        });
      });
    });
  }
)
