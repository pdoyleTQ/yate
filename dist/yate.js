(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.YATE = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
/*
  jQuery deparam is an extraction of the deparam method from Ben Alman's jQuery BBQ
  http://benalman.com/projects/jquery-bbq-plugin/
*/
var $ = (function(){try{return require('jquery')}catch(e){return window.jQuery}})();
$.deparam = function(params, coerce) {
  var obj = {}, coerce_types = { true: !0, false: !1, null: null };

  // Iterate over all name=value pairs.
  $.each(params.replace(/\+/g, " ").split("&"), function(j, v) {
    var param = v.split("="),
      key = decodeURIComponent(param[0]),
      val,
      cur = obj,
      i = 0,
      // If key is more complex than 'foo', like 'a[]' or 'a[b][c]', split it
      // into its component parts.
      keys = key.split("]["),
      keys_last = keys.length - 1;

    // If the first keys part contains [ and the last ends with ], then []
    // are correctly balanced.
    if (/\[/.test(keys[0]) && /\]$/.test(keys[keys_last])) {
      // Remove the trailing ] from the last keys part.
      keys[keys_last] = keys[keys_last].replace(/\]$/, "");

      // Split first keys part into two parts on the [ and add them back onto
      // the beginning of the keys array.
      keys = keys.shift().split("[").concat(keys);

      keys_last = keys.length - 1;
    } else {
      // Basic 'foo' style key.
      keys_last = 0;
    }

    // Are we dealing with a name=value pair, or just a name?
    if (param.length === 2) {
      val = decodeURIComponent(param[1]);

      // Coerce values.
      if (coerce) {
        val = val && !isNaN(val)
          ? +val // number
          : val === "undefined"
              ? undefined // undefined
              : coerce_types[val] !== undefined
                  ? coerce_types[val] // true, false, null
                  : val; // string
      }

      if (keys_last) {
        // Complex key, build deep object structure based on a few rules:
        // * The 'cur' pointer starts at the object top-level.
        // * [] = array push (n is set to array length), [n] = array if n is
        //   numeric, otherwise object.
        // * If at the last keys part, set the value.
        // * For each keys part, if the current level is undefined create an
        //   object or array based on the type of the next keys part.
        // * Move the 'cur' pointer to the next level.
        // * Rinse & repeat.
        for (; i <= keys_last; i++) {
          key = keys[i] === "" ? cur.length : keys[i];
          cur = cur[key] = i < keys_last ? cur[key] || (keys[i + 1] && isNaN(keys[i + 1]) ? {} : []) : val;
        }
      } else {
        // Simple key, even simpler rules, since only scalars and shallow
        // arrays are allowed.

        if ($.isArray(obj[key])) {
          // val is already an array, so push on the next value.
          obj[key].push(val);
        } else if (obj[key] !== undefined) {
          // val isn't an array, but since a second value has been specified,
          // convert val into an array.
          obj[key] = [obj[key], val];
        } else {
          // val is a scalar.
          obj[key] = val;
        }
      }
    } else if (key) {
      // No value was defined, so set something meaningful.
      obj[key] = coerce ? undefined : "";
    }
  });

  return obj;
};

},{"jquery":undefined}],2:[function(require,module,exports){
module.exports = {table:
{
  "*[,,object]" : {
     ",": ["[,,object]","*[,,object]"], 
     ";": [], 
     "]": [], 
     ".": []}, 
  "*[;,?[verb,objectList]]" : {
     ";": ["[;,?[verb,objectList]]","*[;,?[verb,objectList]]"], 
     "]": [], 
     ".": []}, 
  "*object" : {
     "IRI_REF": ["object","*object"], 
     "BLANK_NODE_LABEL": ["object","*object"], 
     "ANON": ["object","*object"], 
     "(": ["object","*object"], 
     "[": ["object","*object"], 
     "PNAME_LN": ["object","*object"], 
     "PNAME_NS": ["object","*object"], 
     "INTEGER": ["object","*object"], 
     "DECIMAL": ["object","*object"], 
     "DOUBLE": ["object","*object"], 
     "true": ["object","*object"], 
     "false": ["object","*object"], 
     "STRING_LITERAL_QUOTE": ["object","*object"], 
     "STRING_LITERAL_SINGLE_QUOTE": ["object","*object"], 
     "STRING_LITERAL_LONG_SINGLE_QUOTE": ["object","*object"], 
     "STRING_LITERAL_LONG_QUOTE": ["object","*object"], 
     ")": []}, 
  "*statement" : {
     "@prefix": ["statement","*statement"], 
     "@base": ["statement","*statement"], 
     "PREFIX": ["statement","*statement"], 
     "BASE": ["statement","*statement"], 
     "[": ["statement","*statement"], 
     "IRI_REF": ["statement","*statement"], 
     "BLANK_NODE_LABEL": ["statement","*statement"], 
     "ANON": ["statement","*statement"], 
     "(": ["statement","*statement"], 
     "PNAME_LN": ["statement","*statement"], 
     "PNAME_NS": ["statement","*statement"], 
     "$": []}, 
  "?[verb,objectList]" : {
     "a": ["[verb,objectList]"], 
     "IRI_REF": ["[verb,objectList]"], 
     "PNAME_LN": ["[verb,objectList]"], 
     "PNAME_NS": ["[verb,objectList]"], 
     ";": [], 
     "]": [], 
     ".": []}, 
  "?or([LANGTAG,[^^,iri]])" : {
     "LANGTAG": ["or([LANGTAG,[^^,iri]])"], 
     "^^": ["or([LANGTAG,[^^,iri]])"], 
     ";": [], 
     ",": [], 
     "IRI_REF": [], 
     "BLANK_NODE_LABEL": [], 
     "ANON": [], 
     "(": [], 
     "[": [], 
     "PNAME_LN": [], 
     "PNAME_NS": [], 
     "INTEGER": [], 
     "DECIMAL": [], 
     "DOUBLE": [], 
     "true": [], 
     "false": [], 
     "STRING_LITERAL_QUOTE": [], 
     "STRING_LITERAL_SINGLE_QUOTE": [], 
     "STRING_LITERAL_LONG_SINGLE_QUOTE": [], 
     "STRING_LITERAL_LONG_QUOTE": [], 
     "]": [], 
     ")": [], 
     ".": []}, 
  "?predicateObjectList" : {
     "a": ["predicateObjectList"], 
     "IRI_REF": ["predicateObjectList"], 
     "PNAME_LN": ["predicateObjectList"], 
     "PNAME_NS": ["predicateObjectList"], 
     ".": []}, 
  "[,,object]" : {
     ",": [",","object"]}, 
  "[;,?[verb,objectList]]" : {
     ";": [";","?[verb,objectList]"]}, 
  "[^^,iri]" : {
     "^^": ["^^","iri"]}, 
  "[blankNodePropertyList,?predicateObjectList]" : {
     "[": ["blankNodePropertyList","?predicateObjectList"]}, 
  "[storeProperty,a]" : {
     "a": ["storeProperty","a"]}, 
  "[storeProperty,predicate]" : {
     "IRI_REF": ["storeProperty","predicate"], 
     "PNAME_LN": ["storeProperty","predicate"], 
     "PNAME_NS": ["storeProperty","predicate"]}, 
  "[subject,predicateObjectList]" : {
     "IRI_REF": ["subject","predicateObjectList"], 
     "BLANK_NODE_LABEL": ["subject","predicateObjectList"], 
     "ANON": ["subject","predicateObjectList"], 
     "(": ["subject","predicateObjectList"], 
     "PNAME_LN": ["subject","predicateObjectList"], 
     "PNAME_NS": ["subject","predicateObjectList"]}, 
  "[triples,.]" : {
     "[": ["triples","."], 
     "IRI_REF": ["triples","."], 
     "BLANK_NODE_LABEL": ["triples","."], 
     "ANON": ["triples","."], 
     "(": ["triples","."], 
     "PNAME_LN": ["triples","."], 
     "PNAME_NS": ["triples","."]}, 
  "[verb,objectList]" : {
     "a": ["verb","objectList"], 
     "IRI_REF": ["verb","objectList"], 
     "PNAME_LN": ["verb","objectList"], 
     "PNAME_NS": ["verb","objectList"]}, 
  "base" : {
     "@base": ["@base","IRI_REF","."]}, 
  "blankNode" : {
     "BLANK_NODE_LABEL": ["or([BLANK_NODE_LABEL,ANON])"], 
     "ANON": ["or([BLANK_NODE_LABEL,ANON])"]}, 
  "blankNodePropertyList" : {
     "[": ["[","predicateObjectList","]"]}, 
  "booleanLiteral" : {
     "true": ["or([true,false])"], 
     "false": ["or([true,false])"]}, 
  "collection" : {
     "(": ["(","*object",")"]}, 
  "directive" : {
     "@prefix": ["or([prefixID,base,sparqlPrefix,sparqlBase])"], 
     "@base": ["or([prefixID,base,sparqlPrefix,sparqlBase])"], 
     "PREFIX": ["or([prefixID,base,sparqlPrefix,sparqlBase])"], 
     "BASE": ["or([prefixID,base,sparqlPrefix,sparqlBase])"]}, 
  "iri" : {
     "IRI_REF": ["or([IRI_REF,prefixedName])"], 
     "PNAME_LN": ["or([IRI_REF,prefixedName])"], 
     "PNAME_NS": ["or([IRI_REF,prefixedName])"]}, 
  "literal" : {
     "INTEGER": ["or([rdfLiteral,numericLiteral,booleanLiteral])"], 
     "DECIMAL": ["or([rdfLiteral,numericLiteral,booleanLiteral])"], 
     "DOUBLE": ["or([rdfLiteral,numericLiteral,booleanLiteral])"], 
     "true": ["or([rdfLiteral,numericLiteral,booleanLiteral])"], 
     "false": ["or([rdfLiteral,numericLiteral,booleanLiteral])"], 
     "STRING_LITERAL_QUOTE": ["or([rdfLiteral,numericLiteral,booleanLiteral])"], 
     "STRING_LITERAL_SINGLE_QUOTE": ["or([rdfLiteral,numericLiteral,booleanLiteral])"], 
     "STRING_LITERAL_LONG_SINGLE_QUOTE": ["or([rdfLiteral,numericLiteral,booleanLiteral])"], 
     "STRING_LITERAL_LONG_QUOTE": ["or([rdfLiteral,numericLiteral,booleanLiteral])"]}, 
  "numericLiteral" : {
     "INTEGER": ["or([INTEGER,DECIMAL,DOUBLE])"], 
     "DECIMAL": ["or([INTEGER,DECIMAL,DOUBLE])"], 
     "DOUBLE": ["or([INTEGER,DECIMAL,DOUBLE])"]}, 
  "object" : {
     "IRI_REF": ["or([iri,blankNode,collection,blankNodePropertyList,literal])"], 
     "BLANK_NODE_LABEL": ["or([iri,blankNode,collection,blankNodePropertyList,literal])"], 
     "ANON": ["or([iri,blankNode,collection,blankNodePropertyList,literal])"], 
     "(": ["or([iri,blankNode,collection,blankNodePropertyList,literal])"], 
     "[": ["or([iri,blankNode,collection,blankNodePropertyList,literal])"], 
     "PNAME_LN": ["or([iri,blankNode,collection,blankNodePropertyList,literal])"], 
     "PNAME_NS": ["or([iri,blankNode,collection,blankNodePropertyList,literal])"], 
     "INTEGER": ["or([iri,blankNode,collection,blankNodePropertyList,literal])"], 
     "DECIMAL": ["or([iri,blankNode,collection,blankNodePropertyList,literal])"], 
     "DOUBLE": ["or([iri,blankNode,collection,blankNodePropertyList,literal])"], 
     "true": ["or([iri,blankNode,collection,blankNodePropertyList,literal])"], 
     "false": ["or([iri,blankNode,collection,blankNodePropertyList,literal])"], 
     "STRING_LITERAL_QUOTE": ["or([iri,blankNode,collection,blankNodePropertyList,literal])"], 
     "STRING_LITERAL_SINGLE_QUOTE": ["or([iri,blankNode,collection,blankNodePropertyList,literal])"], 
     "STRING_LITERAL_LONG_SINGLE_QUOTE": ["or([iri,blankNode,collection,blankNodePropertyList,literal])"], 
     "STRING_LITERAL_LONG_QUOTE": ["or([iri,blankNode,collection,blankNodePropertyList,literal])"]}, 
  "objectList" : {
     "IRI_REF": ["object","*[,,object]"], 
     "BLANK_NODE_LABEL": ["object","*[,,object]"], 
     "ANON": ["object","*[,,object]"], 
     "(": ["object","*[,,object]"], 
     "[": ["object","*[,,object]"], 
     "PNAME_LN": ["object","*[,,object]"], 
     "PNAME_NS": ["object","*[,,object]"], 
     "INTEGER": ["object","*[,,object]"], 
     "DECIMAL": ["object","*[,,object]"], 
     "DOUBLE": ["object","*[,,object]"], 
     "true": ["object","*[,,object]"], 
     "false": ["object","*[,,object]"], 
     "STRING_LITERAL_QUOTE": ["object","*[,,object]"], 
     "STRING_LITERAL_SINGLE_QUOTE": ["object","*[,,object]"], 
     "STRING_LITERAL_LONG_SINGLE_QUOTE": ["object","*[,,object]"], 
     "STRING_LITERAL_LONG_QUOTE": ["object","*[,,object]"]}, 
  "or([BLANK_NODE_LABEL,ANON])" : {
     "BLANK_NODE_LABEL": ["BLANK_NODE_LABEL"], 
     "ANON": ["ANON"]}, 
  "or([INTEGER,DECIMAL,DOUBLE])" : {
     "INTEGER": ["INTEGER"], 
     "DECIMAL": ["DECIMAL"], 
     "DOUBLE": ["DOUBLE"]}, 
  "or([IRI_REF,prefixedName])" : {
     "IRI_REF": ["IRI_REF"], 
     "PNAME_LN": ["prefixedName"], 
     "PNAME_NS": ["prefixedName"]}, 
  "or([LANGTAG,[^^,iri]])" : {
     "LANGTAG": ["LANGTAG"], 
     "^^": ["[^^,iri]"]}, 
  "or([PNAME_LN,PNAME_NS])" : {
     "PNAME_LN": ["PNAME_LN"], 
     "PNAME_NS": ["PNAME_NS"]}, 
  "or([[storeProperty,predicate],[storeProperty,a]])" : {
     "IRI_REF": ["[storeProperty,predicate]"], 
     "PNAME_LN": ["[storeProperty,predicate]"], 
     "PNAME_NS": ["[storeProperty,predicate]"], 
     "a": ["[storeProperty,a]"]}, 
  "or([[subject,predicateObjectList],[blankNodePropertyList,?predicateObjectList]])" : {
     "IRI_REF": ["[subject,predicateObjectList]"], 
     "BLANK_NODE_LABEL": ["[subject,predicateObjectList]"], 
     "ANON": ["[subject,predicateObjectList]"], 
     "(": ["[subject,predicateObjectList]"], 
     "PNAME_LN": ["[subject,predicateObjectList]"], 
     "PNAME_NS": ["[subject,predicateObjectList]"], 
     "[": ["[blankNodePropertyList,?predicateObjectList]"]}, 
  "or([directive,[triples,.]])" : {
     "@prefix": ["directive"], 
     "@base": ["directive"], 
     "PREFIX": ["directive"], 
     "BASE": ["directive"], 
     "[": ["[triples,.]"], 
     "IRI_REF": ["[triples,.]"], 
     "BLANK_NODE_LABEL": ["[triples,.]"], 
     "ANON": ["[triples,.]"], 
     "(": ["[triples,.]"], 
     "PNAME_LN": ["[triples,.]"], 
     "PNAME_NS": ["[triples,.]"]}, 
  "or([iri,blankNode,collection,blankNodePropertyList,literal])" : {
     "IRI_REF": ["iri"], 
     "PNAME_LN": ["iri"], 
     "PNAME_NS": ["iri"], 
     "BLANK_NODE_LABEL": ["blankNode"], 
     "ANON": ["blankNode"], 
     "(": ["collection"], 
     "[": ["blankNodePropertyList"], 
     "INTEGER": ["literal"], 
     "DECIMAL": ["literal"], 
     "DOUBLE": ["literal"], 
     "true": ["literal"], 
     "false": ["literal"], 
     "STRING_LITERAL_QUOTE": ["literal"], 
     "STRING_LITERAL_SINGLE_QUOTE": ["literal"], 
     "STRING_LITERAL_LONG_SINGLE_QUOTE": ["literal"], 
     "STRING_LITERAL_LONG_QUOTE": ["literal"]}, 
  "or([iri,blankNode,collection])" : {
     "IRI_REF": ["iri"], 
     "PNAME_LN": ["iri"], 
     "PNAME_NS": ["iri"], 
     "BLANK_NODE_LABEL": ["blankNode"], 
     "ANON": ["blankNode"], 
     "(": ["collection"]}, 
  "or([prefixID,base,sparqlPrefix,sparqlBase])" : {
     "@prefix": ["prefixID"], 
     "@base": ["base"], 
     "PREFIX": ["sparqlPrefix"], 
     "BASE": ["sparqlBase"]}, 
  "or([rdfLiteral,numericLiteral,booleanLiteral])" : {
     "STRING_LITERAL_QUOTE": ["rdfLiteral"], 
     "STRING_LITERAL_SINGLE_QUOTE": ["rdfLiteral"], 
     "STRING_LITERAL_LONG_SINGLE_QUOTE": ["rdfLiteral"], 
     "STRING_LITERAL_LONG_QUOTE": ["rdfLiteral"], 
     "INTEGER": ["numericLiteral"], 
     "DECIMAL": ["numericLiteral"], 
     "DOUBLE": ["numericLiteral"], 
     "true": ["booleanLiteral"], 
     "false": ["booleanLiteral"]}, 
  "or([true,false])" : {
     "true": ["true"], 
     "false": ["false"]}, 
  "predicate" : {
     "IRI_REF": ["iri"], 
     "PNAME_LN": ["iri"], 
     "PNAME_NS": ["iri"]}, 
  "predicateObjectList" : {
     "a": ["verb","objectList","*[;,?[verb,objectList]]"], 
     "IRI_REF": ["verb","objectList","*[;,?[verb,objectList]]"], 
     "PNAME_LN": ["verb","objectList","*[;,?[verb,objectList]]"], 
     "PNAME_NS": ["verb","objectList","*[;,?[verb,objectList]]"]}, 
  "prefixID" : {
     "@prefix": ["@prefix","PNAME_NS","IRI_REF","."]}, 
  "prefixedName" : {
     "PNAME_LN": ["or([PNAME_LN,PNAME_NS])"], 
     "PNAME_NS": ["or([PNAME_LN,PNAME_NS])"]}, 
  "rdfLiteral" : {
     "STRING_LITERAL_QUOTE": ["string","?or([LANGTAG,[^^,iri]])"], 
     "STRING_LITERAL_SINGLE_QUOTE": ["string","?or([LANGTAG,[^^,iri]])"], 
     "STRING_LITERAL_LONG_SINGLE_QUOTE": ["string","?or([LANGTAG,[^^,iri]])"], 
     "STRING_LITERAL_LONG_QUOTE": ["string","?or([LANGTAG,[^^,iri]])"]}, 
  "sparqlBase" : {
     "BASE": ["BASE","IRI_REF"]}, 
  "sparqlPrefix" : {
     "PREFIX": ["PREFIX","PNAME_NS","IRI_REF"]}, 
  "statement" : {
     "@prefix": ["or([directive,[triples,.]])"], 
     "@base": ["or([directive,[triples,.]])"], 
     "PREFIX": ["or([directive,[triples,.]])"], 
     "BASE": ["or([directive,[triples,.]])"], 
     "[": ["or([directive,[triples,.]])"], 
     "IRI_REF": ["or([directive,[triples,.]])"], 
     "BLANK_NODE_LABEL": ["or([directive,[triples,.]])"], 
     "ANON": ["or([directive,[triples,.]])"], 
     "(": ["or([directive,[triples,.]])"], 
     "PNAME_LN": ["or([directive,[triples,.]])"], 
     "PNAME_NS": ["or([directive,[triples,.]])"]}, 
  "storeProperty" : {
     "IRI_REF": [], 
     "PNAME_LN": [], 
     "PNAME_NS": [], 
     "a": []}, 
  "string" : {
     "STRING_LITERAL_QUOTE": ["STRING_LITERAL_QUOTE"], 
     "STRING_LITERAL_SINGLE_QUOTE": ["STRING_LITERAL_SINGLE_QUOTE"], 
     "STRING_LITERAL_LONG_SINGLE_QUOTE": ["STRING_LITERAL_LONG_SINGLE_QUOTE"], 
     "STRING_LITERAL_LONG_QUOTE": ["STRING_LITERAL_LONG_QUOTE"]}, 
  "subject" : {
     "IRI_REF": ["or([iri,blankNode,collection])"], 
     "BLANK_NODE_LABEL": ["or([iri,blankNode,collection])"], 
     "ANON": ["or([iri,blankNode,collection])"], 
     "(": ["or([iri,blankNode,collection])"], 
     "PNAME_LN": ["or([iri,blankNode,collection])"], 
     "PNAME_NS": ["or([iri,blankNode,collection])"]}, 
  "triples" : {
     "[": ["or([[subject,predicateObjectList],[blankNodePropertyList,?predicateObjectList]])"], 
     "IRI_REF": ["or([[subject,predicateObjectList],[blankNodePropertyList,?predicateObjectList]])"], 
     "BLANK_NODE_LABEL": ["or([[subject,predicateObjectList],[blankNodePropertyList,?predicateObjectList]])"], 
     "ANON": ["or([[subject,predicateObjectList],[blankNodePropertyList,?predicateObjectList]])"], 
     "(": ["or([[subject,predicateObjectList],[blankNodePropertyList,?predicateObjectList]])"], 
     "PNAME_LN": ["or([[subject,predicateObjectList],[blankNodePropertyList,?predicateObjectList]])"], 
     "PNAME_NS": ["or([[subject,predicateObjectList],[blankNodePropertyList,?predicateObjectList]])"]}, 
  "turtleDoc" : {
     "$": ["*statement","$"], 
     "@prefix": ["*statement","$"], 
     "@base": ["*statement","$"], 
     "PREFIX": ["*statement","$"], 
     "BASE": ["*statement","$"], 
     "[": ["*statement","$"], 
     "IRI_REF": ["*statement","$"], 
     "BLANK_NODE_LABEL": ["*statement","$"], 
     "ANON": ["*statement","$"], 
     "(": ["*statement","$"], 
     "PNAME_LN": ["*statement","$"], 
     "PNAME_NS": ["*statement","$"]}, 
  "verb" : {
     "a": ["or([[storeProperty,predicate],[storeProperty,a]])"], 
     "IRI_REF": ["or([[storeProperty,predicate],[storeProperty,a]])"], 
     "PNAME_LN": ["or([[storeProperty,predicate],[storeProperty,a]])"], 
     "PNAME_NS": ["or([[storeProperty,predicate],[storeProperty,a]])"]}
},

keywords:/^(BASE|PREFIX)/i ,

punct:/^(a|\.|,|\(|\)|;|\[|\]|\^\^)/ ,

startSymbol:"turtleDoc",
acceptEmpty:true,
}
},{}],3:[function(require,module,exports){
"use strict";
var CodeMirror = (function(){try{return require('codemirror')}catch(e){return window.CodeMirror}})();
CodeMirror.defineMode("rdf11turtle", function(config, parserConfig) {
  var indentUnit = config.indentUnit;

  var grammar = require("./_tokenizer-table.js");
  var ll1_table = grammar.table;

  var IRI_REF = '<[^<>"`\|\{\}\^\\\x00-\x20]*>';
  /*
	 * PN_CHARS_BASE =
	 * '[A-Z]|[a-z]|[\\u00C0-\\u00D6]|[\\u00D8-\\u00F6]|[\\u00F8-\\u02FF]|[\\u0370-\\u037D]|[\\u037F-\\u1FFF]|[\\u200C-\\u200D]|[\\u2070-\\u218F]|[\\u2C00-\\u2FEF]|[\\u3001-\\uD7FF]|[\\uF900-\\uFDCF]|[\\uFDF0-\\uFFFD]|[\\u10000-\\uEFFFF]';
	 */

  var PN_CHARS_BASE = "[A-Za-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD]";
  var PN_CHARS_U = PN_CHARS_BASE + "|_";

  var PN_CHARS = "(" + PN_CHARS_U + "|-|[0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040])";
  var VARNAME = "(" + PN_CHARS_U + "|[0-9])" + "(" + PN_CHARS_U + "|[0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040])*";
  var VAR1 = "\\?" + VARNAME;
  var VAR2 = "\\$" + VARNAME;

  var PN_PREFIX = "(" + PN_CHARS_BASE + ")(((" + PN_CHARS + ")|\\.)*(" + PN_CHARS + "))?";

  var HEX = "[0-9A-Fa-f]";
  var PERCENT = "(%" + HEX + HEX + ")";
  var PN_LOCAL_ESC = "(\\\\[_~\\.\\-!\\$&'\\(\\)\\*\\+,;=/\\?#@%])";
  var PLX = "(" + PERCENT + "|" + PN_LOCAL_ESC + ")";
  var PN_LOCAL = "(" +
    PN_CHARS_U +
    "|:|[0-9]|" +
    PLX +
    ")((" +
    PN_CHARS +
    "|\\.|:|" +
    PLX +
    ")*(" +
    PN_CHARS +
    "|:|" +
    PLX +
    "))?";
  var BLANK_NODE_LABEL = "_:(" + PN_CHARS_U + "|[0-9])((" + PN_CHARS + "|\\.)*" + PN_CHARS + ")?";
  var PNAME_NS = "(" + PN_PREFIX + ")?:";
  var PNAME_LN = PNAME_NS + PN_LOCAL;
  var LANGTAG = "@[a-zA-Z]+(-[a-zA-Z0-9]+)*";

  var EXPONENT = "[eE][\\+-]?[0-9]+";
  var INTEGER = "[-\\+]?[0-9]+";
  var DECIMAL = "[-\\+]?(([0-9]+\\.[0-9]*)|(\\.[0-9]+))";
  var DOUBLE = "[-\\+]?(([0-9]+\\.[0-9]*" + EXPONENT + ")|" + "(\\.[0-9]+" + EXPONENT + ")|" + "([0-9]+" + EXPONENT + "))";
  var ECHAR = "\\\\[tbnrf\\\\\"']";

  //IMPORTANT: this unicode rule is not in the official grammar.
  //Reason: https://github.com/YASGUI/YASQE/issues/49
  //unicode escape sequences (which the sparql spec considers part of the pre-processing of sparql queries)
  //are marked as invalid. We have little choice (other than adding a layer of complixity) than to modify the grammar accordingly
  //however, for now only allow these escape sequences in literals (where actually, this should be allows in e.g. prefixes as well)
  var hex4 = HEX + "{4}";
  var unicode = "(\\\\u" + hex4 + "|\\\\U00(10|0" + HEX + ")" + hex4 + ")";
  var LINE_BREAK = "\n";
  var STRING_LITERAL_SINGLE_QUOTE = "'(([^\\x27\\x5C\\x0A\\x0D])|" + ECHAR + "|" + unicode + ")*'";
  var STRING_LITERAL_QUOTE = '"(([^\\x22\\x5C\\x0A\\x0D])|' + ECHAR + "|" + unicode + ')*"';

  var STRING_LITERAL_LONG = {
    SINGLE_QUOTE: {
      CAT: "STRING_LITERAL_LONG_SINGLE_QUOTE",
      QUOTES: "'''",
      CONTENTS: "(('|'')?([^'\\\\]|" + ECHAR + "|" + unicode + "))*"
    },
    QUOTE: {
      CAT: "STRING_LITERAL_LONG_QUOTE",
      QUOTES: '"""',
      CONTENTS: '(("|"")?([^"\\\\]|' + ECHAR + "|" + unicode + "))*"
    }
  };
  for (var key in STRING_LITERAL_LONG) {
    STRING_LITERAL_LONG[key].COMPLETE = STRING_LITERAL_LONG[key].QUOTES +
      STRING_LITERAL_LONG[key].CONTENTS +
      STRING_LITERAL_LONG[key].QUOTES;
  }
  //	var STRING_LITERAL_LONG_QUOTES = {
  //		"STRING_LITERAL_LONG_QUOTES1": "'''",
  //		"STRING_LITERAL_LONG_QUOTES2": '"""',
  //	}
  //	var STRING_LITERAL_LONG_CONTENTS = {
  //		"STRING_LITERAL_LONG_QUOTES1": "(('|'')?([^'\\\\]|"+ECHAR+"|"+unicode+"))*",
  //		"STRING_LITERAL_LONG_QUOTES2": '(("|"")?([^"\\\\]|'+ECHAR+'|'+unicode+'))*'
  //	};
  //	var STRING_LITERAL_LONG1 = STRING_LITERAL_LONG['SINGLE'].QUOTES + STRING_LITERAL_LONG['SINGLE'].CONTENTS + STRING_LITERAL_LONG['SINGLE'].QUOTES;
  //	var STRING_LITERAL_LONG2 = STRING_LITERAL_LONG['DOUBLE'].QUOTES + STRING_LITERAL_LONG['DOUBLE'].CONTENTS + STRING_LITERAL_LONG['DOUBLE'].QUOTES;

  //	var stringLiteralLongContentTerminals = {};
  //	for (var key in STRING_LITERAL_LONG) {
  //		stringLiteralLongContentTerminals[key] = {
  //			name: key,
  //			regex:new RegExp("^"+STRING_LITERAL_LONG_CONTENTS[key]),
  //			style:"string"
  //		};
  //	}
  //some regular expressions not used in regular terminals, because this is used accross lines
  var stringLiteralLongRegex = {};
  for (var key in STRING_LITERAL_LONG) {
    stringLiteralLongRegex[key] = {
      complete: {
        name: "STRING_LITERAL_LONG_" + key,
        regex: new RegExp("^" + STRING_LITERAL_LONG[key].COMPLETE),
        style: "string"
      },
      contents: {
        name: "STRING_LITERAL_LONG_" + key,
        regex: new RegExp("^" + STRING_LITERAL_LONG[key].CONTENTS),
        style: "string"
      },
      closing: {
        name: "STRING_LITERAL_LONG_" + key,
        regex: new RegExp("^" + STRING_LITERAL_LONG[key].CONTENTS + STRING_LITERAL_LONG[key].QUOTES),
        style: "string"
      },
      quotes: {
        name: "STRING_LITERAL_LONG_QUOTES_" + key,
        regex: new RegExp("^" + STRING_LITERAL_LONG[key].QUOTES),
        style: "string"
      }
    };
  }

  var WS = "[\\x20\\x09\\x0D\\x0A]";
  // Careful! Code mirror feeds one line at a time with no \n
  // ... but otherwise comment is terminated by \n
  var COMMENT = "#([^\\n\\r]*[\\n\\r]|[^\\n\\r]*$)";
  var WS_OR_COMMENT_STAR = "(" + WS + "|(" + COMMENT + "))*";
  var NIL = "\\(" + WS_OR_COMMENT_STAR + "\\)";
  var ANON = "\\[" + WS_OR_COMMENT_STAR + "\\]";
  var terminals = [
    {
      name: "WS",
      regex: new RegExp("^" + WS + "+"),
      style: "ws"
    },

    {
      name: "COMMENT",
      regex: new RegExp("^" + COMMENT),
      style: "comment"
    },

    {
      name: "true",
      regex: new RegExp("^true", "i"),
      style: "keyword"
    },

    {
      name: "false",
      regex: new RegExp("^false", "i"),
      style: "keyword"
    },

    {
      name: "IRI_REF",
      regex: new RegExp("^" + IRI_REF),
      style: "variable-3"
    },

    {
      name: "VAR1",
      regex: new RegExp("^" + VAR1),
      style: "atom"
    },

    {
      name: "VAR2",
      regex: new RegExp("^" + VAR2),
      style: "atom"
    },

    {
      name: "@prefix",
      regex: new RegExp("^@prefix", "i"),
      style: "keyword"
    },

    {
      name: "@base",
      regex: new RegExp("^@base", "i"),
      style: "keyword"
    },

    {
      name: "LANGTAG",
      regex: new RegExp("^" + LANGTAG),
      style: "meta"
    },

    {
      name: "DOUBLE",
      regex: new RegExp("^" + DOUBLE),
      style: "number"
    },

    {
      name: "DECIMAL",
      regex: new RegExp("^" + DECIMAL),
      style: "number"
    },

    {
      name: "INTEGER",
      regex: new RegExp("^" + INTEGER),
      style: "number"
    },

    {
      name: "STRING_LITERAL_SINGLE_QUOTE",
      regex: new RegExp("^" + STRING_LITERAL_SINGLE_QUOTE),
      style: "string"
    },

    {
      name: "STRING_LITERAL_QUOTE",
      regex: new RegExp("^" + STRING_LITERAL_QUOTE),
      style: "string"
    },

    // Enclosed comments won't be highlighted
    {
      name: "NIL",
      regex: new RegExp("^" + NIL),
      style: "punc"
    },

    // Enclosed comments won't be highlighted
    {
      name: "ANON",
      regex: new RegExp("^" + ANON),
      style: "punc"
    },

    {
      name: "PNAME_LN",
      regex: new RegExp("^" + PNAME_LN),
      style: "string-2"
    },

    {
      name: "PNAME_NS",
      regex: new RegExp("^" + PNAME_NS),
      style: "string-2"
    },

    {
      name: "BLANK_NODE_LABEL",
      regex: new RegExp("^" + BLANK_NODE_LABEL),
      style: "string-2"
    }
  ];

  function getPossibles(symbol) {
    var possibles = [], possiblesOb = ll1_table[symbol];
    if (possiblesOb != undefined) {
      for (var property in possiblesOb) {
        possibles.push(property.toString());
      }
    } else {
      possibles.push(symbol);
    }
    return possibles;
  }

  function tokenBase(stream, state) {
    function nextToken() {
      var consumed = null;
      if (state.inLiteral) {
        var closingQuotes = false;
        //multi-line literal. try to parse contents.
        consumed = stream.match(stringLiteralLongRegex[state.inLiteral].contents.regex, true, false);
        if (consumed && consumed[0].length == 0) {
          //try seeing whether we can consume closing quotes, to avoid stopping
          consumed = stream.match(stringLiteralLongRegex[state.inLiteral].closing.regex, true, false);
          closingQuotes = true;
        }

        if (consumed && consumed[0].length > 0) {
          //some string content here.
          var returnObj = {
            quotePos: closingQuotes ? "end" : "content",
            cat: STRING_LITERAL_LONG[state.inLiteral].CAT,
            style: stringLiteralLongRegex[state.inLiteral].complete.style,
            text: consumed[0],
            start: stream.start
          };
          if (closingQuotes) state.inLiteral = false;
          return returnObj;
        }
      }

      //Multiline literals
      for (var quoteType in stringLiteralLongRegex) {
        consumed = stream.match(stringLiteralLongRegex[quoteType].quotes.regex, true, false);
        if (consumed) {
          var quotePos;
          if (state.inLiteral) {
            //end of literal. everything is fine
            state.inLiteral = false;
            quotePos = "end";
          } else {
            state.inLiteral = quoteType;
            quotePos = "start";
          }
          return {
            cat: STRING_LITERAL_LONG[quoteType].CAT,
            style: stringLiteralLongRegex[quoteType].quotes.style,
            text: consumed[0],
            quotePos: quotePos,
            start: stream.start
          };
        }
      }

      // Tokens defined by individual regular expressions
      for (var i = 0; i < terminals.length; ++i) {
        consumed = stream.match(terminals[i].regex, true, false);
        if (consumed) {
          return {
            cat: terminals[i].name,
            style: terminals[i].style,
            text: consumed[0],
            start: stream.start
          };
        }
      }

      // Keywords
      consumed = stream.match(grammar.keywords, true, false);
      if (consumed)
        return {
          cat: stream.current().toUpperCase(),
          style: "keyword",
          text: consumed[0],
          start: stream.start
        };

      // Punctuation
      consumed = stream.match(grammar.punct, true, false);
      if (consumed)
        return {
          cat: stream.current(),
          style: "punc",
          text: consumed[0],
          start: stream.start
        };

      // Token is invalid
      // better consume something anyway, or else we're stuck
      consumed = stream.match(/^.[A-Za-z0-9]*/, true, false);
      return {
        cat: "<invalid_token>",
        style: "error",
        text: consumed[0],
        start: stream.start
      };
    }

    function recordFailurePos() {
      // tokenOb.style= "sp-invalid";
      var col = stream.column();
      state.errorStartPos = col;
      state.errorEndPos = col + tokenOb.text.length;
    }

    // Some fake non-terminals are just there to have side-effect on state
    function setSideConditions(topSymbol) {
      if (topSymbol === "prefixID" || topSymbol === "sparqlPrefix") {
        state.inPrefixDecl = true;
      } else {
        state.inPrefixDecl = false;
      }
      if (topSymbol === "storeProperty") {
          state.storeProperty = true;
      }
    }

    // CodeMirror works with one line at a time,
    // but newline should behave like whitespace
    // - i.e. a definite break between tokens (for autocompleter)
    if (stream.pos == 0) state.possibleCurrent = state.possibleNext;

    var tokenOb = nextToken();

    if (tokenOb.cat == "<invalid_token>") {
      // set error state, and
      if (state.OK == true) {
        state.OK = false;
        recordFailurePos();
      }
      state.complete = false;
      // alert("Invalid:"+tokenOb.text);
      return tokenOb.style;
    }

    if (tokenOb.cat == "WS" || tokenOb.cat == "COMMENT" || (tokenOb.quotePos && tokenOb.quotePos != "end")) {
      state.possibleCurrent = state.possibleNext;
      return tokenOb.style;
    }
    // Otherwise, run the parser until the token is digested
    // or failure
    var finished = false;
    var topSymbol;
    var token = tokenOb.cat;

    if (!tokenOb.quotePos || tokenOb.quotePos == "end") {
      // Incremental LL1 parse
      while (state.stack.length > 0 && token && state.OK && !finished) {
        topSymbol = state.stack.pop();
        if (topSymbol === 'var' && tokenOb.text) state.variables[tokenOb.text] = tokenOb.text;
        if (!ll1_table[topSymbol]) {
          // Top symbol is a terminal
          if (topSymbol == token) {
            if (state.inPrefixDecl) {
              if (topSymbol === "PNAME_NS" && tokenOb.text.length > 0) {
                state.currentPnameNs = tokenOb.text.slice(0, -1);
              } else if (state.currentPnameNs !== undefined && tokenOb.text.length > 2) {
                state.prefixes[state.currentPnameNs] = tokenOb.text.slice(1, -1);
                //reset current pname ns
                state.currentPnameNs = undefined;
              }
            }
            // Matching terminals
            // - consume token from input stream
            finished = true;
            // Check whether $ (end of input token) is poss next
            // for everything on stack
            var allNillable = true;
            for (var sp = state.stack.length; sp > 0; --sp) {
              var item = ll1_table[state.stack[sp - 1]];
              if (!item || !item["$"]) allNillable = false;
            }
            state.complete = allNillable;
            if (state.storeProperty && token.cat != "punc") {
              state.lastProperty = tokenOb.text;
              state.storeProperty = false;
            }

            //check whether a used prefix is actually defined
            if (!state.inPrefixDecl && (token === "PNAME_NS" || token === "PNAME_LN")) {
              var colonIndex = tokenOb.text.indexOf(":");
              if (colonIndex >= 0) {
                var prefNs = tokenOb.text.slice(0, colonIndex);
                //avoid warnings for missing bif prefixes (yuck, virtuoso-specific)
                if (!state.prefixes[prefNs] && ["bif", "xsd", "sql"].indexOf(prefNs) < 0) {
                  state.OK = false;
                  recordFailurePos();
                  state.errorMsg = "Prefix '" + prefNs + "' is not defined";
                }
              }
            }
          } else {
            state.OK = false;
            state.complete = false;
            recordFailurePos();
          }
        } else {
          // topSymbol is nonterminal
          // - see if there is an entry for topSymbol
          // and nextToken in table
          var nextSymbols = ll1_table[topSymbol][token];
          if (nextSymbols !== undefined) {
            // Match - copy RHS of rule to stack
            for (var i = nextSymbols.length - 1; i >= 0; --i) {
              state.stack.push(nextSymbols[i]);
            }
            // Peform any non-grammatical side-effects
            setSideConditions(topSymbol);
          } else {
            // No match in table - fail
            state.OK = false;
            state.complete = false;
            recordFailurePos();
            state.stack.push(topSymbol); // Shove topSymbol back on stack
          }
        }
      }
    }
    if (!finished && state.OK) {
      state.OK = false;
      state.complete = false;
      recordFailurePos();
    }

    if (state.possibleCurrent.indexOf("a") >= 0) {
      state.lastPredicateOffset = tokenOb.start;
    }
    state.possibleCurrent = state.possibleNext;

    state.possibleNext = getPossibles(state.stack[state.stack.length - 1]);

    return tokenOb.style;
  }

  var indentTop = {
    "*[,, object]": 3,
    "*[(,),object]": 3,
    object: 2,
    objectList: 2,
    storeProperty: 2,
    predicateObjectList: 1,
    "?[verb,objectList]": 1
  };

  var indentTable = {
    "}": 1,
    "]": 1,
    ")": 1,
    "{": -1,
    "(": -1,
    "[": -1
    //		"*[;,?[or([verbPath,verbSimple]),objectList]]": 1,
  };

  function indent(state, textAfter) {
    //just avoid we don't indent multi-line  literals
    if (state.inLiteral) return 0;
    if (state.stack.length && state.stack[state.stack.length - 1] == "?[verb,objectList]") {
      //we are after a semi-colon. I.e., nicely align this line with predicate position of previous line
      return state.lastPredicateOffset;
    } else {
      var n = 0; // indent level
      var i = state.stack.length - 1;
      if (/^[\}\]\)]/.test(textAfter)) {
        // Skip stack items until after matching bracket
        var closeBracket = textAfter.substr(0, 1);
        for (; i >= 0; --i) {
          if (state.stack[i] == closeBracket) {
            --i;
            break;
          }
        }
      } else {
        // Consider nullable non-terminals if at top of stack
        var dn = indentTop[state.stack[i]];
        if (dn) {
          n += dn;
          --i;
        }
      }
      for (; i >= 0; --i) {
        var dn = indentTable[state.stack[i]];
        if (dn) {
          n += dn;
        }
      }
      return n * config.indentUnit;
    }
  }

  return {
    token: tokenBase,
    startState: function(base) {
      return {
        tokenize: tokenBase,
        OK: true,
        complete: grammar.acceptEmpty,
        errorStartPos: null,
        errorEndPos: null,
        possibleCurrent: getPossibles(grammar.startSymbol),
        possibleNext: getPossibles(grammar.startSymbol),
        storeProperty: false,
        lastProperty: "",
        inLiteral: false,
        stack: [grammar.startSymbol],
        lastPredicateOffset: config.indentUnit,
        prefixes: {},
        variables: {}
      };
    },
    indent: indent,
    electricChars: "}])"
  };
});
CodeMirror.defineMIME("text/turtle", "rdf11turtle");

},{"./_tokenizer-table.js":2,"codemirror":undefined}],4:[function(require,module,exports){
/*
* TRIE implementation in Javascript
* Copyright (c) 2010 Saurabh Odhyan | http://odhyan.com
*
* Permission is hereby granted, free of charge, to any person obtaining a copy
* of this software and associated documentation files (the "Software"), to deal
* in the Software without restriction, including without limitation the rights
* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included in
* all copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
* THE SOFTWARE.
*
* Date: Nov 7, 2010
*/

/*
* A trie, or prefix tree, is a multi-way tree structure useful for storing strings over an alphabet.
* It has been used to store large dictionaries of English (say) words in spell-checking programs
* and in natural-language "understanding" programs.
* @see http://en.wikipedia.org/wiki/Trie
* @see http://www.csse.monash.edu.au/~lloyd/tildeAlgDS/Tree/Trie/
/*

* @class Trie
* @constructor
*/

var Trie = module.exports = function() {
  this.words = 0;
  this.prefixes = 0;
  this.children = [];
};

Trie.prototype = {
  /*
    * Insert a word into the dictionary.
    * Recursively traverse through the trie nodes, and create new node if does not already exist.
    *
    * @method insert
    * @param {String} str Word to insert in the dictionary
    * @param {Integer} pos Current index of the string to be inserted
    * @return {Void}
    */
  insert: function(str, pos) {
    if (str.length == 0) {
      //blank string cannot be inserted
      return;
    }

    var T = this, k, child;

    if (pos === undefined) {
      pos = 0;
    }
    if (pos === str.length) {
      T.words++;
      return;
    }
    T.prefixes++;
    k = str[pos];
    if (T.children[k] === undefined) {
      //if node for this char doesn't exist, create one
      T.children[k] = new Trie();
    }
    child = T.children[k];
    child.insert(str, pos + 1);
  },

  /*
    * Remove a word from the dictionary.
    *
    * @method remove
    * @param {String} str Word to be removed
    * @param {Integer} pos Current index of the string to be removed
    * @return {Void}
    */
  remove: function(str, pos) {
    if (str.length == 0) {
      return;
    }

    var T = this, k, child;

    if (pos === undefined) {
      pos = 0;
    }
    if (T === undefined) {
      return;
    }
    if (pos === str.length) {
      T.words--;
      return;
    }
    T.prefixes--;
    k = str[pos];
    child = T.children[k];
    child.remove(str, pos + 1);
  },

  /*
    * Update an existing word in the dictionary.
    * This method removes the old word from the dictionary and inserts the new word.
    *
    * @method update
    * @param {String} strOld The old word to be replaced
    * @param {String} strNew The new word to be inserted
    * @return {Void}
    */
  update: function(strOld, strNew) {
    if (strOld.length == 0 || strNew.length == 0) {
      return;
    }
    this.remove(strOld);
    this.insert(strNew);
  },

  /*
    * Count the number of times a given word has been inserted into the dictionary
    *
    * @method countWord
    * @param {String} str Word to get count of
    * @param {Integer} pos Current index of the given word
    * @return {Integer} The number of times a given word exists in the dictionary
    */
  countWord: function(str, pos) {
    if (str.length == 0) {
      return 0;
    }

    var T = this, k, child, ret = 0;

    if (pos === undefined) {
      pos = 0;
    }
    if (pos === str.length) {
      return T.words;
    }
    k = str[pos];
    child = T.children[k];
    if (child !== undefined) {
      //node exists
      ret = child.countWord(str, pos + 1);
    }
    return ret;
  },

  /*
    * Count the number of times a given prefix exists in the dictionary
    *
    * @method countPrefix
    * @param {String} str Prefix to get count of
    * @param {Integer} pos Current index of the given prefix
    * @return {Integer} The number of times a given prefix exists in the dictionary
    */
  countPrefix: function(str, pos) {
    if (str.length == 0) {
      return 0;
    }

    var T = this, k, child, ret = 0;

    if (pos === undefined) {
      pos = 0;
    }
    if (pos === str.length) {
      return T.prefixes;
    }
    var k = str[pos];
    child = T.children[k];
    if (child !== undefined) {
      //node exists
      ret = child.countPrefix(str, pos + 1);
    }
    return ret;
  },

  /*
    * Find a word in the dictionary
    *
    * @method find
    * @param {String} str The word to find in the dictionary
    * @return {Boolean} True if the word exists in the dictionary, else false
    */
  find: function(str) {
    if (str.length == 0) {
      return false;
    }

    if (this.countWord(str) > 0) {
      return true;
    } else {
      return false;
    }
  },

  /*
    * Get all words in the dictionary
    *
    * @method getAllWords
    * @param {String} str Prefix of current word
    * @return {Array} Array of words in the dictionary
    */
  getAllWords: function(str) {
    var T = this, k, child, ret = [];
    if (str === undefined) {
      str = "";
    }
    if (T === undefined) {
      return [];
    }
    if (T.words > 0) {
      ret.push(str);
    }
    for (k in T.children) {
      if (T.children.hasOwnProperty(k)) {
        child = T.children[k];
        ret = ret.concat(child.getAllWords(str + k));
      }
    }
    return ret;
  },

  /*
    * Autocomplete a given prefix
    *
    * @method autoComplete
    * @param {String} str Prefix to be completed based on dictionary entries
    * @param {Integer} pos Current index of the prefix
    * @return {Array} Array of possible suggestions
    */
  autoComplete: function(str, pos) {
    var T = this, k, child;
    if (str.length == 0) {
      if (pos === undefined) {
        return T.getAllWords(str);
      } else {
        return [];
      }
    }
    if (pos === undefined) {
      pos = 0;
    }
    k = str[pos];
    child = T.children[k];
    if (child === undefined) {
      //node doesn't exist
      return [];
    }
    if (pos === str.length - 1) {
      return child.getAllWords(str);
    }
    return child.autoComplete(str, pos + 1);
  }
};

},{}],5:[function(require,module,exports){
(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(['module', 'select'], factory);
    } else if (typeof exports !== "undefined") {
        factory(module, require('select'));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod, global.select);
        global.clipboardAction = mod.exports;
    }
})(this, function (module, _select) {
    'use strict';

    var _select2 = _interopRequireDefault(_select);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
        return typeof obj;
    } : function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _createClass = function () {
        function defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor) descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
            }
        }

        return function (Constructor, protoProps, staticProps) {
            if (protoProps) defineProperties(Constructor.prototype, protoProps);
            if (staticProps) defineProperties(Constructor, staticProps);
            return Constructor;
        };
    }();

    var ClipboardAction = function () {
        /**
         * @param {Object} options
         */
        function ClipboardAction(options) {
            _classCallCheck(this, ClipboardAction);

            this.resolveOptions(options);
            this.initSelection();
        }

        /**
         * Defines base properties passed from constructor.
         * @param {Object} options
         */


        _createClass(ClipboardAction, [{
            key: 'resolveOptions',
            value: function resolveOptions() {
                var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

                this.action = options.action;
                this.container = options.container;
                this.emitter = options.emitter;
                this.target = options.target;
                this.text = options.text;
                this.trigger = options.trigger;

                this.selectedText = '';
            }
        }, {
            key: 'initSelection',
            value: function initSelection() {
                if (this.text) {
                    this.selectFake();
                } else if (this.target) {
                    this.selectTarget();
                }
            }
        }, {
            key: 'selectFake',
            value: function selectFake() {
                var _this = this;

                var isRTL = document.documentElement.getAttribute('dir') == 'rtl';

                this.removeFake();

                this.fakeHandlerCallback = function () {
                    return _this.removeFake();
                };
                this.fakeHandler = this.container.addEventListener('click', this.fakeHandlerCallback) || true;

                this.fakeElem = document.createElement('textarea');
                // Prevent zooming on iOS
                this.fakeElem.style.fontSize = '12pt';
                // Reset box model
                this.fakeElem.style.border = '0';
                this.fakeElem.style.padding = '0';
                this.fakeElem.style.margin = '0';
                // Move element out of screen horizontally
                this.fakeElem.style.position = 'absolute';
                this.fakeElem.style[isRTL ? 'right' : 'left'] = '-9999px';
                // Move element to the same position vertically
                var yPosition = window.pageYOffset || document.documentElement.scrollTop;
                this.fakeElem.style.top = yPosition + 'px';

                this.fakeElem.setAttribute('readonly', '');
                this.fakeElem.value = this.text;

                this.container.appendChild(this.fakeElem);

                this.selectedText = (0, _select2.default)(this.fakeElem);
                this.copyText();
            }
        }, {
            key: 'removeFake',
            value: function removeFake() {
                if (this.fakeHandler) {
                    this.container.removeEventListener('click', this.fakeHandlerCallback);
                    this.fakeHandler = null;
                    this.fakeHandlerCallback = null;
                }

                if (this.fakeElem) {
                    this.container.removeChild(this.fakeElem);
                    this.fakeElem = null;
                }
            }
        }, {
            key: 'selectTarget',
            value: function selectTarget() {
                this.selectedText = (0, _select2.default)(this.target);
                this.copyText();
            }
        }, {
            key: 'copyText',
            value: function copyText() {
                var succeeded = void 0;

                try {
                    succeeded = document.execCommand(this.action);
                } catch (err) {
                    succeeded = false;
                }

                this.handleResult(succeeded);
            }
        }, {
            key: 'handleResult',
            value: function handleResult(succeeded) {
                this.emitter.emit(succeeded ? 'success' : 'error', {
                    action: this.action,
                    text: this.selectedText,
                    trigger: this.trigger,
                    clearSelection: this.clearSelection.bind(this)
                });
            }
        }, {
            key: 'clearSelection',
            value: function clearSelection() {
                if (this.trigger) {
                    this.trigger.focus();
                }

                window.getSelection().removeAllRanges();
            }
        }, {
            key: 'destroy',
            value: function destroy() {
                this.removeFake();
            }
        }, {
            key: 'action',
            set: function set() {
                var action = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'copy';

                this._action = action;

                if (this._action !== 'copy' && this._action !== 'cut') {
                    throw new Error('Invalid "action" value, use either "copy" or "cut"');
                }
            },
            get: function get() {
                return this._action;
            }
        }, {
            key: 'target',
            set: function set(target) {
                if (target !== undefined) {
                    if (target && (typeof target === 'undefined' ? 'undefined' : _typeof(target)) === 'object' && target.nodeType === 1) {
                        if (this.action === 'copy' && target.hasAttribute('disabled')) {
                            throw new Error('Invalid "target" attribute. Please use "readonly" instead of "disabled" attribute');
                        }

                        if (this.action === 'cut' && (target.hasAttribute('readonly') || target.hasAttribute('disabled'))) {
                            throw new Error('Invalid "target" attribute. You can\'t cut text from elements with "readonly" or "disabled" attributes');
                        }

                        this._target = target;
                    } else {
                        throw new Error('Invalid "target" value, use a valid Element');
                    }
                }
            },
            get: function get() {
                return this._target;
            }
        }]);

        return ClipboardAction;
    }();

    module.exports = ClipboardAction;
});
},{"select":20}],6:[function(require,module,exports){
(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(['module', './clipboard-action', 'tiny-emitter', 'good-listener'], factory);
    } else if (typeof exports !== "undefined") {
        factory(module, require('./clipboard-action'), require('tiny-emitter'), require('good-listener'));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod, global.clipboardAction, global.tinyEmitter, global.goodListener);
        global.clipboard = mod.exports;
    }
})(this, function (module, _clipboardAction, _tinyEmitter, _goodListener) {
    'use strict';

    var _clipboardAction2 = _interopRequireDefault(_clipboardAction);

    var _tinyEmitter2 = _interopRequireDefault(_tinyEmitter);

    var _goodListener2 = _interopRequireDefault(_goodListener);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
        return typeof obj;
    } : function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _createClass = function () {
        function defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor) descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
            }
        }

        return function (Constructor, protoProps, staticProps) {
            if (protoProps) defineProperties(Constructor.prototype, protoProps);
            if (staticProps) defineProperties(Constructor, staticProps);
            return Constructor;
        };
    }();

    function _possibleConstructorReturn(self, call) {
        if (!self) {
            throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        }

        return call && (typeof call === "object" || typeof call === "function") ? call : self;
    }

    function _inherits(subClass, superClass) {
        if (typeof superClass !== "function" && superClass !== null) {
            throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
        }

        subClass.prototype = Object.create(superClass && superClass.prototype, {
            constructor: {
                value: subClass,
                enumerable: false,
                writable: true,
                configurable: true
            }
        });
        if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
    }

    var Clipboard = function (_Emitter) {
        _inherits(Clipboard, _Emitter);

        /**
         * @param {String|HTMLElement|HTMLCollection|NodeList} trigger
         * @param {Object} options
         */
        function Clipboard(trigger, options) {
            _classCallCheck(this, Clipboard);

            var _this = _possibleConstructorReturn(this, (Clipboard.__proto__ || Object.getPrototypeOf(Clipboard)).call(this));

            _this.resolveOptions(options);
            _this.listenClick(trigger);
            return _this;
        }

        /**
         * Defines if attributes would be resolved using internal setter functions
         * or custom functions that were passed in the constructor.
         * @param {Object} options
         */


        _createClass(Clipboard, [{
            key: 'resolveOptions',
            value: function resolveOptions() {
                var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

                this.action = typeof options.action === 'function' ? options.action : this.defaultAction;
                this.target = typeof options.target === 'function' ? options.target : this.defaultTarget;
                this.text = typeof options.text === 'function' ? options.text : this.defaultText;
                this.container = _typeof(options.container) === 'object' ? options.container : document.body;
            }
        }, {
            key: 'listenClick',
            value: function listenClick(trigger) {
                var _this2 = this;

                this.listener = (0, _goodListener2.default)(trigger, 'click', function (e) {
                    return _this2.onClick(e);
                });
            }
        }, {
            key: 'onClick',
            value: function onClick(e) {
                var trigger = e.delegateTarget || e.currentTarget;

                if (this.clipboardAction) {
                    this.clipboardAction = null;
                }

                this.clipboardAction = new _clipboardAction2.default({
                    action: this.action(trigger),
                    target: this.target(trigger),
                    text: this.text(trigger),
                    container: this.container,
                    trigger: trigger,
                    emitter: this
                });
            }
        }, {
            key: 'defaultAction',
            value: function defaultAction(trigger) {
                return getAttributeValue('action', trigger);
            }
        }, {
            key: 'defaultTarget',
            value: function defaultTarget(trigger) {
                var selector = getAttributeValue('target', trigger);

                if (selector) {
                    return document.querySelector(selector);
                }
            }
        }, {
            key: 'defaultText',
            value: function defaultText(trigger) {
                return getAttributeValue('text', trigger);
            }
        }, {
            key: 'destroy',
            value: function destroy() {
                this.listener.destroy();

                if (this.clipboardAction) {
                    this.clipboardAction.destroy();
                    this.clipboardAction = null;
                }
            }
        }], [{
            key: 'isSupported',
            value: function isSupported() {
                var action = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : ['copy', 'cut'];

                var actions = typeof action === 'string' ? [action] : action;
                var support = !!document.queryCommandSupported;

                actions.forEach(function (action) {
                    support = support && !!document.queryCommandSupported(action);
                });

                return support;
            }
        }]);

        return Clipboard;
    }(_tinyEmitter2.default);

    /**
     * Helper function to retrieve attribute value.
     * @param {String} suffix
     * @param {Element} element
     */
    function getAttributeValue(suffix, element) {
        var attribute = 'data-clipboard-' + suffix;

        if (!element.hasAttribute(attribute)) {
            return;
        }

        return element.getAttribute(attribute);
    }

    module.exports = Clipboard;
});
},{"./clipboard-action":5,"good-listener":19,"tiny-emitter":33}],7:[function(require,module,exports){
// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: http://codemirror.net/LICENSE

(function(mod) {
  if (typeof exports == "object" && typeof module == "object") // CommonJS
    mod((function(){try{return require('codemirror')}catch(e){return window.CodeMirror}})());
  else if (typeof define == "function" && define.amd) // AMD
    define(["../../lib/codemirror"], mod);
  else // Plain browser env
    mod(CodeMirror);
})(function(CodeMirror) {
  "use strict";

  CodeMirror.defineOption("fullScreen", false, function(cm, val, old) {
    if (old == CodeMirror.Init) old = false;
    if (!old == !val) return;
    if (val) setFullscreen(cm);
    else setNormal(cm);
  });

  function setFullscreen(cm) {
    var wrap = cm.getWrapperElement();
    cm.state.fullScreenRestore = {scrollTop: window.pageYOffset, scrollLeft: window.pageXOffset,
                                  width: wrap.style.width, height: wrap.style.height};
    wrap.style.width = "";
    wrap.style.height = "auto";
    wrap.className += " CodeMirror-fullscreen";
    document.documentElement.style.overflow = "hidden";
    cm.refresh();
  }

  function setNormal(cm) {
    var wrap = cm.getWrapperElement();
    wrap.className = wrap.className.replace(/\s*CodeMirror-fullscreen\b/, "");
    document.documentElement.style.overflow = "";
    var info = cm.state.fullScreenRestore;
    wrap.style.width = info.width; wrap.style.height = info.height;
    window.scrollTo(info.scrollLeft, info.scrollTop);
    cm.refresh();
  }
});

},{"codemirror":undefined}],8:[function(require,module,exports){
// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: http://codemirror.net/LICENSE

(function(mod) {
  if (typeof exports == "object" && typeof module == "object") // CommonJS
    mod((function(){try{return require('codemirror')}catch(e){return window.CodeMirror}})());
  else if (typeof define == "function" && define.amd) // AMD
    define(["../../lib/codemirror"], mod);
  else // Plain browser env
    mod(CodeMirror);
})(function(CodeMirror) {
  var ie_lt8 = /MSIE \d/.test(navigator.userAgent) &&
    (document.documentMode == null || document.documentMode < 8);

  var Pos = CodeMirror.Pos;

  var matching = {"(": ")>", ")": "(<", "[": "]>", "]": "[<", "{": "}>", "}": "{<"};

  function findMatchingBracket(cm, where, strict, config) {
    var line = cm.getLineHandle(where.line), pos = where.ch - 1;
    var match = (pos >= 0 && matching[line.text.charAt(pos)]) || matching[line.text.charAt(++pos)];
    if (!match) return null;
    var dir = match.charAt(1) == ">" ? 1 : -1;
    if (strict && (dir > 0) != (pos == where.ch)) return null;
    var style = cm.getTokenTypeAt(Pos(where.line, pos + 1));

    var found = scanForBracket(cm, Pos(where.line, pos + (dir > 0 ? 1 : 0)), dir, style || null, config);
    if (found == null) return null;
    return {from: Pos(where.line, pos), to: found && found.pos,
            match: found && found.ch == match.charAt(0), forward: dir > 0};
  }

  // bracketRegex is used to specify which type of bracket to scan
  // should be a regexp, e.g. /[[\]]/
  //
  // Note: If "where" is on an open bracket, then this bracket is ignored.
  //
  // Returns false when no bracket was found, null when it reached
  // maxScanLines and gave up
  function scanForBracket(cm, where, dir, style, config) {
    var maxScanLen = (config && config.maxScanLineLength) || 10000;
    var maxScanLines = (config && config.maxScanLines) || 1000;

    var stack = [];
    var re = config && config.bracketRegex ? config.bracketRegex : /[(){}[\]]/;
    var lineEnd = dir > 0 ? Math.min(where.line + maxScanLines, cm.lastLine() + 1)
                          : Math.max(cm.firstLine() - 1, where.line - maxScanLines);
    for (var lineNo = where.line; lineNo != lineEnd; lineNo += dir) {
      var line = cm.getLine(lineNo);
      if (!line) continue;
      var pos = dir > 0 ? 0 : line.length - 1, end = dir > 0 ? line.length : -1;
      if (line.length > maxScanLen) continue;
      if (lineNo == where.line) pos = where.ch - (dir < 0 ? 1 : 0);
      for (; pos != end; pos += dir) {
        var ch = line.charAt(pos);
        if (re.test(ch) && (style === undefined || cm.getTokenTypeAt(Pos(lineNo, pos + 1)) == style)) {
          var match = matching[ch];
          if ((match.charAt(1) == ">") == (dir > 0)) stack.push(ch);
          else if (!stack.length) return {pos: Pos(lineNo, pos), ch: ch};
          else stack.pop();
        }
      }
    }
    return lineNo - dir == (dir > 0 ? cm.lastLine() : cm.firstLine()) ? false : null;
  }

  function matchBrackets(cm, autoclear, config) {
    // Disable brace matching in long lines, since it'll cause hugely slow updates
    var maxHighlightLen = cm.state.matchBrackets.maxHighlightLineLength || 1000;
    var marks = [], ranges = cm.listSelections();
    for (var i = 0; i < ranges.length; i++) {
      var match = ranges[i].empty() && findMatchingBracket(cm, ranges[i].head, false, config);
      if (match && cm.getLine(match.from.line).length <= maxHighlightLen) {
        var style = match.match ? "CodeMirror-matchingbracket" : "CodeMirror-nonmatchingbracket";
        marks.push(cm.markText(match.from, Pos(match.from.line, match.from.ch + 1), {className: style}));
        if (match.to && cm.getLine(match.to.line).length <= maxHighlightLen)
          marks.push(cm.markText(match.to, Pos(match.to.line, match.to.ch + 1), {className: style}));
      }
    }

    if (marks.length) {
      // Kludge to work around the IE bug from issue #1193, where text
      // input stops going to the textare whever this fires.
      if (ie_lt8 && cm.state.focused) cm.focus();

      var clear = function() {
        cm.operation(function() {
          for (var i = 0; i < marks.length; i++) marks[i].clear();
        });
      };
      if (autoclear) setTimeout(clear, 800);
      else return clear;
    }
  }

  var currentlyHighlighted = null;
  function doMatchBrackets(cm) {
    cm.operation(function() {
      if (currentlyHighlighted) {currentlyHighlighted(); currentlyHighlighted = null;}
      currentlyHighlighted = matchBrackets(cm, false, cm.state.matchBrackets);
    });
  }

  CodeMirror.defineOption("matchBrackets", false, function(cm, val, old) {
    if (old && old != CodeMirror.Init)
      cm.off("cursorActivity", doMatchBrackets);
    if (val) {
      cm.state.matchBrackets = typeof val == "object" ? val : {};
      cm.on("cursorActivity", doMatchBrackets);
    }
  });

  CodeMirror.defineExtension("matchBrackets", function() {matchBrackets(this, true);});
  CodeMirror.defineExtension("findMatchingBracket", function(pos, strict, config){
    return findMatchingBracket(this, pos, strict, config);
  });
  CodeMirror.defineExtension("scanForBracket", function(pos, dir, style, config){
    return scanForBracket(this, pos, dir, style, config);
  });
});

},{"codemirror":undefined}],9:[function(require,module,exports){
// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: http://codemirror.net/LICENSE

(function(mod) {
  if (typeof exports == "object" && typeof module == "object") // CommonJS
    mod((function(){try{return require('codemirror')}catch(e){return window.CodeMirror}})());
  else if (typeof define == "function" && define.amd) // AMD
    define(["../../lib/codemirror"], mod);
  else // Plain browser env
    mod(CodeMirror);
})(function(CodeMirror) {
"use strict";

CodeMirror.registerHelper("fold", "brace", function(cm, start) {
  var line = start.line, lineText = cm.getLine(line);
  var tokenType;

  function findOpening(openCh) {
    for (var at = start.ch, pass = 0;;) {
      var found = at <= 0 ? -1 : lineText.lastIndexOf(openCh, at - 1);
      if (found == -1) {
        if (pass == 1) break;
        pass = 1;
        at = lineText.length;
        continue;
      }
      if (pass == 1 && found < start.ch) break;
      tokenType = cm.getTokenTypeAt(CodeMirror.Pos(line, found + 1));
      if (!/^(comment|string)/.test(tokenType)) return found + 1;
      at = found - 1;
    }
  }

  var startToken = "{", endToken = "}", startCh = findOpening("{");
  if (startCh == null) {
    startToken = "[", endToken = "]";
    startCh = findOpening("[");
  }

  if (startCh == null) return;
  var count = 1, lastLine = cm.lastLine(), end, endCh;
  outer: for (var i = line; i <= lastLine; ++i) {
    var text = cm.getLine(i), pos = i == line ? startCh : 0;
    for (;;) {
      var nextOpen = text.indexOf(startToken, pos), nextClose = text.indexOf(endToken, pos);
      if (nextOpen < 0) nextOpen = text.length;
      if (nextClose < 0) nextClose = text.length;
      pos = Math.min(nextOpen, nextClose);
      if (pos == text.length) break;
      if (cm.getTokenTypeAt(CodeMirror.Pos(i, pos + 1)) == tokenType) {
        if (pos == nextOpen) ++count;
        else if (!--count) { end = i; endCh = pos; break outer; }
      }
      ++pos;
    }
  }
  if (end == null || line == end && endCh == startCh) return;
  return {from: CodeMirror.Pos(line, startCh),
          to: CodeMirror.Pos(end, endCh)};
});

CodeMirror.registerHelper("fold", "import", function(cm, start) {
  function hasImport(line) {
    if (line < cm.firstLine() || line > cm.lastLine()) return null;
    var start = cm.getTokenAt(CodeMirror.Pos(line, 1));
    if (!/\S/.test(start.string)) start = cm.getTokenAt(CodeMirror.Pos(line, start.end + 1));
    if (start.type != "keyword" || start.string != "import") return null;
    // Now find closing semicolon, return its position
    for (var i = line, e = Math.min(cm.lastLine(), line + 10); i <= e; ++i) {
      var text = cm.getLine(i), semi = text.indexOf(";");
      if (semi != -1) return {startCh: start.end, end: CodeMirror.Pos(i, semi)};
    }
  }

  var startLine = start.line, has = hasImport(startLine), prev;
  if (!has || hasImport(startLine - 1) || ((prev = hasImport(startLine - 2)) && prev.end.line == startLine - 1))
    return null;
  for (var end = has.end;;) {
    var next = hasImport(end.line + 1);
    if (next == null) break;
    end = next.end;
  }
  return {from: cm.clipPos(CodeMirror.Pos(startLine, has.startCh + 1)), to: end};
});

CodeMirror.registerHelper("fold", "include", function(cm, start) {
  function hasInclude(line) {
    if (line < cm.firstLine() || line > cm.lastLine()) return null;
    var start = cm.getTokenAt(CodeMirror.Pos(line, 1));
    if (!/\S/.test(start.string)) start = cm.getTokenAt(CodeMirror.Pos(line, start.end + 1));
    if (start.type == "meta" && start.string.slice(0, 8) == "#include") return start.start + 8;
  }

  var startLine = start.line, has = hasInclude(startLine);
  if (has == null || hasInclude(startLine - 1) != null) return null;
  for (var end = startLine;;) {
    var next = hasInclude(end + 1);
    if (next == null) break;
    ++end;
  }
  return {from: CodeMirror.Pos(startLine, has + 1),
          to: cm.clipPos(CodeMirror.Pos(end))};
});

});

},{"codemirror":undefined}],10:[function(require,module,exports){
// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: http://codemirror.net/LICENSE

(function(mod) {
  if (typeof exports == "object" && typeof module == "object") // CommonJS
    mod((function(){try{return require('codemirror')}catch(e){return window.CodeMirror}})());
  else if (typeof define == "function" && define.amd) // AMD
    define(["../../lib/codemirror"], mod);
  else // Plain browser env
    mod(CodeMirror);
})(function(CodeMirror) {
  "use strict";

  function doFold(cm, pos, options, force) {
    if (options && options.call) {
      var finder = options;
      options = null;
    } else {
      var finder = getOption(cm, options, "rangeFinder");
    }
    if (typeof pos == "number") pos = CodeMirror.Pos(pos, 0);
    var minSize = getOption(cm, options, "minFoldSize");

    function getRange(allowFolded) {
      var range = finder(cm, pos);
      if (!range || range.to.line - range.from.line < minSize) return null;
      var marks = cm.findMarksAt(range.from);
      for (var i = 0; i < marks.length; ++i) {
        if (marks[i].__isFold && force !== "fold") {
          if (!allowFolded) return null;
          range.cleared = true;
          marks[i].clear();
        }
      }
      return range;
    }

    var range = getRange(true);
    if (getOption(cm, options, "scanUp")) while (!range && pos.line > cm.firstLine()) {
      pos = CodeMirror.Pos(pos.line - 1, 0);
      range = getRange(false);
    }
    if (!range || range.cleared || force === "unfold") return;

    var myWidget = makeWidget(cm, options);
    CodeMirror.on(myWidget, "mousedown", function(e) {
      myRange.clear();
      CodeMirror.e_preventDefault(e);
    });
    var myRange = cm.markText(range.from, range.to, {
      replacedWith: myWidget,
      clearOnEnter: getOption(cm, options, "clearOnEnter"),
      __isFold: true
    });
    myRange.on("clear", function(from, to) {
      CodeMirror.signal(cm, "unfold", cm, from, to);
    });
    CodeMirror.signal(cm, "fold", cm, range.from, range.to);
  }

  function makeWidget(cm, options) {
    var widget = getOption(cm, options, "widget");
    if (typeof widget == "string") {
      var text = document.createTextNode(widget);
      widget = document.createElement("span");
      widget.appendChild(text);
      widget.className = "CodeMirror-foldmarker";
    }
    return widget;
  }

  // Clumsy backwards-compatible interface
  CodeMirror.newFoldFunction = function(rangeFinder, widget) {
    return function(cm, pos) { doFold(cm, pos, {rangeFinder: rangeFinder, widget: widget}); };
  };

  // New-style interface
  CodeMirror.defineExtension("foldCode", function(pos, options, force) {
    doFold(this, pos, options, force);
  });

  CodeMirror.defineExtension("isFolded", function(pos) {
    var marks = this.findMarksAt(pos);
    for (var i = 0; i < marks.length; ++i)
      if (marks[i].__isFold) return true;
  });

  CodeMirror.commands.toggleFold = function(cm) {
    cm.foldCode(cm.getCursor());
  };
  CodeMirror.commands.fold = function(cm) {
    cm.foldCode(cm.getCursor(), null, "fold");
  };
  CodeMirror.commands.unfold = function(cm) {
    cm.foldCode(cm.getCursor(), null, "unfold");
  };
  CodeMirror.commands.foldAll = function(cm) {
    cm.operation(function() {
      for (var i = cm.firstLine(), e = cm.lastLine(); i <= e; i++)
        cm.foldCode(CodeMirror.Pos(i, 0), null, "fold");
    });
  };
  CodeMirror.commands.unfoldAll = function(cm) {
    cm.operation(function() {
      for (var i = cm.firstLine(), e = cm.lastLine(); i <= e; i++)
        cm.foldCode(CodeMirror.Pos(i, 0), null, "unfold");
    });
  };

  CodeMirror.registerHelper("fold", "combine", function() {
    var funcs = Array.prototype.slice.call(arguments, 0);
    return function(cm, start) {
      for (var i = 0; i < funcs.length; ++i) {
        var found = funcs[i](cm, start);
        if (found) return found;
      }
    };
  });

  CodeMirror.registerHelper("fold", "auto", function(cm, start) {
    var helpers = cm.getHelpers(start, "fold");
    for (var i = 0; i < helpers.length; i++) {
      var cur = helpers[i](cm, start);
      if (cur) return cur;
    }
  });

  var defaultOptions = {
    rangeFinder: CodeMirror.fold.auto,
    widget: "\u2194",
    minFoldSize: 0,
    scanUp: false,
    clearOnEnter: true
  };

  CodeMirror.defineOption("foldOptions", null);

  function getOption(cm, options, name) {
    if (options && options[name] !== undefined)
      return options[name];
    var editorOptions = cm.options.foldOptions;
    if (editorOptions && editorOptions[name] !== undefined)
      return editorOptions[name];
    return defaultOptions[name];
  }

  CodeMirror.defineExtension("foldOption", function(options, name) {
    return getOption(this, options, name);
  });
});

},{"codemirror":undefined}],11:[function(require,module,exports){
// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: http://codemirror.net/LICENSE

(function(mod) {
  if (typeof exports == "object" && typeof module == "object") // CommonJS
    mod((function(){try{return require('codemirror')}catch(e){return window.CodeMirror}})(), require("./foldcode"));
  else if (typeof define == "function" && define.amd) // AMD
    define(["../../lib/codemirror", "./foldcode"], mod);
  else // Plain browser env
    mod(CodeMirror);
})(function(CodeMirror) {
  "use strict";

  CodeMirror.defineOption("foldGutter", false, function(cm, val, old) {
    if (old && old != CodeMirror.Init) {
      cm.clearGutter(cm.state.foldGutter.options.gutter);
      cm.state.foldGutter = null;
      cm.off("gutterClick", onGutterClick);
      cm.off("change", onChange);
      cm.off("viewportChange", onViewportChange);
      cm.off("fold", onFold);
      cm.off("unfold", onFold);
      cm.off("swapDoc", onChange);
    }
    if (val) {
      cm.state.foldGutter = new State(parseOptions(val));
      updateInViewport(cm);
      cm.on("gutterClick", onGutterClick);
      cm.on("change", onChange);
      cm.on("viewportChange", onViewportChange);
      cm.on("fold", onFold);
      cm.on("unfold", onFold);
      cm.on("swapDoc", onChange);
    }
  });

  var Pos = CodeMirror.Pos;

  function State(options) {
    this.options = options;
    this.from = this.to = 0;
  }

  function parseOptions(opts) {
    if (opts === true) opts = {};
    if (opts.gutter == null) opts.gutter = "CodeMirror-foldgutter";
    if (opts.indicatorOpen == null) opts.indicatorOpen = "CodeMirror-foldgutter-open";
    if (opts.indicatorFolded == null) opts.indicatorFolded = "CodeMirror-foldgutter-folded";
    return opts;
  }

  function isFolded(cm, line) {
    var marks = cm.findMarks(Pos(line, 0), Pos(line + 1, 0));
    for (var i = 0; i < marks.length; ++i)
      if (marks[i].__isFold && marks[i].find().from.line == line) return marks[i];
  }

  function marker(spec) {
    if (typeof spec == "string") {
      var elt = document.createElement("div");
      elt.className = spec + " CodeMirror-guttermarker-subtle";
      return elt;
    } else {
      return spec.cloneNode(true);
    }
  }

  function updateFoldInfo(cm, from, to) {
    var opts = cm.state.foldGutter.options, cur = from;
    var minSize = cm.foldOption(opts, "minFoldSize");
    var func = cm.foldOption(opts, "rangeFinder");
    cm.eachLine(from, to, function(line) {
      var mark = null;
      if (isFolded(cm, cur)) {
        mark = marker(opts.indicatorFolded);
      } else {
        var pos = Pos(cur, 0);
        var range = func && func(cm, pos);
        if (range && range.to.line - range.from.line >= minSize)
          mark = marker(opts.indicatorOpen);
      }
      cm.setGutterMarker(line, opts.gutter, mark);
      ++cur;
    });
  }

  function updateInViewport(cm) {
    var vp = cm.getViewport(), state = cm.state.foldGutter;
    if (!state) return;
    cm.operation(function() {
      updateFoldInfo(cm, vp.from, vp.to);
    });
    state.from = vp.from; state.to = vp.to;
  }

  function onGutterClick(cm, line, gutter) {
    var state = cm.state.foldGutter;
    if (!state) return;
    var opts = state.options;
    if (gutter != opts.gutter) return;
    var folded = isFolded(cm, line);
    if (folded) folded.clear();
    else cm.foldCode(Pos(line, 0), opts.rangeFinder);
  }

  function onChange(cm) {
    var state = cm.state.foldGutter;
    if (!state) return;
    var opts = state.options;
    state.from = state.to = 0;
    clearTimeout(state.changeUpdate);
    state.changeUpdate = setTimeout(function() { updateInViewport(cm); }, opts.foldOnChangeTimeSpan || 600);
  }

  function onViewportChange(cm) {
    var state = cm.state.foldGutter;
    if (!state) return;
    var opts = state.options;
    clearTimeout(state.changeUpdate);
    state.changeUpdate = setTimeout(function() {
      var vp = cm.getViewport();
      if (state.from == state.to || vp.from - state.to > 20 || state.from - vp.to > 20) {
        updateInViewport(cm);
      } else {
        cm.operation(function() {
          if (vp.from < state.from) {
            updateFoldInfo(cm, vp.from, state.from);
            state.from = vp.from;
          }
          if (vp.to > state.to) {
            updateFoldInfo(cm, state.to, vp.to);
            state.to = vp.to;
          }
        });
      }
    }, opts.updateViewportTimeSpan || 400);
  }

  function onFold(cm, from) {
    var state = cm.state.foldGutter;
    if (!state) return;
    var line = from.line;
    if (line >= state.from && line < state.to)
      updateFoldInfo(cm, line, line + 1);
  }
});

},{"./foldcode":10,"codemirror":undefined}],12:[function(require,module,exports){
// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: http://codemirror.net/LICENSE

(function(mod) {
  if (typeof exports == "object" && typeof module == "object") // CommonJS
    mod((function(){try{return require('codemirror')}catch(e){return window.CodeMirror}})());
  else if (typeof define == "function" && define.amd) // AMD
    define(["../../lib/codemirror"], mod);
  else // Plain browser env
    mod(CodeMirror);
})(function(CodeMirror) {
  "use strict";

  var Pos = CodeMirror.Pos;
  function cmp(a, b) { return a.line - b.line || a.ch - b.ch; }

  var nameStartChar = "A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD";
  var nameChar = nameStartChar + "\-\:\.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040";
  var xmlTagStart = new RegExp("<(/?)([" + nameStartChar + "][" + nameChar + "]*)", "g");

  function Iter(cm, line, ch, range) {
    this.line = line; this.ch = ch;
    this.cm = cm; this.text = cm.getLine(line);
    this.min = range ? range.from : cm.firstLine();
    this.max = range ? range.to - 1 : cm.lastLine();
  }

  function tagAt(iter, ch) {
    var type = iter.cm.getTokenTypeAt(Pos(iter.line, ch));
    return type && /\btag\b/.test(type);
  }

  function nextLine(iter) {
    if (iter.line >= iter.max) return;
    iter.ch = 0;
    iter.text = iter.cm.getLine(++iter.line);
    return true;
  }
  function prevLine(iter) {
    if (iter.line <= iter.min) return;
    iter.text = iter.cm.getLine(--iter.line);
    iter.ch = iter.text.length;
    return true;
  }

  function toTagEnd(iter) {
    for (;;) {
      var gt = iter.text.indexOf(">", iter.ch);
      if (gt == -1) { if (nextLine(iter)) continue; else return; }
      if (!tagAt(iter, gt + 1)) { iter.ch = gt + 1; continue; }
      var lastSlash = iter.text.lastIndexOf("/", gt);
      var selfClose = lastSlash > -1 && !/\S/.test(iter.text.slice(lastSlash + 1, gt));
      iter.ch = gt + 1;
      return selfClose ? "selfClose" : "regular";
    }
  }
  function toTagStart(iter) {
    for (;;) {
      var lt = iter.ch ? iter.text.lastIndexOf("<", iter.ch - 1) : -1;
      if (lt == -1) { if (prevLine(iter)) continue; else return; }
      if (!tagAt(iter, lt + 1)) { iter.ch = lt; continue; }
      xmlTagStart.lastIndex = lt;
      iter.ch = lt;
      var match = xmlTagStart.exec(iter.text);
      if (match && match.index == lt) return match;
    }
  }

  function toNextTag(iter) {
    for (;;) {
      xmlTagStart.lastIndex = iter.ch;
      var found = xmlTagStart.exec(iter.text);
      if (!found) { if (nextLine(iter)) continue; else return; }
      if (!tagAt(iter, found.index + 1)) { iter.ch = found.index + 1; continue; }
      iter.ch = found.index + found[0].length;
      return found;
    }
  }
  function toPrevTag(iter) {
    for (;;) {
      var gt = iter.ch ? iter.text.lastIndexOf(">", iter.ch - 1) : -1;
      if (gt == -1) { if (prevLine(iter)) continue; else return; }
      if (!tagAt(iter, gt + 1)) { iter.ch = gt; continue; }
      var lastSlash = iter.text.lastIndexOf("/", gt);
      var selfClose = lastSlash > -1 && !/\S/.test(iter.text.slice(lastSlash + 1, gt));
      iter.ch = gt + 1;
      return selfClose ? "selfClose" : "regular";
    }
  }

  function findMatchingClose(iter, tag) {
    var stack = [];
    for (;;) {
      var next = toNextTag(iter), end, startLine = iter.line, startCh = iter.ch - (next ? next[0].length : 0);
      if (!next || !(end = toTagEnd(iter))) return;
      if (end == "selfClose") continue;
      if (next[1]) { // closing tag
        for (var i = stack.length - 1; i >= 0; --i) if (stack[i] == next[2]) {
          stack.length = i;
          break;
        }
        if (i < 0 && (!tag || tag == next[2])) return {
          tag: next[2],
          from: Pos(startLine, startCh),
          to: Pos(iter.line, iter.ch)
        };
      } else { // opening tag
        stack.push(next[2]);
      }
    }
  }
  function findMatchingOpen(iter, tag) {
    var stack = [];
    for (;;) {
      var prev = toPrevTag(iter);
      if (!prev) return;
      if (prev == "selfClose") { toTagStart(iter); continue; }
      var endLine = iter.line, endCh = iter.ch;
      var start = toTagStart(iter);
      if (!start) return;
      if (start[1]) { // closing tag
        stack.push(start[2]);
      } else { // opening tag
        for (var i = stack.length - 1; i >= 0; --i) if (stack[i] == start[2]) {
          stack.length = i;
          break;
        }
        if (i < 0 && (!tag || tag == start[2])) return {
          tag: start[2],
          from: Pos(iter.line, iter.ch),
          to: Pos(endLine, endCh)
        };
      }
    }
  }

  CodeMirror.registerHelper("fold", "xml", function(cm, start) {
    var iter = new Iter(cm, start.line, 0);
    for (;;) {
      var openTag = toNextTag(iter), end;
      if (!openTag || iter.line != start.line || !(end = toTagEnd(iter))) return;
      if (!openTag[1] && end != "selfClose") {
        var startPos = Pos(iter.line, iter.ch);
        var endPos = findMatchingClose(iter, openTag[2]);
        return endPos && {from: startPos, to: endPos.from};
      }
    }
  });
  CodeMirror.findMatchingTag = function(cm, pos, range) {
    var iter = new Iter(cm, pos.line, pos.ch, range);
    if (iter.text.indexOf(">") == -1 && iter.text.indexOf("<") == -1) return;
    var end = toTagEnd(iter), to = end && Pos(iter.line, iter.ch);
    var start = end && toTagStart(iter);
    if (!end || !start || cmp(iter, pos) > 0) return;
    var here = {from: Pos(iter.line, iter.ch), to: to, tag: start[2]};
    if (end == "selfClose") return {open: here, close: null, at: "open"};

    if (start[1]) { // closing tag
      return {open: findMatchingOpen(iter, start[2]), close: here, at: "close"};
    } else { // opening tag
      iter = new Iter(cm, to.line, to.ch, range);
      return {open: here, close: findMatchingClose(iter, start[2]), at: "open"};
    }
  };

  CodeMirror.findEnclosingTag = function(cm, pos, range) {
    var iter = new Iter(cm, pos.line, pos.ch, range);
    for (;;) {
      var open = findMatchingOpen(iter);
      if (!open) break;
      var forward = new Iter(cm, pos.line, pos.ch, range);
      var close = findMatchingClose(forward, open.tag);
      if (close) return {open: open, close: close};
    }
  };

  // Used by addon/edit/closetag.js
  CodeMirror.scanForClosingTag = function(cm, pos, name, end) {
    var iter = new Iter(cm, pos.line, pos.ch, end ? {from: 0, to: end} : null);
    return findMatchingClose(iter, name);
  };
});

},{"codemirror":undefined}],13:[function(require,module,exports){
// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: http://codemirror.net/LICENSE

(function(mod) {
  if (typeof exports == "object" && typeof module == "object") // CommonJS
    mod((function(){try{return require('codemirror')}catch(e){return window.CodeMirror}})());
  else if (typeof define == "function" && define.amd) // AMD
    define(["../../lib/codemirror"], mod);
  else // Plain browser env
    mod(CodeMirror);
})(function(CodeMirror) {
  "use strict";

  var HINT_ELEMENT_CLASS        = "CodeMirror-hint";
  var ACTIVE_HINT_ELEMENT_CLASS = "CodeMirror-hint-active";

  // This is the old interface, kept around for now to stay
  // backwards-compatible.
  CodeMirror.showHint = function(cm, getHints, options) {
    if (!getHints) return cm.showHint(options);
    if (options && options.async) getHints.async = true;
    var newOpts = {hint: getHints};
    if (options) for (var prop in options) newOpts[prop] = options[prop];
    return cm.showHint(newOpts);
  };

  CodeMirror.defineExtension("showHint", function(options) {
    options = parseOptions(this, this.getCursor("start"), options);
    var selections = this.listSelections()
    if (selections.length > 1) return;
    // By default, don't allow completion when something is selected.
    // A hint function can have a `supportsSelection` property to
    // indicate that it can handle selections.
    if (this.somethingSelected()) {
      if (!options.hint.supportsSelection) return;
      // Don't try with cross-line selections
      for (var i = 0; i < selections.length; i++)
        if (selections[i].head.line != selections[i].anchor.line) return;
    }

    if (this.state.completionActive) this.state.completionActive.close();
    var completion = this.state.completionActive = new Completion(this, options);
    if (!completion.options.hint) return;

    CodeMirror.signal(this, "startCompletion", this);
    completion.update(true);
  });

  function Completion(cm, options) {
    this.cm = cm;
    this.options = options;
    this.widget = null;
    this.debounce = 0;
    this.tick = 0;
    this.startPos = this.cm.getCursor("start");
    this.startLen = this.cm.getLine(this.startPos.line).length - this.cm.getSelection().length;

    var self = this;
    cm.on("cursorActivity", this.activityFunc = function() { self.cursorActivity(); });
  }

  var requestAnimationFrame = window.requestAnimationFrame || function(fn) {
    return setTimeout(fn, 1000/60);
  };
  var cancelAnimationFrame = window.cancelAnimationFrame || clearTimeout;

  Completion.prototype = {
    close: function() {
      if (!this.active()) return;
      this.cm.state.completionActive = null;
      this.tick = null;
      this.cm.off("cursorActivity", this.activityFunc);

      if (this.widget && this.data) CodeMirror.signal(this.data, "close");
      if (this.widget) this.widget.close();
      CodeMirror.signal(this.cm, "endCompletion", this.cm);
    },

    active: function() {
      return this.cm.state.completionActive == this;
    },

    pick: function(data, i) {
      var completion = data.list[i];
      if (completion.hint) completion.hint(this.cm, data, completion);
      else this.cm.replaceRange(getText(completion), completion.from || data.from,
                                completion.to || data.to, "complete");
      CodeMirror.signal(data, "pick", completion);
      this.close();
    },

    cursorActivity: function() {
      if (this.debounce) {
        cancelAnimationFrame(this.debounce);
        this.debounce = 0;
      }

      var pos = this.cm.getCursor(), line = this.cm.getLine(pos.line);
      if (pos.line != this.startPos.line || line.length - pos.ch != this.startLen - this.startPos.ch ||
          pos.ch < this.startPos.ch || this.cm.somethingSelected() ||
          (pos.ch && this.options.closeCharacters.test(line.charAt(pos.ch - 1)))) {
        this.close();
      } else {
        var self = this;
        this.debounce = requestAnimationFrame(function() {self.update();});
        if (this.widget) this.widget.disable();
      }
    },

    update: function(first) {
      if (this.tick == null) return
      var self = this, myTick = ++this.tick
      fetchHints(this.options.hint, this.cm, this.options, function(data) {
        if (self.tick == myTick) self.finishUpdate(data, first)
      })
    },

    finishUpdate: function(data, first) {
      if (this.data) CodeMirror.signal(this.data, "update");

      var picked = (this.widget && this.widget.picked) || (first && this.options.completeSingle);
      if (this.widget) this.widget.close();

      if (data && this.data && isNewCompletion(this.data, data)) return;
      this.data = data;

      if (data && data.list.length) {
        if (picked && data.list.length == 1) {
          this.pick(data, 0);
        } else {
          this.widget = new Widget(this, data);
          CodeMirror.signal(data, "shown");
        }
      }
    }
  };

  function isNewCompletion(old, nw) {
    var moved = CodeMirror.cmpPos(nw.from, old.from)
    return moved > 0 && old.to.ch - old.from.ch != nw.to.ch - nw.from.ch
  }

  function parseOptions(cm, pos, options) {
    var editor = cm.options.hintOptions;
    var out = {};
    for (var prop in defaultOptions) out[prop] = defaultOptions[prop];
    if (editor) for (var prop in editor)
      if (editor[prop] !== undefined) out[prop] = editor[prop];
    if (options) for (var prop in options)
      if (options[prop] !== undefined) out[prop] = options[prop];
    if (out.hint.resolve) out.hint = out.hint.resolve(cm, pos)
    return out;
  }

  function getText(completion) {
    if (typeof completion == "string") return completion;
    else return completion.text;
  }

  function buildKeyMap(completion, handle) {
    var baseMap = {
      Up: function() {handle.moveFocus(-1);},
      Down: function() {handle.moveFocus(1);},
      PageUp: function() {handle.moveFocus(-handle.menuSize() + 1, true);},
      PageDown: function() {handle.moveFocus(handle.menuSize() - 1, true);},
      Home: function() {handle.setFocus(0);},
      End: function() {handle.setFocus(handle.length - 1);},
      Enter: handle.pick,
      Tab: handle.pick,
      Esc: handle.close
    };
    var custom = completion.options.customKeys;
    var ourMap = custom ? {} : baseMap;
    function addBinding(key, val) {
      var bound;
      if (typeof val != "string")
        bound = function(cm) { return val(cm, handle); };
      // This mechanism is deprecated
      else if (baseMap.hasOwnProperty(val))
        bound = baseMap[val];
      else
        bound = val;
      ourMap[key] = bound;
    }
    if (custom)
      for (var key in custom) if (custom.hasOwnProperty(key))
        addBinding(key, custom[key]);
    var extra = completion.options.extraKeys;
    if (extra)
      for (var key in extra) if (extra.hasOwnProperty(key))
        addBinding(key, extra[key]);
    return ourMap;
  }

  function getHintElement(hintsElement, el) {
    while (el && el != hintsElement) {
      if (el.nodeName.toUpperCase() === "LI" && el.parentNode == hintsElement) return el;
      el = el.parentNode;
    }
  }

  function Widget(completion, data) {
    this.completion = completion;
    this.data = data;
    this.picked = false;
    var widget = this, cm = completion.cm;

    var hints = this.hints = document.createElement("ul");
    hints.className = "CodeMirror-hints";
    this.selectedHint = data.selectedHint || 0;

    var completions = data.list;
    for (var i = 0; i < completions.length; ++i) {
      var elt = hints.appendChild(document.createElement("li")), cur = completions[i];
      var className = HINT_ELEMENT_CLASS + (i != this.selectedHint ? "" : " " + ACTIVE_HINT_ELEMENT_CLASS);
      if (cur.className != null) className = cur.className + " " + className;
      elt.className = className;
      if (cur.render) cur.render(elt, data, cur);
      else elt.appendChild(document.createTextNode(cur.displayText || getText(cur)));
      elt.hintId = i;
    }

    var pos = cm.cursorCoords(completion.options.alignWithWord ? data.from : null);
    var left = pos.left, top = pos.bottom, below = true;
    hints.style.left = left + "px";
    hints.style.top = top + "px";
    // If we're at the edge of the screen, then we want the menu to appear on the left of the cursor.
    var winW = window.innerWidth || Math.max(document.body.offsetWidth, document.documentElement.offsetWidth);
    var winH = window.innerHeight || Math.max(document.body.offsetHeight, document.documentElement.offsetHeight);
    (completion.options.container || document.body).appendChild(hints);
    var box = hints.getBoundingClientRect(), overlapY = box.bottom - winH;
    var scrolls = hints.scrollHeight > hints.clientHeight + 1
    var startScroll = cm.getScrollInfo();

    if (overlapY > 0) {
      var height = box.bottom - box.top, curTop = pos.top - (pos.bottom - box.top);
      if (curTop - height > 0) { // Fits above cursor
        hints.style.top = (top = pos.top - height) + "px";
        below = false;
      } else if (height > winH) {
        hints.style.height = (winH - 5) + "px";
        hints.style.top = (top = pos.bottom - box.top) + "px";
        var cursor = cm.getCursor();
        if (data.from.ch != cursor.ch) {
          pos = cm.cursorCoords(cursor);
          hints.style.left = (left = pos.left) + "px";
          box = hints.getBoundingClientRect();
        }
      }
    }
    var overlapX = box.right - winW;
    if (overlapX > 0) {
      if (box.right - box.left > winW) {
        hints.style.width = (winW - 5) + "px";
        overlapX -= (box.right - box.left) - winW;
      }
      hints.style.left = (left = pos.left - overlapX) + "px";
    }
    if (scrolls) for (var node = hints.firstChild; node; node = node.nextSibling)
      node.style.paddingRight = cm.display.nativeBarWidth + "px"

    cm.addKeyMap(this.keyMap = buildKeyMap(completion, {
      moveFocus: function(n, avoidWrap) { widget.changeActive(widget.selectedHint + n, avoidWrap); },
      setFocus: function(n) { widget.changeActive(n); },
      menuSize: function() { return widget.screenAmount(); },
      length: completions.length,
      close: function() { completion.close(); },
      pick: function() { widget.pick(); },
      data: data
    }));

    if (completion.options.closeOnUnfocus) {
      var closingOnBlur;
      cm.on("blur", this.onBlur = function() { closingOnBlur = setTimeout(function() { completion.close(); }, 100); });
      cm.on("focus", this.onFocus = function() { clearTimeout(closingOnBlur); });
    }

    cm.on("scroll", this.onScroll = function() {
      var curScroll = cm.getScrollInfo(), editor = cm.getWrapperElement().getBoundingClientRect();
      var newTop = top + startScroll.top - curScroll.top;
      var point = newTop - (window.pageYOffset || (document.documentElement || document.body).scrollTop);
      if (!below) point += hints.offsetHeight;
      if (point <= editor.top || point >= editor.bottom) return completion.close();
      hints.style.top = newTop + "px";
      hints.style.left = (left + startScroll.left - curScroll.left) + "px";
    });

    CodeMirror.on(hints, "dblclick", function(e) {
      var t = getHintElement(hints, e.target || e.srcElement);
      if (t && t.hintId != null) {widget.changeActive(t.hintId); widget.pick();}
    });

    CodeMirror.on(hints, "click", function(e) {
      var t = getHintElement(hints, e.target || e.srcElement);
      if (t && t.hintId != null) {
        widget.changeActive(t.hintId);
        if (completion.options.completeOnSingleClick) widget.pick();
      }
    });

    CodeMirror.on(hints, "mousedown", function() {
      setTimeout(function(){cm.focus();}, 20);
    });

    CodeMirror.signal(data, "select", completions[0], hints.firstChild);
    return true;
  }

  Widget.prototype = {
    close: function() {
      if (this.completion.widget != this) return;
      this.completion.widget = null;
      this.hints.parentNode.removeChild(this.hints);
      this.completion.cm.removeKeyMap(this.keyMap);

      var cm = this.completion.cm;
      if (this.completion.options.closeOnUnfocus) {
        cm.off("blur", this.onBlur);
        cm.off("focus", this.onFocus);
      }
      cm.off("scroll", this.onScroll);
    },

    disable: function() {
      this.completion.cm.removeKeyMap(this.keyMap);
      var widget = this;
      this.keyMap = {Enter: function() { widget.picked = true; }};
      this.completion.cm.addKeyMap(this.keyMap);
    },

    pick: function() {
      this.completion.pick(this.data, this.selectedHint);
    },

    changeActive: function(i, avoidWrap) {
      if (i >= this.data.list.length)
        i = avoidWrap ? this.data.list.length - 1 : 0;
      else if (i < 0)
        i = avoidWrap ? 0  : this.data.list.length - 1;
      if (this.selectedHint == i) return;
      var node = this.hints.childNodes[this.selectedHint];
      node.className = node.className.replace(" " + ACTIVE_HINT_ELEMENT_CLASS, "");
      node = this.hints.childNodes[this.selectedHint = i];
      node.className += " " + ACTIVE_HINT_ELEMENT_CLASS;
      if (node.offsetTop < this.hints.scrollTop)
        this.hints.scrollTop = node.offsetTop - 3;
      else if (node.offsetTop + node.offsetHeight > this.hints.scrollTop + this.hints.clientHeight)
        this.hints.scrollTop = node.offsetTop + node.offsetHeight - this.hints.clientHeight + 3;
      CodeMirror.signal(this.data, "select", this.data.list[this.selectedHint], node);
    },

    screenAmount: function() {
      return Math.floor(this.hints.clientHeight / this.hints.firstChild.offsetHeight) || 1;
    }
  };

  function applicableHelpers(cm, helpers) {
    if (!cm.somethingSelected()) return helpers
    var result = []
    for (var i = 0; i < helpers.length; i++)
      if (helpers[i].supportsSelection) result.push(helpers[i])
    return result
  }

  function fetchHints(hint, cm, options, callback) {
    if (hint.async) {
      hint(cm, callback, options)
    } else {
      var result = hint(cm, options)
      if (result && result.then) result.then(callback)
      else callback(result)
    }
  }

  function resolveAutoHints(cm, pos) {
    var helpers = cm.getHelpers(pos, "hint"), words
    if (helpers.length) {
      var resolved = function(cm, callback, options) {
        var app = applicableHelpers(cm, helpers);
        function run(i) {
          if (i == app.length) return callback(null)
          fetchHints(app[i], cm, options, function(result) {
            if (result && result.list.length > 0) callback(result)
            else run(i + 1)
          })
        }
        run(0)
      }
      resolved.async = true
      resolved.supportsSelection = true
      return resolved
    } else if (words = cm.getHelper(cm.getCursor(), "hintWords")) {
      return function(cm) { return CodeMirror.hint.fromList(cm, {words: words}) }
    } else if (CodeMirror.hint.anyword) {
      return function(cm, options) { return CodeMirror.hint.anyword(cm, options) }
    } else {
      return function() {}
    }
  }

  CodeMirror.registerHelper("hint", "auto", {
    resolve: resolveAutoHints
  });

  CodeMirror.registerHelper("hint", "fromList", function(cm, options) {
    var cur = cm.getCursor(), token = cm.getTokenAt(cur);
    var to = CodeMirror.Pos(cur.line, token.end);
    if (token.string && /\w/.test(token.string[token.string.length - 1])) {
      var term = token.string, from = CodeMirror.Pos(cur.line, token.start);
    } else {
      var term = "", from = to;
    }
    var found = [];
    for (var i = 0; i < options.words.length; i++) {
      var word = options.words[i];
      if (word.slice(0, term.length) == term)
        found.push(word);
    }

    if (found.length) return {list: found, from: from, to: to};
  });

  CodeMirror.commands.autocomplete = CodeMirror.showHint;

  var defaultOptions = {
    hint: CodeMirror.hint.auto,
    completeSingle: true,
    alignWithWord: true,
    closeCharacters: /[\s()\[\]{};:>,]/,
    closeOnUnfocus: true,
    completeOnSingleClick: true,
    container: null,
    customKeys: null,
    extraKeys: null
  };

  CodeMirror.defineOption("hintOptions", null);
});

},{"codemirror":undefined}],14:[function(require,module,exports){
// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: http://codemirror.net/LICENSE

(function(mod) {
  if (typeof exports == "object" && typeof module == "object") // CommonJS
    mod((function(){try{return require('codemirror')}catch(e){return window.CodeMirror}})());
  else if (typeof define == "function" && define.amd) // AMD
    define(["../../lib/codemirror"], mod);
  else // Plain browser env
    mod(CodeMirror);
})(function(CodeMirror) {
"use strict";

CodeMirror.runMode = function(string, modespec, callback, options) {
  var mode = CodeMirror.getMode(CodeMirror.defaults, modespec);
  var ie = /MSIE \d/.test(navigator.userAgent);
  var ie_lt9 = ie && (document.documentMode == null || document.documentMode < 9);

  if (callback.appendChild) {
    var tabSize = (options && options.tabSize) || CodeMirror.defaults.tabSize;
    var node = callback, col = 0;
    node.innerHTML = "";
    callback = function(text, style) {
      if (text == "\n") {
        // Emitting LF or CRLF on IE8 or earlier results in an incorrect display.
        // Emitting a carriage return makes everything ok.
        node.appendChild(document.createTextNode(ie_lt9 ? '\r' : text));
        col = 0;
        return;
      }
      var content = "";
      // replace tabs
      for (var pos = 0;;) {
        var idx = text.indexOf("\t", pos);
        if (idx == -1) {
          content += text.slice(pos);
          col += text.length - pos;
          break;
        } else {
          col += idx - pos;
          content += text.slice(pos, idx);
          var size = tabSize - col % tabSize;
          col += size;
          for (var i = 0; i < size; ++i) content += " ";
          pos = idx + 1;
        }
      }

      if (style) {
        var sp = node.appendChild(document.createElement("span"));
        sp.className = "cm-" + style.replace(/ +/g, " cm-");
        sp.appendChild(document.createTextNode(content));
      } else {
        node.appendChild(document.createTextNode(content));
      }
    };
  }

  var lines = CodeMirror.splitLines(string), state = (options && options.state) || CodeMirror.startState(mode);
  for (var i = 0, e = lines.length; i < e; ++i) {
    if (i) callback("\n");
    var stream = new CodeMirror.StringStream(lines[i]);
    if (!stream.string && mode.blankLine) mode.blankLine(state);
    while (!stream.eol()) {
      var style = mode.token(stream, state);
      callback(stream.current(), style, i, stream.start, state);
      stream.start = stream.pos;
    }
  }
};

});

},{"codemirror":undefined}],15:[function(require,module,exports){
// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: http://codemirror.net/LICENSE

(function(mod) {
  if (typeof exports == "object" && typeof module == "object") // CommonJS
    mod((function(){try{return require('codemirror')}catch(e){return window.CodeMirror}})());
  else if (typeof define == "function" && define.amd) // AMD
    define(["../../lib/codemirror"], mod);
  else // Plain browser env
    mod(CodeMirror);
})(function(CodeMirror) {
  "use strict";
  var Pos = CodeMirror.Pos;

  function SearchCursor(doc, query, pos, caseFold) {
    this.atOccurrence = false; this.doc = doc;
    if (caseFold == null && typeof query == "string") caseFold = false;

    pos = pos ? doc.clipPos(pos) : Pos(0, 0);
    this.pos = {from: pos, to: pos};

    // The matches method is filled in based on the type of query.
    // It takes a position and a direction, and returns an object
    // describing the next occurrence of the query, or null if no
    // more matches were found.
    if (typeof query != "string") { // Regexp match
      if (!query.global) query = new RegExp(query.source, query.ignoreCase ? "ig" : "g");
      this.matches = function(reverse, pos) {
        if (reverse) {
          query.lastIndex = 0;
          var line = doc.getLine(pos.line).slice(0, pos.ch), cutOff = 0, match, start;
          for (;;) {
            query.lastIndex = cutOff;
            var newMatch = query.exec(line);
            if (!newMatch) break;
            match = newMatch;
            start = match.index;
            cutOff = match.index + (match[0].length || 1);
            if (cutOff == line.length) break;
          }
          var matchLen = (match && match[0].length) || 0;
          if (!matchLen) {
            if (start == 0 && line.length == 0) {match = undefined;}
            else if (start != doc.getLine(pos.line).length) {
              matchLen++;
            }
          }
        } else {
          query.lastIndex = pos.ch;
          var line = doc.getLine(pos.line), match = query.exec(line);
          var matchLen = (match && match[0].length) || 0;
          var start = match && match.index;
          if (start + matchLen != line.length && !matchLen) matchLen = 1;
        }
        if (match && matchLen)
          return {from: Pos(pos.line, start),
                  to: Pos(pos.line, start + matchLen),
                  match: match};
      };
    } else { // String query
      var origQuery = query;
      if (caseFold) query = query.toLowerCase();
      var fold = caseFold ? function(str){return str.toLowerCase();} : function(str){return str;};
      var target = query.split("\n");
      // Different methods for single-line and multi-line queries
      if (target.length == 1) {
        if (!query.length) {
          // Empty string would match anything and never progress, so
          // we define it to match nothing instead.
          this.matches = function() {};
        } else {
          this.matches = function(reverse, pos) {
            if (reverse) {
              var orig = doc.getLine(pos.line).slice(0, pos.ch), line = fold(orig);
              var match = line.lastIndexOf(query);
              if (match > -1) {
                match = adjustPos(orig, line, match);
                return {from: Pos(pos.line, match), to: Pos(pos.line, match + origQuery.length)};
              }
             } else {
               var orig = doc.getLine(pos.line).slice(pos.ch), line = fold(orig);
               var match = line.indexOf(query);
               if (match > -1) {
                 match = adjustPos(orig, line, match) + pos.ch;
                 return {from: Pos(pos.line, match), to: Pos(pos.line, match + origQuery.length)};
               }
            }
          };
        }
      } else {
        var origTarget = origQuery.split("\n");
        this.matches = function(reverse, pos) {
          var last = target.length - 1;
          if (reverse) {
            if (pos.line - (target.length - 1) < doc.firstLine()) return;
            if (fold(doc.getLine(pos.line).slice(0, origTarget[last].length)) != target[target.length - 1]) return;
            var to = Pos(pos.line, origTarget[last].length);
            for (var ln = pos.line - 1, i = last - 1; i >= 1; --i, --ln)
              if (target[i] != fold(doc.getLine(ln))) return;
            var line = doc.getLine(ln), cut = line.length - origTarget[0].length;
            if (fold(line.slice(cut)) != target[0]) return;
            return {from: Pos(ln, cut), to: to};
          } else {
            if (pos.line + (target.length - 1) > doc.lastLine()) return;
            var line = doc.getLine(pos.line), cut = line.length - origTarget[0].length;
            if (fold(line.slice(cut)) != target[0]) return;
            var from = Pos(pos.line, cut);
            for (var ln = pos.line + 1, i = 1; i < last; ++i, ++ln)
              if (target[i] != fold(doc.getLine(ln))) return;
            if (fold(doc.getLine(ln).slice(0, origTarget[last].length)) != target[last]) return;
            return {from: from, to: Pos(ln, origTarget[last].length)};
          }
        };
      }
    }
  }

  SearchCursor.prototype = {
    findNext: function() {return this.find(false);},
    findPrevious: function() {return this.find(true);},

    find: function(reverse) {
      var self = this, pos = this.doc.clipPos(reverse ? this.pos.from : this.pos.to);
      function savePosAndFail(line) {
        var pos = Pos(line, 0);
        self.pos = {from: pos, to: pos};
        self.atOccurrence = false;
        return false;
      }

      for (;;) {
        if (this.pos = this.matches(reverse, pos)) {
          this.atOccurrence = true;
          return this.pos.match || true;
        }
        if (reverse) {
          if (!pos.line) return savePosAndFail(0);
          pos = Pos(pos.line-1, this.doc.getLine(pos.line-1).length);
        }
        else {
          var maxLine = this.doc.lineCount();
          if (pos.line == maxLine - 1) return savePosAndFail(maxLine);
          pos = Pos(pos.line + 1, 0);
        }
      }
    },

    from: function() {if (this.atOccurrence) return this.pos.from;},
    to: function() {if (this.atOccurrence) return this.pos.to;},

    replace: function(newText, origin) {
      if (!this.atOccurrence) return;
      var lines = CodeMirror.splitLines(newText);
      this.doc.replaceRange(lines, this.pos.from, this.pos.to, origin);
      this.pos.to = Pos(this.pos.from.line + lines.length - 1,
                        lines[lines.length - 1].length + (lines.length == 1 ? this.pos.from.ch : 0));
    }
  };

  // Maps a position in a case-folded line back to a position in the original line
  // (compensating for codepoints increasing in number during folding)
  function adjustPos(orig, folded, pos) {
    if (orig.length == folded.length) return pos;
    for (var pos1 = Math.min(pos, orig.length);;) {
      var len1 = orig.slice(0, pos1).toLowerCase().length;
      if (len1 < pos) ++pos1;
      else if (len1 > pos) --pos1;
      else return pos1;
    }
  }

  CodeMirror.defineExtension("getSearchCursor", function(query, pos, caseFold) {
    return new SearchCursor(this.doc, query, pos, caseFold);
  });
  CodeMirror.defineDocExtension("getSearchCursor", function(query, pos, caseFold) {
    return new SearchCursor(this, query, pos, caseFold);
  });

  CodeMirror.defineExtension("selectMatches", function(query, caseFold) {
    var ranges = [];
    var cur = this.getSearchCursor(query, this.getCursor("from"), caseFold);
    while (cur.findNext()) {
      if (CodeMirror.cmpPos(cur.to(), this.getCursor("to")) > 0) break;
      ranges.push({anchor: cur.from(), head: cur.to()});
    }
    if (ranges.length)
      this.setSelections(ranges, 0);
  });
});

},{"codemirror":undefined}],16:[function(require,module,exports){
var DOCUMENT_NODE_TYPE = 9;

/**
 * A polyfill for Element.matches()
 */
if (typeof Element !== 'undefined' && !Element.prototype.matches) {
    var proto = Element.prototype;

    proto.matches = proto.matchesSelector ||
                    proto.mozMatchesSelector ||
                    proto.msMatchesSelector ||
                    proto.oMatchesSelector ||
                    proto.webkitMatchesSelector;
}

/**
 * Finds the closest parent that matches a selector.
 *
 * @param {Element} element
 * @param {String} selector
 * @return {Function}
 */
function closest (element, selector) {
    while (element && element.nodeType !== DOCUMENT_NODE_TYPE) {
        if (typeof element.matches === 'function' &&
            element.matches(selector)) {
          return element;
        }
        element = element.parentNode;
    }
}

module.exports = closest;

},{}],17:[function(require,module,exports){
var closest = require('./closest');

/**
 * Delegates event to a selector.
 *
 * @param {Element} element
 * @param {String} selector
 * @param {String} type
 * @param {Function} callback
 * @param {Boolean} useCapture
 * @return {Object}
 */
function _delegate(element, selector, type, callback, useCapture) {
    var listenerFn = listener.apply(this, arguments);

    element.addEventListener(type, listenerFn, useCapture);

    return {
        destroy: function() {
            element.removeEventListener(type, listenerFn, useCapture);
        }
    }
}

/**
 * Delegates event to a selector.
 *
 * @param {Element|String|Array} [elements]
 * @param {String} selector
 * @param {String} type
 * @param {Function} callback
 * @param {Boolean} useCapture
 * @return {Object}
 */
function delegate(elements, selector, type, callback, useCapture) {
    // Handle the regular Element usage
    if (typeof elements.addEventListener === 'function') {
        return _delegate.apply(null, arguments);
    }

    // Handle Element-less usage, it defaults to global delegation
    if (typeof type === 'function') {
        // Use `document` as the first parameter, then apply arguments
        // This is a short way to .unshift `arguments` without running into deoptimizations
        return _delegate.bind(null, document).apply(null, arguments);
    }

    // Handle Selector-based usage
    if (typeof elements === 'string') {
        elements = document.querySelectorAll(elements);
    }

    // Handle Array-like based usage
    return Array.prototype.map.call(elements, function (element) {
        return _delegate(element, selector, type, callback, useCapture);
    });
}

/**
 * Finds closest match and invokes callback.
 *
 * @param {Element} element
 * @param {String} selector
 * @param {String} type
 * @param {Function} callback
 * @return {Function}
 */
function listener(element, selector, type, callback) {
    return function(e) {
        e.delegateTarget = closest(e.target, selector);

        if (e.delegateTarget) {
            callback.call(element, e);
        }
    }
}

module.exports = delegate;

},{"./closest":16}],18:[function(require,module,exports){
/**
 * Check if argument is a HTML element.
 *
 * @param {Object} value
 * @return {Boolean}
 */
exports.node = function(value) {
    return value !== undefined
        && value instanceof HTMLElement
        && value.nodeType === 1;
};

/**
 * Check if argument is a list of HTML elements.
 *
 * @param {Object} value
 * @return {Boolean}
 */
exports.nodeList = function(value) {
    var type = Object.prototype.toString.call(value);

    return value !== undefined
        && (type === '[object NodeList]' || type === '[object HTMLCollection]')
        && ('length' in value)
        && (value.length === 0 || exports.node(value[0]));
};

/**
 * Check if argument is a string.
 *
 * @param {Object} value
 * @return {Boolean}
 */
exports.string = function(value) {
    return typeof value === 'string'
        || value instanceof String;
};

/**
 * Check if argument is a function.
 *
 * @param {Object} value
 * @return {Boolean}
 */
exports.fn = function(value) {
    var type = Object.prototype.toString.call(value);

    return type === '[object Function]';
};

},{}],19:[function(require,module,exports){
var is = require('./is');
var delegate = require('delegate');

/**
 * Validates all params and calls the right
 * listener function based on its target type.
 *
 * @param {String|HTMLElement|HTMLCollection|NodeList} target
 * @param {String} type
 * @param {Function} callback
 * @return {Object}
 */
function listen(target, type, callback) {
    if (!target && !type && !callback) {
        throw new Error('Missing required arguments');
    }

    if (!is.string(type)) {
        throw new TypeError('Second argument must be a String');
    }

    if (!is.fn(callback)) {
        throw new TypeError('Third argument must be a Function');
    }

    if (is.node(target)) {
        return listenNode(target, type, callback);
    }
    else if (is.nodeList(target)) {
        return listenNodeList(target, type, callback);
    }
    else if (is.string(target)) {
        return listenSelector(target, type, callback);
    }
    else {
        throw new TypeError('First argument must be a String, HTMLElement, HTMLCollection, or NodeList');
    }
}

/**
 * Adds an event listener to a HTML element
 * and returns a remove listener function.
 *
 * @param {HTMLElement} node
 * @param {String} type
 * @param {Function} callback
 * @return {Object}
 */
function listenNode(node, type, callback) {
    node.addEventListener(type, callback);

    return {
        destroy: function() {
            node.removeEventListener(type, callback);
        }
    }
}

/**
 * Add an event listener to a list of HTML elements
 * and returns a remove listener function.
 *
 * @param {NodeList|HTMLCollection} nodeList
 * @param {String} type
 * @param {Function} callback
 * @return {Object}
 */
function listenNodeList(nodeList, type, callback) {
    Array.prototype.forEach.call(nodeList, function(node) {
        node.addEventListener(type, callback);
    });

    return {
        destroy: function() {
            Array.prototype.forEach.call(nodeList, function(node) {
                node.removeEventListener(type, callback);
            });
        }
    }
}

/**
 * Add an event listener to a selector
 * and returns a remove listener function.
 *
 * @param {String} selector
 * @param {String} type
 * @param {Function} callback
 * @return {Object}
 */
function listenSelector(selector, type, callback) {
    return delegate(document.body, selector, type, callback);
}

module.exports = listen;

},{"./is":18,"delegate":17}],20:[function(require,module,exports){
function select(element) {
    var selectedText;

    if (element.nodeName === 'SELECT') {
        element.focus();

        selectedText = element.value;
    }
    else if (element.nodeName === 'INPUT' || element.nodeName === 'TEXTAREA') {
        var isReadOnly = element.hasAttribute('readonly');

        if (!isReadOnly) {
            element.setAttribute('readonly', '');
        }

        element.select();
        element.setSelectionRange(0, element.value.length);

        if (!isReadOnly) {
            element.removeAttribute('readonly');
        }

        selectedText = element.value;
    }
    else {
        if (element.hasAttribute('contenteditable')) {
            element.focus();
        }

        var selection = window.getSelection();
        var range = document.createRange();

        range.selectNodeContents(element);
        selection.removeAllRanges();
        selection.addRange(range);

        selectedText = selection.toString();
    }

    return selectedText;
}

module.exports = select;

},{}],21:[function(require,module,exports){
var engine = require('../src/store-engine')

var storages = require('../storages/all')
var plugins = [require('../plugins/json2')]

module.exports = engine.createStore(storages, plugins)

},{"../plugins/json2":22,"../src/store-engine":24,"../storages/all":26}],22:[function(require,module,exports){
module.exports = json2Plugin

function json2Plugin() {
	require('./lib/json2')
	return {}
}

},{"./lib/json2":23}],23:[function(require,module,exports){
/* eslint-disable */

//  json2.js
//  2016-10-28
//  Public Domain.
//  NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
//  See http://www.JSON.org/js.html
//  This code should be minified before deployment.
//  See http://javascript.crockford.com/jsmin.html

//  USE YOUR OWN COPY. IT IS EXTREMELY UNWISE TO LOAD CODE FROM SERVERS YOU DO
//  NOT CONTROL.

//  This file creates a global JSON object containing two methods: stringify
//  and parse. This file provides the ES5 JSON capability to ES3 systems.
//  If a project might run on IE8 or earlier, then this file should be included.
//  This file does nothing on ES5 systems.

//      JSON.stringify(value, replacer, space)
//          value       any JavaScript value, usually an object or array.
//          replacer    an optional parameter that determines how object
//                      values are stringified for objects. It can be a
//                      function or an array of strings.
//          space       an optional parameter that specifies the indentation
//                      of nested structures. If it is omitted, the text will
//                      be packed without extra whitespace. If it is a number,
//                      it will specify the number of spaces to indent at each
//                      level. If it is a string (such as "\t" or "&nbsp;"),
//                      it contains the characters used to indent at each level.
//          This method produces a JSON text from a JavaScript value.
//          When an object value is found, if the object contains a toJSON
//          method, its toJSON method will be called and the result will be
//          stringified. A toJSON method does not serialize: it returns the
//          value represented by the name/value pair that should be serialized,
//          or undefined if nothing should be serialized. The toJSON method
//          will be passed the key associated with the value, and this will be
//          bound to the value.

//          For example, this would serialize Dates as ISO strings.

//              Date.prototype.toJSON = function (key) {
//                  function f(n) {
//                      // Format integers to have at least two digits.
//                      return (n < 10)
//                          ? "0" + n
//                          : n;
//                  }
//                  return this.getUTCFullYear()   + "-" +
//                       f(this.getUTCMonth() + 1) + "-" +
//                       f(this.getUTCDate())      + "T" +
//                       f(this.getUTCHours())     + ":" +
//                       f(this.getUTCMinutes())   + ":" +
//                       f(this.getUTCSeconds())   + "Z";
//              };

//          You can provide an optional replacer method. It will be passed the
//          key and value of each member, with this bound to the containing
//          object. The value that is returned from your method will be
//          serialized. If your method returns undefined, then the member will
//          be excluded from the serialization.

//          If the replacer parameter is an array of strings, then it will be
//          used to select the members to be serialized. It filters the results
//          such that only members with keys listed in the replacer array are
//          stringified.

//          Values that do not have JSON representations, such as undefined or
//          functions, will not be serialized. Such values in objects will be
//          dropped; in arrays they will be replaced with null. You can use
//          a replacer function to replace those with JSON values.

//          JSON.stringify(undefined) returns undefined.

//          The optional space parameter produces a stringification of the
//          value that is filled with line breaks and indentation to make it
//          easier to read.

//          If the space parameter is a non-empty string, then that string will
//          be used for indentation. If the space parameter is a number, then
//          the indentation will be that many spaces.

//          Example:

//          text = JSON.stringify(["e", {pluribus: "unum"}]);
//          // text is '["e",{"pluribus":"unum"}]'

//          text = JSON.stringify(["e", {pluribus: "unum"}], null, "\t");
//          // text is '[\n\t"e",\n\t{\n\t\t"pluribus": "unum"\n\t}\n]'

//          text = JSON.stringify([new Date()], function (key, value) {
//              return this[key] instanceof Date
//                  ? "Date(" + this[key] + ")"
//                  : value;
//          });
//          // text is '["Date(---current time---)"]'

//      JSON.parse(text, reviver)
//          This method parses a JSON text to produce an object or array.
//          It can throw a SyntaxError exception.

//          The optional reviver parameter is a function that can filter and
//          transform the results. It receives each of the keys and values,
//          and its return value is used instead of the original value.
//          If it returns what it received, then the structure is not modified.
//          If it returns undefined then the member is deleted.

//          Example:

//          // Parse the text. Values that look like ISO date strings will
//          // be converted to Date objects.

//          myData = JSON.parse(text, function (key, value) {
//              var a;
//              if (typeof value === "string") {
//                  a =
//   /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
//                  if (a) {
//                      return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4],
//                          +a[5], +a[6]));
//                  }
//              }
//              return value;
//          });

//          myData = JSON.parse('["Date(09/09/2001)"]', function (key, value) {
//              var d;
//              if (typeof value === "string" &&
//                      value.slice(0, 5) === "Date(" &&
//                      value.slice(-1) === ")") {
//                  d = new Date(value.slice(5, -1));
//                  if (d) {
//                      return d;
//                  }
//              }
//              return value;
//          });

//  This is a reference implementation. You are free to copy, modify, or
//  redistribute.

/*jslint
    eval, for, this
*/

/*property
    JSON, apply, call, charCodeAt, getUTCDate, getUTCFullYear, getUTCHours,
    getUTCMinutes, getUTCMonth, getUTCSeconds, hasOwnProperty, join,
    lastIndex, length, parse, prototype, push, replace, slice, stringify,
    test, toJSON, toString, valueOf
*/


// Create a JSON object only if one does not already exist. We create the
// methods in a closure to avoid creating global variables.

if (typeof JSON !== "object") {
    JSON = {};
}

(function () {
    "use strict";

    var rx_one = /^[\],:{}\s]*$/;
    var rx_two = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g;
    var rx_three = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g;
    var rx_four = /(?:^|:|,)(?:\s*\[)+/g;
    var rx_escapable = /[\\"\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
    var rx_dangerous = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;

    function f(n) {
        // Format integers to have at least two digits.
        return n < 10
            ? "0" + n
            : n;
    }

    function this_value() {
        return this.valueOf();
    }

    if (typeof Date.prototype.toJSON !== "function") {

        Date.prototype.toJSON = function () {

            return isFinite(this.valueOf())
                ? this.getUTCFullYear() + "-" +
                        f(this.getUTCMonth() + 1) + "-" +
                        f(this.getUTCDate()) + "T" +
                        f(this.getUTCHours()) + ":" +
                        f(this.getUTCMinutes()) + ":" +
                        f(this.getUTCSeconds()) + "Z"
                : null;
        };

        Boolean.prototype.toJSON = this_value;
        Number.prototype.toJSON = this_value;
        String.prototype.toJSON = this_value;
    }

    var gap;
    var indent;
    var meta;
    var rep;


    function quote(string) {

// If the string contains no control characters, no quote characters, and no
// backslash characters, then we can safely slap some quotes around it.
// Otherwise we must also replace the offending characters with safe escape
// sequences.

        rx_escapable.lastIndex = 0;
        return rx_escapable.test(string)
            ? "\"" + string.replace(rx_escapable, function (a) {
                var c = meta[a];
                return typeof c === "string"
                    ? c
                    : "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4);
            }) + "\""
            : "\"" + string + "\"";
    }


    function str(key, holder) {

// Produce a string from holder[key].

        var i;          // The loop counter.
        var k;          // The member key.
        var v;          // The member value.
        var length;
        var mind = gap;
        var partial;
        var value = holder[key];

// If the value has a toJSON method, call it to obtain a replacement value.

        if (value && typeof value === "object" &&
                typeof value.toJSON === "function") {
            value = value.toJSON(key);
        }

// If we were called with a replacer function, then call the replacer to
// obtain a replacement value.

        if (typeof rep === "function") {
            value = rep.call(holder, key, value);
        }

// What happens next depends on the value's type.

        switch (typeof value) {
        case "string":
            return quote(value);

        case "number":

// JSON numbers must be finite. Encode non-finite numbers as null.

            return isFinite(value)
                ? String(value)
                : "null";

        case "boolean":
        case "null":

// If the value is a boolean or null, convert it to a string. Note:
// typeof null does not produce "null". The case is included here in
// the remote chance that this gets fixed someday.

            return String(value);

// If the type is "object", we might be dealing with an object or an array or
// null.

        case "object":

// Due to a specification blunder in ECMAScript, typeof null is "object",
// so watch out for that case.

            if (!value) {
                return "null";
            }

// Make an array to hold the partial results of stringifying this object value.

            gap += indent;
            partial = [];

// Is the value an array?

            if (Object.prototype.toString.apply(value) === "[object Array]") {

// The value is an array. Stringify every element. Use null as a placeholder
// for non-JSON values.

                length = value.length;
                for (i = 0; i < length; i += 1) {
                    partial[i] = str(i, value) || "null";
                }

// Join all of the elements together, separated with commas, and wrap them in
// brackets.

                v = partial.length === 0
                    ? "[]"
                    : gap
                        ? "[\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "]"
                        : "[" + partial.join(",") + "]";
                gap = mind;
                return v;
            }

// If the replacer is an array, use it to select the members to be stringified.

            if (rep && typeof rep === "object") {
                length = rep.length;
                for (i = 0; i < length; i += 1) {
                    if (typeof rep[i] === "string") {
                        k = rep[i];
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (
                                gap
                                    ? ": "
                                    : ":"
                            ) + v);
                        }
                    }
                }
            } else {

// Otherwise, iterate through all of the keys in the object.

                for (k in value) {
                    if (Object.prototype.hasOwnProperty.call(value, k)) {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (
                                gap
                                    ? ": "
                                    : ":"
                            ) + v);
                        }
                    }
                }
            }

// Join all of the member texts together, separated with commas,
// and wrap them in braces.

            v = partial.length === 0
                ? "{}"
                : gap
                    ? "{\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "}"
                    : "{" + partial.join(",") + "}";
            gap = mind;
            return v;
        }
    }

