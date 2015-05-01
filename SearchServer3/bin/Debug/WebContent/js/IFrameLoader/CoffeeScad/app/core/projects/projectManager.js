(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  define(function(require) {
    var $, Backbone, Compiler, ModalRegion, Project, ProjectBrowserView, ProjectManager, Settings, marionette, reqRes, vent, _;
    $ = require('jquery');
    _ = require('underscore');
    Backbone = require('backbone');
    marionette = require('marionette');
    vent = require('core/messaging/appVent');
    reqRes = require('core/messaging/appReqRes');
    ModalRegion = require('core/utils/modalRegion');
    Settings = require('core/settings/settings');
    Project = require('core/projects/project');
    ProjectBrowserView = require('./projectBrowseView');
    Compiler = require('./compiler');
    ProjectManager = (function() {
      function ProjectManager(options) {
        this.start = __bind(this.start, this);
        this._handleReloadLast = __bind(this._handleReloadLast, this);
        this._memoizeCurrentProject = __bind(this._memoizeCurrentProject, this);
        this._handleAutoSave = __bind(this._handleAutoSave, this);
        this._setupAutoSave = __bind(this._setupAutoSave, this);
        this.onProjectSaved = __bind(this.onProjectSaved, this);
        this.onProjectLoaded = __bind(this.onProjectLoaded, this);
        this.onLoadProject = __bind(this.onLoadProject, this);
        this.onSaveProject = __bind(this.onSaveProject, this);
        this.onSaveAsProject = __bind(this.onSaveAsProject, this);
        this.onNewProject = __bind(this.onNewProject, this);
        this.compileProject = __bind(this.compileProject, this);
        this.onProjectCompileError = __bind(this.onProjectCompileError, this);
        this.onProjectCompiled = __bind(this.onProjectCompiled, this);
        this.onProjectChanged = __bind(this.onProjectChanged, this);
        this._tearDownProjectEventHandlers = __bind(this._tearDownProjectEventHandlers, this);
        this._setupProjectEventHandlers = __bind(this._setupProjectEventHandlers, this);
        this._onSettingsChanged = __bind(this._onSettingsChanged, this);
        this.onAppSettingsChanged = __bind(this.onAppSettingsChanged, this);
        var _ref, _ref1;
        options = options || {
          appSettings: null
        };
        this.appSettings = (_ref = options.appSettings) != null ? _ref : new Settings();
        this.settings = this.appSettings.getByName("General");
        this.stores = (_ref1 = options.stores) != null ? _ref1 : null;
        this.vent = vent;
        this.project = null;
        this.compiler = new Compiler();
        this.vent.on("project:new", this.onNewProject);
        this.vent.on("project:saveAs", this.onSaveAsProject);
        this.vent.on("project:save", this.onSaveProject);
        this.vent.on("project:load", this.onLoadProject);
        this.vent.on("project:loaded", this.onProjectLoaded);
        this.vent.on("project:compile", this.compileProject);
        this.appSettings.on("reset", this.onAppSettingsChanged);
      }

      ProjectManager.prototype.onAppSettingsChanged = function(model, attributes) {
        this.settings = this.appSettings.getByName("General");
        return this.settings.on("change", this._onSettingsChanged);
      };

      ProjectManager.prototype._onSettingsChanged = function(settings, value) {
        var autoSave, mode;
        mode = this.settings.get("csgCompileMode");
        if (mode === "onCodeChange" || mode === "onCodeChangeDelayed") {
          if (this.project.isCompileAdvised) {
            this.compileProject();
          }
        }
        autoSave = this.settings.autoSave;
        return this._setupAutoSave();
      };

      ProjectManager.prototype._setupProjectEventHandlers = function() {
        this.project.on("change", this.onProjectChanged);
        this.project.on("save", this.onProjectSaved);
        this.project.on("compiled", this.onProjectCompiled);
        return this.project.on("compile:error", this.onProjectCompileError);
      };

      ProjectManager.prototype._tearDownProjectEventHandlers = function() {
        this.project.off("change", this.onProjectChanged);
        this.project.off("save", this.onProjectSaved);
        this.project.off("compiled", this.onProjectCompiled);
        return this.project.off("compile:error", this.onProjectCompileError);
      };

      ProjectManager.prototype.createProject = function() {
        if (this.project != null) {
          this._tearDownProjectEventHandlers();
          this.project.compiler.project = null;
          this.project = null;
        }
        this.project = new Project({
          compiler: this.compiler
        });
        this.project.addFile({
          name: this.project.get("name") + ".coffee",
          content: "myCube = new Cube({size:20}).color([0.9,0.5,0.1])\nassembly.add(myCube)"
        });
        this.project.addFile({
          name: "config.coffee",
          content: " "
        });
        this.project._clearFlags();
        this._setupProjectEventHandlers();
        this._setupAutoSave();
        return this.project;
      };

      ProjectManager.prototype.onProjectChanged = function() {
        var callback;
        switch (this.settings.get("csgCompileMode")) {
          case "onCodeChange":
            if (this.project.isCompileAdvised) {
              return this.compileProject();
            }
            break;
          case "onCodeChangeDelayed":
            if (this.project.isCompileAdvised) {
              if (this.CodeChangeTimer) {
                clearTimeout(this.CodeChangeTimer);
                this.CodeChangeTimer = null;
              }
              callback = (function(_this) {
                return function() {
                  return _this.compileProject();
                };
              })(this);
              return this.CodeChangeTimer = setTimeout(callback, this.settings.get("csgCompileDelay") * 1000);
            }
        }
      };

      ProjectManager.prototype.onProjectCompiled = function() {
        console.log("project compile event dispatch");
        return this.vent.trigger("project:compiled", this.project);
      };

      ProjectManager.prototype.onProjectCompileError = function(compileResult) {
        return this.vent.trigger("project:compile:error", compileResult);
      };

      ProjectManager.prototype.compileProject = function() {
        console.log("compile project");
        return this.project.compile({
          backgroundProcessing: this.settings.get("csgBackgroundProcessing")
        });
      };

      ProjectManager.prototype.onNewProject = function() {
        if (this.project.isSaveAdvised) {
          return bootbox.dialog("Project is unsaved, you will loose your changes, proceed anyway?", [
            {
              label: "Ok",
              "class": "btn-inverse",
              callback: (function(_this) {
                return function() {
                  _this.createProject();
                  return _this.vent.trigger("project:created", _this.project);
                };
              })(this)
            }, {
              label: "Cancel",
              "class": "btn-inverse",
              callback: function() {}
            }
          ]);
        } else {
          this.createProject();
          return this.vent.trigger("project:created", this.project);
        }
      };

      ProjectManager.prototype.onSaveAsProject = function() {
        var modReg, projectBrowserView;
        projectBrowserView = new ProjectBrowserView({
          model: this.project,
          operation: "save",
          stores: this.stores
        });
        modReg = new ModalRegion({
          elName: "library",
          large: true
        });
        return modReg.show(projectBrowserView);
      };

      ProjectManager.prototype.onSaveProject = function() {
        var modReg, projectBrowserView;
        if (this.project.rootFolder.sync === null && this.project.dataStore === null) {
          projectBrowserView = new ProjectBrowserView({
            model: this.project,
            operation: "save",
            stores: this.stores
          });
          modReg = new ModalRegion({
            elName: "library",
            large: true
          });
          return modReg.show(projectBrowserView);
        } else {
          return this.project.save();
        }
      };

      ProjectManager.prototype.onLoadProject = function() {
        var modReg, projectBrowserView;
        projectBrowserView = new ProjectBrowserView({
          model: this.project,
          operation: "load",
          stores: this.stores
        });
        modReg = new ModalRegion({
          elName: "library",
          large: true
        });
        return modReg.show(projectBrowserView);
      };

      ProjectManager.prototype.onProjectLoaded = function(project) {
        var originalName;
        if (this.project != null) {
          this._tearDownProjectEventHandlers();
          this.project = null;
        }
        this.project = project;
        this.project.compiler = this.compiler;
        this._setupProjectEventHandlers();
        if (project.name !== "autosave") {
          this._setupAutoSave();
          return this._memoizeCurrentProject();
        } else {
          project.dataStore = null;
          project.rootFolder.sync = null;
          originalName = localStorage.getItem("autosaveOriginalProjectName");
          console.log("setting autosavedProject name to original (" + originalName + ")");
          project.name = originalName;
          this._setupAutoSave();
          return this._memoizeCurrentProject();
        }
      };

      ProjectManager.prototype.onProjectSaved = function() {
        if (this.settings.get("csgCompileMode") === "onSave") {
          this.compileProject();
        }
        return this._memoizeCurrentProject();
      };

      ProjectManager.prototype._setupAutoSave = function() {
        var saveCallback;
        if (this.autoSaveTimer != null) {
          clearInterval(this.autoSaveTimer);
        }
        if (this.settings.autoSave) {
          console.log("setting up autosave");
          saveCallback = (function(_this) {
            return function() {
              console.log("autosaving");
              localStorage.setItem("autosaveOriginalProjectName", _this.project.name);
              return _this.stores["browser"].autoSaveProject(_this.project);
            };
          })(this);
          return this.autoSaveTimer = setInterval(saveCallback, this.settings.autoSaveFrequency * 1000);
        }
      };

      ProjectManager.prototype._handleAutoSave = function() {
        var autosavedProject, showDialog;
        autosavedProject = this.stores["browser"].getProject("autosave");
        if (autosavedProject != null) {
          showDialog = (function(_this) {
            return function() {
              return bootbox.dialog("An autosave file was detected, do you want to reload it?", [
                {
                  label: "Ok",
                  "class": "btn-inverse",
                  callback: function() {
                    return _this.stores["browser"].loadProject("autosave").done(function() {
                      var error;
                      try {
                        return _this.stores["browser"].deleteProject("autosave");
                      } catch (_error) {
                        error = _error;
                      }
                    });
                  }
                }, {
                  label: "Cancel",
                  "class": "btn-inverse",
                  callback: function() {}
                }
              ]);
            };
          })(this);
          setTimeout(showDialog, 800);
          return true;
        }
        return false;
      };

      ProjectManager.prototype._memoizeCurrentProject = function() {
        if (this.project.dataStore != null) {
          console.log("Saving project " + this.project.name);
          localStorage.setItem("coffeescad_lastProjectStore", this.project.dataStore.name);
          return localStorage.setItem("coffeescad_lastProjectName", this.project.name);
        }
      };

      ProjectManager.prototype._handleReloadLast = function() {
        var lastProjectName, loadProj, storeName;
        if (this.settings.autoReloadLastProject === true) {
          lastProjectName = localStorage.getItem("coffeescad_lastProjectName");
          if (lastProjectName != null) {
            storeName = localStorage.getItem("coffeescad_lastProjectStore");
            storeName = storeName.replace("Store", "");
            console.log(storeName);
            console.log("please reload last project: " + lastProjectName + " from " + storeName);
            this.stores[storeName].loadProject(lastProjectName);
            return loadProj = (function(_this) {
              return function() {
                return _this.stores[storeName].loadProject(lastProjectName);
              };
            })(this);
          }
        }
      };

      ProjectManager.prototype.start = function() {
        console.log("starting project manager");
        if (this._handleAutoSave()) {
          return;
        }
        if (this._handleReloadLast()) {

        }
      };

      return ProjectManager;

    })();
    return ProjectManager;
  });

}).call(this);
