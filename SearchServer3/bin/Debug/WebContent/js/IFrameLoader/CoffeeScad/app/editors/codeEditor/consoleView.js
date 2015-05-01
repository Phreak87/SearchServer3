(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(function(require) {
    var $, ConsoleView, consoleTemplate, marionette, vent, _;
    $ = require('jquery');
    _ = require('underscore');
    require('bootstrap');
    marionette = require('marionette');
    vent = require('core/messaging/appVent');
    consoleTemplate = require("text!./console.tmpl");
    ConsoleView = (function(_super) {
      __extends(ConsoleView, _super);

      ConsoleView.prototype.template = consoleTemplate;

      ConsoleView.prototype.className = "console";

      function ConsoleView(options) {
        this.onClose = __bind(this.onClose, this);
        this.onLintErrors = __bind(this.onLintErrors, this);
        this.onErrors = __bind(this.onErrors, this);
        this.onRender = __bind(this.onRender, this);
        this.clearConsole = __bind(this.clearConsole, this);
        this._tearDownEventHandlers = __bind(this._tearDownEventHandlers, this);
        this._setupEventHandlers = __bind(this._setupEventHandlers, this);
        ConsoleView.__super__.constructor.call(this, options);
        this.vent = vent;
        this._setupEventHandlers();
      }

      ConsoleView.prototype._setupEventHandlers = function() {
        this.model.on("compiled", this.onErrors);
        this.model.on("compile:error", this.onErrors);
        this.vent.on("file:errors", this.onLintErrors);
        this.vent.on("file:selected", this.onFileSelected);
        return this.model.on("log:messages", this.onLogEntries);
      };

      ConsoleView.prototype._tearDownEventHandlers = function() {
        this.model.off("compiled", this.onErrors);
        this.model.off("compile:error", this.onErrors);
        this.vent.off("file:errors", this.onLintErrors);
        this.vent.off("file:selected", this.onFileSelected);
        return this.model.off("log:messages", this.onLogEntries);
      };

      ConsoleView.prototype.serializeData = function() {
        return null;
      };

      ConsoleView.prototype.clearConsole = function() {
        this.$el.addClass("well");
        this.$el.removeClass("alert alert-error");
        return this.$el.html("");
      };

      ConsoleView.prototype.onRender = function() {
        return this.clearConsole();
      };

      ConsoleView.prototype.onErrors = function(compileResultData) {
        var cssClass, entry, err, errLine, errMsg, errStack, error, level, msg, msgDiv, _i, _j, _len, _len1, _ref, _ref1, _results;
        try {
          this.$el.removeClass("well");
          this.$el.html("");
          _ref = compileResultData.errors;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            error = _ref[_i];
            errLine = error.lineNumber != null ? error.lineNumber : error.location != null ? error.location.first_line : void 0;
            errMsg = error.message;
            errStack = error.stack;
            this.$el.append("<div class='alert alert-error'><b>File: line " + errLine + ":</b>  " + errMsg + "<br/>===============================================<br/><br/></div>");
          }
          _ref1 = compileResultData.logEntries;
          _results = [];
          for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
            entry = _ref1[_j];
            level = entry.lvl;
            msg = entry.msg;
            cssClass = "";
            switch (level.toLowerCase()) {
              case "warn":
                cssClass = "alert alert-warning";
                break;
              case "info":
                cssClass = "alert alert-info";
                break;
              case "error":
                cssClass = "alert alert-error";
                break;
              case "debug":
                cssClass = "alert alert-success";
            }
            msgDiv = "<div class='" + cssClass + " console-entry'><b>" + level + ":</b>" + msg + "</div>";
            _results.push(this.$el.append(msgDiv));
          }
          return _results;
        } catch (_error) {
          err = _error;
          console.log("Inner err: " + err);
          return this.$el.text("Yikes! Error displaying error:" + err);
        }
      };

      ConsoleView.prototype.onLintErrors = function(errors) {
        var err, errLine, errMsg, errStack, error, _i, _len, _results;
        try {
          _results = [];
          for (_i = 0, _len = errors.length; _i < _len; _i++) {
            error = errors[_i];
            errLine = error.message.split("line ");
            errLine = errLine[errLine.length - 1];
            errLine = error.lineNumber;
            errMsg = error.message;
            errStack = error.stack;
            _results.push(this.$el.append("<div class='alert alert-error'><b>File: line " + errLine + ":</b>  " + errMsg + "<br/>" + errStack + "<br/>===============================================<br/><br/></div>"));
          }
          return _results;
        } catch (_error) {
          err = _error;
          console.log("Inner err: " + err);
          return this.$el.text("Yikes! Error displaying error:" + err);
        }
      };

      ConsoleView.prototype.onClose = function() {
        return this._tearDownEventHandlers();
      };

      return ConsoleView;

    })(Backbone.Marionette.ItemView);
    return ConsoleView;
  });

}).call(this);
