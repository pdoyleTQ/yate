"use strict";
var $ = require("jquery"),
  utils = require("./utils.js"),
  YATE = require("./main.js");

YATE.getAjaxConfig = function(yate, callbackOrConfig) {
  var callback = typeof callbackOrConfig == "function" ? callbackOrConfig : null;
  var config = typeof callbackOrConfig == "object" ? callbackOrConfig : {};

  if (yate.options.sparql) config = $.extend({}, yate.options.sparql, config);

  //for backwards compatability, make sure we copy sparql handlers to sparql callbacks
  if (config.handlers) $.extend(true, config.callbacks, config.handlers);

  if (!config.endpoint || config.endpoint.length == 0) return; // nothing to query!
  var queryMode = yate.getQueryMode();
  /**
	 * initialize ajax config
	 */
  var ajaxConfig = {
    url: typeof config.endpoint == "function" ? config.endpoint(yate) : config.endpoint,
    type: queryMode == "update"
      ? "POST"
      : typeof config.requestMethod == "function" ? config.requestMethod(yate) : config.requestMethod,
    headers: {
      Accept: getAcceptHeader(yate, config)
    }
  };
  if (config.xhrFields) ajaxConfig.xhrFields = config.xhrFields;
  /**
	 * add complete, beforesend, etc callbacks (if specified)
	 */
  var handlerDefined = false;
  if (config.callbacks) {
    for (var handler in config.callbacks) {
      if (config.callbacks[handler]) {
        handlerDefined = true;
        ajaxConfig[handler] = config.callbacks[handler];
      }
    }
  }
  if (ajaxConfig.type === "GET") {
    //we need to do encoding ourselve, as jquery does not properly encode the url string
    //https://github.com/OpenTriply/YASGUI/issues/75
    var first = true;
    $.each(yate.getUrlArguments(config), function(key, val) {
      ajaxConfig.url += (first ? "?" : "&") + val.name + "=" + encodeURIComponent(val.value);
      first = false;
    });
  } else {
    ajaxConfig.data = yate.getUrlArguments(config);
  }
  if (!handlerDefined && !callback) return; // ok, we can query, but have no callbacks. just stop now

  // if only callback is passed as arg, add that on as 'onComplete' callback
  if (callback) ajaxConfig.complete = callback;

  /**
	 * merge additional request headers
	 */
  if (config.headers && !$.isEmptyObject(config.headers)) $.extend(ajaxConfig.headers, config.headers);

  var queryStart = new Date();
  var updateYasqe = function() {
    yate.lastQueryDuration = new Date() - queryStart;
    YATE.updateQueryButton(yate);
    yate.setBackdrop(false);
  };
  //Make sure the query button is updated again on complete
  var completeCallbacks = [
    function() {
      require("./main.js").signal(yate, "queryFinish", arguments);
    },
    updateYasqe
  ];

  if (ajaxConfig.complete) {
    completeCallbacks.push(ajaxConfig.complete);
  }
  ajaxConfig.complete = completeCallbacks;
  return ajaxConfig;
};

YATE.executeQuery = function(yate, callbackOrConfig) {
  YATE.signal(yate, "query", yate, callbackOrConfig);
  YATE.updateQueryButton(yate, "busy");
  yate.setBackdrop(true);
  yate.xhr = $.ajax(YATE.getAjaxConfig(yate, callbackOrConfig));
};

YATE.getUrlArguments = function(yate, config) {
  var queryMode = yate.getQueryMode();
  var data = [
    {
      name: utils.getString(yate, yate.options.sparql.queryName),
      value: config.getQueryForAjax ? config.getQueryForAjax(yate) : yate.getValue()
    }
  ];

  /**
	 * add named graphs to ajax config
	 */
  if (config.namedGraphs && config.namedGraphs.length > 0) {
    var argName = queryMode == "query" ? "named-graph-uri" : "using-named-graph-uri ";
    for (var i = 0; i < config.namedGraphs.length; i++)
      data.push({
        name: argName,
        value: config.namedGraphs[i]
      });
  }
  /**
	 * add default graphs to ajax config
	 */
  if (config.defaultGraphs && config.defaultGraphs.length > 0) {
    var argName = queryMode == "query" ? "default-graph-uri" : "using-graph-uri ";
    for (var i = 0; i < config.defaultGraphs.length; i++)
      data.push({
        name: argName,
        value: config.defaultGraphs[i]
      });
  }

  /**
	 * add additional request args
	 */
  if (config.args && config.args.length > 0) $.merge(data, config.args);

  return data;
};
var getAcceptHeader = function(yate, config) {
  var acceptHeader = null;
  if (config.acceptHeader && !config.acceptHeaderGraph && !config.acceptHeaderSelect && !config.acceptHeaderUpdate) {
    //this is the old config. For backwards compatability, keep supporting it
    if (typeof config.acceptHeader == "function") {
      acceptHeader = config.acceptHeader(yate);
    } else {
      acceptHeader = config.acceptHeader;
    }
  } else {
    if (yate.getQueryMode() == "update") {
      acceptHeader = typeof config.acceptHeader == "function"
        ? config.acceptHeaderUpdate(yate)
        : config.acceptHeaderUpdate;
    } else {
      var qType = yate.getQueryType();
      if (qType == "DESCRIBE" || qType == "CONSTRUCT") {
        acceptHeader = typeof config.acceptHeaderGraph == "function"
          ? config.acceptHeaderGraph(yate)
          : config.acceptHeaderGraph;
      } else {
        acceptHeader = typeof config.acceptHeaderSelect == "function"
          ? config.acceptHeaderSelect(yate)
          : config.acceptHeaderSelect;
      }
    }
  }
  return acceptHeader;
};

module.exports = {
  getAjaxConfig: YATE.getAjaxConfig
};
