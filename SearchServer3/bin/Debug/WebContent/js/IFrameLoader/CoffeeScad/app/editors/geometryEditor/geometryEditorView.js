(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(function(require) {
    var $, GeometryEditorView, jquery_layout, jquery_ui, marionette, template, vent, _;
    $ = require('jquery');
    _ = require('underscore');
    require('bootstrap');
    marionette = require('marionette');
    jquery_layout = require('jquery_layout');
    jquery_ui = require('jquery_ui');
    vent = require('core/messaging/appVent');
    template = require("text!./geometryEditorView.tmpl");
    GeometryEditorView = (function(_super) {
      __extends(GeometryEditorView, _super);

      GeometryEditorView.prototype.template = template;

      GeometryEditorView.prototype.className = "geometryEditor";

      GeometryEditorView.prototype.events = {
        "resize:start": "onResizeStart",
        "resize:stop": "onResizeStop",
        "resize": "onResizeStop"
      };

      function GeometryEditorView(options) {
        this.onRender = __bind(this.onRender, this);
        this.onResizeStop = __bind(this.onResizeStop, this);
        this.onResizeStart = __bind(this.onResizeStart, this);
        this.onDomRefresh = __bind(this.onDomRefresh, this);
        GeometryEditorView.__super__.constructor.call(this, options);
        this.settings = options.settings;
      }

      GeometryEditorView.prototype.onDomRefresh = function() {};

      GeometryEditorView.prototype.onResizeStart = function() {};

      GeometryEditorView.prototype.onResizeStop = function() {};

      GeometryEditorView.prototype.onRender = function() {};

      return GeometryEditorView;

    })(Backbone.Marionette.Layout);
    return GeometryEditorView;
  });

}).call(this);
