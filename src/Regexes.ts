/**
 * this is the default configuration
 * If you want to override this, pass it in as an argument to the TestRecorder constructor
 */


export let Regexes = {
  // the check here is we don't want to record
  // things with an ember id, (where a user has not given one but ember needs to add an id)
  hasEmberIdRegex: /ember[\d]+/
}
