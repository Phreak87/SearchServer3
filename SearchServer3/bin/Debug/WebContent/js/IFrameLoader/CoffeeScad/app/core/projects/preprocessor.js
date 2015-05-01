(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  define(function(require) {
    var CoffeeScript, PreProcessor, reqRes, utils;
    CoffeeScript = require('CoffeeScript');
    require('coffeelint');
    reqRes = require('core/messaging/appReqRes');
    utils = require("core/utils/utils");
    PreProcessor = (function() {
      function PreProcessor() {
        this.lintFile = __bind(this.lintFile, this);
        this.lintProject = __bind(this.lintProject, this);
        this._fetch_data = __bind(this._fetch_data, this);
        this.processIncludes = __bind(this.processIncludes, this);
        this._findMatches = __bind(this._findMatches, this);
        this._findParams = __bind(this._findParams, this);
        this.process = __bind(this.process, this);
        this._localSourceFetchHandler = __bind(this._localSourceFetchHandler, this);
        this.debug = null;
        this.project = null;
        this.includePattern = /(?!\s*?#)(?:\s*?include\s*?)(?:\(?\"([\w\//:'%~+#-.*]+)\"\)?)/g;
        this.paramsPattern = /^(\s*)?params\s*?=\s*?(\{(.|[\r\n])*?\})/g;
        this.resolvedIncludes = [];
        this.unresolvedIncludes = [];
        this.lintErrors = [];
      }

      PreProcessor.prototype._localSourceFetchHandler = function(_arg) {
        var deferred, file, path, project, result, shortName, store;
        store = _arg[0], project = _arg[1], path = _arg[2], deferred = _arg[3];
        result = "";
        if ((project == null) && (path != null)) {
          if (this.debug) {
            console.log("will fetch " + path + " from local (current project) namespace");
          }
          shortName = path;
          file = this.project.rootFolder.get(shortName);
          result = file.content;
          result = "\n" + result + "\n";
          return deferred.resolve(result);
        } else if ((project != null) && (path != null)) {
          throw new Error("non prefixed includes can only get files from current project");
        }
      };

      PreProcessor.prototype.process = function(project, coffeeToJs, lint) {
        var error, mainFile, mainFileCode, mainFileName;
        coffeeToJs = coffeeToJs || false;
        lint = lint || true;
        this.resolvedIncludes = [];
        this.resolvedIncludesFull = [];
        this.unresolvedIncludes = [];
        this.deferred = $.Deferred();
        try {
          this.project = project;
          mainFileName = this.project.name + ".coffee";
          mainFile = this.project.rootFolder.get(mainFileName);
          if (mainFile == null) {
            throw new Error("Missing main file (needs to have the same name as the project containing it)");
          }
          mainFileCode = mainFile.content;
          reqRes.addHandler("getlocalFileOrProjectCode", this._localSourceFetchHandler);
          this.patternReplacers = [];
          this.processedResult = mainFileCode;
          this.processIncludes(mainFileName, mainFileCode);
        } catch (_error) {
          error = _error;
          this.deferred.reject(error);
        }
        $.when.apply($, this.patternReplacers).done((function(_this) {
          return function() {
            if (coffeeToJs) {
              _this.processedResult = CoffeeScript.compile(_this.processedResult, {
                bare: true
              });
            }

            /*other Experiment */

            /*RequirejsParser = (require "./codeParsers").RequireJSParser
            requirejsParser = new RequirejsParser()
            
            nodes = requirejsParser.getNodes(@processedResult)
            
            deps = requirejsParser.getDependencies(nodes)
            classes = requirejsParser.getClasses(nodes)
            objects = requirejsParser.getObjects(nodes)
            functions = requirejsParser.getFunctions(nodes)
            console.log "classes",classes, "objects",objects, "functions",functions
             */

            /*
            addReplacementVisitor = onCall: (n, replaceCallback) ->
              if n.variable.base.value is "ADD"
                addOp = new nodes.Op("+", n.args[0], n.args[1])
                replaceCallback addOp
            console.log JSON.stringify nodes.expressions, null, "  "
             */

            /* 
            for include in @resolvedIncludesFull
              @processedResult.replace(include, "")
            @processedResult.replace("""include""","toto")
             */
            _this.processedResult = _this._findParams(_this.processedResult);
            return _this.deferred.resolve(_this.processedResult);
          };
        })(this));
        return this.deferred.promise();
      };

      PreProcessor.prototype._findParams = function(source) {
        var buf, char, closeBrackets, endMark, index, openBrackets, param, params, paramsSourceBlock, rawParams, results, startMark, _i, _j, _len, _len1, _ref;
        source = source || "";
        buf = "";
        openBrackets = 0;
        closeBrackets = 0;
        startMark = null;
        endMark = null;
        for (index = _i = 0, _len = source.length; _i < _len; index = ++_i) {
          char = source[index];
          buf += char;
          if (buf.indexOf("params=") !== -1 || buf.indexOf("params =") !== -1) {
            console.log("found params at", index);
            startMark = index;
            buf = "";
          }
          if (startMark !== null) {
            if (buf.indexOf("{") !== -1) {
              openBrackets += 1;
              buf = "";
            }
            if (buf.indexOf("}") !== -1) {
              closeBrackets += 1;
              buf = "";
            }
            if (openBrackets === closeBrackets && openBrackets !== 0) {
              endMark = index;
              break;
            }
          }
        }
        if (this.project.meta == null) {
          this.project.meta = {};
        }
        if (startMark !== null) {
          paramsSourceBlock = "params " + source.slice(startMark, endMark + 1);
          params = eval(paramsSourceBlock);
          results = {};
          _ref = params.fields;
          for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
            param = _ref[_j];
            results[param.name] = param["default"];
          }
          source = source.replace(paramsSourceBlock, "");
          this.project.meta.params = results;
          rawParams = eval(paramsSourceBlock);
          this.project.meta.rawParams = rawParams;
        }
        return source;
      };

      PreProcessor.prototype._findMatches = function(source) {
        var match, matches;
        source = source || "";
        matches = [];
        match = this.includePattern.exec(source);
        while (match) {
          matches.push(match);
          match = this.includePattern.exec(source);
        }
        return matches;
      };

      PreProcessor.prototype.processIncludes = function(filename, source) {
        var deferred, error, fetchResult, fullIncludePath, fullPath, includeEntry, includeeFileName, match, matches, projectName, projectSubPath, result, store, storeComponents, _i, _len;
        this.unresolvedIncludes.push(filename);
        matches = this._findMatches(source);
        for (_i = 0, _len = matches.length; _i < _len; _i++) {
          match = matches[_i];
          includeEntry = match[1];
          store = null;
          projectName = null;
          projectSubPath = null;
          fullIncludePath = includeEntry;
          if (includeEntry.indexOf(':') !== -1) {
            storeComponents = includeEntry.split(':');
            store = storeComponents[0];
            includeEntry = storeComponents[1];
          }
          if (includeEntry.indexOf('/') !== -1) {
            fullPath = includeEntry.split('/');
            projectName = fullPath[0];
            projectSubPath = fullPath.slice(1, +fullPath.length + 1 || 9e9).join('/');
          } else {
            if (includeEntry.indexOf('.') !== -1 || includeEntry.indexOf('.') === 0) {
              projectSubPath = includeEntry;
            } else {
              projectName = includeEntry;
            }
          }
          includeeFileName = fullIncludePath;
          result = "";
          if (__indexOf.call(this.unresolvedIncludes, includeeFileName) >= 0) {
            throw new Error("Circular dependency detected from " + filename + " to " + includeeFileName);
          }
          if (!(__indexOf.call(this.resolvedIncludes, includeeFileName) >= 0)) {
            try {
              deferred = $.Deferred();
              this.patternReplacers.push(deferred);
              fetchResult = this._fetch_data(store, projectName, projectSubPath, deferred);
              $.when(fetchResult).then((function(_this) {
                return function(fileContent) {
                  _this.processedResult = _this.processedResult.replace(match[0], fileContent);
                  return _this.processIncludes(includeeFileName, fileContent);
                };
              })(this));
            } catch (_error) {
              error = _error;
              throw error;
            }
            this.resolvedIncludes.push(includeeFileName);
            this.resolvedIncludesFull.push(match[0]);
          } else {
            this.processedResult = this.processedResult.replace(match[0], "");
          }
        }
        return this.unresolvedIncludes.splice(this.unresolvedIncludes.indexOf(filename), 1);
      };

      PreProcessor.prototype._fetch_data = function(store, project, path, deferred) {
        var error, fileOrProjectRequest, prefix, result;
        try {
          fileOrProjectRequest = "" + store + "/" + project + "/" + path;
          if (store === null) {
            prefix = "local";
          } else {
            prefix = store;
          }
          reqRes.request("get" + prefix + "FileOrProjectCode", [store, project, path, deferred]);
          result = deferred.promise();
          return result;
        } catch (_error) {
          error = _error;
          console.log("error: " + error);
          throw new Error("" + path + " : No such file or directory");
        }
      };

      PreProcessor.prototype.lintProject = function(project) {
        var errorInFile, file, hasError, lintErrors, _i, _len, _ref, _ref1;
        this.lintErrors = [];
        hasError = false;
        _ref = project.rootFolder.models;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          file = _ref[_i];
          _ref1 = this.lintFile(project.get("name"), file.get("name") + "." + file.get("ext"), file.get("content")), errorInFile = _ref1[0], lintErrors = _ref1[1];
          if (!hasError) {
            hasError = errorInFile;
          }
        }
        console.log("hasError " + hasError);
        return console.log(this.lintErrors);
      };

      PreProcessor.prototype.lintFile = function(projectName, fileName, source) {
        var error, hasError, lintErrors, lintingSettings, _i, _len;
        lintingSettings = {
          indentation: {
            value: 2,
            level: "error"
          },
          max_line_length: {
            value: 80,
            level: "warn"
          },
          no_tabs: {
            level: "warn"
          },
          no_trailing_whitespace: {
            level: "error"
          },
          no_trailing_semicolons: {
            level: "warn"
          }
        };
        lintErrors = coffeelint.lint(source, lintingSettings);
        hasError = false;
        for (_i = 0, _len = lintErrors.length; _i < _len; _i++) {
          error = lintErrors[_i];
          error.file = projectName + "/" + fileName;
          this.lintErrors.push(error);
          if (error.level === "error") {
            hasError = true;
          }
        }
        return [hasError, lintErrors];
      };

      return PreProcessor;

    })();
    return PreProcessor;
  });

}).call(this);
