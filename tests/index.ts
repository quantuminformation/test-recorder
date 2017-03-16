import {TestRecorder} from '../src/TestRecorder';

NodeList.prototype[Symbol.iterator] = Array.prototype[Symbol.iterator]; //for chrome

let testRecorder = new TestRecorder()


