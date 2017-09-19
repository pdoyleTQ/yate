"use strict";
/**
 * When typing a query, this query is sometimes syntactically invalid, causing
 * the current tokens to be incorrect This causes problem for autocompletion.
 * http://bla might result in two tokens: http:// and bla. We'll want to combine
 * these
 * 
 * @param yate {doc}
 * @param token {object}
 * @param cursor {object}
 * @return token {object}
 * @method YATE.getCompleteToken
 */
var getCompleteToken = function(yate, token, cur) {
  if (!cur) {
    cur = yate.getCursor();
  }
  if (!token) {
    token = yate.getTokenAt(cur);
  }
  var prevToken = yate.getTokenAt({
    line: cur.line,
    ch: token.start
  });
  // not start of line, and not whitespace
  if (prevToken.type != null && prevToken.type != "ws" && token.type != null && token.type != "ws") {
    token.start = prevToken.start;
    token.string = prevToken.string + token.string;
    return getCompleteToken(yate, token, {
      line: cur.line,
      ch: prevToken.start
    }); // recursively, might have multiple tokens which it should include
  } else if (token.type != null && token.type == "ws") {
    //always keep 1 char of whitespace between tokens. Otherwise, autocompletions might end up next to the previous node, without whitespace between them
    token.start = token.start + 1;
    token.string = token.string.substring(1);
    return token;
  } else {
    return token;
  }
};
var getPreviousNonWsToken = function(yate, line, token) {
  var previousToken = yate.getTokenAt({
    line: line,
    ch: token.start
  });
  if (previousToken != null && previousToken.type == "ws") {
    previousToken = getPreviousNonWsToken(yate, line, previousToken);
  }
  return previousToken;
};
var getNextNonWsToken = function(yate, lineNumber, charNumber) {
  if (charNumber == undefined) charNumber = 1;
  var token = yate.getTokenAt({
    line: lineNumber,
    ch: charNumber
  });
  if (token == null || token == undefined || token.end < charNumber) {
    return null;
  }
  if (token.type == "ws") {
    return getNextNonWsToken(yate, lineNumber, token.end + 1);
  }
  return token;
};

module.exports = {
  getPreviousNonWsToken: getPreviousNonWsToken,
  getCompleteToken: getCompleteToken,
  getNextNonWsToken: getNextNonWsToken
};
