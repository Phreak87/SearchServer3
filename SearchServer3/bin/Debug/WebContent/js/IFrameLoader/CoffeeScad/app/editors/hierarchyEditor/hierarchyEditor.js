(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(function(require) {
    var $, Backbone, DialogView, HierarchyEditor, HierarchyEditorSettings, HierarchyEditorView, Project, marionette, reqRes, vent, _;
    $ = require('jquery');
    _ = require('underscore');
    Backbone = require('backbone');
    marionette = require('marionette');
    vent = require('core/messaging/appVent');
    reqRes = require('core/messaging/appReqRes');
    Project = require('core/projects/project');
    HierarchyEditorSettings = require('./hierarchyEditorSettings');
    HierarchyEditorView = require('./hierarchyEditorView');
    DialogView = require('core/utils/dialogView');
    HierarchyEditor = (function(_super) {
      __extends(HierarchyEditor, _super);

      HierarchyEditor.prototype.title = "HierarchyEditor";

      function HierarchyEditor(options) {
        this.resetEditor = __bind(this.resetEditor, this);
        this.hideView = __bind(this.hideView, this);
        this.showView = __bind(this.showView, this);
        this.onStart = __bind(this.onStart, this);
        this.init = __bind(this.init, this);
        var _ref, _ref1, _ref2;
        HierarchyEditor.__super__.constructor.call(this, options);
        this.appSettings = (_ref = options.appSettings) != null ? _ref : null;
        this.settings = (_ref1 = options.settings) != null ? _ref1 : new HierarchyEditorSettings();
        this.project = (_ref2 = options.project) != null ? _ref2 : new Project();
        this.vent = vent;
        this.startWithParent = true;
        this.showOnAppStart = true;
        this.addMainMenuIcon = true;
        this.icon = "icon-list";
        this.vent.on("project:loaded", this.resetEditor);
        this.vent.on("project:created", this.resetEditor);
        this.vent.on("HierarchyEditor:show", this.showView);
        this.init();
      }

      HierarchyEditor.prototype.init = function() {

        /* 
        if @appSettings?
          @appSettings.registerSettingClass("HierarchyEditor", HierarchyEditorSettings)
         */
        return this.addInitializer(function() {
          return this.vent.trigger("app:started", "" + this.title, this);
        });

        /*reqRes.addHandler "HierarchyEditorSettingsView", ()->
          return HierarchyEditorSettingsView
         */
      };

      HierarchyEditor.prototype.onStart = function() {
        this.settings = this.appSettings.get("HierarchyEditor");
        if (this.showOnAppStart) {
          return this.showView();
        }
      };

      HierarchyEditor.prototype.showView = function() {
        if (this.dia == null) {
          this.dia = new DialogView({
            elName: "hiearchyEdit",
            title: "Assembly",
            width: 200,
            height: 150,
            position: [25, 25]
          });
          this.dia.render();
        }
        if (this.hierarchyEditorView == null) {
          this.hierarchyEditorView = new HierarchyEditorView({
            model: this.project,
            settings: this.settings
          });
        }
        if (this.dia.currentView == null) {
          return this.dia.show(this.hierarchyEditorView);
        } else {
          return this.dia.showDialog();
        }
      };

      HierarchyEditor.prototype.hideView = function() {
        return this.dia.hideDialog();
      };

      HierarchyEditor.prototype.resetEditor = function(newProject) {
        console.log("resetting hiearchy editor");
        this.project = newProject;
        if (this.dia != null) {
          console.log("closing current hiearchy editor");
          this.dia.close();
          this.hierarchyEditorView = null;
        }
        if (this.showOnAppStart) {
          return this.showView();
        }
      };

      return HierarchyEditor;

    })(Backbone.Marionette.Application);
    return HierarchyEditor;
  });

}).call(this);
