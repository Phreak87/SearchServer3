(function() {
  define(function(require) {
    var log;
    log = {};
    log.level = 1;
    log.DEBUG = 0;
    log.INFO = 1;
    log.WARN = 2;
    log.ERROR = 3;
    log.entries = [];
    log.debug = (function(_this) {
      return function(message) {
        var lineNumber;
        if (log.level <= log.DEBUG) {
          lineNumber = (new Error()).lineNumber;
          return log.entries.push({
            lvl: "DEBUG",
            msg: "" + message,
            line: lineNumber
          });
        }
      };
    })(this);
    log.info = (function(_this) {
      return function(message) {
        var lineNumber;
        if (log.level <= log.INFO) {
          lineNumber = (new Error()).lineNumber;
          return log.entries.push({
            lvl: "INFO",
            msg: "" + message,
            line: lineNumber
          });
        }
      };
    })(this);
    log.warn = (function(_this) {
      return function(message) {
        var lineNumber;
        if (log.level <= log.WARN) {
          lineNumber = (new Error()).lineNumber;
          return log.entries.push({
            lvl: "WARN",
            msg: "" + message,
            line: lineNumber
          });
        }
      };
    })(this);
    log.error = (function(_this) {
      return function(message) {
        var lineNumber;
        if (log.level <= log.ERROR) {
          lineNumber = (new Error()).lineNumber;
          return log.entries.push({
            lvl: "ERROR",
            msg: "" + message,
            line: lineNumber
          });
        }
      };
    })(this);
    return {
      "log": log
    };
  });

}).call(this);
