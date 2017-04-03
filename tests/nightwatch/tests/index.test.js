this.demoTestGoogle = function (browser) {
  browser
    .url('http://www.google.com')

    .click('body>table>tbody>tr>td:nth-child(1)>button:nth-child(1)')
    .pause(500)
  assert.visible('new-element')
    .click('#makeDiv')
    .pause(500)

    .end();
};
