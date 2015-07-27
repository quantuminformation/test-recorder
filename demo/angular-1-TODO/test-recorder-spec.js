var util = require('util');

describe('ElementFinder', function() {
  beforeEach(function() {
    // Clear everything between each test.
    browser.driver.get('about:blank');
  });

  it('should return the same result as browser.findElement', function() {
    browser.get('index.html');

   // var e = element(by.id('new_todo'));
    var e = $('#new-todo');
    e.sendKeys("foo");

    expect(e.getAttribute('value')).toEqual(
      "foo")
  });

})
