const rootUrl = 'http://127.0.0.1:8099'
this.checkGeneratedPathForClickOnNoIdElement = function (browser) {
  browser.url(`${rootUrl}`)
    .click('table#interactions>tbody>tr:nth-child(2)>td:nth-child(1)>button:nth-child(1)')
    .end()

}
this.createAndDestroyDivButtons = function (browser) {
  browser.url(`${rootUrl}`)
    .click('button.makeDiv.test2:nth-child(1)')
    .waitForElementPresent('#new-element', 1000)
    .waitForElementNotPresent('#new-element2', 1000)
    .click('#removeDiv')
    .waitForElementNotPresent('#new-element', 1000)
    .end()

}
this.clickOnDataAttrRendersDivWithDataAttr = function (browser) {
  browser.url(`${rootUrl}`)
    .click('[data-test-foo2="baa"]')
    .waitForElementPresent('[data-test-created-div="foo"]', 1000)
    .end()
}
