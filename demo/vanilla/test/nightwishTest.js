module.exports = {
    'Demo test Google' : function (browser) {
        browser
            .url('http://localhost/training/one_page_app')
            .waitForElementVisible('body', 1000)
            .pause(1000)
            .assert.containsText('#main', 'Night Watch')
            .end();
    }
};