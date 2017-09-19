/**
 * The default options of YATE (check the CodeMirror documentation for even
 * more options, such as disabling line numbers, or changing keyboard shortcut
 * keys). Either change the default options by setting YATE.defaults, or by
 * passing your own options as second argument to the YATE constructor
 */
var $ = require("jquery"), YATE = require("./main.js");
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
