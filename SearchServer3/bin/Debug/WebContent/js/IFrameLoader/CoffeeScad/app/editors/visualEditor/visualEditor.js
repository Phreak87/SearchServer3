(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(function(require) {
    var $, Backbone, Project, VisualEditor, VisualEditorRouter, VisualEditorSettings, VisualEditorSettingsView, VisualEditorView, marionette, reqRes, vent, _;
    $ = require('jquery');
    _ = require('underscore');
    Backbone = require('backbone');
    marionette = require('marionette');
    vent = require('core/messaging/appVent');
    reqRes = require('core/messaging/appReqRes');
    Project = require('core/projects/project');
    VisualEditorSettings = require('./visualEditorSettings');
    VisualEditorSettingsView = require('./visualEditorSettingsView');
    VisualEditorRouter = require("./visualEditorRouter");
    VisualEditorView = require('./visualEditorView');
    VisualEditor = (function(_super) {
      __extends(VisualEditor, _super);

      VisualEditor.prototype.title = "VisualEditor";

      VisualEditor.prototype.regions = {
        mainRegion: "#visual"
      };

      function VisualEditor(options) {
        this.resetEditor = __bind(this.resetEditor, this);
        this.onStart = __bind(this.onStart, this);
        this.init = __bind(this.init, this);
        var _ref, _ref1, _ref2;
        VisualEditor.__super__.constructor.call(this, options);
        this.appSettings = (_ref = options.appSettings) != null ? _ref : null;
        this.settings = (_ref1 = options.settings) != null ? _ref1 : new VisualEditorSettings();
        this.visualEditorView = null;
        this.project = (_ref2 = options.project) != null ? _ref2 : new Project();
        this.vent = vent;
        this.router = new VisualEditorRouter({
          controller: this
        });
        this.vent.on("project:loaded", this.resetEditor);
        this.vent.on("project:created", this.resetEditor);
        this.init();
        this.addRegions(this.regions);
      }

      VisualEditor.prototype.init = function() {
        if (this.appSettings != null) {
          this.appSettings.registerSettingClass("VisualEditor", VisualEditorSettings);
        }
        this.addInitializer(function() {
          return this.vent.trigger("app:started", "" + this.title, this);
        });
        return reqRes.addHandler("VisualEditorSettingsView", function() {
          return VisualEditorSettingsView;
        });
      };

      VisualEditor.prototype.onStart = function() {
        this.settings = this.appSettings.getByName("VisualEditor");
        this.visualEditorView = new VisualEditorView({
          model: this.project,
          settings: this.settings
        });
        this.visualEditorView.render();
        return this.visualEditorView.onDomRefresh();
      };

      VisualEditor.prototype.resetEditor = function(newProject) {
        this.project = newProject;
        if (this.visualEditorView != null) {
          return this.visualEditorView.switchModel(this.project);
        }

        /* 
        @mainRegion.close()
        visualEditorView = new VisualEditorView
          model:    @project
          settings: @settings
        @mainRegion.show visualEditorView
         */
      };

      return VisualEditor;

    })(Backbone.Marionette.Application);
    return VisualEditor;
  });

}).call(this);
