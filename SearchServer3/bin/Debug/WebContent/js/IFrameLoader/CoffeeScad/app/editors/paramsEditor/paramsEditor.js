(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(function(require) {
    var $, Backbone, DialogView, ParamsEditor, ParamsEditorSettings, ParamsEditorView, Project, marionette, reqRes, vent, _;
    $ = require('jquery');
    _ = require('underscore');
    Backbone = require('backbone');
    marionette = require('marionette');
    vent = require('core/messaging/appVent');
    reqRes = require('core/messaging/appReqRes');
    Project = require('core/projects/project');
    ParamsEditorSettings = require('./paramsEditorSettings');
    ParamsEditorView = require('./paramsEditorView');
    DialogView = require('core/utils/dialogView');
    ParamsEditor = (function(_super) {
      __extends(ParamsEditor, _super);

      ParamsEditor.prototype.title = "ParamsEditor";

      function ParamsEditor(options) {
        this.resetEditor = __bind(this.resetEditor, this);
        this.hideView = __bind(this.hideView, this);
        this.showView = __bind(this.showView, this);
        this.onStart = __bind(this.onStart, this);
        this.init = __bind(this.init, this);
        var _ref, _ref1, _ref2;
        ParamsEditor.__super__.constructor.call(this, options);
        this.appSettings = (_ref = options.appSettings) != null ? _ref : null;
        this.settings = (_ref1 = options.settings) != null ? _ref1 : new ParamsEditorSettings();
        this.project = (_ref2 = options.project) != null ? _ref2 : new Project();
        this.vent = vent;
        this.startWithParent = true;
        this.showOnAppStart = false;
        this.addMainMenuIcon = true;
        this.icon = "icon-edit";
        this.vent.on("project:loaded", this.resetEditor);
        this.vent.on("project:created", this.resetEditor);
        this.vent.on("ParamsEditor:show", this.showView);
        this.init();
      }

      ParamsEditor.prototype.init = function() {
        return this.addInitializer(function() {
          return this.vent.trigger("app:started", "" + this.title, this);
        });
      };

      ParamsEditor.prototype.onStart = function() {
        this.settings = this.appSettings.get("ParamsEditor");
        if (this.showOnAppStart) {
          return this.showView();
        }
      };

      ParamsEditor.prototype.showView = function() {
        if (this.dia == null) {
          this.dia = new DialogView({
            elName: "paramsEdit",
            title: "Parameters",
            width: 400,
            height: 300,
            position: [250, 25]
          });
          this.dia.render();
        }
        if (this.paramsEditorView == null) {
          this.paramsEditorView = new ParamsEditorView({
            model: this.project,
            settings: this.settings
          });
        }
        if (this.dia.currentView == null) {
          return this.dia.show(this.paramsEditorView);
        } else {
          return this.dia.showDialog();
        }
      };

      ParamsEditor.prototype.hideView = function() {
        return this.dia.hideDialog();
      };

      ParamsEditor.prototype.resetEditor = function(newProject) {
        this.project = newProject;
        if (this.dia != null) {
          this.dia.close();
          this.paramsEditorView = null;
        }
        if (this.showOnAppStart) {
          return this.showView();
        }
      };

      return ParamsEditor;

    })(Backbone.Marionette.Application);
    return ParamsEditor;
  });

}).call(this);
