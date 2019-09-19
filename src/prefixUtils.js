"use strict";
/**
 * Append prefix declaration to list of prefixes in document window.
 *
 * @param yate
 * @param prefix
 */
var addPrefixes = function(yate, prefixes) {
  var existingPrefixes = yate.getPrefixesFromDocument();
  //for backwards compatability, we stil support prefixes value as string (e.g. 'rdf: <http://fbfgfgf>'
  if (typeof prefixes == "string") {
    addPrefixAsString(yate, prefixes);
  } else {
    for (var pref in prefixes) {
      if (!(pref in existingPrefixes))
        addPrefixAsString(yate, pref + ": <" + prefixes[pref] + ">");
    }
  }
  yate.collapsePrefixes(false);
};

// commented for merging version 2019/09/16 of TriplyDB/YASGUI.YASQE
// var addPrefixAsString = function(yate, prefixString) {
//   var lastPrefix = null;
//   var lastPrefixLine = 0;
//   var numLines = yate.lineCount();
//   for (var i = 0; i < numLines; i++) {
//     var firstToken = yate.getNextNonWsToken(i);
//     if (firstToken != null && (firstToken.string == "PREFIX" || firstToken.string.toUpperCase() == "@PREFIX" || firstToken.string.toUpperCase() == "@BASE" || firstToken.string == "BASE")) {
//       lastPrefix = firstToken;
//       lastPrefixLine = i;
//     }
//   }

//   if (lastPrefix == null) {
//     yate.replaceRange("@prefix " + prefixString + " .\n", {
//       line: 0,
//       ch: 0
//     });
//   } else {
//     var previousIndent = getIndentFromLine(yate, lastPrefixLine);
//     yate.replaceRange("\n" + previousIndent + "@prefix " + prefixString + " .", {
//       line: lastPrefixLine
//     });
//   }
//   yate.collapsePrefixes(false);

var addPrefixAsString = function(yate, prefixString) {
  yate.replaceRange("@prefix " + prefixString + " .\n", {
    line: 0,
    ch: 0
  });

  yate.collapsePrefixes(false);
};
var removePrefixes = function(yate, prefixes) {
  var escapeRegex = function(string) {
    //taken from http://stackoverflow.com/questions/3561493/is-there-a-regexp-escape-function-in-javascript/3561711#3561711
    return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
  };
  for (var pref in prefixes) {
    yate.setValue(
      yate
        .getValue()
        .replace(
          new RegExp(
            "PREFIX\\s*" +
              pref +
              ":\\s*" +
              escapeRegex("<" + prefixes[pref] + ">") +
              "\\s*",
            "ig"
          ),
          ""
        )
    );
  }
  yate.collapsePrefixes(false);
};

/**
 * Get defined prefixes from document as array, in format {"prefix:" "uri"}
 *
 * @param cm
 * @returns {Array}
 */
var getPrefixesFromDocument = function(yate) {
  //Use precise here. We want to be sure we use the most up to date state. If we're
  //not, we might get outdated prefixes from the current document (creating loops such
  //as https://github.com/OpenTriply/YASGUI/issues/84)
  return yate.getTokenAt(
    { line: yate.lastLine(), ch: yate.getLine(yate.lastLine()).length },
    true
  ).state.prefixes;
};

/**
 * Get the used indentation for a certain line
 *
 * @param yate
 * @param line
 * @param charNumber
 * @returns
 */
var getIndentFromLine = function(yate, line, charNumber) {
  if (charNumber == undefined) charNumber = 1;
  var token = yate.getTokenAt({
    line: line,
    ch: charNumber
  });
  if (token == null || token == undefined || token.type != "ws") {
    return "";
  } else {
    return token.string + getIndentFromLine(yate, line, token.end + 1);
  }
};

module.exports = {
  addPrefixes: addPrefixes,
  getPrefixesFromDocument: getPrefixesFromDocument,
  removePrefixes: removePrefixes
};
