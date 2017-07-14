chrome.browserAction.onClicked.addListener(function (activeTab) {
  chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { greeting: "hello" }, function (response) {
      console.log(response.farewell);
    });
  });
});


