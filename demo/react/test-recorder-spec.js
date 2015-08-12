var util = require('util');

describe('ElementFinder', function() {
  beforeEach(function() {
    browser.get('index.html');
  });

  it('should return the same result as browser.findElement', function() {
    $('#new-todo').sendKeys('wer');
    browser.pause();

    //  expect(e.getAttribute('value')).toEqual("foo")
  });

})
