(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(function(require) {
    var $, Backbone, DialogView, ExampleEditor, ExampleEditorSettings, ExampleEditorView, Project, marionette, reqRes, vent, _;
    $ = require('jquery');
    _ = require('underscore');
    Backbone = require('backbone');
    marionette = require('marionette');
    vent = require('core/messaging/appVent');
    reqRes = require('core/messaging/appReqRes');
    Project = require('core/projects/project');
    ExampleEditorSettings = require('./exampleEditorSettings');
    ExampleEditorView = require('./exampleEditorView');
    DialogView = require('core/utils/dialogView');
    ExampleEditor = (function(_super) {
      __extends(ExampleEditor, _super);

      ExampleEditor.prototype.title = "exampleEditor";

      function ExampleEditor(options) {
        this.resetEditor = __bind(this.resetEditor, this);
        this.hideView = __bind(this.hideView, this);
        this.showView = __bind(this.showView, this);
        this.onStart = __bind(this.onStart, this);
        this.init = __bind(this.init, this);
        var _ref, _ref1, _ref2;
        ExampleEditor.__super__.constructor.call(this, options);
        this.appSettings = (_ref = options.appSettings) != null ? _ref : null;
        this.settings = (_ref1 = options.settings) != null ? _ref1 : new exampleEditorSettings();
        this.project = (_ref2 = options.project) != null ? _ref2 : new Project();
        this.vent = vent;
        this.startWithParent = true;
        this.showOnAppStart = true;
        this.addMainMenuIcon = true;
        this.icon = "icon-list";
        this.vent.on("project:loaded", this.resetEditor);
        this.vent.on("project:created", this.resetEditor);
        this.vent.on("exampleEditor:show", this.showView);
        this.init();
      }

      ExampleEditor.prototype.init = function() {

        /* 
        only if you want this editors settings to be displayed in the main settings view:
        BUT you need to provide a settings view of course (see other editors)
        if @appSettings?
          @appSettings.registerSettingClass("exampleEditor", ExampleEditorSettings)
         */
        return this.addInitializer(function() {
          return this.vent.trigger("app:started", "" + this.title, this);
        });

        /*reqRes.addHandler "ExampleEditorSettingsView", ()->
          return ExampleEditorSettingsView
         */
      };

      ExampleEditor.prototype.onStart = function() {
        this.settings = this.appSettings.get("ExampleEditor");
        if (this.showOnAppStart) {
          return this.showView();
        }
      };

      ExampleEditor.prototype.showView = function() {
        if (this.dia == null) {
          this.dia = new DialogView({
            elName: "exampleEdit",
            title: "My dialog",
            width: 200,
            height: 150,
            position: [25, 25]
          });
          this.dia.render();
        }
        if (this.exampleEditorView == null) {
          this.exampleEditorView = new ExampleEditorView({
            model: this.project,
            settings: this.settings
          });
        }
        if (this.dia.currentView == null) {
          return this.dia.show(this.exampleEditorView);
        } else {
          return this.dia.showDialog();
        }
      };

      ExampleEditor.prototype.hideView = function() {
        return this.dia.hideDialog();
      };

      ExampleEditor.prototype.resetEditor = function(newProject) {
        console.log("resetting example editor");
        this.project = newProject;
        if (this.dia != null) {
          console.log("closing current example editor");
          this.dia.close();
          this.exampleEditorView = null;
        }
        if (this.showOnAppStart) {
          return this.showView();
        }
      };

      return ExampleEditor;

    })(Backbone.Marionette.Application);
    return ExampleEditor;
  });

}).call(this);
