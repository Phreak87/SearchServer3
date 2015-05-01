(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(function(require) {
    var $, HierarchyEditorView, appVent, jquery_layout, jquery_ui, marionette, template, _;
    $ = require('jquery');
    _ = require('underscore');
    require('bootstrap');
    marionette = require('marionette');
    jquery_layout = require('jquery_layout');
    jquery_ui = require('jquery_ui');
    appVent = require('core/messaging/appVent');
    template = require("text!./hierarchyEditorView.tmpl");
    require('jquery_jstree');
    HierarchyEditorView = (function(_super) {
      __extends(HierarchyEditorView, _super);

      HierarchyEditorView.prototype.template = template;

      HierarchyEditorView.prototype.tagName = "ul";

      HierarchyEditorView.prototype.className = "hierarchyEditor";

      HierarchyEditorView.prototype.events = {
        "resize:start": "onResizeStart",
        "resize:stop": "onResizeStop",
        "resize": "onResizeStop"
      };

      function HierarchyEditorView(options) {
        this.onClose = __bind(this.onClose, this);
        this.render = __bind(this.render, this);
        this.onRender = __bind(this.onRender, this);
        this.onResizeStop = __bind(this.onResizeStop, this);
        this.onResizeStart = __bind(this.onResizeStart, this);
        this.onDomRefresh = __bind(this.onDomRefresh, this);
        this.onProjectCompiled = __bind(this.onProjectCompiled, this);
        this._tearDownEventHandlers = __bind(this._tearDownEventHandlers, this);
        this._setupEventHandlers = __bind(this._setupEventHandlers, this);
        HierarchyEditorView.__super__.constructor.call(this, options);
        this.settings = options.settings;
        this._setupEventHandlers();
      }

      HierarchyEditorView.prototype._setupEventHandlers = function() {
        return appVent.on("project:compiled", this.onProjectCompiled);
      };

      HierarchyEditorView.prototype._tearDownEventHandlers = function() {
        return appVent.off("project:compiled", this.onProjectCompiled);
      };

      HierarchyEditorView.prototype.onProjectCompiled = function(project) {
        this.project = project;
        return this.render();
      };

      HierarchyEditorView.prototype.onDomRefresh = function() {
        return this.$el.jstree({
          "plugins": ["themes", "html_data", "ui", "crrm"]
        });
      };

      HierarchyEditorView.prototype.onResizeStart = function() {};

      HierarchyEditorView.prototype.onResizeStop = function() {};

      HierarchyEditorView.prototype.onRender = function() {};

      HierarchyEditorView.prototype.render = function() {
        var createItem, partCounter, treeRoot;
        this.isClosed = false;
        this.triggerMethod("before:render", this);
        this.triggerMethod("item:before:render", this);
        this.$el.html("");
        if (this.project != null) {
          treeRoot = $('<ul>');
          partCounter = 0;
          createItem = (function(_this) {
            return function(rootPart, rootEl) {
              var elem, part, partClassName, partEntry, partHide, _i, _len, _ref;
              _ref = rootPart.children;
              for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                part = _ref[_i];
                elem = $('<li>');
                elem.attr('id', "parts_" + partCounter);
                if (part.realClassName != null) {
                  partClassName = part.realClassName;
                } else {
                  partClassName = part.__proto__.constructor.name;
                }
                partEntry = $('<a>').attr('href', "#").text(partClassName);
                partHide = $('<span>');
                partEntry.append(partHide);
                elem.append(partEntry);
                partCounter += 1;
                rootEl.append(createItem(part, elem));
              }
              return rootEl;
            };
          })(this);
          this.$el.append(createItem(this.project.rootAssembly, treeRoot));
        }
        this.bindUIElements();
        this.triggerMethod("render", this);
        this.triggerMethod("item:rendered", this);
        return this;
      };

      HierarchyEditorView.prototype.onClose = function() {
        this._tearDownEventHandlers();
        return this.project = null;
      };

      return HierarchyEditorView;

    })(Backbone.Marionette.ItemView);
    return HierarchyEditorView;
  });

}).call(this);