// If the JSON object does not yet have a stringify method, give it one.

    if (typeof JSON.stringify !== "function") {
        meta = {    // table of character substitutions
            "\b": "\\b",
            "\t": "\\t",
            "\n": "\\n",
            "\f": "\\f",
            "\r": "\\r",
            "\"": "\\\"",
            "\\": "\\\\"
        };
        JSON.stringify = function (value, replacer, space) {

// The stringify method takes a value and an optional replacer, and an optional
// space parameter, and returns a JSON text. The replacer can be a function
// that can replace values, or an array of strings that will select the keys.
// A default replacer method can be provided. Use of the space parameter can
// produce text that is more easily readable.

            var i;
            gap = "";
            indent = "";

// If the space parameter is a number, make an indent string containing that
// many spaces.

            if (typeof space === "number") {
                for (i = 0; i < space; i += 1) {
                    indent += " ";
                }

// If the space parameter is a string, it will be used as the indent string.

            } else if (typeof space === "string") {
                indent = space;
            }

// If there is a replacer, it must be a function or an array.
// Otherwise, throw an error.

            rep = replacer;
            if (replacer && typeof replacer !== "function" &&
                    (typeof replacer !== "object" ||
                    typeof replacer.length !== "number")) {
                throw new Error("JSON.stringify");
            }

// Make a fake root object containing our value under the key of "".
// Return the result of stringifying the value.

            return str("", {"": value});
        };
    }


