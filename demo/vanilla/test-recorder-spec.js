var util = require('util');

describe('ElementFinder', function() {
  beforeEach(function() {
    browser.get('index.html');
  });

  it('should return the same result as browser.findElement', function() {


    $('#newItem').sendKeys('sdg');
    element('#addBtn').click().then(function(){

    });

    $('#newItem').sendKeys('sdgdrge');
    element('#addBtn').click().then(function(){

    });

  });

})
