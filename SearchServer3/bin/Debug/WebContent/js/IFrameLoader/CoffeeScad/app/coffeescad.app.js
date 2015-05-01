(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(function(require) {
    var $, CoffeeScadApp, KeyBindingsManager, MenuView, ModalRegion, Project, ProjectBrowserView, ProjectManager, Settings, SettingsView, marionette, vent, _;
    $ = require('jquery');
    _ = require('underscore');
    marionette = require('marionette');
    vent = require('core/messaging/appVent');
    MenuView = require('./core/menuView');
    ModalRegion = require('./core/utils/modalRegion');
    Project = require('./core/projects/project');
    ProjectBrowserView = require('./core/projects/projectBrowseView');
    ProjectManager = require('./core/projects/projectManager');
    KeyBindingsManager = require('./core/keyBindingsManager');
    Settings = require('./core/settings/settings');
    SettingsView = require('./core/settings/settingsView');
    CoffeeScadApp = (function(_super) {
      __extends(CoffeeScadApp, _super);


      /*
      Main application class, gets instanciated only once on startup
       */

      CoffeeScadApp.prototype.root = "/CoffeeSCad/index.html/";

      CoffeeScadApp.prototype.title = "Coffeescad";

      function CoffeeScadApp(options) {
        this.onInitializeAfter = __bind(this.onInitializeAfter, this);
        this.onInitializeBefore = __bind(this.onInitializeBefore, this);
        this.onProjectLoaded = __bind(this.onProjectLoaded, this);
        this.onSettingsChanged = __bind(this.onSettingsChanged, this);
        this.onSettingsShow = __bind(this.onSettingsShow, this);
        this.onAppClosing = __bind(this.onAppClosing, this);
        this.onStart = __bind(this.onStart, this);
        this._setupLanguage = __bind(this._setupLanguage, this);
        this._setupKeyboardBindings = __bind(this._setupKeyboardBindings, this);
        this.initLayout = __bind(this.initLayout, this);
        var BomExporter, BrowserStore, DropBoxStore, StlExporter, exporter, name, _ref;
        CoffeeScadApp.__super__.constructor.call(this, options);
        this.vent = vent;
        this.showMenu = true;
        this.settings = new Settings();
        this.initSettings();
        this.projectManager = new ProjectManager({
          appSettings: this.settings
        });
        this.keyBindingsManager = new KeyBindingsManager({
          appSettings: this.settings
        });
        this.editorsList = ["code", "hierarchy"];
        this.editors = {};
        this.exporters = {};
        this.stores = {};
        BomExporter = require('./exporters/bomExporter/bomExporter');
        StlExporter = require('./exporters/stlExporter/stlExporter');
        this.exporters["stl"] = new StlExporter();
        this.exporters["bom"] = new BomExporter();
        DropBoxStore = require('./stores/dropbox/dropBoxStore');
        BrowserStore = require('./stores/browser/browserStore');
        this.stores["Dropbox"] = new DropBoxStore();
        this.stores["browser"] = new BrowserStore();
        $(window).bind('beforeunload', this.onAppClosing);
        this.vent.on("app:started", this.onAppStarted);
        this.vent.on("settings:show", this.onSettingsShow);
        this.vent.on("project:loaded", this.onProjectLoaded);
        this.vent.on("project:created", this.onProjectLoaded);
        _ref = this.exporters;
        for (name in _ref) {
          exporter = _ref[name];
          this.vent.on("" + name + "Exporter:start", (function(_this) {
            return function(name) {
              return function() {
                return _this.exporters[name].start({
                  project: _this.project
                });
              };
            };
          })(this)(name));
        }
        this.initPreVisuals();
        this.initData();
        this.initLayout();
      }

      CoffeeScadApp.prototype.initLayout = function() {
        if (this.showMenu) {
          this.menuView = new MenuView({
            stores: this.stores,
            exporters: this.exporters,
            model: this.project,
            settings: this.settings
          });
          this.menuView.render();
          return this.menuView.onDomRefresh();
        } else {
          $("#header").addClass("hide");
          return $("#header").height(0);
        }
      };

      CoffeeScadApp.prototype.initSettings = function() {
        var setupSettingsBindings;
        setupSettingsBindings = (function(_this) {
          return function() {
            var mySettings;
            _this.initPreVisuals();
            mySettings = _this.settings.getByName("General");
            return mySettings.on("change", _this.onSettingsChanged);
          };
        })(this);
        return this.settings.on("reset", setupSettingsBindings);
      };

      CoffeeScadApp.prototype.initPreVisuals = function() {
        "Initialize correct theme css";
        return this.theme = this.settings.get("General").get("theme");
      };

      CoffeeScadApp.prototype.initData = function() {
        var index, store, _ref, _results;
        this.projectManager.stores = this.stores;
        this.project = this.projectManager.createProject();
        _ref = this.stores;
        _results = [];
        for (index in _ref) {
          store = _ref[index];
          _results.push(store.authCheck());
        }
        return _results;
      };

      CoffeeScadApp.prototype._setupKeyboardBindings = function() {
        return this.keyBindingsManager.setup();
      };

      CoffeeScadApp.prototype._setupLanguage = function() {
        var langCodeMap, re, urlLang;
        langCodeMap = {
          english: 'EN_EN',
          dutch: 'NL_NL',
          german: 'DE_DE'
        };
        re = /l=([^&]*)/g;
        return urlLang = "";
      };

      CoffeeScadApp.prototype.onStart = function() {
        var editorInst, editorName, _ref;
        console.log("app started");
        this._setupKeyboardBindings();
        this.visualEditor.start();
        _ref = this.editors;
        for (editorName in _ref) {
          editorInst = _ref[editorName];
          if (editorInst.startWithParent) {
            console.log("starting " + editorName + "Editor");
            editorInst.start();
          }
        }
        return this.projectManager.start();
      };

      CoffeeScadApp.prototype.onAppStarted = function(appName) {
        return console.log("I see app: " + appName + " has started");
      };

      CoffeeScadApp.prototype.onAppClosing = function() {
        if (this.project.isSaveAdvised) {
          return 'You have unsaved changes!';
        } else {
          this.stores["browser"].deleteProject("autosave");
          return localStorage.setItem("appCloseOk", true);
        }
      };

      CoffeeScadApp.prototype.onSettingsShow = function() {
        var modReg, settingsView;
        settingsView = new SettingsView({
          model: this.settings
        });
        modReg = new ModalRegion({
          elName: "settings",
          large: true
        });
        return modReg.show(settingsView);
      };

      CoffeeScadApp.prototype.onSettingsChanged = function(settings, value) {
        var key, val, _ref, _results;
        _ref = this.settings.get("General").changedAttributes();
        _results = [];
        for (key in _ref) {
          val = _ref[key];
          switch (key) {
            case "theme":
              this.theme = val;
              _results.push($("#mainTheme").attr("href", "assets/css/style/" + this.theme + "/bootstrap.css"));
              break;
            default:
              _results.push(void 0);
          }
        }
        return _results;
      };

      CoffeeScadApp.prototype.onProjectLoaded = function(newProject) {
        console.log("project loaded");
        return this.project = newProject;
      };

      CoffeeScadApp.prototype.onInitializeBefore = function() {
        var CodeEditor, HierarchyEditor, ParamsEditor, VisualEditor;
        console.log("before init");
        VisualEditor = require('./editors/visualEditor/visualEditor');
        this.visualEditor = new VisualEditor({
          regions: {
            mainRegion: "#visual"
          },
          project: this.project,
          appSettings: this.settings
        });

        /* 
        deferredList = []
         *dynamic load, problematic
            console.log "editorName",editorName
            editorPath = "./editors/#{editorName}Editor/#{editorName}Editor"
            console.log "editorPath: #{editorPath}"
            require [editorPath], (editorClass)=>
              @editors[editorName] = new editorClass
                project: @project
                appSettings: @settings
         */
        CodeEditor = require('./editors/codeEditor/codeEditor');
        this.editors['code'] = new CodeEditor({
          project: this.project,
          appSettings: this.settings
        });
        HierarchyEditor = require('./editors/hierarchyEditor/hierarchyEditor');
        this.editors['hierarchy'] = new HierarchyEditor({
          project: this.project,
          appSettings: this.settings
        });
        ParamsEditor = require('./editors/paramsEditor/paramsEditor');
        this.editors['params'] = new ParamsEditor({
          project: this.project,
          appSettings: this.settings
        });
        return this.settings.fetch();
      };

      CoffeeScadApp.prototype.onInitializeAfter = function() {
        "For exampel here close and 'please wait while app loads' display";
        console.log("after init");
        $("#initialLoader").text("");
        return $("#initialLoader").remove();
      };

      return CoffeeScadApp;

    })(Backbone.Marionette.Application);
    return CoffeeScadApp;
  });

}).call(this);
