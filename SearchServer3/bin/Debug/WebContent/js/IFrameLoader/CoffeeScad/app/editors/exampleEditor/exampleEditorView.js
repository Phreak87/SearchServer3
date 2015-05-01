(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(function(require) {
    var $, ExampleEditorView, appVent, marionette, template, _;
    $ = require('jquery');
    _ = require('underscore');
    require('bootstrap');
    marionette = require('marionette');
    appVent = require('core/messaging/appVent');
    template = require("text!./exampleEditorView.tmpl");
    ExampleEditorView = (function(_super) {
      __extends(ExampleEditorView, _super);

      ExampleEditorView.prototype.template = template;

      ExampleEditorView.prototype.tagName = "ul";

      ExampleEditorView.prototype.className = "exampleEditor";

      ExampleEditorView.prototype.events = {
        "resize:start": "onResizeStart",
        "resize:stop": "onResizeStop",
        "resize": "onResizeStop"
      };

      function ExampleEditorView(options) {
        this.onClose = __bind(this.onClose, this);
        this.onRender = __bind(this.onRender, this);
        this.onResizeStop = __bind(this.onResizeStop, this);
        this.onResizeStart = __bind(this.onResizeStart, this);
        this.onDomRefresh = __bind(this.onDomRefresh, this);
        this.onProjectCompiled = __bind(this.onProjectCompiled, this);
        this._tearDownEventHandlers = __bind(this._tearDownEventHandlers, this);
        this._setupEventHandlers = __bind(this._setupEventHandlers, this);
        ExampleEditorView.__super__.constructor.call(this, options);
        this.settings = options.settings;
        this._setupEventHandlers();
      }

      ExampleEditorView.prototype._setupEventHandlers = function() {
        return appVent.on("project:compiled", this.onProjectCompiled);
      };

      ExampleEditorView.prototype._tearDownEventHandlers = function() {
        return appVent.off("project:compiled", this.onProjectCompiled);
      };

      ExampleEditorView.prototype.onProjectCompiled = function(project) {
        this.project = project;
        return this.render();
      };

      ExampleEditorView.prototype.onDomRefresh = function() {};

      ExampleEditorView.prototype.onResizeStart = function() {};

      ExampleEditorView.prototype.onResizeStop = function() {};

      ExampleEditorView.prototype.onRender = function() {};

      ExampleEditorView.prototype.onClose = function() {
        this._tearDownEventHandlers();
        return this.project = null;
      };

      return ExampleEditorView;

    })(Backbone.Marionette.ItemView);
    return ExampleEditorView;
  });

}).call(this);
