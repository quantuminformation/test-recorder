var util = require('util');

describe('ElementFinder', function() {
  beforeEach(function() {
    // Clear everything between each test.
    browser.driver.get('about:blank');
  });

  it('should return the same result as browser.findElement', function() {
    browser.get('index.html');

    browser.pause();
    var nameByElement = element(by.id('new_todo'));

    expect(nameByElement.getText()).toEqual(
      "foo")
  });

})
