(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(function(require) {
    var Backbone, LocalStorage, Project, StoreBase, buildProperties, merge, reqRes, utils, vent;
    Backbone = require('backbone');
    LocalStorage = require('localstorage');
    vent = require('core/messaging/appVent');
    reqRes = require('core/messaging/appReqRes');
    buildProperties = require('core/utils/buildProperties');
    utils = require('core/utils/utils');
    merge = utils.merge;
    Project = require('core/projects/project');
    StoreBase = (function(_super) {
      __extends(StoreBase, _super);

      StoreBase.prototype.idAttribute = 'name';

      StoreBase.prototype.attributeNames = ['name', 'isLogInRequired', 'loggedIn'];

      StoreBase.prototype.defaults = {
        name: "baseStore",
        storeType: "",
        storeShortName: "",
        tooltip: "Store base class",
        loggedIn: true,
        isLogginRequired: false
      };

      StoreBase.prototype.attributeNames = ['name', 'loggedIn'];

      buildProperties(StoreBase);

      function StoreBase(options) {
        this._sourceFetchHandler = __bind(this._sourceFetchHandler, this);
        this._removeFile = __bind(this._removeFile, this);
        this._addToProjectsList = __bind(this._addToProjectsList, this);
        this._removeFromProjectsList = __bind(this._removeFromProjectsList, this);
        this.loadFile = __bind(this.loadFile, this);
        this.saveFile = __bind(this.saveFile, this);
        this.renameProject = __bind(this.renameProject, this);
        this.deleteProject = __bind(this.deleteProject, this);
        this.loadProject = __bind(this.loadProject, this);
        this.saveProject = __bind(this.saveProject, this);
        this.getProjectFiles = __bind(this.getProjectFiles, this);
        this.getProject = __bind(this.getProject, this);
        this.getProjectsName = __bind(this.getProjectsName, this);
        this.logout = __bind(this.logout, this);
        this.login = __bind(this.login, this);
        var defaults;
        defaults = {
          storeType: "",
          storeShortName: "",
          storeURI: ""
        };
        options = merge(defaults, options);
        this.storeType = options.storeType, this.storeShortName = options.storeShortName, this.storeURI = options.storeURI;
        StoreBase.__super__.constructor.call(this, options);
        this.vent = vent;
        this.vent.on("" + this.storeType + ":login", this.login);
        this.vent.on("" + this.storeType + ":logout", this.logout);
        this.lib = [];
        this.projectsList = [];
        this.cachedProjects = [];
      }

      StoreBase.prototype.login = function() {
        return this.loggedIn = true;
      };

      StoreBase.prototype.logout = function() {
        return this.loggedIn = false;
      };

      StoreBase.prototype.authCheck = function() {};

      StoreBase.prototype.getProjectsName = function(callback) {};

      StoreBase.prototype.getProject = function(projectName) {};

      StoreBase.prototype.getProjectFiles = function(projectName, callback) {};

      StoreBase.prototype.saveProject = function(project, newName) {};

      StoreBase.prototype.loadProject = function(projectName, silent) {
        if (silent == null) {
          silent = false;
        }
      };

      StoreBase.prototype.deleteProject = function(projectName) {};

      StoreBase.prototype.renameProject = function(oldName, newName) {};

      StoreBase.prototype.saveFile = function(file, uri) {};

      StoreBase.prototype.loadFile = function(uri) {};


      /*--------------Private methods--------------------- */

      StoreBase.prototype._removeFromProjectsList = function(projectName) {};

      StoreBase.prototype._addToProjectsList = function(projectName) {};

      StoreBase.prototype._removeFile = function(projectName, fileName) {};

      StoreBase.prototype._sourceFetchHandler = function(_arg) {
        var file, getContent, index, namespaced, path, project, projectName, result, store, _ref, _ref1;
        store = _arg[0], projectName = _arg[1], path = _arg[2];
        if (store !== this.storeShortName) {
          throw new Error("Bad store name specified");
        }
        console.log("handler recieved " + store + "/" + projectName + "/" + path);
        result = "";
        if ((projectName == null) && (path != null)) {
          throw new Error("Cannot resolve this path in " + this.storeType);
        } else if ((projectName != null) && (path == null)) {
          console.log("will fetch project " + projectName + "'s namespace");
          project = this.getProject(projectName);
          console.log(project);
          namespaced = {};
          _ref = project.rootFolder.models;
          for (index in _ref) {
            file = _ref[index];
            namespaced[file.name] = file.content;
          }
          namespaced = "" + projectName + "={";
          _ref1 = project.rootFolder.models;
          for (index in _ref1) {
            file = _ref1[index];
            namespaced += "" + file.name + ":'" + file.content + "'";
          }
          namespaced += "}";
          return result = namespaced;
        } else if ((projectName != null) && (path != null)) {
          console.log("will fetch " + path + " from " + projectName);
          getContent = (function(_this) {
            return function(project) {
              console.log(project);
              project.rootFolder.fetch();
              file = project.rootFolder.get(path);
              result = file.content;
              result = "\n" + result + "\n";
              return result;
            };
          })(this);
          return this.loadProject(projectName, true).done(getContent);
        }
      };

      return StoreBase;

    })(Backbone.Model);
    return BrowserStore;
  });

}).call(this);
