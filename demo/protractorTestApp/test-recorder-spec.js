var util = require('util');

describe('ElementFinder', function() {
  beforeEach(function() {
    // Clear everything between each test.
    browser.driver.get('about:blank');
  });

  it('should return the same result as browser.findElement', function() {
    browser.get('index.html#/form');
    var nameByElement = element(by.binding('username'));

    expect(nameByElement.getText()).toEqual(
      browser.findElement(by.binding('username')).getText());
  });

  it('should wait to grab the WebElement until a method is called', function() {
    // These should throw no error before a page is loaded.
    var usernameInput = element(by.model('username'));
    var name = element(by.binding('username'));

    browser.get('index.html#/form');

    expect(name.getText()).toEqual('Anon');

    usernameInput.clear();
    usernameInput.sendKeys('Jane');
    expect(name.getText()).toEqual('Jane');
  });

  it('should chain element actions', function() {
    browser.get('index.html#/form');

    var usernameInput = element(by.model('username'));
    var name = element(by.binding('username'));

    expect(name.getText()).toEqual('Anon');

    usernameInput.clear().sendKeys('Jane');
    expect(name.getText()).toEqual('Jane');
  });

  it('chained call should wait to grab the WebElement until a method is called',
    function() {
      // These should throw no error before a page is loaded.
      var reused = element(by.id('baz')).
        element(by.binding('item.reusedBinding'));

      browser.get('index.html#/conflict');

      expect(reused.getText()).toEqual('Inner: inner');
      expect(reused.isPresent()).toBe(true);
    });

  it('should differentiate elements with the same binding by chaining',
    function() {
      browser.get('index.html#/conflict');

      var outerReused = element(by.binding('item.reusedBinding'));
      var innerReused =
        element(by.id('baz')).element(by.binding('item.reusedBinding'));

      expect(outerReused.getText()).toEqual('Outer: outer');
      expect(innerReused.getText()).toEqual('Inner: inner');
    });

  it('should chain deeper than 2', function() {
    // These should throw no error before a page is loaded.
    var reused = element(by.css('body')).element(by.id('baz')).
      element(by.binding('item.reusedBinding'));

    browser.get('index.html#/conflict');

    expect(reused.getText()).toEqual('Inner: inner');
  });

  it('should determine element presence properly with chaining', function() {
    browser.get('index.html#/conflict');
    expect(element(by.id('baz')).
      isElementPresent(by.binding('item.reusedBinding'))).
      toBe(true);

    expect(element(by.id('baz')).
      isElementPresent(by.binding('nopenopenope'))).
      toBe(false);
  });

  it('should export an isPresent helper', function() {
    browser.get('index.html#/form');

    expect(element(by.binding('greet')).isPresent()).toBe(true);
    expect(element(by.binding('nopenopenope')).isPresent()).toBe(false);
  });

  it('should allow handling errors', function() {
    browser.get('index.html#/form');
    var elmFinder = $('.nopenopenope').getText().then(function(success) {
      // This should throw an error. Fail.
      expect(true).toEqual(false);
    }, function(err) {
      expect(true).toEqual(true);
    });
  });

  it('should allow handling chained errors', function() {
    browser.get('index.html#/form');
    var elmFinder = $('.nopenopenope').$('furthernope').getText().then(
      function(success) {
        // This should throw an error. Fail.
        expect(true).toEqual(false);
      }, function(err) {
        expect(true).toEqual(true);
      });
  });

  it('isPresent() should not raise error on chained finders', function() {
    browser.get('index.html#/form');
    var elmFinder = $('.nopenopenope').element(by.binding('greet'));

    expect(elmFinder.isPresent()).toBe(false);
  });

  it('should export an allowAnimations helper', function() {
    browser.get('index.html#/animation');
    var animationTop = element(by.id('animationTop'));
    var toggledNode = element(by.id('toggledNode'));

    expect(animationTop.allowAnimations()).toBe(true);
    animationTop.allowAnimations(false);
    expect(animationTop.allowAnimations()).toBe(false);

    expect(toggledNode.isPresent()).toBe(true);
    element(by.id('checkbox')).click();
    expect(toggledNode.isPresent()).toBe(false);
  });

  it('should keep a reference to the original locator', function() {
    browser.get('index.html#/form');

    var byCss = by.css('body');
    var byBinding = by.binding('greet');

    expect(element(byCss).locator()).toEqual(byCss);
    expect(element(byBinding).locator()).toEqual(byBinding);
  });

  it('should propagate exceptions', function() {
    browser.get('index.html#/form');
    var successful = protractor.promise.defer();

    var invalidElement = element(by.binding('INVALID'));
    invalidElement.getText().then(function(value) {
      successful.fulfill(true);
    }, function(err) {
      successful.fulfill(false);
    });
    expect(successful).toEqual(false);
  });

  it('should be returned from a helper without infinite loops', function() {
    browser.get('index.html#/form');
    var helperPromise = protractor.promise.when(true).then(function() {
      return element(by.binding('greeting'));
    });

    helperPromise.then(function(finalResult) {
      expect(finalResult.getText()).toEqual('Hiya');
    });
  });

  it('should be usable in WebDriver functions via getWebElement', function() {
    // TODO(juliemr): should be able to do this without the getWebElement call
    browser.get('index.html#/form');
    var greeting = element(by.binding('greeting'));
    browser.executeScript(
      'arguments[0].scrollIntoView', greeting.getWebElement());
  });

  it('should allow null as success handler', function() {
    browser.get('index.html#/form');

    var usernameInput = element(by.model('username'));
    var name = element(by.binding('username'));

    expect(name.getText()).toEqual('Anon');
    expect(
      name.getText().then(null, function() {})
    ).toEqual('Anon');

  });
})
