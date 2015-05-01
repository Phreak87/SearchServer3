(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(function(require) {
    var $, Backbone, GeometryEditor, GeometryEditorRouter, GeometryEditorSettings, GeometryEditorSettingsView, GeometryEditorView, Project, marionette, reqRes, vent, _;
    $ = require('jquery');
    _ = require('underscore');
    Backbone = require('backbone');
    marionette = require('marionette');
    vent = require('core/messaging/appVent');
    reqRes = require('core/messaging/appReqRes');
    Project = require('core/projects/project');
    GeometryEditorSettings = require('./geometryEditorSettings');
    GeometryEditorSettingsView = require('./geometryEditorSettingsView');
    GeometryEditorRouter = require("./geometryEditorRouter");
    GeometryEditorView = require('./geometryEditorView');
    GeometryEditor = (function(_super) {
      __extends(GeometryEditor, _super);

      GeometryEditor.prototype.title = "GeometryEditor";

      function GeometryEditor(options) {
        this.resetEditor = __bind(this.resetEditor, this);
        this.showRegions = __bind(this.showRegions, this);
        this.onStart = __bind(this.onStart, this);
        this.init = __bind(this.init, this);
        var _ref, _ref1, _ref2;
        GeometryEditor.__super__.constructor.call(this, options);
        this.appSettings = (_ref = options.appSettings) != null ? _ref : null;
        this.settings = (_ref1 = options.settings) != null ? _ref1 : new GeometryEditorSettings();
        this.project = (_ref2 = options.project) != null ? _ref2 : new Project();
        this.vent = vent;
        this.router = new GeometryEditorRouter({
          controller: this
        });
        this.vent.on("project:loaded", this.resetEditor);
        this.vent.on("project:created", this.resetEditor);
        this.init();
      }

      GeometryEditor.prototype.init = function() {
        if (this.appSettings != null) {
          this.appSettings.registerSettingClass("GeometryEditor", GeometryEditorSettings);
        }
        this.addInitializer(function() {
          return this.vent.trigger("app:started", "" + this.title);
        });
        return reqRes.addHandler("GeometryEditorSettingsView", function() {
          return GeometryEditorSettingsView;
        });
      };

      GeometryEditor.prototype.onStart = function() {
        return this.settings = this.appSettings.get("GeometryEditor");
      };

      GeometryEditor.prototype.showRegions = function() {
        var DialogRegion, geometryEditorView;
        DialogRegion = require('core/utils/dialogRegion');
        this.diaReg = new DialogRegion({
          elName: "geometryEdit",
          title: "GeometryEditor",
          width: 200,
          height: 150
        });
        geometryEditorView = new GeometryEditorView({
          model: this.project,
          settings: this.settings
        });
        return this.diaReg.show(geometryEditorView);
      };

      GeometryEditor.prototype.resetEditor = function(newProject) {
        console.log("resetting geometry editor");
        this.project = newProject;
        if (this.diaReg != null) {
          console.log("closing current geometry editor");
          return this.diaReg.close();
        }
      };

      return GeometryEditor;

    })(Backbone.Marionette.Application);
    return GeometryEditor;
  });

}).call(this);