// If the JSON object does not yet have a parse method, give it one.

    if (typeof JSON.parse !== "function") {
        JSON.parse = function (text, reviver) {

// The parse method takes a text and an optional reviver function, and returns
// a JavaScript value if the text is a valid JSON text.

            var j;

            function walk(holder, key) {

// The walk method is used to recursively walk the resulting structure so
// that modifications can be made.

                var k;
                var v;
                var value = holder[key];
                if (value && typeof value === "object") {
                    for (k in value) {
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }


// Parsing happens in four stages. In the first stage, we replace certain
// Unicode characters with escape sequences. JavaScript handles many characters
// incorrectly, either silently deleting them, or treating them as line endings.

            text = String(text);
            rx_dangerous.lastIndex = 0;
            if (rx_dangerous.test(text)) {
                text = text.replace(rx_dangerous, function (a) {
                    return "\\u" +
                            ("0000" + a.charCodeAt(0).toString(16)).slice(-4);
                });
            }

// In the second stage, we run the text against regular expressions that look
// for non-JSON patterns. We are especially concerned with "()" and "new"
// because they can cause invocation, and "=" because it can cause mutation.
// But just to be safe, we want to reject all unexpected forms.

// We split the second stage into 4 regexp operations in order to work around
// crippling inefficiencies in IE's and Safari's regexp engines. First we
// replace the JSON backslash pairs with "@" (a non-JSON character). Second, we
// replace all simple value tokens with "]" characters. Third, we delete all
// open brackets that follow a colon or comma or that begin the text. Finally,
// we look to see that the remaining characters are only whitespace or "]" or
// "," or ":" or "{" or "}". If that is so, then the text is safe for eval.

            if (
                rx_one.test(
                    text
                        .replace(rx_two, "@")
                        .replace(rx_three, "]")
                        .replace(rx_four, "")
                )
            ) {

// In the third stage we use the eval function to compile the text into a
// JavaScript structure. The "{" operator is subject to a syntactic ambiguity
// in JavaScript: it can begin a block or an object literal. We wrap the text
// in parens to eliminate the ambiguity.

                j = eval("(" + text + ")");

// In the optional fourth stage, we recursively walk the new structure, passing
// each name/value pair to a reviver function for possible transformation.

                return (typeof reviver === "function")
                    ? walk({"": j}, "")
                    : j;
            }

// If the text is not JSON parseable, then a SyntaxError is thrown.

            throw new SyntaxError("JSON.parse");
        };
    }
}());
},{}],24:[function(require,module,exports){
var util = require('./util')
var slice = util.slice
var pluck = util.pluck
var each = util.each
var bind = util.bind
var create = util.create
var isList = util.isList
var isFunction = util.isFunction
var isObject = util.isObject

module.exports = {
	createStore: createStore
}

var storeAPI = {
	version: '2.0.12',
	enabled: false,
	
	// get returns the value of the given key. If that value
	// is undefined, it returns optionalDefaultValue instead.
	get: function(key, optionalDefaultValue) {
		var data = this.storage.read(this._namespacePrefix + key)
		return this._deserialize(data, optionalDefaultValue)
	},

	// set will store the given value at key and returns value.
	// Calling set with value === undefined is equivalent to calling remove.
	set: function(key, value) {
		if (value === undefined) {
			return this.remove(key)
		}
		this.storage.write(this._namespacePrefix + key, this._serialize(value))
		return value
	},

	// remove deletes the key and value stored at the given key.
	remove: function(key) {
		this.storage.remove(this._namespacePrefix + key)
	},

	// each will call the given callback once for each key-value pair
	// in this store.
	each: function(callback) {
		var self = this
		this.storage.each(function(val, namespacedKey) {
			callback.call(self, self._deserialize(val), (namespacedKey || '').replace(self._namespaceRegexp, ''))
		})
	},

	// clearAll will remove all the stored key-value pairs in this store.
	clearAll: function() {
		this.storage.clearAll()
	},

	// additional functionality that can't live in plugins
	// ---------------------------------------------------

	// hasNamespace returns true if this store instance has the given namespace.
	hasNamespace: function(namespace) {
		return (this._namespacePrefix == '__storejs_'+namespace+'_')
	},

	// createStore creates a store.js instance with the first
	// functioning storage in the list of storage candidates,
	// and applies the the given mixins to the instance.
	createStore: function() {
		return createStore.apply(this, arguments)
	},
	
	addPlugin: function(plugin) {
		this._addPlugin(plugin)
	},
	
	namespace: function(namespace) {
		return createStore(this.storage, this.plugins, namespace)
	}
}

function _warn() {
	var _console = (typeof console == 'undefined' ? null : console)
	if (!_console) { return }
	var fn = (_console.warn ? _console.warn : _console.log)
	fn.apply(_console, arguments)
}

function createStore(storages, plugins, namespace) {
	if (!namespace) {
		namespace = ''
	}
	if (storages && !isList(storages)) {
		storages = [storages]
	}
	if (plugins && !isList(plugins)) {
		plugins = [plugins]
	}

	var namespacePrefix = (namespace ? '__storejs_'+namespace+'_' : '')
	var namespaceRegexp = (namespace ? new RegExp('^'+namespacePrefix) : null)
	var legalNamespaces = /^[a-zA-Z0-9_\-]*$/ // alpha-numeric + underscore and dash
	if (!legalNamespaces.test(namespace)) {
		throw new Error('store.js namespaces can only have alphanumerics + underscores and dashes')
	}
	
	var _privateStoreProps = {
		_namespacePrefix: namespacePrefix,
		_namespaceRegexp: namespaceRegexp,

		_testStorage: function(storage) {
			try {
				var testStr = '__storejs__test__'
				storage.write(testStr, testStr)
				var ok = (storage.read(testStr) === testStr)
				storage.remove(testStr)
				return ok
			} catch(e) {
				return false
			}
		},

		_assignPluginFnProp: function(pluginFnProp, propName) {
			var oldFn = this[propName]
			this[propName] = function pluginFn() {
				var args = slice(arguments, 0)
				var self = this

				// super_fn calls the old function which was overwritten by
				// this mixin.
				function super_fn() {
					if (!oldFn) { return }
					each(arguments, function(arg, i) {
						args[i] = arg
					})
					return oldFn.apply(self, args)
				}

				// Give mixing function access to super_fn by prefixing all mixin function
				// arguments with super_fn.
				var newFnArgs = [super_fn].concat(args)

				return pluginFnProp.apply(self, newFnArgs)
			}
		},

		_serialize: function(obj) {
			return JSON.stringify(obj)
		},

		_deserialize: function(strVal, defaultVal) {
			if (!strVal) { return defaultVal }
			// It is possible that a raw string value has been previously stored
			// in a storage without using store.js, meaning it will be a raw
			// string value instead of a JSON serialized string. By defaulting
			// to the raw string value in case of a JSON parse error, we allow
			// for past stored values to be forwards-compatible with store.js
			var val = ''
			try { val = JSON.parse(strVal) }
			catch(e) { val = strVal }

			return (val !== undefined ? val : defaultVal)
		},
		
		_addStorage: function(storage) {
			if (this.enabled) { return }
			if (this._testStorage(storage)) {
				this.storage = storage
				this.enabled = true
			}
		},

		_addPlugin: function(plugin) {
			var self = this

			// If the plugin is an array, then add all plugins in the array.
			// This allows for a plugin to depend on other plugins.
			if (isList(plugin)) {
				each(plugin, function(plugin) {
					self._addPlugin(plugin)
				})
				return
			}

			// Keep track of all plugins we've seen so far, so that we
			// don't add any of them twice.
			var seenPlugin = pluck(this.plugins, function(seenPlugin) {
				return (plugin === seenPlugin)
			})
			if (seenPlugin) {
				return
			}
			this.plugins.push(plugin)

			// Check that the plugin is properly formed
			if (!isFunction(plugin)) {
				throw new Error('Plugins must be function values that return objects')
			}

			var pluginProperties = plugin.call(this)
			if (!isObject(pluginProperties)) {
				throw new Error('Plugins must return an object of function properties')
			}

			// Add the plugin function properties to this store instance.
			each(pluginProperties, function(pluginFnProp, propName) {
				if (!isFunction(pluginFnProp)) {
					throw new Error('Bad plugin property: '+propName+' from plugin '+plugin.name+'. Plugins should only return functions.')
				}
				self._assignPluginFnProp(pluginFnProp, propName)
			})
		},
		
		// Put deprecated properties in the private API, so as to not expose it to accidential
		// discovery through inspection of the store object.
		
		// Deprecated: addStorage
		addStorage: function(storage) {
			_warn('store.addStorage(storage) is deprecated. Use createStore([storages])')
			this._addStorage(storage)
		}
	}

	var store = create(_privateStoreProps, storeAPI, {
		plugins: []
	})
	store.raw = {}
	each(store, function(prop, propName) {
		if (isFunction(prop)) {
			store.raw[propName] = bind(store, prop)			
		}
	})
	each(storages, function(storage) {
		store._addStorage(storage)
	})
	each(plugins, function(plugin) {
		store._addPlugin(plugin)
	})
	return store
}

},{"./util":25}],25:[function(require,module,exports){
(function (global){
var assign = make_assign()
var create = make_create()
var trim = make_trim()
var Global = (typeof window !== 'undefined' ? window : global)

module.exports = {
	assign: assign,
	create: create,
	trim: trim,
	bind: bind,
	slice: slice,
	each: each,
	map: map,
	pluck: pluck,
	isList: isList,
	isFunction: isFunction,
	isObject: isObject,
	Global: Global
}

function make_assign() {
	if (Object.assign) {
		return Object.assign
	} else {
		return function shimAssign(obj, props1, props2, etc) {
			for (var i = 1; i < arguments.length; i++) {
				each(Object(arguments[i]), function(val, key) {
					obj[key] = val
				})
			}			
			return obj
		}
	}
}

function make_create() {
	if (Object.create) {
		return function create(obj, assignProps1, assignProps2, etc) {
			var assignArgsList = slice(arguments, 1)
			return assign.apply(this, [Object.create(obj)].concat(assignArgsList))
		}
	} else {
		function F() {} // eslint-disable-line no-inner-declarations
		return function create(obj, assignProps1, assignProps2, etc) {
			var assignArgsList = slice(arguments, 1)
			F.prototype = obj
			return assign.apply(this, [new F()].concat(assignArgsList))
		}
	}
}

function make_trim() {
	if (String.prototype.trim) {
		return function trim(str) {
			return String.prototype.trim.call(str)
		}
	} else {
		return function trim(str) {
			return str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '')
		}
	}
}

function bind(obj, fn) {
	return function() {
		return fn.apply(obj, Array.prototype.slice.call(arguments, 0))
	}
}

function slice(arr, index) {
	return Array.prototype.slice.call(arr, index || 0)
}

function each(obj, fn) {
	pluck(obj, function(val, key) {
		fn(val, key)
		return false
	})
}

function map(obj, fn) {
	var res = (isList(obj) ? [] : {})
	pluck(obj, function(v, k) {
		res[k] = fn(v, k)
		return false
	})
	return res
}

function pluck(obj, fn) {
	if (isList(obj)) {
		for (var i=0; i<obj.length; i++) {
			if (fn(obj[i], i)) {
				return obj[i]
			}
		}
	} else {
		for (var key in obj) {
			if (obj.hasOwnProperty(key)) {
				if (fn(obj[key], key)) {
					return obj[key]
				}
			}
		}
	}
}

function isList(val) {
	return (val != null && typeof val != 'function' && typeof val.length == 'number')
}

function isFunction(val) {
	return val && {}.toString.call(val) === '[object Function]'
}

function isObject(val) {
	return val && {}.toString.call(val) === '[object Object]'
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],26:[function(require,module,exports){
module.exports = [
	// Listed in order of usage preference
	require('./localStorage'),
	require('./oldFF-globalStorage'),
	require('./oldIE-userDataStorage'),
	require('./cookieStorage'),
	require('./sessionStorage'),
	require('./memoryStorage')
]

},{"./cookieStorage":27,"./localStorage":28,"./memoryStorage":29,"./oldFF-globalStorage":30,"./oldIE-userDataStorage":31,"./sessionStorage":32}],27:[function(require,module,exports){
// cookieStorage is useful Safari private browser mode, where localStorage
// doesn't work but cookies do. This implementation is adopted from
// https://developer.mozilla.org/en-US/docs/Web/API/Storage/LocalStorage

var util = require('../src/util')
var Global = util.Global
var trim = util.trim

module.exports = {
	name: 'cookieStorage',
	read: read,
	write: write,
	each: each,
	remove: remove,
	clearAll: clearAll,
}

var doc = Global.document

function read(key) {
	if (!key || !_has(key)) { return null }
	var regexpStr = "(?:^|.*;\\s*)" +
		escape(key).replace(/[\-\.\+\*]/g, "\\$&") +
		"\\s*\\=\\s*((?:[^;](?!;))*[^;]?).*"
	return unescape(doc.cookie.replace(new RegExp(regexpStr), "$1"))
}

function each(callback) {
	var cookies = doc.cookie.split(/; ?/g)
	for (var i = cookies.length - 1; i >= 0; i--) {
		if (!trim(cookies[i])) {
			continue
		}
		var kvp = cookies[i].split('=')
		var key = unescape(kvp[0])
		var val = unescape(kvp[1])
		callback(val, key)
	}
}

function write(key, data) {
	if(!key) { return }
	doc.cookie = escape(key) + "=" + escape(data) + "; expires=Tue, 19 Jan 2038 03:14:07 GMT; path=/"
}

function remove(key) {
	if (!key || !_has(key)) {
		return
	}
	doc.cookie = escape(key) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/"
}

function clearAll() {
	each(function(_, key) {
		remove(key)
	})
}

function _has(key) {
	return (new RegExp("(?:^|;\\s*)" + escape(key).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(doc.cookie)
}

},{"../src/util":25}],28:[function(require,module,exports){
var util = require('../src/util')
var Global = util.Global

module.exports = {
	name: 'localStorage',
	read: read,
	write: write,
	each: each,
	remove: remove,
	clearAll: clearAll,
}

function localStorage() {
	return Global.localStorage
}

function read(key) {
	return localStorage().getItem(key)
}

function write(key, data) {
	return localStorage().setItem(key, data)
}

function each(fn) {
	for (var i = localStorage().length - 1; i >= 0; i--) {
		var key = localStorage().key(i)
		fn(read(key), key)
	}
}

function remove(key) {
	return localStorage().removeItem(key)
}

function clearAll() {
	return localStorage().clear()
}

},{"../src/util":25}],29:[function(require,module,exports){
// memoryStorage is a useful last fallback to ensure that the store
// is functions (meaning store.get(), store.set(), etc will all function).
// However, stored values will not persist when the browser navigates to
// a new page or reloads the current page.

module.exports = {
	name: 'memoryStorage',
	read: read,
	write: write,
	each: each,
	remove: remove,
	clearAll: clearAll,
}

var memoryStorage = {}

function read(key) {
	return memoryStorage[key]
}

function write(key, data) {
	memoryStorage[key] = data
}

function each(callback) {
	for (var key in memoryStorage) {
		if (memoryStorage.hasOwnProperty(key)) {
			callback(memoryStorage[key], key)
		}
	}
}

function remove(key) {
	delete memoryStorage[key]
}

function clearAll(key) {
	memoryStorage = {}
}

},{}],30:[function(require,module,exports){
// oldFF-globalStorage provides storage for Firefox
// versions 6 and 7, where no localStorage, etc
// is available.

var util = require('../src/util')
var Global = util.Global

module.exports = {
	name: 'oldFF-globalStorage',
	read: read,
	write: write,
	each: each,
	remove: remove,
	clearAll: clearAll,
}

var globalStorage = Global.globalStorage

function read(key) {
	return globalStorage[key]
}

function write(key, data) {
	globalStorage[key] = data
}

function each(fn) {
	for (var i = globalStorage.length - 1; i >= 0; i--) {
		var key = globalStorage.key(i)
		fn(globalStorage[key], key)
	}
}

function remove(key) {
	return globalStorage.removeItem(key)
}

function clearAll() {
	each(function(key, _) {
		delete globalStorage[key]
	})
}

},{"../src/util":25}],31:[function(require,module,exports){
// oldIE-userDataStorage provides storage for Internet Explorer
// versions 6 and 7, where no localStorage, sessionStorage, etc
// is available.

var util = require('../src/util')
var Global = util.Global

module.exports = {
	name: 'oldIE-userDataStorage',
	write: write,
	read: read,
	each: each,
	remove: remove,
	clearAll: clearAll,
}

var storageName = 'storejs'
var doc = Global.document
var _withStorageEl = _makeIEStorageElFunction()
var disable = (Global.navigator ? Global.navigator.userAgent : '').match(/ (MSIE 8|MSIE 9|MSIE 10)\./) // MSIE 9.x, MSIE 10.x

function write(unfixedKey, data) {
	if (disable) { return }
	var fixedKey = fixKey(unfixedKey)
	_withStorageEl(function(storageEl) {
		storageEl.setAttribute(fixedKey, data)
		storageEl.save(storageName)
	})
}

function read(unfixedKey) {
	if (disable) { return }
	var fixedKey = fixKey(unfixedKey)
	var res = null
	_withStorageEl(function(storageEl) {
		res = storageEl.getAttribute(fixedKey)
	})
	return res
}

function each(callback) {
	_withStorageEl(function(storageEl) {
		var attributes = storageEl.XMLDocument.documentElement.attributes
		for (var i=attributes.length-1; i>=0; i--) {
			var attr = attributes[i]
			callback(storageEl.getAttribute(attr.name), attr.name)
		}
	})
}

function remove(unfixedKey) {
	var fixedKey = fixKey(unfixedKey)
	_withStorageEl(function(storageEl) {
		storageEl.removeAttribute(fixedKey)
		storageEl.save(storageName)
	})
}

function clearAll() {
	_withStorageEl(function(storageEl) {
		var attributes = storageEl.XMLDocument.documentElement.attributes
		storageEl.load(storageName)
		for (var i=attributes.length-1; i>=0; i--) {
			storageEl.removeAttribute(attributes[i].name)
		}
		storageEl.save(storageName)
	})
}

// Helpers
//////////

// In IE7, keys cannot start with a digit or contain certain chars.
// See https://github.com/marcuswestin/store.js/issues/40
// See https://github.com/marcuswestin/store.js/issues/83
var forbiddenCharsRegex = new RegExp("[!\"#$%&'()*+,/\\\\:;<=>?@[\\]^`{|}~]", "g")
function fixKey(key) {
	return key.replace(/^\d/, '___$&').replace(forbiddenCharsRegex, '___')
}

function _makeIEStorageElFunction() {
	if (!doc || !doc.documentElement || !doc.documentElement.addBehavior) {
		return null
	}
	var scriptTag = 'script',
		storageOwner,
		storageContainer,
		storageEl

	// Since #userData storage applies only to specific paths, we need to
	// somehow link our data to a specific path.  We choose /favicon.ico
	// as a pretty safe option, since all browsers already make a request to
	// this URL anyway and being a 404 will not hurt us here.  We wrap an
	// iframe pointing to the favicon in an ActiveXObject(htmlfile) object
	// (see: http://msdn.microsoft.com/en-us/library/aa752574(v=VS.85).aspx)
	// since the iframe access rules appear to allow direct access and
	// manipulation of the document element, even for a 404 page.  This
	// document can be used instead of the current document (which would
	// have been limited to the current path) to perform #userData storage.
	try {
		/* global ActiveXObject */
		storageContainer = new ActiveXObject('htmlfile')
		storageContainer.open()
		storageContainer.write('<'+scriptTag+'>document.w=window</'+scriptTag+'><iframe src="/favicon.ico"></iframe>')
		storageContainer.close()
		storageOwner = storageContainer.w.frames[0].document
		storageEl = storageOwner.createElement('div')
	} catch(e) {
		// somehow ActiveXObject instantiation failed (perhaps some special
		// security settings or otherwse), fall back to per-path storage
		storageEl = doc.createElement('div')
		storageOwner = doc.body
	}

	return function(storeFunction) {
		var args = [].slice.call(arguments, 0)
		args.unshift(storageEl)
		// See http://msdn.microsoft.com/en-us/library/ms531081(v=VS.85).aspx
		// and http://msdn.microsoft.com/en-us/library/ms531424(v=VS.85).aspx
		storageOwner.appendChild(storageEl)
		storageEl.addBehavior('#default#userData')
		storageEl.load(storageName)
		storeFunction.apply(this, args)
		storageOwner.removeChild(storageEl)
		return
	}
}

},{"../src/util":25}],32:[function(require,module,exports){
var util = require('../src/util')
var Global = util.Global

module.exports = {
	name: 'sessionStorage',
	read: read,
	write: write,
	each: each,
	remove: remove,
	clearAll: clearAll
}

function sessionStorage() {
	return Global.sessionStorage
}

function read(key) {
	return sessionStorage().getItem(key)
}

function write(key, data) {
	return sessionStorage().setItem(key, data)
}

function each(fn) {
	for (var i = sessionStorage().length - 1; i >= 0; i--) {
		var key = sessionStorage().key(i)
		fn(read(key), key)
	}
}

function remove(key) {
	return sessionStorage().removeItem(key)
}

function clearAll() {
	return sessionStorage().clear()
}

},{"../src/util":25}],33:[function(require,module,exports){
function E () {
  // Keep this empty so it's easier to inherit from
  // (via https://github.com/lipsmack from https://github.com/scottcorgan/tiny-emitter/issues/3)
}

E.prototype = {
  on: function (name, callback, ctx) {
    var e = this.e || (this.e = {});

    (e[name] || (e[name] = [])).push({
      fn: callback,
      ctx: ctx
    });

    return this;
  },

  once: function (name, callback, ctx) {
    var self = this;
    function listener () {
      self.off(name, listener);
      callback.apply(ctx, arguments);
    };

    listener._ = callback
    return this.on(name, listener, ctx);
  },

  emit: function (name) {
    var data = [].slice.call(arguments, 1);
    var evtArr = ((this.e || (this.e = {}))[name] || []).slice();
    var i = 0;
    var len = evtArr.length;

    for (i; i < len; i++) {
      evtArr[i].fn.apply(evtArr[i].ctx, data);
    }

    return this;
  },

  off: function (name, callback) {
    var e = this.e || (this.e = {});
    var evts = e[name];
    var liveEvents = [];

    if (evts && callback) {
      for (var i = 0, len = evts.length; i < len; i++) {
        if (evts[i].fn !== callback && evts[i].fn._ !== callback)
          liveEvents.push(evts[i]);
      }
    }

    // Remove event from queue to prevent memory leak
    // Suggested by https://github.com/lazd
    // Ref: https://github.com/scottcorgan/tiny-emitter/commit/c6ebfaa9bc973b33d110a84a307742b7cf94c953#commitcomment-5024910

    (liveEvents.length)
      ? e[name] = liveEvents
      : delete e[name];

    return this;
  }
};

module.exports = E;
module.exports.TinyEmitter = E;

},{}],34:[function(require,module,exports){
module.exports={
  "_args": [
    [
      {
        "raw": "yasgui-utils@^1.6.7",
        "scope": null,
        "escapedName": "yasgui-utils",
        "name": "yasgui-utils",
        "rawSpec": "^1.6.7",
        "spec": ">=1.6.7 <2.0.0",
        "type": "range"
      },
      "/home/node/app"
    ]
  ],
  "_from": "yasgui-utils@>=1.6.7 <2.0.0",
  "_id": "yasgui-utils@1.6.7",
  "_inCache": true,
  "_location": "/yasgui-utils",
  "_nodeVersion": "7.10.0",
  "_npmOperationalInternal": {
    "host": "s3://npm-registry-packages",
    "tmp": "tmp/yasgui-utils-1.6.7.tgz_1495459781202_0.06725964159704745"
  },
  "_npmUser": {
    "name": "laurens.rietveld",
    "email": "laurens.rietveld@gmail.com"
  },
  "_npmVersion": "4.2.0",
  "_phantomChildren": {},
  "_requested": {
    "raw": "yasgui-utils@^1.6.7",
    "scope": null,
    "escapedName": "yasgui-utils",
    "name": "yasgui-utils",
    "rawSpec": "^1.6.7",
    "spec": ">=1.6.7 <2.0.0",
    "type": "range"
  },
  "_requiredBy": [
    "/"
  ],
  "_resolved": "https://registry.npmjs.org/yasgui-utils/-/yasgui-utils-1.6.7.tgz",
  "_shasum": "2bcfc5a315688de3ae6057883d9ae342b205f267",
  "_shrinkwrap": null,
  "_spec": "yasgui-utils@^1.6.7",
  "_where": "/home/node/app",
  "author": {
    "name": "Laurens Rietveld"
  },
  "bugs": {
    "url": "https://github.com/YASGUI/Utils/issues"
  },
  "dependencies": {
    "store": "^2.0.4"
  },
  "description": "Utils for YASGUI libs",
  "devDependencies": {},
  "directories": {},
  "dist": {
    "shasum": "2bcfc5a315688de3ae6057883d9ae342b205f267",
    "tarball": "https://registry.npmjs.org/yasgui-utils/-/yasgui-utils-1.6.7.tgz"
  },
  "gitHead": "6031b1cb732d390b29cd5376dceb9a9d665bbd11",
  "homepage": "https://github.com/YASGUI/Utils",
  "licenses": [
    {
      "type": "MIT",
      "url": "http://yasgui.github.io/license.txt"
    }
  ],
  "main": "src/main.js",
  "maintainers": [
    {
      "name": "laurens.rietveld",
      "email": "laurens.rietveld@gmail.com"
    }
  ],
  "name": "yasgui-utils",
  "optionalDependencies": {},
  "readme": "ERROR: No README data found!",
  "repository": {
    "type": "git",
    "url": "git://github.com/YASGUI/Utils.git"
  },
  "scripts": {},
  "version": "1.6.7"
}

},{}],35:[function(require,module,exports){
window.console = window.console || {"log":function(){}};//make sure any console statements don't break IE
module.exports = {
	storage: require("./storage.js"),
	svg: require("./svg.js"),
	version: {
		"yasgui-utils" : require("../package.json").version,
	},
	nestedExists : function(obj) {
		var args = Array.prototype.slice.call(arguments, 1);

		for (var i = 0; i < args.length; i++) {
			if (!obj || !obj.hasOwnProperty(args[i])) {
				return false;
			}
			obj = obj[args[i]];
		}
		return true;
	}
};

},{"../package.json":34,"./storage.js":36,"./svg.js":37}],36:[function(require,module,exports){
var store = require("store");
var times = {
  day: function() {
    return 1000 * 3600 * 24; //millis to day
  },
  month: function() {
    times.day() * 30;
  },
  year: function() {
    times.month() * 12;
  }
};
function isQuotaExceeded(e) {
  var quotaExceeded = false;
  if (e) {
    if (e.code) {
      switch (e.code) {
        case 22:
          quotaExceeded = true;
          break;
        case 1014:
          // Firefox
          if (e.name === "NS_ERROR_DOM_QUOTA_REACHED") {
            quotaExceeded = true;
          }
          break;
      }
    } else if (e.number === -2147024882) {
      // Internet Explorer 8
      quotaExceeded = true;
    }
  }
  return quotaExceeded;
}
var root = (module.exports = {
  set: function(key, val, exp, onQuotaExceeded) {
    if (!store.enabled) return; //this is probably in private mode. Don't run, as we might get Js errors
    if (key && val !== undefined) {
      if (typeof exp == "string") {
        exp = times[exp]();
      }
      //try to store string for dom objects (e.g. XML result). Otherwise, we might get a circular reference error when stringifying this
      if (val.documentElement) val = new XMLSerializer().serializeToString(val.documentElement);
      try {
        store.set(key, {
          val: val,
          exp: exp,
          time: new Date().getTime()
        });
      } catch (e) {
        e.quotaExceeded = isQuotaExceeded(e);
        if (e.quotaExceeded && onQuotaExceeded) {
          onQuotaExceeded(e);
        } else {
          throw e;
        }
      }
    }
  },
  remove: function(key) {
    if (!store.enabled) return; //this is probably in private mode. Don't run, as we might get Js errors
    if (key) store.remove(key);
  },
  removeAll: function(filter) {
    if (!store.enabled) return; //this is probably in private mode. Don't run, as we might get Js errors
    if (!filter) {
      store.clearAll();
    } else if (typeof filter === "function") {
      store.each(function(value, key) {
        if (filter(key, value)) root.remove(key);
      });
    }
  },
  get: function(key) {
    if (!store.enabled) return null; //this is probably in private mode. Don't run, as we might get Js errors
    if (key) {
      var info = store.get(key);
      if (!info) {
        return null;
      }
      if (info.exp && new Date().getTime() - info.time > info.exp) {
        return null;
      }
      return info.val;
    } else {
      return null;
    }
  }
});

},{"store":21}],37:[function(require,module,exports){
module.exports = {
	draw: function(parent, svgString) {
		if (!parent) return;
		var el = module.exports.getElement(svgString);
		if (el) {
			if (parent.append) {
				parent.append(el);
			} else {
				//regular dom doc
				parent.appendChild(el);
			}
		}
	},
	getElement: function(svgString) {
		if (svgString && svgString.indexOf("<svg") == 0) {
			//no style passed via config. guess own styles
			var parser = new DOMParser();
			var dom = parser.parseFromString(svgString, "text/xml");
			var svg = dom.documentElement;
			
			var svgContainer = document.createElement("div");
			svgContainer.className = 'svgImg';
			svgContainer.appendChild(svg);
			return svgContainer;
		}
		return false;
	}
};
},{}],38:[function(require,module,exports){
module.exports={
  "name": "perfectkb-yate",
  "description": "Yet Another Turtle Editor, forked from YASQE",
  "version": "0.9.0",
  "main": "src/main.js",
  "license": "MIT",
  "author": "Maxime Lefrançois",
  "homepage": "https://perfectkb.github.io/yate",
  "scripts": {
    "dev": "gulp serve",
    "build": "gulp",
    "patch": "gulp patch",
    "minor": "gulp minor",
    "major": "gulp major",
    "update-interactive": "npm-check --skip-unused -u"
  },
  "devDependencies": {
    "bootstrap-sass": "^3.3.7",
    "browserify": "^13.1.0",
    "browserify-shim": "^3.8.12",
    "browserify-transform-tools": "^1.6.0",
    "exorcist": "^0.4.0",
    "gulp": "^3.9.1",
    "gulp-autoprefixer": "^3.1.0",
    "gulp-bump": "^2.2.0",
    "gulp-concat": "^2.6.0",
    "gulp-connect": "^4.2.0",
    "gulp-cssimport": "^3.1.0",
    "gulp-cssnano": "^2.1.2",
    "gulp-embedlr": "^0.5.2",
    "gulp-filter": "^4.0.0",
    "gulp-git": "^2.4.1",
    "gulp-jsvalidate": "^2.1.0",
    "gulp-livereload": "^3.8.1",
    "gulp-notify": "^2.2.0",
    "gulp-rename": "^1.2.2",
    "gulp-sass": "^2.3.2",
    "gulp-sourcemaps": "^1.6.0",
    "gulp-streamify": "1.0.2",
    "gulp-tag-version": "^1.3.0",
    "gulp-uglify": "^1.5.4",
    "node-sass": "^3.8.0",
    "require-dir": "^0.3.2",
    "run-sequence": "^1.2.2",
    "vinyl-buffer": "^1.0.0",
    "vinyl-source-stream": "~1.1.0",
    "vinyl-transform": "1.0.0",
    "watchify": "^3.7.0"
  },
  "bugs": "https://github.com/perfectkb/yate/pulls",
  "keywords": [
    "JavaScript",
    "Turtle",
    "Editor",
    "Semantic Web",
    "Linked Data"
  ],
  "maintainers": [
    {
      "name": "Laurens Rietveld",
      "email": "laurens.rietveld@gmail.com",
      "web": "http://laurensrietveld.nl"
    },
    {
      "name": "Maxime Lefrançois",
      "email": "maxime.lefrançois@gmail.com",
      "web": "http://maxime-lefrancois.info"
    }
  ],
  "repository": {
    "type": "git",
    "url": "https://github.com/perfectkb/yate.git"
  },
  "dependencies": {
    "clipboard": "^1.7.1",
    "codemirror": "5.17.0",
    "jquery": "^2.2.4",
    "prettier": "^1.4.4",
    "yasgui-utils": "^1.6.7"
  },
  "optionalShim": {
    "codemirror": {
      "require": "codemirror",
      "global": "CodeMirror"
    },
    "jquery": {
      "require": "jquery",
      "global": "jQuery"
    },
    "../../lib/codemirror": {
      "require": "codemirror",
      "global": "CodeMirror"
    }
  }
}

},{}],39:[function(require,module,exports){
"use strict";
var $ = (function(){try{return require('jquery')}catch(e){return window.jQuery}})(),
  utils = require("../utils.js"),
  yutils = require("yasgui-utils"),
  Trie = require("../../lib/trie.js"),
  YATE = require("../main.js");

module.exports = function(YATE, yate) {
  var completionNotifications = {};
  var completers = {};
  var tries = {};

  yate.on("cursorActivity", function(yate, eventInfo) {
    autoComplete(true);
  });
  yate.on("change", function() {
    var needPossibleAdjustment = [];
    for (var notificationName in completionNotifications) {
      if (completionNotifications[notificationName].is(":visible")) {
        needPossibleAdjustment.push(completionNotifications[notificationName]);
      }
    }
    if (needPossibleAdjustment.length > 0) {
      //position completion notifications
      var scrollBar = $(yate.getWrapperElement()).find(".CodeMirror-vscrollbar");
      var offset = 0;
      if (scrollBar.is(":visible")) {
        offset = scrollBar.outerWidth();
      }
      needPossibleAdjustment.forEach(function(notification) {
        notification.css("right", offset);
      });
    }
  });

  /**
	 * Store bulk completions in memory as trie, and store these in localstorage as well (if enabled)
	 *
	 * @method doc.storeBulkCompletions
	 * @param completions {array}
	 */
  var storeBulkCompletions = function(completer, completions) {
    // store array as trie
    tries[completer.name] = new Trie();
    for (var i = 0; i < completions.length; i++) {
      tries[completer.name].insert(completions[i]);
    }
    // store in localstorage as well
    var storageId = utils.getPersistencyId(yate, completer.persistent);
    if (storageId) yutils.storage.set(storageId, completions, "month", yate.options.onQuotaExceeded);
  };

  var initCompleter = function(name, completionInit) {
    var completer = (completers[name] = new completionInit(yate, name));
    completer.name = name;
    if (completer.bulk) {
      var storeArrayAsBulk = function(suggestions) {
        if (suggestions && suggestions instanceof Array && suggestions.length > 0) {
          storeBulkCompletions(completer, suggestions);
        }
      };
      if (completer.get instanceof Array) {
        // we don't care whether the completions are already stored in
        // localstorage. just use this one
        storeArrayAsBulk(completer.get);
      } else {
        // if completions are defined in localstorage, use those! (calling the
        // function may come with overhead (e.g. async calls))
        var completionsFromStorage = null;
        var persistencyIdentifier = utils.getPersistencyId(yate, completer.persistent);
        if (persistencyIdentifier) completionsFromStorage = yutils.storage.get(persistencyIdentifier);
        if (completionsFromStorage && completionsFromStorage.length > 0) {
          storeArrayAsBulk(completionsFromStorage);
        } else {
          // nothing in storage. check whether we have a function via which we
          // can get our prefixes
          if (completer.get instanceof Function) {
            if (completer.async) {
              completer.get(null, storeArrayAsBulk);
            } else {
              storeArrayAsBulk(completer.get());
            }
          }
        }
      }
    }
  };

  var autoComplete = function(fromAutoShow) {
    if (yate.somethingSelected()) return;
    var tryHintType = function(completer) {
      if (
        fromAutoShow && // from autoShow, i.e. this gets called each time the editor content changes
        (!completer.autoShow || // autoshow for  this particular type of autocompletion is -not- enabled
          (!completer.bulk && completer.async)) // async is enabled (don't want to re-do ajax-like request for every editor change)
      ) {
        return false;
      }

      var hintConfig = {
        closeCharacters: /(?=a)b/,
        completeSingle: false
      };
      if (!completer.bulk && completer.async) {
        hintConfig.async = true;
      }
      var wrappedHintCallback = function(yate, callback) {
        return getCompletionHintsObject(completer, callback);
      };
      var result = YATE.showHint(yate, wrappedHintCallback, hintConfig);
      return true;
    };
    for (var completerName in completers) {
      if ($.inArray(completerName, yate.options.autocompleters) == -1) continue; //this completer is disabled
      var completer = completers[completerName];
      if (!completer.isValidCompletionPosition) continue; //no way to check whether we are in a valid position

      if (!completer.isValidCompletionPosition()) {
        //if needed, fire callbacks for when we are -not- in valid completion position
        if (completer.callbacks && completer.callbacks.invalidPosition) {
          completer.callbacks.invalidPosition(yate, completer);
        }
        //not in a valid position, so continue to next completion candidate type
        continue;
      }
      // run valid position handler, if there is one (if it returns false, stop the autocompletion!)
      if (completer.callbacks && completer.callbacks.validPosition) {
        if (completer.callbacks.validPosition(yate, completer) === false) continue;
      }
      var success = tryHintType(completer);
      if (success) break;
    }
  };

  var getCompletionHintsObject = function(completer, callback) {
    var getSuggestionsFromToken = function(partialToken) {
      var stringToAutocomplete = partialToken.autocompletionString || partialToken.string;
      var suggestions = [];
      if (tries[completer.name]) {
        suggestions = tries[completer.name].autoComplete(stringToAutocomplete);
      } else if (typeof completer.get == "function" && completer.async == false) {
        suggestions = completer.get(stringToAutocomplete);
      } else if (typeof completer.get == "object") {
        var partialTokenLength = stringToAutocomplete.length;
        for (var i = 0; i < completer.get.length; i++) {
          var completion = completer.get[i];
          if (completion.slice(0, partialTokenLength) == stringToAutocomplete) {
            suggestions.push(completion);
          }
        }
      }
      return getSuggestionsAsHintObject(suggestions, completer, partialToken);
    };

    var token = yate.getCompleteToken();
    if (completer.preProcessToken) {
      token = completer.preProcessToken(token);
    }

    if (token) {
      // use custom completionhint function, to avoid reaching a loop when the
      // completionhint is the same as the current token
      // regular behaviour would keep changing the codemirror dom, hence
      // constantly calling this callback
      if (!completer.bulk && completer.async) {
        var wrappedCallback = function(suggestions) {
          callback(getSuggestionsAsHintObject(suggestions, completer, token));
        };
        completer.get(token, wrappedCallback);
      } else {
        return getSuggestionsFromToken(token);
      }
    }
  };

  /**
	 *  get our array of suggestions (strings) in the codemirror hint format
	 */
  var getSuggestionsAsHintObject = function(suggestions, completer, token) {
    var hintList = [];
    for (var i = 0; i < suggestions.length; i++) {
      var suggestedString = suggestions[i];
      if (completer.postProcessToken) {
        suggestedString = completer.postProcessToken(token, suggestedString);
      }
      hintList.push({
        text: suggestedString,
        displayText: suggestedString,
        hint: selectHint
      });
    }

    var cur = yate.getCursor();
    var returnObj = {
      completionToken: token.string,
      list: hintList,
      from: {
        line: cur.line,
        ch: token.start
      },
      to: {
        line: cur.line,
        ch: token.end
      }
    };
    //if we have some autocompletion handlers specified, add these these to the object. Codemirror will take care of firing these
    if (completer.callbacks) {
      for (var callbackName in completer.callbacks) {
        if (completer.callbacks[callbackName]) {
          YATE.on(returnObj, callbackName, completer.callbacks[callbackName]);
        }
      }
    }
    return returnObj;
  };

  return {
    init: initCompleter,
    completers: completers,
    notifications: {
      getEl: function(completer) {
        return $(completionNotifications[completer.name]);
      },
      show: function(yate, completer) {
        //only draw when the user needs to use a keypress to summon autocompletions
        if (!completer.autoshow) {
          if (!completionNotifications[completer.name])
            completionNotifications[completer.name] = $("<div class='completionNotification'></div>");
          completionNotifications[completer.name]
            .show()
            .text("Press CTRL - <spacebar> to autocomplete")
            .appendTo($(yate.getWrapperElement()));
        }
      },
      hide: function(yate, completer) {
        if (completionNotifications[completer.name]) {
          completionNotifications[completer.name].hide();
        }
      }
    },
    autoComplete: autoComplete,
    getTrie: function(completer) {
      return typeof completer == "string" ? tries[completer] : tries[completer.name];
    }
  };
};

/**
 * function which fires after the user selects a completion. this function checks whether we actually need to store this one (if completion is same as current token, don't do anything)
 */
var selectHint = function(yate, data, completion) {
  if (completion.text != yate.getTokenAt(yate.getCursor()).string) {
    yate.replaceRange(completion.text, data.from, data.to);
  }
};

//
//module.exports = {
//	preprocessPrefixTokenForCompletion: preprocessPrefixTokenForCompletion,
//	postprocessResourceTokenForCompletion: postprocessResourceTokenForCompletion,
//	preprocessResourceTokenForCompletion: preprocessResourceTokenForCompletion,
//	showCompletionNotification: showCompletionNotification,
//	hideCompletionNotification: hideCompletionNotification,
//	autoComplete: autoComplete,
//	autocompleteVariables: autocompleteVariables,
//	fetchFromPrefixCc: fetchFromPrefixCc,
//	fetchFromLov: fetchFromLov,
////	storeBulkCompletions: storeBulkCompletions,
//	loadBulkCompletions: loadBulkCompletions,
//};

},{"../../lib/trie.js":4,"../main.js":48,"../utils.js":53,"jquery":undefined,"yasgui-utils":35}],40:[function(require,module,exports){
"use strict";
var $ = (function(){try{return require('jquery')}catch(e){return window.jQuery}})();
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

},{"./utils":43,"./utils.js":43,"jquery":undefined}],41:[function(require,module,exports){
"use strict";
var $ = (function(){try{return require('jquery')}catch(e){return window.jQuery}})();
//this is a mapping from the class names (generic ones, for compatability with codemirror themes), to what they -actually- represent
var tokenTypes = {
  "string-2": "prefixed",
  atom: "var"
};

module.exports = function(yate, completerName) {
  //this autocompleter also fires on-change!
  yate.on("change", function() {
    module.exports.appendPrefixIfNeeded(yate, completerName);
  });

  return {
    isValidCompletionPosition: function() {
      return module.exports.isValidCompletionPosition(yate);
    },
    get: function(token, callback) {
      $.getJSON(module.exports.fetchFrom, function(data) {
        var prefixArray = [];
        for (var prefix in data) {
          if (prefix == "bif") continue; // skip this one! see #231
          var completeString = prefix + ": <" + data[prefix] + ">";
          prefixArray.push(completeString); // the array we want to store in localstorage
        }

        prefixArray.sort();
        callback(prefixArray);
      });
    },
    preProcessToken: function(token) {
      return module.exports.preprocessPrefixTokenForCompletion(yate, token);
    },
    async: true,
    bulk: true,
    autoShow: true,
    persistent: completerName,
    callbacks: {
      pick: function() {
        yate.collapsePrefixes(false);
      }
    }
  };
};
module.exports.isValidCompletionPosition = function(yate) {
  var cur = yate.getCursor(), token = yate.getTokenAt(cur);

  // not at end of line
  if (yate.getLine(cur.line).length > cur.ch) return false;

  if (token.type != "ws") {
    // we want to complete token, e.g. when the prefix starts with an a
    // (treated as a token in itself..)
    // but we to avoid including the PREFIX tag. So when we have just
    // typed a space after the prefix tag, don't get the complete token
    token = yate.getCompleteToken();
  }

  // we shouldnt be at the uri part the prefix declaration
  // also check whether current token isnt 'a' (that makes codemirror
  // thing a namespace is a possiblecurrent
  if (!token.string.indexOf("a") == 0 && $.inArray("PNAME_NS", token.state.possibleCurrent) == -1) return false;

  // First token of line needs to be PREFIX,
  // there should be no trailing text (otherwise, text is wrongly inserted
  // in between)
  var previousToken = yate.getPreviousNonWsToken(cur.line, token);
  if (!previousToken || previousToken.string.toUpperCase() != "PREFIX" || previousToken.string.toUpperCase() != "@PREFIX") return false;
  return true;
};
module.exports.preprocessPrefixTokenForCompletion = function(yate, token) {
  var previousToken = yate.getPreviousNonWsToken(yate.getCursor().line, token);
  if (previousToken && previousToken.string && previousToken.string.slice(-1) == ":") {
    //combine both tokens! In this case we have the cursor at the end of line "PREFIX bla: <".
    //we want the token to be "bla: <", en not "<"
    token = {
      start: previousToken.start,
      end: token.end,
      string: previousToken.string + " " + token.string,
      state: token.state
    };
  }
  return token;
};
/**
 * Check whether typed prefix is declared. If not, automatically add declaration
 * using list from prefix.cc
 *
 * @param yate
 */
module.exports.appendPrefixIfNeeded = function(yate, completerName) {
  if (!yate.autocompleters.getTrie(completerName)) return; // no prefixed defined. just stop
  if (!yate.options.autocompleters || yate.options.autocompleters.indexOf(completerName) == -1) return; //this autocompleter is disabled
  var cur = yate.getCursor();

  var token = yate.getTokenAt(cur);
  if (tokenTypes[token.type] == "prefixed") {
    var colonIndex = token.string.indexOf(":");
    if (colonIndex !== -1) {
      // check previous token isnt PREFIX, or a '<'(which would mean we are in a uri)
      //			var firstTokenString = yate.getNextNonWsToken(cur.line).string.toUpperCase();
      var lastNonWsTokenString = yate.getPreviousNonWsToken(cur.line, token).string.toUpperCase();
      var previousToken = yate.getTokenAt({
        line: cur.line,
        ch: token.start
      }); // needs to be null (beginning of line), or whitespace
      if (lastNonWsTokenString != "PREFIX" && lastNonWsTokenString != "@PREFIX" && (previousToken.type == "ws" || previousToken.type == null)) {
        // check whether it isnt defined already (saves us from looping
        // through the array)
        var currentPrefix = token.string.substring(0, colonIndex + 1);
        var docPrefixes = yate.getPrefixesFromDocument();
        if (docPrefixes[currentPrefix.slice(0, -1)] == null) {
          // ok, so it isnt added yet!
          var completions = yate.autocompleters.getTrie(completerName).autoComplete(currentPrefix);
          if (completions.length > 0) {
            yate.addPrefixes(completions[0]);
          }
        }
      }
    }
  }
};

module.exports.fetchFrom = (window.location.protocol.indexOf("http") === 0 ? "//" : "http://") +
  "prefix.cc/popular/all.file.json";

},{"jquery":undefined}],42:[function(require,module,exports){
"use strict";
var $ = (function(){try{return require('jquery')}catch(e){return window.jQuery}})();
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

},{"./utils":43,"./utils.js":43,"jquery":undefined}],43:[function(require,module,exports){
"use strict";
var $ = (function(){try{return require('jquery')}catch(e){return window.jQuery}})(), utils = require("./utils.js"), yutils = require("yasgui-utils");
/**
 * Where the base class only contains functionality related to -all- completions, this class contains some utils used here and there in our autocompletions
 */

/**
 * Converts rdf:type to http://.../type and converts <http://...> to http://...
 * Stores additional info such as the used namespace and prefix in the token object
 */
var preprocessResourceTokenForCompletion = function(yate, token) {
  var docPrefixes = yate.getPrefixesFromDocument();
  if (!token.string.indexOf("<") == 0) {
    token.tokenPrefix = token.string.substring(0, token.string.indexOf(":") + 1);

    if (docPrefixes[token.tokenPrefix.slice(0, -1)] != null) {
      token.tokenPrefixUri = docPrefixes[token.tokenPrefix.slice(0, -1)];
    }
  }

  token.autocompletionString = token.string.trim();
  if (!token.string.indexOf("<") == 0 && token.string.indexOf(":") > -1) {
    // hmm, the token is prefixed. We still need the complete uri for autocompletions. generate this!
    for (var prefix in docPrefixes) {
      if (token.tokenPrefix === prefix + ":") {
        token.autocompletionString = docPrefixes[prefix];
        token.autocompletionString += token.string.substring(prefix.length + 1);
        break;
      }
    }
  }

  if (token.autocompletionString.indexOf("<") == 0)
    token.autocompletionString = token.autocompletionString.substring(1);
  if (token.autocompletionString.indexOf(">", token.length - 1) !== -1)
    token.autocompletionString = token.autocompletionString.substring(0, token.autocompletionString.length - 1);
  return token;
};

var postprocessResourceTokenForCompletion = function(yate, token, suggestedString) {
  if (token.tokenPrefix && token.autocompletionString && token.tokenPrefixUri) {
    // we need to get the suggested string back to prefixed form
    suggestedString = token.tokenPrefix + suggestedString.substring(token.tokenPrefixUri.length);
  } else {
    // it is a regular uri. add '<' and '>' to string
    suggestedString = "<" + suggestedString + ">";
  }
  return suggestedString;
};

//Use protocol relative request when served via http[s]*. Otherwise (e.g. file://, fetch via http)
var reqProtocol = window.location.protocol.indexOf("http") === 0 ? "https://" : "http://";
var fetchFromLov = function(yate, completer, token, callback) {
  if (!token || !token.string || token.string.trim().length == 0) {
    yate.autocompleters.notifications.getEl(completer).empty().append("Nothing to autocomplete yet!");
    return false;
  }
  var maxResults = 50;

  var args = {
    q: token.autocompletionString,
    page: 1
  };
  if (completer.name == "classes") {
    args.type = "class";
  } else {
    args.type = "property";
  }
  var results = [];
  var url = "";
  var updateUrl = function() {
    url = reqProtocol + "lov.linkeddata.es/dataset/lov/api/v2/autocomplete/terms?" + $.param(args);
  };
  updateUrl();
  var increasePage = function() {
    args.page++;
    updateUrl();
  };
  var doRequests = function() {
    $.get(url, function(data) {
      for (var i = 0; i < data.results.length; i++) {
        if ($.isArray(data.results[i].uri) && data.results[i].uri.length > 0) {
          results.push(data.results[i].uri[0]);
        } else {
          results.push(data.results[i].uri);
        }
      }
      if (results.length < data.total_results && results.length < maxResults) {
        increasePage();
        doRequests();
      } else {
        //if notification bar is there, show feedback, or close
        if (results.length > 0) {
          yate.autocompleters.notifications.hide(yate, completer);
        } else {
          yate.autocompleters.notifications.getEl(completer).text("0 matches found...");
        }
        callback(results);
        // requests done! Don't call this function again
      }
    }).fail(function(jqXHR, textStatus, errorThrown) {
      yate.autocompleters.notifications.getEl(completer).empty().append("Failed fetching suggestions..");
    });
  };
  //if notification bar is there, show a loader
  yate.autocompleters.notifications
    .getEl(completer)
    .empty()
    .append($("<span>Fetchting autocompletions &nbsp;</span>"))
    .append($(yutils.svg.getElement(require("../imgs.js").loader)).addClass("notificationLoader"));
  doRequests();
};

module.exports = {
  fetchFromLov: fetchFromLov,
  preprocessResourceTokenForCompletion: preprocessResourceTokenForCompletion,
  postprocessResourceTokenForCompletion: postprocessResourceTokenForCompletion
};

},{"../imgs.js":47,"./utils.js":43,"jquery":undefined,"yasgui-utils":35}],44:[function(require,module,exports){
"use strict";
var $ = (function(){try{return require('jquery')}catch(e){return window.jQuery}})();
module.exports = function(yate) {
  return {
    isValidCompletionPosition: function() {
      var token = yate.getTokenAt(yate.getCursor());
      if (token.type != "ws") {
        token = yate.getCompleteToken(token);
        if (token && (token.string[0] === '?' || token.string[0] === '$')) {
          return true;
        }
      }
      return false;
    },
    get: function(token) {
      if (token.trim().length == 0) return []; //nothing to autocomplete
      var distinctVars = {};
      //do this outside of codemirror. I expect jquery to be faster here (just finding dom elements with classnames)
      //and: this'll still work when the query is incorrect (i.e., when simply typing '?')
      $(yate.getWrapperElement()).find(".cm-atom").each(function() {
        var variable = this.innerHTML;
        if (variable[0] === '?' || variable[0] === '$') {
          //ok, lets check if the next element in the div is an atom as well. In that case, they belong together (may happen sometimes when query is not syntactically valid)
          var nextEl = $(this).next();
          var nextElClass = nextEl.attr("class");
          if (nextElClass && nextEl.attr("class").indexOf("cm-atom") >= 0) {
            variable += nextEl.text();
          }

          //skip single questionmarks
          if (variable.length <= 1) return;

          //it should match our token ofcourse
          if (variable.indexOf(token) !== 0) return;

          //skip exact matches
          if (variable == token) return;

          //store in map so we have a unique list
          distinctVars[variable] = true;
        }
      });
      var variables = [];
      for (var variable in distinctVars) {
        variables.push(variable);
      }
      variables.sort();
      return variables;
    },
    async: false,
    bulk: false,
    autoShow: true
  };
};

},{"jquery":undefined}],45:[function(require,module,exports){
/**
 * The default options of YATE (check the CodeMirror documentation for even
 * more options, such as disabling line numbers, or changing keyboard shortcut
 * keys). Either change the default options by setting YATE.defaults, or by
 * passing your own options as second argument to the YATE constructor
 */
var $ = (function(){try{return require('jquery')}catch(e){return window.jQuery}})(), YATE = require("./main.js");
YATE.defaults = $.extend(true, {}, YATE.defaults, {
  mode: "rdf11turtle",
  /**
	 * Document string
	 */
  value: "# EXAMPLE 19\n@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .\n@prefix dc: <http://purl.org/dc/elements/1.1/> .\n@prefix ex: <http://example.org/stuff/1.0/> .\n\n<http://www.w3.org/TR/rdf-syntax-grammar>\n  dc:title \"RDF/XML Syntax Specification (Revised)\" ;\n  ex:editor [\n    ex:fullname \"Dave Beckett\";\n    ex:homePage <http://purl.org/net/dajobe/>\n  ] .\n\n# EXAMPLE 20\nPREFIX : <http://example.org/stuff/1.0/>\n:a :b ( \"apple\" \"banana\" ) .\n\n# EXAMPLE 21\n@prefix : <http://example.org/stuff/1.0/> .\n@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .\n:a :b\n  [ rdf:first \"apple\";\n    rdf:rest [ rdf:first \"banana\";\n               rdf:rest rdf:nil ]\n  ] .\n\n# EXAMPLE 22\n@prefix : <http://example.org/stuff/1.0/> .\n\n:a :b \"The first line\nThe second line\n  more\" .\n\n:a :b \"\"\"The first line\nThe second line\n  more\"\"\" .\n\n# EXAMPLE 23\n@prefix : <http://example.org/stuff/1.0/> .\n(1 2.0 3E1) :p \"w\" .\n\n# EXAMPLE 24\n@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .\n    _:b0  rdf:first  1 ;\n          rdf:rest   _:b1 .\n    _:b1  rdf:first  2.0 ;\n          rdf:rest   _:b2 .\n    _:b2  rdf:first  3E1 ;\n          rdf:rest   rdf:nil .\n    _:b0  :p         \"w\" . \n\n# EXAMPLE 25\nPREFIX : <http://example.org/stuff/1.0/>\n(1 [:p :q] ( 2 ) ) :p2 :q2 .\n\n# EXAMPLE 26\n@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .\n    _:b0  rdf:first  1 ;\n          rdf:rest   _:b1 .\n    _:b1  rdf:first  _:b2 .\n    _:b2  :p         :q .\n    _:b1  rdf:rest   _:b3 .\n    _:b3  rdf:first  _:b4 .\n    _:b4  rdf:first  2 ;\n          rdf:rest   rdf:nil .\n    _:b3  rdf:rest   rdf:nil .\n    ",
  highlightSelectionMatches: {
    showToken: /\w/
  },
  tabMode: "indent",
  lineNumbers: true,
  lineWrapping: true,
  backdrop: false,
  foldGutter: {
    rangeFinder: new YATE.fold.combine(YATE.fold.brace, YATE.fold.prefix)
  },
  collapsePrefixesOnLoad: false,
  gutters: ["gutterErrorBar", "CodeMirror-linenumbers", "CodeMirror-foldgutter"],
  matchBrackets: true,
  fixedGutter: true,
  syntaxErrorCheck: true,
  onQuotaExceeded: function(e) {
    //fail silently
    console.warn("Could not store in localstorage. Skipping..", e);
  },
  /**
	 * Extra shortcut keys. Check the CodeMirror manual on how to add your own
	 *
	 * @property extraKeys
	 * @type object
	 */
  extraKeys: {
    //					"Ctrl-Space" : function(yate) {
    //						YATE.autoComplete(yate);
    //					},
    "Ctrl-Space": YATE.autoComplete,

    "Cmd-Space": YATE.autoComplete,
    "Ctrl-D": YATE.deleteLine,
    "Ctrl-K": YATE.deleteLine,
    "Shift-Ctrl-K": YATE.deleteLine,
    "Cmd-D": YATE.deleteLine,
    "Cmd-K": YATE.deleteLine,
    "Ctrl-/": YATE.commentLines,
    "Cmd-/": YATE.commentLines,
    "Ctrl-Alt-Down": YATE.copyLineDown,
    "Ctrl-Alt-Up": YATE.copyLineUp,
    "Cmd-Alt-Down": YATE.copyLineDown,
    "Cmd-Alt-Up": YATE.copyLineUp,
    "Shift-Ctrl-F": YATE.doAutoFormat,
    "Shift-Cmd-F": YATE.doAutoFormat,
    "Ctrl-]": YATE.indentMore,
    "Cmd-]": YATE.indentMore,
    "Ctrl-[": YATE.indentLess,
    "Cmd-[": YATE.indentLess,
    "Ctrl-S": YATE.storeDoc,
    "Cmd-S": YATE.storeDoc,
    F11: function(yate) {
      yate.setOption("fullScreen", !yate.getOption("fullScreen"));
    },
    Esc: function(yate) {
      if (yate.getOption("fullScreen")) yate.setOption("fullScreen", false);
    }
  },
  cursorHeight: 0.9,

  /**
	 * Show a button with which users can create a link to this document. Set this value to null to disable this functionality.
	 * By default, this feature is enabled, and the only the document value is appended to the link.
	 * ps. This function should return an object which is parseable by jQuery.param (http://api.jquery.com/jQuery.param/)
	 */
  createShareLink: YATE.createShareLink,

  createShortLink: null,

  /**
	 * Consume links shared by others, by checking the url for arguments coming from a document link. Defaults by only checking the 'doc=' argument in the url
	 */
  consumeShareLink: YATE.consumeShareLink,

  /**
	 * Change persistency settings for the YATE document value. Setting the values
	 * to null, will disable persistancy: nothing is stored between browser
	 * sessions Setting the values to a string (or a function which returns a
	 * string), will store the document in localstorage using the specified string.
	 * By default, the ID is dynamically generated using the closest dom ID, to avoid collissions when using multiple YATE items on one
	 * page
	 *
	 * @type function|string
	 */
  persistent: function(yate) {
    return "yate_" + $(yate.getWrapperElement()).closest("[id]").attr("id") + "_docVal";
  }

});

},{"./main.js":48,"jquery":undefined}],46:[function(require,module,exports){
//this is the entry-point for browserify.
//the current browserify version does not support require-ing js files which are used as entry-point
//this way, we can still require our main.js file
module.exports = require("./main.js");

},{"./main.js":48}],47:[function(require,module,exports){
"use strict";
module.exports = {
  copy: '<svg xmlns="http://www.w3.org/2000/svg" baseProfile="tiny" viewBox="0 0 100 100"><path d="M13.56190607413896,81.37143644483376 h27.12381214827792 v6.78095303706948 H13.56190607413896 v-6.78095303706948 zm33.9047651853474,-40.68571822241688 H13.56190607413896 v6.78095303706948 h33.9047651853474 v-6.78095303706948 zm13.56190607413896,20.34285911120844 V47.46667125948636 L40.68571822241688,67.8095303706948 l20.34285911120844,20.34285911120844 V74.59048340776428 h33.9047651853474 V61.02857733362532 H61.02857733362532 zm-30.51428866681266,-6.78095303706948 H13.56190607413896 v6.78095303706948 h16.9523825926737 v-6.78095303706948 zM13.56190607413896,74.59048340776428 h16.9523825926737 v-6.78095303706948 H13.56190607413896 v6.78095303706948 zm61.02857733362532,6.78095303706948 h6.78095303706948 v13.56190607413896 c-0.10595239120421063,1.9071430416757913 -0.7416667384294744,3.4964289097389507 -2.013095432880002,4.767857604189478 s-2.860714562513687,1.9071430416757913 -4.767857604189478,2.013095432880002 H6.78095303706948 c-3.708333692147372,0 -6.78095303706948,-3.072619344922108 -6.78095303706948,-6.78095303706948 V20.34285911120844 c0,-3.708333692147372 3.072619344922108,-6.78095303706948 6.78095303706948,-6.78095303706948 h20.34285911120844 C27.12381214827792,6.039286298640006 33.16309844691793,0 40.68571822241688,0 s13.56190607413896,6.039286298640006 13.56190607413896,13.56190607413896 h20.34285911120844 c3.708333692147372,0 6.78095303706948,3.072619344922108 6.78095303706948,6.78095303706948 v33.9047651853474 h-6.78095303706948 V33.9047651853474 H6.78095303706948 v61.02857733362532 h67.8095303706948 V81.37143644483376 zM13.56190607413896,27.12381214827792 h54.24762429655584 c0,-3.708333692147372 -3.072619344922108,-6.78095303706948 -6.78095303706948,-6.78095303706948 h-6.78095303706948 c-3.708333692147372,0 -6.78095303706948,-3.072619344922108 -6.78095303706948,-6.78095303706948 s-3.072619344922108,-6.78095303706948 -6.78095303706948,-6.78095303706948 s-6.78095303706948,3.072619344922108 -6.78095303706948,6.78095303706948 s-3.072619344922108,6.78095303706948 -6.78095303706948,6.78095303706948 h-6.78095303706948 c-3.708333692147372,0 -6.78095303706948,3.072619344922108 -6.78095303706948,6.78095303706948 z" id="svg_1" class=""/></svg>',
  download: '<svg xmlns="http://www.w3.org/2000/svg" baseProfile="tiny" viewBox="0 0 100 100"><path fill-rule="evenodd" d="M88 84v-2c0-2.96-.86-4-4-4H16c-2.96 0-4 .98-4 4v2c0 3.102 1.04 4 4 4h68c3.02 0 4-.96 4-4zM58 12H42c-5 0-6 .94-6 6v22H16l34 34 34-34H64V18c0-5.06-1.06-6-6-6z"/></svg>',
  share: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path d="M36.764 50c0 .308-.07.598-.088.905l32.247 16.12c2.76-2.34 6.293-3.798 10.195-3.798C87.89 63.227 95 70.337 95 79.11 95 87.89 87.89 95 79.118 95c-8.78 0-15.882-7.11-15.882-15.89 0-.317.07-.6.088-.906l-32.247-16.12c-2.77 2.33-6.293 3.79-10.195 3.79C12.11 65.873 5 58.77 5 50c0-8.78 7.11-15.89 15.882-15.89 3.902 0 7.427 1.467 10.195 3.796l32.247-16.12c-.018-.307-.088-.597-.088-.913C63.236 12.11 70.338 5 79.118 5 87.89 5 95 12.11 95 20.873c0 8.78-7.11 15.89-15.882 15.89-3.91 0-7.436-1.467-10.195-3.805L36.676 49.086c.017.308.088.598.088.914z"/></svg>',
  warning: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 66.399998 66.399998"><g fill="red"><path d="M33.2 0C14.9 0 0 14.9 0 33.2c0 18.3 14.9 33.2 33.2 33.2 18.3 0 33.2-14.9 33.2-33.2C66.4 14.9 51.5 0 33.2 0zm0 59.4C18.7 59.4 7 47.6 7 33.2 7 18.7 18.8 7 33.2 7c14.4 0 26.2 11.8 26.2 26.2 0 14.4-11.8 26.2-26.2 26.2z"/><path d="M33.1 45.6c-1.4 0-2.5.5-3.5 1.5-.9 1-1.4 2.2-1.4 3.6 0 1.6.5 2.8 1.5 3.8 1 .9 2.1 1.3 3.4 1.3 1.3 0 2.4-.5 3.4-1.4 1-.9 1.5-2.2 1.5-3.7 0-1.4-.5-2.6-1.4-3.6-.9-1-2.1-1.5-3.5-1.5zM33.3 12.4c-1.5 0-2.8.5-3.7 1.6-.9 1-1.4 2.4-1.4 4.2 0 1.1.1 2.9.2 5.6l.8 13.1c.2 1.8.4 3.2.9 4.1.5 1.2 1.5 1.8 2.9 1.8 1.3 0 2.3-.7 2.9-1.9.5-1 .7-2.3.9-4l1.1-13.4c.1-1.3.2-2.5.2-3.8 0-2.2-.3-3.9-.8-5.1-.5-1-1.6-2.2-4-2.2z"/></g></svg>',
  fullscreen: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="5 -10 100 100"><path d="M5-10v38.89L21.667 12.22 38.334 28.89l5.555-5.556L27.22 6.667 43.89-10H5zM105-10v38.89L88.333 12.22 71.667 28.89l-5.556-5.556L82.778 6.667 66.11-10H105zM5 90V51.11l16.667 16.667L38.334 51.11l5.555 5.557L27.22 73.333 43.89 90H5zM105 90V51.11L88.333 67.778 71.667 51.11l-5.556 5.557 16.667 16.666L66.11 90H105z" fill="#010101"/></svg>',
  smallscreen: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="5 -10 100 100"><path d="M43.89 28.89V-10L27.22 6.667 10.555-10 5-4.445l16.667 16.667L5 28.89h38.89zM66.11 28.89V-10L82.78 6.667 99.444-10 105-4.445 88.334 12.222 105 28.89H66.11zM43.89 51.11V90L27.22 73.334 10.555 90 5 84.444l16.667-16.666L5 51.11h38.89zM66.11 51.11V90L82.78 73.334 99.444 90 105 84.444 88.334 67.778 105 51.11H66.11z" fill="#010101"/></svg>'
};

},{}],48:[function(require,module,exports){
"use strict";
//make sure any console statements
window.console = window.console || {
  log: function() {}
};

/**
 * Load libraries
 */
var $ = (function(){try{return require('jquery')}catch(e){return window.jQuery}})(),
  CodeMirror = (function(){try{return require('codemirror')}catch(e){return window.CodeMirror}})(),
  utils = require("./utils.js"),
  yutils = require("yasgui-utils"),
  imgs = require("./imgs.js"),
  Clipboard = require("clipboard");

require("../lib/deparam.js");
require("codemirror/addon/fold/foldcode.js");
require("codemirror/addon/fold/foldgutter.js");
require("codemirror/addon/fold/xml-fold.js");
require("codemirror/addon/fold/brace-fold.js");
require("./prefixFold.js");
require("codemirror/addon/hint/show-hint.js");
require("codemirror/addon/search/searchcursor.js");
require("codemirror/addon/edit/matchbrackets.js");
require("codemirror/addon/runmode/runmode.js");
require("codemirror/addon/display/fullscreen.js");
require("../lib/grammar/tokenizer.js");

/**
 * Main YATE constructor. Pass a DOM element as argument to append the editor to, and (optionally) pass along config settings (see the YATE.defaults object below, as well as the regular CodeMirror documentation, for more information on configurability)
 *
 * @constructor
 * @param {DOM-Element} parent element to append editor to.
 * @param {object} settings
 * @class YATE
 * @return {doc} YATE document
 */
var root = (module.exports = function(parent, config) {
  var rootEl = $("<div>", {
    class: "yate"
  }).appendTo($(parent));
  config = extendConfig(config);
  var yate = extendCmInstance(CodeMirror(rootEl[0], config));
  postProcessCmElement(yate);
  return yate;
});

/**
 * Extend config object, which we will pass on to the CM constructor later on.
 * Need this, to make sure our own 'onBlur' etc events do not get overwritten by
 * people who add their own onblur events to the config Additionally, need this
 * to include the CM defaults ourselves. CodeMirror has a method for including
 * defaults, but we can't rely on that one: it assumes flat config object, where
 * we have nested objects (e.g. the persistency option)
 *
 * @private
 */
var extendConfig = function(config) {
  var extendedConfig = $.extend(true, {}, root.defaults, config);

  // I know, codemirror deals with  default options as well.
  //However, it does not do this recursively (i.e. the persistency option)

  return extendedConfig;
};
/**
 * Add extra functions to the CM document (i.e. the codemirror instantiated
 * object)
 *
 * @private
 */
var extendCmInstance = function(yate) {

  //instantiate autocompleters
  yate.autocompleters = require("./autocompleters/autocompleterBase.js")(root, yate);
  if (yate.options.autocompleters) {
    yate.options.autocompleters.forEach(function(name) {
      if (root.Autocompleters[name]) yate.autocompleters.init(name, root.Autocompleters[name]);
    });
  }
  yate.emit = function(event, data) {
    root.signal(yate, event, data)
  }
  yate.lastQueryDuration = null;
  yate.getCompleteToken = function(token, cur) {
    return require("./tokenUtils.js").getCompleteToken(yate, token, cur);
  };
  yate.getPreviousNonWsToken = function(line, token) {
    return require("./tokenUtils.js").getPreviousNonWsToken(yate, line, token);
  };
  yate.getNextNonWsToken = function(lineNumber, charNumber) {
    return require("./tokenUtils.js").getNextNonWsToken(yate, lineNumber, charNumber);
  };
  yate.collapsePrefixes = function(collapse) {
    if (collapse === undefined) collapse = true;
    yate.foldCode(
      require("./prefixFold.js").findFirstPrefixLine(yate),
      root.fold.prefix,
      collapse ? "fold" : "unfold"
    );
  };
  var backdrop = null;
  var animateSpeed = null;
  yate.setBackdrop = function(show) {
    if (yate.options.backdrop || yate.options.backdrop === 0 || yate.options.backdrop === "0") {
      if (animateSpeed === null) {
        animateSpeed = +yate.options.backdrop;
        if (animateSpeed === 1) {
          //ah, yate.options.backdrop was 'true'. Set this to default animate speed 400
          animateSpeed = 400;
        }
      }

      if (!backdrop) {
        backdrop = $("<div>", {
          class: "backdrop"
        })
          .click(function() {
            $(this).hide();
          })
          .insertAfter($(yate.getWrapperElement()));
      }
      if (show) {
        backdrop.show(animateSpeed);
      } else {
        backdrop.hide(animateSpeed);
      }
    }
  };

  yate.getUrlArguments = function(config) {
    return root.getUrlArguments(yate, config);
  };

  /**
	 * Fetch defined prefixes from document string
	 *
	 * @method doc.getPrefixesFromDocument
	 * @return object
	 */
  yate.getPrefixesFromDocument = function() {
    return require("./prefixUtils.js").getPrefixesFromDocument(yate);
  };

  yate.addPrefixes = function(prefixes) {
    return require("./prefixUtils.js").addPrefixes(yate, prefixes);
  };
  yate.removePrefixes = function(prefixes) {
    return require("./prefixUtils.js").removePrefixes(yate, prefixes);
  };
  yasqe.getVariablesFromQuery = function() {
    //Use precise here. We want to be sure we use the most up to date state. If we're
    //not, we might get outdated info from the current query (creating loops such
    //as https://github.com/OpenTriply/YASGUI/issues/84)
    //on caveat: this function won't work when query is invalid (i.e. when typing)
    return $.map(yasqe.getTokenAt({ line: yasqe.lastLine(), ch: yasqe.getLine(yasqe.lastLine()).length }, true).state.variables, function(val,key) {return key});
  }
  //values in the form of {?var: 'value'}, or [{?var: 'value'}]
  yasqe.getQueryWithValues = function(values) {
    if (!values) return yasqe.getValue();
    var injectString;
    if (typeof values === 'string') {
      injectString = values;
    } else {
      //start building inject string
      if (!Array.isArray(values)) values = [values];
      var variables = values.reduce(function(vars, valueObj) {
        for (var v in valueObj) {
          vars[v] = v;
        }
        return vars;
      }, {})
      var varArray = [];
      for (var v in variables) {
        varArray.push(v);
      }

      if (!varArray.length) return yasqe.getValue() ;
      //ok, we've got enough info to start building the string now
      injectString = "VALUES (" + varArray.join(' ') + ") {\n";
      values.forEach(function(valueObj) {
        injectString += "( ";
        varArray.forEach(function(variable) {
          injectString += valueObj[variable] || "UNDEF"
        })
        injectString += " )\n"
      })
      injectString += "}\n"
    }
    if (!injectString) return yasqe.getValue();

    var newQuery = ""
    var injected = false;
    var gotSelect = false;
    root.runMode(yasqe.getValue(), "sparql11", function(stringVal, className, row, col, state) {
      if (className === "keyword" && stringVal.toLowerCase() === 'select') gotSelect = true;
      newQuery += stringVal;
      if (gotSelect && !injected && className === "punc" && stringVal === "{") {
        injected = true;
        //start injecting
        newQuery += "\n" + injectString;
      }
    });
    return newQuery
  }

  yate.getValueWithoutComments = function() {
    var cleanedDocument = "";
    root.runMode(yate.getValue(), "rdf11turtle", function(stringVal, className) {
      if (className != "comment") {
        cleanedDocument += stringVal;
      }
    });
    return cleanedDocument;
  };

  yate.setCheckSyntaxErrors = function(isEnabled) {
    yate.options.syntaxErrorCheck = isEnabled;
    checkSyntax(yate);
  };

  yate.enableCompleter = function(name) {
    addCompleterToSettings(yate.options, name);
    if (root.Autocompleters[name]) yate.autocompleters.init(name, root.Autocompleters[name]);
  };
  yate.disableCompleter = function(name) {
    removeCompleterFromSettings(yate.options, name);
  };

  return yate;
};

var addCompleterToSettings = function(settings, name) {
  if (!settings.autocompleters) settings.autocompleters = [];
  settings.autocompleters.push(name);
};
var removeCompleterFromSettings = function(settings, name) {
  if (typeof settings.autocompleters == "object") {
    var index = $.inArray(name, settings.autocompleters);
    if (index >= 0) {
      settings.autocompleters.splice(index, 1);
      removeCompleterFromSettings(settings, name); //just in case. suppose 1 completer is listed twice
    }
  }
};
var postProcessCmElement = function(yate) {
  /**
	 * Set doc value
	 */
  var storageId = utils.getPersistencyId(yate, yate.options.persistent);
  if (storageId) {
    var valueFromStorage = yutils.storage.get(storageId);
    if (valueFromStorage) yate.setValue(valueFromStorage);
  }

  root.drawButtons(yate);

  new Clipboard('#copy', {
        text: function(trigger) {
            return yate.getValue();
        }
  });

  /**
	 * Add event handlers
	 */
  yate.on("blur", function(yate, eventInfo) {
    root.storeDoc(yate);
  });
  yate.on("change", function(yate, eventInfo) {
    checkSyntax(yate);
    root.positionButtons(yate);
  });
  yate.on("changes", function() {
    //e.g. on paste
    checkSyntax(yate);
    root.positionButtons(yate);
  });

  yate.on("cursorActivity", function(yate, eventInfo) {
    updateButtonsTransparency(yate);
  });
  yate.prevDocValid = false;
  checkSyntax(yate); // on first load, check as well (our stored or default document might be incorrect)
  root.positionButtons(yate);

  $(yate.getWrapperElement())
    .on("mouseenter", ".cm-atom", function() {
      var matchText = $(this).text();
      $(yate.getWrapperElement())
        .find(".cm-atom")
        .filter(function() {
          return $(this).text() === matchText;
        })
        .addClass("matchingVar");
    })
    .on("mouseleave", ".cm-atom", function() {
      $(yate.getWrapperElement()).find(".matchingVar").removeClass("matchingVar");
    });
  /**
	 * check url args and modify yate settings if needed
	 */
  if (yate.options.consumeShareLink) {
    yate.options.consumeShareLink(yate, getUrlParams());
    //and: add a hash listener!
    window.addEventListener("hashchange", function() {
      yate.options.consumeShareLink(yate, getUrlParams());
    });
  }
  if (yate.options.collapsePrefixesOnLoad) yate.collapsePrefixes(true);
};

/**
 * get url params. first try fetching using hash. If it fails, try the regular doc parameters (for backwards compatability)
 */
var getUrlParams = function() {
  //first try hash
  var urlParams = null;
  if (window.location.hash.length > 1) {
    //firefox does some decoding if we're using window.location.hash (e.g. the + sign in contentType settings)
    //Don't want this. So simply get the hash string ourselves
    urlParams = $.deparam(location.href.split("#")[1]);
  }
  if ((!urlParams || !("doc" in urlParams)) && window.location.search.length > 1) {
    //ok, then just try regular url params
    urlParams = $.deparam(window.location.search.substring(1));
  }
  return urlParams;
};

/**
 * Update transparency of buttons. Increase transparency when cursor is below buttons
 */

var updateButtonsTransparency = function(yate) {
  yate.cursor = $(".CodeMirror-cursor");
  if (yate.buttons && yate.buttons.is(":visible") && yate.cursor.length > 0) {
    if (utils.elementsOverlap(yate.cursor, yate.buttons)) {
      yate.buttons.find("svg").attr("opacity", "0.2");
    } else {
      yate.buttons.find("svg").attr("opacity", "1.0");
    }
  }
};

var clearError = null;
var checkSyntax = function(yate, deepcheck) {
  yate.docValid = true;

  yate.clearGutter("gutterErrorBar");

  var state = null;
  for (var l = 0; l < yate.lineCount(); ++l) {
    var precise = false;
    if (!yate.prevDocValid) {
      // we don't want cached information in this case, otherwise the
      // previous error sign might still show up,
      // even though the syntax error might be gone already
      precise = true;
    }

    var token = yate.getTokenAt(
      {
        line: l,
        ch: yate.getLine(l).length
      },
      precise
    );
    var state = token.state;
    if (state.OK == false) {
      if (!yate.options.syntaxErrorCheck) {
        //the library we use already marks everything as being an error. Overwrite this class attribute.
        $(yate.getWrapperElement()).find(".sp-error").css("color", "black");
        //we don't want to gutter error, so return
        return;
      }

      var warningEl = yutils.svg.getElement(imgs.warning);
      if (state.errorMsg) {
        require("./tooltip")(yate, warningEl, function() {
          return $("<div/>").text(token.state.errorMsg).html();
        });
      } else if (state.possibleCurrent && state.possibleCurrent.length > 0) {
        //				warningEl.style.zIndex = "99999999";
        require("./tooltip")(yate, warningEl, function() {
          var expectedEncoded = [];
          state.possibleCurrent.forEach(function(expected) {
            expectedEncoded.push(
              "<strong style='text-decoration:underline'>" + $("<div/>").text(expected).html() + "</strong>"
            );
          });
          return "This line is invalid. Expected: " + expectedEncoded.join(", ");
        });
      }
      warningEl.style.marginTop = "2px";
      warningEl.style.marginLeft = "2px";
      warningEl.className = "parseErrorIcon";
      yate.setGutterMarker(l, "gutterErrorBar", warningEl);

      yate.docValid = false;
      break;
    }
  }
  yate.prevDocValid = yate.docValid;
  if (deepcheck) {
    if (state != null && state.stack != undefined) {
      var stack = state.stack, len = state.stack.length;
      // Because incremental parser doesn't receive end-of-input
      // it can't clear stack, so we have to check that whatever
      // is left on the stack is nillable
      if (len > 1) yate.docValid = false;
      else if (len == 1) {
        if (stack[0] != "solutionModifier" && stack[0] != "?limitOffsetClauses" && stack[0] != "?offsetClause")
          yate.docValid = false;
      }
    }
  }
};
/**
 * Static Utils
 */
// first take all CodeMirror references and store them in the YATE object
$.extend(root, CodeMirror);

//add registrar for autocompleters
root.Autocompleters = {};
root.registerAutocompleter = function(name, constructor) {
  root.Autocompleters[name] = constructor;
  addCompleterToSettings(root.defaults, name);
};

root.autoComplete = function(yate) {
  //this function gets called when pressing the keyboard shortcut. I.e., autoShow = false
  yate.autocompleters.autoComplete(false);
};
//include the autocompleters we provide out-of-the-box
root.registerAutocompleter("prefixes", require("./autocompleters/prefixes.js"));
root.registerAutocompleter("properties", require("./autocompleters/properties.js"));
root.registerAutocompleter("classes", require("./autocompleters/classes.js"));
root.registerAutocompleter("variables", require("./autocompleters/variables.js"));

root.positionButtons = function(yate) {
  var scrollBar = $(yate.getWrapperElement()).find(".CodeMirror-vscrollbar");
  var offset = 0;
  if (scrollBar.is(":visible")) {
    offset = scrollBar.outerWidth();
  }
  if (yate.buttons.is(":visible")) yate.buttons.css("right", offset + 4);
};

/**
 * Create a share link
 *
 * @method YATE.createShareLink
 * @param {yate} YATE document
 * @default {doc: doc.getValue()}
 * @return object
 */
root.createShareLink = function(yate) {
  //extend existing link, so first fetch current arguments
  var urlParams = {};
  if (window.location.hash.length > 1) urlParams = $.deparam(window.location.hash.substring(1));
  urlParams["doc"] = yate.getValue();
  return urlParams;
};
/**
 * Consume the share link, by parsing the document URL for possible yate arguments, and setting the appropriate values in the YATE doc
 *
 * @method YATE.consumeShareLink
 * @param {yate} YATE document
 */
root.consumeShareLink = function(yate, urlParams) {
  if (urlParams && urlParams.doc) {
    yate.setValue(urlParams.doc);
  }
};
root.drawButtons = function(yate) {
  yate.buttons = $("<div class='yate_buttons'></div>").appendTo($(yate.getWrapperElement()));

  /**
	 * draw share link button
	 */
  if (yate.options.createShareLink) {
    var svgShare = $(yutils.svg.getElement(imgs.share));
    svgShare
      .click(function(event) {
        event.stopPropagation();
        var popup = $("<div class='yate_sharePopup'></div>").appendTo(yate.buttons);
        $("html").click(function() {
          if (popup) popup.remove();
        });

        popup.click(function(event) {
          event.stopPropagation();
        });
        var $input = $("<input>").val(
          location.protocol +
            "//" +
            location.host +
            location.pathname +
            location.search +
            "#" +
            $.param(yate.options.createShareLink(yate))
        );

        $input.focus(function() {
          var $this = $(this);
          $this.select();

          // Work around Chrome's little problem
          $this.mouseup(function() {
            // Prevent further mouseup intervention
            $this.unbind("mouseup");
            return false;
          });
        });

        popup.empty().append($("<div>", { class: "inputWrapper" }).append($input));
        if (yate.options.createShortLink) {
          popup.addClass("enableShort");
          $("<button>Shorten</button>")
            .addClass("yate_btn yate_btn-sm yate_btn-primary")
            .click(function() {
              $(this).parent().find("button").attr("disabled", "disabled");
              yate.options.createShortLink($input.val(), function(errString, shortLink) {
                if (errString) {
                  $input.remove();
                  popup.find(".inputWrapper").append($("<span>", { class: "shortlinkErr" }).text(errString));
                } else {
                  $input.val(shortLink).focus();
                }
              });
            })
            .appendTo(popup);
        }
        var positions = svgShare.position();
        popup
          .css("top", positions.top + svgShare.outerHeight() + parseInt(popup.css("padding-top")) + "px")
          .css("left", positions.left + svgShare.outerWidth() - popup.outerWidth() + "px");
        $input.focus();
      })
      .addClass("yate_share")
      .attr("title", "Share your document")
      .appendTo(yate.buttons);
  }

  /**
   * draw download button
   */

  var downloadButton = $("<div>", {
    class: "downloadBtns"
  })
    .append(
      $(yutils.svg.getElement(imgs.download))
        .addClass("yate_downloadBtn")
        .attr("title", "Download File")
        .click(function() {          
          var textFileAsBlob = new Blob([ yate.getValue() ], { type: 'text/turtle' });
          var fileNameToSaveAs = "document.ttl";

          var downloadLink = document.createElement("a");
          downloadLink.download = fileNameToSaveAs;
          downloadLink.innerHTML = "Download File";
          if (window.URL != null) {
            // Chrome allows the link to be clicked without actually adding it to the DOM.
            downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
          } else {
            // Firefox requires the link to be added to the DOM before it can be clicked.
            downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
            downloadLink.onclick = destroyClickedElement;
            downloadLink.style.display = "none";
            document.body.appendChild(downloadLink);
          }
          downloadLink.click();
        })
    );
  yate.buttons.append(downloadButton);


  /**
   * draw copy button
   */

  var copyButton = $("<div>", {
    class: "downloadBtns"
  })
    .append(
      $(yutils.svg.getElement(imgs.copy))
        .addClass("yate_downloadBtn")
        .attr("id", "copy")
        .attr("title", "Copy to the clipboard")
      );
  yate.buttons.append(copyButton);

  /**
	 * draw fullscreen button
	 */

  var toggleFullscreen = $("<div>", {
    class: "fullscreenToggleBtns"
  })
    .append(
      $(yutils.svg.getElement(imgs.fullscreen))
        .addClass("yate_fullscreenBtn")
        .attr("title", "Set editor full screen")
        .click(function() {
          yate.setOption("fullScreen", true);
          yate.emit('fullscreen-enter')
        })
    )
    .append(
      $(yutils.svg.getElement(imgs.smallscreen))
        .addClass("yate_smallscreenBtn")
        .attr("title", "Set editor to normal size")
        .click(function() {
          yate.setOption("fullScreen", false);
          yate.emit('fullscreen-leave')
        })
    );
  yate.buttons.append(toggleFullscreen);

};

/**
 * Initialize YATE from an existing text area (see http://codemirror.net/doc/manual.html#fromTextArea for more info)
 *
 * @method YATE.fromTextArea
 * @param textArea {DOM element}
 * @param config {object}
 * @returns {doc} YATE document
 */
root.fromTextArea = function(textAreaEl, config) {
  config = extendConfig(config);
  //add yate div as parent (needed for styles to be manageable and scoped).
  //In this case, I -also- put it as parent el of the text area. This is wrapped in a div now
  var rootEl = $("<div>", {
    class: "yate"
  })
    .insertBefore($(textAreaEl))
    .append($(textAreaEl));
  var yate = extendCmInstance(CodeMirror.fromTextArea(textAreaEl, config));
  postProcessCmElement(yate);
  return yate;
};

root.storeDoc = function(yate) {
  var storageId = utils.getPersistencyId(yate, yate.options.persistent);
  if (storageId) {
    yutils.storage.set(storageId, yate.getValue(), "month", yate.options.onQuotaExceeded);
  }
};
root.commentLines = function(yate) {
  var startLine = yate.getCursor(true).line;
  var endLine = yate.getCursor(false).line;
  var min = Math.min(startLine, endLine);
  var max = Math.max(startLine, endLine);

  // if all lines start with #, remove this char. Otherwise add this char
  var linesAreCommented = true;
  for (var i = min; i <= max; i++) {
    var line = yate.getLine(i);
    if (line.length == 0 || line.substring(0, 1) != "#") {
      linesAreCommented = false;
      break;
    }
  }
  for (var i = min; i <= max; i++) {
    if (linesAreCommented) {
      // lines are commented, so remove comments
      yate.replaceRange(
        "",
        {
          line: i,
          ch: 0
        },
        {
          line: i,
          ch: 1
        }
      );
    } else {
      // Not all lines are commented, so add comments
      yate.replaceRange("#", {
        line: i,
        ch: 0
      });
    }
  }
};

root.copyLineUp = function(yate) {
  var cursor = yate.getCursor();
  var lineCount = yate.lineCount();
  // First create new empty line at end of text
  yate.replaceRange("\n", {
    line: lineCount - 1,
    ch: yate.getLine(lineCount - 1).length
  });
  // Copy all lines to their next line
  for (var i = lineCount; i > cursor.line; i--) {
    var line = yate.getLine(i - 1);
    yate.replaceRange(
      line,
      {
        line: i,
        ch: 0
      },
      {
        line: i,
        ch: yate.getLine(i).length
      }
    );
  }
};
root.copyLineDown = function(yate) {
  root.copyLineUp(yate);
  // Make sure cursor goes one down (we are copying downwards)
  var cursor = yate.getCursor();
  cursor.line++;
  yate.setCursor(cursor);
};
root.doAutoFormat = function(yate) {
  if (!yate.somethingSelected()) yate.execCommand("selectAll");
  var to = {
    line: yate.getCursor(false).line,
    ch: yate.getSelection().length
  };
  autoFormatRange(yate, yate.getCursor(true), to);
};

var autoFormatRange = function(yate, from, to) {
  var absStart = yate.indexFromPos(from);
  var absEnd = yate.indexFromPos(to);
  // Insert additional line breaks where necessary according to the
  // mode's syntax
  var res = autoFormatLineBreaks(yate.getValue(), absStart, absEnd);

  // Replace and auto-indent the range
  yate.operation(function() {
    yate.replaceRange(res, from, to);
    var startLine = yate.posFromIndex(absStart).line;
    var endLine = yate.posFromIndex(absStart + res.length).line;
    for (var i = startLine; i <= endLine; i++) {
      yate.indentLine(i, "smart");
    }
  });
};



var autoFormatLineBreaks = function(text, start, end) {
  text = text.substring(start, end);
  var breakAfterArray = [
    ["keyword", "ws", "prefixed", "ws", "uri"], // i.e. prefix declaration
    ["keyword", "ws", "uri"] // i.e. base
  ];
  var breakAfterCharacters = ["{", ".", ";"];
  var breakBeforeCharacters = ["}"];
  var getBreakType = function(stringVal, type) {
    for (var i = 0; i < breakAfterArray.length; i++) {
      if (stackTrace.valueOf().toString() == breakAfterArray[i].valueOf().toString()) {
        return 1;
      }
    }
    for (var i = 0; i < breakAfterCharacters.length; i++) {
      if (stringVal == breakAfterCharacters[i]) {
        return 1;
      }
    }
    for (var i = 0; i < breakBeforeCharacters.length; i++) {
      // don't want to issue 'breakbefore' AND 'breakafter', so check
      // current line
      if ($.trim(currentLine) != "" && stringVal == breakBeforeCharacters[i]) {
        return -1;
      }
    }
    return 0;
  };
  var formattedDoc = "";
  var currentLine = "";
  var stackTrace = [];
  CodeMirror.runMode(text, "rdf11turtle", function(stringVal, type) {
    stackTrace.push(type);
    var breakType = getBreakType(stringVal, type);
    if (breakType != 0) {
      if (breakType == 1) {
        formattedDoc += stringVal + "\n";
        currentLine = "";
      } else {
        // (-1)
        formattedDoc += "\n" + stringVal;
        currentLine = stringVal;
      }
      stackTrace = [];
    } else {
      currentLine += stringVal;
      formattedDoc += stringVal;
    }
    if (stackTrace.length == 1 && stackTrace[0] == "sp-ws") stackTrace = [];
  });
  return $.trim(formattedDoc.replace(/\n\s*\n/g, "\n"));
};

require("./defaults.js");
root.$ = $;
root.version = {
  CodeMirror: CodeMirror.version,
  YATE: require("../package.json").version,
  jquery: $.fn.jquery,
  "yasgui-utils": yutils.version
};


},{"../lib/deparam.js":1,"../lib/grammar/tokenizer.js":3,"../package.json":38,"./autocompleters/autocompleterBase.js":39,"./autocompleters/classes.js":40,"./autocompleters/prefixes.js":41,"./autocompleters/properties.js":42,"./autocompleters/variables.js":44,"./defaults.js":45,"./imgs.js":47,"./prefixFold.js":49,"./prefixUtils.js":50,"./tokenUtils.js":51,"./tooltip":52,"./utils.js":53,"clipboard":6,"codemirror":undefined,"codemirror/addon/display/fullscreen.js":7,"codemirror/addon/edit/matchbrackets.js":8,"codemirror/addon/fold/brace-fold.js":9,"codemirror/addon/fold/foldcode.js":10,"codemirror/addon/fold/foldgutter.js":11,"codemirror/addon/fold/xml-fold.js":12,"codemirror/addon/hint/show-hint.js":13,"codemirror/addon/runmode/runmode.js":14,"codemirror/addon/search/searchcursor.js":15,"jquery":undefined,"yasgui-utils":35}],49:[function(require,module,exports){
var CodeMirror = (function(){try{return require('codemirror')}catch(e){return window.CodeMirror}})(), tokenUtils = require("./tokenUtils.js");

("use strict");
var lookFor = "PREFIX ";
module.exports = {
  findFirstPrefixLine: function(cm) {
    var lastLine = cm.lastLine();
    for (var i = 0; i <= lastLine; ++i) {
      if (findFirstPrefix(cm, i) >= 0) {
        return i;
      }
    }
  }
};

function findFirstPrefix(cm, line, ch, lineText) {
  if (!ch) ch = 0;
  if (!lineText) lineText = cm.getLine(line);
  lineText = lineText.toUpperCase();
  for (var at = ch, pass = 0; ; ) {
    var found = lineText.indexOf(lookFor, at);
    if (found == -1) {
      //no prefix on this line
      if (pass == 1) break;
      pass = 1;
      at = lineText.length;
      continue;
    }
    if (pass == 1 && found < ch) break;
    var tokenType = cm.getTokenTypeAt(CodeMirror.Pos(line, found + 1));
    if (!/^(comment|string)/.test(tokenType)) return found + 1;
    if (!/(comment)/.test(tokenType)) break;
    
    //Could not find a prefix, no use looping any further. Probably invalid query
    if (at === pass) break;
  }
}

CodeMirror.registerHelper("fold", "prefix", function(cm, start) {
  var line = start.line, lineText = cm.getLine(line);

  var startCh, tokenType;

  function hasPreviousPrefix() {
    var hasPreviousPrefix = false;
    for (var i = line - 1; i >= 0; i--) {
      if (cm.getLine(i).toUpperCase().indexOf(lookFor) >= 0) {
        hasPreviousPrefix = true;
        break;
      }
    }
    return hasPreviousPrefix;
  }

  function findOpening(openCh) {
    for (var at = start.ch, pass = 0; ; ) {
      var found = at <= 0 ? -1 : lineText.lastIndexOf(openCh, at - 1);
      if (found == -1) {
        if (pass == 1) break;
        pass = 1;
        at = lineText.length;
        continue;
      }
      if (pass == 1 && found < start.ch) break;
      tokenType = cm.getTokenTypeAt(CodeMirror.Pos(line, found + 1));
      if (!/^(comment|string)/.test(tokenType)) return found + 1;
      at = found - 1;
    }
  }
  var getLastPrefixPos = function(line, ch) {
    var prefixKeywordToken = cm.getTokenAt(CodeMirror.Pos(line, ch + 1));
    if (!prefixKeywordToken || prefixKeywordToken.type != "keyword") return -1;
    var prefixShortname = tokenUtils.getNextNonWsToken(cm, line, prefixKeywordToken.end + 1);
    if (!prefixShortname || prefixShortname.type != "string-2") return -1; //missing prefix keyword shortname
    var prefixUri = tokenUtils.getNextNonWsToken(cm, line, prefixShortname.end + 1);
    if (!prefixUri || prefixUri.type != "variable-3") return -1; //missing prefix uri
    return prefixUri.end;
  };

  //only use opening prefix declaration
  if (hasPreviousPrefix()) return;
  var prefixStart = findFirstPrefix(cm, line, start.ch, lineText);

  if (prefixStart == null) return;
  var stopAt = "{"; //if this char is there, we won't have a chance of finding more prefixes
  var stopAtNextLine = false;
  var count = 1, lastLine = cm.lastLine(), end, endCh;
  var prefixEndChar = getLastPrefixPos(line, prefixStart);
  var prefixEndLine = line;

  outer:
  for (var i = line; i <= lastLine; ++i) {
    if (stopAtNextLine) break;
    var text = cm.getLine(i), pos = i == line ? prefixStart + 1 : 0;

    for (;;) {
      if (!stopAtNextLine && text.indexOf(stopAt) >= 0) stopAtNextLine = true;

      var nextPrefixDeclaration = text.toUpperCase().indexOf(lookFor, pos);

      if (nextPrefixDeclaration >= 0) {
        if ((endCh = getLastPrefixPos(i, nextPrefixDeclaration)) > 0) {
          prefixEndChar = endCh;
          prefixEndLine = i;
          pos = prefixEndChar;
        }
        pos++;
      } else {
        break;
      }
    }
  }
  return {
    from: CodeMirror.Pos(line, prefixStart + lookFor.length),
    to: CodeMirror.Pos(prefixEndLine, prefixEndChar)
  };
});

},{"./tokenUtils.js":51,"codemirror":undefined}],50:[function(require,module,exports){
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
  yate.replaceRange("@prefix " + prefixString + "\n", {
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

},{}],51:[function(require,module,exports){
"use strict";
/**
 * When typing a document, this document is sometimes syntactically invalid, causing
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

},{}],52:[function(require,module,exports){
"use strict";
var $ = (function(){try{return require('jquery')}catch(e){return window.jQuery}})(), utils = require("./utils.js");

/**
 * Write our own tooltip, to avoid loading another library for just this functionality. For now, we only use tooltip for showing parse errors, so this is quite a tailored solution
 * Requirements: 
 * 		position tooltip within codemirror frame as much as possible, to avoid z-index issues with external things on page
 * 		use html as content
 */
module.exports = function(yate, parent, html) {
  var parent = $(parent);
  var tooltip;
  parent.hover(
    function() {
      if (typeof html == "function") html = html();
      tooltip = $("<div>").addClass("yate_tooltip").html(html).appendTo(parent);
      repositionTooltip();
    },
    function() {
      $(".yate_tooltip").remove();
    }
  );

  /**
	 * only need to take into account top and bottom offset for this usecase
	 */
  var repositionTooltip = function() {
    if ($(yate.getWrapperElement()).offset().top >= tooltip.offset().top) {
      //shit, move the tooltip down. The tooltip now hovers over the top edge of the yate instance
      tooltip.css("bottom", "auto");
      tooltip.css("top", "26px");
    }
  };
};

},{"./utils.js":53,"jquery":undefined}],53:[function(require,module,exports){
"use strict";
var $ = (function(){try{return require('jquery')}catch(e){return window.jQuery}})();

var keyExists = function(objectToTest, key) {
  var exists = false;
  try {
    if (objectToTest[key] !== undefined) exists = true;
  } catch (e) {}
  return exists;
};

var getPersistencyId = function(yate, persistentIdCreator) {
  var persistencyId = null;

  if (persistentIdCreator) {
    if (typeof persistentIdCreator == "string") {
      persistencyId = persistentIdCreator;
    } else {
      persistencyId = persistentIdCreator(yate);
    }
  }
  return persistencyId;
};

var elementsOverlap = (function() {
  function getPositions(elem) {
    var pos, width, height;
    pos = $(elem).offset();
    width = $(elem).width();
    height = $(elem).height();
    return [[pos.left, pos.left + width], [pos.top, pos.top + height]];
  }

  function comparePositions(p1, p2) {
    var r1, r2;
    r1 = p1[0] < p2[0] ? p1 : p2;
    r2 = p1[0] < p2[0] ? p2 : p1;
    return r1[1] > r2[0] || r1[0] === r2[0];
  }

  return function(a, b) {
    var pos1 = getPositions(a), pos2 = getPositions(b);
    return comparePositions(pos1[0], pos2[0]) && comparePositions(pos1[1], pos2[1]);
  };
})();

var getString = function(yate, item) {
  if (typeof item == "function") {
    return item(yate);
  } else {
    return item;
  }
};
module.exports = {
  keyExists: keyExists,
  getPersistencyId: getPersistencyId,
  elementsOverlap: elementsOverlap,
  getString: getString
};

},{"jquery":undefined}]},{},[46])(46)
});
//# sourceMappingURL=yate.js.map
