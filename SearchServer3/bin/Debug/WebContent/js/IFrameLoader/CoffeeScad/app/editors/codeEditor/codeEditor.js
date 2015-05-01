(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(function(require) {
    var $, Backbone, CodeEditor, CodeEditorRouter, CodeEditorSettings, CodeEditorSettingsView, CodeEditorView, DialogView, Project, marionette, reqRes, vent, _;
    $ = require('jquery');
    _ = require('underscore');
    Backbone = require('backbone');
    marionette = require('marionette');
    vent = require('core/messaging/appVent');
    reqRes = require('core/messaging/appReqRes');
    Project = require('core/projects/project');
    CodeEditorSettings = require('./codeEditorSettings');
    CodeEditorSettingsView = require('./codeEditorSettingsView');
    CodeEditorRouter = require("./codeEditorRouter");
    CodeEditorView = require('./codeEditorView');
    DialogView = require('core/utils/dialogView');
    CodeEditor = (function(_super) {
      __extends(CodeEditor, _super);

      CodeEditor.prototype.title = "CodeEditor";

      function CodeEditor(options) {
        this.resetEditor = __bind(this.resetEditor, this);
        this.hideView = __bind(this.hideView, this);
        this.showView = __bind(this.showView, this);
        this.onStart = __bind(this.onStart, this);
        this.init = __bind(this.init, this);
        var _ref, _ref1, _ref2;
        CodeEditor.__super__.constructor.call(this, options);
        this.appSettings = (_ref = options.appSettings) != null ? _ref : null;
        this.settings = (_ref1 = options.settings) != null ? _ref1 : new CodeEditorSettings();
        this.project = (_ref2 = options.project) != null ? _ref2 : new Project();
        this.vent = vent;
        this.router = new CodeEditorRouter({
          controller: this
        });
        this.startWithParent = true;
        this.showOnAppStart = true;
        this.addMainMenuIcon = true;
        this.icon = "icon-code";
        this.vent.on("project:loaded", this.resetEditor);
        this.vent.on("project:created", this.resetEditor);
        this.vent.on("CodeEditor:show", this.showView);
        this.init();
      }

      CodeEditor.prototype.init = function() {
        if (this.appSettings != null) {
          this.appSettings.registerSettingClass("CodeEditor", CodeEditorSettings);
        }
        this.addInitializer(function() {
          return this.vent.trigger("app:started", "" + this.title, this);
        });
        return reqRes.addHandler("CodeEditorSettingsView", function() {
          return CodeEditorSettingsView;
        });
      };

      CodeEditor.prototype.onStart = function() {
        this.settings = this.appSettings.get("CodeEditor");
        if (this.showOnAppStart) {
          return this.showView();
        }
      };

      CodeEditor.prototype.showView = function() {
        if (this.dia == null) {
          this.dia = new DialogView({
            elName: "codeEdit",
            title: "CodeEditor",
            width: 450,
            height: 250,
            position: [25, 125],
            dockable: true
          });
          this.dia.render();
        }
        if (this.codeEditorView == null) {
          this.codeEditorView = new CodeEditorView({
            model: this.project,
            settings: this.settings
          });
        }
        if (this.dia.currentView == null) {
          return this.dia.show(this.codeEditorView);
        } else {
          return this.dia.showDialog();
        }

        /* 
        $(document).bind('keydown', 'ctrl+a', (event)->
          console.log "I WANT TO SAVE"
          )
         */
      };

      CodeEditor.prototype.hideView = function() {
        return this.dia.hideDialog();
      };

      CodeEditor.prototype.resetEditor = function(newProject) {
        console.log("resetting code editor");
        this.project = newProject;
        if (this.dia != null) {
          this.dia.close();
          this.codeEditorView = null;
        }
        if (this.showOnAppStart) {
          return this.showView();
        }
      };

      return CodeEditor;

    })(Backbone.Marionette.Application);
    return CodeEditor;
  });

}).call(this);
