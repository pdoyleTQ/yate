"use strict";
//make sure any console statements
window.console = window.console || {
  log: function() {}
};

/**
 * Load libraries
 */
var $ = require("jquery"),
  CodeMirror = require("codemirror"),
  utils = require("./utils.js"),
  yutils = require("yasgui-utils"),
  imgs = require("./imgs.js");

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
  /**
	 * Execute query. Pass a callback function, or a configuration object (see
	 * default settings below for possible values) I.e., you can change the
	 * query configuration by either changing the default settings, changing the
	 * settings of this document, or by passing query settings to this function
	 *
	 * @method doc.query
	 * @param function|object
	 */
  yate.query = function(callbackOrConfig) {
    root.executeQuery(yate, callbackOrConfig);
  };

  yate.getUrlArguments = function(config) {
    return root.getUrlArguments(yate, config);
  };

  /**
	 * Fetch defined prefixes from query string
	 *
	 * @method doc.getPrefixesFromQuery
	 * @return object
	 */
  yate.getPrefixesFromQuery = function() {
    return require("./prefixUtils.js").getPrefixesFromQuery(yate);
  };

  yate.addPrefixes = function(prefixes) {
    return require("./prefixUtils.js").addPrefixes(yate, prefixes);
  };
  yate.removePrefixes = function(prefixes) {
    return require("./prefixUtils.js").removePrefixes(yate, prefixes);
  };

  yate.getValueWithoutComments = function() {
    var cleanedQuery = "";
    root.runMode(yate.getValue(), "rdf11turtle", function(stringVal, className) {
      if (className != "comment") {
        cleanedQuery += stringVal;
      }
    });
    return cleanedQuery;
  };
  /**
	 * Fetch the query type (e.g., SELECT||DESCRIBE||INSERT||DELETE||ASK||CONSTRUCT)
	 *
	 * @method doc.getQueryType
	 * @return string
	 *
	 */
  yate.getQueryType = function() {
    return yate.queryType;
  };
  /**
	 * Fetch the query mode: 'query' or 'update'
	 *
	 * @method doc.getQueryMode
	 * @return string
	 *
	 */
  yate.getQueryMode = function() {
    var type = yate.getQueryType();
    if (
      type == "INSERT" ||
      type == "DELETE" ||
      type == "LOAD" ||
      type == "CLEAR" ||
      type == "CREATE" ||
      type == "DROP" ||
      type == "COPY" ||
      type == "MOVE" ||
      type == "ADD"
    ) {
      return "update";
    } else {
      return "query";
    }
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

  /**
	 * Add event handlers
	 */
  yate.on("blur", function(yate, eventInfo) {
    root.storeQuery(yate);
  });
  yate.on("change", function(yate, eventInfo) {
    checkSyntax(yate);
    root.updateQueryButton(yate);
    root.positionButtons(yate);
  });
  yate.on("changes", function() {
    //e.g. on paste
    checkSyntax(yate);
    root.updateQueryButton(yate);
    root.positionButtons(yate);
  });

  yate.on("cursorActivity", function(yate, eventInfo) {
    updateButtonsTransparency(yate);
  });
  yate.prevQueryValid = false;
  checkSyntax(yate); // on first load, check as well (our stored or default query might be incorrect)
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
 * get url params. first try fetching using hash. If it fails, try the regular query parameters (for backwards compatability)
 */
var getUrlParams = function() {
  //first try hash
  var urlParams = null;
  if (window.location.hash.length > 1) {
    //firefox does some decoding if we're using window.location.hash (e.g. the + sign in contentType settings)
    //Don't want this. So simply get the hash string ourselves
    urlParams = $.deparam(location.href.split("#")[1]);
  }
  if ((!urlParams || !("query" in urlParams)) && window.location.search.length > 1) {
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
  yate.queryValid = true;

  yate.clearGutter("gutterErrorBar");

  var state = null;
  for (var l = 0; l < yate.lineCount(); ++l) {
    var precise = false;
    if (!yate.prevQueryValid) {
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
    yate.queryType = state.queryType;
    if (state.OK == false) {
      if (!yate.options.syntaxErrorCheck) {
        //the library we use already marks everything as being an error. Overwrite this class attribute.
        $(yate.getWrapperElement).find(".sp-error").css("color", "black");
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

      yate.queryValid = false;
      break;
    }
  }
  yate.prevQueryValid = yate.queryValid;
  if (deepcheck) {
    if (state != null && state.stack != undefined) {
      var stack = state.stack, len = state.stack.length;
      // Because incremental parser doesn't receive end-of-input
      // it can't clear stack, so we have to check that whatever
      // is left on the stack is nillable
      if (len > 1) yate.queryValid = false;
      else if (len == 1) {
        if (stack[0] != "solutionModifier" && stack[0] != "?limitOffsetClauses" && stack[0] != "?offsetClause")
          yate.queryValid = false;
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
 * @param {doc} YATE document
 * @default {query: doc.getValue()}
 * @return object
 */
root.createShareLink = function(yate) {
  //extend existing link, so first fetch current arguments
  var urlParams = {};
  if (window.location.hash.length > 1) urlParams = $.deparam(window.location.hash.substring(1));
  urlParams["query"] = yate.getValue();
  return urlParams;
};
root.getAsCurl = function(yate, ajaxConfig) {
  var curl = require("./curl.js");
  return curl.createCurlString(yate, ajaxConfig);
};
/**
 * Consume the share link, by parsing the document URL for possible yate arguments, and setting the appropriate values in the YATE doc
 *
 * @method YATE.consumeShareLink
 * @param {doc} YATE document
 */
root.consumeShareLink = function(yate, urlParams) {
  if (urlParams && urlParams.query) {
    yate.setValue(urlParams.query);
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
        $("<button>CURL</button>")
          .addClass("yate_btn yate_btn-sm yate_btn-primary")
          .click(function() {
            $(this).parent().find("button").attr("disabled", "disabled");
            $input.val(root.getAsCurl(yate)).focus();
          })
          .appendTo(popup);
        var positions = svgShare.position();
        popup
          .css("top", positions.top + svgShare.outerHeight() + parseInt(popup.css("padding-top")) + "px")
          .css("left", positions.left + svgShare.outerWidth() - popup.outerWidth() + "px");
        $input.focus();
      })
      .addClass("yate_share")
      .attr("title", "Share your query")
      .appendTo(yate.buttons);
  }

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
        })
    )
    .append(
      $(yutils.svg.getElement(imgs.smallscreen))
        .addClass("yate_smallscreenBtn")
        .attr("title", "Set editor to normal size")
        .click(function() {
          yate.setOption("fullScreen", false);
        })
    );
  yate.buttons.append(toggleFullscreen);

  if (yate.options.sparql.showQueryButton) {
    $("<div>", {
      class: "yate_queryButton"
    })
      .click(function() {
        if ($(this).hasClass("query_busy")) {
          if (yate.xhr) yate.xhr.abort();
          root.updateQueryButton(yate);
        } else {
          yate.query();
        }
      })
      .appendTo(yate.buttons);
    root.updateQueryButton(yate);
  }
};

var queryButtonIds = {
  busy: "loader",
  valid: "query",
  error: "queryInvalid"
};

/**
 * Update the query button depending on current query status. If no query status is passed via the parameter, it auto-detects the current query status
 *
 * @param {doc} YATE document
 * @param status {string|null, "busy"|"valid"|"error"}
 */
root.updateQueryButton = function(yate, status) {
  var queryButton = $(yate.getWrapperElement()).find(".yate_queryButton");
  if (queryButton.length == 0) return; //no query button drawn

  //detect status
  if (!status) {
    status = "valid";
    if (yate.queryValid === false) status = "error";
  }

  if (status != yate.queryStatus) {
    queryButton.empty().removeClass(function(index, classNames) {
      return classNames
        .split(" ")
        .filter(function(c) {
          //remove classname from previous status
          return c.indexOf("query_") == 0;
        })
        .join(" ");
    });

    if (status == "busy") {
      queryButton.append(
        $("<div>", {
          class: "loader"
        })
      );
      yate.queryStatus = status;
    } else if (status == "valid" || status == "error") {
      queryButton.addClass("query_" + status);
      yutils.svg.draw(queryButton, imgs[queryButtonIds[status]]);
      yate.queryStatus = status;
    }
  }
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

root.storeQuery = function(yate) {
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
  var formattedQuery = "";
  var currentLine = "";
  var stackTrace = [];
  CodeMirror.runMode(text, "rdf11turtle", function(stringVal, type) {
    stackTrace.push(type);
    var breakType = getBreakType(stringVal, type);
    if (breakType != 0) {
      if (breakType == 1) {
        formattedQuery += stringVal + "\n";
        currentLine = "";
      } else {
        // (-1)
        formattedQuery += "\n" + stringVal;
        currentLine = stringVal;
      }
      stackTrace = [];
    } else {
      currentLine += stringVal;
      formattedQuery += stringVal;
    }
    if (stackTrace.length == 1 && stackTrace[0] == "sp-ws") stackTrace = [];
  });
  return $.trim(formattedQuery.replace(/\n\s*\n/g, "\n"));
};

require("./sparql.js"), require("./defaults.js");
root.$ = $;
root.version = {
  CodeMirror: CodeMirror.version,
  YATE: require("../package.json").version,
  jquery: $.fn.jquery,
  "yasgui-utils": yutils.version
};
