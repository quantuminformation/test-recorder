[![Build Status](https://travis-ci.org/QuantumInformation/test-recorder.svg?branch=master)](https://travis-ci.org/QuantumInformation/test-recorder)

# Sponsors
If you would like to be an official supporter of this project, please contact me, and I will place your logo here!
# Donations
If this project is useful to you and you would like to support it, you are most welcome to buy me a coffee! https://ko-fi.com/A325GAE

# test-recorder
The test-recorder records acceptance tests for the Ember-cli and Nightwatch testing frameworks.
I am currently doing a WIP for Chromeless, but it is available in the Chrome extension

This project records the ways you interact with your application and then generates the code to playback these actions inside an acceptance test runner. 
The idea is to save you time writing these tests by hand.
 
You should only add the TestRecorder.js script to your app when your app behaves as
expected (happy flow) as then you will have the tests generated for this. You can then take these tests and modify them to your specific needs.

# Chrome extension
The Test Recorder has now been made into a [Chrome extension](https://chrome.google.com/webstore/detail/test-recorder/mehbmedddkpilcbbjcichiopegameghh) which makes it real easy for anyone to start recording tests in the browser. I include how it works in this video: as I bonus I also include my pastime of Skiing in London.

<a href="http://www.youtube.com/watch?feature=player_embedded&v=HhJFD3jr0oo
" target="_blank"><img src="http://img.youtube.com/vi/HhJFD3jr0oo/0.jpg" 
alt="IMAGE ALT TEXT HERE" width="240" height="180" border="10" /></a>

# Browser compatibility

As this is a pure dev tool, I only support recording your Applications on Chrome due to it having the features I need. I will support other browsers if I get enough support.


# Installation
`npm i --save-dev test-recorder`

# Videos

To help you understand how it works I made a [video playlist](https://www.youtube.com/playlist?list=PLCrwuqjmVebKF6cpH-hcLpSXYhSNiO7g7)!

First video of the series

<a href="http://www.youtube.com/watch?feature=player_embedded&v=l4eCTUcPBp8
" target="_blank"><img src="http://img.youtube.com/vi/l4eCTUcPBp8/0.jpg" 
alt="IMAGE ALT TEXT HERE" width="240" height="180" border="10" /></a>

# Current UI interactions  recorded for acceptance tests:

* Button clicks
* Text input 
* Changes in DOM additions/removals (only if they have an id)

# Settings
If you click on the settings (cog wheel) button a popup opens with various options:
* Record all elements— this records mutations on all elements, default unchecked: only records elements with id's
* Persist code — Saves the generated code to the output screen. This is useful for single page apps that refresh the page.
* Keep recorder open - if the page is refreshed with the recorder open, it will open again.

# Notes

If an element doesn't have an id then an exlusive dom path selector will be generated to click on this button in a test, ie
```js
click("body>div>div:eq(0)>button");
andThen(function () {
 equal(find("#foo").length, 0, "foo removed AFTER user [INSERT REASON]");
});
```

If you don't want to record an element, and any of its children add this class to it `doNotRecord`


# Generating tests in the text example app


I have an example app inside /tests that can be used to create tests for the various test frameworks.
 
* First you need to build the test project by running `npm i` and `webpack` inside `/tests`. 
* then you can open `tests/build/` in the browser to see the app running with the test recorder UI. 
* You can select what framework you are using and you can copy the code that is generated.
* Once you have the tests generated you can paste the code into the actual test file inside the relevant test framework, e.g `tests/nightwatch/tests/index.test.js

Note all the tests frameworks have a test example file for you to get started.


# Importing the test-recorder with no build system

Import the script and init the TestRecorder. Thats it! 
`

```<script src="node_modules/test-recorder/test-recorder.js"></script>

<script type="text/javascript">
  var testRecorder = new TestRecorder.TestRecorder()
</script>
```

# Importing the test-recorder with a build system like webpack or gulp

Import the script and init the TestRecorder. That's it! 

```js
import { TestRecorder } from 'test-recorder'

let testRecorder = new TestRecorder()
```


# Importing the test-recorder into an Ember-cli project

Import the script and init the TestRecorder. Thats it! 

* copy the test-recorder script to vendor. You can add an npm script for this `"copy": "cp node_modules/test-recorder/build/test-recorder.js vendor"`
* import the test recorder to ember-cli-build.js:
`  app.import('vendor/test-recorder.js');`
* In your app run: `let testRecorder = new TestRecorder.TestRecorder()`

## Running nightwatch tests

* Run `node tests/server.js`
* run nightwatch inside of `test/nightwatch`

This uses `tests/nightwatch/nightwatch.json` as settings to to run test files in the  `tests/nightwatch/tests` folder.

# Running Ember-cli tests

Just paste in the output into the relevant place in your tests and run as normal. 

I maintain a fork [here](https://github.com/QuantumInformation/travis-web) of using the test-recorder with the travis-web app. 

## Roadmap
* Record any changes to location (routes, html5, etc)
* Allow select2 inputs to be automated
* Create codes for key-presses 
* Get mutations to work with async effects to be configured with separate wait times
* create tests for changes of lengths in lists
* Create cucumber generator
* Create protractor generator


## UP for discussion
* Ignore clicks on ember elements with no effect
## TIPS

Avoid making multiple button clicks (or other interactions that cause asynchronous) updates until DOM has 
finished updating. This will allow code generated by the mutations observer to be placed in the in the
generated code. 

# Limitations
It records as much of the grunt work that I can think of, but state will of course need to be managed by the end user, ie initial page navigations and login, app state needed to get the tests to work.
