"use strict";
var $ = require("jquery");
module.exports = function(yate, name) {
  return {
    isValidCompletionPosition: function() {
      return module.exports.isValidCompletionPosition(yate);
    },
    get: function(token, callback) {
      return require("./utils").fetchFromLov(yate, this, token, callback);
    },
    preProcessToken: function(token) {
      return module.exports.preProcessToken(yate, token);
    },
    postProcessToken: function(token, suggestedString) {
      return module.exports.postProcessToken(yate, token, suggestedString);
    },
    async: true,
    bulk: false,
    autoShow: false,
    persistent: name,
    callbacks: {
      validPosition: yate.autocompleters.notifications.show,
      invalidPosition: yate.autocompleters.notifications.hide
    }
  };
};

module.exports.isValidCompletionPosition = function(yate) {
  var token = yate.getCompleteToken();
  if (token.string.length == 0) return false; //we want -something- to autocomplete
  if (token.string.indexOf("?") == 0) return false; // we are typing a var
  if ($.inArray("a", token.state.possibleCurrent) >= 0) return true; // predicate pos
  var cur = yate.getCursor();
  var previousToken = yate.getPreviousNonWsToken(cur.line, token);
  if (previousToken.string == "rdfs:subPropertyOf") return true;

  // hmm, we would like -better- checks here, e.g. checking whether we are
  // in a subject, and whether next item is a rdfs:subpropertyof.
  // difficult though... the grammar we use is unreliable when the query
  // is invalid (i.e. during typing), and often the predicate is not typed
  // yet, when we are busy writing the subject...
  return false;
};
module.exports.preProcessToken = function(yate, token) {
  return require("./utils.js").preprocessResourceTokenForCompletion(yate, token);
};
module.exports.postProcessToken = function(yate, token, suggestedString) {
  return require("./utils.js").postprocessResourceTokenForCompletion(yate, token, suggestedString);
};
