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
  if (token.string.indexOf("?") == 0) return false;
  var cur = yate.getCursor();
  var previousToken = yate.getPreviousNonWsToken(cur.line, token);
  if (previousToken.string == "a") return true;
  if (previousToken.string == "rdf:type") return true;
  if (previousToken.string == "rdfs:domain") return true;
  if (previousToken.string == "rdfs:range") return true;
  return false;
};
module.exports.preProcessToken = function(yate, token) {
  return require("./utils.js").preprocessResourceTokenForCompletion(yate, token);
};
module.exports.postProcessToken = function(yate, token, suggestedString) {
  return require("./utils.js").postprocessResourceTokenForCompletion(yate, token, suggestedString);
};
